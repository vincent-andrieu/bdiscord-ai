import {
    LOG_PREFIX,
    PLUGIN_NAME,
    SENSITIVE_CACHE_KEY,
    SENSITIVE_CACHE_MAX_ENTRIES,
    SENSITIVE_CACHE_SAVE_DEBOUNCE,
    SENSITIVE_RELOAD_DEBOUNCE,
    SENSITIVE_SCAN_MAX_MESSAGES
} from "./constants";
import { forceReloadMessages } from "./domUtils";
import { GeminiAi } from "./geminiAi";
import { fetchMediasMetadata } from "./medias";
import {
    getSetting,
    SETTING_ARACHNOPHOBIA_MODE,
    SETTING_EMETOPHOBIA_MODE,
    SETTING_EPILEPSY_MODE,
    SETTING_SENSITIVE_PANIC_MODE,
    SETTING_SEXUALITY_MODE
} from "./settings";
import {
    DiscordMessage,
    DiscordMessageEmbed,
    GuildMemberStore,
    LogLevel,
    MessageStore,
    SelectedChannelStore,
    SelectedGuildStore,
    SensitiveVerdict,
    UserStore
} from "./types";
import { getErrorMessage, hashString, isAbortError, mapMessages, stripUrlQuery } from "./utils";

const NOT_SENSITIVE: SensitiveVerdict = { isEmetophobia: false, isArachnophobia: false, isEpileptic: false, isSexual: false };

type MessageBackup = { attachments: Record<string, boolean>; embeds: Array<DiscordMessageEmbed> };

type SensitiveStores = {
    userStore: UserStore;
    guildMemberStore: GuildMemberStore;
    selectedGuildStore: SelectedGuildStore;
    selectedChannelStore: SelectedChannelStore;
    messageStore: MessageStore;
};

/**
 * Hides medias the user does not want to see. Verdicts are cached on disk so a message is only ever sent to the model
 * once, which is what makes scanning a whole channel on open affordable.
 */
export class SensitiveContentGuard {
    private _visitedChannels = new Set<string>();
    /** Cache keys currently being checked, to avoid sending the same message twice at once. */
    private _pendingChecks = new Set<string>();
    /** Cache keys whose check failed: not persisted, but not retried for the rest of the session either. */
    private _failedChecks = new Set<string>();
    private _verdicts = new Map<string, SensitiveVerdict>();
    private _backups = new Map<string, MessageBackup>();
    private _abortController?: AbortController;
    private _reloadTimeout?: ReturnType<typeof setTimeout>;
    private _saveTimeout?: ReturnType<typeof setTimeout>;

    private get _isEnabled(): boolean {
        return (
            getSetting<boolean>(SETTING_EMETOPHOBIA_MODE) ||
            getSetting<boolean>(SETTING_ARACHNOPHOBIA_MODE) ||
            getSetting<boolean>(SETTING_EPILEPSY_MODE) ||
            getSetting<boolean>(SETTING_SEXUALITY_MODE)
        );
    }

    constructor(
        private _log: (message: string, type?: LogLevel) => void,
        private _stores: SensitiveStores
    ) {
        this._verdicts = loadVerdicts();
    }

    markChannelVisited(channelId: string): void {
        this._visitedChannels.add(channelId);
    }

    /** Entry point for `MESSAGE_CREATE` and `MESSAGE_UPDATE`. */
    handleMessage(message: DiscordMessage): void {
        if (!this._visitedChannels.has(message.channel_id)) return;
        this._check([message]);
    }

    /**
     * Entry point when a channel is displayed. Medias already posted before the user opened the channel used to never
     * be checked at all.
     */
    handleChannelMessages(channelId: string): void {
        if (!this._visitedChannels.has(channelId)) return;
        const messages = this._stores.messageStore.getMessages(channelId).toArray();

        // Newest first: what the user is actually looking at is cleared before the messages further up
        this._check(messages.slice(-SENSITIVE_SCAN_MAX_MESSAGES).reverse());
    }

    stop(): void {
        this._abortController?.abort();
        this._abortController = undefined;
        if (this._reloadTimeout) {
            clearTimeout(this._reloadTimeout);
            this._reloadTimeout = undefined;
        }
        this._pendingChecks.clear();
        this._failedChecks.clear();
        this._backups.clear();
        this._visitedChannels.clear();
        this._flushVerdicts();
    }

