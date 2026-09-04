import { FinishReason } from "@google/genai";
import { DiscordMessageFlags, LOG_PREFIX, PLUGIN_NAME, SUMMARY_STREAM_REFRESH_DELAY } from "./constants";
import { GeminiAi } from "./geminiAi";
import { i18n, setLocale } from "./i18n";
import { fetchMediasMetadata } from "./medias";
import { SensitiveContentGuard } from "./sensitiveContent";
import { getConfig, getSetting, saveSetting, SETTING_CHECK_UPDATES, SETTING_GOOGLE_API_KEY, SETTING_JUMP_TO_MESSAGE } from "./settings";
import { SummaryButton } from "./summaryButton";
import {
    DiscordEvent,
    DiscordEventCreateMessage,
    DiscordEventType,
    DiscordEventUpdateMessage,
    DiscordMessage,
    GuildMemberStore,
    LogLevel,
    MessageActions,
    MessageStore,
    ReadStateStore,
    SelectedChannelStore,
    SelectedGuildStore,
    UserStore
} from "./types";
import { UnreadMessage } from "./unreadMessages";
import { UpdateManager } from "./updates";
import { createMessage, generateMessageId, getErrorMessage } from "./utils";

export default class BDiscordAI {
    private _userStore?: UserStore;
    private _guildMemberStore?: GuildMemberStore;
    private _selectedGuildStore?: SelectedGuildStore;
    private _selectedChannelStore?: SelectedChannelStore;
    private _readStateStore?: ReadStateStore;
    private _messageStore?: MessageStore;
    private _messageActions?: MessageActions;
    private _fluxDispatcher: any;
    private _onEventSubscriptionCb: typeof BDiscordAI.prototype._onEvent = this._onEvent.bind(this);

    private _updateManager?: UpdateManager;
    private _summaryButton?: SummaryButton;
    private _unreadMessages?: UnreadMessage;
    private _sensitiveContentGuard?: SensitiveContentGuard;
    private _listeningEvents: Array<DiscordEventType> = [
        "CHANNEL_SELECT",
        "MESSAGE_CREATE",
        "MESSAGE_UPDATE",
        "MESSAGE_DELETE",
        "LOAD_MESSAGES_SUCCESS",
        "MESSAGE_ACK"
    ];
    private _closeApiKeyNotice?: () => void;

    start() {
        console.warn(LOG_PREFIX, "Started");
        setLocale();
        this._userStore = BdApi.Webpack.getStore<UserStore>("UserStore");
        this._guildMemberStore = BdApi.Webpack.getStore<GuildMemberStore>("GuildMemberStore");
        this._selectedGuildStore = BdApi.Webpack.getStore<SelectedGuildStore>("SelectedGuildStore");
        this._selectedChannelStore = BdApi.Webpack.getStore<SelectedChannelStore>("SelectedChannelStore");
        this._readStateStore = BdApi.Webpack.getStore("ReadStateStore");
        this._messageStore = BdApi.Webpack.getStore<MessageStore>("MessageStore");
        this._messageActions = BdApi.Webpack.getByKeys("jumpToMessage", "_sendMessage");
        this._fluxDispatcher = BdApi.Webpack.getByKeys("dispatch", "subscribe", { searchExports: true });

        this._updateManager = new UpdateManager(this._log.bind(this));
        this._summaryButton = new SummaryButton(this._log.bind(this), this._summarize.bind(this));
        this._unreadMessages = new UnreadMessage(
            this._selectedGuildStore,
            this._guildMemberStore,
            this._selectedChannelStore,
            this._readStateStore,
            this._messageStore,
            this._messageActions
        );
        this._sensitiveContentGuard = new SensitiveContentGuard(this._log.bind(this), {
            userStore: this._userStore,
            guildMemberStore: this._guildMemberStore,
            selectedGuildStore: this._selectedGuildStore,
            selectedChannelStore: this._selectedChannelStore,
            messageStore: this._messageStore
        });

        this._subscribeEvents();
        this._enableSummaryButtonIfNeeded();

        if (!getSetting<string>(SETTING_GOOGLE_API_KEY).trim().length) {
            this._showAddApiKeyNotice();
        } else {
            new GeminiAi(this._log.bind(this)).purgeMedias().catch((error) => console.error(LOG_PREFIX, "Failed to purge medias", error));
        }

        if (getSetting<boolean>(SETTING_CHECK_UPDATES)) {
            this._updateManager.ask();
        }
    }

