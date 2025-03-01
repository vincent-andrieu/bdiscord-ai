// import { GoogleGenerativeAI } from "@google/generative-ai";
import { aiStarsIcon } from "./icons/aiStars";
import { Message } from "./types";
import { SettingConfigElement } from "./types/settings";

const name = "BDiscordAI";
const config: {
    name: string;
    settings: SettingConfigElement[];
} = {
    name,
    settings: [{ type: "text", id: "googleApiKey", name: "Google API Key", value: BdApi.Data.load(name, "googleApiKey"), placeholder: "API KEY" }]
};

export default class BDiscordAI {
    private _logPrefix = `[${config.name}]`;
    private _displaySummaryButton = false;

    start() {
        console.warn(this._logPrefix, "Started");

        this._addSummaryButton();
    }

    stop() {
        this._removeSummaryButton();

        console.warn(this._logPrefix, "Stopped");
    }

    getSettingsPanel() {
        // console.log(GoogleGenerativeAI);
        return BdApi.UI.buildSettingsPanel({
            settings: config.settings,
            onChange: (_category, id, value) => BdApi.Data.save(config.name, id, value)
        });
    }

    private _log(message: string): void {
        const logMessage = `${this._logPrefix} ${message}`;

        BdApi.UI.showToast(logMessage, { type: "error" });
        return console.error(logMessage);
    }

    private _addSummaryButton() {
        if (!this._displaySummaryButton) return;
        const toolbar = document.querySelector('[class^="toolbar__"]');

        if (!toolbar) {
            return this._log("Toolbar not found");
        }
        const button = BdApi.React.createElement(BdApi.Components.Button, {
            children: [BdApi.React.createElement("div", { dangerouslySetInnerHTML: { __html: aiStarsIcon }, style: { marginRight: "4px" } }), "Résumer"],
            size: "bd-button-small",
            onClick: () => this._summarize()
        });
        const node = document.createElement("div");
        node.id = "summary-button";
        node.style.margin = "0 8px";

        toolbar.insertBefore(node, toolbar.firstChild);
        BdApi.ReactDOM.render(button, node);

        BdApi.DOM.onRemoved(node, this._addSummaryButton.bind(this));
    }

    private _removeSummaryButton() {
        this._displaySummaryButton = false;

        const element = document.getElementById("summary-button");
        if (element) {
            BdApi.ReactDOM.unmountComponentAtNode(element);
            element.remove();
        }
    }

    private _summarize() {
        const SelectedChannelStore = BdApi.Webpack.getStore("SelectedChannelStore");
        const ReadStateStore = BdApi.Webpack.getStore("ReadStateStore");
        const MessageStore = BdApi.Webpack.getStore("MessageStore");
        const UserStore = BdApi.Webpack.getStore("UserStore");
        const GuildMemberStore = BdApi.Webpack.getStore("GuildMemberStore");

        const channelId = SelectedChannelStore.getChannelId();
        if (!channelId) {
            return this._log("No channel selected");
        }

        const channelReadState = ReadStateStore.getReadStatesByChannel()[channelId];
        const unreadCount: number | undefined = channelReadState?.unreadCount;

        if (unreadCount === undefined) {
            return this._log("Failed to get unread messages count");
        }

        if (channelReadState.oldestUnreadMessageId) {
            const guildId = channelReadState.guildId;
            const unreadMessages = MessageStore.getMessages(channelId).filter((message: any) => message.id >= channelReadState.oldestUnreadMessageId);
            const guildMembersNicks: Record<string, string> = {};
            const messages: Message[] = unreadMessages.map((message: any) => {
                if (!guildMembersNicks[message.author.id]) {
                    const member = GuildMemberStore.getMember(guildId, message.author.id);

                    guildMembersNicks[message.author.id] = member?.nick;
                    if (!guildMembersNicks[message.author.id]) {
                        guildMembersNicks[message.author.id] = UserStore.getUser(message.author.id)?.globalName;
                    }
                }

                return {
                    author: {
                        id: message.author.id,
                        username: guildMembersNicks[message.author.id] || message.author.username
                    },
                    content: message.content
                };
            });

            console.warn("messages", messages);
        }
    }
}
