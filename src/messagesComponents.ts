import { config } from "./config";
import { DiscordComponentVisualState } from "./constants";
import { DiscordMessage, LogLevel } from "./types";

export class MessagesComponents {
    private _patches: Array<{ message: DiscordMessage; onClick: (message: DiscordMessage) => void }> = [];

    constructor(private _log: (message: string, type?: LogLevel) => void) {
        this._patchComponentData();
        this._patchComponentClick();
    }

    patchMessage(message: DiscordMessage, onClick: (message: DiscordMessage) => void) {
        if (!this._patches.some((patch) => patch.message.id === message.id)) {
            this._patches.push({ message, onClick });
        }
    }

    private _patchComponentData() {
        const moduleFilter = BdApi.Webpack.Filters.byStrings("message", "shouldDisableInteractiveComponents", "components", "children");
        const module = BdApi.Webpack.getModule<Record<string, unknown>>((module) =>
            Object.values<Function>(module).some((subModule) => moduleFilter(subModule) && subModule.toString().startsWith("function"))
        );
        const key = module ? Object.keys(module).find((key) => moduleFilter(module[key])) : undefined;

        if (!key) {
            return this._log("Fail to burst shortcut reactions");
        }
        return BdApi.Patcher.before(config.name, module, key, (_, [props]: Array<{ message: DiscordMessage }>) => {
            if (props?.message.id && props.message.components?.[0].components.length) {
                const patch = this._patches.find((patch) => patch.message.id === props.message.id);

                if (patch?.message.components?.[0].components.length) {
                    props.message.components[0].components[0] = patch.message.components[0].components[0];
                }
            }
        });
    }

    private _patchComponentClick() {
        const moduleFilter = BdApi.Webpack.Filters.byStrings("useContext", "useComponentState");
        const module = BdApi.Webpack.getModule<Record<string, unknown>>((module) =>
            Object.values<Function>(module).some((subModule) => moduleFilter(subModule) && subModule.toString().startsWith("function"))
        );
        const key = module ? Object.keys(module).find((key) => moduleFilter(module[key])) : undefined;

        if (!key) {
            return this._log("Fail to burst shortcut reaction");
        }
        return BdApi.Patcher.instead(config.name, module, key, (_, args, originalFunc) => {
            if (args[0].skuId) {
                const patch = this._patches.find((patch) => patch.message.components?.[0].components[0].skuId === args[0].skuId);

                if (patch) {
                    return {
                        executeStateUpdate: () => patch.onClick(patch.message),
                        visualState: DiscordComponentVisualState.NORMAL,
                        isDisabled: false
                    };
                }
            }
            return originalFunc(...args);
        });
    }
}
