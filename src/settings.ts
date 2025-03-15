import { SettingConfigElement } from "./types/settings";

const name = "BDiscordAI";
const DEFAULT_AI_MODEL = "gemini-2.0-flash";

export const SETTING_GOOGLE_API_KEY = "googleApiKey";
export const SETTING_AI_MODEL = "aiModel";
export const SETTING_JUMP_TO_MESSAGE = "jumpToMessage";
export const SETTING_EMETOPHOBIA_MODE = "emetophobiaMode";
export const SETTING_ARACHNOPHOBIA_MODE = "arachnophobiaMode";
export const SETTING_EPILEPSY_MODE = "epilepsyMode";
export const SETTING_SEXUALITY_MODE = "sexualityMode";
export const SETTING_SENSITIVE_PANIC_MODE = "sensitivePanicMode";

export const config: {
    name: string;
    settings: Array<SettingConfigElement>;
} = {
    name,
    settings: [
        {
            type: "category",
            id: "aiModel",
            name: "AI Model",
            collapsible: true,
            shown: true,
            settings: [
                {
                    type: "text",
                    id: SETTING_GOOGLE_API_KEY,
                    name: "Google API Key",
                    value: BdApi.Data.load(name, SETTING_GOOGLE_API_KEY) || "",
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
                },
                {
                    type: "switch",
                    id: SETTING_JUMP_TO_MESSAGE,
                    name: "Auto scroll",
                    value: BdApi.Data.load(name, SETTING_JUMP_TO_MESSAGE) || true,
                    defaultValue: true,
                    note: "Scroll automatiquement sur le message quand il est généré"
                }
            ]
        },
        {
            type: "category",
            id: "sensitive",
            name: "Contenu sensible",
            collapsible: true,
            shown: false,
            settings: [
                {
                    type: "switch",
                    id: SETTING_EMETOPHOBIA_MODE,
                    name: "Émétophobie",
                    value: BdApi.Data.load(name, SETTING_EMETOPHOBIA_MODE) || false,
                    defaultValue: false,
                    note: "Active le spoiler pour les fichiers et désactive les images/vidéos embeded"
                },
                {
                    type: "switch",
                    id: SETTING_ARACHNOPHOBIA_MODE,
                    name: "Arachnophobie",
                    value: BdApi.Data.load(name, SETTING_ARACHNOPHOBIA_MODE) || false,
                    defaultValue: false,
                    note: "Active le spoiler pour les fichiers et désactive les images/vidéos embeded"
                },
                {
                    type: "switch",
                    id: SETTING_EPILEPSY_MODE,
                    name: "Épilepsie",
                    value: BdApi.Data.load(name, SETTING_EPILEPSY_MODE) || false,
                    defaultValue: false,
                    note: "Active le spoiler pour les fichiers et désactive les images/vidéos embeded"
                },
                {
                    type: "switch",
                    id: SETTING_SEXUALITY_MODE,
                    name: "Sexualité",
                    value: BdApi.Data.load(name, SETTING_SEXUALITY_MODE) || false,
                    defaultValue: false,
                    note: "Active le spoiler pour les fichiers et désactive les images/vidéos embeded"
                },
                {
                    type: "switch",
                    id: SETTING_SENSITIVE_PANIC_MODE,
                    name: "Panic mode",
                    value: BdApi.Data.load(name, SETTING_SENSITIVE_PANIC_MODE) || false,
                    defaultValue: false,
                    note: "Désactive instantanément le contenu sensible puis les réactive après la vérification. (Peut provoquer des petits freezes)"
                }
            ]
        }
    ]
};

export function getSetting<T>(id: string, settingsList: Array<SettingConfigElement> = config.settings): T | undefined {
    for (const setting of settingsList) {
        if (setting.type === "category") {
            const result = getSetting<T>(id, setting.settings);

            if (result !== undefined) {
                return result;
            }
        } else if (setting.id === id) {
            return setting.value as T;
        }
    }
    return undefined;
}
