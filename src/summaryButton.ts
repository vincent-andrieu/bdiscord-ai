import { LOG_PREFIX } from "./constants";
import { i18n } from "./i18n";
import { aiStarsIcon } from "./icons/aiStars";
import { getSetting, SETTING_GOOGLE_API_KEY } from "./settings";
import { LogLevel } from "./types";
import { getErrorMessage, isAbortError } from "./utils";

type ReactRoot = { render(element: unknown): void; unmount(): void };

export class SummaryButton {
    private _id = "summary-button";
    private _enabled = false;
    private _isLoading = false;
    private _node?: HTMLElement;
    private _root?: ReactRoot;
    private _removeListener?: () => void;
    private _abortController?: AbortController;

    constructor(
        private _log: (message: string, type?: LogLevel) => void,
        private _onClick: (abortSignal: AbortSignal) => Promise<void>
    ) {}

    toggle(value?: boolean): void {
        if ((value || (value === undefined && !this._enabled)) && !getSetting<string>(SETTING_GOOGLE_API_KEY).length) {
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
        const toolbar = document.querySelector('[class*="toolbar"]');

        if (!toolbar) {
            console.error(LOG_PREFIX, "Toolbar not found");
            return;
        }
        const node = document.createElement("div");

        node.id = this._id;
        node.style.margin = "0 8px";

        toolbar.insertBefore(node, toolbar.firstChild);
        this._node = node;
        this._root = BdApi.ReactDOM.createRoot(node);
        this._root?.render(this._renderButton());
        this._removeListener = BdApi.DOM.onRemoved(node, this._onNodeRemoved.bind(this));
    }

    private _renderButton() {
        return BdApi.React.createElement(BdApi.Components.Button, {
            children: [
                BdApi.React.createElement("div", { dangerouslySetInnerHTML: { __html: aiStarsIcon }, style: { marginRight: "4px" } }),
                this._isLoading ? i18n.SUMMARY_BUTTON_STOP : i18n.SUMMARY_BUTTON
            ],
            size: "bd-button-small",
            color: this._isLoading ? "bd-button-color-red" : undefined,
            onClick: () => this._handleClick()
        });
    }

    private _handleClick(): void {
        if (this._isLoading) {
            // A second click while streaming stops the generation instead of doing nothing
            this._abortController?.abort();
            return;
        }
        this._summarize();
    }

    private async _summarize(): Promise<void> {
        const abortController = new AbortController();

        this._abortController = abortController;
        this._isLoading = true;
        this._refresh();

        try {
            await this._onClick(abortController.signal);
            this.toggle(false);
        } catch (error) {
            if (isAbortError(error) || abortController.signal.aborted) {
                this._log(i18n.SUMMARY_CANCELLED, "warn");
            } else if (typeof error === "string" || error instanceof Error) {
                this._log(getErrorMessage(error));
            } else {
                console.error(LOG_PREFIX, error);
            }
        } finally {
            this._abortController = undefined;
            this._isLoading = false;
            this._refresh();
        }
    }

    /**
     * Discord re-renders its toolbar regularly. The stale React root has to be released, otherwise every re-render
     * leaks a root and a DOM observer.
     */
    private _onNodeRemoved(): void {
        this._disposeRoot();
        this._add();
    }

    private _refresh() {
        if (this._root) {
            this._root.render(this._renderButton());
        } else {
            this._add();
        }
    }

    private _remove() {
        const node = this._node ?? document.getElementById(this._id);

        this._disposeRoot();
        node?.remove();
    }

    private _disposeRoot() {
        const root = this._root;

        this._removeListener?.();
        this._removeListener = undefined;
        this._root = undefined;
        this._node = undefined;
        // Unmounting synchronously from a React event handler triggers a warning, so it is deferred
        if (root) {
            setTimeout(() => root.unmount(), 0);
        }
    }
}
