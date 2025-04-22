/**
 * @name BDiscordAI
 * @author gassastsina
 * @description Summarize unread messages with Gemini and block sensible medias content.
 * @version 1.0.0
 * @authorId 292388871381975040
 * @source https://github.com/vincent-andrieu/bdiscord-ai
 * @updateUrl https://raw.githubusercontent.com/vincent-andrieu/bdiscord-ai/refs/heads/main/build/bdiscord-ai.plugin.js
 */
'use strict';

const en$1 = {
    AUTHOR: "Author",
    CONTENT: "Content",
    DATE: "Date",
    DONE: "Done",
    ADD: "Add",
    API_KEY_NOTICE: "No Google API key is configured",
    SETTING_CATEGORY_GEMINI_AI: "Gemini AI",
    SETTING_GOOGLE_API_KEY: "Google API Key",
    SETTING_GOOGLE_API_KEY_NOTE: "Generate a key at https://aistudio.google.com/apikey",
    SETTING_AI_MODEL: "Model",
    SETTING_AI_MODEL_NOTE: "Select the Gemini model to use",
    SETTING_MEDIA_MAX_SIZE: "Maximum media size",
    SETTING_MEDIA_MAX_SIZE_NOTE: "Maximum size of media to download (in Mo)",
    SETTING_JUMP_TO_MESSAGE: "Auto scroll",
    SETTING_JUMP_TO_MESSAGE_NOTE: "Automatically scroll to the summary",
    SETTING_SUMMARY_MIN_LENGTH: "Minimum length to summarize",
    SETTING_SUMMARY_MIN_LENGTH_NOTE: "Minimum length of content to display the button",
    SETTING_CATEGORY_SENSITIVE: "Sensitive content",
    SETTING_EMETOPHOBIA_MODE: "Emetophobia",
    SETTING_ARACHNOPHOBIA_MODE: "Arachnophobia",
    SETTING_EPILEPSY_MODE: "Epilepsy",
    SETTING_SEXUALITY_MODE: "Sexuality",
    SETTING_SENSITIVE_NOTE: "Enable spoilers for files and disable embedded images/videos",
    SETTING_SENSITIVE_PANIC_MODE: "Panic mode",
    SETTING_SENSITIVE_PANIC_MODE_NOTE: "Instantly disables sensitive content and re-enables them after verification. (May cause small freezes)",
    SUMMARY_BUTTON: "Summarize",
    SYSTEM_INSTRUCTIONS: {
        INTRODUCTION: "You are an AI that helps the user summarize messages, images, videos, and audios on Discord messaging. Your response is in markdown format.",
        MEDIAS: "Images, videos and audios have been sent in messages.",
        CONTENT: (params) => [
            "Some messages may have a specific syntax for tagging people. You can reuse them in your response so they are interpreted. Here are some examples:",
            "- Username: <@1234>",
            "- Role name: <@&1234>",
            "- Custom emoji: <a:name:1234>",
            "- Native emoji: :joy:",
            "- Channel names: <#1234>",
            "- Link to a message: https://discord.com/channels/1234/1234/1234",
            "- Markdown link formatting is not supported: [text](url)",
            "You can use the unix timestamp to specify a date. Here are examples with the current time timestamp:",
            `- Use for dates within 24 hours: <t:${params.timestamp}:t> => ${params.formattedTime}`,
            `- Use for dates older than 1 day: <t:${params.timestamp}:f> => ${params.formattedShortDateTime}`,
            `- Use for dates older than 2 days: <t:${params.timestamp}:D> => ${params.formattedLongDate}`,
            `- Use for future dates: <t:${params.timestamp}:F> => ${params.formattedLongDateTime}`,
            `- Relative date/time: <t:${params.timestamp}:R> => just now`,
            "Context of previous messages:"
        ]
    }
};

const fr = {
    AUTHOR: "Auteur",
    CONTENT: "Contenu",
    DATE: "Date",
    DONE: "Terminé",
    ADD: "Ajouter",
    API_KEY_NOTICE: "Aucune clée API Google n'est configurée",
    SETTING_CATEGORY_GEMINI_AI: "Gemini AI",
    SETTING_GOOGLE_API_KEY: "Google API Key",
    SETTING_GOOGLE_API_KEY_NOTE: "Clée à générer sur https://aistudio.google.com/apikey",
    SETTING_AI_MODEL: "Modèle",
    SETTING_AI_MODEL_NOTE: "Sélectionne le modèle Gemini à utiliser",
    SETTING_MEDIA_MAX_SIZE: "Taille maximale des médias",
    SETTING_MEDIA_MAX_SIZE_NOTE: "Taille max des médias à télécharger (en Mo)",
    SETTING_JUMP_TO_MESSAGE: "Scroll auto",
    SETTING_JUMP_TO_MESSAGE_NOTE: "Scroll automatiquement sur le résumé",
    SETTING_SUMMARY_MIN_LENGTH: "Longueur minimale pour résumer",
    SETTING_SUMMARY_MIN_LENGTH_NOTE: "Longueur minimale du contenu pour afficher le bouton",
    SETTING_CATEGORY_SENSITIVE: "Contenu sensible",
    SETTING_EMETOPHOBIA_MODE: "Émétophobie",
    SETTING_ARACHNOPHOBIA_MODE: "Arachnophobie",
    SETTING_EPILEPSY_MODE: "Épilepsie",
    SETTING_SEXUALITY_MODE: "Sexualité",
    SETTING_SENSITIVE_NOTE: "Active le spoiler pour les fichiers et désactive les images/vidéos embeded",
    SETTING_SENSITIVE_PANIC_MODE: "Panic mode",
    SETTING_SENSITIVE_PANIC_MODE_NOTE: "Désactive instantanément le contenu sensible puis les réactive après la vérification. (Peut provoquer des petits freezes)",
    SUMMARY_BUTTON: "Résumer",
    SYSTEM_INSTRUCTIONS: {
        INTRODUCTION: "Tu es une IA qui permet à l'utilisateur de résumer des messages, des images, des vidéos et des audios sur la messagerie Discord. Ta réponse est au format markdown.",
        MEDIAS: "Les images, vidéos et audios ont été envoyés dans des messages.",
        CONTENT: (params) => [
            "Certains messages peuvent avoir une syntaxe particulière et permet de notifier des personnes. Tu peux les réutiliser dans ta réponse pour qu'ils soient interprétés. Voici quelques exemples :",
            "- Nom d'utilisateur : <@1234>",
            "- Nom de rôle : <@&1234>",
            "- Emoji personnalisé : <a:nom:1234>",
            "- Emoji natif : :joy:",
            "- Nom des channels : <#1234>",
            "- Lien vers un message : https://discord.com/channels/1234/1234/1234",
            "- La mise en forme des liens markdown n'est pas prit en charge : [texte](url)",
            "Tu peux utiliser le timestamp unix pour préciser une date. Voici des exemples avec le timestamp de l'heure actuelle :",
            `- A utiliser pour les dates dans les 24h : <t:${params.timestamp}:t> => ${params.formattedTime}`,
            `- A utiliser pour les dates antérieurs à 1 jours : <t:${params.timestamp}:f> => ${params.formattedShortDateTime}`,
            `- A utiliser pour les dates antérieurs à 2 jours : <t:${params.timestamp}:D> => ${params.formattedLongDate}`,
            `- A utiliser pour les dates dans le futur : <t:${params.timestamp}:F> => ${params.formattedLongDateTime}`,
            `- Date/Heure relative : <t:${params.timestamp}:R> => à l'instant`,
            "Contexte des messages précédents :"
        ]
    }
};

const DEFAULT_LOCALE = "fr";
let i18n;
setLocale(DEFAULT_LOCALE);
function setLocale(locale = getDiscordLocale()) {
    switch (locale) {
        case "en-US":
        case "en-GB":
            i18n = en$1;
            break;
        case "fr":
            i18n = fr;
            break;
        default:
            i18n = en$1;
            break;
    }
}
function getDiscordLocale() {
    const localeStore = BdApi.Webpack.getStore("LocaleStore");
    return localeStore.locale;
}

const name = "BDiscordAI";
const DEFAULT_AI_MODEL = "gemini-2.0-flash";
const MAX_MEDIA_SIZE = 50;
const DEFAULT_SUMMARY_MIN_LENGTH = 300;
const SETTING_GOOGLE_API_KEY = "googleApiKey";
const SETTING_AI_MODEL = "aiModel";
const SETTING_MEDIA_MAX_SIZE = "mediaMaxSize";
const SETTING_JUMP_TO_MESSAGE = "jumpToMessage";
const SETTING_SUMMARY_MIN_LENGTH = "summaryMinLength";
const SETTING_EMETOPHOBIA_MODE = "emetophobiaMode";
const SETTING_ARACHNOPHOBIA_MODE = "arachnophobiaMode";
const SETTING_EPILEPSY_MODE = "epilepsyMode";
const SETTING_SEXUALITY_MODE = "sexualityMode";
const SETTING_SENSITIVE_PANIC_MODE = "sensitivePanicMode";
function getConfig() {
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
                        id: SETTING_AI_MODEL,
                        name: i18n.SETTING_AI_MODEL,
                        note: i18n.SETTING_AI_MODEL_NOTE,
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
            }
        ]
    };
}
function getSetting(id, settingsList = getConfig().settings) {
    for (const setting of settingsList) {
        if (setting.type === "category") {
            const result = getSetting(id, setting.settings);
            if (result !== undefined) {
                return result;
            }
        }
        else if (setting.id === id) {
            return setting.value;
        }
    }
    return undefined;
}

const LOG_PREFIX = `[${getConfig().name}]`;
const GEMINI_VIDEOS_LIMIT = 10;
const imageMimeTypes = ["image/png", "image/jpeg", "image/webp", "image/heic", "image/heif"];
const videoMimeTypes = [
    "video/mp4",
    "video/mpeg",
    "video/mov",
    "video/avi",
    "video/x-flv",
    "video/mpg",
    "video/webm",
    "video/wmv",
    "video/3gpp"
];
const audioMimeTypes = ["audio/wav", "audio/mp3", "audio/aiff", "audio/aac", "audio/ogg", "audio/flac"];
var DiscordMessageType;
(function (DiscordMessageType) {
    DiscordMessageType[DiscordMessageType["DEFAULT"] = 0] = "DEFAULT";
    DiscordMessageType[DiscordMessageType["RECIPIENT_ADD"] = 1] = "RECIPIENT_ADD";
    DiscordMessageType[DiscordMessageType["RECIPIENT_REMOVE"] = 2] = "RECIPIENT_REMOVE";
    DiscordMessageType[DiscordMessageType["CALL"] = 3] = "CALL";
    DiscordMessageType[DiscordMessageType["CHANNEL_NAME_CHANGE"] = 4] = "CHANNEL_NAME_CHANGE";
    DiscordMessageType[DiscordMessageType["CHANNEL_ICON_CHANGE"] = 5] = "CHANNEL_ICON_CHANGE";
    DiscordMessageType[DiscordMessageType["CHANNEL_PINNED_MESSAGE"] = 6] = "CHANNEL_PINNED_MESSAGE";
    DiscordMessageType[DiscordMessageType["USER_JOIN"] = 7] = "USER_JOIN";
    DiscordMessageType[DiscordMessageType["GUILD_BOOST"] = 8] = "GUILD_BOOST";
    DiscordMessageType[DiscordMessageType["GUILD_BOOST_TIER_1"] = 9] = "GUILD_BOOST_TIER_1";
    DiscordMessageType[DiscordMessageType["GUILD_BOOST_TIER_2"] = 10] = "GUILD_BOOST_TIER_2";
    DiscordMessageType[DiscordMessageType["GUILD_BOOST_TIER_3"] = 11] = "GUILD_BOOST_TIER_3";
    DiscordMessageType[DiscordMessageType["CHANNEL_FOLLOW_ADD"] = 12] = "CHANNEL_FOLLOW_ADD";
    DiscordMessageType[DiscordMessageType["GUILD_STREAM"] = 13] = "GUILD_STREAM";
    DiscordMessageType[DiscordMessageType["GUILD_DISCOVERY_DISQUALIFIED"] = 14] = "GUILD_DISCOVERY_DISQUALIFIED";
    DiscordMessageType[DiscordMessageType["GUILD_DISCOVERY_REQUALIFIED"] = 15] = "GUILD_DISCOVERY_REQUALIFIED";
    DiscordMessageType[DiscordMessageType["GUILD_DISCOVERY_GRACE_PERIOD_INITIAL_WARNING"] = 16] = "GUILD_DISCOVERY_GRACE_PERIOD_INITIAL_WARNING";
    DiscordMessageType[DiscordMessageType["GUILD_DISCOVERY_GRACE_PERIOD_FINAL_WARNING"] = 17] = "GUILD_DISCOVERY_GRACE_PERIOD_FINAL_WARNING";
    DiscordMessageType[DiscordMessageType["THREAD_CREATED"] = 18] = "THREAD_CREATED";
    DiscordMessageType[DiscordMessageType["REPLY"] = 19] = "REPLY";
    DiscordMessageType[DiscordMessageType["CHAT_INPUT_COMMAND"] = 20] = "CHAT_INPUT_COMMAND";
    DiscordMessageType[DiscordMessageType["THREAD_STARTER_MESSAGE"] = 21] = "THREAD_STARTER_MESSAGE";
    DiscordMessageType[DiscordMessageType["GUILD_INVITE_REMINDER"] = 22] = "GUILD_INVITE_REMINDER";
    DiscordMessageType[DiscordMessageType["CONTEXT_MENU_COMMAND"] = 23] = "CONTEXT_MENU_COMMAND";
    DiscordMessageType[DiscordMessageType["AUTO_MODERATION_ACTION"] = 24] = "AUTO_MODERATION_ACTION";
    DiscordMessageType[DiscordMessageType["ROLE_SUBSCRIPTION_PURCHASE"] = 25] = "ROLE_SUBSCRIPTION_PURCHASE";
    DiscordMessageType[DiscordMessageType["INTERACTION_PREMIUM_UPSELL"] = 26] = "INTERACTION_PREMIUM_UPSELL";
    DiscordMessageType[DiscordMessageType["STAGE_START"] = 27] = "STAGE_START";
    DiscordMessageType[DiscordMessageType["STAGE_END"] = 28] = "STAGE_END";
    DiscordMessageType[DiscordMessageType["STAGE_SPEAKER"] = 29] = "STAGE_SPEAKER";
    DiscordMessageType[DiscordMessageType["STAGE_RAISE_HAND"] = 30] = "STAGE_RAISE_HAND";
    DiscordMessageType[DiscordMessageType["STAGE_TOPIC"] = 31] = "STAGE_TOPIC";
    DiscordMessageType[DiscordMessageType["GUILD_APPLICATION_PREMIUM_SUBSCRIPTION"] = 32] = "GUILD_APPLICATION_PREMIUM_SUBSCRIPTION";
    DiscordMessageType[DiscordMessageType["PRIVATE_CHANNEL_INTEGRATION_ADDED"] = 33] = "PRIVATE_CHANNEL_INTEGRATION_ADDED";
    DiscordMessageType[DiscordMessageType["PRIVATE_CHANNEL_INTEGRATION_REMOVED"] = 34] = "PRIVATE_CHANNEL_INTEGRATION_REMOVED";
    DiscordMessageType[DiscordMessageType["PREMIUM_REFERRAL"] = 35] = "PREMIUM_REFERRAL";
    DiscordMessageType[DiscordMessageType["GUILD_INCIDENT_ALERT_MODE_ENABLED"] = 36] = "GUILD_INCIDENT_ALERT_MODE_ENABLED";
    DiscordMessageType[DiscordMessageType["GUILD_INCIDENT_ALERT_MODE_DISABLED"] = 37] = "GUILD_INCIDENT_ALERT_MODE_DISABLED";
    DiscordMessageType[DiscordMessageType["GUILD_INCIDENT_REPORT_RAID"] = 38] = "GUILD_INCIDENT_REPORT_RAID";
    DiscordMessageType[DiscordMessageType["GUILD_INCIDENT_REPORT_FALSE_ALARM"] = 39] = "GUILD_INCIDENT_REPORT_FALSE_ALARM";
    DiscordMessageType[DiscordMessageType["GUILD_DEADCHAT_REVIVE_PROMPT"] = 40] = "GUILD_DEADCHAT_REVIVE_PROMPT";
    DiscordMessageType[DiscordMessageType["CUSTOM_GIFT"] = 41] = "CUSTOM_GIFT";
    DiscordMessageType[DiscordMessageType["GUILD_GAMING_STATS_PROMPT"] = 42] = "GUILD_GAMING_STATS_PROMPT";
    DiscordMessageType[DiscordMessageType["PURCHASE_NOTIFICATION"] = 44] = "PURCHASE_NOTIFICATION";
    DiscordMessageType[DiscordMessageType["VOICE_HANGOUT_INVITE"] = 45] = "VOICE_HANGOUT_INVITE";
    DiscordMessageType[DiscordMessageType["POLL_RESULT"] = 46] = "POLL_RESULT";
    DiscordMessageType[DiscordMessageType["CHANGELOG"] = 47] = "CHANGELOG";
    DiscordMessageType[DiscordMessageType["NITRO_NOTIFICATION"] = 48] = "NITRO_NOTIFICATION";
    DiscordMessageType[DiscordMessageType["CHANNEL_LINKED_TO_LOBBY"] = 49] = "CHANNEL_LINKED_TO_LOBBY";
    DiscordMessageType[DiscordMessageType["GIFTING_PROMPT"] = 50] = "GIFTING_PROMPT";
    DiscordMessageType[DiscordMessageType["IN_GAME_MESSAGE_NUX"] = 51] = "IN_GAME_MESSAGE_NUX";
    DiscordMessageType[DiscordMessageType["GUILD_JOIN_REQUEST_ACCEPT_NOTIFICATION"] = 52] = "GUILD_JOIN_REQUEST_ACCEPT_NOTIFICATION";
    DiscordMessageType[DiscordMessageType["GUILD_JOIN_REQUEST_REJECT_NOTIFICATION"] = 53] = "GUILD_JOIN_REQUEST_REJECT_NOTIFICATION";
    DiscordMessageType[DiscordMessageType["GUILD_JOIN_REQUEST_WITHDRAWN_NOTIFICATION"] = 54] = "GUILD_JOIN_REQUEST_WITHDRAWN_NOTIFICATION";
    DiscordMessageType[DiscordMessageType["HD_STREAMING_UPGRADED"] = 55] = "HD_STREAMING_UPGRADED";
})(DiscordMessageType || (DiscordMessageType = {}));
var DiscordMessageFlags;
(function (DiscordMessageFlags) {
    DiscordMessageFlags[DiscordMessageFlags["DEFAULT"] = 0] = "DEFAULT";
    DiscordMessageFlags[DiscordMessageFlags["CROSSPOSTED"] = 1] = "CROSSPOSTED";
    DiscordMessageFlags[DiscordMessageFlags["IS_CROSSPOST"] = 2] = "IS_CROSSPOST";
    DiscordMessageFlags[DiscordMessageFlags["SUPPRESS_EMBEDS"] = 4] = "SUPPRESS_EMBEDS";
    DiscordMessageFlags[DiscordMessageFlags["SOURCE_MESSAGE_DELETED"] = 8] = "SOURCE_MESSAGE_DELETED";
    DiscordMessageFlags[DiscordMessageFlags["URGENT"] = 16] = "URGENT";
    DiscordMessageFlags[DiscordMessageFlags["HAS_THREAD"] = 32] = "HAS_THREAD";
    DiscordMessageFlags[DiscordMessageFlags["EPHEMERAL"] = 64] = "EPHEMERAL";
    DiscordMessageFlags[DiscordMessageFlags["LOADING"] = 128] = "LOADING";
    DiscordMessageFlags[DiscordMessageFlags["FAILED_TO_MENTION_SOME_ROLES_IN_THREAD"] = 256] = "FAILED_TO_MENTION_SOME_ROLES_IN_THREAD";
    DiscordMessageFlags[DiscordMessageFlags["GUILD_FEED_HIDDEN"] = 512] = "GUILD_FEED_HIDDEN";
    DiscordMessageFlags[DiscordMessageFlags["SHOULD_SHOW_LINK_NOT_DISCORD_WARNING"] = 1024] = "SHOULD_SHOW_LINK_NOT_DISCORD_WARNING";
    DiscordMessageFlags[DiscordMessageFlags["SUPPRESS_NOTIFICATIONS"] = 4096] = "SUPPRESS_NOTIFICATIONS";
    DiscordMessageFlags[DiscordMessageFlags["IS_VOICE_MESSAGE"] = 8192] = "IS_VOICE_MESSAGE";
    DiscordMessageFlags[DiscordMessageFlags["HAS_SNAPSHOT"] = 16384] = "HAS_SNAPSHOT";
    DiscordMessageFlags[DiscordMessageFlags["IS_COMPONENTS_V2"] = 32768] = "IS_COMPONENTS_V2";
    DiscordMessageFlags[DiscordMessageFlags["SENT_BY_SOCIAL_LAYER_INTEGRATION"] = 65536] = "SENT_BY_SOCIAL_LAYER_INTEGRATION";
})(DiscordMessageFlags || (DiscordMessageFlags = {}));
var DiscordMessageState;
(function (DiscordMessageState) {
    DiscordMessageState["SENT"] = "SENT";
    DiscordMessageState["SENDING"] = "SENDING";
    DiscordMessageState["SEND_FAILED"] = "SEND_FAILED";
})(DiscordMessageState || (DiscordMessageState = {}));
var DiscordMessageComponentStyle;
(function (DiscordMessageComponentStyle) {
    DiscordMessageComponentStyle[DiscordMessageComponentStyle["PRIMARY"] = 1] = "PRIMARY";
    DiscordMessageComponentStyle[DiscordMessageComponentStyle["SECONDARY"] = 2] = "SECONDARY";
    DiscordMessageComponentStyle[DiscordMessageComponentStyle["SUCCESS"] = 3] = "SUCCESS";
    DiscordMessageComponentStyle[DiscordMessageComponentStyle["DESTRUCTIVE"] = 4] = "DESTRUCTIVE";
    DiscordMessageComponentStyle[DiscordMessageComponentStyle["LINK"] = 5] = "LINK";
    DiscordMessageComponentStyle[DiscordMessageComponentStyle["PREMIUM"] = 6] = "PREMIUM";
})(DiscordMessageComponentStyle || (DiscordMessageComponentStyle = {}));
var DiscordComponentVisualState;
(function (DiscordComponentVisualState) {
    DiscordComponentVisualState[DiscordComponentVisualState["NORMAL"] = 0] = "NORMAL";
    DiscordComponentVisualState[DiscordComponentVisualState["LOADING"] = 1] = "LOADING";
    DiscordComponentVisualState[DiscordComponentVisualState["DISABLED"] = 2] = "DISABLED";
})(DiscordComponentVisualState || (DiscordComponentVisualState = {}));

function forceReloadMessages() {
    const instance = findInTree(getReactInstance(document.querySelector('main[class*="chatContent"]')), (e) => typeof e?.memoizedProps?.showQuarantinedUserBanner === "boolean", { walkable: ["return"] })?.stateNode;
    if (!instance)
        return;
    const unpatch = BdApi.Patcher.after(getConfig().name, instance, "render", (_this, _, ret) => {
        unpatch();
        if (!ret)
            return;
        ret.key = Math.random().toString(36).substring(2, 10).toUpperCase();
        ret.ref = () => _this.forceUpdate();
    });
    instance.forceUpdate();
}
function findInTree(tree, searchFilter, { walkable = null, ignore = [] } = {}) {
    if (typeof searchFilter === "string") {
        if (tree.hasOwnProperty(searchFilter))
            return tree[searchFilter];
    }
    else if (searchFilter(tree)) {
        return tree;
    }
    if (typeof tree !== "object" || tree == null)
        return undefined;
    let tempReturn;
    if (Array.isArray(tree)) {
        for (const value of tree) {
            tempReturn = findInTree(value, searchFilter, { walkable, ignore });
            if (typeof tempReturn != "undefined")
                return tempReturn;
        }
    }
    else {
        const toWalk = walkable == null ? Object.keys(tree) : walkable;
        for (const key of toWalk) {
            if (!tree.hasOwnProperty(key) || ignore.includes(key))
                continue;
            tempReturn = findInTree(tree[key], searchFilter, { walkable, ignore });
            if (typeof tempReturn != "undefined")
                return tempReturn;
        }
    }
    return tempReturn;
}
function getReactInstance(node) {
    const domNode = resolveElement(node);
    if (!(domNode instanceof Element)) {
        return undefined;
    }
    // @ts-ignore
    return domNode[Object.keys(domNode).find((key) => key.startsWith("__reactInternalInstance") || key.startsWith("__reactFiber"))];
}
function resolveElement(node) {
    try {
        if (!(node instanceof window.jQuery) && !(node instanceof Element))
            return undefined;
        return node instanceof window.jQuery ? node[0] : node;
    }
    catch {
        return node;
    }
}

/**
 * Bundled by jsDelivr using Rollup v2.79.2 and Terser v5.39.0.
 * Original file: /npm/@google/genai@0.9.0/dist/web/index.mjs
 *
 * Do NOT use SRI with dynamically generated files! More information: https://www.jsdelivr.com/using-sri-with-dynamic-files
 */
