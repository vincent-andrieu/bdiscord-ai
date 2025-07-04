import { i18n } from "./i18n";
import { DropdownSetting, SettingConfigElement } from "./types";

const name = "BDiscordAI";
const DEFAULT_AI_MODEL_SUMMARY = "gemini-2.0-flash";
const DEFAULT_AI_MODEL_SENSITIVE_CONTENT = "gemini-2.0-flash";
export const MAX_MEDIA_SIZE = 50;
const DEFAULT_SUMMARY_MIN_LENGTH = 300;

const AI_MODELS: DropdownSetting<string>["options"] = [
    { label: "Gemini 2.5 Pro", value: "gemini-2.5-pro" },
    { label: "Gemini 2.5 Flash", value: "gemini-2.5-flash" },
    { label: "Gemini 2.0 Flash", value: "gemini-2.0-flash" },
    { label: "Gemini 2.0 Flash-Lite", value: "gemini-2.0-flash-lite" }
];

export const SETTING_GOOGLE_API_KEY = "googleApiKey";
export const SETTING_AI_MODEL_SUMMARY = "aiModelSummary";
export const SETTING_AI_MODEL_SENSITIVE_CONTENT = "aiModelSensitiveContent";
export const SETTING_MEDIA_MAX_SIZE = "mediaMaxSize";
export const SETTING_JUMP_TO_MESSAGE = "jumpToMessage";
export const SETTING_SUMMARY_MIN_LENGTH = "summaryMinLength";
export const SETTING_EMETOPHOBIA_MODE = "emetophobiaMode";
export const SETTING_ARACHNOPHOBIA_MODE = "arachnophobiaMode";
export const SETTING_EPILEPSY_MODE = "epilepsyMode";
export const SETTING_SEXUALITY_MODE = "sexualityMode";
export const SETTING_SENSITIVE_PANIC_MODE = "sensitivePanicMode";
export const SETTING_CHECK_UPDATES = "checkUpdates";

