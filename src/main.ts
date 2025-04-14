import { DiscordMessageFlags, LOG_PREFIX } from "./constants";
import { forceReloadMessages } from "./domUtils";
import { GeminiAi } from "./geminiAi";
import { i18n, setLocale } from "./i18n";
import { fetchMediasMetadata } from "./medias";
import {
    getConfig,
    getSetting,
    SETTING_ARACHNOPHOBIA_MODE,
    SETTING_CHECK_UPDATES,
    SETTING_EMETOPHOBIA_MODE,
    SETTING_EPILEPSY_MODE,
    SETTING_GOOGLE_API_KEY,
    SETTING_JUMP_TO_MESSAGE,
    SETTING_SENSITIVE_PANIC_MODE,
    SETTING_SEXUALITY_MODE
} from "./settings";
import { SummaryButton } from "./summaryButton";
import {
    DiscordEvent,
    DiscordEventCreateMessage,
    DiscordEventType,
    DiscordEventUpdateMessage,
    DiscordMessage,
    DiscordMessageEmbed,
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
import { createMessage, generateMessageId, mapMessages } from "./utils";

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
    private _listeningEvents: Array<DiscordEventType> = [
        "CHANNEL_SELECT",
        "MESSAGE_CREATE",
        "MESSAGE_UPDATE",
        "MESSAGE_DELETE",
        "LOAD_MESSAGES_SUCCESS",
        "MESSAGE_ACK"
    ];
    private _isSensitiveMessageCheck = new Set<string>();
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
        this._fluxDispatcher = BdApi.Webpack.getByKeys("actionLogger");

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

        this._subscribeEvents();
        this._enableSummaryButtonIfNeeded();

        if (!getSetting<string>(SETTING_GOOGLE_API_KEY)?.trim().length) {
            this._showAddApiKeyNotice();
        } else {
            new GeminiAi(this._log.bind(this)).purgeMedias();
        }

        if (getSetting<boolean>(SETTING_CHECK_UPDATES)) {
            this._updateManager.ask();
        }
    }

    stop() {
        this._summaryButton?.toggle(false);
        this._closeApiKeyNotice?.();
        this._closeApiKeyNotice = undefined;
        this._isSensitiveMessageCheck.clear();

        this._unsubscribeEvents();
        BdApi.Patcher.unpatchAll(getConfig().name);
        this._updateManager?.cancel();
        console.warn(LOG_PREFIX, "Stopped");
    }

    getSettingsPanel() {
        return BdApi.UI.buildSettingsPanel({
            settings: getConfig().settings,
            onChange: (_category, id, value) => {
                BdApi.Data.save(getConfig().name, id, value);
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
                            `${getConfig().name} Settings`,
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
                    this._checkSensitiveContent((event as DiscordEventCreateMessage).message);
                    break;

                case "MESSAGE_UPDATE":
                    this._checkSensitiveContent((event as DiscordEventUpdateMessage).message);
                    break;

                case "CHANNEL_SELECT":
                case "MESSAGE_DELETE":
                case "LOAD_MESSAGES_SUCCESS":
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
            this._log(typeof error === "string" ? error : (error as Error).message);
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

    private async _summarize() {
        if (!this._selectedGuildStore || !this._selectedChannelStore || !this._unreadMessages || !this._userStore || !this._messageActions)
            throw "Fail to get stores";
        const guildId = this._selectedGuildStore.getGuildId();
        const channelId = this._selectedChannelStore.getCurrentlySelectedChannelId();
        const { referenceMessage, previousMessages, unreadMessages } = await this._unreadMessages.getUnreadMessages(channelId);
        const user = this._userStore.getCurrentUser();

        if (!channelId) throw "Fail to get metadata";
        const failedMediasMetadata = await fetchMediasMetadata(unreadMessages);
        if (failedMediasMetadata.length) {
            this._log("Failed to fetch medias metadata");
            console.error(LOG_PREFIX, failedMediasMetadata);
        }

        const model = new GeminiAi(this._log);
        const summary = await model.summarizeMessages(previousMessages, unreadMessages);
        const previousMessageId = unreadMessages[unreadMessages.length - 1].id;
        let message: DiscordMessage | undefined = undefined;

        for await (const chunk of summary.stream) {
            const chunkText = chunk.text();

            if (message) {
                message.content += chunkText;
                this._messageActions.receiveMessage(channelId, message, true, { messageReference: message.messageReference });
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
                if (getSetting<boolean>(SETTING_JUMP_TO_MESSAGE)) {
                    this._messageActions.jumpToMessage({ channelId, messageId: message.id, skipLocalFetch: true });
                }
            }
        }
    }

    private async _checkSensitiveContent(discordMessage: DiscordMessage) {
        const panicMode = getSetting<boolean>(SETTING_SENSITIVE_PANIC_MODE);
        const settingEmetophobia = getSetting<boolean>(SETTING_EMETOPHOBIA_MODE);
        const settingArachnophobia = getSetting<boolean>(SETTING_ARACHNOPHOBIA_MODE);
        const settingEpilepsy = getSetting<boolean>(SETTING_EPILEPSY_MODE);
        const settingSexuality = getSetting<boolean>(SETTING_SEXUALITY_MODE);
        const backup: { attachments: Record<string, boolean>; embeds: Array<DiscordMessageEmbed> } = { attachments: {}, embeds: [] };

        if (!settingEmetophobia && !settingArachnophobia && !settingEpilepsy && !settingSexuality) return;
        if (!this._userStore || !this._selectedGuildStore || !this._guildMemberStore) throw "Fail to get stores";
        if (
            this._userStore.getCurrentUser().id === discordMessage.author.id ||
            ((!discordMessage.attachments?.length || discordMessage.attachments.every((attachment) => attachment.spoiler)) &&
                !discordMessage.embeds?.length) ||
            this._isSensitiveMessageCheck.has(discordMessage.id)
        )
            return;

        const toggleSensitiveContent = (toggle: boolean) => {
            const sensitiveMessage = this._messageStore?.getMessage(discordMessage.channel_id, discordMessage.id);

            if (sensitiveMessage) {
                if (toggle) {
                    sensitiveMessage.attachments?.forEach((attachment) => {
                        backup.attachments[attachment.id] = attachment.spoiler;
                        attachment.spoiler = true;
                    });
                    if (sensitiveMessage.embeds?.length) {
                        backup.embeds = [...sensitiveMessage.embeds];
                        sensitiveMessage.embeds = [];
                    }
                } else {
                    sensitiveMessage.attachments?.forEach((attachment) => (attachment.spoiler = backup.attachments[attachment.id] ?? false));
                    sensitiveMessage.embeds = backup.embeds;
                }
                if (this._selectedChannelStore?.getCurrentlySelectedChannelId() === sensitiveMessage.channel_id) {
                    forceReloadMessages();
                }
            }
        };

        this._isSensitiveMessageCheck.add(discordMessage.id);
        if (panicMode) {
            toggleSensitiveContent(true);
        }
        const messages = mapMessages({ selectedGuildStore: this._selectedGuildStore, guildMemberStore: this._guildMemberStore }, [discordMessage]);
        await fetchMediasMetadata(messages);
        const isSensitive = await new GeminiAi(this._log).isSensitiveContent(messages);

        if (
            (settingEmetophobia && isSensitive?.isEmetophobia) ||
            (settingArachnophobia && isSensitive?.isArachnophobia) ||
            (settingEpilepsy && isSensitive?.isEpileptic) ||
            (settingSexuality && isSensitive?.isSexual)
        ) {
            if (!panicMode) {
                toggleSensitiveContent(true);
            }
        } else if (panicMode) {
            toggleSensitiveContent(false);
        }
    }
}