/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
class t{}function n(t,n){return t.replace(/\{([^}]+)\}/g,((t,e)=>{if(Object.prototype.hasOwnProperty.call(n,e)){const t=n[e];return null!=t?String(t):""}throw new Error(`Key '${e}' not found in valueMap.`)}))}function e(t,n,o){for(let i=0;i<n.length-1;i++){const s=n[i];if(s.endsWith("[]")){const r=s.slice(0,-2);if(!(r in t)){if(!Array.isArray(o))throw new Error(`Value must be a list given an array path ${s}`);t[r]=Array.from({length:o.length},(()=>({})));}if(Array.isArray(t[r])){const s=t[r];if(Array.isArray(o))for(let t=0;t<s.length;t++){e(s[t],n.slice(i+1),o[t]);}else for(const t of s)e(t,n.slice(i+1),o);}return}if(s.endsWith("[0]")){const r=s.slice(0,-3);r in t||(t[r]=[{}]);return void e(t[r][0],n.slice(i+1),o)}t[s]&&"object"==typeof t[s]||(t[s]={}),t=t[s];}const i=n[n.length-1],s=t[i];if(void 0!==s){if(!o||"object"==typeof o&&0===Object.keys(o).length)return;if(o===s)return;if("object"!=typeof s||"object"!=typeof o||null===s||null===o)throw new Error(`Cannot set value for an existing key. Key: ${i}`);Object.assign(s,o);}else t[i]=o;}function o(t,n){try{if(1===n.length&&"_self"===n[0])return t;for(let e=0;e<n.length;e++){if("object"!=typeof t||null===t)return;const i=n[e];if(i.endsWith("[]")){const s=i.slice(0,-2);if(s in t){const i=t[s];if(!Array.isArray(i))return;return i.map((t=>o(t,n.slice(e+1))))}return}t=t[i];}return t}catch(t){if(t instanceof TypeError)return;throw t}}
/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */function i(t,n){if(!n||"string"!=typeof n)throw new Error("model is required and must be a string");if(t.isVertexAI()){if(n.startsWith("publishers/")||n.startsWith("projects/")||n.startsWith("models/"))return n;if(n.indexOf("/")>=0){const t=n.split("/",2);return `publishers/${t[0]}/models/${t[1]}`}return `publishers/google/models/${n}`}return n.startsWith("models/")||n.startsWith("tunedModels/")?n:`models/${n}`}function s(t,n){const e=i(t,n);return e?e.startsWith("publishers/")&&t.isVertexAI()?`projects/${t.getProject()}/locations/${t.getLocation()}/${e}`:e.startsWith("models/")&&t.isVertexAI()?`projects/${t.getProject()}/locations/${t.getLocation()}/publishers/google/${e}`:e:""}function r(t,n){if(null==n)throw new Error("PartUnion is required");if("object"==typeof n)return n;if("string"==typeof n)return {text:n};throw new Error("Unsupported part type: "+typeof n)}function l(t,n){if(null==n||Array.isArray(n)&&0===n.length)throw new Error("PartListUnion is required");return Array.isArray(n)?n.map((t=>r(0,t))):[r(0,n)]}function a(t){return null!=t&&"object"==typeof t&&"parts"in t&&Array.isArray(t.parts)}function u(t){return null!=t&&"object"==typeof t&&"functionCall"in t}function c(t){return null!=t&&"object"==typeof t&&"functionResponse"in t}function p(t,n){if(null==n)throw new Error("ContentUnion is required");return a(n)?n:{role:"user",parts:l(0,n)}}function d(t,n){if(!n)return [];if(t.isVertexAI()&&Array.isArray(n))return n.flatMap((t=>{const n=p(0,t);return n.parts&&n.parts.length>0&&void 0!==n.parts[0].text?[n.parts[0].text]:[]}));if(t.isVertexAI()){const t=p(0,n);return t.parts&&t.parts.length>0&&void 0!==t.parts[0].text?[t.parts[0].text]:[]}return Array.isArray(n)?n.map((t=>p(0,t))):[p(0,n)]}function h(t,n){if(null==n||Array.isArray(n)&&0===n.length)throw new Error("contents are required");if(!Array.isArray(n)){if(u(n)||c(n))throw new Error("To specify functionCall or functionResponse parts, please wrap them in a Content object, specifying the role for them");return [p(0,n)]}const e=[],o=[],i=a(n[0]);for(const t of n){const n=a(t);if(n!=i)throw new Error("Mixing Content and Parts is not supported, please group the parts into a the appropriate Content objects and specify the roles for them");if(n)e.push(t);else {if(u(t)||c(t))throw new Error("To specify functionCall or functionResponse parts, please wrap them, and any other parts, in Content objects as appropriate, specifying the role for them");o.push(t);}}return i||e.push({role:"user",parts:l(0,o)}),e}function f(t,n){if(!t.isVertexAI()&&"default"in n)throw new Error("Default value is not supported in the response schema for the Gemini API.");if("anyOf"in n&&void 0!==n.anyOf)for(const e of n.anyOf)f(t,e);if("items"in n&&void 0!==n.items&&f(t,n.items),"properties"in n&&void 0!==n.properties)for(const e of Object.values(n.properties))f(t,e);}function m(t,n){return f(t,n),n}function g(t,n){if("object"==typeof n&&"voiceConfig"in n)return n;if("string"==typeof n)return {voiceConfig:{prebuiltVoiceConfig:{voiceName:n}}};throw new Error("Unsupported speechConfig type: "+typeof n)}function y(t,n){return n}function C(t,n){if(!Array.isArray(n))throw new Error("tool is required and must be an array of Tools");return n}function v(t,n){if("string"!=typeof n)throw new Error("name must be a string");return function(t,n,e,o=1){const i=!n.startsWith(`${e}/`)&&n.split("/").length===o;return t.isVertexAI()?n.startsWith("projects/")?n:n.startsWith("locations/")?`projects/${t.getProject()}/${n}`:n.startsWith(`${e}/`)?`projects/${t.getProject()}/locations/${t.getLocation()}/${n}`:i?`projects/${t.getProject()}/locations/${t.getLocation()}/${e}/${n}`:n:i?`${e}/${n}`:n}(t,n,"cachedContents")}function E(t,n){if("string"!=typeof n)throw new Error("fromImageBytes must be a string");return n}function T(t,n){if("string"!=typeof n)throw new Error("fromName must be a string");return n.startsWith("files/")?n.split("files/")[1]:n}
/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */function O(t,n){const i={},s=o(n,["parts"]);null!=s&&(Array.isArray(s)?e(i,["parts"],s.map((t=>function(t,n){const i={};if(void 0!==o(n,["videoMetadata"]))throw new Error("videoMetadata parameter is not supported in Gemini API.");const s=o(n,["thought"]);null!=s&&e(i,["thought"],s);const r=o(n,["codeExecutionResult"]);null!=r&&e(i,["codeExecutionResult"],r);const l=o(n,["executableCode"]);null!=l&&e(i,["executableCode"],l);const a=o(n,["fileData"]);null!=a&&e(i,["fileData"],a);const u=o(n,["functionCall"]);null!=u&&e(i,["functionCall"],u);const c=o(n,["functionResponse"]);null!=c&&e(i,["functionResponse"],c);const p=o(n,["inlineData"]);null!=p&&e(i,["inlineData"],p);const d=o(n,["text"]);return null!=d&&e(i,["text"],d),i}(0,t)))):e(i,["parts"],s));const r=o(n,["role"]);return null!=r&&e(i,["role"],r),i}function I(t,n){const i={},s=o(n,["dynamicRetrievalConfig"]);return null!=s&&e(i,["dynamicRetrievalConfig"],function(t,n){const i={},s=o(n,["mode"]);null!=s&&e(i,["mode"],s);const r=o(n,["dynamicThreshold"]);return null!=r&&e(i,["dynamicThreshold"],r),i}(0,s)),i}function A(t,n){const i={},s=o(n,["functionDeclarations"]);if(null!=s&&(Array.isArray(s)?e(i,["functionDeclarations"],s.map((t=>function(t,n){const i={};if(void 0!==o(n,["response"]))throw new Error("response parameter is not supported in Gemini API.");const s=o(n,["description"]);null!=s&&e(i,["description"],s);const r=o(n,["name"]);null!=r&&e(i,["name"],r);const l=o(n,["parameters"]);return null!=l&&e(i,["parameters"],l),i}(0,t)))):e(i,["functionDeclarations"],s)),void 0!==o(n,["retrieval"]))throw new Error("retrieval parameter is not supported in Gemini API.");null!=o(n,["googleSearch"])&&e(i,["googleSearch"],{});const r=o(n,["googleSearchRetrieval"]);null!=r&&e(i,["googleSearchRetrieval"],I(0,r));const l=o(n,["codeExecution"]);return null!=l&&e(i,["codeExecution"],l),i}function _(t,n){const i={},s=o(n,["functionCallingConfig"]);return null!=s&&e(i,["functionCallingConfig"],function(t,n){const i={},s=o(n,["mode"]);null!=s&&e(i,["mode"],s);const r=o(n,["allowedFunctionNames"]);return null!=r&&e(i,["allowedFunctionNames"],r),i}(0,s)),i}function S(t,n){const i={},r=o(n,["model"]);null!=r&&e(i,["model"],s(t,r));const l=o(n,["config"]);return null!=l&&e(i,["config"],function(t,n,i){const s=o(n,["ttl"]);void 0!==i&&null!=s&&e(i,["ttl"],s);const r=o(n,["expireTime"]);void 0!==i&&null!=r&&e(i,["expireTime"],r);const l=o(n,["displayName"]);void 0!==i&&null!=l&&e(i,["displayName"],l);const a=o(n,["contents"]);void 0!==i&&null!=a&&(Array.isArray(a)?e(i,["contents"],h(0,h(0,a).map((t=>O(0,t))))):e(i,["contents"],h(0,a)));const u=o(n,["systemInstruction"]);void 0!==i&&null!=u&&e(i,["systemInstruction"],O(0,p(0,u)));const c=o(n,["tools"]);void 0!==i&&null!=c&&(Array.isArray(c)?e(i,["tools"],c.map((t=>A(0,t)))):e(i,["tools"],c));const d=o(n,["toolConfig"]);return void 0!==i&&null!=d&&e(i,["toolConfig"],_(0,d)),{}}(0,l,i)),i}function w(t,n){const i={},s=o(n,["name"]);null!=s&&e(i,["_url","name"],v(t,s));const r=o(n,["config"]);return null!=r&&e(i,["config"],function(t,n,i){const s=o(n,["ttl"]);void 0!==i&&null!=s&&e(i,["ttl"],s);const r=o(n,["expireTime"]);return void 0!==i&&null!=r&&e(i,["expireTime"],r),{}}(0,r,i)),i}function P(t,n){const i={},s=o(n,["config"]);return null!=s&&e(i,["config"],function(t,n,i){const s=o(n,["pageSize"]);void 0!==i&&null!=s&&e(i,["_query","pageSize"],s);const r=o(n,["pageToken"]);return void 0!==i&&null!=r&&e(i,["_query","pageToken"],r),{}}(0,s,i)),i}function R(t,n){const i={},s=o(n,["parts"]);null!=s&&(Array.isArray(s)?e(i,["parts"],s.map((t=>function(t,n){const i={},s=o(n,["videoMetadata"]);null!=s&&e(i,["videoMetadata"],s);const r=o(n,["thought"]);null!=r&&e(i,["thought"],r);const l=o(n,["codeExecutionResult"]);null!=l&&e(i,["codeExecutionResult"],l);const a=o(n,["executableCode"]);null!=a&&e(i,["executableCode"],a);const u=o(n,["fileData"]);null!=u&&e(i,["fileData"],u);const c=o(n,["functionCall"]);null!=c&&e(i,["functionCall"],c);const p=o(n,["functionResponse"]);null!=p&&e(i,["functionResponse"],p);const d=o(n,["inlineData"]);null!=d&&e(i,["inlineData"],d);const h=o(n,["text"]);return null!=h&&e(i,["text"],h),i}(0,t)))):e(i,["parts"],s));const r=o(n,["role"]);return null!=r&&e(i,["role"],r),i}function N(t,n){const i={},s=o(n,["response"]);null!=s&&e(i,["response"],function(t,n){const i={},s=o(n,["example"]);null!=s&&e(i,["example"],s);const r=o(n,["pattern"]);null!=r&&e(i,["pattern"],r);const l=o(n,["default"]);null!=l&&e(i,["default"],l);const a=o(n,["maxLength"]);null!=a&&e(i,["maxLength"],a);const u=o(n,["minLength"]);null!=u&&e(i,["minLength"],u);const c=o(n,["minProperties"]);null!=c&&e(i,["minProperties"],c);const p=o(n,["maxProperties"]);null!=p&&e(i,["maxProperties"],p);const d=o(n,["anyOf"]);null!=d&&e(i,["anyOf"],d);const h=o(n,["description"]);null!=h&&e(i,["description"],h);const f=o(n,["enum"]);null!=f&&e(i,["enum"],f);const m=o(n,["format"]);null!=m&&e(i,["format"],m);const g=o(n,["items"]);null!=g&&e(i,["items"],g);const y=o(n,["maxItems"]);null!=y&&e(i,["maxItems"],y);const C=o(n,["maximum"]);null!=C&&e(i,["maximum"],C);const v=o(n,["minItems"]);null!=v&&e(i,["minItems"],v);const E=o(n,["minimum"]);null!=E&&e(i,["minimum"],E);const T=o(n,["nullable"]);null!=T&&e(i,["nullable"],T);const O=o(n,["properties"]);null!=O&&e(i,["properties"],O);const I=o(n,["propertyOrdering"]);null!=I&&e(i,["propertyOrdering"],I);const A=o(n,["required"]);null!=A&&e(i,["required"],A);const _=o(n,["title"]);null!=_&&e(i,["title"],_);const S=o(n,["type"]);return null!=S&&e(i,["type"],S),i}(0,s));const r=o(n,["description"]);null!=r&&e(i,["description"],r);const l=o(n,["name"]);null!=l&&e(i,["name"],l);const a=o(n,["parameters"]);return null!=a&&e(i,["parameters"],a),i}function b(t,n){const i={},s=o(n,["dynamicRetrievalConfig"]);return null!=s&&e(i,["dynamicRetrievalConfig"],function(t,n){const i={},s=o(n,["mode"]);null!=s&&e(i,["mode"],s);const r=o(n,["dynamicThreshold"]);return null!=r&&e(i,["dynamicThreshold"],r),i}(0,s)),i}function D(t,n){const i={},s=o(n,["functionCallingConfig"]);return null!=s&&e(i,["functionCallingConfig"],function(t,n){const i={},s=o(n,["mode"]);null!=s&&e(i,["mode"],s);const r=o(n,["allowedFunctionNames"]);return null!=r&&e(i,["allowedFunctionNames"],r),i}(0,s)),i}function x(t,n,i){const s=o(n,["ttl"]);void 0!==i&&null!=s&&e(i,["ttl"],s);const r=o(n,["expireTime"]);void 0!==i&&null!=r&&e(i,["expireTime"],r);const l=o(n,["displayName"]);void 0!==i&&null!=l&&e(i,["displayName"],l);const a=o(n,["contents"]);void 0!==i&&null!=a&&(Array.isArray(a)?e(i,["contents"],h(0,h(0,a).map((t=>R(0,t))))):e(i,["contents"],h(0,a)));const u=o(n,["systemInstruction"]);void 0!==i&&null!=u&&e(i,["systemInstruction"],R(0,p(0,u)));const c=o(n,["tools"]);void 0!==i&&null!=c&&(Array.isArray(c)?e(i,["tools"],c.map((t=>function(t,n){const i={},s=o(n,["functionDeclarations"]);null!=s&&(Array.isArray(s)?e(i,["functionDeclarations"],s.map((t=>N(0,t)))):e(i,["functionDeclarations"],s));const r=o(n,["retrieval"]);null!=r&&e(i,["retrieval"],r),null!=o(n,["googleSearch"])&&e(i,["googleSearch"],{});const l=o(n,["googleSearchRetrieval"]);null!=l&&e(i,["googleSearchRetrieval"],b(0,l));const a=o(n,["codeExecution"]);return null!=a&&e(i,["codeExecution"],a),i}(0,t)))):e(i,["tools"],c));const d=o(n,["toolConfig"]);return void 0!==i&&null!=d&&e(i,["toolConfig"],D(0,d)),{}}function M(t,n){const i={},s=o(n,["name"]);null!=s&&e(i,["_url","name"],v(t,s));const r=o(n,["config"]);return null!=r&&e(i,["config"],function(t,n,i){const s=o(n,["ttl"]);void 0!==i&&null!=s&&e(i,["ttl"],s);const r=o(n,["expireTime"]);return void 0!==i&&null!=r&&e(i,["expireTime"],r),{}}(0,r,i)),i}function U(t,n){const i={},s=o(n,["config"]);return null!=s&&e(i,["config"],function(t,n,i){const s=o(n,["pageSize"]);void 0!==i&&null!=s&&e(i,["_query","pageSize"],s);const r=o(n,["pageToken"]);return void 0!==i&&null!=r&&e(i,["_query","pageToken"],r),{}}(0,s,i)),i}function L(t,n){const i={},s=o(n,["name"]);null!=s&&e(i,["name"],s);const r=o(n,["displayName"]);null!=r&&e(i,["displayName"],r);const l=o(n,["model"]);null!=l&&e(i,["model"],l);const a=o(n,["createTime"]);null!=a&&e(i,["createTime"],a);const u=o(n,["updateTime"]);null!=u&&e(i,["updateTime"],u);const c=o(n,["expireTime"]);null!=c&&e(i,["expireTime"],c);const p=o(n,["usageMetadata"]);return null!=p&&e(i,["usageMetadata"],p),i}function q(t,n){const i={},s=o(n,["name"]);null!=s&&e(i,["name"],s);const r=o(n,["displayName"]);null!=r&&e(i,["displayName"],r);const l=o(n,["model"]);null!=l&&e(i,["model"],l);const a=o(n,["createTime"]);null!=a&&e(i,["createTime"],a);const u=o(n,["updateTime"]);null!=u&&e(i,["updateTime"],u);const c=o(n,["expireTime"]);null!=c&&e(i,["expireTime"],c);const p=o(n,["usageMetadata"]);return null!=p&&e(i,["usageMetadata"],p),i}
/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
var G,k,V,H,F,j,B,Y,K,J,W,$,z,X,Q,Z,tt,nt,et,ot,it,st,rt,lt,at,ut,ct,pt,dt,ht,ft;!function(t){t.PAGED_ITEM_BATCH_JOBS="batchJobs",t.PAGED_ITEM_MODELS="models",t.PAGED_ITEM_TUNING_JOBS="tuningJobs",t.PAGED_ITEM_FILES="files",t.PAGED_ITEM_CACHED_CONTENTS="cachedContents";}(G||(G={}));class mt{constructor(t,n,e,o){this.pageInternal=[],this.paramsInternal={},this.requestInternal=n,this.init(t,e,o);}init(t,n,e){var o,i;this.nameInternal=t,this.pageInternal=n[this.nameInternal]||[],this.idxInternal=0;let s={config:{}};s=e?"object"==typeof e?Object.assign({},e):e:{config:{}},s.config&&(s.config.pageToken=n.nextPageToken),this.paramsInternal=s,this.pageInternalSize=null!==(i=null===(o=s.config)||void 0===o?void 0:o.pageSize)&&void 0!==i?i:this.pageInternal.length;}initNextPage(t){this.init(this.nameInternal,t,this.paramsInternal);}get page(){return this.pageInternal}get name(){return this.nameInternal}get pageSize(){return this.pageInternalSize}get params(){return this.paramsInternal}get pageLength(){return this.pageInternal.length}getItem(t){return this.pageInternal[t]}[Symbol.asyncIterator](){return {next:async()=>{if(this.idxInternal>=this.pageLength){if(!this.hasNextPage())return {value:void 0,done:true};await this.nextPage();}const t=this.getItem(this.idxInternal);return this.idxInternal+=1,{value:t,done:false}},return:async()=>({value:void 0,done:true})}}async nextPage(){if(!this.hasNextPage())throw new Error("No more pages to fetch.");const t=await this.requestInternal(this.params);return this.initNextPage(t),this.page}hasNextPage(){var t;return void 0!==(null===(t=this.params.config)||void 0===t?void 0:t.pageToken)}}
/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */!function(t){t.OUTCOME_UNSPECIFIED="OUTCOME_UNSPECIFIED",t.OUTCOME_OK="OUTCOME_OK",t.OUTCOME_FAILED="OUTCOME_FAILED",t.OUTCOME_DEADLINE_EXCEEDED="OUTCOME_DEADLINE_EXCEEDED";}(k||(k={})),function(t){t.LANGUAGE_UNSPECIFIED="LANGUAGE_UNSPECIFIED",t.PYTHON="PYTHON";}(V||(V={})),function(t){t.TYPE_UNSPECIFIED="TYPE_UNSPECIFIED",t.STRING="STRING",t.NUMBER="NUMBER",t.INTEGER="INTEGER",t.BOOLEAN="BOOLEAN",t.ARRAY="ARRAY",t.OBJECT="OBJECT";}(H||(H={})),function(t){t.HARM_CATEGORY_UNSPECIFIED="HARM_CATEGORY_UNSPECIFIED",t.HARM_CATEGORY_HATE_SPEECH="HARM_CATEGORY_HATE_SPEECH",t.HARM_CATEGORY_DANGEROUS_CONTENT="HARM_CATEGORY_DANGEROUS_CONTENT",t.HARM_CATEGORY_HARASSMENT="HARM_CATEGORY_HARASSMENT",t.HARM_CATEGORY_SEXUALLY_EXPLICIT="HARM_CATEGORY_SEXUALLY_EXPLICIT",t.HARM_CATEGORY_CIVIC_INTEGRITY="HARM_CATEGORY_CIVIC_INTEGRITY";}(F||(F={})),function(t){t.HARM_BLOCK_METHOD_UNSPECIFIED="HARM_BLOCK_METHOD_UNSPECIFIED",t.SEVERITY="SEVERITY",t.PROBABILITY="PROBABILITY";}(j||(j={})),function(t){t.HARM_BLOCK_THRESHOLD_UNSPECIFIED="HARM_BLOCK_THRESHOLD_UNSPECIFIED",t.BLOCK_LOW_AND_ABOVE="BLOCK_LOW_AND_ABOVE",t.BLOCK_MEDIUM_AND_ABOVE="BLOCK_MEDIUM_AND_ABOVE",t.BLOCK_ONLY_HIGH="BLOCK_ONLY_HIGH",t.BLOCK_NONE="BLOCK_NONE",t.OFF="OFF";}(B||(B={})),function(t){t.MODE_UNSPECIFIED="MODE_UNSPECIFIED",t.MODE_DYNAMIC="MODE_DYNAMIC";}(Y||(Y={})),function(t){t.FINISH_REASON_UNSPECIFIED="FINISH_REASON_UNSPECIFIED",t.STOP="STOP",t.MAX_TOKENS="MAX_TOKENS",t.SAFETY="SAFETY",t.RECITATION="RECITATION",t.OTHER="OTHER",t.BLOCKLIST="BLOCKLIST",t.PROHIBITED_CONTENT="PROHIBITED_CONTENT",t.SPII="SPII",t.MALFORMED_FUNCTION_CALL="MALFORMED_FUNCTION_CALL",t.IMAGE_SAFETY="IMAGE_SAFETY";}(K||(K={})),function(t){t.HARM_PROBABILITY_UNSPECIFIED="HARM_PROBABILITY_UNSPECIFIED",t.NEGLIGIBLE="NEGLIGIBLE",t.LOW="LOW",t.MEDIUM="MEDIUM",t.HIGH="HIGH";}(J||(J={})),function(t){t.HARM_SEVERITY_UNSPECIFIED="HARM_SEVERITY_UNSPECIFIED",t.HARM_SEVERITY_NEGLIGIBLE="HARM_SEVERITY_NEGLIGIBLE",t.HARM_SEVERITY_LOW="HARM_SEVERITY_LOW",t.HARM_SEVERITY_MEDIUM="HARM_SEVERITY_MEDIUM",t.HARM_SEVERITY_HIGH="HARM_SEVERITY_HIGH";}(W||(W={})),function(t){t.BLOCKED_REASON_UNSPECIFIED="BLOCKED_REASON_UNSPECIFIED",t.SAFETY="SAFETY",t.OTHER="OTHER",t.BLOCKLIST="BLOCKLIST",t.PROHIBITED_CONTENT="PROHIBITED_CONTENT";}($||($={})),function(t){t.TRAFFIC_TYPE_UNSPECIFIED="TRAFFIC_TYPE_UNSPECIFIED",t.ON_DEMAND="ON_DEMAND",t.PROVISIONED_THROUGHPUT="PROVISIONED_THROUGHPUT";}(z||(z={})),function(t){t.MODALITY_UNSPECIFIED="MODALITY_UNSPECIFIED",t.TEXT="TEXT",t.IMAGE="IMAGE",t.AUDIO="AUDIO";}(X||(X={})),function(t){t.MEDIA_RESOLUTION_UNSPECIFIED="MEDIA_RESOLUTION_UNSPECIFIED",t.MEDIA_RESOLUTION_LOW="MEDIA_RESOLUTION_LOW",t.MEDIA_RESOLUTION_MEDIUM="MEDIA_RESOLUTION_MEDIUM",t.MEDIA_RESOLUTION_HIGH="MEDIA_RESOLUTION_HIGH";}(Q||(Q={})),function(t){t.FEATURE_SELECTION_PREFERENCE_UNSPECIFIED="FEATURE_SELECTION_PREFERENCE_UNSPECIFIED",t.PRIORITIZE_QUALITY="PRIORITIZE_QUALITY",t.BALANCED="BALANCED",t.PRIORITIZE_COST="PRIORITIZE_COST";}(Z||(Z={})),function(t){t.MODE_UNSPECIFIED="MODE_UNSPECIFIED",t.MODE_DYNAMIC="MODE_DYNAMIC";}(tt||(tt={})),function(t){t.MODE_UNSPECIFIED="MODE_UNSPECIFIED",t.AUTO="AUTO",t.ANY="ANY",t.NONE="NONE";}(nt||(nt={})),function(t){t.BLOCK_LOW_AND_ABOVE="BLOCK_LOW_AND_ABOVE",t.BLOCK_MEDIUM_AND_ABOVE="BLOCK_MEDIUM_AND_ABOVE",t.BLOCK_ONLY_HIGH="BLOCK_ONLY_HIGH",t.BLOCK_NONE="BLOCK_NONE";}(et||(et={})),function(t){t.DONT_ALLOW="DONT_ALLOW",t.ALLOW_ADULT="ALLOW_ADULT",t.ALLOW_ALL="ALLOW_ALL";}(ot||(ot={})),function(t){t.auto="auto",t.en="en",t.ja="ja",t.ko="ko",t.hi="hi";}(it||(it={})),function(t){t.STATE_UNSPECIFIED="STATE_UNSPECIFIED",t.PROCESSING="PROCESSING",t.ACTIVE="ACTIVE",t.FAILED="FAILED";}(st||(st={})),function(t){t.SOURCE_UNSPECIFIED="SOURCE_UNSPECIFIED",t.UPLOADED="UPLOADED",t.GENERATED="GENERATED";}(rt||(rt={})),function(t){t.MASK_MODE_DEFAULT="MASK_MODE_DEFAULT",t.MASK_MODE_USER_PROVIDED="MASK_MODE_USER_PROVIDED",t.MASK_MODE_BACKGROUND="MASK_MODE_BACKGROUND",t.MASK_MODE_FOREGROUND="MASK_MODE_FOREGROUND",t.MASK_MODE_SEMANTIC="MASK_MODE_SEMANTIC";}(lt||(lt={})),function(t){t.CONTROL_TYPE_DEFAULT="CONTROL_TYPE_DEFAULT",t.CONTROL_TYPE_CANNY="CONTROL_TYPE_CANNY",t.CONTROL_TYPE_SCRIBBLE="CONTROL_TYPE_SCRIBBLE",t.CONTROL_TYPE_FACE_MESH="CONTROL_TYPE_FACE_MESH";}(at||(at={})),function(t){t.SUBJECT_TYPE_DEFAULT="SUBJECT_TYPE_DEFAULT",t.SUBJECT_TYPE_PERSON="SUBJECT_TYPE_PERSON",t.SUBJECT_TYPE_ANIMAL="SUBJECT_TYPE_ANIMAL",t.SUBJECT_TYPE_PRODUCT="SUBJECT_TYPE_PRODUCT";}(ut||(ut={})),function(t){t.MODALITY_UNSPECIFIED="MODALITY_UNSPECIFIED",t.TEXT="TEXT",t.IMAGE="IMAGE",t.VIDEO="VIDEO",t.AUDIO="AUDIO",t.DOCUMENT="DOCUMENT";}(ct||(ct={})),function(t){t.START_SENSITIVITY_UNSPECIFIED="START_SENSITIVITY_UNSPECIFIED",t.START_SENSITIVITY_HIGH="START_SENSITIVITY_HIGH",t.START_SENSITIVITY_LOW="START_SENSITIVITY_LOW";}(pt||(pt={})),function(t){t.END_SENSITIVITY_UNSPECIFIED="END_SENSITIVITY_UNSPECIFIED",t.END_SENSITIVITY_HIGH="END_SENSITIVITY_HIGH",t.END_SENSITIVITY_LOW="END_SENSITIVITY_LOW";}(dt||(dt={})),function(t){t.ACTIVITY_HANDLING_UNSPECIFIED="ACTIVITY_HANDLING_UNSPECIFIED",t.START_OF_ACTIVITY_INTERRUPTS="START_OF_ACTIVITY_INTERRUPTS",t.NO_INTERRUPTION="NO_INTERRUPTION";}(ht||(ht={})),function(t){t.TURN_COVERAGE_UNSPECIFIED="TURN_COVERAGE_UNSPECIFIED",t.TURN_INCLUDES_ONLY_ACTIVITY="TURN_INCLUDES_ONLY_ACTIVITY",t.TURN_INCLUDES_ALL_INPUT="TURN_INCLUDES_ALL_INPUT";}(ft||(ft={}));function yt(t,n){return {fileData:{fileUri:t,mimeType:n}}}function Tt(t,n){return {inlineData:{data:t,mimeType:n}}}class Nt{get text(){var t,n,e,o,i,s,r,l;if(0===(null===(o=null===(e=null===(n=null===(t=this.candidates)||void 0===t?void 0:t[0])||void 0===n?void 0:n.content)||void 0===e?void 0:e.parts)||void 0===o?void 0:o.length))return;this.candidates&&this.candidates.length>1&&console.warn("there are multiple candidates in the response, returning text from the first one.");let a="",u=false;const c=[];for(const t of null!==(l=null===(r=null===(s=null===(i=this.candidates)||void 0===i?void 0:i[0])||void 0===s?void 0:s.content)||void 0===r?void 0:r.parts)&&void 0!==l?l:[]){for(const[n,e]of Object.entries(t))"text"===n||"thought"===n||null===e&&void 0===e||c.push(n);if("string"==typeof t.text){if("boolean"==typeof t.thought&&t.thought)continue;u=true,a+=t.text;}}return c.length>0&&console.warn(`there are non-text parts ${c} in the response, returning concatenation of all text parts. Please refer to the non text parts for a full response from model.`),u?a:void 0}get functionCalls(){var t,n,e,o,i,s,r,l;if(0===(null===(o=null===(e=null===(n=null===(t=this.candidates)||void 0===t?void 0:t[0])||void 0===n?void 0:n.content)||void 0===e?void 0:e.parts)||void 0===o?void 0:o.length))return;this.candidates&&this.candidates.length>1&&console.warn("there are multiple candidates in the response, returning function calls from the first one.");const a=null===(l=null===(r=null===(s=null===(i=this.candidates)||void 0===i?void 0:i[0])||void 0===s?void 0:s.content)||void 0===r?void 0:r.parts)||void 0===l?void 0:l.filter((t=>t.functionCall)).map((t=>t.functionCall)).filter((t=>void 0!==t));return 0!==(null==a?void 0:a.length)?a:void 0}get executableCode(){var t,n,e,o,i,s,r,l,a;if(0===(null===(o=null===(e=null===(n=null===(t=this.candidates)||void 0===t?void 0:t[0])||void 0===n?void 0:n.content)||void 0===e?void 0:e.parts)||void 0===o?void 0:o.length))return;this.candidates&&this.candidates.length>1&&console.warn("there are multiple candidates in the response, returning executable code from the first one.");const u=null===(l=null===(r=null===(s=null===(i=this.candidates)||void 0===i?void 0:i[0])||void 0===s?void 0:s.content)||void 0===r?void 0:r.parts)||void 0===l?void 0:l.filter((t=>t.executableCode)).map((t=>t.executableCode)).filter((t=>void 0!==t));return 0!==(null==u?void 0:u.length)?null===(a=null==u?void 0:u[0])||void 0===a?void 0:a.code:void 0}get codeExecutionResult(){var t,n,e,o,i,s,r,l,a;if(0===(null===(o=null===(e=null===(n=null===(t=this.candidates)||void 0===t?void 0:t[0])||void 0===n?void 0:n.content)||void 0===e?void 0:e.parts)||void 0===o?void 0:o.length))return;this.candidates&&this.candidates.length>1&&console.warn("there are multiple candidates in the response, returning code execution result from the first one.");const u=null===(l=null===(r=null===(s=null===(i=this.candidates)||void 0===i?void 0:i[0])||void 0===s?void 0:s.content)||void 0===r?void 0:r.parts)||void 0===l?void 0:l.filter((t=>t.codeExecutionResult)).map((t=>t.codeExecutionResult)).filter((t=>void 0!==t));return 0!==(null==u?void 0:u.length)?null===(a=null==u?void 0:u[0])||void 0===a?void 0:a.output:void 0}}class bt{}class Dt{}class xt{}class Mt{}class Lt{}class qt{}class Gt{}class kt{constructor(t){const n={};for(const e of t.headers.entries())n[e[0]]=e[1];this.headers=n,this.responseInternal=t;}json(){return this.responseInternal.json()}}class Vt{}class Ht{}/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */class Yt extends t{constructor(t){super(),this.apiClient=t,this.list=async(t={})=>new mt(G.PAGED_ITEM_CACHED_CONTENTS,(t=>this.listInternal(t)),await this.listInternal(t),t);}async create(t){var i,r;let l,a="",u={};if(this.apiClient.isVertexAI()){const r=function(t,n){const i={},r=o(n,["model"]);null!=r&&e(i,["model"],s(t,r));const l=o(n,["config"]);return null!=l&&e(i,["config"],x(0,l,i)),i}(this.apiClient,t);return a=n("cachedContents",r._url),u=r._query,delete r.config,delete r._url,delete r._query,l=this.apiClient.request({path:a,queryParams:u,body:JSON.stringify(r),httpMethod:"POST",httpOptions:null===(i=t.config)||void 0===i?void 0:i.httpOptions}).then((t=>t.json())),l.then((t=>q(this.apiClient,t)))}{const e=S(this.apiClient,t);return a=n("cachedContents",e._url),u=e._query,delete e.config,delete e._url,delete e._query,l=this.apiClient.request({path:a,queryParams:u,body:JSON.stringify(e),httpMethod:"POST",httpOptions:null===(r=t.config)||void 0===r?void 0:r.httpOptions}).then((t=>t.json())),l.then((t=>L(this.apiClient,t)))}}async get(t){var i,s;let r,l="",a={};if(this.apiClient.isVertexAI()){const s=function(t,n){const i={},s=o(n,["name"]);null!=s&&e(i,["_url","name"],v(t,s));const r=o(n,["config"]);return null!=r&&e(i,["config"],r),i}(this.apiClient,t);return l=n("{name}",s._url),a=s._query,delete s.config,delete s._url,delete s._query,r=this.apiClient.request({path:l,queryParams:a,body:JSON.stringify(s),httpMethod:"GET",httpOptions:null===(i=t.config)||void 0===i?void 0:i.httpOptions}).then((t=>t.json())),r.then((t=>q(this.apiClient,t)))}{const i=function(t,n){const i={},s=o(n,["name"]);null!=s&&e(i,["_url","name"],v(t,s));const r=o(n,["config"]);return null!=r&&e(i,["config"],r),i}(this.apiClient,t);return l=n("{name}",i._url),a=i._query,delete i.config,delete i._url,delete i._query,r=this.apiClient.request({path:l,queryParams:a,body:JSON.stringify(i),httpMethod:"GET",httpOptions:null===(s=t.config)||void 0===s?void 0:s.httpOptions}).then((t=>t.json())),r.then((t=>L(this.apiClient,t)))}}async delete(t){var i,s;let r,l="",a={};if(this.apiClient.isVertexAI()){const s=function(t,n){const i={},s=o(n,["name"]);null!=s&&e(i,["_url","name"],v(t,s));const r=o(n,["config"]);return null!=r&&e(i,["config"],r),i}(this.apiClient,t);return l=n("{name}",s._url),a=s._query,delete s.config,delete s._url,delete s._query,r=this.apiClient.request({path:l,queryParams:a,body:JSON.stringify(s),httpMethod:"DELETE",httpOptions:null===(i=t.config)||void 0===i?void 0:i.httpOptions}).then((t=>t.json())),r.then((()=>{const t={},n=new Lt;return Object.assign(n,t),n}))}{const i=function(t,n){const i={},s=o(n,["name"]);null!=s&&e(i,["_url","name"],v(t,s));const r=o(n,["config"]);return null!=r&&e(i,["config"],r),i}(this.apiClient,t);return l=n("{name}",i._url),a=i._query,delete i.config,delete i._url,delete i._query,r=this.apiClient.request({path:l,queryParams:a,body:JSON.stringify(i),httpMethod:"DELETE",httpOptions:null===(s=t.config)||void 0===s?void 0:s.httpOptions}).then((t=>t.json())),r.then((()=>{const t={},n=new Lt;return Object.assign(n,t),n}))}}async update(t){var e,o;let i,s="",r={};if(this.apiClient.isVertexAI()){const o=M(this.apiClient,t);return s=n("{name}",o._url),r=o._query,delete o.config,delete o._url,delete o._query,i=this.apiClient.request({path:s,queryParams:r,body:JSON.stringify(o),httpMethod:"PATCH",httpOptions:null===(e=t.config)||void 0===e?void 0:e.httpOptions}).then((t=>t.json())),i.then((t=>q(this.apiClient,t)))}{const e=w(this.apiClient,t);return s=n("{name}",e._url),r=e._query,delete e.config,delete e._url,delete e._query,i=this.apiClient.request({path:s,queryParams:r,body:JSON.stringify(e),httpMethod:"PATCH",httpOptions:null===(o=t.config)||void 0===o?void 0:o.httpOptions}).then((t=>t.json())),i.then((t=>L(this.apiClient,t)))}}async listInternal(t){var i,s;let r,l="",a={};if(this.apiClient.isVertexAI()){const s=U(this.apiClient,t);return l=n("cachedContents",s._url),a=s._query,delete s.config,delete s._url,delete s._query,r=this.apiClient.request({path:l,queryParams:a,body:JSON.stringify(s),httpMethod:"GET",httpOptions:null===(i=t.config)||void 0===i?void 0:i.httpOptions}).then((t=>t.json())),r.then((t=>{const n=function(t,n){const i={},s=o(n,["nextPageToken"]);null!=s&&e(i,["nextPageToken"],s);const r=o(n,["cachedContents"]);return null!=r&&(Array.isArray(r)?e(i,["cachedContents"],r.map((t=>q(0,t)))):e(i,["cachedContents"],r)),i}(this.apiClient,t),i=new qt;return Object.assign(i,n),i}))}{const i=P(this.apiClient,t);return l=n("cachedContents",i._url),a=i._query,delete i.config,delete i._url,delete i._query,r=this.apiClient.request({path:l,queryParams:a,body:JSON.stringify(i),httpMethod:"GET",httpOptions:null===(s=t.config)||void 0===s?void 0:s.httpOptions}).then((t=>t.json())),r.then((t=>{const n=function(t,n){const i={},s=o(n,["nextPageToken"]);null!=s&&e(i,["nextPageToken"],s);const r=o(n,["cachedContents"]);return null!=r&&(Array.isArray(r)?e(i,["cachedContents"],r.map((t=>L(0,t)))):e(i,["cachedContents"],r)),i}(this.apiClient,t),i=new qt;return Object.assign(i,n),i}))}}}function Kt(t){var n="function"==typeof Symbol&&Symbol.iterator,e=n&&t[n],o=0;if(e)return e.call(t);if(t&&"number"==typeof t.length)return {next:function(){return t&&o>=t.length&&(t=void 0),{value:t&&t[o++],done:!t}}};throw new TypeError(n?"Object is not iterable.":"Symbol.iterator is not defined.")}function Jt(t){return this instanceof Jt?(this.v=t,this):new Jt(t)}function Wt(t,n,e){if(!Symbol.asyncIterator)throw new TypeError("Symbol.asyncIterator is not defined.");var o,i=e.apply(t,n||[]),s=[];return o=Object.create(("function"==typeof AsyncIterator?AsyncIterator:Object).prototype),r("next"),r("throw"),r("return",(function(t){return function(n){return Promise.resolve(n).then(t,u)}})),o[Symbol.asyncIterator]=function(){return this},o;function r(t,n){i[t]&&(o[t]=function(n){return new Promise((function(e,o){s.push([t,n,e,o])>1||l(t,n);}))},n&&(o[t]=n(o[t])));}function l(t,n){try{(e=i[t](n)).value instanceof Jt?Promise.resolve(e.value.v).then(a,u):c(s[0][2],e);}catch(t){c(s[0][3],t);}var e;}function a(t){l("next",t);}function u(t){l("throw",t);}function c(t,n){t(n),s.shift(),s.length&&l(s[0][0],s[0][1]);}}function $t(t){if(!Symbol.asyncIterator)throw new TypeError("Symbol.asyncIterator is not defined.");var n,e=t[Symbol.asyncIterator];return e?e.call(t):(t=Kt(t),n={},o("next"),o("throw"),o("return"),n[Symbol.asyncIterator]=function(){return this},n);function o(e){n[e]=t[e]&&function(n){return new Promise((function(o,i){(function(t,n,e,o){Promise.resolve(o).then((function(n){t({value:n,done:e});}),n);})(o,i,(n=t[e](n)).done,n.value);}))};}}
/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
function zt(t){var n;if(null==t.candidates||0===t.candidates.length)return  false;const e=null===(n=t.candidates[0])||void 0===n?void 0:n.content;return void 0!==e&&Xt(e)}function Xt(t){if(void 0===t.parts||0===t.parts.length)return  false;for(const n of t.parts){if(void 0===n||0===Object.keys(n).length)return  false;if(void 0!==n.text&&""===n.text)return  false}return  true}"function"==typeof SuppressedError&&SuppressedError;class Qt{constructor(t,n){this.modelsModule=t,this.apiClient=n;}create(t){return new Zt(this.apiClient,this.modelsModule,t.model,t.config,t.history)}}class Zt{constructor(t,n,e,o={},i=[]){this.apiClient=t,this.modelsModule=n,this.model=e,this.config=o,this.history=i,this.sendPromise=Promise.resolve(),function(t){if(0!==t.length){if("user"!==t[0].role)throw new Error("History must start with a user turn.");for(const n of t)if("user"!==n.role&&"model"!==n.role)throw new Error(`Role must be user or model, but got ${n.role}.`)}}(i);}async sendMessage(t){var n;await this.sendPromise;const e=p(this.apiClient,t.message),o=this.modelsModule.generateContent({model:this.model,contents:this.getHistory(true).concat(e),config:null!==(n=t.config)&&void 0!==n?n:this.config});return this.sendPromise=(async()=>{var t,n;const i=null===(n=null===(t=(await o).candidates)||void 0===t?void 0:t[0])||void 0===n?void 0:n.content,s=i?[i]:[];this.recordHistory(e,s);})(),await this.sendPromise,o}async sendMessageStream(t){var n;await this.sendPromise;const e=p(this.apiClient,t.message),o=this.modelsModule.generateContentStream({model:this.model,contents:this.getHistory(true).concat(e),config:null!==(n=t.config)&&void 0!==n?n:this.config});this.sendPromise=o.then((()=>{}));const i=await o;return this.processStreamResponse(i,e)}getHistory(t=false){return t?function(t){if(void 0===t||0===t.length)return [];const n=[],e=t.length;let o=0,i=t[0];for(;o<e;)if("user"===t[o].role)i=t[o],o++;else {const s=[];let r=true;for(;o<e&&"model"===t[o].role;)s.push(t[o]),r&&!Xt(t[o])&&(r=false),o++;r&&(n.push(i),n.push(...s));}return n}(this.history):this.history}processStreamResponse(t,n){var e,o;return Wt(this,arguments,(function*(){var i,s,r,l;const a=[];try{for(var u,c=!0,p=$t(t);!(i=(u=yield Jt(p.next())).done);c=!0){l=u.value,c=!1;const t=l;if(zt(t)){const n=null===(o=null===(e=t.candidates)||void 0===e?void 0:e[0])||void 0===o?void 0:o.content;void 0!==n&&a.push(n);}yield yield Jt(t);}}catch(t){s={error:t};}finally{try{c||i||!(r=p.return)||(yield Jt(r.call(p)));}finally{if(s)throw s.error}}this.recordHistory(n,a);}))}recordHistory(t,n){let e=[];n.length>0&&n.every((t=>"model"===t.role))?e=n:e.push({role:"model",parts:[]}),this.history.push(t),this.history.push(...e);}}
/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */function tn(t,n){const i={},s=o(n,["config"]);return null!=s&&e(i,["config"],function(t,n,i){const s=o(n,["pageSize"]);void 0!==i&&null!=s&&e(i,["_query","pageSize"],s);const r=o(n,["pageToken"]);return void 0!==i&&null!=r&&e(i,["_query","pageToken"],r),{}}(0,s,i)),i}function nn(t,n){const i={},s=o(n,["name"]);null!=s&&e(i,["name"],s);const r=o(n,["displayName"]);null!=r&&e(i,["displayName"],r);const l=o(n,["mimeType"]);null!=l&&e(i,["mimeType"],l);const a=o(n,["sizeBytes"]);null!=a&&e(i,["sizeBytes"],a);const u=o(n,["createTime"]);null!=u&&e(i,["createTime"],u);const c=o(n,["expirationTime"]);null!=c&&e(i,["expirationTime"],c);const p=o(n,["updateTime"]);null!=p&&e(i,["updateTime"],p);const d=o(n,["sha256Hash"]);null!=d&&e(i,["sha256Hash"],d);const h=o(n,["uri"]);null!=h&&e(i,["uri"],h);const f=o(n,["downloadUri"]);null!=f&&e(i,["downloadUri"],f);const m=o(n,["state"]);null!=m&&e(i,["state"],m);const g=o(n,["source"]);null!=g&&e(i,["source"],g);const y=o(n,["videoMetadata"]);null!=y&&e(i,["videoMetadata"],y);const C=o(n,["error"]);return null!=C&&e(i,["error"],function(t,n){const i={},s=o(n,["details"]);null!=s&&e(i,["details"],s);const r=o(n,["message"]);null!=r&&e(i,["message"],r);const l=o(n,["code"]);return null!=l&&e(i,["code"],l),i}(0,C)),i}function en(t,n){const i={},s=o(n,["name"]);null!=s&&e(i,["name"],s);const r=o(n,["displayName"]);null!=r&&e(i,["displayName"],r);const l=o(n,["mimeType"]);null!=l&&e(i,["mimeType"],l);const a=o(n,["sizeBytes"]);null!=a&&e(i,["sizeBytes"],a);const u=o(n,["createTime"]);null!=u&&e(i,["createTime"],u);const c=o(n,["expirationTime"]);null!=c&&e(i,["expirationTime"],c);const p=o(n,["updateTime"]);null!=p&&e(i,["updateTime"],p);const d=o(n,["sha256Hash"]);null!=d&&e(i,["sha256Hash"],d);const h=o(n,["uri"]);null!=h&&e(i,["uri"],h);const f=o(n,["downloadUri"]);null!=f&&e(i,["downloadUri"],f);const m=o(n,["state"]);null!=m&&e(i,["state"],m);const g=o(n,["source"]);null!=g&&e(i,["source"],g);const y=o(n,["videoMetadata"]);null!=y&&e(i,["videoMetadata"],y);const C=o(n,["error"]);return null!=C&&e(i,["error"],function(t,n){const i={},s=o(n,["details"]);null!=s&&e(i,["details"],s);const r=o(n,["message"]);null!=r&&e(i,["message"],r);const l=o(n,["code"]);return null!=l&&e(i,["code"],l),i}(0,C)),i}
/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
class on extends t{constructor(t){super(),this.apiClient=t,this.list=async(t={})=>new mt(G.PAGED_ITEM_FILES,(t=>this.listInternal(t)),await this.listInternal(t),t);}async upload(t){if(this.apiClient.isVertexAI())throw new Error("Vertex AI does not support uploading files. You can share files through a GCS bucket.");return this.apiClient.uploadFile(t.file,t.config).then((t=>en(this.apiClient,t)))}async listInternal(t){var i;let s,r="",l={};if(this.apiClient.isVertexAI())throw new Error("This method is only supported by the Gemini Developer API.");{const a=tn(this.apiClient,t);return r=n("files",a._url),l=a._query,delete a.config,delete a._url,delete a._query,s=this.apiClient.request({path:r,queryParams:l,body:JSON.stringify(a),httpMethod:"GET",httpOptions:null===(i=t.config)||void 0===i?void 0:i.httpOptions}).then((t=>t.json())),s.then((t=>{const n=function(t,n){const i={},s=o(n,["nextPageToken"]);null!=s&&e(i,["nextPageToken"],s);const r=o(n,["files"]);return null!=r&&(Array.isArray(r)?e(i,["files"],r.map((t=>en(0,t)))):e(i,["files"],r)),i}(this.apiClient,t),i=new Gt;return Object.assign(i,n),i}))}}async createInternal(t){var i;let s,r="",l={};if(this.apiClient.isVertexAI())throw new Error("This method is only supported by the Gemini Developer API.");{const a=function(t,n){const i={},s=o(n,["file"]);null!=s&&e(i,["file"],nn(0,s));const r=o(n,["config"]);return null!=r&&e(i,["config"],r),i}(this.apiClient,t);return r=n("upload/v1beta/files",a._url),l=a._query,delete a.config,delete a._url,delete a._query,s=this.apiClient.request({path:r,queryParams:l,body:JSON.stringify(a),httpMethod:"POST",httpOptions:null===(i=t.config)||void 0===i?void 0:i.httpOptions}).then((t=>t.json())),s.then((()=>{const t={},n=new Vt;return Object.assign(n,t),n}))}}async get(t){var i;let s,r="",l={};if(this.apiClient.isVertexAI())throw new Error("This method is only supported by the Gemini Developer API.");{const a=function(t,n){const i={},s=o(n,["name"]);null!=s&&e(i,["_url","file"],T(0,s));const r=o(n,["config"]);return null!=r&&e(i,["config"],r),i}(this.apiClient,t);return r=n("files/{file}",a._url),l=a._query,delete a.config,delete a._url,delete a._query,s=this.apiClient.request({path:r,queryParams:l,body:JSON.stringify(a),httpMethod:"GET",httpOptions:null===(i=t.config)||void 0===i?void 0:i.httpOptions}).then((t=>t.json())),s.then((t=>en(this.apiClient,t)))}}async delete(t){var i;let s,r="",l={};if(this.apiClient.isVertexAI())throw new Error("This method is only supported by the Gemini Developer API.");{const a=function(t,n){const i={},s=o(n,["name"]);null!=s&&e(i,["_url","file"],T(0,s));const r=o(n,["config"]);return null!=r&&e(i,["config"],r),i}(this.apiClient,t);return r=n("files/{file}",a._url),l=a._query,delete a.config,delete a._url,delete a._query,s=this.apiClient.request({path:r,queryParams:l,body:JSON.stringify(a),httpMethod:"DELETE",httpOptions:null===(i=t.config)||void 0===i?void 0:i.httpOptions}).then((t=>t.json())),s.then((()=>{const t={},n=new Ht;return Object.assign(n,t),n}))}}}
/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */function sn(t,n){const i={},s=o(n,["parts"]);null!=s&&(Array.isArray(s)?e(i,["parts"],s.map((t=>function(t,n){const i={};if(void 0!==o(n,["videoMetadata"]))throw new Error("videoMetadata parameter is not supported in Gemini API.");const s=o(n,["thought"]);null!=s&&e(i,["thought"],s);const r=o(n,["codeExecutionResult"]);null!=r&&e(i,["codeExecutionResult"],r);const l=o(n,["executableCode"]);null!=l&&e(i,["executableCode"],l);const a=o(n,["fileData"]);null!=a&&e(i,["fileData"],a);const u=o(n,["functionCall"]);null!=u&&e(i,["functionCall"],u);const c=o(n,["functionResponse"]);null!=c&&e(i,["functionResponse"],c);const p=o(n,["inlineData"]);null!=p&&e(i,["inlineData"],p);const d=o(n,["text"]);return null!=d&&e(i,["text"],d),i}(0,t)))):e(i,["parts"],s));const r=o(n,["role"]);return null!=r&&e(i,["role"],r),i}function rn(t,n){const i={},s=o(n,["parts"]);null!=s&&(Array.isArray(s)?e(i,["parts"],s.map((t=>function(t,n){const i={},s=o(n,["videoMetadata"]);null!=s&&e(i,["videoMetadata"],s);const r=o(n,["thought"]);null!=r&&e(i,["thought"],r);const l=o(n,["codeExecutionResult"]);null!=l&&e(i,["codeExecutionResult"],l);const a=o(n,["executableCode"]);null!=a&&e(i,["executableCode"],a);const u=o(n,["fileData"]);null!=u&&e(i,["fileData"],u);const c=o(n,["functionCall"]);null!=c&&e(i,["functionCall"],c);const p=o(n,["functionResponse"]);null!=p&&e(i,["functionResponse"],p);const d=o(n,["inlineData"]);null!=d&&e(i,["inlineData"],d);const h=o(n,["text"]);return null!=h&&e(i,["text"],h),i}(0,t)))):e(i,["parts"],s));const r=o(n,["role"]);return null!=r&&e(i,["role"],r),i}function ln(t,n){const i={},s=o(n,["response"]);null!=s&&e(i,["response"],function(t,n){const i={},s=o(n,["example"]);null!=s&&e(i,["example"],s);const r=o(n,["pattern"]);null!=r&&e(i,["pattern"],r);const l=o(n,["default"]);null!=l&&e(i,["default"],l);const a=o(n,["maxLength"]);null!=a&&e(i,["maxLength"],a);const u=o(n,["minLength"]);null!=u&&e(i,["minLength"],u);const c=o(n,["minProperties"]);null!=c&&e(i,["minProperties"],c);const p=o(n,["maxProperties"]);null!=p&&e(i,["maxProperties"],p);const d=o(n,["anyOf"]);null!=d&&e(i,["anyOf"],d);const h=o(n,["description"]);null!=h&&e(i,["description"],h);const f=o(n,["enum"]);null!=f&&e(i,["enum"],f);const m=o(n,["format"]);null!=m&&e(i,["format"],m);const g=o(n,["items"]);null!=g&&e(i,["items"],g);const y=o(n,["maxItems"]);null!=y&&e(i,["maxItems"],y);const C=o(n,["maximum"]);null!=C&&e(i,["maximum"],C);const v=o(n,["minItems"]);null!=v&&e(i,["minItems"],v);const E=o(n,["minimum"]);null!=E&&e(i,["minimum"],E);const T=o(n,["nullable"]);null!=T&&e(i,["nullable"],T);const O=o(n,["properties"]);null!=O&&e(i,["properties"],O);const I=o(n,["propertyOrdering"]);null!=I&&e(i,["propertyOrdering"],I);const A=o(n,["required"]);null!=A&&e(i,["required"],A);const _=o(n,["title"]);null!=_&&e(i,["title"],_);const S=o(n,["type"]);return null!=S&&e(i,["type"],S),i}(0,s));const r=o(n,["description"]);null!=r&&e(i,["description"],r);const l=o(n,["name"]);null!=l&&e(i,["name"],l);const a=o(n,["parameters"]);return null!=a&&e(i,["parameters"],a),i}function an(t,n){const i={},s=o(n,["dynamicRetrievalConfig"]);return null!=s&&e(i,["dynamicRetrievalConfig"],function(t,n){const i={},s=o(n,["mode"]);null!=s&&e(i,["mode"],s);const r=o(n,["dynamicThreshold"]);return null!=r&&e(i,["dynamicThreshold"],r),i}(0,s)),i}function un(t,n){const i={},s=o(n,["dynamicRetrievalConfig"]);return null!=s&&e(i,["dynamicRetrievalConfig"],function(t,n){const i={},s=o(n,["mode"]);null!=s&&e(i,["mode"],s);const r=o(n,["dynamicThreshold"]);return null!=r&&e(i,["dynamicThreshold"],r),i}(0,s)),i}function cn(t,n){const i={},s=o(n,["functionDeclarations"]);if(null!=s&&(Array.isArray(s)?e(i,["functionDeclarations"],s.map((t=>function(t,n){const i={};if(void 0!==o(n,["response"]))throw new Error("response parameter is not supported in Gemini API.");const s=o(n,["description"]);null!=s&&e(i,["description"],s);const r=o(n,["name"]);null!=r&&e(i,["name"],r);const l=o(n,["parameters"]);return null!=l&&e(i,["parameters"],l),i}(0,t)))):e(i,["functionDeclarations"],s)),void 0!==o(n,["retrieval"]))throw new Error("retrieval parameter is not supported in Gemini API.");null!=o(n,["googleSearch"])&&e(i,["googleSearch"],{});const r=o(n,["googleSearchRetrieval"]);null!=r&&e(i,["googleSearchRetrieval"],an(0,r));const l=o(n,["codeExecution"]);return null!=l&&e(i,["codeExecution"],l),i}function pn(t,n){const i={},s=o(n,["automaticActivityDetection"]);null!=s&&e(i,["automaticActivityDetection"],function(t,n){const i={},s=o(n,["disabled"]);null!=s&&e(i,["disabled"],s);const r=o(n,["startOfSpeechSensitivity"]);null!=r&&e(i,["startOfSpeechSensitivity"],r);const l=o(n,["endOfSpeechSensitivity"]);null!=l&&e(i,["endOfSpeechSensitivity"],l);const a=o(n,["prefixPaddingMs"]);null!=a&&e(i,["prefixPaddingMs"],a);const u=o(n,["silenceDurationMs"]);return null!=u&&e(i,["silenceDurationMs"],u),i}(0,s));const r=o(n,["activityHandling"]);null!=r&&e(i,["activityHandling"],r);const l=o(n,["turnCoverage"]);return null!=l&&e(i,["turnCoverage"],l),i}function dn(t,n){const i={},s=o(n,["automaticActivityDetection"]);null!=s&&e(i,["automaticActivityDetection"],function(t,n){const i={},s=o(n,["disabled"]);null!=s&&e(i,["disabled"],s);const r=o(n,["startOfSpeechSensitivity"]);null!=r&&e(i,["startOfSpeechSensitivity"],r);const l=o(n,["endOfSpeechSensitivity"]);null!=l&&e(i,["endOfSpeechSensitivity"],l);const a=o(n,["prefixPaddingMs"]);null!=a&&e(i,["prefixPaddingMs"],a);const u=o(n,["silenceDurationMs"]);return null!=u&&e(i,["silenceDurationMs"],u),i}(0,s));const r=o(n,["activityHandling"]);null!=r&&e(i,["activityHandling"],r);const l=o(n,["turnCoverage"]);return null!=l&&e(i,["turnCoverage"],l),i}function hn(t,n){const i={},s=o(n,["triggerTokens"]);null!=s&&e(i,["triggerTokens"],s);const r=o(n,["slidingWindow"]);return null!=r&&e(i,["slidingWindow"],function(t,n){const i={},s=o(n,["targetTokens"]);return null!=s&&e(i,["targetTokens"],s),i}(0,r)),i}function fn(t,n){const i={},s=o(n,["triggerTokens"]);null!=s&&e(i,["triggerTokens"],s);const r=o(n,["slidingWindow"]);return null!=r&&e(i,["slidingWindow"],function(t,n){const i={},s=o(n,["targetTokens"]);return null!=s&&e(i,["targetTokens"],s),i}(0,r)),i}function mn(t,n,i){const s=o(n,["generationConfig"]);void 0!==i&&null!=s&&e(i,["setup","generationConfig"],s);const r=o(n,["responseModalities"]);void 0!==i&&null!=r&&e(i,["setup","generationConfig","responseModalities"],r);const l=o(n,["temperature"]);void 0!==i&&null!=l&&e(i,["setup","generationConfig","temperature"],l);const a=o(n,["topP"]);void 0!==i&&null!=a&&e(i,["setup","generationConfig","topP"],a);const u=o(n,["topK"]);void 0!==i&&null!=u&&e(i,["setup","generationConfig","topK"],u);const c=o(n,["maxOutputTokens"]);void 0!==i&&null!=c&&e(i,["setup","generationConfig","maxOutputTokens"],c);const d=o(n,["mediaResolution"]);void 0!==i&&null!=d&&e(i,["setup","generationConfig","mediaResolution"],d);const h=o(n,["seed"]);void 0!==i&&null!=h&&e(i,["setup","generationConfig","seed"],h);const f=o(n,["speechConfig"]);void 0!==i&&null!=f&&e(i,["setup","generationConfig","speechConfig"],f);const m=o(n,["systemInstruction"]);void 0!==i&&null!=m&&e(i,["setup","systemInstruction"],sn(0,p(0,m)));const g=o(n,["tools"]);void 0!==i&&null!=g&&(Array.isArray(g)?e(i,["setup","tools"],C(0,C(0,g).map((t=>cn(0,y(0,t)))))):e(i,["setup","tools"],C(0,g)));const v=o(n,["sessionResumption"]);if(void 0!==i&&null!=v&&e(i,["setup","sessionResumption"],function(t,n){const i={},s=o(n,["handle"]);if(null!=s&&e(i,["handle"],s),void 0!==o(n,["transparent"]))throw new Error("transparent parameter is not supported in Gemini API.");return i}(0,v)),void 0!==o(n,["inputAudioTranscription"]))throw new Error("inputAudioTranscription parameter is not supported in Gemini API.");const E=o(n,["outputAudioTranscription"]);void 0!==i&&null!=E&&e(i,["setup","outputAudioTranscription"],{});const T=o(n,["realtimeInputConfig"]);void 0!==i&&null!=T&&e(i,["setup","realtimeInputConfig"],pn(0,T));const O=o(n,["contextWindowCompression"]);return void 0!==i&&null!=O&&e(i,["setup","contextWindowCompression"],hn(0,O)),{}}function gn(t,n,i){const s=o(n,["generationConfig"]);void 0!==i&&null!=s&&e(i,["setup","generationConfig"],s);const r=o(n,["responseModalities"]);void 0!==i&&null!=r&&e(i,["setup","generationConfig","responseModalities"],r);const l=o(n,["temperature"]);void 0!==i&&null!=l&&e(i,["setup","generationConfig","temperature"],l);const a=o(n,["topP"]);void 0!==i&&null!=a&&e(i,["setup","generationConfig","topP"],a);const u=o(n,["topK"]);void 0!==i&&null!=u&&e(i,["setup","generationConfig","topK"],u);const c=o(n,["maxOutputTokens"]);void 0!==i&&null!=c&&e(i,["setup","generationConfig","maxOutputTokens"],c);const d=o(n,["mediaResolution"]);void 0!==i&&null!=d&&e(i,["setup","generationConfig","mediaResolution"],d);const h=o(n,["seed"]);void 0!==i&&null!=h&&e(i,["setup","generationConfig","seed"],h);const f=o(n,["speechConfig"]);void 0!==i&&null!=f&&e(i,["setup","generationConfig","speechConfig"],f);const m=o(n,["systemInstruction"]);void 0!==i&&null!=m&&e(i,["setup","systemInstruction"],rn(0,p(0,m)));const g=o(n,["tools"]);void 0!==i&&null!=g&&(Array.isArray(g)?e(i,["setup","tools"],C(0,C(0,g).map((t=>function(t,n){const i={},s=o(n,["functionDeclarations"]);null!=s&&(Array.isArray(s)?e(i,["functionDeclarations"],s.map((t=>ln(0,t)))):e(i,["functionDeclarations"],s));const r=o(n,["retrieval"]);null!=r&&e(i,["retrieval"],r),null!=o(n,["googleSearch"])&&e(i,["googleSearch"],{});const l=o(n,["googleSearchRetrieval"]);null!=l&&e(i,["googleSearchRetrieval"],un(0,l));const a=o(n,["codeExecution"]);return null!=a&&e(i,["codeExecution"],a),i}(0,y(0,t)))))):e(i,["setup","tools"],C(0,g)));const v=o(n,["sessionResumption"]);void 0!==i&&null!=v&&e(i,["setup","sessionResumption"],function(t,n){const i={},s=o(n,["handle"]);null!=s&&e(i,["handle"],s);const r=o(n,["transparent"]);return null!=r&&e(i,["transparent"],r),i}(0,v));const E=o(n,["inputAudioTranscription"]);void 0!==i&&null!=E&&e(i,["setup","inputAudioTranscription"],{});const T=o(n,["outputAudioTranscription"]);void 0!==i&&null!=T&&e(i,["setup","outputAudioTranscription"],{});const O=o(n,["realtimeInputConfig"]);void 0!==i&&null!=O&&e(i,["setup","realtimeInputConfig"],dn(0,O));const I=o(n,["contextWindowCompression"]);return void 0!==i&&null!=I&&e(i,["setup","contextWindowCompression"],fn(0,I)),{}}function yn(t,n){const i={},s=o(n,["parts"]);null!=s&&(Array.isArray(s)?e(i,["parts"],s.map((t=>function(t,n){const i={},s=o(n,["thought"]);null!=s&&e(i,["thought"],s);const r=o(n,["codeExecutionResult"]);null!=r&&e(i,["codeExecutionResult"],r);const l=o(n,["executableCode"]);null!=l&&e(i,["executableCode"],l);const a=o(n,["fileData"]);null!=a&&e(i,["fileData"],a);const u=o(n,["functionCall"]);null!=u&&e(i,["functionCall"],u);const c=o(n,["functionResponse"]);null!=c&&e(i,["functionResponse"],c);const p=o(n,["inlineData"]);null!=p&&e(i,["inlineData"],p);const d=o(n,["text"]);return null!=d&&e(i,["text"],d),i}(0,t)))):e(i,["parts"],s));const r=o(n,["role"]);return null!=r&&e(i,["role"],r),i}function Cn(t,n){const i={},s=o(n,["parts"]);null!=s&&(Array.isArray(s)?e(i,["parts"],s.map((t=>function(t,n){const i={},s=o(n,["videoMetadata"]);null!=s&&e(i,["videoMetadata"],s);const r=o(n,["thought"]);null!=r&&e(i,["thought"],r);const l=o(n,["codeExecutionResult"]);null!=l&&e(i,["codeExecutionResult"],l);const a=o(n,["executableCode"]);null!=a&&e(i,["executableCode"],a);const u=o(n,["fileData"]);null!=u&&e(i,["fileData"],u);const c=o(n,["functionCall"]);null!=c&&e(i,["functionCall"],c);const p=o(n,["functionResponse"]);null!=p&&e(i,["functionResponse"],p);const d=o(n,["inlineData"]);null!=d&&e(i,["inlineData"],d);const h=o(n,["text"]);return null!=h&&e(i,["text"],h),i}(0,t)))):e(i,["parts"],s));const r=o(n,["role"]);return null!=r&&e(i,["role"],r),i}function vn(t,n){const i={},s=o(n,["text"]);null!=s&&e(i,["text"],s);const r=o(n,["finished"]);return null!=r&&e(i,["finished"],r),i}function En(t,n){const i={},s=o(n,["text"]);null!=s&&e(i,["text"],s);const r=o(n,["finished"]);return null!=r&&e(i,["finished"],r),i}function Tn(t,n){const i={},s=o(n,["functionCalls"]);return null!=s&&(Array.isArray(s)?e(i,["functionCalls"],s.map((t=>function(t,n){const i={},s=o(n,["id"]);null!=s&&e(i,["id"],s);const r=o(n,["args"]);null!=r&&e(i,["args"],r);const l=o(n,["name"]);return null!=l&&e(i,["name"],l),i}(0,t)))):e(i,["functionCalls"],s)),i}function On(t,n){const i={},s=o(n,["functionCalls"]);return null!=s&&(Array.isArray(s)?e(i,["functionCalls"],s.map((t=>function(t,n){const i={},s=o(n,["args"]);null!=s&&e(i,["args"],s);const r=o(n,["name"]);return null!=r&&e(i,["name"],r),i}(0,t)))):e(i,["functionCalls"],s)),i}function In(t,n){const i={},s=o(n,["modality"]);null!=s&&e(i,["modality"],s);const r=o(n,["tokenCount"]);return null!=r&&e(i,["tokenCount"],r),i}function An(t,n){const i={},s=o(n,["modality"]);null!=s&&e(i,["modality"],s);const r=o(n,["tokenCount"]);return null!=r&&e(i,["tokenCount"],r),i}function _n(t,n){const i={};null!=o(n,["setupComplete"])&&e(i,["setupComplete"],{});const s=o(n,["serverContent"]);null!=s&&e(i,["serverContent"],function(t,n){const i={},s=o(n,["modelTurn"]);null!=s&&e(i,["modelTurn"],yn(0,s));const r=o(n,["turnComplete"]);null!=r&&e(i,["turnComplete"],r);const l=o(n,["interrupted"]);null!=l&&e(i,["interrupted"],l);const a=o(n,["generationComplete"]);null!=a&&e(i,["generationComplete"],a);const u=o(n,["inputTranscription"]);null!=u&&e(i,["inputTranscription"],vn(0,u));const c=o(n,["outputTranscription"]);return null!=c&&e(i,["outputTranscription"],vn(0,c)),i}(0,s));const r=o(n,["toolCall"]);null!=r&&e(i,["toolCall"],Tn(0,r));const l=o(n,["toolCallCancellation"]);null!=l&&e(i,["toolCallCancellation"],function(t,n){const i={},s=o(n,["ids"]);return null!=s&&e(i,["ids"],s),i}(0,l));const a=o(n,["usageMetadata"]);null!=a&&e(i,["usageMetadata"],function(t,n){const i={},s=o(n,["promptTokenCount"]);null!=s&&e(i,["promptTokenCount"],s);const r=o(n,["cachedContentTokenCount"]);null!=r&&e(i,["cachedContentTokenCount"],r);const l=o(n,["responseTokenCount"]);null!=l&&e(i,["responseTokenCount"],l);const a=o(n,["toolUsePromptTokenCount"]);null!=a&&e(i,["toolUsePromptTokenCount"],a);const u=o(n,["thoughtsTokenCount"]);null!=u&&e(i,["thoughtsTokenCount"],u);const c=o(n,["totalTokenCount"]);null!=c&&e(i,["totalTokenCount"],c);const p=o(n,["promptTokensDetails"]);null!=p&&(Array.isArray(p)?e(i,["promptTokensDetails"],p.map((t=>In(0,t)))):e(i,["promptTokensDetails"],p));const d=o(n,["cacheTokensDetails"]);null!=d&&(Array.isArray(d)?e(i,["cacheTokensDetails"],d.map((t=>In(0,t)))):e(i,["cacheTokensDetails"],d));const h=o(n,["responseTokensDetails"]);null!=h&&(Array.isArray(h)?e(i,["responseTokensDetails"],h.map((t=>In(0,t)))):e(i,["responseTokensDetails"],h));const f=o(n,["toolUsePromptTokensDetails"]);return null!=f&&(Array.isArray(f)?e(i,["toolUsePromptTokensDetails"],f.map((t=>In(0,t)))):e(i,["toolUsePromptTokensDetails"],f)),i}(0,a));const u=o(n,["goAway"]);null!=u&&e(i,["goAway"],function(t,n){const i={},s=o(n,["timeLeft"]);return null!=s&&e(i,["timeLeft"],s),i}(0,u));const c=o(n,["sessionResumptionUpdate"]);return null!=c&&e(i,["sessionResumptionUpdate"],function(t,n){const i={},s=o(n,["newHandle"]);null!=s&&e(i,["newHandle"],s);const r=o(n,["resumable"]);null!=r&&e(i,["resumable"],r);const l=o(n,["lastConsumedClientMessageIndex"]);return null!=l&&e(i,["lastConsumedClientMessageIndex"],l),i}(0,c)),i}function Sn(t,n){const i={};null!=o(n,["setupComplete"])&&e(i,["setupComplete"],{});const s=o(n,["serverContent"]);null!=s&&e(i,["serverContent"],function(t,n){const i={},s=o(n,["modelTurn"]);null!=s&&e(i,["modelTurn"],Cn(0,s));const r=o(n,["turnComplete"]);null!=r&&e(i,["turnComplete"],r);const l=o(n,["interrupted"]);null!=l&&e(i,["interrupted"],l);const a=o(n,["generationComplete"]);null!=a&&e(i,["generationComplete"],a);const u=o(n,["inputTranscription"]);null!=u&&e(i,["inputTranscription"],En(0,u));const c=o(n,["outputTranscription"]);return null!=c&&e(i,["outputTranscription"],En(0,c)),i}(0,s));const r=o(n,["toolCall"]);null!=r&&e(i,["toolCall"],On(0,r));const l=o(n,["toolCallCancellation"]);null!=l&&e(i,["toolCallCancellation"],function(t,n){const i={},s=o(n,["ids"]);return null!=s&&e(i,["ids"],s),i}(0,l));const a=o(n,["usageMetadata"]);null!=a&&e(i,["usageMetadata"],function(t,n){const i={},s=o(n,["promptTokenCount"]);null!=s&&e(i,["promptTokenCount"],s);const r=o(n,["cachedContentTokenCount"]);null!=r&&e(i,["cachedContentTokenCount"],r);const l=o(n,["candidatesTokenCount"]);null!=l&&e(i,["responseTokenCount"],l);const a=o(n,["toolUsePromptTokenCount"]);null!=a&&e(i,["toolUsePromptTokenCount"],a);const u=o(n,["thoughtsTokenCount"]);null!=u&&e(i,["thoughtsTokenCount"],u);const c=o(n,["totalTokenCount"]);null!=c&&e(i,["totalTokenCount"],c);const p=o(n,["promptTokensDetails"]);null!=p&&(Array.isArray(p)?e(i,["promptTokensDetails"],p.map((t=>An(0,t)))):e(i,["promptTokensDetails"],p));const d=o(n,["cacheTokensDetails"]);null!=d&&(Array.isArray(d)?e(i,["cacheTokensDetails"],d.map((t=>An(0,t)))):e(i,["cacheTokensDetails"],d));const h=o(n,["candidatesTokensDetails"]);null!=h&&(Array.isArray(h)?e(i,["responseTokensDetails"],h.map((t=>An(0,t)))):e(i,["responseTokensDetails"],h));const f=o(n,["toolUsePromptTokensDetails"]);null!=f&&(Array.isArray(f)?e(i,["toolUsePromptTokensDetails"],f.map((t=>An(0,t)))):e(i,["toolUsePromptTokensDetails"],f));const m=o(n,["trafficType"]);return null!=m&&e(i,["trafficType"],m),i}(0,a));const u=o(n,["goAway"]);null!=u&&e(i,["goAway"],function(t,n){const i={},s=o(n,["timeLeft"]);return null!=s&&e(i,["timeLeft"],s),i}(0,u));const c=o(n,["sessionResumptionUpdate"]);return null!=c&&e(i,["sessionResumptionUpdate"],function(t,n){const i={},s=o(n,["newHandle"]);null!=s&&e(i,["newHandle"],s);const r=o(n,["resumable"]);null!=r&&e(i,["resumable"],r);const l=o(n,["lastConsumedClientMessageIndex"]);return null!=l&&e(i,["lastConsumedClientMessageIndex"],l),i}(0,c)),i}
/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */function wn(t,n){const i={},s=o(n,["parts"]);null!=s&&(Array.isArray(s)?e(i,["parts"],s.map((t=>function(t,n){const i={};if(void 0!==o(n,["videoMetadata"]))throw new Error("videoMetadata parameter is not supported in Gemini API.");const s=o(n,["thought"]);null!=s&&e(i,["thought"],s);const r=o(n,["codeExecutionResult"]);null!=r&&e(i,["codeExecutionResult"],r);const l=o(n,["executableCode"]);null!=l&&e(i,["executableCode"],l);const a=o(n,["fileData"]);null!=a&&e(i,["fileData"],a);const u=o(n,["functionCall"]);null!=u&&e(i,["functionCall"],u);const c=o(n,["functionResponse"]);null!=c&&e(i,["functionResponse"],c);const p=o(n,["inlineData"]);null!=p&&e(i,["inlineData"],p);const d=o(n,["text"]);return null!=d&&e(i,["text"],d),i}(0,t)))):e(i,["parts"],s));const r=o(n,["role"]);return null!=r&&e(i,["role"],r),i}function Pn(t,n){const i={},s=o(n,["dynamicRetrievalConfig"]);return null!=s&&e(i,["dynamicRetrievalConfig"],function(t,n){const i={},s=o(n,["mode"]);null!=s&&e(i,["mode"],s);const r=o(n,["dynamicThreshold"]);return null!=r&&e(i,["dynamicThreshold"],r),i}(0,s)),i}function Rn(t,n){const i={},s=o(n,["functionDeclarations"]);if(null!=s&&(Array.isArray(s)?e(i,["functionDeclarations"],s.map((t=>function(t,n){const i={};if(void 0!==o(n,["response"]))throw new Error("response parameter is not supported in Gemini API.");const s=o(n,["description"]);null!=s&&e(i,["description"],s);const r=o(n,["name"]);null!=r&&e(i,["name"],r);const l=o(n,["parameters"]);return null!=l&&e(i,["parameters"],l),i}(0,t)))):e(i,["functionDeclarations"],s)),void 0!==o(n,["retrieval"]))throw new Error("retrieval parameter is not supported in Gemini API.");null!=o(n,["googleSearch"])&&e(i,["googleSearch"],{});const r=o(n,["googleSearchRetrieval"]);null!=r&&e(i,["googleSearchRetrieval"],Pn(0,r));const l=o(n,["codeExecution"]);return null!=l&&e(i,["codeExecution"],l),i}function Nn(t,n){const i={},s=o(n,["functionCallingConfig"]);return null!=s&&e(i,["functionCallingConfig"],function(t,n){const i={},s=o(n,["mode"]);null!=s&&e(i,["mode"],s);const r=o(n,["allowedFunctionNames"]);return null!=r&&e(i,["allowedFunctionNames"],r),i}(0,s)),i}function bn(t,n){const i={},s=o(n,["prebuiltVoiceConfig"]);return null!=s&&e(i,["prebuiltVoiceConfig"],function(t,n){const i={},s=o(n,["voiceName"]);return null!=s&&e(i,["voiceName"],s),i}(0,s)),i}function Dn(t,n,i){const s={},r=o(n,["systemInstruction"]);void 0!==i&&null!=r&&e(i,["systemInstruction"],wn(0,p(0,r)));const l=o(n,["temperature"]);null!=l&&e(s,["temperature"],l);const a=o(n,["topP"]);null!=a&&e(s,["topP"],a);const u=o(n,["topK"]);null!=u&&e(s,["topK"],u);const c=o(n,["candidateCount"]);null!=c&&e(s,["candidateCount"],c);const d=o(n,["maxOutputTokens"]);null!=d&&e(s,["maxOutputTokens"],d);const h=o(n,["stopSequences"]);null!=h&&e(s,["stopSequences"],h);const f=o(n,["responseLogprobs"]);null!=f&&e(s,["responseLogprobs"],f);const E=o(n,["logprobs"]);null!=E&&e(s,["logprobs"],E);const T=o(n,["presencePenalty"]);null!=T&&e(s,["presencePenalty"],T);const O=o(n,["frequencyPenalty"]);null!=O&&e(s,["frequencyPenalty"],O);const I=o(n,["seed"]);null!=I&&e(s,["seed"],I);const A=o(n,["responseMimeType"]);null!=A&&e(s,["responseMimeType"],A);const _=o(n,["responseSchema"]);if(null!=_&&e(s,["responseSchema"],function(t,n){const i={};if(void 0!==o(n,["example"]))throw new Error("example parameter is not supported in Gemini API.");if(void 0!==o(n,["pattern"]))throw new Error("pattern parameter is not supported in Gemini API.");if(void 0!==o(n,["default"]))throw new Error("default parameter is not supported in Gemini API.");if(void 0!==o(n,["maxLength"]))throw new Error("maxLength parameter is not supported in Gemini API.");if(void 0!==o(n,["minLength"]))throw new Error("minLength parameter is not supported in Gemini API.");if(void 0!==o(n,["minProperties"]))throw new Error("minProperties parameter is not supported in Gemini API.");if(void 0!==o(n,["maxProperties"]))throw new Error("maxProperties parameter is not supported in Gemini API.");const s=o(n,["anyOf"]);null!=s&&e(i,["anyOf"],s);const r=o(n,["description"]);null!=r&&e(i,["description"],r);const l=o(n,["enum"]);null!=l&&e(i,["enum"],l);const a=o(n,["format"]);null!=a&&e(i,["format"],a);const u=o(n,["items"]);null!=u&&e(i,["items"],u);const c=o(n,["maxItems"]);null!=c&&e(i,["maxItems"],c);const p=o(n,["maximum"]);null!=p&&e(i,["maximum"],p);const d=o(n,["minItems"]);null!=d&&e(i,["minItems"],d);const h=o(n,["minimum"]);null!=h&&e(i,["minimum"],h);const f=o(n,["nullable"]);null!=f&&e(i,["nullable"],f);const m=o(n,["properties"]);null!=m&&e(i,["properties"],m);const g=o(n,["propertyOrdering"]);null!=g&&e(i,["propertyOrdering"],g);const y=o(n,["required"]);null!=y&&e(i,["required"],y);const C=o(n,["title"]);null!=C&&e(i,["title"],C);const v=o(n,["type"]);return null!=v&&e(i,["type"],v),i}(0,m(t,_))),void 0!==o(n,["routingConfig"]))throw new Error("routingConfig parameter is not supported in Gemini API.");if(void 0!==o(n,["modelSelectionConfig"]))throw new Error("modelSelectionConfig parameter is not supported in Gemini API.");const S=o(n,["safetySettings"]);void 0!==i&&null!=S&&(Array.isArray(S)?e(i,["safetySettings"],S.map((t=>function(t,n){const i={};if(void 0!==o(n,["method"]))throw new Error("method parameter is not supported in Gemini API.");const s=o(n,["category"]);null!=s&&e(i,["category"],s);const r=o(n,["threshold"]);return null!=r&&e(i,["threshold"],r),i}(0,t)))):e(i,["safetySettings"],S));const w=o(n,["tools"]);void 0!==i&&null!=w&&(Array.isArray(w)?e(i,["tools"],C(0,C(0,w).map((t=>Rn(0,y(0,t)))))):e(i,["tools"],C(0,w)));const P=o(n,["toolConfig"]);if(void 0!==i&&null!=P&&e(i,["toolConfig"],Nn(0,P)),void 0!==o(n,["labels"]))throw new Error("labels parameter is not supported in Gemini API.");const R=o(n,["cachedContent"]);void 0!==i&&null!=R&&e(i,["cachedContent"],v(t,R));const N=o(n,["responseModalities"]);null!=N&&e(s,["responseModalities"],N);const b=o(n,["mediaResolution"]);null!=b&&e(s,["mediaResolution"],b);const D=o(n,["speechConfig"]);if(null!=D&&e(s,["speechConfig"],function(t,n){const i={},s=o(n,["voiceConfig"]);null!=s&&e(i,["voiceConfig"],bn(0,s));const r=o(n,["languageCode"]);return null!=r&&e(i,["languageCode"],r),i}(0,g(0,D))),void 0!==o(n,["audioTimestamp"]))throw new Error("audioTimestamp parameter is not supported in Gemini API.");const x=o(n,["thinkingConfig"]);return null!=x&&e(s,["thinkingConfig"],function(t,n){const i={},s=o(n,["includeThoughts"]);null!=s&&e(i,["includeThoughts"],s);const r=o(n,["thinkingBudget"]);return null!=r&&e(i,["thinkingBudget"],r),i}(0,x)),s}function xn(t,n){const s={},r=o(n,["model"]);null!=r&&e(s,["_url","model"],i(t,r));const l=o(n,["contents"]);null!=l&&(Array.isArray(l)?e(s,["contents"],h(0,h(0,l).map((t=>wn(0,t))))):e(s,["contents"],h(0,l)));const a=o(n,["config"]);return null!=a&&e(s,["generationConfig"],Dn(t,a,s)),s}function Mn(t,n){const s={},r=o(n,["model"]);null!=r&&e(s,["_url","model"],i(t,r));const l=o(n,["contents"]);null!=l&&e(s,["requests[]","content"],d(t,l));const a=o(n,["config"]);null!=a&&e(s,["config"],function(t,n,i){const s=o(n,["taskType"]);void 0!==i&&null!=s&&e(i,["requests[]","taskType"],s);const r=o(n,["title"]);void 0!==i&&null!=r&&e(i,["requests[]","title"],r);const l=o(n,["outputDimensionality"]);if(void 0!==i&&null!=l&&e(i,["requests[]","outputDimensionality"],l),void 0!==o(n,["mimeType"]))throw new Error("mimeType parameter is not supported in Gemini API.");if(void 0!==o(n,["autoTruncate"]))throw new Error("autoTruncate parameter is not supported in Gemini API.");return {}}(0,a,s));const u=o(n,["model"]);return void 0!==u&&e(s,["requests[]","model"],i(t,u)),s}function Un(t,n){const s={},r=o(n,["model"]);null!=r&&e(s,["_url","model"],i(t,r));const l=o(n,["prompt"]);null!=l&&e(s,["instances[0]","prompt"],l);const a=o(n,["config"]);return null!=a&&e(s,["config"],function(t,n,i){if(void 0!==o(n,["outputGcsUri"]))throw new Error("outputGcsUri parameter is not supported in Gemini API.");if(void 0!==o(n,["negativePrompt"]))throw new Error("negativePrompt parameter is not supported in Gemini API.");const s=o(n,["numberOfImages"]);void 0!==i&&null!=s&&e(i,["parameters","sampleCount"],s);const r=o(n,["aspectRatio"]);void 0!==i&&null!=r&&e(i,["parameters","aspectRatio"],r);const l=o(n,["guidanceScale"]);if(void 0!==i&&null!=l&&e(i,["parameters","guidanceScale"],l),void 0!==o(n,["seed"]))throw new Error("seed parameter is not supported in Gemini API.");const a=o(n,["safetyFilterLevel"]);void 0!==i&&null!=a&&e(i,["parameters","safetySetting"],a);const u=o(n,["personGeneration"]);void 0!==i&&null!=u&&e(i,["parameters","personGeneration"],u);const c=o(n,["includeSafetyAttributes"]);void 0!==i&&null!=c&&e(i,["parameters","includeSafetyAttributes"],c);const p=o(n,["includeRaiReason"]);void 0!==i&&null!=p&&e(i,["parameters","includeRaiReason"],p);const d=o(n,["language"]);void 0!==i&&null!=d&&e(i,["parameters","language"],d);const h=o(n,["outputMimeType"]);void 0!==i&&null!=h&&e(i,["parameters","outputOptions","mimeType"],h);const f=o(n,["outputCompressionQuality"]);if(void 0!==i&&null!=f&&e(i,["parameters","outputOptions","compressionQuality"],f),void 0!==o(n,["addWatermark"]))throw new Error("addWatermark parameter is not supported in Gemini API.");if(void 0!==o(n,["enhancePrompt"]))throw new Error("enhancePrompt parameter is not supported in Gemini API.");return {}}(0,a,s)),s}function Ln(t,n){const s={},r=o(n,["model"]);null!=r&&e(s,["_url","model"],i(t,r));const l=o(n,["contents"]);null!=l&&(Array.isArray(l)?e(s,["contents"],h(0,h(0,l).map((t=>wn(0,t))))):e(s,["contents"],h(0,l)));const a=o(n,["config"]);return null!=a&&e(s,["config"],function(t,n){if(void 0!==o(n,["systemInstruction"]))throw new Error("systemInstruction parameter is not supported in Gemini API.");if(void 0!==o(n,["tools"]))throw new Error("tools parameter is not supported in Gemini API.");if(void 0!==o(n,["generationConfig"]))throw new Error("generationConfig parameter is not supported in Gemini API.");return {}}(0,a)),s}function qn(t,n){const s={},r=o(n,["model"]);null!=r&&e(s,["_url","model"],i(t,r));const l=o(n,["prompt"]);null!=l&&e(s,["instances[0]","prompt"],l);const a=o(n,["image"]);null!=a&&e(s,["instances[0]","image"],function(t,n){const i={};if(void 0!==o(n,["gcsUri"]))throw new Error("gcsUri parameter is not supported in Gemini API.");const s=o(n,["imageBytes"]);null!=s&&e(i,["bytesBase64Encoded"],E(0,s));const r=o(n,["mimeType"]);return null!=r&&e(i,["mimeType"],r),i}(0,a));const u=o(n,["config"]);return null!=u&&e(s,["config"],function(t,n,i){const s=o(n,["numberOfVideos"]);if(void 0!==i&&null!=s&&e(i,["parameters","sampleCount"],s),void 0!==o(n,["outputGcsUri"]))throw new Error("outputGcsUri parameter is not supported in Gemini API.");if(void 0!==o(n,["fps"]))throw new Error("fps parameter is not supported in Gemini API.");const r=o(n,["durationSeconds"]);if(void 0!==i&&null!=r&&e(i,["parameters","durationSeconds"],r),void 0!==o(n,["seed"]))throw new Error("seed parameter is not supported in Gemini API.");const l=o(n,["aspectRatio"]);if(void 0!==i&&null!=l&&e(i,["parameters","aspectRatio"],l),void 0!==o(n,["resolution"]))throw new Error("resolution parameter is not supported in Gemini API.");const a=o(n,["personGeneration"]);if(void 0!==i&&null!=a&&e(i,["parameters","personGeneration"],a),void 0!==o(n,["pubsubTopic"]))throw new Error("pubsubTopic parameter is not supported in Gemini API.");const u=o(n,["negativePrompt"]);if(void 0!==i&&null!=u&&e(i,["parameters","negativePrompt"],u),void 0!==o(n,["enhancePrompt"]))throw new Error("enhancePrompt parameter is not supported in Gemini API.");return {}}(0,u,s)),s}function Gn(t,n){const i={},s=o(n,["parts"]);null!=s&&(Array.isArray(s)?e(i,["parts"],s.map((t=>function(t,n){const i={},s=o(n,["videoMetadata"]);null!=s&&e(i,["videoMetadata"],s);const r=o(n,["thought"]);null!=r&&e(i,["thought"],r);const l=o(n,["codeExecutionResult"]);null!=l&&e(i,["codeExecutionResult"],l);const a=o(n,["executableCode"]);null!=a&&e(i,["executableCode"],a);const u=o(n,["fileData"]);null!=u&&e(i,["fileData"],u);const c=o(n,["functionCall"]);null!=c&&e(i,["functionCall"],c);const p=o(n,["functionResponse"]);null!=p&&e(i,["functionResponse"],p);const d=o(n,["inlineData"]);null!=d&&e(i,["inlineData"],d);const h=o(n,["text"]);return null!=h&&e(i,["text"],h),i}(0,t)))):e(i,["parts"],s));const r=o(n,["role"]);return null!=r&&e(i,["role"],r),i}function kn(t,n){const i={},s=o(n,["example"]);null!=s&&e(i,["example"],s);const r=o(n,["pattern"]);null!=r&&e(i,["pattern"],r);const l=o(n,["default"]);null!=l&&e(i,["default"],l);const a=o(n,["maxLength"]);null!=a&&e(i,["maxLength"],a);const u=o(n,["minLength"]);null!=u&&e(i,["minLength"],u);const c=o(n,["minProperties"]);null!=c&&e(i,["minProperties"],c);const p=o(n,["maxProperties"]);null!=p&&e(i,["maxProperties"],p);const d=o(n,["anyOf"]);null!=d&&e(i,["anyOf"],d);const h=o(n,["description"]);null!=h&&e(i,["description"],h);const f=o(n,["enum"]);null!=f&&e(i,["enum"],f);const m=o(n,["format"]);null!=m&&e(i,["format"],m);const g=o(n,["items"]);null!=g&&e(i,["items"],g);const y=o(n,["maxItems"]);null!=y&&e(i,["maxItems"],y);const C=o(n,["maximum"]);null!=C&&e(i,["maximum"],C);const v=o(n,["minItems"]);null!=v&&e(i,["minItems"],v);const E=o(n,["minimum"]);null!=E&&e(i,["minimum"],E);const T=o(n,["nullable"]);null!=T&&e(i,["nullable"],T);const O=o(n,["properties"]);null!=O&&e(i,["properties"],O);const I=o(n,["propertyOrdering"]);null!=I&&e(i,["propertyOrdering"],I);const A=o(n,["required"]);null!=A&&e(i,["required"],A);const _=o(n,["title"]);null!=_&&e(i,["title"],_);const S=o(n,["type"]);return null!=S&&e(i,["type"],S),i}function Vn(t,n){const i={},s=o(n,["dynamicRetrievalConfig"]);return null!=s&&e(i,["dynamicRetrievalConfig"],function(t,n){const i={},s=o(n,["mode"]);null!=s&&e(i,["mode"],s);const r=o(n,["dynamicThreshold"]);return null!=r&&e(i,["dynamicThreshold"],r),i}(0,s)),i}function Hn(t,n){const i={},s=o(n,["functionDeclarations"]);null!=s&&(Array.isArray(s)?e(i,["functionDeclarations"],s.map((t=>function(t,n){const i={},s=o(n,["response"]);null!=s&&e(i,["response"],kn(0,s));const r=o(n,["description"]);null!=r&&e(i,["description"],r);const l=o(n,["name"]);null!=l&&e(i,["name"],l);const a=o(n,["parameters"]);return null!=a&&e(i,["parameters"],a),i}(0,t)))):e(i,["functionDeclarations"],s));const r=o(n,["retrieval"]);null!=r&&e(i,["retrieval"],r);null!=o(n,["googleSearch"])&&e(i,["googleSearch"],{});const l=o(n,["googleSearchRetrieval"]);null!=l&&e(i,["googleSearchRetrieval"],Vn(0,l));const a=o(n,["codeExecution"]);return null!=a&&e(i,["codeExecution"],a),i}function Fn(t,n){const i={},s=o(n,["functionCallingConfig"]);return null!=s&&e(i,["functionCallingConfig"],function(t,n){const i={},s=o(n,["mode"]);null!=s&&e(i,["mode"],s);const r=o(n,["allowedFunctionNames"]);return null!=r&&e(i,["allowedFunctionNames"],r),i}(0,s)),i}function jn(t,n){const i={},s=o(n,["prebuiltVoiceConfig"]);return null!=s&&e(i,["prebuiltVoiceConfig"],function(t,n){const i={},s=o(n,["voiceName"]);return null!=s&&e(i,["voiceName"],s),i}(0,s)),i}function Bn(t,n,i){const s={},r=o(n,["systemInstruction"]);void 0!==i&&null!=r&&e(i,["systemInstruction"],Gn(0,p(0,r)));const l=o(n,["temperature"]);null!=l&&e(s,["temperature"],l);const a=o(n,["topP"]);null!=a&&e(s,["topP"],a);const u=o(n,["topK"]);null!=u&&e(s,["topK"],u);const c=o(n,["candidateCount"]);null!=c&&e(s,["candidateCount"],c);const d=o(n,["maxOutputTokens"]);null!=d&&e(s,["maxOutputTokens"],d);const h=o(n,["stopSequences"]);null!=h&&e(s,["stopSequences"],h);const f=o(n,["responseLogprobs"]);null!=f&&e(s,["responseLogprobs"],f);const E=o(n,["logprobs"]);null!=E&&e(s,["logprobs"],E);const T=o(n,["presencePenalty"]);null!=T&&e(s,["presencePenalty"],T);const O=o(n,["frequencyPenalty"]);null!=O&&e(s,["frequencyPenalty"],O);const I=o(n,["seed"]);null!=I&&e(s,["seed"],I);const A=o(n,["responseMimeType"]);null!=A&&e(s,["responseMimeType"],A);const _=o(n,["responseSchema"]);null!=_&&e(s,["responseSchema"],kn(0,m(t,_)));const S=o(n,["routingConfig"]);null!=S&&e(s,["routingConfig"],S);const w=o(n,["modelSelectionConfig"]);null!=w&&e(s,["modelConfig"],function(t,n){const i={},s=o(n,["featureSelectionPreference"]);return null!=s&&e(i,["featureSelectionPreference"],s),i}(0,w));const P=o(n,["safetySettings"]);void 0!==i&&null!=P&&(Array.isArray(P)?e(i,["safetySettings"],P.map((t=>function(t,n){const i={},s=o(n,["method"]);null!=s&&e(i,["method"],s);const r=o(n,["category"]);null!=r&&e(i,["category"],r);const l=o(n,["threshold"]);return null!=l&&e(i,["threshold"],l),i}(0,t)))):e(i,["safetySettings"],P));const R=o(n,["tools"]);void 0!==i&&null!=R&&(Array.isArray(R)?e(i,["tools"],C(0,C(0,R).map((t=>Hn(0,y(0,t)))))):e(i,["tools"],C(0,R)));const N=o(n,["toolConfig"]);void 0!==i&&null!=N&&e(i,["toolConfig"],Fn(0,N));const b=o(n,["labels"]);void 0!==i&&null!=b&&e(i,["labels"],b);const D=o(n,["cachedContent"]);void 0!==i&&null!=D&&e(i,["cachedContent"],v(t,D));const x=o(n,["responseModalities"]);null!=x&&e(s,["responseModalities"],x);const M=o(n,["mediaResolution"]);null!=M&&e(s,["mediaResolution"],M);const U=o(n,["speechConfig"]);null!=U&&e(s,["speechConfig"],function(t,n){const i={},s=o(n,["voiceConfig"]);null!=s&&e(i,["voiceConfig"],jn(0,s));const r=o(n,["languageCode"]);return null!=r&&e(i,["languageCode"],r),i}(0,g(0,U)));const L=o(n,["audioTimestamp"]);null!=L&&e(s,["audioTimestamp"],L);const q=o(n,["thinkingConfig"]);return null!=q&&e(s,["thinkingConfig"],function(t,n){const i={},s=o(n,["includeThoughts"]);null!=s&&e(i,["includeThoughts"],s);const r=o(n,["thinkingBudget"]);return null!=r&&e(i,["thinkingBudget"],r),i}(0,q)),s}function Yn(t,n){const s={},r=o(n,["model"]);null!=r&&e(s,["_url","model"],i(t,r));const l=o(n,["contents"]);null!=l&&(Array.isArray(l)?e(s,["contents"],h(0,h(0,l).map((t=>Gn(0,t))))):e(s,["contents"],h(0,l)));const a=o(n,["config"]);return null!=a&&e(s,["generationConfig"],Bn(t,a,s)),s}function Kn(t,n){const s={},r=o(n,["model"]);null!=r&&e(s,["_url","model"],i(t,r));const l=o(n,["contents"]);null!=l&&e(s,["instances[]","content"],d(t,l));const a=o(n,["config"]);return null!=a&&e(s,["config"],function(t,n,i){const s=o(n,["taskType"]);void 0!==i&&null!=s&&e(i,["instances[]","task_type"],s);const r=o(n,["title"]);void 0!==i&&null!=r&&e(i,["instances[]","title"],r);const l=o(n,["outputDimensionality"]);void 0!==i&&null!=l&&e(i,["parameters","outputDimensionality"],l);const a=o(n,["mimeType"]);void 0!==i&&null!=a&&e(i,["instances[]","mimeType"],a);const u=o(n,["autoTruncate"]);return void 0!==i&&null!=u&&e(i,["parameters","autoTruncate"],u),{}}(0,a,s)),s}function Jn(t,n){const s={},r=o(n,["model"]);null!=r&&e(s,["_url","model"],i(t,r));const l=o(n,["prompt"]);null!=l&&e(s,["instances[0]","prompt"],l);const a=o(n,["config"]);return null!=a&&e(s,["config"],function(t,n,i){const s=o(n,["outputGcsUri"]);void 0!==i&&null!=s&&e(i,["parameters","storageUri"],s);const r=o(n,["negativePrompt"]);void 0!==i&&null!=r&&e(i,["parameters","negativePrompt"],r);const l=o(n,["numberOfImages"]);void 0!==i&&null!=l&&e(i,["parameters","sampleCount"],l);const a=o(n,["aspectRatio"]);void 0!==i&&null!=a&&e(i,["parameters","aspectRatio"],a);const u=o(n,["guidanceScale"]);void 0!==i&&null!=u&&e(i,["parameters","guidanceScale"],u);const c=o(n,["seed"]);void 0!==i&&null!=c&&e(i,["parameters","seed"],c);const p=o(n,["safetyFilterLevel"]);void 0!==i&&null!=p&&e(i,["parameters","safetySetting"],p);const d=o(n,["personGeneration"]);void 0!==i&&null!=d&&e(i,["parameters","personGeneration"],d);const h=o(n,["includeSafetyAttributes"]);void 0!==i&&null!=h&&e(i,["parameters","includeSafetyAttributes"],h);const f=o(n,["includeRaiReason"]);void 0!==i&&null!=f&&e(i,["parameters","includeRaiReason"],f);const m=o(n,["language"]);void 0!==i&&null!=m&&e(i,["parameters","language"],m);const g=o(n,["outputMimeType"]);void 0!==i&&null!=g&&e(i,["parameters","outputOptions","mimeType"],g);const y=o(n,["outputCompressionQuality"]);void 0!==i&&null!=y&&e(i,["parameters","outputOptions","compressionQuality"],y);const C=o(n,["addWatermark"]);void 0!==i&&null!=C&&e(i,["parameters","addWatermark"],C);const v=o(n,["enhancePrompt"]);return void 0!==i&&null!=v&&e(i,["parameters","enhancePrompt"],v),{}}(0,a,s)),s}function Wn(t,n){const s={},r=o(n,["model"]);null!=r&&e(s,["_url","model"],i(t,r));const l=o(n,["contents"]);null!=l&&(Array.isArray(l)?e(s,["contents"],h(0,h(0,l).map((t=>Gn(0,t))))):e(s,["contents"],h(0,l)));const a=o(n,["config"]);return null!=a&&e(s,["config"],function(t,n,i){const s=o(n,["systemInstruction"]);void 0!==i&&null!=s&&e(i,["systemInstruction"],Gn(0,p(0,s)));const r=o(n,["tools"]);void 0!==i&&null!=r&&(Array.isArray(r)?e(i,["tools"],r.map((t=>Hn(0,t)))):e(i,["tools"],r));const l=o(n,["generationConfig"]);return void 0!==i&&null!=l&&e(i,["generationConfig"],l),{}}(0,a,s)),s}function $n(t,n){const s={},r=o(n,["model"]);null!=r&&e(s,["_url","model"],i(t,r));const l=o(n,["prompt"]);null!=l&&e(s,["instances[0]","prompt"],l);const a=o(n,["image"]);null!=a&&e(s,["instances[0]","image"],function(t,n){const i={},s=o(n,["gcsUri"]);null!=s&&e(i,["gcsUri"],s);const r=o(n,["imageBytes"]);null!=r&&e(i,["bytesBase64Encoded"],E(0,r));const l=o(n,["mimeType"]);return null!=l&&e(i,["mimeType"],l),i}(0,a));const u=o(n,["config"]);return null!=u&&e(s,["config"],function(t,n,i){const s=o(n,["numberOfVideos"]);void 0!==i&&null!=s&&e(i,["parameters","sampleCount"],s);const r=o(n,["outputGcsUri"]);void 0!==i&&null!=r&&e(i,["parameters","storageUri"],r);const l=o(n,["fps"]);void 0!==i&&null!=l&&e(i,["parameters","fps"],l);const a=o(n,["durationSeconds"]);void 0!==i&&null!=a&&e(i,["parameters","durationSeconds"],a);const u=o(n,["seed"]);void 0!==i&&null!=u&&e(i,["parameters","seed"],u);const c=o(n,["aspectRatio"]);void 0!==i&&null!=c&&e(i,["parameters","aspectRatio"],c);const p=o(n,["resolution"]);void 0!==i&&null!=p&&e(i,["parameters","resolution"],p);const d=o(n,["personGeneration"]);void 0!==i&&null!=d&&e(i,["parameters","personGeneration"],d);const h=o(n,["pubsubTopic"]);void 0!==i&&null!=h&&e(i,["parameters","pubsubTopic"],h);const f=o(n,["negativePrompt"]);void 0!==i&&null!=f&&e(i,["parameters","negativePrompt"],f);const m=o(n,["enhancePrompt"]);return void 0!==i&&null!=m&&e(i,["parameters","enhancePrompt"],m),{}}(0,u,s)),s}function zn(t,n){const i={},s=o(n,["parts"]);null!=s&&(Array.isArray(s)?e(i,["parts"],s.map((t=>function(t,n){const i={},s=o(n,["thought"]);null!=s&&e(i,["thought"],s);const r=o(n,["codeExecutionResult"]);null!=r&&e(i,["codeExecutionResult"],r);const l=o(n,["executableCode"]);null!=l&&e(i,["executableCode"],l);const a=o(n,["fileData"]);null!=a&&e(i,["fileData"],a);const u=o(n,["functionCall"]);null!=u&&e(i,["functionCall"],u);const c=o(n,["functionResponse"]);null!=c&&e(i,["functionResponse"],c);const p=o(n,["inlineData"]);null!=p&&e(i,["inlineData"],p);const d=o(n,["text"]);return null!=d&&e(i,["text"],d),i}(0,t)))):e(i,["parts"],s));const r=o(n,["role"]);return null!=r&&e(i,["role"],r),i}function Xn(t,n){const i={},s=o(n,["content"]);null!=s&&e(i,["content"],zn(0,s));const r=o(n,["citationMetadata"]);null!=r&&e(i,["citationMetadata"],function(t,n){const i={},s=o(n,["citationSources"]);return null!=s&&e(i,["citations"],s),i}(0,r));const l=o(n,["tokenCount"]);null!=l&&e(i,["tokenCount"],l);const a=o(n,["finishReason"]);null!=a&&e(i,["finishReason"],a);const u=o(n,["avgLogprobs"]);null!=u&&e(i,["avgLogprobs"],u);const c=o(n,["groundingMetadata"]);null!=c&&e(i,["groundingMetadata"],c);const p=o(n,["index"]);null!=p&&e(i,["index"],p);const d=o(n,["logprobsResult"]);null!=d&&e(i,["logprobsResult"],d);const h=o(n,["safetyRatings"]);return null!=h&&e(i,["safetyRatings"],h),i}function Qn(t,n){const i={},s=o(n,["candidates"]);null!=s&&(Array.isArray(s)?e(i,["candidates"],s.map((t=>Xn(0,t)))):e(i,["candidates"],s));const r=o(n,["modelVersion"]);null!=r&&e(i,["modelVersion"],r);const l=o(n,["promptFeedback"]);null!=l&&e(i,["promptFeedback"],l);const a=o(n,["usageMetadata"]);return null!=a&&e(i,["usageMetadata"],a),i}function Zn(t,n){const i={},s=o(n,["embeddings"]);null!=s&&(Array.isArray(s)?e(i,["embeddings"],s.map((t=>function(t,n){const i={},s=o(n,["values"]);return null!=s&&e(i,["values"],s),i}(0,t)))):e(i,["embeddings"],s));return null!=o(n,["metadata"])&&e(i,["metadata"],{}),i}function te(t,n){const i={},s=o(n,["safetyAttributes","categories"]);null!=s&&e(i,["categories"],s);const r=o(n,["safetyAttributes","scores"]);null!=r&&e(i,["scores"],r);const l=o(n,["contentType"]);return null!=l&&e(i,["contentType"],l),i}function ne(t,n){const i={},s=o(n,["_self"]);null!=s&&e(i,["image"],function(t,n){const i={},s=o(n,["bytesBase64Encoded"]);null!=s&&e(i,["imageBytes"],E(0,s));const r=o(n,["mimeType"]);return null!=r&&e(i,["mimeType"],r),i}(0,s));const r=o(n,["raiFilteredReason"]);null!=r&&e(i,["raiFilteredReason"],r);const l=o(n,["_self"]);return null!=l&&e(i,["safetyAttributes"],te(0,l)),i}function ee(t,n){const i={},s=o(n,["name"]);null!=s&&e(i,["name"],s);const r=o(n,["displayName"]);null!=r&&e(i,["displayName"],r);const l=o(n,["description"]);null!=l&&e(i,["description"],l);const a=o(n,["version"]);null!=a&&e(i,["version"],a);const u=o(n,["_self"]);null!=u&&e(i,["tunedModelInfo"],function(t,n){const i={},s=o(n,["baseModel"]);null!=s&&e(i,["baseModel"],s);const r=o(n,["createTime"]);null!=r&&e(i,["createTime"],r);const l=o(n,["updateTime"]);return null!=l&&e(i,["updateTime"],l),i}(0,u));const c=o(n,["inputTokenLimit"]);null!=c&&e(i,["inputTokenLimit"],c);const p=o(n,["outputTokenLimit"]);null!=p&&e(i,["outputTokenLimit"],p);const d=o(n,["supportedGenerationMethods"]);return null!=d&&e(i,["supportedActions"],d),i}function oe(t,n){const i={},s=o(n,["_self"]);return null!=s&&e(i,["video"],function(t,n){const i={},s=o(n,["video","uri"]);null!=s&&e(i,["uri"],s);const r=o(n,["video","encodedVideo"]);null!=r&&e(i,["videoBytes"],E(0,r));const l=o(n,["encoding"]);return null!=l&&e(i,["mimeType"],l),i}(0,s)),i}function ie(t,n){const i={},s=o(n,["name"]);null!=s&&e(i,["name"],s);const r=o(n,["metadata"]);null!=r&&e(i,["metadata"],r);const l=o(n,["done"]);null!=l&&e(i,["done"],l);const a=o(n,["error"]);null!=a&&e(i,["error"],a);const u=o(n,["response","generateVideoResponse"]);return null!=u&&e(i,["response"],function(t,n){const i={},s=o(n,["generatedSamples"]);null!=s&&(Array.isArray(s)?e(i,["generatedVideos"],s.map((t=>oe(0,t)))):e(i,["generatedVideos"],s));const r=o(n,["raiMediaFilteredCount"]);null!=r&&e(i,["raiMediaFilteredCount"],r);const l=o(n,["raiMediaFilteredReasons"]);return null!=l&&e(i,["raiMediaFilteredReasons"],l),i}(0,u)),i}function se(t,n){const i={},s=o(n,["parts"]);null!=s&&(Array.isArray(s)?e(i,["parts"],s.map((t=>function(t,n){const i={},s=o(n,["videoMetadata"]);null!=s&&e(i,["videoMetadata"],s);const r=o(n,["thought"]);null!=r&&e(i,["thought"],r);const l=o(n,["codeExecutionResult"]);null!=l&&e(i,["codeExecutionResult"],l);const a=o(n,["executableCode"]);null!=a&&e(i,["executableCode"],a);const u=o(n,["fileData"]);null!=u&&e(i,["fileData"],u);const c=o(n,["functionCall"]);null!=c&&e(i,["functionCall"],c);const p=o(n,["functionResponse"]);null!=p&&e(i,["functionResponse"],p);const d=o(n,["inlineData"]);null!=d&&e(i,["inlineData"],d);const h=o(n,["text"]);return null!=h&&e(i,["text"],h),i}(0,t)))):e(i,["parts"],s));const r=o(n,["role"]);return null!=r&&e(i,["role"],r),i}function re(t,n){const i={},s=o(n,["content"]);null!=s&&e(i,["content"],se(0,s));const r=o(n,["citationMetadata"]);null!=r&&e(i,["citationMetadata"],function(t,n){const i={},s=o(n,["citations"]);return null!=s&&e(i,["citations"],s),i}(0,r));const l=o(n,["finishMessage"]);null!=l&&e(i,["finishMessage"],l);const a=o(n,["finishReason"]);null!=a&&e(i,["finishReason"],a);const u=o(n,["avgLogprobs"]);null!=u&&e(i,["avgLogprobs"],u);const c=o(n,["groundingMetadata"]);null!=c&&e(i,["groundingMetadata"],c);const p=o(n,["index"]);null!=p&&e(i,["index"],p);const d=o(n,["logprobsResult"]);null!=d&&e(i,["logprobsResult"],d);const h=o(n,["safetyRatings"]);return null!=h&&e(i,["safetyRatings"],h),i}function le(t,n){const i={},s=o(n,["candidates"]);null!=s&&(Array.isArray(s)?e(i,["candidates"],s.map((t=>re(0,t)))):e(i,["candidates"],s));const r=o(n,["createTime"]);null!=r&&e(i,["createTime"],r);const l=o(n,["responseId"]);null!=l&&e(i,["responseId"],l);const a=o(n,["modelVersion"]);null!=a&&e(i,["modelVersion"],a);const u=o(n,["promptFeedback"]);null!=u&&e(i,["promptFeedback"],u);const c=o(n,["usageMetadata"]);return null!=c&&e(i,["usageMetadata"],c),i}function ae(t,n){const i={},s=o(n,["values"]);null!=s&&e(i,["values"],s);const r=o(n,["statistics"]);return null!=r&&e(i,["statistics"],function(t,n){const i={},s=o(n,["truncated"]);null!=s&&e(i,["truncated"],s);const r=o(n,["token_count"]);return null!=r&&e(i,["tokenCount"],r),i}(0,r)),i}function ue(t,n){const i={},s=o(n,["predictions[]","embeddings"]);null!=s&&(Array.isArray(s)?e(i,["embeddings"],s.map((t=>ae(0,t)))):e(i,["embeddings"],s));const r=o(n,["metadata"]);return null!=r&&e(i,["metadata"],function(t,n){const i={},s=o(n,["billableCharacterCount"]);return null!=s&&e(i,["billableCharacterCount"],s),i}(0,r)),i}function ce(t,n){const i={},s=o(n,["safetyAttributes","categories"]);null!=s&&e(i,["categories"],s);const r=o(n,["safetyAttributes","scores"]);null!=r&&e(i,["scores"],r);const l=o(n,["contentType"]);return null!=l&&e(i,["contentType"],l),i}function pe(t,n){const i={},s=o(n,["_self"]);null!=s&&e(i,["image"],function(t,n){const i={},s=o(n,["gcsUri"]);null!=s&&e(i,["gcsUri"],s);const r=o(n,["bytesBase64Encoded"]);null!=r&&e(i,["imageBytes"],E(0,r));const l=o(n,["mimeType"]);return null!=l&&e(i,["mimeType"],l),i}(0,s));const r=o(n,["raiFilteredReason"]);null!=r&&e(i,["raiFilteredReason"],r);const l=o(n,["_self"]);null!=l&&e(i,["safetyAttributes"],ce(0,l));const a=o(n,["prompt"]);return null!=a&&e(i,["enhancedPrompt"],a),i}function de(t,n){const i={},s=o(n,["name"]);null!=s&&e(i,["name"],s);const r=o(n,["displayName"]);null!=r&&e(i,["displayName"],r);const l=o(n,["description"]);null!=l&&e(i,["description"],l);const a=o(n,["versionId"]);null!=a&&e(i,["version"],a);const u=o(n,["deployedModels"]);null!=u&&(Array.isArray(u)?e(i,["endpoints"],u.map((t=>function(t,n){const i={},s=o(n,["endpoint"]);null!=s&&e(i,["name"],s);const r=o(n,["deployedModelId"]);return null!=r&&e(i,["deployedModelId"],r),i}(0,t)))):e(i,["endpoints"],u));const c=o(n,["labels"]);null!=c&&e(i,["labels"],c);const p=o(n,["_self"]);return null!=p&&e(i,["tunedModelInfo"],function(t,n){const i={},s=o(n,["labels","google-vertex-llm-tuning-base-model-id"]);null!=s&&e(i,["baseModel"],s);const r=o(n,["createTime"]);null!=r&&e(i,["createTime"],r);const l=o(n,["updateTime"]);return null!=l&&e(i,["updateTime"],l),i}(0,p)),i}function he(t,n){const i={},s=o(n,["_self"]);return null!=s&&e(i,["video"],function(t,n){const i={},s=o(n,["gcsUri"]);null!=s&&e(i,["uri"],s);const r=o(n,["bytesBase64Encoded"]);null!=r&&e(i,["videoBytes"],E(0,r));const l=o(n,["mimeType"]);return null!=l&&e(i,["mimeType"],l),i}(0,s)),i}function fe(t,n){const i={},s=o(n,["name"]);null!=s&&e(i,["name"],s);const r=o(n,["metadata"]);null!=r&&e(i,["metadata"],r);const l=o(n,["done"]);null!=l&&e(i,["done"],l);const a=o(n,["error"]);null!=a&&e(i,["error"],a);const u=o(n,["response"]);return null!=u&&e(i,["response"],function(t,n){const i={},s=o(n,["videos"]);null!=s&&(Array.isArray(s)?e(i,["generatedVideos"],s.map((t=>he(0,t)))):e(i,["generatedVideos"],s));const r=o(n,["raiMediaFilteredCount"]);null!=r&&e(i,["raiMediaFilteredCount"],r);const l=o(n,["raiMediaFilteredReasons"]);return null!=l&&e(i,["raiMediaFilteredReasons"],l),i}(0,u)),i}
/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */class me{constructor(t,n,e){this.apiClient=t,this.auth=n,this.webSocketFactory=e;}async connect(t){var n,s,r,l;const a=this.apiClient.getWebsocketBaseUrl(),u=this.apiClient.getApiVersion();let c;const p=function(t){const n=new Headers;for(const[e,o]of Object.entries(t))n.append(e,o);return n}
/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */(this.apiClient.getDefaultHeaders());if(this.apiClient.isVertexAI())c=`${a}/ws/google.cloud.aiplatform.${u}.LlmBidiService/BidiGenerateContent`,await this.auth.addAuthHeaders(p);else {c=`${a}/ws/google.ai.generativelanguage.${u}.GenerativeService.BidiGenerateContent?key=${this.apiClient.getApiKey()}`;}let d=()=>{};const h=new Promise((t=>{d=t;})),f=t.callbacks,m=this.apiClient,g={onopen:function(){var t;null===(t=null==f?void 0:f.onopen)||void 0===t||t.call(f),d({});},onmessage:t=>{!async function(t,n,e){let o,i;i=e.data instanceof Blob?JSON.parse(await e.data.text()):JSON.parse(e.data),o=t.isVertexAI()?Sn(0,i):_n(0,i),n(o);}(m,f.onmessage,t);},onerror:null!==(n=null==f?void 0:f.onerror)&&void 0!==n?n:function(t){},onclose:null!==(s=null==f?void 0:f.onclose)&&void 0!==s?s:function(t){}},y=this.webSocketFactory.create(c,function(t){const n={};return t.forEach(((t,e)=>{n[e]=t;})),n}(p),g);y.connect(),await h;let C=i(this.apiClient,t.model);if(this.apiClient.isVertexAI()&&C.startsWith("publishers/")){C=`projects/${this.apiClient.getProject()}/locations/${this.apiClient.getLocation()}/`+C;}let v={};this.apiClient.isVertexAI()&&void 0===(null===(r=t.config)||void 0===r?void 0:r.responseModalities)&&(void 0===t.config?t.config={responseModalities:[X.AUDIO]}:t.config.responseModalities=[X.AUDIO]),(null===(l=t.config)||void 0===l?void 0:l.generationConfig)&&console.warn("Setting `LiveConnectConfig.generation_config` is deprecated, please set the fields on `LiveConnectConfig` directly. This will become an error in a future version (not before Q3 2025).");const E={model:C,config:t.config,callbacks:t.callbacks};return v=this.apiClient.isVertexAI()?function(t,n){const s={},r=o(n,["model"]);null!=r&&e(s,["setup","model"],i(t,r));const l=o(n,["config"]);return null!=l&&e(s,["config"],gn(0,l,s)),s}(this.apiClient,E):function(t,n){const s={},r=o(n,["model"]);null!=r&&e(s,["setup","model"],i(t,r));const l=o(n,["config"]);return null!=l&&e(s,["config"],mn(0,l,s)),s}(this.apiClient,E),delete v.config,y.send(JSON.stringify(v)),new ye(y,this.apiClient)}}const ge={turnComplete:true};class ye{constructor(t,n){this.conn=t,this.apiClient=n;}tLiveClientContent(t,n){if(null!==n.turns&&void 0!==n.turns){let e=[];try{e=h(0,n.turns),e=t.isVertexAI()?e.map((t=>Gn(0,t))):e.map((t=>wn(0,t)));}catch(t){throw new Error(`Failed to parse client content "turns", type: '${typeof n.turns}'`)}return {clientContent:{turns:e,turnComplete:n.turnComplete}}}return {clientContent:{turnComplete:n.turnComplete}}}tLiveClientRealtimeInput(t,n){let e={};if(!("media"in n)||!n.media)throw new Error(`Failed to convert realtime input "media", type: '${typeof n.media}'`);return e={realtimeInput:{mediaChunks:[n.media],activityStart:n.activityStart,activityEnd:n.activityEnd}},e}tLiveClienttToolResponse(t,n){let e=[];if(null==n.functionResponses)throw new Error("functionResponses is required.");if(e=Array.isArray(n.functionResponses)?n.functionResponses:[n.functionResponses],0===e.length)throw new Error("functionResponses is required.");for(const n of e){if("object"!=typeof n||null===n||!("name"in n)||!("response"in n))throw new Error(`Could not parse function response, type '${typeof n}'.`);if(!t.isVertexAI()&&!("id"in n))throw new Error("FunctionResponse request must have an `id` field from the response of a ToolCall.FunctionalCalls in Google AI.")}return {toolResponse:{functionResponses:e}}}sendClientContent(t){t=Object.assign(Object.assign({},ge),t);const n=this.tLiveClientContent(this.apiClient,t);this.conn.send(JSON.stringify(n));}sendRealtimeInput(t){if(null==t.media)throw new Error("Media is required.");const n=this.tLiveClientRealtimeInput(this.apiClient,t);this.conn.send(JSON.stringify(n));}sendToolResponse(t){if(null==t.functionResponses)throw new Error("Tool response parameters are required.");const n=this.tLiveClienttToolResponse(this.apiClient,t);this.conn.send(JSON.stringify(n));}close(){this.conn.close();}}class Ce extends t{constructor(t){super(),this.apiClient=t,this.generateContent=async t=>await this.generateContentInternal(t),this.generateContentStream=async t=>await this.generateContentStreamInternal(t),this.generateImages=async t=>await this.generateImagesInternal(t).then((t=>{var n;let e;const o=[];if(null==t?void 0:t.generatedImages)for(const i of t.generatedImages)i&&(null==i?void 0:i.safetyAttributes)&&"Positive Prompt"===(null===(n=null==i?void 0:i.safetyAttributes)||void 0===n?void 0:n.contentType)?e=null==i?void 0:i.safetyAttributes:o.push(i);let i;return i=e?{generatedImages:o,positivePromptSafetyAttributes:e}:{generatedImages:o},i}));}async generateContentInternal(t){var e,o;let i,s="",r={};if(this.apiClient.isVertexAI()){const o=Yn(this.apiClient,t);return s=n("{model}:generateContent",o._url),r=o._query,delete o.config,delete o._url,delete o._query,i=this.apiClient.request({path:s,queryParams:r,body:JSON.stringify(o),httpMethod:"POST",httpOptions:null===(e=t.config)||void 0===e?void 0:e.httpOptions}).then((t=>t.json())),i.then((t=>{const n=le(this.apiClient,t),e=new Nt;return Object.assign(e,n),e}))}{const e=xn(this.apiClient,t);return s=n("{model}:generateContent",e._url),r=e._query,delete e.config,delete e._url,delete e._query,i=this.apiClient.request({path:s,queryParams:r,body:JSON.stringify(e),httpMethod:"POST",httpOptions:null===(o=t.config)||void 0===o?void 0:o.httpOptions}).then((t=>t.json())),i.then((t=>{const n=Qn(this.apiClient,t),e=new Nt;return Object.assign(e,n),e}))}}async generateContentStreamInternal(t){var e,o;let i,s="",r={};if(this.apiClient.isVertexAI()){const o=Yn(this.apiClient,t);s=n("{model}:streamGenerateContent?alt=sse",o._url),r=o._query,delete o.config,delete o._url,delete o._query;const l=this.apiClient;return i=l.requestStream({path:s,queryParams:r,body:JSON.stringify(o),httpMethod:"POST",httpOptions:null===(e=t.config)||void 0===e?void 0:e.httpOptions}),i.then((function(t){return Wt(this,arguments,(function*(){var n,e,o,i;try{for(var s,r=!0,l=$t(t);!(n=(s=yield Jt(l.next())).done);r=!0){i=s.value,r=!1;const t=i,n=le(0,yield Jt(t.json())),e=new Nt;Object.assign(e,n),yield yield Jt(e);}}catch(t){e={error:t};}finally{try{r||n||!(o=l.return)||(yield Jt(o.call(l)));}finally{if(e)throw e.error}}}))}))}{const e=xn(this.apiClient,t);s=n("{model}:streamGenerateContent?alt=sse",e._url),r=e._query,delete e.config,delete e._url,delete e._query;const l=this.apiClient;return i=l.requestStream({path:s,queryParams:r,body:JSON.stringify(e),httpMethod:"POST",httpOptions:null===(o=t.config)||void 0===o?void 0:o.httpOptions}),i.then((function(t){return Wt(this,arguments,(function*(){var n,e,o,i;try{for(var s,r=!0,l=$t(t);!(n=(s=yield Jt(l.next())).done);r=!0){i=s.value,r=!1;const t=i,n=Qn(0,yield Jt(t.json())),e=new Nt;Object.assign(e,n),yield yield Jt(e);}}catch(t){e={error:t};}finally{try{r||n||!(o=l.return)||(yield Jt(o.call(l)));}finally{if(e)throw e.error}}}))}))}}async embedContent(t){var e,o;let i,s="",r={};if(this.apiClient.isVertexAI()){const o=Kn(this.apiClient,t);return s=n("{model}:predict",o._url),r=o._query,delete o.config,delete o._url,delete o._query,i=this.apiClient.request({path:s,queryParams:r,body:JSON.stringify(o),httpMethod:"POST",httpOptions:null===(e=t.config)||void 0===e?void 0:e.httpOptions}).then((t=>t.json())),i.then((t=>{const n=ue(this.apiClient,t),e=new bt;return Object.assign(e,n),e}))}{const e=Mn(this.apiClient,t);return s=n("{model}:batchEmbedContents",e._url),r=e._query,delete e.config,delete e._url,delete e._query,i=this.apiClient.request({path:s,queryParams:r,body:JSON.stringify(e),httpMethod:"POST",httpOptions:null===(o=t.config)||void 0===o?void 0:o.httpOptions}).then((t=>t.json())),i.then((t=>{const n=Zn(this.apiClient,t),e=new bt;return Object.assign(e,n),e}))}}async generateImagesInternal(t){var i,s;let r,l="",a={};if(this.apiClient.isVertexAI()){const s=Jn(this.apiClient,t);return l=n("{model}:predict",s._url),a=s._query,delete s.config,delete s._url,delete s._query,r=this.apiClient.request({path:l,queryParams:a,body:JSON.stringify(s),httpMethod:"POST",httpOptions:null===(i=t.config)||void 0===i?void 0:i.httpOptions}).then((t=>t.json())),r.then((t=>{const n=function(t,n){const i={},s=o(n,["predictions"]);null!=s&&(Array.isArray(s)?e(i,["generatedImages"],s.map((t=>pe(0,t)))):e(i,["generatedImages"],s));const r=o(n,["positivePromptSafetyAttributes"]);return null!=r&&e(i,["positivePromptSafetyAttributes"],ce(0,r)),i}(this.apiClient,t),i=new Dt;return Object.assign(i,n),i}))}{const i=Un(this.apiClient,t);return l=n("{model}:predict",i._url),a=i._query,delete i.config,delete i._url,delete i._query,r=this.apiClient.request({path:l,queryParams:a,body:JSON.stringify(i),httpMethod:"POST",httpOptions:null===(s=t.config)||void 0===s?void 0:s.httpOptions}).then((t=>t.json())),r.then((t=>{const n=function(t,n){const i={},s=o(n,["predictions"]);null!=s&&(Array.isArray(s)?e(i,["generatedImages"],s.map((t=>ne(0,t)))):e(i,["generatedImages"],s));const r=o(n,["positivePromptSafetyAttributes"]);return null!=r&&e(i,["positivePromptSafetyAttributes"],te(0,r)),i}(this.apiClient,t),i=new Dt;return Object.assign(i,n),i}))}}async get(t){var s,r;let l,a="",u={};if(this.apiClient.isVertexAI()){const r=function(t,n){const s={},r=o(n,["model"]);null!=r&&e(s,["_url","name"],i(t,r));const l=o(n,["config"]);return null!=l&&e(s,["config"],l),s}(this.apiClient,t);return a=n("{name}",r._url),u=r._query,delete r.config,delete r._url,delete r._query,l=this.apiClient.request({path:a,queryParams:u,body:JSON.stringify(r),httpMethod:"GET",httpOptions:null===(s=t.config)||void 0===s?void 0:s.httpOptions}).then((t=>t.json())),l.then((t=>de(this.apiClient,t)))}{const s=function(t,n){const s={},r=o(n,["model"]);null!=r&&e(s,["_url","name"],i(t,r));const l=o(n,["config"]);return null!=l&&e(s,["config"],l),s}(this.apiClient,t);return a=n("{name}",s._url),u=s._query,delete s.config,delete s._url,delete s._query,l=this.apiClient.request({path:a,queryParams:u,body:JSON.stringify(s),httpMethod:"GET",httpOptions:null===(r=t.config)||void 0===r?void 0:r.httpOptions}).then((t=>t.json())),l.then((t=>ee(this.apiClient,t)))}}async countTokens(t){var i,s;let r,l="",a={};if(this.apiClient.isVertexAI()){const s=Wn(this.apiClient,t);return l=n("{model}:countTokens",s._url),a=s._query,delete s.config,delete s._url,delete s._query,r=this.apiClient.request({path:l,queryParams:a,body:JSON.stringify(s),httpMethod:"POST",httpOptions:null===(i=t.config)||void 0===i?void 0:i.httpOptions}).then((t=>t.json())),r.then((t=>{const n=function(t,n){const i={},s=o(n,["totalTokens"]);return null!=s&&e(i,["totalTokens"],s),i}(this.apiClient,t),i=new xt;return Object.assign(i,n),i}))}{const i=Ln(this.apiClient,t);return l=n("{model}:countTokens",i._url),a=i._query,delete i.config,delete i._url,delete i._query,r=this.apiClient.request({path:l,queryParams:a,body:JSON.stringify(i),httpMethod:"POST",httpOptions:null===(s=t.config)||void 0===s?void 0:s.httpOptions}).then((t=>t.json())),r.then((t=>{const n=function(t,n){const i={},s=o(n,["totalTokens"]);null!=s&&e(i,["totalTokens"],s);const r=o(n,["cachedContentTokenCount"]);return null!=r&&e(i,["cachedContentTokenCount"],r),i}(this.apiClient,t),i=new xt;return Object.assign(i,n),i}))}}async computeTokens(t){var s;let r,l="",a={};if(this.apiClient.isVertexAI()){const u=function(t,n){const s={},r=o(n,["model"]);null!=r&&e(s,["_url","model"],i(t,r));const l=o(n,["contents"]);null!=l&&(Array.isArray(l)?e(s,["contents"],h(0,h(0,l).map((t=>Gn(0,t))))):e(s,["contents"],h(0,l)));const a=o(n,["config"]);return null!=a&&e(s,["config"],a),s}(this.apiClient,t);return l=n("{model}:computeTokens",u._url),a=u._query,delete u.config,delete u._url,delete u._query,r=this.apiClient.request({path:l,queryParams:a,body:JSON.stringify(u),httpMethod:"POST",httpOptions:null===(s=t.config)||void 0===s?void 0:s.httpOptions}).then((t=>t.json())),r.then((t=>{const n=function(t,n){const i={},s=o(n,["tokensInfo"]);return null!=s&&e(i,["tokensInfo"],s),i}(this.apiClient,t),i=new Mt;return Object.assign(i,n),i}))}throw new Error("This method is only supported by the Vertex AI.")}async generateVideos(t){var e,o;let i,s="",r={};if(this.apiClient.isVertexAI()){const o=$n(this.apiClient,t);return s=n("{model}:predictLongRunning",o._url),r=o._query,delete o.config,delete o._url,delete o._query,i=this.apiClient.request({path:s,queryParams:r,body:JSON.stringify(o),httpMethod:"POST",httpOptions:null===(e=t.config)||void 0===e?void 0:e.httpOptions}).then((t=>t.json())),i.then((t=>fe(this.apiClient,t)))}{const e=qn(this.apiClient,t);return s=n("{model}:predictLongRunning",e._url),r=e._query,delete e.config,delete e._url,delete e._query,i=this.apiClient.request({path:s,queryParams:r,body:JSON.stringify(e),httpMethod:"POST",httpOptions:null===(o=t.config)||void 0===o?void 0:o.httpOptions}).then((t=>t.json())),i.then((t=>ie(this.apiClient,t)))}}}
/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */function ve(t,n){const i={},s=o(n,["_self"]);return null!=s&&e(i,["video"],function(t,n){const i={},s=o(n,["video","uri"]);null!=s&&e(i,["uri"],s);const r=o(n,["video","encodedVideo"]);null!=r&&e(i,["videoBytes"],E(0,r));const l=o(n,["encoding"]);return null!=l&&e(i,["mimeType"],l),i}(0,s)),i}function Ee(t,n){const i={},s=o(n,["name"]);null!=s&&e(i,["name"],s);const r=o(n,["metadata"]);null!=r&&e(i,["metadata"],r);const l=o(n,["done"]);null!=l&&e(i,["done"],l);const a=o(n,["error"]);null!=a&&e(i,["error"],a);const u=o(n,["response","generateVideoResponse"]);return null!=u&&e(i,["response"],function(t,n){const i={},s=o(n,["generatedSamples"]);null!=s&&(Array.isArray(s)?e(i,["generatedVideos"],s.map((t=>ve(0,t)))):e(i,["generatedVideos"],s));const r=o(n,["raiMediaFilteredCount"]);null!=r&&e(i,["raiMediaFilteredCount"],r);const l=o(n,["raiMediaFilteredReasons"]);return null!=l&&e(i,["raiMediaFilteredReasons"],l),i}(0,u)),i}function Te(t,n){const i={},s=o(n,["_self"]);return null!=s&&e(i,["video"],function(t,n){const i={},s=o(n,["gcsUri"]);null!=s&&e(i,["uri"],s);const r=o(n,["bytesBase64Encoded"]);null!=r&&e(i,["videoBytes"],E(0,r));const l=o(n,["mimeType"]);return null!=l&&e(i,["mimeType"],l),i}(0,s)),i}function Oe(t,n){const i={},s=o(n,["name"]);null!=s&&e(i,["name"],s);const r=o(n,["metadata"]);null!=r&&e(i,["metadata"],r);const l=o(n,["done"]);null!=l&&e(i,["done"],l);const a=o(n,["error"]);null!=a&&e(i,["error"],a);const u=o(n,["response"]);return null!=u&&e(i,["response"],function(t,n){const i={},s=o(n,["videos"]);null!=s&&(Array.isArray(s)?e(i,["generatedVideos"],s.map((t=>Te(0,t)))):e(i,["generatedVideos"],s));const r=o(n,["raiMediaFilteredCount"]);null!=r&&e(i,["raiMediaFilteredCount"],r);const l=o(n,["raiMediaFilteredReasons"]);return null!=l&&e(i,["raiMediaFilteredReasons"],l),i}(0,u)),i}
/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */class Ie extends t{constructor(t){super(),this.apiClient=t;}async getVideosOperation(t){const n=t.operation,e=t.config;if(void 0===n.name||""===n.name)throw new Error("Operation name is required.");if(this.apiClient.isVertexAI()){const t=n.name.split("/operations/")[0];let o;return e&&"httpOptions"in e&&(o=e.httpOptions),this.fetchPredictVideosOperationInternal({operationName:n.name,resourceName:t,config:{httpOptions:o}})}return this.getVideosOperationInternal({operationName:n.name,config:e})}async getVideosOperationInternal(t){var i,s;let r,l="",a={};if(this.apiClient.isVertexAI()){const s=function(t,n){const i={},s=o(n,["operationName"]);null!=s&&e(i,["_url","operationName"],s);const r=o(n,["config"]);return null!=r&&e(i,["config"],r),i}(this.apiClient,t);return l=n("{operationName}",s._url),a=s._query,delete s.config,delete s._url,delete s._query,r=this.apiClient.request({path:l,queryParams:a,body:JSON.stringify(s),httpMethod:"GET",httpOptions:null===(i=t.config)||void 0===i?void 0:i.httpOptions}).then((t=>t.json())),r.then((t=>Oe(this.apiClient,t)))}{const i=function(t,n){const i={},s=o(n,["operationName"]);null!=s&&e(i,["_url","operationName"],s);const r=o(n,["config"]);return null!=r&&e(i,["config"],r),i}(this.apiClient,t);return l=n("{operationName}",i._url),a=i._query,delete i.config,delete i._url,delete i._query,r=this.apiClient.request({path:l,queryParams:a,body:JSON.stringify(i),httpMethod:"GET",httpOptions:null===(s=t.config)||void 0===s?void 0:s.httpOptions}).then((t=>t.json())),r.then((t=>Ee(this.apiClient,t)))}}async fetchPredictVideosOperationInternal(t){var i;let s,r="",l={};if(this.apiClient.isVertexAI()){const a=function(t,n){const i={},s=o(n,["operationName"]);null!=s&&e(i,["operationName"],s);const r=o(n,["resourceName"]);null!=r&&e(i,["_url","resourceName"],r);const l=o(n,["config"]);return null!=l&&e(i,["config"],l),i}(this.apiClient,t);return r=n("{resourceName}:fetchPredictOperation",a._url),l=a._query,delete a.config,delete a._url,delete a._query,s=this.apiClient.request({path:r,queryParams:l,body:JSON.stringify(a),httpMethod:"POST",httpOptions:null===(i=t.config)||void 0===i?void 0:i.httpOptions}).then((t=>t.json())),s.then((t=>Oe(this.apiClient,t)))}throw new Error("This method is only supported by the Vertex AI.")}}
/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */const Ae=/^data: (.*)(?:\n\n|\r\r|\r\n\r\n)/;class _e extends Error{constructor(t,n){super(t,n?{cause:n}:{cause:(new Error).stack}),this.message=t,this.name="ClientError";}}class Se extends Error{constructor(t,n){super(t,n?{cause:n}:{cause:(new Error).stack}),this.message=t,this.name="ServerError";}}class we{constructor(t){var n,e;this.clientOptions=Object.assign(Object.assign({},t),{project:t.project,location:t.location,apiKey:t.apiKey,vertexai:t.vertexai});const o={};this.clientOptions.vertexai?(o.apiVersion=null!==(n=this.clientOptions.apiVersion)&&void 0!==n?n:"v1beta1",this.getProject()||this.getLocation()?(o.baseUrl=`https://${this.clientOptions.location}-aiplatform.googleapis.com/`,this.clientOptions.apiKey=void 0):(o.baseUrl="https://aiplatform.googleapis.com/",this.clientOptions.project=void 0,this.clientOptions.location=void 0)):(o.apiVersion=null!==(e=this.clientOptions.apiVersion)&&void 0!==e?e:"v1beta",o.baseUrl="https://generativelanguage.googleapis.com/"),o.headers=this.getDefaultHeaders(),this.clientOptions.httpOptions=o,t.httpOptions&&(this.clientOptions.httpOptions=this.patchHttpOptions(o,t.httpOptions));}isVertexAI(){var t;return null!==(t=this.clientOptions.vertexai)&&void 0!==t&&t}getProject(){return this.clientOptions.project}getLocation(){return this.clientOptions.location}getApiVersion(){if(this.clientOptions.httpOptions&&void 0!==this.clientOptions.httpOptions.apiVersion)return this.clientOptions.httpOptions.apiVersion;throw new Error("API version is not set.")}getBaseUrl(){if(this.clientOptions.httpOptions&&void 0!==this.clientOptions.httpOptions.baseUrl)return this.clientOptions.httpOptions.baseUrl;throw new Error("Base URL is not set.")}getRequestUrl(){return this.getRequestUrlInternal(this.clientOptions.httpOptions)}getHeaders(){if(this.clientOptions.httpOptions&&void 0!==this.clientOptions.httpOptions.headers)return this.clientOptions.httpOptions.headers;throw new Error("Headers are not set.")}getRequestUrlInternal(t){if(!t||void 0===t.baseUrl||void 0===t.apiVersion)throw new Error("HTTP options are not correctly set.");const n=[t.baseUrl.endsWith("/")?t.baseUrl.slice(0,-1):t.baseUrl];return t.apiVersion&&""!==t.apiVersion&&n.push(t.apiVersion),n.join("/")}getBaseResourcePath(){return `projects/${this.clientOptions.project}/locations/${this.clientOptions.location}`}getApiKey(){return this.clientOptions.apiKey}getWebsocketBaseUrl(){const t=this.getBaseUrl(),n=new URL(t);return n.protocol="wss",n.toString()}setBaseUrl(t){if(!this.clientOptions.httpOptions)throw new Error("HTTP options are not correctly set.");this.clientOptions.httpOptions.baseUrl=t;}constructUrl(t,n,e){const o=[this.getRequestUrlInternal(n)];e&&o.push(this.getBaseResourcePath()),""!==t&&o.push(t);return new URL(`${o.join("/")}`)}shouldPrependVertexProjectPath(t){return !this.clientOptions.apiKey&&(!!this.clientOptions.vertexai&&(!t.path.startsWith("projects/")&&("GET"!==t.httpMethod||!t.path.startsWith("publishers/google/models"))))}async request(t){let n=this.clientOptions.httpOptions;t.httpOptions&&(n=this.patchHttpOptions(this.clientOptions.httpOptions,t.httpOptions));const e=this.shouldPrependVertexProjectPath(t),o=this.constructUrl(t.path,n,e);if(t.queryParams)for(const[n,e]of Object.entries(t.queryParams))o.searchParams.append(n,String(e));let i={};if("GET"===t.httpMethod){if(t.body&&"{}"!==t.body)throw new Error("Request body should be empty for GET request, but got non empty request body")}else i.body=t.body;return i=await this.includeExtraHttpOptionsToRequestInit(i,n),this.unaryApiCall(o,i,t.httpMethod)}patchHttpOptions(t,n){const e=JSON.parse(JSON.stringify(t));for(const[t,o]of Object.entries(n))"object"==typeof o?e[t]=Object.assign(Object.assign({},e[t]),o):void 0!==o&&(e[t]=o);return e}async requestStream(t){let n=this.clientOptions.httpOptions;t.httpOptions&&(n=this.patchHttpOptions(this.clientOptions.httpOptions,t.httpOptions));const e=this.shouldPrependVertexProjectPath(t),o=this.constructUrl(t.path,n,e);o.searchParams.has("alt")&&"sse"===o.searchParams.get("alt")||o.searchParams.set("alt","sse");let i={};return i.body=t.body,i=await this.includeExtraHttpOptionsToRequestInit(i,n),this.streamApiCall(o,i,t.httpMethod)}async includeExtraHttpOptionsToRequestInit(t,n){if(n&&n.timeout&&n.timeout>0){const e=new AbortController,o=e.signal;setTimeout((()=>e.abort()),n.timeout),t.signal=o;}return t.headers=await this.getHeadersInternal(n),t}async unaryApiCall(t,n,e){return this.apiCall(t.toString(),Object.assign(Object.assign({},n),{method:e})).then((async t=>(await Pe(t),new kt(t)))).catch((t=>{throw t instanceof Error?t:new Error(JSON.stringify(t))}))}async streamApiCall(t,n,e){return this.apiCall(t.toString(),Object.assign(Object.assign({},n),{method:e})).then((async t=>(await Pe(t),this.processStreamResponse(t)))).catch((t=>{throw t instanceof Error?t:new Error(JSON.stringify(t))}))}processStreamResponse(t){var n;return Wt(this,arguments,(function*(){const e=null===(n=null==t?void 0:t.body)||void 0===n?void 0:n.getReader(),o=new TextDecoder("utf-8");if(!e)throw new Error("Response body is empty");try{let n="";for(;;){const{done:i,value:s}=yield Jt(e.read());if(i){if(n.trim().length>0)throw new Error("Incomplete JSON segment at the end");break}n+=o.decode(s);let r=n.match(Ae);for(;r;){const e=r[1];try{const o=new Response(e,{headers:null==t?void 0:t.headers,status:null==t?void 0:t.status,statusText:null==t?void 0:t.statusText});yield yield Jt(new kt(o)),n=n.slice(r[0].length),r=n.match(Ae);}catch(t){throw new Error(`exception parsing stream chunk ${e}. ${t}`)}}}}finally{e.releaseLock();}}))}async apiCall(t,n){return fetch(t,n).catch((t=>{throw new Error(`exception ${t} sending request`)}))}getDefaultHeaders(){const t={},n="google-genai-sdk/0.9.0 "+this.clientOptions.userAgentExtra;return t["User-Agent"]=n,t["x-goog-api-client"]=n,t["Content-Type"]="application/json",t}async getHeadersInternal(t){const n=new Headers;if(t&&t.headers){for(const[e,o]of Object.entries(t.headers))n.append(e,o);t.timeout&&t.timeout>0&&n.append("X-Server-Timeout",String(Math.ceil(t.timeout/1e3)));}return await this.clientOptions.auth.addAuthHeaders(n),n}async uploadFile(t,n){var e;const o={};null!=n&&(o.mimeType=n.mimeType,o.name=n.name,o.displayName=n.displayName),o.name&&!o.name.startsWith("files/")&&(o.name=`files/${o.name}`);const i=this.clientOptions.uploader,s=await i.stat(t);o.sizeBytes=String(s.size);const r=null!==(e=null==n?void 0:n.mimeType)&&void 0!==e?e:s.type;if(void 0===r||""===r)throw new Error("Can not determine mimeType. Please provide mimeType in the config.");o.mimeType=r;const l=await this.fetchUploadUrl(o,n);return i.upload(t,l,this)}async fetchUploadUrl(t,e){var o;let i={};i=(null==e?void 0:e.httpOptions)?e.httpOptions:{apiVersion:"",headers:{"Content-Type":"application/json","X-Goog-Upload-Protocol":"resumable","X-Goog-Upload-Command":"start","X-Goog-Upload-Header-Content-Length":`${t.sizeBytes}`,"X-Goog-Upload-Header-Content-Type":`${t.mimeType}`}};const s={file:t},r=await this.request({path:n("upload/v1beta/files",s._url),body:JSON.stringify(s),httpMethod:"POST",httpOptions:i});if(!r||!(null==r?void 0:r.headers))throw new Error("Server did not return an HttpResponse or the returned HttpResponse did not have headers.");const l=null===(o=null==r?void 0:r.headers)||void 0===o?void 0:o["x-goog-upload-url"];if(void 0===l)throw new Error("Failed to get upload url. Server did not return the x-google-upload-url in the headers");return l}}async function Pe(t){var n;if(void 0===t)throw new Se("response is undefined");if(!t.ok){const e=t.status,o=t.statusText;let i;i=(null===(n=t.headers.get("content-type"))||void 0===n?void 0:n.includes("application/json"))?await t.json():{error:{message:"exception parsing response",code:t.status,status:t.statusText}};const s=`got status: ${e} ${o}. ${JSON.stringify(i)}`;if(e>=400&&e<500){throw new _e(s)}if(e>=500&&e<600){throw new Se(s)}throw new Error(s)}}class Re{async upload(t,n,e){if("string"==typeof t)throw new Error("File path is not supported in browser uploader.");return await async function(t,n,e){var o,i;let s=0,r=0,l=new kt(new Response),a="upload";for(s=t.size;r<s;){const i=Math.min(8388608,s-r),u=t.slice(r,r+i);if(r+i>=s&&(a+=", finalize"),l=await e.request({path:"",body:u,httpMethod:"POST",httpOptions:{apiVersion:"",baseUrl:n,headers:{"X-Goog-Upload-Command":a,"X-Goog-Upload-Offset":String(r),"Content-Length":String(i)}}}),r+=i,"active"!==(null===(o=null==l?void 0:l.headers)||void 0===o?void 0:o["x-goog-upload-status"]))break;if(s<=r)throw new Error("All content has been uploaded, but the upload status is not finalized.")}const u=await(null==l?void 0:l.json());if("final"!==(null===(i=null==l?void 0:l.headers)||void 0===i?void 0:i["x-goog-upload-status"]))throw new Error("Failed to upload file: Upload status is not finalized.");return u.file}(t,n,e)}async stat(t){if("string"==typeof t)throw new Error("File path is not supported in browser uploader.");return await async function(t){return {size:t.size,type:t.type}}(t)}}
/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */class Ne{create(t,n,e){return new be(t,n,e)}}class be{constructor(t,n,e){this.url=t,this.headers=n,this.callbacks=e;}connect(){this.ws=new WebSocket(this.url),this.ws.onopen=this.callbacks.onopen,this.ws.onerror=this.callbacks.onerror,this.ws.onclose=this.callbacks.onclose,this.ws.onmessage=this.callbacks.onmessage;}send(t){if(void 0===this.ws)throw new Error("WebSocket is not connected");this.ws.send(t);}close(){if(void 0===this.ws)throw new Error("WebSocket is not connected");this.ws.close();}}
/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */const De="x-goog-api-key";class xe{constructor(t){this.apiKey=t;}async addAuthHeaders(t){null===t.get(De)&&t.append(De,this.apiKey);}}
/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */class Me{constructor(t){var n;if(null==t.apiKey)throw new Error("An API Key must be set when running in a browser");if(t.project||t.location)throw new Error("Vertex AI project based authentication is not supported on browser runtimes. Please do not provide a project or location.");this.vertexai=null!==(n=t.vertexai)&&void 0!==n&&n,this.apiKey=t.apiKey,this.apiVersion=t.apiVersion;const e=new xe(this.apiKey);this.apiClient=new we({auth:e,apiVersion:this.apiVersion,apiKey:this.apiKey,vertexai:this.vertexai,httpOptions:t.httpOptions,userAgentExtra:"gl-node/web",uploader:new Re}),this.models=new Ce(this.apiClient),this.live=new me(this.apiClient,e,new Ne),this.chats=new Qt(this.models,this.apiClient),this.caches=new Yt(this.apiClient),this.files=new on(this.apiClient),this.operations=new Ie(this.apiClient);}}