    stop() {
        this._summaryButton?.toggle(false);
        this._closeApiKeyNotice?.();
        this._closeApiKeyNotice = undefined;
        this._sensitiveContentGuard?.stop();

        this._unsubscribeEvents();
        BdApi.Patcher.unpatchAll(PLUGIN_NAME);
        this._updateManager?.cancel();
        console.warn(LOG_PREFIX, "Stopped");
    }

    getSettingsPanel() {
        return BdApi.UI.buildSettingsPanel({
            settings: getConfig().settings,
            onChange: (_category, id, value) => {
                saveSetting(id, value);
                if (this._closeApiKeyNotice && id === SETTING_GOOGLE_API_KEY) {
                    this._closeApiKeyNotice();
                    this._closeApiKeyNotice = undefined;
                }
            }
        });
    }

    private _log(message: string, type: LogLevel = "error"): void {
        const logMessage = `${LOG_PREFIX} ${message}`;

        BdApi.UI.showToast(logMessage, { type: type === "warn" ? "warning" : type });
        if (type !== "success") {
            console[type](logMessage);
        } else {
            console.log(logMessage);
        }
    }

    private _showAddApiKeyNotice(): void {
        this._closeApiKeyNotice = BdApi.UI.showNotice(`${LOG_PREFIX} ${i18n.API_KEY_NOTICE}`, {
            type: "warning",
            buttons: [
                {
                    label: i18n.ADD,
                    onClick: () =>
                        BdApi.UI.showConfirmationModal(
                            `${PLUGIN_NAME} Settings`,
                            BdApi.React.createElement("div", {
                                className: "bd-addon-settings-wrap",
                                children: this.getSettingsPanel()
                            }),
                            { className: "bd-addon-modal", size: "bd-modal-medium", cancelText: null, confirmText: i18n.DONE }
                        )
                }
            ]
        });
    }

    private _subscribeEvents() {
        this._listeningEvents.forEach((event) => this._fluxDispatcher.subscribe(event, this._onEventSubscriptionCb));
    }

    private _unsubscribeEvents(): void {
        this._listeningEvents.forEach((event) => this._fluxDispatcher.unsubscribe(event, this._onEventSubscriptionCb));
    }

    private _onEvent(event: DiscordEvent) {
        const selectedChannelId = this._selectedChannelStore?.getCurrentlySelectedChannelId();

        if (!selectedChannelId) return;
        try {
            switch (event.type) {
                case "MESSAGE_CREATE":
                    if (event.channelId === selectedChannelId) {
                        this._enableSummaryButtonIfNeeded(selectedChannelId);
                    }
                    this._sensitiveContentGuard?.handleMessage((event as DiscordEventCreateMessage).message);
                    break;

                case "MESSAGE_UPDATE":
                    this._sensitiveContentGuard?.handleMessage((event as DiscordEventUpdateMessage).message);
                    break;

                case "CHANNEL_SELECT":
                    if (event.channelId === selectedChannelId) {
                        this._sensitiveContentGuard?.markChannelVisited(selectedChannelId);
                    }
                // falls through

                case "LOAD_MESSAGES_SUCCESS":
                    if (event.channelId === selectedChannelId) {
                        // Medias posted before the channel was opened are checked too, not only the incoming ones
                        this._sensitiveContentGuard?.handleChannelMessages(selectedChannelId);
                    }
                // falls through

                case "MESSAGE_DELETE":
                case "MESSAGE_ACK":
                    if (event.channelId === selectedChannelId) {
                        this._enableSummaryButtonIfNeeded(selectedChannelId);
                    }
                    break;
                default:
                    console.warn(LOG_PREFIX, "Unknown event", event);
                    break;
            }
        } catch (error) {
            this._log(getErrorMessage(error));
        }
    }