export function getConfig(): {
    name: string;
    settings: Array<SettingConfigElement>;
} {
    return {
        name,
        settings: [
            {
                type: "category",
                id: "aiModel",
                name: i18n.SETTING_CATEGORY_GEMINI_AI,
                collapsible: true,
                shown: false,
                settings: [
                    {
                        type: "text",
                        id: SETTING_GOOGLE_API_KEY,
                        name: i18n.SETTING_GOOGLE_API_KEY,
                        note: i18n.SETTING_GOOGLE_API_KEY_NOTE,
                        value: BdApi.Data.load(name, SETTING_GOOGLE_API_KEY) || "",
                        placeholder: "API KEY"
                    },
                    {
                        type: "dropdown",
                        id: SETTING_AI_MODEL_SUMMARY,
                        name: i18n.SETTING_AI_MODEL_SUMMARY,
                        note: i18n.SETTING_AI_MODEL_SUMMARY_NOTE,
                        value: BdApi.Data.load(name, SETTING_AI_MODEL_SUMMARY) || DEFAULT_AI_MODEL_SUMMARY,
                        defaultValue: DEFAULT_AI_MODEL_SUMMARY,
                        options: AI_MODELS
                    },
                    {
                        type: "dropdown",
                        id: SETTING_AI_MODEL_SENSITIVE_CONTENT,
                        name: i18n.SETTING_AI_MODEL_SENSITIVE_CONTENT,
                        note: i18n.SETTING_AI_MODEL_SENSITIVE_CONTENT_NOTE,
                        value: BdApi.Data.load(name, SETTING_AI_MODEL_SENSITIVE_CONTENT) || DEFAULT_AI_MODEL_SENSITIVE_CONTENT,
                        defaultValue: DEFAULT_AI_MODEL_SENSITIVE_CONTENT,
                        options: AI_MODELS
                    },
                    {
                        type: "number",
                        id: SETTING_MEDIA_MAX_SIZE,
                        name: i18n.SETTING_MEDIA_MAX_SIZE,
                        note: i18n.SETTING_MEDIA_MAX_SIZE_NOTE,
                        value: BdApi.Data.load(name, SETTING_MEDIA_MAX_SIZE) || MAX_MEDIA_SIZE,
                        defaultValue: MAX_MEDIA_SIZE,
                        min: 0
                    },
                    {
                        type: "switch",
                        id: SETTING_JUMP_TO_MESSAGE,
                        name: i18n.SETTING_JUMP_TO_MESSAGE,
                        note: i18n.SETTING_JUMP_TO_MESSAGE_NOTE,
                        value: BdApi.Data.load(name, SETTING_JUMP_TO_MESSAGE) ?? true,
                        defaultValue: true
                    },
                    {
                        type: "number",
                        id: SETTING_SUMMARY_MIN_LENGTH,
                        name: i18n.SETTING_SUMMARY_MIN_LENGTH,
                        note: i18n.SETTING_SUMMARY_MIN_LENGTH_NOTE,
                        value: BdApi.Data.load(name, SETTING_SUMMARY_MIN_LENGTH) || DEFAULT_SUMMARY_MIN_LENGTH,
                        defaultValue: DEFAULT_SUMMARY_MIN_LENGTH,
                        min: 1
                    }
                ]
            },
            {
                type: "category",
                id: "sensitive",
                name: i18n.SETTING_CATEGORY_SENSITIVE,
                collapsible: true,
                shown: false,
                settings: [
                    {
                        type: "switch",
                        id: SETTING_EMETOPHOBIA_MODE,
                        name: i18n.SETTING_EMETOPHOBIA_MODE,
                        value: BdApi.Data.load(name, SETTING_EMETOPHOBIA_MODE) || false,
                        defaultValue: false,
                        note: i18n.SETTING_SENSITIVE_NOTE
                    },
                    {
                        type: "switch",
                        id: SETTING_ARACHNOPHOBIA_MODE,
                        name: i18n.SETTING_ARACHNOPHOBIA_MODE,
                        value: BdApi.Data.load(name, SETTING_ARACHNOPHOBIA_MODE) || false,
                        defaultValue: false,
                        note: i18n.SETTING_SENSITIVE_NOTE
                    },
                    {
                        type: "switch",
                        id: SETTING_EPILEPSY_MODE,
                        name: i18n.SETTING_EPILEPSY_MODE,
                        value: BdApi.Data.load(name, SETTING_EPILEPSY_MODE) || false,
                        defaultValue: false,
                        note: i18n.SETTING_SENSITIVE_NOTE
                    },
                    {
                        type: "switch",
                        id: SETTING_SEXUALITY_MODE,
                        name: i18n.SETTING_SEXUALITY_MODE,
                        value: BdApi.Data.load(name, SETTING_SEXUALITY_MODE) || false,
                        defaultValue: false,
                        note: i18n.SETTING_SENSITIVE_NOTE
                    },
                    {
                        type: "switch",
                        id: SETTING_SENSITIVE_PANIC_MODE,
                        name: i18n.SETTING_SENSITIVE_PANIC_MODE,
                        value: BdApi.Data.load(name, SETTING_SENSITIVE_PANIC_MODE) || false,
                        defaultValue: false,
                        note: i18n.SETTING_SENSITIVE_PANIC_MODE_NOTE
                    }
                ]
            },
            {
                type: "category",
                id: "others",
                name: i18n.SETTING_CATEGORY_OTHERS,
                collapsible: true,
                shown: false,
                settings: [
                    {
                        type: "switch",
                        id: SETTING_CHECK_UPDATES,
                        name: i18n.SETTING_CHECK_UPDATES,
                        note: i18n.SETTING_CHECK_UPDATES_NOTE,
                        value: BdApi.Data.load(name, SETTING_CHECK_UPDATES) ?? true,
                        defaultValue: true
                    }
                ]
            }
        ]
    };
}

export function getSetting<T>(id: string, settingsList: Array<SettingConfigElement> = getConfig().settings): Readonly<T | undefined> {
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
