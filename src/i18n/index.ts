import { fr } from "./fr";

const LOCALE = "fr";

type I18n = typeof fr;

export let i18n: I18n;

export function setLocale(locale: string = LOCALE) {
    switch (locale) {
        case "fr":
            i18n = fr;
            break;
        default:
            i18n = fr;
            break;
    }
}

setLocale();
