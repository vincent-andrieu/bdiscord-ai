// import { GoogleGenerativeAI } from "@google/generative-ai";
import { SummaryButton } from "./summaryButton";
import { LogLevel } from "./types";
import { DiscordEvent, DiscordEventType } from "./types/discord";
import { SettingConfigElement } from "./types/settings";
import { SelectedChannelStore } from "./types/stores";
import { UnreadMessage } from "./unreadMessages";

const name = "BDiscordAI";
const config: {
    name: string;
    settings: SettingConfigElement[];
} = {
    name,
    settings: [{ type: "text", id: "googleApiKey", name: "Google API Key", value: BdApi.Data.load(name, "googleApiKey"), placeholder: "API KEY" }]
};
const LOG_PREFIX = `[${config.name}]`;

export default class BDiscordAI {
    private _selectedChannelStore: SelectedChannelStore = BdApi.Webpack.getStore("SelectedChannelStore");
    private _fluxDispatcher: any;
    private _onEventSubscriptionCb: typeof BDiscordAI.prototype._onEvent = this._onEvent.bind(this);

    private _summaryButton?: SummaryButton;
    private _unreadMessages?: UnreadMessage;
    private _listeningEvents: Array<DiscordEventType> = ["CHANNEL_SELECT", "MESSAGE_CREATE", "MESSAGE_DELETE", "LOAD_MESSAGES_SUCCESS", "MESSAGE_ACK"];

    start() {
        console.warn(LOG_PREFIX, "Started");
        this._fluxDispatcher = BdApi.Webpack.getByKeys("actionLogger");

        this._summaryButton = new SummaryButton(this._log.bind(this), this._summarize.bind(this));
        this._unreadMessages = new UnreadMessage(this._log.bind(this));

        this._subscribeEvents();
        this._enableSummaryButtonIfNeeded();
    }

    stop() {
        this._summaryButton?.toggle(false);

        this._unsubscribeEvents();
        console.warn(LOG_PREFIX, "Stopped");
    }

    getSettingsPanel() {
        // console.log(GoogleGenerativeAI);
        return BdApi.UI.buildSettingsPanel({
            settings: config.settings,
            onChange: (_category, id, value) => BdApi.Data.save(config.name, id, value)
        });
    }

    private _log(message: string, type: LogLevel = "error"): void {
        const logMessage = `${LOG_PREFIX} ${message}`;

        BdApi.UI.showToast(logMessage, { type: type === "warn" ? "warning" : "error" });
        console[type](logMessage);
    }

    private _subscribeEvents() {
        this._listeningEvents.forEach((event) => this._fluxDispatcher.subscribe(event, this._onEventSubscriptionCb));
    }

    private _unsubscribeEvents(): void {
        this._listeningEvents.forEach((event) => this._fluxDispatcher.unsubscribe(event, this._onEventSubscriptionCb));
    }

    private _onEvent(event: DiscordEvent) {
        const selectedChannelId = this._selectedChannelStore.getCurrentlySelectedChannelId();

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