    private _check(messages: Array<DiscordMessage>): void {
        if (!this._isEnabled) return;
        const currentUserId = this._stores.userStore.getCurrentUser().id;
        const candidates = messages.filter((message) => message.author.id !== currentUserId && hasCheckableMedia(message));

        if (!candidates.length) return;
        const unknownMessages: Array<DiscordMessage> = [];

        for (const message of candidates) {
            const cacheKey = getCacheKey(message);
            const verdict = this._verdicts.get(cacheKey);

            if (verdict) {
                // Already known: no request at all, the message is hidden again straight away
                this._touchVerdict(cacheKey, verdict);
                this._applyVerdict(message, verdict);
            } else if (!this._pendingChecks.has(cacheKey) && !this._failedChecks.has(cacheKey)) {
                this._pendingChecks.add(cacheKey);
                unknownMessages.push(message);
            }
        }

        if (unknownMessages.length) {
            this._checkWithModel(unknownMessages).catch((error) => {
                if (!isAbortError(error)) {
                    this._log(getErrorMessage(error));
                }
            });
        }
    }

    private async _checkWithModel(messages: Array<DiscordMessage>): Promise<void> {
        const panicMode = getSetting<boolean>(SETTING_SENSITIVE_PANIC_MODE);
        const abortSignal = this._getAbortSignal();
        /** Messages still waiting for their own answer, so a rollback never touches the ones already resolved. */
        const awaitingMessages = new Map(messages.map((message) => [message.id, message]));
        let failedCount = 0;

        if (panicMode) {
            messages.forEach((message) => this._hide(message));
        }

        try {
            const mappedMessages = mapMessages(
                { selectedGuildStore: this._stores.selectedGuildStore, guildMemberStore: this._stores.guildMemberStore },
                messages
            );

            await fetchMediasMetadata(mappedMessages);
            await new GeminiAi(this._log).checkSensitiveContent(
                mappedMessages,
                (result) => {
                    const message = awaitingMessages.get(result.messageId);

                    if (!message) return;
                    awaitingMessages.delete(result.messageId);
                    if (result.hasFailed) {
                        failedCount++;
                        this._markFailed(message);
                    } else {
                        // Cached even without a verdict (nothing analysable): otherwise the message would be sent
                        // again on every channel re-open and burn the quota.
                        const verdict = result.verdict || NOT_SENSITIVE;

                        this._verdicts.set(getCacheKey(message), verdict);
                        this._applyVerdict(message, verdict);
                    }
                },
                abortSignal
            );

            if (failedCount) {
                this._log(`Failed to check ${failedCount} message(s) for sensitive content`, "warn");
            }
            this._scheduleSave();
        } catch (error) {
            // Only the messages that never got an answer are rolled back, the resolved ones keep their verdict
            awaitingMessages.forEach((message) => this._markFailed(message));
            throw error;
        } finally {
            messages.forEach((message) => this._pendingChecks.delete(getCacheKey(message)));
        }
    }

    /** A check that did not happen is never cached as safe, it is only kept out of the retries for this session. */
    private _markFailed(message: DiscordMessage): void {
        this._failedChecks.add(getCacheKey(message));
        this._reveal(message);
    }

    /** Re-inserting moves the entry to the end, so the eviction drops what has not been seen for the longest time. */
    private _touchVerdict(cacheKey: string, verdict: SensitiveVerdict): void {
        this._verdicts.delete(cacheKey);
        this._verdicts.set(cacheKey, verdict);
    }

    private _applyVerdict(message: DiscordMessage, verdict: SensitiveVerdict): void {
        if (this._isSensitive(verdict)) {
            this._hide(message);
            // The message stays hidden for good, there is nothing left to restore
            this._backups.delete(message.id);
        } else {
            this._reveal(message);
        }
    }

    private _isSensitive(verdict: SensitiveVerdict): boolean {
        return (
            (getSetting<boolean>(SETTING_EMETOPHOBIA_MODE) && verdict.isEmetophobia) ||
            (getSetting<boolean>(SETTING_ARACHNOPHOBIA_MODE) && verdict.isArachnophobia) ||
            (getSetting<boolean>(SETTING_EPILEPSY_MODE) && verdict.isEpileptic) ||
            (getSetting<boolean>(SETTING_SEXUALITY_MODE) && verdict.isSexual)
        );
    }

