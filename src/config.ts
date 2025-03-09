import { SettingConfigElement, SettingItem } from "./types/settings";

const name = "BDiscordAI";
const DEFAULT_AI_MODEL = "gemini-2.0-flash";

export const SETTING_GOOGLE_API_KEY = "googleApiKey";
export const SETTING_AI_MODEL = "aiModel";

export const config: {
    name: string;
    settings: SettingConfigElement[];
} = {
    name,
    settings: [
        {
            type: "text",
            id: SETTING_GOOGLE_API_KEY,
            name: "Google API Key",
            value: BdApi.Data.load(name, SETTING_GOOGLE_API_KEY),
            placeholder: "API KEY"
        },
        {
            type: "dropdown",
            id: SETTING_AI_MODEL,
            name: "Model",
            note: "Select the AI model to use",
            value: BdApi.Data.load(name, SETTING_AI_MODEL) || DEFAULT_AI_MODEL,
            defaultValue: DEFAULT_AI_MODEL,
            options: [
                { label: "Gemini 2.0 Flash", value: "gemini-2.0-flash" },
                { label: "Gemini 2.0 Flash-Lite", value: "gemini-2.0-flash-lite" },
                { label: "Gemini 1.5 Flash", value: "gemini-1.5-flash" },
                { label: "Gemini 1.5 Flash-8B", value: "gemini-1.5-flash-8b" },
                { label: "Gemini 1.5 Pro", value: "gemini-1.5-pro" }
            ]
        }
    ]
};

export function getSetting<T>(id: string): T | undefined {
    return (config.settings.find((setting) => setting.id === id) as SettingItem | undefined)?.value as T | undefined;
}
