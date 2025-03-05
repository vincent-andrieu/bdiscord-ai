import { fr } from "./fr";

const LOCALE = "fr";

type I18n = typeof fr;

export function i18n(name: keyof I18n): string {
    switch (LOCALE) {
        case "fr":
            return fr[name] || name;
        default:
            return name;
    }
}