    private _hide(message: DiscordMessage): void {
        const storedMessage = this._stores.messageStore.getMessage(message.channel_id, message.id);

        if (!storedMessage || this._backups.has(storedMessage.id)) return;
        const backup: MessageBackup = { attachments: {}, embeds: storedMessage.embeds ? [...storedMessage.embeds] : [] };
        let hasChanged = !!storedMessage.embeds?.length;

        storedMessage.attachments?.forEach((attachment) => {
            backup.attachments[attachment.id] = attachment.spoiler;
            hasChanged = hasChanged || !attachment.spoiler;
            attachment.spoiler = true;
        });
        storedMessage.embeds = [];
        this._backups.set(storedMessage.id, backup);
        if (hasChanged) {
            this._scheduleReload(storedMessage.channel_id);
        }
    }

    private _reveal(message: DiscordMessage): void {
        const backup = this._backups.get(message.id);

        if (!backup) return;
        this._backups.delete(message.id);
        const storedMessage = this._stores.messageStore.getMessage(message.channel_id, message.id);

        if (!storedMessage) return;
        storedMessage.attachments?.forEach((attachment) => (attachment.spoiler = backup.attachments[attachment.id] ?? false));
        storedMessage.embeds = backup.embeds;
        this._scheduleReload(storedMessage.channel_id);
    }

    private _getAbortSignal(): AbortSignal {
        if (!this._abortController || this._abortController.signal.aborted) {
            this._abortController = new AbortController();
        }
        return this._abortController.signal;
    }

    private _scheduleReload(channelId: string): void {
        if (this._reloadTimeout || this._stores.selectedChannelStore.getCurrentlySelectedChannelId() !== channelId) return;
        this._reloadTimeout = setTimeout(() => {
            this._reloadTimeout = undefined;
            forceReloadMessages();
        }, SENSITIVE_RELOAD_DEBOUNCE);
    }

    private _scheduleSave(): void {
        if (this._saveTimeout) return;
        this._saveTimeout = setTimeout(() => this._flushVerdicts(), SENSITIVE_CACHE_SAVE_DEBOUNCE);
    }

    private _flushVerdicts(): void {
        if (this._saveTimeout) {
            clearTimeout(this._saveTimeout);
            this._saveTimeout = undefined;
        }
        // Oldest entries first: dropping from the start keeps the most recently checked messages
        const entries = Array.from(this._verdicts.entries()).slice(-SENSITIVE_CACHE_MAX_ENTRIES);

        this._verdicts = new Map(entries);
        try {
            BdApi.Data.save(PLUGIN_NAME, SENSITIVE_CACHE_KEY, Object.fromEntries(entries));
        } catch (error) {
            console.error(LOG_PREFIX, "Failed to save the sensitive content cache", error);
        }
    }
}

function loadVerdicts(): Map<string, SensitiveVerdict> {
    try {
        const stored = BdApi.Data.load<Record<string, SensitiveVerdict>>(PLUGIN_NAME, SENSITIVE_CACHE_KEY);

        return new Map(Object.entries(stored || {}));
    } catch (error) {
        console.error(LOG_PREFIX, "Failed to load the sensitive content cache", error);
        return new Map();
    }
}

/**
 * An edited message can carry different medias, so the verdict is keyed by the medias themselves and not only by the
 * message id. Embed urls are stripped of their query string: Discord re-signs them, and a key built on the raw url
 * would miss the cache every time the channel is loaded again.
 */
function getCacheKey(message: DiscordMessage): string {
    const signature = [
        ...(message.attachments?.map((attachment) => attachment.id) || []),
        ...(message.embeds?.map((embed) => stripUrlQuery(embed.image?.url || embed.video?.url || embed.url || "")) || [])
    ].join("|");

    return `${message.id}:${hashString(signature)}`;
}

/** Mirrors what `mapMessages` is able to extract: an embed without any image or video has nothing to check. */
function hasCheckableMedia(message: DiscordMessage): boolean {
    const hasVisibleAttachment = !!message.attachments?.some((attachment) => !attachment.spoiler);
    const hasMediaEmbed = !!message.embeds?.some((embed) => embed.image || embed.video || embed.thumbnail);

    return hasVisibleAttachment || hasMediaEmbed;
}
