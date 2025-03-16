import { en } from "./en";
import { fr } from "./fr";

const DEFAULT_LOCALE = "fr";

type I18n = typeof fr | typeof en;

export let i18n: I18n;

setLocale(DEFAULT_LOCALE);

export function setLocale(locale: string = getDiscordLocale()) {
    switch (locale) {
        case "en-US":
        case "en-GB":
            i18n = en;
            break;
        case "fr":
            i18n = fr;
            break;
        default:
            i18n = fr;
            break;
    }
}

function getDiscordLocale() {
    const localeStore = BdApi.Webpack.getStore("LocaleStore");

    return localeStore.locale;
}
