import { SettingConfigElement, SettingItem } from "./types/settings";

const name = "BDiscordAI";

export const SETTING_GOOGLE_API_KEY = "googleApiKey";

export const config: {
    name: string;
    settings: SettingConfigElement[];
} = {
    name,
    settings: [{ type: "text", id: "googleApiKey", name: "Google API Key", value: BdApi.Data.load(name, SETTING_GOOGLE_API_KEY), placeholder: "API KEY" }]
};

export function getSetting<T>(id: string): T | undefined {
    return (config.settings.find((setting) => setting.id === id) as SettingItem | undefined)?.value as T | undefined;
}