function isImageMimeType(mimeType) {
    return imageMimeTypes.includes(mimeType);
}
function isVideoMimeType(mimeType) {
    return videoMimeTypes.includes(mimeType);
}
function isAudioMimeType(mimeType) {
    return audioMimeTypes.includes(mimeType);
}
/**
 * @param messages Array of messages with medias to fetch metadata
 * @returns Return medias that failed to fetch metadata
 */
async function fetchMediasMetadata(messages) {
    let failedMedias = [];
    const medias = messages.flatMap((message) => [message.images, message.videos].filter(Boolean).flat());
    for (const media of medias) {
        if (media.mimeType && media.size) {
            continue;
        }
        try {
            const metadata = await fetchMediaMetadata(media.url);
            if (metadata.url) {
                media.url = metadata.url;
            }
            if (!media.mimeType && metadata.contentType && (isImageMimeType(metadata.contentType) || isVideoMimeType(metadata.contentType))) {
                media.mimeType = metadata.contentType;
            }
            if (!media.size && metadata.contentLength) {
                media.size = metadata.contentLength;
            }
        }
        catch (error) {
            console.error(LOG_PREFIX, "Failed to fetch media metadata", error);
            failedMedias.push(media);
        }
    }
    return failedMedias;
}
async function fetchMediaMetadata(url, n = 0) {
    const response = await fetch(url, { method: "HEAD" });
    if (!response.ok) {
        throw new Error(`Failed to fetch media (${url}) metadata: ${response.status} ${response.statusText}`);
    }
    const contentType = response.headers.get("content-type") || undefined;
    const contentLength = response.headers.get("content-length") || undefined;
    if (!contentType && n < 3) {
        const location = response.headers.get("location");
        if (location) {
            return fetchMediaMetadata(location, n + 1);
        }
    }
    return {
        url: n > 0 ? url : undefined,
        contentType: contentType,
        contentLength: contentLength ? Number(contentLength) : undefined
    };
}

