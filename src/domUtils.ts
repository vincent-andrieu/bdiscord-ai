import { config } from "./config";

export function forceReloadMessages() {
    const instance = findInTree(
        getReactInstance(document.querySelector('main[class*="chatContent"]')),
        (e) => typeof e?.memoizedProps?.showQuarantinedUserBanner === "boolean",
        { walkable: ["return"] }
    )?.stateNode;

    if (!instance) return;
    const unpatch = BdApi.Patcher.after(config.name, instance, "render", (_this, _, ret) => {
        unpatch();
        if (!ret) return;
        ret.key = Math.random().toString(36).substring(2, 10).toUpperCase();
        ret.ref = () => _this.forceUpdate();
    });
    instance.forceUpdate();
}

function findInTree(
    tree: any,
    searchFilter: (e: any) => boolean,
    { walkable = null, ignore = [] }: { walkable?: Array<string> | null; ignore?: Array<string> } = {}
): any {
    if (typeof searchFilter === "string") {
        if (tree.hasOwnProperty(searchFilter)) return tree[searchFilter];
    } else if (searchFilter(tree)) {
        return tree;
    }

    if (typeof tree !== "object" || tree == null) return undefined;

    let tempReturn;
    if (Array.isArray(tree)) {
        for (const value of tree) {
            tempReturn = findInTree(value, searchFilter, { walkable, ignore });
            if (typeof tempReturn != "undefined") return tempReturn;
        }
    } else {
        const toWalk = walkable == null ? Object.keys(tree) : walkable;
        for (const key of toWalk) {
            if (!tree.hasOwnProperty(key) || ignore.includes(key)) continue;
            tempReturn = findInTree(tree[key], searchFilter, { walkable, ignore });
            if (typeof tempReturn != "undefined") return tempReturn;
        }
    }
    return tempReturn;
}

function getReactInstance(node: HTMLElement | null) {
    const domNode = resolveElement(node);

    if (!(domNode instanceof Element)) {
        return undefined;
    }
    // @ts-ignore
    return domNode[Object.keys(domNode).find((key) => key.startsWith("__reactInternalInstance") || key.startsWith("__reactFiber"))];
}

function resolveElement(node: any) {
    try {
        if (!(node instanceof (window as any).jQuery) && !(node instanceof Element)) return undefined;
        return node instanceof (window as any).jQuery ? node[0] : node;
    } catch {
        return node;
    }
}
