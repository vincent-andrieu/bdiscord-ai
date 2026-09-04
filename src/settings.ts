import { PLUGIN_NAME } from "./constants";
import { i18n } from "./i18n";
import { DropdownSetting, SettingConfigElement } from "./types";

const DEFAULT_AI_MODEL_SUMMARY = "gemini-3.8-flash";
const DEFAULT_AI_MODEL_SENSITIVE_CONTENT = "gemini-3.1-flash-lite";
export const MAX_MEDIA_SIZE = 50;
const DEFAULT_SUMMARY_MIN_LENGTH = 300;

const AI_MODELS: DropdownSetting<string>["options"] = [
    { label: "Gemini 3.8 Flash", value: "gemini-3.8-flash" },
    { label: "Gemini 3.7 Flash", value: "gemini-3.7-flash" },
    { label: "Gemini 3.1 Flash-Lite", value: "gemini-3.1-flash-lite" }
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

/**
 * Single source of truth for the default values. Reading a setting now goes straight to the stored value instead of
 * rebuilding the whole settings panel, which used to trigger one `BdApi.Data.load` per setting on every read.
 */
const SETTING_DEFAULTS = {
    [SETTING_GOOGLE_API_KEY]: "",
    [SETTING_AI_MODEL_SUMMARY]: DEFAULT_AI_MODEL_SUMMARY,
    [SETTING_AI_MODEL_SENSITIVE_CONTENT]: DEFAULT_AI_MODEL_SENSITIVE_CONTENT,
    [SETTING_MEDIA_MAX_SIZE]: MAX_MEDIA_SIZE,
    [SETTING_JUMP_TO_MESSAGE]: true,
    [SETTING_SUMMARY_MIN_LENGTH]: DEFAULT_SUMMARY_MIN_LENGTH,
    [SETTING_EMETOPHOBIA_MODE]: false,
    [SETTING_ARACHNOPHOBIA_MODE]: false,
    [SETTING_EPILEPSY_MODE]: false,
    [SETTING_SEXUALITY_MODE]: false,
    [SETTING_SENSITIVE_PANIC_MODE]: false,
    [SETTING_CHECK_UPDATES]: true
} as const satisfies Record<string, string | number | boolean>;

export type SettingId = keyof typeof SETTING_DEFAULTS;

export function getSetting<T>(id: SettingId): T;
export function getSetting<T>(id: string): T | undefined;
export function getSetting<T>(id: string): T | undefined {
    const storedValue = BdApi.Data.load<T>(PLUGIN_NAME, id);

    // `??` and not `||`: a stored 0, "" or false is a legitimate value, not a missing one.
    return storedValue ?? (SETTING_DEFAULTS[id as SettingId] as T | undefined);
}

export function saveSetting(id: string, value: unknown): void {
    BdApi.Data.save(PLUGIN_NAME, id, value);
}

export function getConfig(): {
    name: string;
    settings: Array<SettingConfigElement>;
} {
    return {
        name: PLUGIN_NAME,
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
                        value: getSetting<string>(SETTING_GOOGLE_API_KEY),
                        placeholder: "API KEY"
                    },
                    {
                        type: "dropdown",
                        id: SETTING_AI_MODEL_SUMMARY,
                        name: i18n.SETTING_AI_MODEL_SUMMARY,
                        note: i18n.SETTING_AI_MODEL_SUMMARY_NOTE,
                        value: getSetting<string>(SETTING_AI_MODEL_SUMMARY),
                        defaultValue: DEFAULT_AI_MODEL_SUMMARY,
                        options: AI_MODELS
                    },
                    {
                        type: "dropdown",
                        id: SETTING_AI_MODEL_SENSITIVE_CONTENT,
                        name: i18n.SETTING_AI_MODEL_SENSITIVE_CONTENT,
                        note: i18n.SETTING_AI_MODEL_SENSITIVE_CONTENT_NOTE,
                        value: getSetting<string>(SETTING_AI_MODEL_SENSITIVE_CONTENT),
                        defaultValue: DEFAULT_AI_MODEL_SENSITIVE_CONTENT,
                        options: AI_MODELS
                    },
                    {
                        type: "number",
                        id: SETTING_MEDIA_MAX_SIZE,
                        name: i18n.SETTING_MEDIA_MAX_SIZE,
                        note: i18n.SETTING_MEDIA_MAX_SIZE_NOTE,
                        value: getSetting<number>(SETTING_MEDIA_MAX_SIZE),
                        defaultValue: MAX_MEDIA_SIZE,
                        min: 0
                    },
                    {
                        type: "switch",
                        id: SETTING_JUMP_TO_MESSAGE,
                        name: i18n.SETTING_JUMP_TO_MESSAGE,
                        note: i18n.SETTING_JUMP_TO_MESSAGE_NOTE,
                        value: getSetting<boolean>(SETTING_JUMP_TO_MESSAGE),
                        defaultValue: true
                    },
                    {
                        type: "number",
                        id: SETTING_SUMMARY_MIN_LENGTH,
                        name: i18n.SETTING_SUMMARY_MIN_LENGTH,
                        note: i18n.SETTING_SUMMARY_MIN_LENGTH_NOTE,
                        value: getSetting<number>(SETTING_SUMMARY_MIN_LENGTH),
                        defaultValue: DEFAULT_SUMMARY_MIN_LENGTH,
                        min: 0
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
                        value: getSetting<boolean>(SETTING_EMETOPHOBIA_MODE),
                        defaultValue: false,
                        note: i18n.SETTING_SENSITIVE_NOTE
                    },
                    {
                        type: "switch",
                        id: SETTING_ARACHNOPHOBIA_MODE,
                        name: i18n.SETTING_ARACHNOPHOBIA_MODE,
                        value: getSetting<boolean>(SETTING_ARACHNOPHOBIA_MODE),
                        defaultValue: false,
                        note: i18n.SETTING_SENSITIVE_NOTE
                    },
                    {
                        type: "switch",
                        id: SETTING_EPILEPSY_MODE,
                        name: i18n.SETTING_EPILEPSY_MODE,
                        value: getSetting<boolean>(SETTING_EPILEPSY_MODE),
                        defaultValue: false,
                        note: i18n.SETTING_SENSITIVE_NOTE
                    },
                    {
                        type: "switch",
                        id: SETTING_SEXUALITY_MODE,
                        name: i18n.SETTING_SEXUALITY_MODE,
                        value: getSetting<boolean>(SETTING_SEXUALITY_MODE),
                        defaultValue: false,
                        note: i18n.SETTING_SENSITIVE_NOTE
                    },
                    {
                        type: "switch",
                        id: SETTING_SENSITIVE_PANIC_MODE,
                        name: i18n.SETTING_SENSITIVE_PANIC_MODE,
                        value: getSetting<boolean>(SETTING_SENSITIVE_PANIC_MODE),
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
                        value: getSetting<boolean>(SETTING_CHECK_UPDATES),
                        defaultValue: true
                    }
                ]
            }
        ]
    };
}