function getOldestId(a, b) {
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
function convertTimestampToUnix(timestamp) {
    return Math.floor(new Date(timestamp).getTime() / 1000);
}
function convertArrayBufferToBase64(buffer) {
    const bytes = new Uint8Array(buffer);
    let binary = "";
    const chunk = 1024;
    for (let i = 0; i < bytes.length; i += chunk) {
        const slice = bytes.subarray(i, i + chunk);
        binary += String.fromCharCode.apply(null, Array.from(slice));
    }
    return btoa(binary);
}
function generateMessageId(previousMessageId) {
    return (BigInt(previousMessageId) + BigInt(1)).toString();
}
function createMessage({ guildId, channelId, previousMessageId, id = previousMessageId ? generateMessageId(previousMessageId) : undefined, author, content, flags = DiscordMessageFlags.DEFAULT, reply, components }) {
    if (!id) {
        throw new Error("Either id or previousMessageId must be provided");
    }
    const messageReference = reply
        ? {
            guild_id: guildId,
            channel_id: channelId,
            message_id: reply.id,
            type: 0
        }
        : undefined;
    return {
        id,
        author,
        blocked: false,
        bot: false,
        channel_id: channelId,
        components: components?.length
            ? [
                {
                    components: components,
                    id: "0",
                    type: 1
                }
            ]
            : undefined,
        content: content,
        flags: flags,
        ignored: false,
        isSearchHit: false,
        isUnsupported: false,
        mentionChannels: [],
        mentionEveryone: false,
        mentionRoles: [],
        mentioned: false,
        mentions: [],
        messageReference: messageReference,
        message_reference: messageReference,
        referenced_message: reply,
        nonce: null,
        pinned: false,
        reactions: [],
        state: DiscordMessageState.SENT,
        timestamp: new Date().toISOString(),
        tts: false,
        type: reply ? DiscordMessageType.REPLY : DiscordMessageType.DEFAULT
    };
}
function mapMessages(stores, messages, maxVideos = GEMINI_VIDEOS_LIMIT) {
    const guildId = stores.selectedGuildStore.getGuildId();
    let countVideos = 0;
    const addImage = (url) => {
        const extension = url.split(".").pop();
        const mimeType = extension ? `image/${extension}` : undefined;
        return {
            name: url,
            mimeType: mimeType && isImageMimeType(mimeType) ? mimeType : undefined,
            url: url
        };
    };
    const mappedMessages = messages.map((message) => {
        const member = stores.guildMemberStore.getMember(guildId, message.author.id);
        const images = [];
        const videos = [];
        const audios = [];
        // Add attachments
        message.attachments?.forEach((attachment) => {
            if (isImageMimeType(attachment.content_type)) {
                images.push({
                    name: attachment.proxy_url,
                    url: attachment.proxy_url,
                    mimeType: attachment.content_type,
                    size: attachment.size
                });
            }
            else if (isVideoMimeType(attachment.content_type)) {
                videos.push({
                    name: attachment.proxy_url,
                    url: attachment.proxy_url,
                    mimeType: attachment.content_type,
                    size: attachment.size
                });
            }
            else if (isAudioMimeType(attachment.content_type)) {
                audios.push({
                    name: attachment.proxy_url,
                    url: attachment.proxy_url,
                    mimeType: attachment.content_type,
                    size: attachment.size
                });
            }
        });
        // Add embeds
        message.embeds?.forEach((embed) => {
            if (embed.type === "image" && embed.image) {
                const url = embed.image.proxyURL || embed.image.proxy_url || embed.image.url;
                images.push(addImage(url));
            }
            else if (["video", "gifv"].includes(embed.type) && embed.video) {
                const url = embed.video.proxyURL || embed.video.proxy_url;
                if (url) {
                    const extension = url.split(".").pop();
                    const mimeType = extension ? `video/${extension}` : undefined;
                    videos.push({
                        name: url,
                        mimeType: mimeType && isVideoMimeType(mimeType) ? mimeType : undefined,
                        url: url,
                        thumbnail: embed.thumbnail.proxyURL || embed.thumbnail.proxy_url
                    });
                }
                else {
                    const thumbnailUrl = embed.thumbnail.proxyURL || embed.thumbnail.proxy_url;
                    if (thumbnailUrl) {
                        images.push(addImage(thumbnailUrl));
                    }
                }
            }
        });
        countVideos += videos.length;
        return {
            id: message.id,
            author: {
                username: `<@${message.author.id}>`,
                roles: member?.roles.map((roleId) => `<@&${roleId}>`) || []
            },
            content: message.content,
            images,
            videos,
            audios,
            date: convertTimestampToUnix(message.timestamp)
        };
    });
    // Limit the number of videos to maxVideos
    if (countVideos > maxVideos) {
        for (const message of mappedMessages) {
            const videos = message.videos;
            if (countVideos > maxVideos) {
                for (let k = 0; k < videos.length && countVideos > maxVideos; k++) {
                    const thumbnailUrl = videos[k]?.thumbnail;
                    if (thumbnailUrl) {
                        message.images.push(addImage(thumbnailUrl));
                    }
                    videos[k] = undefined;
                    countVideos--;
                }
                message.videos = videos.filter((video) => video);
            }
        }
    }
    return mappedMessages;
}

const MAX_INLINE_DATA_SIZE = 20_000_000;
class GeminiAi {
    _log;
    _genAI;
    _apiKey;
    get _modelName() {
        const modelName = getSetting(SETTING_AI_MODEL);
        if (!modelName)
            throw "AI model is missing";
        return modelName;
    }
    constructor(_log) {
        this._log = _log;
        const apiKey = getSetting(SETTING_GOOGLE_API_KEY);
        if (!apiKey) {
            throw "Google API Key is missing";
        }
        this._apiKey = apiKey;
        this._genAI = new Me({ apiKey });
    }
    async purgeMedias() {
        const listResponse = await this._genAI.files.list();
        const deletingPromises = [];
        for await (const file of listResponse) {
            if (file.name) {
                deletingPromises.push(this._genAI.files.delete({ name: file.name }));
            }
        }
        if (deletingPromises.length) {
            await Promise.allSettled(deletingPromises);
        }
        if (listResponse.hasNextPage()) {
            await this.purgeMedias();
        }
    }
    async summarizeMessages(previousMessages = [], unreadMessages) {
        const promptData = await this._getMediasPrompt(unreadMessages);
        const request = promptData.flatMap((promptItem) => [getTextPromptItem(promptItem.message), ...(promptItem.dataPart || [])]);
        return this._genAI.models.generateContentStream({
            model: this._modelName,
            config: {
                systemInstruction: this._getSystemInstruction(previousMessages, promptData)
            },
            contents: request
        });
    }
    async isSensitiveContent(messages) {
        const request = await this._getSensitiveContentPrompt(messages);
        if (!request.length || request.every((item) => typeof item === "string")) {
            return undefined;
        }
        const schema = {
            type: H.OBJECT,
            properties: {
                isEmetophobia: { type: H.BOOLEAN },
                isArachnophobia: { type: H.BOOLEAN },
                isEpileptic: { type: H.BOOLEAN },
                isSexual: { type: H.BOOLEAN }
            },
            required: ["isEmetophobia", "isArachnophobia", "isEpileptic", "isSexual"]
        };
        const response = await this._genAI.models.generateContent({
            model: this._modelName,
            config: {
                systemInstruction: [`Check if the content is sensitive for:`, `- Emetophobia`, `- Arachnophobia`, `- Epilepsy`, `- Sexuality`].join("\n"),
                responseMimeType: "application/json",
                responseSchema: schema
            },
            contents: request
        });
        return response.text ? JSON.parse(response.text) : undefined;
    }
    _getSystemInstruction(previousMessages, promptData) {
        const now = new Date();
        const timestamp = convertTimestampToUnix(now);
        const formattedTime = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
        const formattedLongDate = now.toLocaleDateString(undefined, { day: "numeric", month: "long", year: "numeric" });
        const formattedShortDateTime = now.toLocaleDateString(undefined, { day: "numeric", month: "long", year: "numeric" }) + " " + formattedTime;
        const formattedLongDateTime = now.toLocaleDateString(undefined, { weekday: "long", day: "numeric", month: "long", year: "numeric" }) + " " + formattedTime;
        return [
            i18n.SYSTEM_INSTRUCTIONS.INTRODUCTION,
            promptData.some((prompt) => prompt.dataPart?.length) ? i18n.SYSTEM_INSTRUCTIONS.MEDIAS : undefined,
            ...i18n.SYSTEM_INSTRUCTIONS.CONTENT({ timestamp, formattedTime, formattedLongDate, formattedShortDateTime, formattedLongDateTime }),
            ...previousMessages.map((message) => `- ${getTextPromptItem(message)}`)
        ]
            .filter(Boolean)
            .join("\n");
    }
    async _getSensitiveContentPrompt(messages) {
        const filteredMessages = this._filterUploadableMedias(messages);
        if (this._getMediasTotalSize(filteredMessages) > MAX_INLINE_DATA_SIZE) {
            return [];
        }
        return (await this._getMediasInlineData(filteredMessages))
            .flatMap((promptItem) => [promptItem.message.content, ...(promptItem.dataPart || [])])
            .filter((promptItem) => typeof promptItem !== "string" || promptItem.trim().length > 0);
    }
    async _getMediasPrompt(messages) {
        const filteredMessages = this._filterUploadableMedias(messages);
        if (this._getMediasTotalSize(filteredMessages) < MAX_INLINE_DATA_SIZE) {
            return this._getMediasInlineData(filteredMessages);
        }
        return this._getMediasFileManager(filteredMessages);
    }
    _filterUploadableMedias(messages) {
        const maxMediaSize = (getSetting(SETTING_MEDIA_MAX_SIZE) || MAX_MEDIA_SIZE) * 1_000_000;
        const filterCondition = (media) => media?.mimeType && media.size && media.size <= maxMediaSize;
        return messages.map((message) => ({
            ...message,
            images: message.images?.filter(filterCondition),
            videos: message.videos?.filter(filterCondition),
            audios: message.audios?.filter(filterCondition)
        }));
    }
    _getMediasTotalSize(messages) {
        return messages.reduce((total, message) => total +
            (message.images?.reduce((sum, image) => sum + (image.size || 0), 0) || 0) +
            (message.videos?.reduce((sum, video) => sum + (video.size || 0), 0) || 0) +
            (message.audios?.reduce((sum, audio) => sum + audio.size, 0) || 0), 0);
    }
    async _getMediasInlineData(messages) {
        const promptItems = [];
        for (const message of messages) {
            const medias = [message.images, message.videos, message.audios].filter(Boolean).flat();
            const mediasPrompt = [];
            const convertingMediasToBuffer = [];
            for (const media of medias) {
                try {
                    const response = await fetch(media.url);
                    if (!response.ok) {
                        throw `${media.url}: ${response.status} ${response.statusText}`;
                    }
                    convertingMediasToBuffer.push(response.arrayBuffer().then((buffer) => {
                        if (!media.mimeType)
                            throw "Media mimeType is missing";
                        mediasPrompt.push(Tt(convertArrayBufferToBase64(buffer), media.mimeType));
                    }));
                }
                catch (error) {
                    this._log(`Failed to fetch media ${error}`, "warn");
                }
            }
            await Promise.allSettled(convertingMediasToBuffer);
            promptItems.push({ message, dataPart: mediasPrompt });
        }
        return promptItems;
    }
    async _getMediasFileManager(messages) {
        const messagesFiles = [];
        const uploadedCache = {};
        for (const message of messages) {
            const medias = [message.images, message.videos, message.audios].filter(Boolean).flat();
            const files = [];
            for (const media of medias) {
                try {
                    if (uploadedCache[media.url]) {
                        files.push(uploadedCache[media.url]);
                    }
                    else {
                        const file = await this._uploadFileFromUrl(media);
                        files.push(file);
                        uploadedCache[media.url] = file;
                    }
                }
                catch (error) {
                    this._log(`Failed to upload media ${error}`, "warn");
                }
            }
            messagesFiles.push({ message, files });
        }
        const timeout = Date.now() + 30_000;
        const verifiedFiles = new Set();
        while (messagesFiles.some((messageFiles) => messageFiles.files.some((file) => file.state === st.PROCESSING))) {
            for (const messageFiles of messagesFiles) {
                for (let i = 0; i < messageFiles.files.length; i++) {
                    const file = messageFiles.files[i];
                    if (file.name && !verifiedFiles.has(file.name)) {
                        if (file.state === st.PROCESSING) {
                            try {
                                messageFiles.files[i] = await this._genAI.files.get({ name: file.name });
                            }
                            catch (error) {
                                this._log(`Failed to fetch file metadata ${error}`, "warn");
                            }
                        }
                        else {
                            verifiedFiles.add(file.name);
                        }
                    }
                }
            }
            if (Date.now() > timeout) {
                this._log("Timeout while waiting processing files", "warn");
                break;
            }
        }
        return messagesFiles.map((messageFiles) => ({
            message: messageFiles.message,
            dataPart: messageFiles.files.filter((file) => file.state === st.ACTIVE && file.uri && file.mimeType).map((file) => yt(file.uri, file.mimeType))
        }));
    }
    async _uploadFileFromUrl(media) {
        if (!media.mimeType)
            throw "Media mimeType is missing";
        const fileResponse = await fetch(media.url);
        if (!fileResponse.ok) {
            throw new Error(`Failed to fetch file: ${fileResponse.statusText}`);
        }
        const fileData = await fileResponse.arrayBuffer();
        return this._genAI.files.upload({
            file: new Blob([fileData], { type: media.mimeType })
        });
    }
}
function getTextPromptItem(message) {
    return JSON.stringify({
        [i18n.AUTHOR]: message.author.username,
        [i18n.DATE]: message.date,
        [i18n.CONTENT]: message.content
    });
}

const aiStarsIcon = `
<?xml version="1.0" encoding="utf-8"?>
<svg width="20px" height="20px" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" fill="white">
  <path d="M7.657 6.247c.11-.33.576-.33.686 0l.645 1.937a2.89 2.89 0 0 0 1.829 1.828l1.936.645c.33.11.33.576 0 .686l-1.937.645a2.89 2.89 0 0 0-1.828 1.829l-.645 1.936a.361.361 0 0 1-.686 0l-.645-1.937a2.89 2.89 0 0 0-1.828-1.828l-1.937-.645a.361.361 0 0 1 0-.686l1.937-.645a2.89 2.89 0 0 0 1.828-1.828l.645-1.937zM3.794 1.148a.217.217 0 0 1 .412 0l.387 1.162c.173.518.579.924 1.097 1.097l1.162.387a.217.217 0 0 1 0 .412l-1.162.387A1.734 1.734 0 0 0 4.593 5.69l-.387 1.162a.217.217 0 0 1-.412 0L3.407 5.69A1.734 1.734 0 0 0 2.31 4.593l-1.162-.387a.217.217 0 0 1 0-.412l1.162-.387A1.734 1.734 0 0 0 3.407 2.31l.387-1.162zM10.863.099a.145.145 0 0 1 .274 0l.258.774c.115.346.386.617.732.732l.774.258a.145.145 0 0 1 0 .274l-.774.258a1.156 1.156 0 0 0-.732.732l-.258.774a.145.145 0 0 1-.274 0l-.258-.774a1.156 1.156 0 0 0-.732-.732L9.1 2.137a.145.145 0 0 1 0-.274l.774-.258c.346-.115.617-.386.732-.732L10.863.1z"/>
</svg>
`;

class SummaryButton {
    _log;
    _onClick;
    _id = "summary-button";
    _enabled = false;
    _isLoading = false;
    constructor(_log, _onClick) {
        this._log = _log;
        this._onClick = _onClick;
    }
    toggle(value) {
        if ((value || (value === undefined && !this._enabled)) && !getSetting(SETTING_GOOGLE_API_KEY)?.length) {
            return;
        }
        if (value !== undefined) {
            this._enabled = value;
        }
        else {
            this._enabled = !this._enabled;
        }
        if (this._enabled) {
            this._add();
        }
        else {
            this._remove();
        }
    }
    _add() {
        if (!this._enabled || document.getElementById(this._id))
            return;
        const toolbar = document.querySelector('[class^="toolbar__"]');
        if (!toolbar) {
            return this._log("Toolbar not found");
        }
        const button = BdApi.React.createElement(BdApi.Components.Button, {
            children: [
                BdApi.React.createElement("div", { dangerouslySetInnerHTML: { __html: aiStarsIcon }, style: { marginRight: "4px" } }),
                i18n.SUMMARY_BUTTON
            ],
            size: "bd-button-small",
            disabled: this._isLoading,
            style: { cursor: this._isLoading ? "wait" : undefined },
            onClick: async () => {
                if (this._isLoading)
                    return;
                this._isLoading = true;
                this._refresh();
                try {
                    await this._onClick();
                    this.toggle(false);
                }
                catch (error) {
                    if (typeof error === "string") {
                        this._log(error);
                    }
                    else if (error instanceof Error) {
                        this._log(error.message);
                    }
                    else {
                        console.error(LOG_PREFIX, error);
                    }
                }
                finally {
                    this._isLoading = false;
                    this._refresh();
                }
            }
        });
        const node = document.createElement("div");
        node.id = this._id;
        node.style.margin = "0 8px";
        toolbar.insertBefore(node, toolbar.firstChild);
        BdApi.ReactDOM.render(button, node);
        BdApi.DOM.onRemoved(node, this._add.bind(this));
    }
    _remove() {
        const element = document.getElementById(this._id);
        if (element) {
            BdApi.ReactDOM.unmountComponentAtNode(element);
            element.remove();
        }
    }
    _refresh() {
        this._remove();
        this._add();
    }
}

class UnreadMessage {
    _selectedGuildStore;
    _guildMemberStore;
    _selectedChannelStore;
    _readStateStore;
    _messageStore;
    _messageActions;
    get channelId() {
        return this._selectedChannelStore.getCurrentlySelectedChannelId();
    }
    constructor(_selectedGuildStore, _guildMemberStore, _selectedChannelStore, _readStateStore, _messageStore, _messageActions) {
        this._selectedGuildStore = _selectedGuildStore;
        this._guildMemberStore = _guildMemberStore;
        this._selectedChannelStore = _selectedChannelStore;
        this._readStateStore = _readStateStore;
        this._messageStore = _messageStore;
        this._messageActions = _messageActions;
    }
    hasUnreadMessages(channelId = this.channelId) {
        if (!channelId)
            return false;
        const channelReadState = this._readStateStore.getReadStatesByChannel()[channelId];
        if (channelReadState.oldestUnreadMessageId) {
            const messages = this._messageStore.getMessages(channelId);
            const summaryMinLength = getSetting(SETTING_SUMMARY_MIN_LENGTH);
            let nChar = 0;
            return messages.some((message) => {
                if (getOldestId(message.id, channelReadState.oldestUnreadMessageId || undefined) === channelReadState.oldestUnreadMessageId) {
                    nChar += message.content.length;
                    return !summaryMinLength || nChar >= summaryMinLength;
                }
                return false;
            });
        }
        return false;
    }
    async getUnreadMessages(channelId = this.channelId) {
        if (!channelId)
            throw "No channel selected";
        const channelReadState = this._readStateStore.getReadStatesByChannel()[channelId];
        if (channelReadState.oldestUnreadMessageId) {
            const oldestMessageId = getOldestId(channelReadState.oldestUnreadMessageId, channelReadState.ackMessageId) === channelReadState.oldestUnreadMessageId ||
                this._messageStore.getMessages(channelId).some((message) => message.id === channelReadState.ackMessageId)
                ? channelReadState.oldestUnreadMessageId
                : channelReadState.ackMessageId;
            const messages = await this._fetchAllMessages(channelId, oldestMessageId, channelReadState.lastMessageId);
            const { previousMessages, unreadMessages } = messages.reduce((acc, message) => {
                if (getOldestId(message.id, oldestMessageId) === oldestMessageId) {
                    acc.unreadMessages.push(message);
                }
                else {
                    acc.previousMessages.push(message);
                }
                return acc;
            }, { previousMessages: [], unreadMessages: [] });
            const mapMessagesStores = { selectedGuildStore: this._selectedGuildStore, guildMemberStore: this._guildMemberStore };
            const mappedUnreadMessages = mapMessages(mapMessagesStores, unreadMessages);
            const unreadVideos = mappedUnreadMessages.reduce((acc, message) => acc + (message.videos?.length || 0), 0);
            return {
                referenceMessage: oldestMessageId,
                previousMessages: mapMessages(mapMessagesStores, previousMessages, GEMINI_VIDEOS_LIMIT - unreadVideos),
                unreadMessages: mappedUnreadMessages
            };
        }
        throw "No unread messages";
    }
    async _fetchAllMessages(channelId, oldestMessage, latestMessage) {
        await this._fetchAllMessagesBefore(channelId, oldestMessage);
        return this._fetchAllMessagesAfter(channelId, latestMessage);
    }
    async _fetchAllMessagesBefore(channelId, oldestMessage) {
        const messages = this._messageStore.getMessages(channelId);
        const firstCurrentMessage = messages.first().id;
        // The second condition is a security to avoid infinite loop if the oldest message has been deleted
        if (!messages.some((message) => message.id === oldestMessage) && getOldestId(firstCurrentMessage, oldestMessage) === oldestMessage) {
            await this._messageActions.fetchMessages({ channelId, limit: 100, before: firstCurrentMessage });
            const newMessages = this._messageStore.getMessages(channelId);
            if (newMessages.first().id === firstCurrentMessage) {
                return messages;
            }
            return this._fetchAllMessagesBefore(channelId, oldestMessage);
        }
        return messages;
    }
    async _fetchAllMessagesAfter(channelId, lastMessage) {
        const messages = this._messageStore.getMessages(channelId);
        const lastCurrentMessage = messages.last().id;
        if (!messages.some((message) => message.id === lastMessage) && getOldestId(lastCurrentMessage, lastMessage) === lastCurrentMessage) {
            await this._messageActions.fetchMessages({ channelId, limit: 100, after: lastCurrentMessage });
            const newMessages = this._messageStore.getMessages(channelId);
            if (newMessages.last().id === lastCurrentMessage) {
                return messages;
            }
            return this._fetchAllMessagesAfter(channelId, lastMessage);
        }
        return messages;
    }
}

class BDiscordAI {
    _userStore;
    _guildMemberStore;
    _selectedGuildStore;
    _selectedChannelStore;
    _readStateStore;
    _messageStore;
    _messageActions;
    _fluxDispatcher;
    _onEventSubscriptionCb = this._onEvent.bind(this);
    _summaryButton;
    _unreadMessages;
    _listeningEvents = [
        "CHANNEL_SELECT",
        "MESSAGE_CREATE",
        "MESSAGE_UPDATE",
        "MESSAGE_DELETE",
        "LOAD_MESSAGES_SUCCESS",
        "MESSAGE_ACK"
    ];
    _isSensitiveMessageCheck = new Set();
    _closeApiKeyNotice;
    start() {
        console.warn(LOG_PREFIX, "Started");
        setLocale();
        this._userStore = BdApi.Webpack.getStore("UserStore");
        this._guildMemberStore = BdApi.Webpack.getStore("GuildMemberStore");
        this._selectedGuildStore = BdApi.Webpack.getStore("SelectedGuildStore");
        this._selectedChannelStore = BdApi.Webpack.getStore("SelectedChannelStore");
        this._readStateStore = BdApi.Webpack.getStore("ReadStateStore");
        this._messageStore = BdApi.Webpack.getStore("MessageStore");
        this._messageActions = BdApi.Webpack.getByKeys("jumpToMessage", "_sendMessage");
        this._fluxDispatcher = BdApi.Webpack.getByKeys("actionLogger");
        this._summaryButton = new SummaryButton(this._log.bind(this), this._summarize.bind(this));
        this._unreadMessages = new UnreadMessage(this._selectedGuildStore, this._guildMemberStore, this._selectedChannelStore, this._readStateStore, this._messageStore, this._messageActions);
        this._subscribeEvents();
        this._enableSummaryButtonIfNeeded();
        if (!getSetting(SETTING_GOOGLE_API_KEY)?.trim().length) {
            this._showAddApiKeyNotice();
        }
        else {
            new GeminiAi(this._log.bind(this)).purgeMedias();
        }
    }
    stop() {
        this._summaryButton?.toggle(false);
        this._closeApiKeyNotice?.();
        this._isSensitiveMessageCheck.clear();
        this._unsubscribeEvents();
        BdApi.Patcher.unpatchAll(getConfig().name);
        console.warn(LOG_PREFIX, "Stopped");
    }
    getSettingsPanel() {
        return BdApi.UI.buildSettingsPanel({
            settings: getConfig().settings,
            onChange: (_category, id, value) => {
                BdApi.Data.save(getConfig().name, id, value);
                if (this._closeApiKeyNotice && id === SETTING_GOOGLE_API_KEY) {
                    this._closeApiKeyNotice();
                    this._closeApiKeyNotice = undefined;
                }
            }
        });
    }
    _log(message, type = "error") {
        const logMessage = `${LOG_PREFIX} ${message}`;
        BdApi.UI.showToast(logMessage, { type: type === "warn" ? "warning" : "error" });
        console[type](logMessage);
    }
    _showAddApiKeyNotice() {
        this._closeApiKeyNotice = BdApi.UI.showNotice(`${LOG_PREFIX} ${i18n.API_KEY_NOTICE}`, {
            type: "warning",
            buttons: [
                {
                    label: i18n.ADD,
                    onClick: () => BdApi.UI.showConfirmationModal(`${getConfig().name} Settings`, BdApi.React.createElement("div", {
                        className: "bd-addon-settings-wrap",
                        children: this.getSettingsPanel()
                    }), { className: "bd-addon-modal", size: "bd-modal-medium", cancelText: null, confirmText: i18n.DONE })
                }
            ]
        });
    }
    _subscribeEvents() {
        this._listeningEvents.forEach((event) => this._fluxDispatcher.subscribe(event, this._onEventSubscriptionCb));
    }
    _unsubscribeEvents() {
        this._listeningEvents.forEach((event) => this._fluxDispatcher.unsubscribe(event, this._onEventSubscriptionCb));
    }
    _onEvent(event) {
        const selectedChannelId = this._selectedChannelStore?.getCurrentlySelectedChannelId();
        if (!selectedChannelId)
            return;
        try {
            switch (event.type) {
                case "MESSAGE_CREATE":
                    if (event.channelId === selectedChannelId) {
                        this._enableSummaryButtonIfNeeded(selectedChannelId);
                    }
                    this._checkSensitiveContent(event.message);
                    break;
                case "MESSAGE_UPDATE":
                    this._checkSensitiveContent(event.message);
                    break;
                case "CHANNEL_SELECT":
                case "MESSAGE_DELETE":
                case "LOAD_MESSAGES_SUCCESS":
                case "MESSAGE_ACK":
                    if (event.channelId === selectedChannelId) {
                        this._enableSummaryButtonIfNeeded(selectedChannelId);
                    }
                    break;
                default:
                    console.warn(LOG_PREFIX, "Unknown event", event);
                    break;
            }
        }
        catch (error) {
            this._log(typeof error === "string" ? error : error.message);
        }
    }
    _enableSummaryButtonIfNeeded(channelId) {
        setTimeout(() => {
            if (this._unreadMessages) {
                const enable = this._unreadMessages.hasUnreadMessages(channelId);
                this._summaryButton?.toggle(enable);
            }
        }, 0);
    }
    async _summarize() {
        if (!this._selectedGuildStore || !this._selectedChannelStore || !this._unreadMessages || !this._userStore || !this._messageActions)
            throw "Fail to get stores";
        const guildId = this._selectedGuildStore.getGuildId();
        const channelId = this._selectedChannelStore.getCurrentlySelectedChannelId();
        const { referenceMessage, previousMessages, unreadMessages } = await this._unreadMessages.getUnreadMessages(channelId);
        const user = this._userStore.getCurrentUser();
        if (!channelId)
            throw "Fail to get metadata";
        const failedMediasMetadata = await fetchMediasMetadata(unreadMessages);
        if (failedMediasMetadata.length) {
            this._log("Failed to fetch medias metadata");
            console.error(LOG_PREFIX, failedMediasMetadata);
        }
        const model = new GeminiAi(this._log);
        const summaryStream = await model.summarizeMessages(previousMessages, unreadMessages);
        const previousMessageId = unreadMessages[unreadMessages.length - 1].id;
        let message = undefined;
        for await (const chunk of summaryStream) {
            const chunkText = chunk.text;
            if (!chunkText?.length)
                continue;
            if (message) {
                message.content += chunkText;
                this._messageActions.receiveMessage(channelId, message, true, { messageReference: message.messageReference });
            }
            else {
                const messageId = generateMessageId(previousMessageId);
                message = createMessage({
                    guildId,
                    channelId,
                    id: messageId,
                    author: user,
                    content: chunkText,
                    flags: DiscordMessageFlags.EPHEMERAL,
                    reply: this._messageStore?.getMessage(channelId, referenceMessage)
                });
                this._messageActions.receiveMessage(channelId, message, true, { messageReference: message.messageReference });
                if (getSetting(SETTING_JUMP_TO_MESSAGE)) {
                    this._messageActions.jumpToMessage({ channelId, messageId: message.id, skipLocalFetch: true });
                }
            }
        }
    }
    async _checkSensitiveContent(discordMessage) {
        const panicMode = getSetting(SETTING_SENSITIVE_PANIC_MODE);
        const settingEmetophobia = getSetting(SETTING_EMETOPHOBIA_MODE);
        const settingArachnophobia = getSetting(SETTING_ARACHNOPHOBIA_MODE);
        const settingEpilepsy = getSetting(SETTING_EPILEPSY_MODE);
        const settingSexuality = getSetting(SETTING_SEXUALITY_MODE);
        const backup = { attachments: {}, embeds: [] };
        if (!settingEmetophobia && !settingArachnophobia && !settingEpilepsy && !settingSexuality)
            return;
        if (!this._userStore || !this._selectedGuildStore || !this._guildMemberStore)
            throw "Fail to get stores";
        if (this._userStore.getCurrentUser().id === discordMessage.author.id ||
            ((!discordMessage.attachments?.length || discordMessage.attachments.every((attachment) => attachment.spoiler)) &&
                !discordMessage.embeds?.length) ||
            this._isSensitiveMessageCheck.has(discordMessage.id))
            return;
        const toggleSensitiveContent = (toggle) => {
            const sensitiveMessage = this._messageStore?.getMessage(discordMessage.channel_id, discordMessage.id);
            if (sensitiveMessage) {
                if (toggle) {
                    sensitiveMessage.attachments?.forEach((attachment) => {
                        backup.attachments[attachment.id] = attachment.spoiler;
                        attachment.spoiler = true;
                    });
                    if (sensitiveMessage.embeds?.length) {
                        backup.embeds = [...sensitiveMessage.embeds];
                        sensitiveMessage.embeds = [];
                    }
                }
                else {
                    sensitiveMessage.attachments?.forEach((attachment) => (attachment.spoiler = backup.attachments[attachment.id] ?? false));
                    sensitiveMessage.embeds = backup.embeds;
                }
                if (this._selectedChannelStore?.getCurrentlySelectedChannelId() === sensitiveMessage.channel_id) {
                    forceReloadMessages();
                }
            }
        };
        this._isSensitiveMessageCheck.add(discordMessage.id);
        if (panicMode) {
            toggleSensitiveContent(true);
        }
        const messages = mapMessages({ selectedGuildStore: this._selectedGuildStore, guildMemberStore: this._guildMemberStore }, [discordMessage]);
        await fetchMediasMetadata(messages);
        const isSensitive = await new GeminiAi(this._log).isSensitiveContent(messages);
        if ((settingEmetophobia && isSensitive?.isEmetophobia) ||
            (settingArachnophobia && isSensitive?.isArachnophobia) ||
            (settingEpilepsy && isSensitive?.isEpileptic) ||
            (settingSexuality && isSensitive?.isSexual)) {
            if (!panicMode) {
                toggleSensitiveContent(true);
            }
        }
        else if (panicMode) {
            toggleSensitiveContent(false);
        }
    }
}

module.exports = BDiscordAI;
