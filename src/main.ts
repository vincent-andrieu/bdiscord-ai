// import { GoogleGenerativeAI } from "@google/generative-ai";
import { aiStarsIcon } from "./icons/aiStars";
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
    private _stop = true;

    start() {
        console.warn(this._logPrefix, "Started");
        this._stop = false;
        this._addSummaryButton();
    }

    stop() {
        this._stop = true;

        const element = document.getElementById("summary-button");
        if (element) {
            BdApi.ReactDOM.unmountComponentAtNode(element);
            element.remove();
        }

        console.warn(this._logPrefix, "Stopped");
    }

    getSettingsPanel() {
        // console.log(GoogleGenerativeAI);
        return BdApi.UI.buildSettingsPanel({
            settings: config.settings,
            onChange: (_category, id, value) => BdApi.Data.save(config.name, id, value)
        });
    }

    private _addSummaryButton() {
        if (this._stop) return;
        const toolbar = document.querySelector('[class^="toolbar__"]');

        if (!toolbar) {
            BdApi.UI.showToast(this._logPrefix + " Toolbar not found", { type: "error" });
            return console.error(this._logPrefix + " Toolbar not found");
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

    private _summarize() {
        BdApi.UI.showToast("Résumé !", { type: "info" });
    }
}
