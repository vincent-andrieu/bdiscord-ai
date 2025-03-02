import { aiStarsIcon } from "./icons/aiStars";

export class SummaryButton {
    private _id = "summary-button";
    private _enabled = true;

    constructor(
        private _onClick: () => void,
        private _log: (message: string) => void
    ) {}

    public toggle() {
        this._enabled = !this._enabled;
    }

    public add() {
        if (!this._enabled) return;
        const toolbar = document.querySelector('[class^="toolbar__"]');

        if (!toolbar) {
            return this._log("Toolbar not found");
        }
        const button = BdApi.React.createElement(BdApi.Components.Button, {
            children: [BdApi.React.createElement("div", { dangerouslySetInnerHTML: { __html: aiStarsIcon }, style: { marginRight: "4px" } }), "Résumer"],
            size: "bd-button-small",
            onClick: this._onClick
        });
        const node = document.createElement("div");
        node.id = this._id;
        node.style.margin = "0 8px";

        toolbar.insertBefore(node, toolbar.firstChild);
        BdApi.ReactDOM.render(button, node);

        BdApi.DOM.onRemoved(node, this.add.bind(this));
    }

    public remove() {
        this._enabled = false;

        const element = document.getElementById(this._id);
        if (element) {
            BdApi.ReactDOM.unmountComponentAtNode(element);
            element.remove();
        }
    }
}
