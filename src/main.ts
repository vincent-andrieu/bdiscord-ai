import { config, SETTING_GOOGLE_API_KEY } from "./config";
import { GeminiAi } from "./geminiAi";
import { i18n } from "./i18n";
import { SummaryButton } from "./summaryButton";
import {
    DiscordEvent,
    DiscordEventType,
    GuildMemberStore,
    LogLevel,
    MessageActions,
    SelectedChannelStore,
    SelectedGuildStore,
    SettingItem,
    UserStore
} from "./types";
import { UnreadMessage } from "./unreadMessages";

const LOG_PREFIX = `[${config.name}]`;

export default class BDiscordAI {
    private _userStore?: UserStore;
    private _guildMemberStore?: GuildMemberStore;
    private _selectedGuildStore?: SelectedGuildStore;
    private _selectedChannelStore?: SelectedChannelStore;
    private _messageActions?: MessageActions;
    private _fluxDispatcher: any;
    private _onEventSubscriptionCb: typeof BDiscordAI.prototype._onEvent = this._onEvent.bind(this);

    private _summaryButton?: SummaryButton;
    private _unreadMessages?: UnreadMessage;
    private _listeningEvents: Array<DiscordEventType> = ["CHANNEL_SELECT", "MESSAGE_CREATE", "MESSAGE_DELETE", "LOAD_MESSAGES_SUCCESS", "MESSAGE_ACK"];
    private _closeApiKeyNotice?: () => void;

    start() {
        console.warn(LOG_PREFIX, "Started");
        this._userStore = BdApi.Webpack.getStore<UserStore>("UserStore");
        this._guildMemberStore = BdApi.Webpack.getStore<GuildMemberStore>("GuildMemberStore");
        this._selectedGuildStore = BdApi.Webpack.getStore<SelectedGuildStore>("SelectedGuildStore");
        this._selectedChannelStore = BdApi.Webpack.getStore<SelectedChannelStore>("SelectedChannelStore");
        this._messageActions = BdApi.Webpack.getByKeys("jumpToMessage", "_sendMessage");
        this._fluxDispatcher = BdApi.Webpack.getByKeys("actionLogger");

        this._summaryButton = new SummaryButton(this._log.bind(this), this._summarize.bind(this));
        this._unreadMessages = new UnreadMessage(
            this._selectedGuildStore,
            this._guildMemberStore,
            this._selectedChannelStore,
            this._messageActions,
            this._log.bind(this)
        );

        this._subscribeEvents();
        this._enableSummaryButtonIfNeeded();

        if (!BdApi.Data.load<string | undefined>(config.name, SETTING_GOOGLE_API_KEY)?.trim().length) {
            this._showAddApiKeyNotice();
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
        const unreadMessages = await this._unreadMessages?.getUnreadMessages();

        console.warn("unreadMessages", unreadMessages);
    }
}
