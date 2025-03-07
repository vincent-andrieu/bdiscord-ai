import { getSetting, SETTING_GOOGLE_API_KEY } from "./config";
import { aiStarsIcon } from "./icons/aiStars";

export class SummaryButton {
    private _id = "summary-button";
    private _enabled = false;
    private _isLoading = false;

    constructor(
        private _log: (message: string) => void,
        private _onClick: () => Promise<void>
    ) {}

    public toggle(value?: boolean): void {
        if ((value || (value === undefined && !this._enabled)) && !getSetting(SETTING_GOOGLE_API_KEY)?.length) {
            return;
        }

        if (value !== undefined) {
            this._enabled = value;
        } else {
            this._enabled = !this._enabled;
        }

        if (this._enabled) {
            this._add();
        } else {
            this._remove();
        }
    }

    private _add() {
        if (!this._enabled || document.getElementById(this._id)) return;
        const toolbar = document.querySelector('[class^="toolbar__"]');

        if (!toolbar) {
            return this._log("Toolbar not found");
        }
        const button = BdApi.React.createElement(BdApi.Components.Button, {
            children: [BdApi.React.createElement("div", { dangerouslySetInnerHTML: { __html: aiStarsIcon }, style: { marginRight: "4px" } }), "Résumer"],
            size: "bd-button-small",
            disabled: this._isLoading,
            style: { cursor: this._isLoading ? "wait" : undefined },
            onClick: async () => {
                if (this._isLoading) return;
                this._isLoading = true;
                this._refresh();

                try {
                    await this._onClick();
                    this.toggle(false);
                } finally {
                    this._isLoading = false;
                    this._refresh();
                }
            }
        });
        const node = document.createElement("div");
        node.id = this._id;
        node.style.margin = "0 8px";

        toolbar.insertBefore(node, toolbar.firstChild);
        BdApi.ReactDOM.render(button, node);

        BdApi.DOM.onRemoved(node, this._add.bind(this));
    }

    private _remove() {
        const element = document.getElementById(this._id);

        if (element) {
            BdApi.ReactDOM.unmountComponentAtNode(element);
            element.remove();
        }
    }

    private _refresh() {
        this._remove();
        this._add();
    }
}
