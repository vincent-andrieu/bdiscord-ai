export function getOldestId(a: string | undefined, b: string): string;
export function getOldestId(a: string, b?: string): string;
export function getOldestId(a: string, b: string): string;
export function getOldestId(a?: string, b?: string): string | undefined;
export function getOldestId(a?: string, b?: string): string | undefined {
    if (!a && !b) {
        return undefined;
    }

    if (!a) {
        return b;
    }
    if (!b) {
        return a;
    }
    if (a.length === b.length) {
        return a < b ? a : b;
    }
    return a.length < b.length ? a : b;
}
