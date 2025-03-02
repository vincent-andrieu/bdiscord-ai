// import { GoogleGenerativeAI } from "@google/generative-ai";
import { SummaryButton } from "./summaryButton";
import { LogLevel } from "./types";
import { SettingConfigElement } from "./types/settings";
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
    private _fluxDispatcher: any;

    private _summaryButton?: SummaryButton;
    private _unreadMessages?: UnreadMessage;

    start() {
        console.warn(LOG_PREFIX, "Started");
        this._fluxDispatcher = BdApi.Webpack.getByKeys("actionLogger");

        this._summaryButton = new SummaryButton(this._summarize.bind(this), this._log.bind(this));
        this._unreadMessages = new UnreadMessage(this._log.bind(this));

        this._listenUnreadMessages();
        this._summaryButton.add();
    }

    stop() {
        this._summaryButton?.remove();

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

    private _listenUnreadMessages() {
        function onNewMessage(event: string) {
            console.log("New message received:", event);
        }

        function onChannelSelect(event: string) {
            console.log("Channel selected:", event);
        }

        this._fluxDispatcher.subscribe("MESSAGE_CREATE", onNewMessage);
        this._fluxDispatcher.subscribe("CHANNEL_SELECT", onChannelSelect);
    }

    private async _summarize() {
        const unreadMessages = await this._unreadMessages?.getUnreadMessages();

        console.warn("unreadMessages", unreadMessages);
    }
}