    private _enableSummaryButtonIfNeeded(channelId?: string) {
        setTimeout(() => {
            if (this._unreadMessages) {
                const enable = this._unreadMessages.hasUnreadMessages(channelId);

                this._summaryButton?.toggle(enable);
            }
        }, 0);
    }

    private async _summarize(abortSignal: AbortSignal) {
        if (!this._selectedGuildStore || !this._selectedChannelStore || !this._unreadMessages || !this._userStore || !this._messageActions)
            throw new Error("Fail to get stores");
        const guildId = this._selectedGuildStore.getGuildId();
        const channelId = this._selectedChannelStore.getCurrentlySelectedChannelId();

        if (!channelId) throw new Error("Fail to get metadata");
        const { referenceMessage, unreadMessages } = await this._unreadMessages.getUnreadMessages(channelId);
        const user = this._userStore.getCurrentUser();

        if (!unreadMessages.length) throw new Error(i18n.NO_UNREAD_MESSAGES);
        const failedMediasMetadata = await fetchMediasMetadata(unreadMessages);
        if (failedMediasMetadata.length) {
            this._log("Failed to fetch medias metadata");
            console.error(LOG_PREFIX, failedMediasMetadata);
        }

        const model = new GeminiAi(this._log.bind(this));
        const summaryStream = await model.summarizeMessages(guildId || "@me", channelId, unreadMessages, abortSignal);
        const previousMessageId = unreadMessages[unreadMessages.length - 1].id;
        let message: DiscordMessage | undefined = undefined;
        let lastRefreshTime = 0;
        let isRefreshPending = false;

        for await (const chunk of summaryStream) {
            if (abortSignal.aborted) break;
            const finishReason = chunk.candidates?.[0]?.finishReason;
            const chunkText = chunk.text;

            if (finishReason && finishReason !== FinishReason.STOP) {
                this._log(`${i18n.SUMMARY_INCOMPLETE} (${finishReason})`, "warn");
            }
            if (!chunkText?.length) continue;
            if (message) {
                message.content += chunkText;
                isRefreshPending = true;

                // Throttled to avoid re-rendering the whole message list on every chunk
                if (Date.now() - lastRefreshTime >= SUMMARY_STREAM_REFRESH_DELAY) {
                    this._refreshMessageContent(message);
                    lastRefreshTime = Date.now();
                    isRefreshPending = false;
                }
            } else {
                const messageId = generateMessageId(previousMessageId);

                message = createMessage({
                    guildId,
                    channelId,
                    id: messageId,
                    author: user,
                    content: chunkText,
                    flags: DiscordMessageFlags.EPHEMERAL,
                    reply: this._messageStore?.getMessage(channelId, referenceMessage)
                });

                this._messageActions.receiveMessage(channelId, message, true, { messageReference: message.messageReference });
                lastRefreshTime = Date.now();
                if (getSetting<boolean>(SETTING_JUMP_TO_MESSAGE)) {
                    try {
                        this._messageActions.jumpToMessage({ channelId, messageId: message.id, skipLocalFetch: true });
                    } catch (error) {
                        this._log(getErrorMessage(error));
                    }
                }
            }
        }

        if (message && isRefreshPending) {
            this._refreshMessageContent(message);
        }
        // Keeps the partial summary on screen but reports the cancellation to the button
        abortSignal.throwIfAborted();
    }

    /**
     * Discord drops an optimistic MESSAGE_CREATE as soon as the message id is already in the channel, so calling
     * receiveMessage again only updates the local object and never the rendered message. The streamed chunks have to go
     * through MESSAGE_UPDATE instead, which merges the new content into the existing record.
     */
    private _refreshMessageContent(message: DiscordMessage): void {
        this._fluxDispatcher.dispatch({
            type: "MESSAGE_UPDATE",
            channelId: message.channel_id,
            message
        });
    }
}
