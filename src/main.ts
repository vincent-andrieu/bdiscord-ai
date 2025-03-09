import { config, getSetting, SETTING_GOOGLE_API_KEY } from "./config";
import { DiscordMessageFlags, LOG_PREFIX } from "./constants";
import { GeminiAi } from "./geminiAi";
import { i18n } from "./i18n";
import { fetchMediasMetadata } from "./medias";
import { SummaryButton } from "./summaryButton";
import {
    DiscordEvent,
    DiscordEventType,
    GuildMemberStore,
    LogLevel,
    MessageActions,
    MessageStore,
    SelectedChannelStore,
    SelectedGuildStore,
    SettingItem,
    UserStore
} from "./types";
import { UnreadMessage } from "./unreadMessages";
import { createMessage } from "./utils";

export default class BDiscordAI {
    private _userStore?: UserStore;
    private _guildMemberStore?: GuildMemberStore;
    private _selectedGuildStore?: SelectedGuildStore;
    private _selectedChannelStore?: SelectedChannelStore;
    private _messageStore?: MessageStore;
    private _messageActions?: MessageActions;
    private _fluxDispatcher: any;
    private _onEventSubscriptionCb: typeof BDiscordAI.prototype._onEvent = this._onEvent.bind(this);

    private _summaryButton?: SummaryButton;
    private _unreadMessages?: UnreadMessage;
    private _listeningEvents: Array<DiscordEventType> = [
        "CHANNEL_SELECT",
        "MESSAGE_CREATE",
        "MESSAGE_DELETE",
        "LOAD_MESSAGES_SUCCESS",
        "MESSAGE_ACK"
    ];
    private _closeApiKeyNotice?: () => void;

    start() {
        console.warn(LOG_PREFIX, "Started");
        this._userStore = BdApi.Webpack.getStore<UserStore>("UserStore");
        this._guildMemberStore = BdApi.Webpack.getStore<GuildMemberStore>("GuildMemberStore");
        this._selectedGuildStore = BdApi.Webpack.getStore<SelectedGuildStore>("SelectedGuildStore");
        this._selectedChannelStore = BdApi.Webpack.getStore<SelectedChannelStore>("SelectedChannelStore");
        this._messageStore = BdApi.Webpack.getStore<MessageStore>("MessageStore");
        this._messageActions = BdApi.Webpack.getByKeys("jumpToMessage", "_sendMessage");
        this._fluxDispatcher = BdApi.Webpack.getByKeys("actionLogger");

        this._summaryButton = new SummaryButton(this._log.bind(this), this._summarize.bind(this));
        this._unreadMessages = new UnreadMessage(
            this._selectedGuildStore,
            this._guildMemberStore,
            this._selectedChannelStore,
            this._messageStore,
            this._messageActions,
            this._log.bind(this)
        );

        this._subscribeEvents();
        this._enableSummaryButtonIfNeeded();

        if (!getSetting<string>(SETTING_GOOGLE_API_KEY)?.trim().length) {
            this._showAddApiKeyNotice();
        } else {
            new GeminiAi(this._log).purgeMedias();
        }
    }

    stop() {
        this._summaryButton?.toggle(false);
        this._closeApiKeyNotice?.();

        this._unsubscribeEvents();
        console.warn(LOG_PREFIX, "Stopped");
    }

    getSettingsPanel() {
        return BdApi.UI.buildSettingsPanel({
            settings: config.settings,
            onChange: (_category, id, value) => {
                const setting = config.settings.find((setting) => setting.type !== "category" && setting.id === id) as SettingItem | undefined;

                if (setting) {
                    setting.value = value;
                }
                BdApi.Data.save(config.name, id, value);
                if (this._closeApiKeyNotice && id === SETTING_GOOGLE_API_KEY) {
                    this._closeApiKeyNotice();
                    this._closeApiKeyNotice = undefined;
                }
            }
        });
    }

    private _log(message: string, type: LogLevel = "error"): void {
        const logMessage = `${LOG_PREFIX} ${message}`;

        BdApi.UI.showToast(logMessage, { type: type === "warn" ? "warning" : "error" });
        console[type](logMessage);
    }

    private _showAddApiKeyNotice(): void {
        this._closeApiKeyNotice = BdApi.UI.showNotice(`${LOG_PREFIX} Aucune clée API Google n'est configurée`, {
            type: "warning",
            buttons: [
                {
                    label: "Ajouter",
                    onClick: () =>
                        BdApi.UI.showConfirmationModal(
                            `${config.name} Settings`,
                            BdApi.React.createElement("div", {
                                className: "bd-addon-settings-wrap",
                                children: this.getSettingsPanel()
                            }),
                            { className: "bd-addon-modal", size: "bd-modal-medium", cancelText: null, confirmText: i18n("done") }
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
        switch (event.type) {
            case "CHANNEL_SELECT":
            case "MESSAGE_CREATE":
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
        const unreadMessages = await this._unreadMessages.getUnreadMessages(channelId);
        const user = this._userStore.getCurrentUser();

        if (!channelId) throw "Fail to get metadata";
        await fetchMediasMetadata(unreadMessages.messages);

        const iaModel = new GeminiAi(this._log);
        const summary = await iaModel.summarizeMessages(unreadMessages.messages);
        const previousMessageId = unreadMessages.messages[unreadMessages.messages.length - 1].id;
        const message = createMessage(
            guildId,
            channelId,
            previousMessageId,
            user,
            summary,
            DiscordMessageFlags.EPHEMERAL,
            unreadMessages.referenceMessage
        );

        this._messageActions.receiveMessage(channelId, message);
        this._messageActions.jumpToMessage({ channelId, messageId: message.id, skipLocalFetch: true });
        if (this._messageStore) {
            this._messageStore.getMessages(channelId).get(message.id).messageReference = message.messageReference;
        }
    }
}
