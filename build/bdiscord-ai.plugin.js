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
    UPDATE: "Update",
    API_KEY_NOTICE: "No Google API key is configured",
    UPDATE_NOTICE: "New version available",
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
    SETTING_CATEGORY_OTHERS: "Others",
    SETTING_CHECK_UPDATES: "Check for updates",
    SETTING_CHECK_UPDATES_NOTE: "Check for updates on plugin startup",
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
    },
    SUMMARY_IMAGE_REQUEST: "Generate an image to illustrate the summary"
};

const fr = {
    AUTHOR: "Auteur",
    CONTENT: "Contenu",
    DATE: "Date",
    DONE: "Terminé",
    ADD: "Ajouter",
    UPDATE: "Mettre à jour",
    API_KEY_NOTICE: "Aucune clée API Google n'est configurée",
    UPDATE_NOTICE: "Nouvelle version disponible",
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
    SETTING_CATEGORY_OTHERS: "Autres",
    SETTING_CHECK_UPDATES: "Vérifier les mises à jour",
    SETTING_CHECK_UPDATES_NOTE: "Vérifier les mises à jour au démarrage du plugin",
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
    },
    SUMMARY_IMAGE_REQUEST: "Génère une image pour illustrer le résumé"
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
const SETTING_CHECK_UPDATES = "checkUpdates";
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
const PLUGIN_FILE_NAME = "bdiscord-ai.plugin.js";
const GITHUB_BRANCH = "main";
const GITHUB_SOURCE = `https://raw.githubusercontent.com/vincent-andrieu/bdiscord-ai/refs/heads/${GITHUB_BRANCH}/build/${PLUGIN_FILE_NAME}`;
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
 * Original file: /npm/@google/genai@0.12.0/dist/web/index.mjs
 *
 * Do NOT use SRI with dynamically generated files! More information: https://www.jsdelivr.com/using-sri-with-dynamic-files
 */
/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
let t,n;function o(e,o,i){var s,r,l;if(!(null===(s=e.httpOptions)||void 0===s?void 0:s.baseUrl)){const s={geminiUrl:t,vertexUrl:n};return e.vertexai?null!==(r=s.vertexUrl)&&void 0!==r?r:o:null!==(l=s.geminiUrl)&&void 0!==l?l:i}return e.httpOptions.baseUrl}
/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */class i{}function s(t,n){return t.replace(/\{([^}]+)\}/g,((t,e)=>{if(Object.prototype.hasOwnProperty.call(n,e)){const t=n[e];return null!=t?String(t):""}throw new Error(`Key '${e}' not found in valueMap.`)}))}function r(t,n,e){for(let o=0;o<n.length-1;o++){const i=n[o];if(i.endsWith("[]")){const s=i.slice(0,-2);if(!(s in t)){if(!Array.isArray(e))throw new Error(`Value must be a list given an array path ${i}`);t[s]=Array.from({length:e.length},(()=>({})));}if(Array.isArray(t[s])){const i=t[s];if(Array.isArray(e))for(let t=0;t<i.length;t++){r(i[t],n.slice(o+1),e[t]);}else for(const t of i)r(t,n.slice(o+1),e);}return}if(i.endsWith("[0]")){const s=i.slice(0,-3);s in t||(t[s]=[{}]);return void r(t[s][0],n.slice(o+1),e)}t[i]&&"object"==typeof t[i]||(t[i]={}),t=t[i];}const o=n[n.length-1],i=t[o];if(void 0!==i){if(!e||"object"==typeof e&&0===Object.keys(e).length)return;if(e===i)return;if("object"!=typeof i||"object"!=typeof e||null===i||null===e)throw new Error(`Cannot set value for an existing key. Key: ${o}`);Object.assign(i,e);}else t[o]=e;}function l(t,n){try{if(1===n.length&&"_self"===n[0])return t;for(let e=0;e<n.length;e++){if("object"!=typeof t||null===t)return;const o=n[e];if(o.endsWith("[]")){const i=o.slice(0,-2);if(i in t){const o=t[i];if(!Array.isArray(o))return;return o.map((t=>l(t,n.slice(e+1))))}return}t=t[o];}return t}catch(t){if(t instanceof TypeError)return;throw t}}
/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */function a(t,n){if(!n||"string"!=typeof n)throw new Error("model is required and must be a string");if(t.isVertexAI()){if(n.startsWith("publishers/")||n.startsWith("projects/")||n.startsWith("models/"))return n;if(n.indexOf("/")>=0){const t=n.split("/",2);return `publishers/${t[0]}/models/${t[1]}`}return `publishers/google/models/${n}`}return n.startsWith("models/")||n.startsWith("tunedModels/")?n:`models/${n}`}function u(t,n){const e=a(t,n);return e?e.startsWith("publishers/")&&t.isVertexAI()?`projects/${t.getProject()}/locations/${t.getLocation()}/${e}`:e.startsWith("models/")&&t.isVertexAI()?`projects/${t.getProject()}/locations/${t.getLocation()}/publishers/google/${e}`:e:""}function c(t,n){return Array.isArray(n)?n.map((n=>d(t,n))):[d(t,n)]}function d(t,n){if("object"==typeof n&&null!==n)return n;throw new Error("Could not parse input as Blob. Unsupported blob type: "+typeof n)}function p(t,n){if(null==n)throw new Error("PartUnion is required");if("object"==typeof n)return n;if("string"==typeof n)return {text:n};throw new Error("Unsupported part type: "+typeof n)}function h(t,n){if(null==n||Array.isArray(n)&&0===n.length)throw new Error("PartListUnion is required");return Array.isArray(n)?n.map((t=>p(0,t))):[p(0,n)]}function f(t){return null!=t&&"object"==typeof t&&"parts"in t&&Array.isArray(t.parts)}function g(t){return null!=t&&"object"==typeof t&&"functionCall"in t}function m(t){return null!=t&&"object"==typeof t&&"functionResponse"in t}function y(t,n){if(null==n)throw new Error("ContentUnion is required");return f(n)?n:{role:"user",parts:h(0,n)}}function v(t,n){if(!n)return [];if(t.isVertexAI()&&Array.isArray(n))return n.flatMap((t=>{const n=y(0,t);return n.parts&&n.parts.length>0&&void 0!==n.parts[0].text?[n.parts[0].text]:[]}));if(t.isVertexAI()){const t=y(0,n);return t.parts&&t.parts.length>0&&void 0!==t.parts[0].text?[t.parts[0].text]:[]}return Array.isArray(n)?n.map((t=>y(0,t))):[y(0,n)]}function E(t,n){if(null==n||Array.isArray(n)&&0===n.length)throw new Error("contents are required");if(!Array.isArray(n)){if(g(n)||m(n))throw new Error("To specify functionCall or functionResponse parts, please wrap them in a Content object, specifying the role for them");return [y(0,n)]}const e=[],o=[],i=f(n[0]);for(const t of n){const n=f(t);if(n!=i)throw new Error("Mixing Content and Parts is not supported, please group the parts into a the appropriate Content objects and specify the roles for them");if(n)e.push(t);else {if(g(t)||m(t))throw new Error("To specify functionCall or functionResponse parts, please wrap them, and any other parts, in Content objects as appropriate, specifying the role for them");o.push(t);}}return i||e.push({role:"user",parts:h(0,o)}),e}function C(t,n){return n}function T(t,n){if("object"==typeof n)return n;if("string"==typeof n)return {voiceConfig:{prebuiltVoiceConfig:{voiceName:n}}};throw new Error("Unsupported speechConfig type: "+typeof n)}function _(t,n){return n}function O(t,n){if(!Array.isArray(n))throw new Error("tool is required and must be an array of Tools");return n}function I(t,n){if("string"!=typeof n)throw new Error("name must be a string");return function(t,n,e,o=1){const i=!n.startsWith(`${e}/`)&&n.split("/").length===o;return t.isVertexAI()?n.startsWith("projects/")?n:n.startsWith("locations/")?`projects/${t.getProject()}/${n}`:n.startsWith(`${e}/`)?`projects/${t.getProject()}/locations/${t.getLocation()}/${n}`:i?`projects/${t.getProject()}/locations/${t.getLocation()}/${e}/${n}`:n:i?`${e}/${n}`:n}(t,n,"cachedContents")}function A(t,n){switch(n){case "STATE_UNSPECIFIED":return "JOB_STATE_UNSPECIFIED";case "CREATING":return "JOB_STATE_RUNNING";case "ACTIVE":return "JOB_STATE_SUCCEEDED";case "FAILED":return "JOB_STATE_FAILED";default:return n}}function S(t,n){if("string"!=typeof n)throw new Error("fromImageBytes must be a string");return n}function b(t,n){if("string"!=typeof n)throw new Error("fromName must be a string");return n.startsWith("files/")?n.split("files/")[1]:n}
/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */function w(t,n){const e={},o=l(n,["parts"]);if(null!=o){let t=o;Array.isArray(t)&&(t=t.map((t=>function(t,n){const e={};if(void 0!==l(n,["videoMetadata"]))throw new Error("videoMetadata parameter is not supported in Gemini API.");const o=l(n,["thought"]);null!=o&&r(e,["thought"],o);const i=l(n,["codeExecutionResult"]);null!=i&&r(e,["codeExecutionResult"],i);const s=l(n,["executableCode"]);null!=s&&r(e,["executableCode"],s);const a=l(n,["fileData"]);null!=a&&r(e,["fileData"],a);const u=l(n,["functionCall"]);null!=u&&r(e,["functionCall"],u);const c=l(n,["functionResponse"]);null!=c&&r(e,["functionResponse"],c);const d=l(n,["inlineData"]);null!=d&&r(e,["inlineData"],d);const p=l(n,["text"]);return null!=p&&r(e,["text"],p),e}(0,t)))),r(e,["parts"],t);}const i=l(n,["role"]);return null!=i&&r(e,["role"],i),e}function P(t,n){const e={},o=l(n,["dynamicRetrievalConfig"]);return null!=o&&r(e,["dynamicRetrievalConfig"],function(t,n){const e={},o=l(n,["mode"]);null!=o&&r(e,["mode"],o);const i=l(n,["dynamicThreshold"]);return null!=i&&r(e,["dynamicThreshold"],i),e}(0,o)),e}function N(t,n){const e={},o=l(n,["functionCallingConfig"]);return null!=o&&r(e,["functionCallingConfig"],function(t,n){const e={},o=l(n,["mode"]);null!=o&&r(e,["mode"],o);const i=l(n,["allowedFunctionNames"]);return null!=i&&r(e,["allowedFunctionNames"],i),e}(0,o)),e}function R(t,n,e){const o=l(n,["ttl"]);void 0!==e&&null!=o&&r(e,["ttl"],o);const i=l(n,["expireTime"]);void 0!==e&&null!=i&&r(e,["expireTime"],i);const s=l(n,["displayName"]);void 0!==e&&null!=s&&r(e,["displayName"],s);const a=l(n,["contents"]);if(void 0!==e&&null!=a){let t=E(0,a);Array.isArray(t)&&(t=t.map((t=>w(0,t)))),r(e,["contents"],t);}const u=l(n,["systemInstruction"]);void 0!==e&&null!=u&&r(e,["systemInstruction"],w(0,y(0,u)));const c=l(n,["tools"]);if(void 0!==e&&null!=c){let t=c;Array.isArray(t)&&(t=t.map((t=>function(t,n){const e={};if(void 0!==l(n,["retrieval"]))throw new Error("retrieval parameter is not supported in Gemini API.");null!=l(n,["googleSearch"])&&r(e,["googleSearch"],{});const o=l(n,["googleSearchRetrieval"]);null!=o&&r(e,["googleSearchRetrieval"],P(0,o));const i=l(n,["codeExecution"]);null!=i&&r(e,["codeExecution"],i);const s=l(n,["functionDeclarations"]);return null!=s&&r(e,["functionDeclarations"],s),e}(0,t)))),r(e,["tools"],t);}const d=l(n,["toolConfig"]);return void 0!==e&&null!=d&&r(e,["toolConfig"],N(0,d)),{}}function D(t,n){const e={},o=l(n,["name"]);null!=o&&r(e,["_url","name"],I(t,o));const i=l(n,["config"]);return null!=i&&r(e,["config"],function(t,n,e){const o=l(n,["ttl"]);void 0!==e&&null!=o&&r(e,["ttl"],o);const i=l(n,["expireTime"]);return void 0!==e&&null!=i&&r(e,["expireTime"],i),{}}(0,i,e)),e}function M(t,n){const e={},o=l(n,["config"]);return null!=o&&r(e,["config"],function(t,n,e){const o=l(n,["pageSize"]);void 0!==e&&null!=o&&r(e,["_query","pageSize"],o);const i=l(n,["pageToken"]);return void 0!==e&&null!=i&&r(e,["_query","pageToken"],i),{}}(0,o,e)),e}function x(t,n){const e={},o=l(n,["parts"]);if(null!=o){let t=o;Array.isArray(t)&&(t=t.map((t=>function(t,n){const e={},o=l(n,["videoMetadata"]);null!=o&&r(e,["videoMetadata"],o);const i=l(n,["thought"]);null!=i&&r(e,["thought"],i);const s=l(n,["codeExecutionResult"]);null!=s&&r(e,["codeExecutionResult"],s);const a=l(n,["executableCode"]);null!=a&&r(e,["executableCode"],a);const u=l(n,["fileData"]);null!=u&&r(e,["fileData"],u);const c=l(n,["functionCall"]);null!=c&&r(e,["functionCall"],c);const d=l(n,["functionResponse"]);null!=d&&r(e,["functionResponse"],d);const p=l(n,["inlineData"]);null!=p&&r(e,["inlineData"],p);const h=l(n,["text"]);return null!=h&&r(e,["text"],h),e}(0,t)))),r(e,["parts"],t);}const i=l(n,["role"]);return null!=i&&r(e,["role"],i),e}function U(t,n){const e={},o=l(n,["dynamicRetrievalConfig"]);return null!=o&&r(e,["dynamicRetrievalConfig"],function(t,n){const e={},o=l(n,["mode"]);null!=o&&r(e,["mode"],o);const i=l(n,["dynamicThreshold"]);return null!=i&&r(e,["dynamicThreshold"],i),e}(0,o)),e}function q(t,n){const e={},o=l(n,["functionCallingConfig"]);return null!=o&&r(e,["functionCallingConfig"],function(t,n){const e={},o=l(n,["mode"]);null!=o&&r(e,["mode"],o);const i=l(n,["allowedFunctionNames"]);return null!=i&&r(e,["allowedFunctionNames"],i),e}(0,o)),e}function L(t,n,e){const o=l(n,["ttl"]);void 0!==e&&null!=o&&r(e,["ttl"],o);const i=l(n,["expireTime"]);void 0!==e&&null!=i&&r(e,["expireTime"],i);const s=l(n,["displayName"]);void 0!==e&&null!=s&&r(e,["displayName"],s);const a=l(n,["contents"]);if(void 0!==e&&null!=a){let t=E(0,a);Array.isArray(t)&&(t=t.map((t=>x(0,t)))),r(e,["contents"],t);}const u=l(n,["systemInstruction"]);void 0!==e&&null!=u&&r(e,["systemInstruction"],x(0,y(0,u)));const c=l(n,["tools"]);if(void 0!==e&&null!=c){let t=c;Array.isArray(t)&&(t=t.map((t=>function(t,n){const e={},o=l(n,["retrieval"]);null!=o&&r(e,["retrieval"],o),null!=l(n,["googleSearch"])&&r(e,["googleSearch"],{});const i=l(n,["googleSearchRetrieval"]);null!=i&&r(e,["googleSearchRetrieval"],U(0,i));const s=l(n,["codeExecution"]);null!=s&&r(e,["codeExecution"],s);const a=l(n,["functionDeclarations"]);return null!=a&&r(e,["functionDeclarations"],a),e}(0,t)))),r(e,["tools"],t);}const d=l(n,["toolConfig"]);return void 0!==e&&null!=d&&r(e,["toolConfig"],q(0,d)),{}}function G(t,n){const e={},o=l(n,["name"]);null!=o&&r(e,["_url","name"],I(t,o));const i=l(n,["config"]);return null!=i&&r(e,["config"],function(t,n,e){const o=l(n,["ttl"]);void 0!==e&&null!=o&&r(e,["ttl"],o);const i=l(n,["expireTime"]);return void 0!==e&&null!=i&&r(e,["expireTime"],i),{}}(0,i,e)),e}function k(t,n){const e={},o=l(n,["config"]);return null!=o&&r(e,["config"],function(t,n,e){const o=l(n,["pageSize"]);void 0!==e&&null!=o&&r(e,["_query","pageSize"],o);const i=l(n,["pageToken"]);return void 0!==e&&null!=i&&r(e,["_query","pageToken"],i),{}}(0,o,e)),e}function V(t,n){const e={},o=l(n,["name"]);null!=o&&r(e,["name"],o);const i=l(n,["displayName"]);null!=i&&r(e,["displayName"],i);const s=l(n,["model"]);null!=s&&r(e,["model"],s);const a=l(n,["createTime"]);null!=a&&r(e,["createTime"],a);const u=l(n,["updateTime"]);null!=u&&r(e,["updateTime"],u);const c=l(n,["expireTime"]);null!=c&&r(e,["expireTime"],c);const d=l(n,["usageMetadata"]);return null!=d&&r(e,["usageMetadata"],d),e}function j(t,n){const e={},o=l(n,["name"]);null!=o&&r(e,["name"],o);const i=l(n,["displayName"]);null!=i&&r(e,["displayName"],i);const s=l(n,["model"]);null!=s&&r(e,["model"],s);const a=l(n,["createTime"]);null!=a&&r(e,["createTime"],a);const u=l(n,["updateTime"]);null!=u&&r(e,["updateTime"],u);const c=l(n,["expireTime"]);null!=c&&r(e,["expireTime"],c);const d=l(n,["usageMetadata"]);return null!=d&&r(e,["usageMetadata"],d),e}
/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
var F,B,H,J,Y,K,W,$,z,X,Z,Q,tt,nt,et,ot,it,st,rt,lt,at,ut,ct,dt,pt,ht,ft,gt,mt,yt,vt,Et,Ct;!function(t){t.PAGED_ITEM_BATCH_JOBS="batchJobs",t.PAGED_ITEM_MODELS="models",t.PAGED_ITEM_TUNING_JOBS="tuningJobs",t.PAGED_ITEM_FILES="files",t.PAGED_ITEM_CACHED_CONTENTS="cachedContents";}(F||(F={}));class Tt{constructor(t,n,e,o){this.pageInternal=[],this.paramsInternal={},this.requestInternal=n,this.init(t,e,o);}init(t,n,e){var o,i;this.nameInternal=t,this.pageInternal=n[this.nameInternal]||[],this.idxInternal=0;let s={config:{}};s=e?"object"==typeof e?Object.assign({},e):e:{config:{}},s.config&&(s.config.pageToken=n.nextPageToken),this.paramsInternal=s,this.pageInternalSize=null!==(i=null===(o=s.config)||void 0===o?void 0:o.pageSize)&&void 0!==i?i:this.pageInternal.length;}initNextPage(t){this.init(this.nameInternal,t,this.paramsInternal);}get page(){return this.pageInternal}get name(){return this.nameInternal}get pageSize(){return this.pageInternalSize}get params(){return this.paramsInternal}get pageLength(){return this.pageInternal.length}getItem(t){return this.pageInternal[t]}[Symbol.asyncIterator](){return {next:async()=>{if(this.idxInternal>=this.pageLength){if(!this.hasNextPage())return {value:void 0,done:true};await this.nextPage();}const t=this.getItem(this.idxInternal);return this.idxInternal+=1,{value:t,done:false}},return:async()=>({value:void 0,done:true})}}async nextPage(){if(!this.hasNextPage())throw new Error("No more pages to fetch.");const t=await this.requestInternal(this.params);return this.initNextPage(t),this.page}hasNextPage(){var t;return void 0!==(null===(t=this.params.config)||void 0===t?void 0:t.pageToken)}}
/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */!function(t){t.OUTCOME_UNSPECIFIED="OUTCOME_UNSPECIFIED",t.OUTCOME_OK="OUTCOME_OK",t.OUTCOME_FAILED="OUTCOME_FAILED",t.OUTCOME_DEADLINE_EXCEEDED="OUTCOME_DEADLINE_EXCEEDED";}(B||(B={})),function(t){t.LANGUAGE_UNSPECIFIED="LANGUAGE_UNSPECIFIED",t.PYTHON="PYTHON";}(H||(H={})),function(t){t.HARM_CATEGORY_UNSPECIFIED="HARM_CATEGORY_UNSPECIFIED",t.HARM_CATEGORY_HATE_SPEECH="HARM_CATEGORY_HATE_SPEECH",t.HARM_CATEGORY_DANGEROUS_CONTENT="HARM_CATEGORY_DANGEROUS_CONTENT",t.HARM_CATEGORY_HARASSMENT="HARM_CATEGORY_HARASSMENT",t.HARM_CATEGORY_SEXUALLY_EXPLICIT="HARM_CATEGORY_SEXUALLY_EXPLICIT",t.HARM_CATEGORY_CIVIC_INTEGRITY="HARM_CATEGORY_CIVIC_INTEGRITY";}(J||(J={})),function(t){t.HARM_BLOCK_METHOD_UNSPECIFIED="HARM_BLOCK_METHOD_UNSPECIFIED",t.SEVERITY="SEVERITY",t.PROBABILITY="PROBABILITY";}(Y||(Y={})),function(t){t.HARM_BLOCK_THRESHOLD_UNSPECIFIED="HARM_BLOCK_THRESHOLD_UNSPECIFIED",t.BLOCK_LOW_AND_ABOVE="BLOCK_LOW_AND_ABOVE",t.BLOCK_MEDIUM_AND_ABOVE="BLOCK_MEDIUM_AND_ABOVE",t.BLOCK_ONLY_HIGH="BLOCK_ONLY_HIGH",t.BLOCK_NONE="BLOCK_NONE",t.OFF="OFF";}(K||(K={})),function(t){t.MODE_UNSPECIFIED="MODE_UNSPECIFIED",t.MODE_DYNAMIC="MODE_DYNAMIC";}(W||(W={})),function(t){t.TYPE_UNSPECIFIED="TYPE_UNSPECIFIED",t.STRING="STRING",t.NUMBER="NUMBER",t.INTEGER="INTEGER",t.BOOLEAN="BOOLEAN",t.ARRAY="ARRAY",t.OBJECT="OBJECT";}($||($={})),function(t){t.FINISH_REASON_UNSPECIFIED="FINISH_REASON_UNSPECIFIED",t.STOP="STOP",t.MAX_TOKENS="MAX_TOKENS",t.SAFETY="SAFETY",t.RECITATION="RECITATION",t.LANGUAGE="LANGUAGE",t.OTHER="OTHER",t.BLOCKLIST="BLOCKLIST",t.PROHIBITED_CONTENT="PROHIBITED_CONTENT",t.SPII="SPII",t.MALFORMED_FUNCTION_CALL="MALFORMED_FUNCTION_CALL",t.IMAGE_SAFETY="IMAGE_SAFETY";}(z||(z={})),function(t){t.HARM_PROBABILITY_UNSPECIFIED="HARM_PROBABILITY_UNSPECIFIED",t.NEGLIGIBLE="NEGLIGIBLE",t.LOW="LOW",t.MEDIUM="MEDIUM",t.HIGH="HIGH";}(X||(X={})),function(t){t.HARM_SEVERITY_UNSPECIFIED="HARM_SEVERITY_UNSPECIFIED",t.HARM_SEVERITY_NEGLIGIBLE="HARM_SEVERITY_NEGLIGIBLE",t.HARM_SEVERITY_LOW="HARM_SEVERITY_LOW",t.HARM_SEVERITY_MEDIUM="HARM_SEVERITY_MEDIUM",t.HARM_SEVERITY_HIGH="HARM_SEVERITY_HIGH";}(Z||(Z={})),function(t){t.BLOCKED_REASON_UNSPECIFIED="BLOCKED_REASON_UNSPECIFIED",t.SAFETY="SAFETY",t.OTHER="OTHER",t.BLOCKLIST="BLOCKLIST",t.PROHIBITED_CONTENT="PROHIBITED_CONTENT";}(Q||(Q={})),function(t){t.TRAFFIC_TYPE_UNSPECIFIED="TRAFFIC_TYPE_UNSPECIFIED",t.ON_DEMAND="ON_DEMAND",t.PROVISIONED_THROUGHPUT="PROVISIONED_THROUGHPUT";}(tt||(tt={})),function(t){t.MODALITY_UNSPECIFIED="MODALITY_UNSPECIFIED",t.TEXT="TEXT",t.IMAGE="IMAGE",t.AUDIO="AUDIO";}(nt||(nt={})),function(t){t.MEDIA_RESOLUTION_UNSPECIFIED="MEDIA_RESOLUTION_UNSPECIFIED",t.MEDIA_RESOLUTION_LOW="MEDIA_RESOLUTION_LOW",t.MEDIA_RESOLUTION_MEDIUM="MEDIA_RESOLUTION_MEDIUM",t.MEDIA_RESOLUTION_HIGH="MEDIA_RESOLUTION_HIGH";}(et||(et={})),function(t){t.JOB_STATE_UNSPECIFIED="JOB_STATE_UNSPECIFIED",t.JOB_STATE_QUEUED="JOB_STATE_QUEUED",t.JOB_STATE_PENDING="JOB_STATE_PENDING",t.JOB_STATE_RUNNING="JOB_STATE_RUNNING",t.JOB_STATE_SUCCEEDED="JOB_STATE_SUCCEEDED",t.JOB_STATE_FAILED="JOB_STATE_FAILED",t.JOB_STATE_CANCELLING="JOB_STATE_CANCELLING",t.JOB_STATE_CANCELLED="JOB_STATE_CANCELLED",t.JOB_STATE_PAUSED="JOB_STATE_PAUSED",t.JOB_STATE_EXPIRED="JOB_STATE_EXPIRED",t.JOB_STATE_UPDATING="JOB_STATE_UPDATING",t.JOB_STATE_PARTIALLY_SUCCEEDED="JOB_STATE_PARTIALLY_SUCCEEDED";}(ot||(ot={})),function(t){t.ADAPTER_SIZE_UNSPECIFIED="ADAPTER_SIZE_UNSPECIFIED",t.ADAPTER_SIZE_ONE="ADAPTER_SIZE_ONE",t.ADAPTER_SIZE_TWO="ADAPTER_SIZE_TWO",t.ADAPTER_SIZE_FOUR="ADAPTER_SIZE_FOUR",t.ADAPTER_SIZE_EIGHT="ADAPTER_SIZE_EIGHT",t.ADAPTER_SIZE_SIXTEEN="ADAPTER_SIZE_SIXTEEN",t.ADAPTER_SIZE_THIRTY_TWO="ADAPTER_SIZE_THIRTY_TWO";}(it||(it={})),function(t){t.FEATURE_SELECTION_PREFERENCE_UNSPECIFIED="FEATURE_SELECTION_PREFERENCE_UNSPECIFIED",t.PRIORITIZE_QUALITY="PRIORITIZE_QUALITY",t.BALANCED="BALANCED",t.PRIORITIZE_COST="PRIORITIZE_COST";}(st||(st={})),function(t){t.MODE_UNSPECIFIED="MODE_UNSPECIFIED",t.MODE_DYNAMIC="MODE_DYNAMIC";}(rt||(rt={})),function(t){t.MODE_UNSPECIFIED="MODE_UNSPECIFIED",t.AUTO="AUTO",t.ANY="ANY",t.NONE="NONE";}(lt||(lt={})),function(t){t.BLOCK_LOW_AND_ABOVE="BLOCK_LOW_AND_ABOVE",t.BLOCK_MEDIUM_AND_ABOVE="BLOCK_MEDIUM_AND_ABOVE",t.BLOCK_ONLY_HIGH="BLOCK_ONLY_HIGH",t.BLOCK_NONE="BLOCK_NONE";}(at||(at={})),function(t){t.DONT_ALLOW="DONT_ALLOW",t.ALLOW_ADULT="ALLOW_ADULT",t.ALLOW_ALL="ALLOW_ALL";}(ut||(ut={})),function(t){t.auto="auto",t.en="en",t.ja="ja",t.ko="ko",t.hi="hi";}(ct||(ct={})),function(t){t.STATE_UNSPECIFIED="STATE_UNSPECIFIED",t.PROCESSING="PROCESSING",t.ACTIVE="ACTIVE",t.FAILED="FAILED";}(dt||(dt={})),function(t){t.SOURCE_UNSPECIFIED="SOURCE_UNSPECIFIED",t.UPLOADED="UPLOADED",t.GENERATED="GENERATED";}(pt||(pt={})),function(t){t.MASK_MODE_DEFAULT="MASK_MODE_DEFAULT",t.MASK_MODE_USER_PROVIDED="MASK_MODE_USER_PROVIDED",t.MASK_MODE_BACKGROUND="MASK_MODE_BACKGROUND",t.MASK_MODE_FOREGROUND="MASK_MODE_FOREGROUND",t.MASK_MODE_SEMANTIC="MASK_MODE_SEMANTIC";}(ht||(ht={})),function(t){t.CONTROL_TYPE_DEFAULT="CONTROL_TYPE_DEFAULT",t.CONTROL_TYPE_CANNY="CONTROL_TYPE_CANNY",t.CONTROL_TYPE_SCRIBBLE="CONTROL_TYPE_SCRIBBLE",t.CONTROL_TYPE_FACE_MESH="CONTROL_TYPE_FACE_MESH";}(ft||(ft={})),function(t){t.SUBJECT_TYPE_DEFAULT="SUBJECT_TYPE_DEFAULT",t.SUBJECT_TYPE_PERSON="SUBJECT_TYPE_PERSON",t.SUBJECT_TYPE_ANIMAL="SUBJECT_TYPE_ANIMAL",t.SUBJECT_TYPE_PRODUCT="SUBJECT_TYPE_PRODUCT";}(gt||(gt={})),function(t){t.MODALITY_UNSPECIFIED="MODALITY_UNSPECIFIED",t.TEXT="TEXT",t.IMAGE="IMAGE",t.VIDEO="VIDEO",t.AUDIO="AUDIO",t.DOCUMENT="DOCUMENT";}(mt||(mt={})),function(t){t.START_SENSITIVITY_UNSPECIFIED="START_SENSITIVITY_UNSPECIFIED",t.START_SENSITIVITY_HIGH="START_SENSITIVITY_HIGH",t.START_SENSITIVITY_LOW="START_SENSITIVITY_LOW";}(yt||(yt={})),function(t){t.END_SENSITIVITY_UNSPECIFIED="END_SENSITIVITY_UNSPECIFIED",t.END_SENSITIVITY_HIGH="END_SENSITIVITY_HIGH",t.END_SENSITIVITY_LOW="END_SENSITIVITY_LOW";}(vt||(vt={})),function(t){t.ACTIVITY_HANDLING_UNSPECIFIED="ACTIVITY_HANDLING_UNSPECIFIED",t.START_OF_ACTIVITY_INTERRUPTS="START_OF_ACTIVITY_INTERRUPTS",t.NO_INTERRUPTION="NO_INTERRUPTION";}(Et||(Et={})),function(t){t.TURN_COVERAGE_UNSPECIFIED="TURN_COVERAGE_UNSPECIFIED",t.TURN_INCLUDES_ONLY_ACTIVITY="TURN_INCLUDES_ONLY_ACTIVITY",t.TURN_INCLUDES_ALL_INPUT="TURN_INCLUDES_ALL_INPUT";}(Ct||(Ct={}));function Ot(t,n){return {fileData:{fileUri:t,mimeType:n}}}function bt(t,n){return {inlineData:{data:t,mimeType:n}}}class qt{get text(){var t,n,e,o,i,s,r,l;if(0===(null===(o=null===(e=null===(n=null===(t=this.candidates)||void 0===t?void 0:t[0])||void 0===n?void 0:n.content)||void 0===e?void 0:e.parts)||void 0===o?void 0:o.length))return;this.candidates&&this.candidates.length>1&&console.warn("there are multiple candidates in the response, returning text from the first one.");let a="",u=false;const c=[];for(const t of null!==(l=null===(r=null===(s=null===(i=this.candidates)||void 0===i?void 0:i[0])||void 0===s?void 0:s.content)||void 0===r?void 0:r.parts)&&void 0!==l?l:[]){for(const[n,e]of Object.entries(t))"text"===n||"thought"===n||null===e&&void 0===e||c.push(n);if("string"==typeof t.text){if("boolean"==typeof t.thought&&t.thought)continue;u=true,a+=t.text;}}return c.length>0&&console.warn(`there are non-text parts ${c} in the response, returning concatenation of all text parts. Please refer to the non text parts for a full response from model.`),u?a:void 0}get data(){var t,n,e,o,i,s,r,l;if(0===(null===(o=null===(e=null===(n=null===(t=this.candidates)||void 0===t?void 0:t[0])||void 0===n?void 0:n.content)||void 0===e?void 0:e.parts)||void 0===o?void 0:o.length))return;this.candidates&&this.candidates.length>1&&console.warn("there are multiple candidates in the response, returning data from the first one.");let a="";const u=[];for(const t of null!==(l=null===(r=null===(s=null===(i=this.candidates)||void 0===i?void 0:i[0])||void 0===s?void 0:s.content)||void 0===r?void 0:r.parts)&&void 0!==l?l:[]){for(const[n,e]of Object.entries(t))"inlineData"===n||null===e&&void 0===e||u.push(n);t.inlineData&&"string"==typeof t.inlineData.data&&(a+=atob(t.inlineData.data));}return u.length>0&&console.warn(`there are non-data parts ${u} in the response, returning concatenation of all data parts. Please refer to the non data parts for a full response from model.`),a.length>0?btoa(a):void 0}get functionCalls(){var t,n,e,o,i,s,r,l;if(0===(null===(o=null===(e=null===(n=null===(t=this.candidates)||void 0===t?void 0:t[0])||void 0===n?void 0:n.content)||void 0===e?void 0:e.parts)||void 0===o?void 0:o.length))return;this.candidates&&this.candidates.length>1&&console.warn("there are multiple candidates in the response, returning function calls from the first one.");const a=null===(l=null===(r=null===(s=null===(i=this.candidates)||void 0===i?void 0:i[0])||void 0===s?void 0:s.content)||void 0===r?void 0:r.parts)||void 0===l?void 0:l.filter((t=>t.functionCall)).map((t=>t.functionCall)).filter((t=>void 0!==t));return 0!==(null==a?void 0:a.length)?a:void 0}get executableCode(){var t,n,e,o,i,s,r,l,a;if(0===(null===(o=null===(e=null===(n=null===(t=this.candidates)||void 0===t?void 0:t[0])||void 0===n?void 0:n.content)||void 0===e?void 0:e.parts)||void 0===o?void 0:o.length))return;this.candidates&&this.candidates.length>1&&console.warn("there are multiple candidates in the response, returning executable code from the first one.");const u=null===(l=null===(r=null===(s=null===(i=this.candidates)||void 0===i?void 0:i[0])||void 0===s?void 0:s.content)||void 0===r?void 0:r.parts)||void 0===l?void 0:l.filter((t=>t.executableCode)).map((t=>t.executableCode)).filter((t=>void 0!==t));return 0!==(null==u?void 0:u.length)?null===(a=null==u?void 0:u[0])||void 0===a?void 0:a.code:void 0}get codeExecutionResult(){var t,n,e,o,i,s,r,l,a;if(0===(null===(o=null===(e=null===(n=null===(t=this.candidates)||void 0===t?void 0:t[0])||void 0===n?void 0:n.content)||void 0===e?void 0:e.parts)||void 0===o?void 0:o.length))return;this.candidates&&this.candidates.length>1&&console.warn("there are multiple candidates in the response, returning code execution result from the first one.");const u=null===(l=null===(r=null===(s=null===(i=this.candidates)||void 0===i?void 0:i[0])||void 0===s?void 0:s.content)||void 0===r?void 0:r.parts)||void 0===l?void 0:l.filter((t=>t.codeExecutionResult)).map((t=>t.codeExecutionResult)).filter((t=>void 0!==t));return 0!==(null==u?void 0:u.length)?null===(a=null==u?void 0:u[0])||void 0===a?void 0:a.output:void 0}}class Lt{}class Gt{}class kt{}class Vt{}class jt{}class Bt{}class Ht{}class Jt{}class Yt{}class Kt{constructor(t){const n={};for(const e of t.headers.entries())n[e[0]]=e[1];this.headers=n,this.responseInternal=t;}json(){return this.responseInternal.json()}}class Wt{}class $t{}/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */class Qt extends i{constructor(t){super(),this.apiClient=t,this.list=async(t={})=>new Tt(F.PAGED_ITEM_CACHED_CONTENTS,(t=>this.listInternal(t)),await this.listInternal(t),t);}async create(t){var n,e,o,i;let a,c="",d={};if(this.apiClient.isVertexAI()){const o=function(t,n){const e={},o=l(n,["model"]);null!=o&&r(e,["model"],u(t,o));const i=l(n,["config"]);return null!=i&&r(e,["config"],L(0,i,e)),e}(this.apiClient,t);return c=s("cachedContents",o._url),d=o._query,delete o.config,delete o._url,delete o._query,a=this.apiClient.request({path:c,queryParams:d,body:JSON.stringify(o),httpMethod:"POST",httpOptions:null===(n=t.config)||void 0===n?void 0:n.httpOptions,abortSignal:null===(e=t.config)||void 0===e?void 0:e.abortSignal}).then((t=>t.json())),a.then((t=>j(this.apiClient,t)))}{const n=function(t,n){const e={},o=l(n,["model"]);null!=o&&r(e,["model"],u(t,o));const i=l(n,["config"]);return null!=i&&r(e,["config"],R(0,i,e)),e}(this.apiClient,t);return c=s("cachedContents",n._url),d=n._query,delete n.config,delete n._url,delete n._query,a=this.apiClient.request({path:c,queryParams:d,body:JSON.stringify(n),httpMethod:"POST",httpOptions:null===(o=t.config)||void 0===o?void 0:o.httpOptions,abortSignal:null===(i=t.config)||void 0===i?void 0:i.abortSignal}).then((t=>t.json())),a.then((t=>V(this.apiClient,t)))}}async get(t){var n,e,o,i;let a,u="",c={};if(this.apiClient.isVertexAI()){const o=function(t,n){const e={},o=l(n,["name"]);null!=o&&r(e,["_url","name"],I(t,o));const i=l(n,["config"]);return null!=i&&r(e,["config"],i),e}(this.apiClient,t);return u=s("{name}",o._url),c=o._query,delete o.config,delete o._url,delete o._query,a=this.apiClient.request({path:u,queryParams:c,body:JSON.stringify(o),httpMethod:"GET",httpOptions:null===(n=t.config)||void 0===n?void 0:n.httpOptions,abortSignal:null===(e=t.config)||void 0===e?void 0:e.abortSignal}).then((t=>t.json())),a.then((t=>j(this.apiClient,t)))}{const n=function(t,n){const e={},o=l(n,["name"]);null!=o&&r(e,["_url","name"],I(t,o));const i=l(n,["config"]);return null!=i&&r(e,["config"],i),e}(this.apiClient,t);return u=s("{name}",n._url),c=n._query,delete n.config,delete n._url,delete n._query,a=this.apiClient.request({path:u,queryParams:c,body:JSON.stringify(n),httpMethod:"GET",httpOptions:null===(o=t.config)||void 0===o?void 0:o.httpOptions,abortSignal:null===(i=t.config)||void 0===i?void 0:i.abortSignal}).then((t=>t.json())),a.then((t=>V(this.apiClient,t)))}}async delete(t){var n,e,o,i;let a,u="",c={};if(this.apiClient.isVertexAI()){const o=function(t,n){const e={},o=l(n,["name"]);null!=o&&r(e,["_url","name"],I(t,o));const i=l(n,["config"]);return null!=i&&r(e,["config"],i),e}(this.apiClient,t);return u=s("{name}",o._url),c=o._query,delete o.config,delete o._url,delete o._query,a=this.apiClient.request({path:u,queryParams:c,body:JSON.stringify(o),httpMethod:"DELETE",httpOptions:null===(n=t.config)||void 0===n?void 0:n.httpOptions,abortSignal:null===(e=t.config)||void 0===e?void 0:e.abortSignal}).then((t=>t.json())),a.then((()=>{const t={},n=new Ht;return Object.assign(n,t),n}))}{const n=function(t,n){const e={},o=l(n,["name"]);null!=o&&r(e,["_url","name"],I(t,o));const i=l(n,["config"]);return null!=i&&r(e,["config"],i),e}(this.apiClient,t);return u=s("{name}",n._url),c=n._query,delete n.config,delete n._url,delete n._query,a=this.apiClient.request({path:u,queryParams:c,body:JSON.stringify(n),httpMethod:"DELETE",httpOptions:null===(o=t.config)||void 0===o?void 0:o.httpOptions,abortSignal:null===(i=t.config)||void 0===i?void 0:i.abortSignal}).then((t=>t.json())),a.then((()=>{const t={},n=new Ht;return Object.assign(n,t),n}))}}async update(t){var n,e,o,i;let r,l="",a={};if(this.apiClient.isVertexAI()){const o=G(this.apiClient,t);return l=s("{name}",o._url),a=o._query,delete o.config,delete o._url,delete o._query,r=this.apiClient.request({path:l,queryParams:a,body:JSON.stringify(o),httpMethod:"PATCH",httpOptions:null===(n=t.config)||void 0===n?void 0:n.httpOptions,abortSignal:null===(e=t.config)||void 0===e?void 0:e.abortSignal}).then((t=>t.json())),r.then((t=>j(this.apiClient,t)))}{const n=D(this.apiClient,t);return l=s("{name}",n._url),a=n._query,delete n.config,delete n._url,delete n._query,r=this.apiClient.request({path:l,queryParams:a,body:JSON.stringify(n),httpMethod:"PATCH",httpOptions:null===(o=t.config)||void 0===o?void 0:o.httpOptions,abortSignal:null===(i=t.config)||void 0===i?void 0:i.abortSignal}).then((t=>t.json())),r.then((t=>V(this.apiClient,t)))}}async listInternal(t){var n,e,o,i;let a,u="",c={};if(this.apiClient.isVertexAI()){const o=k(this.apiClient,t);return u=s("cachedContents",o._url),c=o._query,delete o.config,delete o._url,delete o._query,a=this.apiClient.request({path:u,queryParams:c,body:JSON.stringify(o),httpMethod:"GET",httpOptions:null===(n=t.config)||void 0===n?void 0:n.httpOptions,abortSignal:null===(e=t.config)||void 0===e?void 0:e.abortSignal}).then((t=>t.json())),a.then((t=>{const n=function(t,n){const e={},o=l(n,["nextPageToken"]);null!=o&&r(e,["nextPageToken"],o);const i=l(n,["cachedContents"]);if(null!=i){let t=i;Array.isArray(t)&&(t=t.map((t=>j(0,t)))),r(e,["cachedContents"],t);}return e}(this.apiClient,t),e=new Jt;return Object.assign(e,n),e}))}{const n=M(this.apiClient,t);return u=s("cachedContents",n._url),c=n._query,delete n.config,delete n._url,delete n._query,a=this.apiClient.request({path:u,queryParams:c,body:JSON.stringify(n),httpMethod:"GET",httpOptions:null===(o=t.config)||void 0===o?void 0:o.httpOptions,abortSignal:null===(i=t.config)||void 0===i?void 0:i.abortSignal}).then((t=>t.json())),a.then((t=>{const n=function(t,n){const e={},o=l(n,["nextPageToken"]);null!=o&&r(e,["nextPageToken"],o);const i=l(n,["cachedContents"]);if(null!=i){let t=i;Array.isArray(t)&&(t=t.map((t=>V(0,t)))),r(e,["cachedContents"],t);}return e}(this.apiClient,t),e=new Jt;return Object.assign(e,n),e}))}}}function tn(t){var n="function"==typeof Symbol&&Symbol.iterator,e=n&&t[n],o=0;if(e)return e.call(t);if(t&&"number"==typeof t.length)return {next:function(){return t&&o>=t.length&&(t=void 0),{value:t&&t[o++],done:!t}}};throw new TypeError(n?"Object is not iterable.":"Symbol.iterator is not defined.")}function nn(t){return this instanceof nn?(this.v=t,this):new nn(t)}function en(t,n,e){if(!Symbol.asyncIterator)throw new TypeError("Symbol.asyncIterator is not defined.");var o,i=e.apply(t,n||[]),s=[];return o=Object.create(("function"==typeof AsyncIterator?AsyncIterator:Object).prototype),r("next"),r("throw"),r("return",(function(t){return function(n){return Promise.resolve(n).then(t,u)}})),o[Symbol.asyncIterator]=function(){return this},o;function r(t,n){i[t]&&(o[t]=function(n){return new Promise((function(e,o){s.push([t,n,e,o])>1||l(t,n);}))},n&&(o[t]=n(o[t])));}function l(t,n){try{(e=i[t](n)).value instanceof nn?Promise.resolve(e.value.v).then(a,u):c(s[0][2],e);}catch(t){c(s[0][3],t);}var e;}function a(t){l("next",t);}function u(t){l("throw",t);}function c(t,n){t(n),s.shift(),s.length&&l(s[0][0],s[0][1]);}}function on(t){if(!Symbol.asyncIterator)throw new TypeError("Symbol.asyncIterator is not defined.");var n,e=t[Symbol.asyncIterator];return e?e.call(t):(t=tn(t),n={},o("next"),o("throw"),o("return"),n[Symbol.asyncIterator]=function(){return this},n);function o(e){n[e]=t[e]&&function(n){return new Promise((function(o,i){(function(t,n,e,o){Promise.resolve(o).then((function(n){t({value:n,done:e});}),n);})(o,i,(n=t[e](n)).done,n.value);}))};}}
/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
function sn(t){var n;if(null==t.candidates||0===t.candidates.length)return  false;const e=null===(n=t.candidates[0])||void 0===n?void 0:n.content;return void 0!==e&&rn(e)}function rn(t){if(void 0===t.parts||0===t.parts.length)return  false;for(const n of t.parts){if(void 0===n||0===Object.keys(n).length)return  false;if(void 0!==n.text&&""===n.text)return  false}return  true}"function"==typeof SuppressedError&&SuppressedError;class ln{constructor(t,n){this.modelsModule=t,this.apiClient=n;}create(t){return new an(this.apiClient,this.modelsModule,t.model,t.config,t.history)}}class an{constructor(t,n,e,o={},i=[]){this.apiClient=t,this.modelsModule=n,this.model=e,this.config=o,this.history=i,this.sendPromise=Promise.resolve(),function(t){if(0!==t.length){if("user"!==t[0].role)throw new Error("History must start with a user turn.");for(const n of t)if("user"!==n.role&&"model"!==n.role)throw new Error(`Role must be user or model, but got ${n.role}.`)}}(i);}async sendMessage(t){var n;await this.sendPromise;const e=y(this.apiClient,t.message),o=this.modelsModule.generateContent({model:this.model,contents:this.getHistory(true).concat(e),config:null!==(n=t.config)&&void 0!==n?n:this.config});return this.sendPromise=(async()=>{var t,n;const i=null===(n=null===(t=(await o).candidates)||void 0===t?void 0:t[0])||void 0===n?void 0:n.content,s=i?[i]:[];this.recordHistory(e,s);})(),await this.sendPromise,o}async sendMessageStream(t){var n;await this.sendPromise;const e=y(this.apiClient,t.message),o=this.modelsModule.generateContentStream({model:this.model,contents:this.getHistory(true).concat(e),config:null!==(n=t.config)&&void 0!==n?n:this.config});this.sendPromise=o.then((()=>{})).catch((()=>{}));const i=await o;return this.processStreamResponse(i,e)}getHistory(t=false){return t?function(t){if(void 0===t||0===t.length)return [];const n=[],e=t.length;let o=0,i=t[0];for(;o<e;)if("user"===t[o].role)i=t[o],o++;else {const s=[];let r=true;for(;o<e&&"model"===t[o].role;)s.push(t[o]),r&&!rn(t[o])&&(r=false),o++;r&&(n.push(i),n.push(...s));}return n}(this.history):this.history}processStreamResponse(t,n){var e,o;return en(this,arguments,(function*(){var i,s,r,l;const a=[];try{for(var u,c=!0,d=on(t);!(i=(u=yield nn(d.next())).done);c=!0){l=u.value,c=!1;const t=l;if(sn(t)){const n=null===(o=null===(e=t.candidates)||void 0===e?void 0:e[0])||void 0===o?void 0:o.content;void 0!==n&&a.push(n);}yield yield nn(t);}}catch(t){s={error:t};}finally{try{c||i||!(r=d.return)||(yield nn(r.call(d)));}finally{if(s)throw s.error}}this.recordHistory(n,a);}))}recordHistory(t,n){let e=[];n.length>0&&n.every((t=>"model"===t.role))?e=n:e.push({role:"model",parts:[]}),this.history.push(t),this.history.push(...e);}}
/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */function un(t,n){const e={},o=l(n,["config"]);return null!=o&&r(e,["config"],function(t,n,e){const o=l(n,["pageSize"]);void 0!==e&&null!=o&&r(e,["_query","pageSize"],o);const i=l(n,["pageToken"]);return void 0!==e&&null!=i&&r(e,["_query","pageToken"],i),{}}(0,o,e)),e}function cn(t,n){const e={},o=l(n,["name"]);null!=o&&r(e,["name"],o);const i=l(n,["displayName"]);null!=i&&r(e,["displayName"],i);const s=l(n,["mimeType"]);null!=s&&r(e,["mimeType"],s);const a=l(n,["sizeBytes"]);null!=a&&r(e,["sizeBytes"],a);const u=l(n,["createTime"]);null!=u&&r(e,["createTime"],u);const c=l(n,["expirationTime"]);null!=c&&r(e,["expirationTime"],c);const d=l(n,["updateTime"]);null!=d&&r(e,["updateTime"],d);const p=l(n,["sha256Hash"]);null!=p&&r(e,["sha256Hash"],p);const h=l(n,["uri"]);null!=h&&r(e,["uri"],h);const f=l(n,["downloadUri"]);null!=f&&r(e,["downloadUri"],f);const g=l(n,["state"]);null!=g&&r(e,["state"],g);const m=l(n,["source"]);null!=m&&r(e,["source"],m);const y=l(n,["videoMetadata"]);null!=y&&r(e,["videoMetadata"],y);const v=l(n,["error"]);return null!=v&&r(e,["error"],function(t,n){const e={},o=l(n,["details"]);null!=o&&r(e,["details"],o);const i=l(n,["message"]);null!=i&&r(e,["message"],i);const s=l(n,["code"]);return null!=s&&r(e,["code"],s),e}(0,v)),e}function dn(t,n){const e={},o=l(n,["name"]);null!=o&&r(e,["name"],o);const i=l(n,["displayName"]);null!=i&&r(e,["displayName"],i);const s=l(n,["mimeType"]);null!=s&&r(e,["mimeType"],s);const a=l(n,["sizeBytes"]);null!=a&&r(e,["sizeBytes"],a);const u=l(n,["createTime"]);null!=u&&r(e,["createTime"],u);const c=l(n,["expirationTime"]);null!=c&&r(e,["expirationTime"],c);const d=l(n,["updateTime"]);null!=d&&r(e,["updateTime"],d);const p=l(n,["sha256Hash"]);null!=p&&r(e,["sha256Hash"],p);const h=l(n,["uri"]);null!=h&&r(e,["uri"],h);const f=l(n,["downloadUri"]);null!=f&&r(e,["downloadUri"],f);const g=l(n,["state"]);null!=g&&r(e,["state"],g);const m=l(n,["source"]);null!=m&&r(e,["source"],m);const y=l(n,["videoMetadata"]);null!=y&&r(e,["videoMetadata"],y);const v=l(n,["error"]);return null!=v&&r(e,["error"],function(t,n){const e={},o=l(n,["details"]);null!=o&&r(e,["details"],o);const i=l(n,["message"]);null!=i&&r(e,["message"],i);const s=l(n,["code"]);return null!=s&&r(e,["code"],s),e}(0,v)),e}
/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
class pn extends i{constructor(t){super(),this.apiClient=t,this.list=async(t={})=>new Tt(F.PAGED_ITEM_FILES,(t=>this.listInternal(t)),await this.listInternal(t),t);}async upload(t){if(this.apiClient.isVertexAI())throw new Error("Vertex AI does not support uploading files. You can share files through a GCS bucket.");return this.apiClient.uploadFile(t.file,t.config).then((t=>dn(this.apiClient,t)))}async listInternal(t){var n,e;let o,i="",a={};if(this.apiClient.isVertexAI())throw new Error("This method is only supported by the Gemini Developer API.");{const u=un(this.apiClient,t);return i=s("files",u._url),a=u._query,delete u.config,delete u._url,delete u._query,o=this.apiClient.request({path:i,queryParams:a,body:JSON.stringify(u),httpMethod:"GET",httpOptions:null===(n=t.config)||void 0===n?void 0:n.httpOptions,abortSignal:null===(e=t.config)||void 0===e?void 0:e.abortSignal}).then((t=>t.json())),o.then((t=>{const n=function(t,n){const e={},o=l(n,["nextPageToken"]);null!=o&&r(e,["nextPageToken"],o);const i=l(n,["files"]);if(null!=i){let t=i;Array.isArray(t)&&(t=t.map((t=>dn(0,t)))),r(e,["files"],t);}return e}(this.apiClient,t),e=new Yt;return Object.assign(e,n),e}))}}async createInternal(t){var n,e;let o,i="",a={};if(this.apiClient.isVertexAI())throw new Error("This method is only supported by the Gemini Developer API.");{const u=function(t,n){const e={},o=l(n,["file"]);null!=o&&r(e,["file"],cn(0,o));const i=l(n,["config"]);return null!=i&&r(e,["config"],i),e}(this.apiClient,t);return i=s("upload/v1beta/files",u._url),a=u._query,delete u.config,delete u._url,delete u._query,o=this.apiClient.request({path:i,queryParams:a,body:JSON.stringify(u),httpMethod:"POST",httpOptions:null===(n=t.config)||void 0===n?void 0:n.httpOptions,abortSignal:null===(e=t.config)||void 0===e?void 0:e.abortSignal}).then((t=>t.json())),o.then((()=>{const t={},n=new Wt;return Object.assign(n,t),n}))}}async get(t){var n,e;let o,i="",a={};if(this.apiClient.isVertexAI())throw new Error("This method is only supported by the Gemini Developer API.");{const u=function(t,n){const e={},o=l(n,["name"]);null!=o&&r(e,["_url","file"],b(0,o));const i=l(n,["config"]);return null!=i&&r(e,["config"],i),e}(this.apiClient,t);return i=s("files/{file}",u._url),a=u._query,delete u.config,delete u._url,delete u._query,o=this.apiClient.request({path:i,queryParams:a,body:JSON.stringify(u),httpMethod:"GET",httpOptions:null===(n=t.config)||void 0===n?void 0:n.httpOptions,abortSignal:null===(e=t.config)||void 0===e?void 0:e.abortSignal}).then((t=>t.json())),o.then((t=>dn(this.apiClient,t)))}}async delete(t){var n,e;let o,i="",a={};if(this.apiClient.isVertexAI())throw new Error("This method is only supported by the Gemini Developer API.");{const u=function(t,n){const e={},o=l(n,["name"]);null!=o&&r(e,["_url","file"],b(0,o));const i=l(n,["config"]);return null!=i&&r(e,["config"],i),e}(this.apiClient,t);return i=s("files/{file}",u._url),a=u._query,delete u.config,delete u._url,delete u._query,o=this.apiClient.request({path:i,queryParams:a,body:JSON.stringify(u),httpMethod:"DELETE",httpOptions:null===(n=t.config)||void 0===n?void 0:n.httpOptions,abortSignal:null===(e=t.config)||void 0===e?void 0:e.abortSignal}).then((t=>t.json())),o.then((()=>{const t={},n=new $t;return Object.assign(n,t),n}))}}}
/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */function hn(t,n){const e={},o=l(n,["parts"]);if(null!=o){let t=o;Array.isArray(t)&&(t=t.map((t=>function(t,n){const e={};if(void 0!==l(n,["videoMetadata"]))throw new Error("videoMetadata parameter is not supported in Gemini API.");const o=l(n,["thought"]);null!=o&&r(e,["thought"],o);const i=l(n,["codeExecutionResult"]);null!=i&&r(e,["codeExecutionResult"],i);const s=l(n,["executableCode"]);null!=s&&r(e,["executableCode"],s);const a=l(n,["fileData"]);null!=a&&r(e,["fileData"],a);const u=l(n,["functionCall"]);null!=u&&r(e,["functionCall"],u);const c=l(n,["functionResponse"]);null!=c&&r(e,["functionResponse"],c);const d=l(n,["inlineData"]);null!=d&&r(e,["inlineData"],d);const p=l(n,["text"]);return null!=p&&r(e,["text"],p),e}(0,t)))),r(e,["parts"],t);}const i=l(n,["role"]);return null!=i&&r(e,["role"],i),e}function fn(t,n){const e={},o=l(n,["parts"]);if(null!=o){let t=o;Array.isArray(t)&&(t=t.map((t=>function(t,n){const e={},o=l(n,["videoMetadata"]);null!=o&&r(e,["videoMetadata"],o);const i=l(n,["thought"]);null!=i&&r(e,["thought"],i);const s=l(n,["codeExecutionResult"]);null!=s&&r(e,["codeExecutionResult"],s);const a=l(n,["executableCode"]);null!=a&&r(e,["executableCode"],a);const u=l(n,["fileData"]);null!=u&&r(e,["fileData"],u);const c=l(n,["functionCall"]);null!=c&&r(e,["functionCall"],c);const d=l(n,["functionResponse"]);null!=d&&r(e,["functionResponse"],d);const p=l(n,["inlineData"]);null!=p&&r(e,["inlineData"],p);const h=l(n,["text"]);return null!=h&&r(e,["text"],h),e}(0,t)))),r(e,["parts"],t);}const i=l(n,["role"]);return null!=i&&r(e,["role"],i),e}function gn(t,n){const e={},o=l(n,["dynamicRetrievalConfig"]);return null!=o&&r(e,["dynamicRetrievalConfig"],function(t,n){const e={},o=l(n,["mode"]);null!=o&&r(e,["mode"],o);const i=l(n,["dynamicThreshold"]);return null!=i&&r(e,["dynamicThreshold"],i),e}(0,o)),e}function mn(t,n){const e={},o=l(n,["dynamicRetrievalConfig"]);return null!=o&&r(e,["dynamicRetrievalConfig"],function(t,n){const e={},o=l(n,["mode"]);null!=o&&r(e,["mode"],o);const i=l(n,["dynamicThreshold"]);return null!=i&&r(e,["dynamicThreshold"],i),e}(0,o)),e}function yn(t,n){const e={},o=l(n,["automaticActivityDetection"]);null!=o&&r(e,["automaticActivityDetection"],function(t,n){const e={},o=l(n,["disabled"]);null!=o&&r(e,["disabled"],o);const i=l(n,["startOfSpeechSensitivity"]);null!=i&&r(e,["startOfSpeechSensitivity"],i);const s=l(n,["endOfSpeechSensitivity"]);null!=s&&r(e,["endOfSpeechSensitivity"],s);const a=l(n,["prefixPaddingMs"]);null!=a&&r(e,["prefixPaddingMs"],a);const u=l(n,["silenceDurationMs"]);return null!=u&&r(e,["silenceDurationMs"],u),e}(0,o));const i=l(n,["activityHandling"]);null!=i&&r(e,["activityHandling"],i);const s=l(n,["turnCoverage"]);return null!=s&&r(e,["turnCoverage"],s),e}function vn(t,n){const e={},o=l(n,["automaticActivityDetection"]);null!=o&&r(e,["automaticActivityDetection"],function(t,n){const e={},o=l(n,["disabled"]);null!=o&&r(e,["disabled"],o);const i=l(n,["startOfSpeechSensitivity"]);null!=i&&r(e,["startOfSpeechSensitivity"],i);const s=l(n,["endOfSpeechSensitivity"]);null!=s&&r(e,["endOfSpeechSensitivity"],s);const a=l(n,["prefixPaddingMs"]);null!=a&&r(e,["prefixPaddingMs"],a);const u=l(n,["silenceDurationMs"]);return null!=u&&r(e,["silenceDurationMs"],u),e}(0,o));const i=l(n,["activityHandling"]);null!=i&&r(e,["activityHandling"],i);const s=l(n,["turnCoverage"]);return null!=s&&r(e,["turnCoverage"],s),e}function En(t,n){const e={},o=l(n,["triggerTokens"]);null!=o&&r(e,["triggerTokens"],o);const i=l(n,["slidingWindow"]);return null!=i&&r(e,["slidingWindow"],function(t,n){const e={},o=l(n,["targetTokens"]);return null!=o&&r(e,["targetTokens"],o),e}(0,i)),e}function Cn(t,n){const e={},o=l(n,["triggerTokens"]);null!=o&&r(e,["triggerTokens"],o);const i=l(n,["slidingWindow"]);return null!=i&&r(e,["slidingWindow"],function(t,n){const e={},o=l(n,["targetTokens"]);return null!=o&&r(e,["targetTokens"],o),e}(0,i)),e}function Tn(t,n,e){const o=l(n,["generationConfig"]);void 0!==e&&null!=o&&r(e,["setup","generationConfig"],o);const i=l(n,["responseModalities"]);void 0!==e&&null!=i&&r(e,["setup","generationConfig","responseModalities"],i);const s=l(n,["temperature"]);void 0!==e&&null!=s&&r(e,["setup","generationConfig","temperature"],s);const a=l(n,["topP"]);void 0!==e&&null!=a&&r(e,["setup","generationConfig","topP"],a);const u=l(n,["topK"]);void 0!==e&&null!=u&&r(e,["setup","generationConfig","topK"],u);const c=l(n,["maxOutputTokens"]);void 0!==e&&null!=c&&r(e,["setup","generationConfig","maxOutputTokens"],c);const d=l(n,["mediaResolution"]);void 0!==e&&null!=d&&r(e,["setup","generationConfig","mediaResolution"],d);const p=l(n,["seed"]);void 0!==e&&null!=p&&r(e,["setup","generationConfig","seed"],p);const h=l(n,["speechConfig"]);void 0!==e&&null!=h&&r(e,["setup","generationConfig","speechConfig"],h);const f=l(n,["systemInstruction"]);void 0!==e&&null!=f&&r(e,["setup","systemInstruction"],hn(0,y(0,f)));const g=l(n,["tools"]);if(void 0!==e&&null!=g){let t=O(0,g);Array.isArray(t)&&(t=t.map((t=>function(t,n){const e={};if(void 0!==l(n,["retrieval"]))throw new Error("retrieval parameter is not supported in Gemini API.");null!=l(n,["googleSearch"])&&r(e,["googleSearch"],{});const o=l(n,["googleSearchRetrieval"]);null!=o&&r(e,["googleSearchRetrieval"],gn(0,o));const i=l(n,["codeExecution"]);null!=i&&r(e,["codeExecution"],i);const s=l(n,["functionDeclarations"]);return null!=s&&r(e,["functionDeclarations"],s),e}(0,_(0,t))))),r(e,["setup","tools"],t);}const m=l(n,["sessionResumption"]);if(void 0!==e&&null!=m&&r(e,["setup","sessionResumption"],function(t,n){const e={},o=l(n,["handle"]);if(null!=o&&r(e,["handle"],o),void 0!==l(n,["transparent"]))throw new Error("transparent parameter is not supported in Gemini API.");return e}(0,m)),void 0!==l(n,["inputAudioTranscription"]))throw new Error("inputAudioTranscription parameter is not supported in Gemini API.");const v=l(n,["outputAudioTranscription"]);void 0!==e&&null!=v&&r(e,["setup","outputAudioTranscription"],{});const E=l(n,["realtimeInputConfig"]);void 0!==e&&null!=E&&r(e,["setup","realtimeInputConfig"],yn(0,E));const C=l(n,["contextWindowCompression"]);return void 0!==e&&null!=C&&r(e,["setup","contextWindowCompression"],En(0,C)),{}}function _n(t,n,e){const o=l(n,["generationConfig"]);void 0!==e&&null!=o&&r(e,["setup","generationConfig"],o);const i=l(n,["responseModalities"]);void 0!==e&&null!=i&&r(e,["setup","generationConfig","responseModalities"],i);const s=l(n,["temperature"]);void 0!==e&&null!=s&&r(e,["setup","generationConfig","temperature"],s);const a=l(n,["topP"]);void 0!==e&&null!=a&&r(e,["setup","generationConfig","topP"],a);const u=l(n,["topK"]);void 0!==e&&null!=u&&r(e,["setup","generationConfig","topK"],u);const c=l(n,["maxOutputTokens"]);void 0!==e&&null!=c&&r(e,["setup","generationConfig","maxOutputTokens"],c);const d=l(n,["mediaResolution"]);void 0!==e&&null!=d&&r(e,["setup","generationConfig","mediaResolution"],d);const p=l(n,["seed"]);void 0!==e&&null!=p&&r(e,["setup","generationConfig","seed"],p);const h=l(n,["speechConfig"]);void 0!==e&&null!=h&&r(e,["setup","generationConfig","speechConfig"],h);const f=l(n,["systemInstruction"]);void 0!==e&&null!=f&&r(e,["setup","systemInstruction"],fn(0,y(0,f)));const g=l(n,["tools"]);if(void 0!==e&&null!=g){let t=O(0,g);Array.isArray(t)&&(t=t.map((t=>function(t,n){const e={},o=l(n,["retrieval"]);null!=o&&r(e,["retrieval"],o),null!=l(n,["googleSearch"])&&r(e,["googleSearch"],{});const i=l(n,["googleSearchRetrieval"]);null!=i&&r(e,["googleSearchRetrieval"],mn(0,i));const s=l(n,["codeExecution"]);null!=s&&r(e,["codeExecution"],s);const a=l(n,["functionDeclarations"]);return null!=a&&r(e,["functionDeclarations"],a),e}(0,_(0,t))))),r(e,["setup","tools"],t);}const m=l(n,["sessionResumption"]);void 0!==e&&null!=m&&r(e,["setup","sessionResumption"],function(t,n){const e={},o=l(n,["handle"]);null!=o&&r(e,["handle"],o);const i=l(n,["transparent"]);return null!=i&&r(e,["transparent"],i),e}(0,m));const v=l(n,["inputAudioTranscription"]);void 0!==e&&null!=v&&r(e,["setup","inputAudioTranscription"],{});const E=l(n,["outputAudioTranscription"]);void 0!==e&&null!=E&&r(e,["setup","outputAudioTranscription"],{});const C=l(n,["realtimeInputConfig"]);void 0!==e&&null!=C&&r(e,["setup","realtimeInputConfig"],vn(0,C));const T=l(n,["contextWindowCompression"]);return void 0!==e&&null!=T&&r(e,["setup","contextWindowCompression"],Cn(0,T)),{}}function On(t,n){const e={},o=l(n,["media"]);null!=o&&r(e,["mediaChunks"],c(t,o));const i=l(n,["audio"]);null!=i&&r(e,["audio"],function(t,n){const e=d(0,n);if(e.mimeType&&e.mimeType.startsWith("audio/"))return e;throw new Error(`Unsupported mime type: ${e.mimeType}`)}(0,i));const s=l(n,["audioStreamEnd"]);null!=s&&r(e,["audioStreamEnd"],s);const a=l(n,["video"]);null!=a&&r(e,["video"],function(t,n){const e=d(0,n);if(e.mimeType&&e.mimeType.startsWith("image/"))return e;throw new Error(`Unsupported mime type: ${e.mimeType}`)}(0,a));const u=l(n,["text"]);null!=u&&r(e,["text"],u);null!=l(n,["activityStart"])&&r(e,["activityStart"],{});return null!=l(n,["activityEnd"])&&r(e,["activityEnd"],{}),e}function In(t,n){const e={},o=l(n,["media"]);if(null!=o&&r(e,["mediaChunks"],c(t,o)),void 0!==l(n,["audio"]))throw new Error("audio parameter is not supported in Vertex AI.");const i=l(n,["audioStreamEnd"]);if(null!=i&&r(e,["audioStreamEnd"],i),void 0!==l(n,["video"]))throw new Error("video parameter is not supported in Vertex AI.");if(void 0!==l(n,["text"]))throw new Error("text parameter is not supported in Vertex AI.");null!=l(n,["activityStart"])&&r(e,["activityStart"],{});return null!=l(n,["activityEnd"])&&r(e,["activityEnd"],{}),e}function An(t,n){const e={},o=l(n,["parts"]);if(null!=o){let t=o;Array.isArray(t)&&(t=t.map((t=>function(t,n){const e={},o=l(n,["thought"]);null!=o&&r(e,["thought"],o);const i=l(n,["codeExecutionResult"]);null!=i&&r(e,["codeExecutionResult"],i);const s=l(n,["executableCode"]);null!=s&&r(e,["executableCode"],s);const a=l(n,["fileData"]);null!=a&&r(e,["fileData"],a);const u=l(n,["functionCall"]);null!=u&&r(e,["functionCall"],u);const c=l(n,["functionResponse"]);null!=c&&r(e,["functionResponse"],c);const d=l(n,["inlineData"]);null!=d&&r(e,["inlineData"],d);const p=l(n,["text"]);return null!=p&&r(e,["text"],p),e}(0,t)))),r(e,["parts"],t);}const i=l(n,["role"]);return null!=i&&r(e,["role"],i),e}function Sn(t,n){const e={},o=l(n,["parts"]);if(null!=o){let t=o;Array.isArray(t)&&(t=t.map((t=>function(t,n){const e={},o=l(n,["videoMetadata"]);null!=o&&r(e,["videoMetadata"],o);const i=l(n,["thought"]);null!=i&&r(e,["thought"],i);const s=l(n,["codeExecutionResult"]);null!=s&&r(e,["codeExecutionResult"],s);const a=l(n,["executableCode"]);null!=a&&r(e,["executableCode"],a);const u=l(n,["fileData"]);null!=u&&r(e,["fileData"],u);const c=l(n,["functionCall"]);null!=c&&r(e,["functionCall"],c);const d=l(n,["functionResponse"]);null!=d&&r(e,["functionResponse"],d);const p=l(n,["inlineData"]);null!=p&&r(e,["inlineData"],p);const h=l(n,["text"]);return null!=h&&r(e,["text"],h),e}(0,t)))),r(e,["parts"],t);}const i=l(n,["role"]);return null!=i&&r(e,["role"],i),e}function bn(t,n){const e={},o=l(n,["text"]);null!=o&&r(e,["text"],o);const i=l(n,["finished"]);return null!=i&&r(e,["finished"],i),e}function wn(t,n){const e={},o=l(n,["text"]);null!=o&&r(e,["text"],o);const i=l(n,["finished"]);return null!=i&&r(e,["finished"],i),e}function Pn(t,n){const e={},o=l(n,["functionCalls"]);if(null!=o){let t=o;Array.isArray(t)&&(t=t.map((t=>function(t,n){const e={},o=l(n,["id"]);null!=o&&r(e,["id"],o);const i=l(n,["args"]);null!=i&&r(e,["args"],i);const s=l(n,["name"]);return null!=s&&r(e,["name"],s),e}(0,t)))),r(e,["functionCalls"],t);}return e}function Nn(t,n){const e={},o=l(n,["functionCalls"]);if(null!=o){let t=o;Array.isArray(t)&&(t=t.map((t=>function(t,n){const e={},o=l(n,["args"]);null!=o&&r(e,["args"],o);const i=l(n,["name"]);return null!=i&&r(e,["name"],i),e}(0,t)))),r(e,["functionCalls"],t);}return e}function Rn(t,n){const e={},o=l(n,["modality"]);null!=o&&r(e,["modality"],o);const i=l(n,["tokenCount"]);return null!=i&&r(e,["tokenCount"],i),e}function Dn(t,n){const e={},o=l(n,["modality"]);null!=o&&r(e,["modality"],o);const i=l(n,["tokenCount"]);return null!=i&&r(e,["tokenCount"],i),e}function Mn(t,n){const e={};null!=l(n,["setupComplete"])&&r(e,["setupComplete"],{});const o=l(n,["serverContent"]);null!=o&&r(e,["serverContent"],function(t,n){const e={},o=l(n,["modelTurn"]);null!=o&&r(e,["modelTurn"],An(0,o));const i=l(n,["turnComplete"]);null!=i&&r(e,["turnComplete"],i);const s=l(n,["interrupted"]);null!=s&&r(e,["interrupted"],s);const a=l(n,["groundingMetadata"]);null!=a&&r(e,["groundingMetadata"],a);const u=l(n,["generationComplete"]);null!=u&&r(e,["generationComplete"],u);const c=l(n,["inputTranscription"]);null!=c&&r(e,["inputTranscription"],bn(0,c));const d=l(n,["outputTranscription"]);return null!=d&&r(e,["outputTranscription"],bn(0,d)),e}(0,o));const i=l(n,["toolCall"]);null!=i&&r(e,["toolCall"],Pn(0,i));const s=l(n,["toolCallCancellation"]);null!=s&&r(e,["toolCallCancellation"],function(t,n){const e={},o=l(n,["ids"]);return null!=o&&r(e,["ids"],o),e}(0,s));const a=l(n,["usageMetadata"]);null!=a&&r(e,["usageMetadata"],function(t,n){const e={},o=l(n,["promptTokenCount"]);null!=o&&r(e,["promptTokenCount"],o);const i=l(n,["cachedContentTokenCount"]);null!=i&&r(e,["cachedContentTokenCount"],i);const s=l(n,["responseTokenCount"]);null!=s&&r(e,["responseTokenCount"],s);const a=l(n,["toolUsePromptTokenCount"]);null!=a&&r(e,["toolUsePromptTokenCount"],a);const u=l(n,["thoughtsTokenCount"]);null!=u&&r(e,["thoughtsTokenCount"],u);const c=l(n,["totalTokenCount"]);null!=c&&r(e,["totalTokenCount"],c);const d=l(n,["promptTokensDetails"]);if(null!=d){let t=d;Array.isArray(t)&&(t=t.map((t=>Rn(0,t)))),r(e,["promptTokensDetails"],t);}const p=l(n,["cacheTokensDetails"]);if(null!=p){let t=p;Array.isArray(t)&&(t=t.map((t=>Rn(0,t)))),r(e,["cacheTokensDetails"],t);}const h=l(n,["responseTokensDetails"]);if(null!=h){let t=h;Array.isArray(t)&&(t=t.map((t=>Rn(0,t)))),r(e,["responseTokensDetails"],t);}const f=l(n,["toolUsePromptTokensDetails"]);if(null!=f){let t=f;Array.isArray(t)&&(t=t.map((t=>Rn(0,t)))),r(e,["toolUsePromptTokensDetails"],t);}return e}(0,a));const u=l(n,["goAway"]);null!=u&&r(e,["goAway"],function(t,n){const e={},o=l(n,["timeLeft"]);return null!=o&&r(e,["timeLeft"],o),e}(0,u));const c=l(n,["sessionResumptionUpdate"]);return null!=c&&r(e,["sessionResumptionUpdate"],function(t,n){const e={},o=l(n,["newHandle"]);null!=o&&r(e,["newHandle"],o);const i=l(n,["resumable"]);null!=i&&r(e,["resumable"],i);const s=l(n,["lastConsumedClientMessageIndex"]);return null!=s&&r(e,["lastConsumedClientMessageIndex"],s),e}(0,c)),e}function xn(t,n){const e={};null!=l(n,["setupComplete"])&&r(e,["setupComplete"],{});const o=l(n,["serverContent"]);null!=o&&r(e,["serverContent"],function(t,n){const e={},o=l(n,["modelTurn"]);null!=o&&r(e,["modelTurn"],Sn(0,o));const i=l(n,["turnComplete"]);null!=i&&r(e,["turnComplete"],i);const s=l(n,["interrupted"]);null!=s&&r(e,["interrupted"],s);const a=l(n,["groundingMetadata"]);null!=a&&r(e,["groundingMetadata"],a);const u=l(n,["generationComplete"]);null!=u&&r(e,["generationComplete"],u);const c=l(n,["inputTranscription"]);null!=c&&r(e,["inputTranscription"],wn(0,c));const d=l(n,["outputTranscription"]);return null!=d&&r(e,["outputTranscription"],wn(0,d)),e}(0,o));const i=l(n,["toolCall"]);null!=i&&r(e,["toolCall"],Nn(0,i));const s=l(n,["toolCallCancellation"]);null!=s&&r(e,["toolCallCancellation"],function(t,n){const e={},o=l(n,["ids"]);return null!=o&&r(e,["ids"],o),e}(0,s));const a=l(n,["usageMetadata"]);null!=a&&r(e,["usageMetadata"],function(t,n){const e={},o=l(n,["promptTokenCount"]);null!=o&&r(e,["promptTokenCount"],o);const i=l(n,["cachedContentTokenCount"]);null!=i&&r(e,["cachedContentTokenCount"],i);const s=l(n,["candidatesTokenCount"]);null!=s&&r(e,["responseTokenCount"],s);const a=l(n,["toolUsePromptTokenCount"]);null!=a&&r(e,["toolUsePromptTokenCount"],a);const u=l(n,["thoughtsTokenCount"]);null!=u&&r(e,["thoughtsTokenCount"],u);const c=l(n,["totalTokenCount"]);null!=c&&r(e,["totalTokenCount"],c);const d=l(n,["promptTokensDetails"]);if(null!=d){let t=d;Array.isArray(t)&&(t=t.map((t=>Dn(0,t)))),r(e,["promptTokensDetails"],t);}const p=l(n,["cacheTokensDetails"]);if(null!=p){let t=p;Array.isArray(t)&&(t=t.map((t=>Dn(0,t)))),r(e,["cacheTokensDetails"],t);}const h=l(n,["candidatesTokensDetails"]);if(null!=h){let t=h;Array.isArray(t)&&(t=t.map((t=>Dn(0,t)))),r(e,["responseTokensDetails"],t);}const f=l(n,["toolUsePromptTokensDetails"]);if(null!=f){let t=f;Array.isArray(t)&&(t=t.map((t=>Dn(0,t)))),r(e,["toolUsePromptTokensDetails"],t);}const g=l(n,["trafficType"]);return null!=g&&r(e,["trafficType"],g),e}(0,a));const u=l(n,["goAway"]);null!=u&&r(e,["goAway"],function(t,n){const e={},o=l(n,["timeLeft"]);return null!=o&&r(e,["timeLeft"],o),e}(0,u));const c=l(n,["sessionResumptionUpdate"]);return null!=c&&r(e,["sessionResumptionUpdate"],function(t,n){const e={},o=l(n,["newHandle"]);null!=o&&r(e,["newHandle"],o);const i=l(n,["resumable"]);null!=i&&r(e,["resumable"],i);const s=l(n,["lastConsumedClientMessageIndex"]);return null!=s&&r(e,["lastConsumedClientMessageIndex"],s),e}(0,c)),e}
/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */function Un(t,n){const e={},o=l(n,["parts"]);if(null!=o){let t=o;Array.isArray(t)&&(t=t.map((t=>function(t,n){const e={};if(void 0!==l(n,["videoMetadata"]))throw new Error("videoMetadata parameter is not supported in Gemini API.");const o=l(n,["thought"]);null!=o&&r(e,["thought"],o);const i=l(n,["codeExecutionResult"]);null!=i&&r(e,["codeExecutionResult"],i);const s=l(n,["executableCode"]);null!=s&&r(e,["executableCode"],s);const a=l(n,["fileData"]);null!=a&&r(e,["fileData"],a);const u=l(n,["functionCall"]);null!=u&&r(e,["functionCall"],u);const c=l(n,["functionResponse"]);null!=c&&r(e,["functionResponse"],c);const d=l(n,["inlineData"]);null!=d&&r(e,["inlineData"],d);const p=l(n,["text"]);return null!=p&&r(e,["text"],p),e}(0,t)))),r(e,["parts"],t);}const i=l(n,["role"]);return null!=i&&r(e,["role"],i),e}function qn(t,n){const e={},o=l(n,["dynamicRetrievalConfig"]);return null!=o&&r(e,["dynamicRetrievalConfig"],function(t,n){const e={},o=l(n,["mode"]);null!=o&&r(e,["mode"],o);const i=l(n,["dynamicThreshold"]);return null!=i&&r(e,["dynamicThreshold"],i),e}(0,o)),e}function Ln(t,n){const e={},o=l(n,["functionCallingConfig"]);return null!=o&&r(e,["functionCallingConfig"],function(t,n){const e={},o=l(n,["mode"]);null!=o&&r(e,["mode"],o);const i=l(n,["allowedFunctionNames"]);return null!=i&&r(e,["allowedFunctionNames"],i),e}(0,o)),e}function Gn(t,n){const e={},o=l(n,["prebuiltVoiceConfig"]);return null!=o&&r(e,["prebuiltVoiceConfig"],function(t,n){const e={},o=l(n,["voiceName"]);return null!=o&&r(e,["voiceName"],o),e}(0,o)),e}function kn(t,n,e){const o={},i=l(n,["systemInstruction"]);void 0!==e&&null!=i&&r(e,["systemInstruction"],Un(0,y(0,i)));const s=l(n,["temperature"]);null!=s&&r(o,["temperature"],s);const a=l(n,["topP"]);null!=a&&r(o,["topP"],a);const u=l(n,["topK"]);null!=u&&r(o,["topK"],u);const c=l(n,["candidateCount"]);null!=c&&r(o,["candidateCount"],c);const d=l(n,["maxOutputTokens"]);null!=d&&r(o,["maxOutputTokens"],d);const p=l(n,["stopSequences"]);null!=p&&r(o,["stopSequences"],p);const h=l(n,["responseLogprobs"]);null!=h&&r(o,["responseLogprobs"],h);const f=l(n,["logprobs"]);null!=f&&r(o,["logprobs"],f);const g=l(n,["presencePenalty"]);null!=g&&r(o,["presencePenalty"],g);const m=l(n,["frequencyPenalty"]);null!=m&&r(o,["frequencyPenalty"],m);const v=l(n,["seed"]);null!=v&&r(o,["seed"],v);const E=l(n,["responseMimeType"]);null!=E&&r(o,["responseMimeType"],E);const A=l(n,["responseSchema"]);if(null!=A&&r(o,["responseSchema"],C(0,A)),void 0!==l(n,["routingConfig"]))throw new Error("routingConfig parameter is not supported in Gemini API.");if(void 0!==l(n,["modelSelectionConfig"]))throw new Error("modelSelectionConfig parameter is not supported in Gemini API.");const S=l(n,["safetySettings"]);if(void 0!==e&&null!=S){let t=S;Array.isArray(t)&&(t=t.map((t=>function(t,n){const e={};if(void 0!==l(n,["method"]))throw new Error("method parameter is not supported in Gemini API.");const o=l(n,["category"]);null!=o&&r(e,["category"],o);const i=l(n,["threshold"]);return null!=i&&r(e,["threshold"],i),e}(0,t)))),r(e,["safetySettings"],t);}const b=l(n,["tools"]);if(void 0!==e&&null!=b){let t=O(0,b);Array.isArray(t)&&(t=t.map((t=>function(t,n){const e={};if(void 0!==l(n,["retrieval"]))throw new Error("retrieval parameter is not supported in Gemini API.");null!=l(n,["googleSearch"])&&r(e,["googleSearch"],{});const o=l(n,["googleSearchRetrieval"]);null!=o&&r(e,["googleSearchRetrieval"],qn(0,o));const i=l(n,["codeExecution"]);null!=i&&r(e,["codeExecution"],i);const s=l(n,["functionDeclarations"]);return null!=s&&r(e,["functionDeclarations"],s),e}(0,_(0,t))))),r(e,["tools"],t);}const w=l(n,["toolConfig"]);if(void 0!==e&&null!=w&&r(e,["toolConfig"],Ln(0,w)),void 0!==l(n,["labels"]))throw new Error("labels parameter is not supported in Gemini API.");const P=l(n,["cachedContent"]);void 0!==e&&null!=P&&r(e,["cachedContent"],I(t,P));const N=l(n,["responseModalities"]);null!=N&&r(o,["responseModalities"],N);const R=l(n,["mediaResolution"]);null!=R&&r(o,["mediaResolution"],R);const D=l(n,["speechConfig"]);if(null!=D&&r(o,["speechConfig"],function(t,n){const e={},o=l(n,["voiceConfig"]);null!=o&&r(e,["voiceConfig"],Gn(0,o));const i=l(n,["languageCode"]);return null!=i&&r(e,["languageCode"],i),e}(0,T(0,D))),void 0!==l(n,["audioTimestamp"]))throw new Error("audioTimestamp parameter is not supported in Gemini API.");const M=l(n,["thinkingConfig"]);return null!=M&&r(o,["thinkingConfig"],function(t,n){const e={},o=l(n,["includeThoughts"]);null!=o&&r(e,["includeThoughts"],o);const i=l(n,["thinkingBudget"]);return null!=i&&r(e,["thinkingBudget"],i),e}(0,M)),o}function Vn(t,n){const e={},o=l(n,["model"]);null!=o&&r(e,["_url","model"],a(t,o));const i=l(n,["contents"]);if(null!=i){let t=E(0,i);Array.isArray(t)&&(t=t.map((t=>Un(0,t)))),r(e,["contents"],t);}const s=l(n,["config"]);return null!=s&&r(e,["generationConfig"],kn(t,s,e)),e}function jn(t,n){const e={},o=l(n,["model"]);null!=o&&r(e,["_url","model"],a(t,o));const i=l(n,["contents"]);null!=i&&r(e,["requests[]","content"],v(t,i));const s=l(n,["config"]);null!=s&&r(e,["config"],function(t,n,e){const o=l(n,["taskType"]);void 0!==e&&null!=o&&r(e,["requests[]","taskType"],o);const i=l(n,["title"]);void 0!==e&&null!=i&&r(e,["requests[]","title"],i);const s=l(n,["outputDimensionality"]);if(void 0!==e&&null!=s&&r(e,["requests[]","outputDimensionality"],s),void 0!==l(n,["mimeType"]))throw new Error("mimeType parameter is not supported in Gemini API.");if(void 0!==l(n,["autoTruncate"]))throw new Error("autoTruncate parameter is not supported in Gemini API.");return {}}(0,s,e));const u=l(n,["model"]);return void 0!==u&&r(e,["requests[]","model"],a(t,u)),e}function Fn(t,n){const e={},o=l(n,["model"]);null!=o&&r(e,["_url","model"],a(t,o));const i=l(n,["prompt"]);null!=i&&r(e,["instances[0]","prompt"],i);const s=l(n,["config"]);return null!=s&&r(e,["config"],function(t,n,e){if(void 0!==l(n,["outputGcsUri"]))throw new Error("outputGcsUri parameter is not supported in Gemini API.");if(void 0!==l(n,["negativePrompt"]))throw new Error("negativePrompt parameter is not supported in Gemini API.");const o=l(n,["numberOfImages"]);void 0!==e&&null!=o&&r(e,["parameters","sampleCount"],o);const i=l(n,["aspectRatio"]);void 0!==e&&null!=i&&r(e,["parameters","aspectRatio"],i);const s=l(n,["guidanceScale"]);if(void 0!==e&&null!=s&&r(e,["parameters","guidanceScale"],s),void 0!==l(n,["seed"]))throw new Error("seed parameter is not supported in Gemini API.");const a=l(n,["safetyFilterLevel"]);void 0!==e&&null!=a&&r(e,["parameters","safetySetting"],a);const u=l(n,["personGeneration"]);void 0!==e&&null!=u&&r(e,["parameters","personGeneration"],u);const c=l(n,["includeSafetyAttributes"]);void 0!==e&&null!=c&&r(e,["parameters","includeSafetyAttributes"],c);const d=l(n,["includeRaiReason"]);void 0!==e&&null!=d&&r(e,["parameters","includeRaiReason"],d);const p=l(n,["language"]);void 0!==e&&null!=p&&r(e,["parameters","language"],p);const h=l(n,["outputMimeType"]);void 0!==e&&null!=h&&r(e,["parameters","outputOptions","mimeType"],h);const f=l(n,["outputCompressionQuality"]);if(void 0!==e&&null!=f&&r(e,["parameters","outputOptions","compressionQuality"],f),void 0!==l(n,["addWatermark"]))throw new Error("addWatermark parameter is not supported in Gemini API.");if(void 0!==l(n,["enhancePrompt"]))throw new Error("enhancePrompt parameter is not supported in Gemini API.");return {}}(0,s,e)),e}function Bn(t,n){const e={},o=l(n,["model"]);null!=o&&r(e,["_url","name"],a(t,o));const i=l(n,["config"]);return null!=i&&r(e,["config"],function(t,n,e){const o=l(n,["displayName"]);void 0!==e&&null!=o&&r(e,["displayName"],o);const i=l(n,["description"]);return void 0!==e&&null!=i&&r(e,["description"],i),{}}(0,i,e)),e}function Hn(t,n){const e={},o=l(n,["model"]);null!=o&&r(e,["_url","model"],a(t,o));const i=l(n,["contents"]);if(null!=i){let t=E(0,i);Array.isArray(t)&&(t=t.map((t=>Un(0,t)))),r(e,["contents"],t);}const s=l(n,["config"]);return null!=s&&r(e,["config"],function(t,n){if(void 0!==l(n,["systemInstruction"]))throw new Error("systemInstruction parameter is not supported in Gemini API.");if(void 0!==l(n,["tools"]))throw new Error("tools parameter is not supported in Gemini API.");if(void 0!==l(n,["generationConfig"]))throw new Error("generationConfig parameter is not supported in Gemini API.");return {}}(0,s)),e}function Jn(t,n){const e={},o=l(n,["model"]);null!=o&&r(e,["_url","model"],a(t,o));const i=l(n,["prompt"]);null!=i&&r(e,["instances[0]","prompt"],i);const s=l(n,["image"]);null!=s&&r(e,["instances[0]","image"],function(t,n){const e={};if(void 0!==l(n,["gcsUri"]))throw new Error("gcsUri parameter is not supported in Gemini API.");const o=l(n,["imageBytes"]);null!=o&&r(e,["bytesBase64Encoded"],S(0,o));const i=l(n,["mimeType"]);return null!=i&&r(e,["mimeType"],i),e}(0,s));const u=l(n,["config"]);return null!=u&&r(e,["config"],function(t,n,e){const o=l(n,["numberOfVideos"]);if(void 0!==e&&null!=o&&r(e,["parameters","sampleCount"],o),void 0!==l(n,["outputGcsUri"]))throw new Error("outputGcsUri parameter is not supported in Gemini API.");if(void 0!==l(n,["fps"]))throw new Error("fps parameter is not supported in Gemini API.");const i=l(n,["durationSeconds"]);if(void 0!==e&&null!=i&&r(e,["parameters","durationSeconds"],i),void 0!==l(n,["seed"]))throw new Error("seed parameter is not supported in Gemini API.");const s=l(n,["aspectRatio"]);if(void 0!==e&&null!=s&&r(e,["parameters","aspectRatio"],s),void 0!==l(n,["resolution"]))throw new Error("resolution parameter is not supported in Gemini API.");const a=l(n,["personGeneration"]);if(void 0!==e&&null!=a&&r(e,["parameters","personGeneration"],a),void 0!==l(n,["pubsubTopic"]))throw new Error("pubsubTopic parameter is not supported in Gemini API.");const u=l(n,["negativePrompt"]);if(void 0!==e&&null!=u&&r(e,["parameters","negativePrompt"],u),void 0!==l(n,["enhancePrompt"]))throw new Error("enhancePrompt parameter is not supported in Gemini API.");return {}}(0,u,e)),e}function Yn(t,n){const e={},o=l(n,["parts"]);if(null!=o){let t=o;Array.isArray(t)&&(t=t.map((t=>function(t,n){const e={},o=l(n,["videoMetadata"]);null!=o&&r(e,["videoMetadata"],o);const i=l(n,["thought"]);null!=i&&r(e,["thought"],i);const s=l(n,["codeExecutionResult"]);null!=s&&r(e,["codeExecutionResult"],s);const a=l(n,["executableCode"]);null!=a&&r(e,["executableCode"],a);const u=l(n,["fileData"]);null!=u&&r(e,["fileData"],u);const c=l(n,["functionCall"]);null!=c&&r(e,["functionCall"],c);const d=l(n,["functionResponse"]);null!=d&&r(e,["functionResponse"],d);const p=l(n,["inlineData"]);null!=p&&r(e,["inlineData"],p);const h=l(n,["text"]);return null!=h&&r(e,["text"],h),e}(0,t)))),r(e,["parts"],t);}const i=l(n,["role"]);return null!=i&&r(e,["role"],i),e}function Kn(t,n){const e={},o=l(n,["dynamicRetrievalConfig"]);return null!=o&&r(e,["dynamicRetrievalConfig"],function(t,n){const e={},o=l(n,["mode"]);null!=o&&r(e,["mode"],o);const i=l(n,["dynamicThreshold"]);return null!=i&&r(e,["dynamicThreshold"],i),e}(0,o)),e}function Wn(t,n){const e={},o=l(n,["retrieval"]);null!=o&&r(e,["retrieval"],o);null!=l(n,["googleSearch"])&&r(e,["googleSearch"],{});const i=l(n,["googleSearchRetrieval"]);null!=i&&r(e,["googleSearchRetrieval"],Kn(0,i));const s=l(n,["codeExecution"]);null!=s&&r(e,["codeExecution"],s);const a=l(n,["functionDeclarations"]);return null!=a&&r(e,["functionDeclarations"],a),e}function $n(t,n){const e={},o=l(n,["functionCallingConfig"]);return null!=o&&r(e,["functionCallingConfig"],function(t,n){const e={},o=l(n,["mode"]);null!=o&&r(e,["mode"],o);const i=l(n,["allowedFunctionNames"]);return null!=i&&r(e,["allowedFunctionNames"],i),e}(0,o)),e}function zn(t,n){const e={},o=l(n,["prebuiltVoiceConfig"]);return null!=o&&r(e,["prebuiltVoiceConfig"],function(t,n){const e={},o=l(n,["voiceName"]);return null!=o&&r(e,["voiceName"],o),e}(0,o)),e}function Xn(t,n,e){const o={},i=l(n,["systemInstruction"]);void 0!==e&&null!=i&&r(e,["systemInstruction"],Yn(0,y(0,i)));const s=l(n,["temperature"]);null!=s&&r(o,["temperature"],s);const a=l(n,["topP"]);null!=a&&r(o,["topP"],a);const u=l(n,["topK"]);null!=u&&r(o,["topK"],u);const c=l(n,["candidateCount"]);null!=c&&r(o,["candidateCount"],c);const d=l(n,["maxOutputTokens"]);null!=d&&r(o,["maxOutputTokens"],d);const p=l(n,["stopSequences"]);null!=p&&r(o,["stopSequences"],p);const h=l(n,["responseLogprobs"]);null!=h&&r(o,["responseLogprobs"],h);const f=l(n,["logprobs"]);null!=f&&r(o,["logprobs"],f);const g=l(n,["presencePenalty"]);null!=g&&r(o,["presencePenalty"],g);const m=l(n,["frequencyPenalty"]);null!=m&&r(o,["frequencyPenalty"],m);const v=l(n,["seed"]);null!=v&&r(o,["seed"],v);const E=l(n,["responseMimeType"]);null!=E&&r(o,["responseMimeType"],E);const A=l(n,["responseSchema"]);null!=A&&r(o,["responseSchema"],C(0,A));const S=l(n,["routingConfig"]);null!=S&&r(o,["routingConfig"],S);const b=l(n,["modelSelectionConfig"]);null!=b&&r(o,["modelConfig"],function(t,n){const e={},o=l(n,["featureSelectionPreference"]);return null!=o&&r(e,["featureSelectionPreference"],o),e}(0,b));const w=l(n,["safetySettings"]);if(void 0!==e&&null!=w){let t=w;Array.isArray(t)&&(t=t.map((t=>function(t,n){const e={},o=l(n,["method"]);null!=o&&r(e,["method"],o);const i=l(n,["category"]);null!=i&&r(e,["category"],i);const s=l(n,["threshold"]);return null!=s&&r(e,["threshold"],s),e}(0,t)))),r(e,["safetySettings"],t);}const P=l(n,["tools"]);if(void 0!==e&&null!=P){let t=O(0,P);Array.isArray(t)&&(t=t.map((t=>Wn(0,_(0,t))))),r(e,["tools"],t);}const N=l(n,["toolConfig"]);void 0!==e&&null!=N&&r(e,["toolConfig"],$n(0,N));const R=l(n,["labels"]);void 0!==e&&null!=R&&r(e,["labels"],R);const D=l(n,["cachedContent"]);void 0!==e&&null!=D&&r(e,["cachedContent"],I(t,D));const M=l(n,["responseModalities"]);null!=M&&r(o,["responseModalities"],M);const x=l(n,["mediaResolution"]);null!=x&&r(o,["mediaResolution"],x);const U=l(n,["speechConfig"]);null!=U&&r(o,["speechConfig"],function(t,n){const e={},o=l(n,["voiceConfig"]);null!=o&&r(e,["voiceConfig"],zn(0,o));const i=l(n,["languageCode"]);return null!=i&&r(e,["languageCode"],i),e}(0,T(0,U)));const q=l(n,["audioTimestamp"]);null!=q&&r(o,["audioTimestamp"],q);const L=l(n,["thinkingConfig"]);return null!=L&&r(o,["thinkingConfig"],function(t,n){const e={},o=l(n,["includeThoughts"]);null!=o&&r(e,["includeThoughts"],o);const i=l(n,["thinkingBudget"]);return null!=i&&r(e,["thinkingBudget"],i),e}(0,L)),o}function Zn(t,n){const e={},o=l(n,["model"]);null!=o&&r(e,["_url","model"],a(t,o));const i=l(n,["contents"]);if(null!=i){let t=E(0,i);Array.isArray(t)&&(t=t.map((t=>Yn(0,t)))),r(e,["contents"],t);}const s=l(n,["config"]);return null!=s&&r(e,["generationConfig"],Xn(t,s,e)),e}function Qn(t,n){const e={},o=l(n,["model"]);null!=o&&r(e,["_url","model"],a(t,o));const i=l(n,["contents"]);null!=i&&r(e,["instances[]","content"],v(t,i));const s=l(n,["config"]);return null!=s&&r(e,["config"],function(t,n,e){const o=l(n,["taskType"]);void 0!==e&&null!=o&&r(e,["instances[]","task_type"],o);const i=l(n,["title"]);void 0!==e&&null!=i&&r(e,["instances[]","title"],i);const s=l(n,["outputDimensionality"]);void 0!==e&&null!=s&&r(e,["parameters","outputDimensionality"],s);const a=l(n,["mimeType"]);void 0!==e&&null!=a&&r(e,["instances[]","mimeType"],a);const u=l(n,["autoTruncate"]);return void 0!==e&&null!=u&&r(e,["parameters","autoTruncate"],u),{}}(0,s,e)),e}function te(t,n){const e={},o=l(n,["model"]);null!=o&&r(e,["_url","model"],a(t,o));const i=l(n,["prompt"]);null!=i&&r(e,["instances[0]","prompt"],i);const s=l(n,["config"]);return null!=s&&r(e,["config"],function(t,n,e){const o=l(n,["outputGcsUri"]);void 0!==e&&null!=o&&r(e,["parameters","storageUri"],o);const i=l(n,["negativePrompt"]);void 0!==e&&null!=i&&r(e,["parameters","negativePrompt"],i);const s=l(n,["numberOfImages"]);void 0!==e&&null!=s&&r(e,["parameters","sampleCount"],s);const a=l(n,["aspectRatio"]);void 0!==e&&null!=a&&r(e,["parameters","aspectRatio"],a);const u=l(n,["guidanceScale"]);void 0!==e&&null!=u&&r(e,["parameters","guidanceScale"],u);const c=l(n,["seed"]);void 0!==e&&null!=c&&r(e,["parameters","seed"],c);const d=l(n,["safetyFilterLevel"]);void 0!==e&&null!=d&&r(e,["parameters","safetySetting"],d);const p=l(n,["personGeneration"]);void 0!==e&&null!=p&&r(e,["parameters","personGeneration"],p);const h=l(n,["includeSafetyAttributes"]);void 0!==e&&null!=h&&r(e,["parameters","includeSafetyAttributes"],h);const f=l(n,["includeRaiReason"]);void 0!==e&&null!=f&&r(e,["parameters","includeRaiReason"],f);const g=l(n,["language"]);void 0!==e&&null!=g&&r(e,["parameters","language"],g);const m=l(n,["outputMimeType"]);void 0!==e&&null!=m&&r(e,["parameters","outputOptions","mimeType"],m);const y=l(n,["outputCompressionQuality"]);void 0!==e&&null!=y&&r(e,["parameters","outputOptions","compressionQuality"],y);const v=l(n,["addWatermark"]);void 0!==e&&null!=v&&r(e,["parameters","addWatermark"],v);const E=l(n,["enhancePrompt"]);return void 0!==e&&null!=E&&r(e,["parameters","enhancePrompt"],E),{}}(0,s,e)),e}function ne(t,n){const e={},o=l(n,["model"]);null!=o&&r(e,["_url","model"],a(t,o));const i=l(n,["config"]);return null!=i&&r(e,["config"],function(t,n,e){const o=l(n,["displayName"]);void 0!==e&&null!=o&&r(e,["displayName"],o);const i=l(n,["description"]);return void 0!==e&&null!=i&&r(e,["description"],i),{}}(0,i,e)),e}function ee(t,n){const e={},o=l(n,["model"]);null!=o&&r(e,["_url","model"],a(t,o));const i=l(n,["contents"]);if(null!=i){let t=E(0,i);Array.isArray(t)&&(t=t.map((t=>Yn(0,t)))),r(e,["contents"],t);}const s=l(n,["config"]);return null!=s&&r(e,["config"],function(t,n,e){const o=l(n,["systemInstruction"]);void 0!==e&&null!=o&&r(e,["systemInstruction"],Yn(0,y(0,o)));const i=l(n,["tools"]);if(void 0!==e&&null!=i){let t=i;Array.isArray(t)&&(t=t.map((t=>Wn(0,t)))),r(e,["tools"],t);}const s=l(n,["generationConfig"]);return void 0!==e&&null!=s&&r(e,["generationConfig"],s),{}}(0,s,e)),e}function oe(t,n){const e={},o=l(n,["model"]);null!=o&&r(e,["_url","model"],a(t,o));const i=l(n,["prompt"]);null!=i&&r(e,["instances[0]","prompt"],i);const s=l(n,["image"]);null!=s&&r(e,["instances[0]","image"],function(t,n){const e={},o=l(n,["gcsUri"]);null!=o&&r(e,["gcsUri"],o);const i=l(n,["imageBytes"]);null!=i&&r(e,["bytesBase64Encoded"],S(0,i));const s=l(n,["mimeType"]);return null!=s&&r(e,["mimeType"],s),e}(0,s));const u=l(n,["config"]);return null!=u&&r(e,["config"],function(t,n,e){const o=l(n,["numberOfVideos"]);void 0!==e&&null!=o&&r(e,["parameters","sampleCount"],o);const i=l(n,["outputGcsUri"]);void 0!==e&&null!=i&&r(e,["parameters","storageUri"],i);const s=l(n,["fps"]);void 0!==e&&null!=s&&r(e,["parameters","fps"],s);const a=l(n,["durationSeconds"]);void 0!==e&&null!=a&&r(e,["parameters","durationSeconds"],a);const u=l(n,["seed"]);void 0!==e&&null!=u&&r(e,["parameters","seed"],u);const c=l(n,["aspectRatio"]);void 0!==e&&null!=c&&r(e,["parameters","aspectRatio"],c);const d=l(n,["resolution"]);void 0!==e&&null!=d&&r(e,["parameters","resolution"],d);const p=l(n,["personGeneration"]);void 0!==e&&null!=p&&r(e,["parameters","personGeneration"],p);const h=l(n,["pubsubTopic"]);void 0!==e&&null!=h&&r(e,["parameters","pubsubTopic"],h);const f=l(n,["negativePrompt"]);void 0!==e&&null!=f&&r(e,["parameters","negativePrompt"],f);const g=l(n,["enhancePrompt"]);return void 0!==e&&null!=g&&r(e,["parameters","enhancePrompt"],g),{}}(0,u,e)),e}function ie(t,n){const e={},o=l(n,["parts"]);if(null!=o){let t=o;Array.isArray(t)&&(t=t.map((t=>function(t,n){const e={},o=l(n,["thought"]);null!=o&&r(e,["thought"],o);const i=l(n,["codeExecutionResult"]);null!=i&&r(e,["codeExecutionResult"],i);const s=l(n,["executableCode"]);null!=s&&r(e,["executableCode"],s);const a=l(n,["fileData"]);null!=a&&r(e,["fileData"],a);const u=l(n,["functionCall"]);null!=u&&r(e,["functionCall"],u);const c=l(n,["functionResponse"]);null!=c&&r(e,["functionResponse"],c);const d=l(n,["inlineData"]);null!=d&&r(e,["inlineData"],d);const p=l(n,["text"]);return null!=p&&r(e,["text"],p),e}(0,t)))),r(e,["parts"],t);}const i=l(n,["role"]);return null!=i&&r(e,["role"],i),e}function se(t,n){const e={},o=l(n,["content"]);null!=o&&r(e,["content"],ie(0,o));const i=l(n,["citationMetadata"]);null!=i&&r(e,["citationMetadata"],function(t,n){const e={},o=l(n,["citationSources"]);return null!=o&&r(e,["citations"],o),e}(0,i));const s=l(n,["tokenCount"]);null!=s&&r(e,["tokenCount"],s);const a=l(n,["finishReason"]);null!=a&&r(e,["finishReason"],a);const u=l(n,["avgLogprobs"]);null!=u&&r(e,["avgLogprobs"],u);const c=l(n,["groundingMetadata"]);null!=c&&r(e,["groundingMetadata"],c);const d=l(n,["index"]);null!=d&&r(e,["index"],d);const p=l(n,["logprobsResult"]);null!=p&&r(e,["logprobsResult"],p);const h=l(n,["safetyRatings"]);return null!=h&&r(e,["safetyRatings"],h),e}function re(t,n){const e={},o=l(n,["candidates"]);if(null!=o){let t=o;Array.isArray(t)&&(t=t.map((t=>se(0,t)))),r(e,["candidates"],t);}const i=l(n,["modelVersion"]);null!=i&&r(e,["modelVersion"],i);const s=l(n,["promptFeedback"]);null!=s&&r(e,["promptFeedback"],s);const a=l(n,["usageMetadata"]);return null!=a&&r(e,["usageMetadata"],a),e}function le(t,n){const e={},o=l(n,["embeddings"]);if(null!=o){let t=o;Array.isArray(t)&&(t=t.map((t=>function(t,n){const e={},o=l(n,["values"]);return null!=o&&r(e,["values"],o),e}(0,t)))),r(e,["embeddings"],t);}return null!=l(n,["metadata"])&&r(e,["metadata"],{}),e}function ae(t,n){const e={},o=l(n,["safetyAttributes","categories"]);null!=o&&r(e,["categories"],o);const i=l(n,["safetyAttributes","scores"]);null!=i&&r(e,["scores"],i);const s=l(n,["contentType"]);return null!=s&&r(e,["contentType"],s),e}function ue(t,n){const e={},o=l(n,["_self"]);null!=o&&r(e,["image"],function(t,n){const e={},o=l(n,["bytesBase64Encoded"]);null!=o&&r(e,["imageBytes"],S(0,o));const i=l(n,["mimeType"]);return null!=i&&r(e,["mimeType"],i),e}(0,o));const i=l(n,["raiFilteredReason"]);null!=i&&r(e,["raiFilteredReason"],i);const s=l(n,["_self"]);return null!=s&&r(e,["safetyAttributes"],ae(0,s)),e}function ce(t,n){const e={},o=l(n,["name"]);null!=o&&r(e,["name"],o);const i=l(n,["displayName"]);null!=i&&r(e,["displayName"],i);const s=l(n,["description"]);null!=s&&r(e,["description"],s);const a=l(n,["version"]);null!=a&&r(e,["version"],a);const u=l(n,["_self"]);null!=u&&r(e,["tunedModelInfo"],function(t,n){const e={},o=l(n,["baseModel"]);null!=o&&r(e,["baseModel"],o);const i=l(n,["createTime"]);null!=i&&r(e,["createTime"],i);const s=l(n,["updateTime"]);return null!=s&&r(e,["updateTime"],s),e}(0,u));const c=l(n,["inputTokenLimit"]);null!=c&&r(e,["inputTokenLimit"],c);const d=l(n,["outputTokenLimit"]);null!=d&&r(e,["outputTokenLimit"],d);const p=l(n,["supportedGenerationMethods"]);return null!=p&&r(e,["supportedActions"],p),e}function de(t,n){const e={},o=l(n,["_self"]);return null!=o&&r(e,["video"],function(t,n){const e={},o=l(n,["video","uri"]);null!=o&&r(e,["uri"],o);const i=l(n,["video","encodedVideo"]);null!=i&&r(e,["videoBytes"],S(0,i));const s=l(n,["encoding"]);return null!=s&&r(e,["mimeType"],s),e}(0,o)),e}function pe(t,n){const e={},o=l(n,["name"]);null!=o&&r(e,["name"],o);const i=l(n,["metadata"]);null!=i&&r(e,["metadata"],i);const s=l(n,["done"]);null!=s&&r(e,["done"],s);const a=l(n,["error"]);null!=a&&r(e,["error"],a);const u=l(n,["response","generateVideoResponse"]);return null!=u&&r(e,["response"],function(t,n){const e={},o=l(n,["generatedSamples"]);if(null!=o){let t=o;Array.isArray(t)&&(t=t.map((t=>de(0,t)))),r(e,["generatedVideos"],t);}const i=l(n,["raiMediaFilteredCount"]);null!=i&&r(e,["raiMediaFilteredCount"],i);const s=l(n,["raiMediaFilteredReasons"]);return null!=s&&r(e,["raiMediaFilteredReasons"],s),e}(0,u)),e}function he(t,n){const e={},o=l(n,["parts"]);if(null!=o){let t=o;Array.isArray(t)&&(t=t.map((t=>function(t,n){const e={},o=l(n,["videoMetadata"]);null!=o&&r(e,["videoMetadata"],o);const i=l(n,["thought"]);null!=i&&r(e,["thought"],i);const s=l(n,["codeExecutionResult"]);null!=s&&r(e,["codeExecutionResult"],s);const a=l(n,["executableCode"]);null!=a&&r(e,["executableCode"],a);const u=l(n,["fileData"]);null!=u&&r(e,["fileData"],u);const c=l(n,["functionCall"]);null!=c&&r(e,["functionCall"],c);const d=l(n,["functionResponse"]);null!=d&&r(e,["functionResponse"],d);const p=l(n,["inlineData"]);null!=p&&r(e,["inlineData"],p);const h=l(n,["text"]);return null!=h&&r(e,["text"],h),e}(0,t)))),r(e,["parts"],t);}const i=l(n,["role"]);return null!=i&&r(e,["role"],i),e}function fe(t,n){const e={},o=l(n,["content"]);null!=o&&r(e,["content"],he(0,o));const i=l(n,["citationMetadata"]);null!=i&&r(e,["citationMetadata"],function(t,n){const e={},o=l(n,["citations"]);return null!=o&&r(e,["citations"],o),e}(0,i));const s=l(n,["finishMessage"]);null!=s&&r(e,["finishMessage"],s);const a=l(n,["finishReason"]);null!=a&&r(e,["finishReason"],a);const u=l(n,["avgLogprobs"]);null!=u&&r(e,["avgLogprobs"],u);const c=l(n,["groundingMetadata"]);null!=c&&r(e,["groundingMetadata"],c);const d=l(n,["index"]);null!=d&&r(e,["index"],d);const p=l(n,["logprobsResult"]);null!=p&&r(e,["logprobsResult"],p);const h=l(n,["safetyRatings"]);return null!=h&&r(e,["safetyRatings"],h),e}function ge(t,n){const e={},o=l(n,["candidates"]);if(null!=o){let t=o;Array.isArray(t)&&(t=t.map((t=>fe(0,t)))),r(e,["candidates"],t);}const i=l(n,["createTime"]);null!=i&&r(e,["createTime"],i);const s=l(n,["responseId"]);null!=s&&r(e,["responseId"],s);const a=l(n,["modelVersion"]);null!=a&&r(e,["modelVersion"],a);const u=l(n,["promptFeedback"]);null!=u&&r(e,["promptFeedback"],u);const c=l(n,["usageMetadata"]);return null!=c&&r(e,["usageMetadata"],c),e}function me(t,n){const e={},o=l(n,["values"]);null!=o&&r(e,["values"],o);const i=l(n,["statistics"]);return null!=i&&r(e,["statistics"],function(t,n){const e={},o=l(n,["truncated"]);null!=o&&r(e,["truncated"],o);const i=l(n,["token_count"]);return null!=i&&r(e,["tokenCount"],i),e}(0,i)),e}function ye(t,n){const e={},o=l(n,["predictions[]","embeddings"]);if(null!=o){let t=o;Array.isArray(t)&&(t=t.map((t=>me(0,t)))),r(e,["embeddings"],t);}const i=l(n,["metadata"]);return null!=i&&r(e,["metadata"],function(t,n){const e={},o=l(n,["billableCharacterCount"]);return null!=o&&r(e,["billableCharacterCount"],o),e}(0,i)),e}function ve(t,n){const e={},o=l(n,["safetyAttributes","categories"]);null!=o&&r(e,["categories"],o);const i=l(n,["safetyAttributes","scores"]);null!=i&&r(e,["scores"],i);const s=l(n,["contentType"]);return null!=s&&r(e,["contentType"],s),e}function Ee(t,n){const e={},o=l(n,["_self"]);null!=o&&r(e,["image"],function(t,n){const e={},o=l(n,["gcsUri"]);null!=o&&r(e,["gcsUri"],o);const i=l(n,["bytesBase64Encoded"]);null!=i&&r(e,["imageBytes"],S(0,i));const s=l(n,["mimeType"]);return null!=s&&r(e,["mimeType"],s),e}(0,o));const i=l(n,["raiFilteredReason"]);null!=i&&r(e,["raiFilteredReason"],i);const s=l(n,["_self"]);null!=s&&r(e,["safetyAttributes"],ve(0,s));const a=l(n,["prompt"]);return null!=a&&r(e,["enhancedPrompt"],a),e}function Ce(t,n){const e={},o=l(n,["name"]);null!=o&&r(e,["name"],o);const i=l(n,["displayName"]);null!=i&&r(e,["displayName"],i);const s=l(n,["description"]);null!=s&&r(e,["description"],s);const a=l(n,["versionId"]);null!=a&&r(e,["version"],a);const u=l(n,["deployedModels"]);if(null!=u){let t=u;Array.isArray(t)&&(t=t.map((t=>function(t,n){const e={},o=l(n,["endpoint"]);null!=o&&r(e,["name"],o);const i=l(n,["deployedModelId"]);return null!=i&&r(e,["deployedModelId"],i),e}(0,t)))),r(e,["endpoints"],t);}const c=l(n,["labels"]);null!=c&&r(e,["labels"],c);const d=l(n,["_self"]);return null!=d&&r(e,["tunedModelInfo"],function(t,n){const e={},o=l(n,["labels","google-vertex-llm-tuning-base-model-id"]);null!=o&&r(e,["baseModel"],o);const i=l(n,["createTime"]);null!=i&&r(e,["createTime"],i);const s=l(n,["updateTime"]);return null!=s&&r(e,["updateTime"],s),e}(0,d)),e}function Te(t,n){const e={},o=l(n,["_self"]);return null!=o&&r(e,["video"],function(t,n){const e={},o=l(n,["gcsUri"]);null!=o&&r(e,["uri"],o);const i=l(n,["bytesBase64Encoded"]);null!=i&&r(e,["videoBytes"],S(0,i));const s=l(n,["mimeType"]);return null!=s&&r(e,["mimeType"],s),e}(0,o)),e}function _e(t,n){const e={},o=l(n,["name"]);null!=o&&r(e,["name"],o);const i=l(n,["metadata"]);null!=i&&r(e,["metadata"],i);const s=l(n,["done"]);null!=s&&r(e,["done"],s);const a=l(n,["error"]);null!=a&&r(e,["error"],a);const u=l(n,["response"]);return null!=u&&r(e,["response"],function(t,n){const e={},o=l(n,["videos"]);if(null!=o){let t=o;Array.isArray(t)&&(t=t.map((t=>Te(0,t)))),r(e,["generatedVideos"],t);}const i=l(n,["raiMediaFilteredCount"]);null!=i&&r(e,["raiMediaFilteredCount"],i);const s=l(n,["raiMediaFilteredReasons"]);return null!=s&&r(e,["raiMediaFilteredReasons"],s),e}(0,u)),e}
/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */class Oe{constructor(t,n,e){this.apiClient=t,this.auth=n,this.webSocketFactory=e;}async connect(t){var n,e,o,i;const s=this.apiClient.getWebsocketBaseUrl(),u=this.apiClient.getApiVersion();let c;const d=function(t){const n=new Headers;for(const[e,o]of Object.entries(t))n.append(e,o);return n}
/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */(this.apiClient.getDefaultHeaders());if(this.apiClient.isVertexAI())c=`${s}/ws/google.cloud.aiplatform.${u}.LlmBidiService/BidiGenerateContent`,await this.auth.addAuthHeaders(d);else {c=`${s}/ws/google.ai.generativelanguage.${u}.GenerativeService.BidiGenerateContent?key=${this.apiClient.getApiKey()}`;}let p=()=>{};const h=new Promise((t=>{p=t;})),f=t.callbacks,g=this.apiClient,m={onopen:function(){var t;null===(t=null==f?void 0:f.onopen)||void 0===t||t.call(f),p({});},onmessage:t=>{!async function(t,n,e){let o,i;i=e.data instanceof Blob?JSON.parse(await e.data.text()):JSON.parse(e.data),o=t.isVertexAI()?xn(0,i):Mn(0,i),n(o);}(g,f.onmessage,t);},onerror:null!==(n=null==f?void 0:f.onerror)&&void 0!==n?n:function(t){},onclose:null!==(e=null==f?void 0:f.onclose)&&void 0!==e?e:function(t){}},y=this.webSocketFactory.create(c,function(t){const n={};return t.forEach(((t,e)=>{n[e]=t;})),n}(d),m);y.connect(),await h;let v=a(this.apiClient,t.model);if(this.apiClient.isVertexAI()&&v.startsWith("publishers/")){v=`projects/${this.apiClient.getProject()}/locations/${this.apiClient.getLocation()}/`+v;}let E={};this.apiClient.isVertexAI()&&void 0===(null===(o=t.config)||void 0===o?void 0:o.responseModalities)&&(void 0===t.config?t.config={responseModalities:[nt.AUDIO]}:t.config.responseModalities=[nt.AUDIO]),(null===(i=t.config)||void 0===i?void 0:i.generationConfig)&&console.warn("Setting `LiveConnectConfig.generation_config` is deprecated, please set the fields on `LiveConnectConfig` directly. This will become an error in a future version (not before Q3 2025).");const C={model:v,config:t.config,callbacks:t.callbacks};return E=this.apiClient.isVertexAI()?function(t,n){const e={},o=l(n,["model"]);null!=o&&r(e,["setup","model"],a(t,o));const i=l(n,["config"]);return null!=i&&r(e,["config"],_n(0,i,e)),e}(this.apiClient,C):function(t,n){const e={},o=l(n,["model"]);null!=o&&r(e,["setup","model"],a(t,o));const i=l(n,["config"]);return null!=i&&r(e,["config"],Tn(0,i,e)),e}(this.apiClient,C),delete E.config,y.send(JSON.stringify(E)),new Ae(y,this.apiClient)}}const Ie={turnComplete:true};class Ae{constructor(t,n){this.conn=t,this.apiClient=n;}tLiveClientContent(t,n){if(null!==n.turns&&void 0!==n.turns){let e=[];try{e=E(0,n.turns),e=t.isVertexAI()?e.map((t=>Yn(0,t))):e.map((t=>Un(0,t)));}catch(t){throw new Error(`Failed to parse client content "turns", type: '${typeof n.turns}'`)}return {clientContent:{turns:e,turnComplete:n.turnComplete}}}return {clientContent:{turnComplete:n.turnComplete}}}tLiveClienttToolResponse(t,n){let e=[];if(null==n.functionResponses)throw new Error("functionResponses is required.");if(e=Array.isArray(n.functionResponses)?n.functionResponses:[n.functionResponses],0===e.length)throw new Error("functionResponses is required.");for(const n of e){if("object"!=typeof n||null===n||!("name"in n)||!("response"in n))throw new Error(`Could not parse function response, type '${typeof n}'.`);if(!t.isVertexAI()&&!("id"in n))throw new Error("FunctionResponse request must have an `id` field from the response of a ToolCall.FunctionalCalls in Google AI.")}return {toolResponse:{functionResponses:e}}}sendClientContent(t){t=Object.assign(Object.assign({},Ie),t);const n=this.tLiveClientContent(this.apiClient,t);this.conn.send(JSON.stringify(n));}sendRealtimeInput(t){let n={};n=this.apiClient.isVertexAI()?{realtimeInput:In(this.apiClient,t)}:{realtimeInput:On(this.apiClient,t)},this.conn.send(JSON.stringify(n));}sendToolResponse(t){if(null==t.functionResponses)throw new Error("Tool response parameters are required.");const n=this.tLiveClienttToolResponse(this.apiClient,t);this.conn.send(JSON.stringify(n));}close(){this.conn.close();}}class Se extends i{constructor(t){super(),this.apiClient=t,this.generateContent=async t=>await this.generateContentInternal(t),this.generateContentStream=async t=>await this.generateContentStreamInternal(t),this.generateImages=async t=>await this.generateImagesInternal(t).then((t=>{var n;let e;const o=[];if(null==t?void 0:t.generatedImages)for(const i of t.generatedImages)i&&(null==i?void 0:i.safetyAttributes)&&"Positive Prompt"===(null===(n=null==i?void 0:i.safetyAttributes)||void 0===n?void 0:n.contentType)?e=null==i?void 0:i.safetyAttributes:o.push(i);let i;return i=e?{generatedImages:o,positivePromptSafetyAttributes:e}:{generatedImages:o},i}));}async generateContentInternal(t){var n,e,o,i;let r,l="",a={};if(this.apiClient.isVertexAI()){const o=Zn(this.apiClient,t);return l=s("{model}:generateContent",o._url),a=o._query,delete o.config,delete o._url,delete o._query,r=this.apiClient.request({path:l,queryParams:a,body:JSON.stringify(o),httpMethod:"POST",httpOptions:null===(n=t.config)||void 0===n?void 0:n.httpOptions,abortSignal:null===(e=t.config)||void 0===e?void 0:e.abortSignal}).then((t=>t.json())),r.then((t=>{const n=ge(this.apiClient,t),e=new qt;return Object.assign(e,n),e}))}{const n=Vn(this.apiClient,t);return l=s("{model}:generateContent",n._url),a=n._query,delete n.config,delete n._url,delete n._query,r=this.apiClient.request({path:l,queryParams:a,body:JSON.stringify(n),httpMethod:"POST",httpOptions:null===(o=t.config)||void 0===o?void 0:o.httpOptions,abortSignal:null===(i=t.config)||void 0===i?void 0:i.abortSignal}).then((t=>t.json())),r.then((t=>{const n=re(this.apiClient,t),e=new qt;return Object.assign(e,n),e}))}}async generateContentStreamInternal(t){var n,e,o,i;let r,l="",a={};if(this.apiClient.isVertexAI()){const o=Zn(this.apiClient,t);l=s("{model}:streamGenerateContent?alt=sse",o._url),a=o._query,delete o.config,delete o._url,delete o._query;const i=this.apiClient;return r=i.requestStream({path:l,queryParams:a,body:JSON.stringify(o),httpMethod:"POST",httpOptions:null===(n=t.config)||void 0===n?void 0:n.httpOptions,abortSignal:null===(e=t.config)||void 0===e?void 0:e.abortSignal}),r.then((function(t){return en(this,arguments,(function*(){var n,e,o,i;try{for(var s,r=!0,l=on(t);!(n=(s=yield nn(l.next())).done);r=!0){i=s.value,r=!1;const t=i,n=ge(0,yield nn(t.json())),e=new qt;Object.assign(e,n),yield yield nn(e);}}catch(t){e={error:t};}finally{try{r||n||!(o=l.return)||(yield nn(o.call(l)));}finally{if(e)throw e.error}}}))}))}{const n=Vn(this.apiClient,t);l=s("{model}:streamGenerateContent?alt=sse",n._url),a=n._query,delete n.config,delete n._url,delete n._query;const e=this.apiClient;return r=e.requestStream({path:l,queryParams:a,body:JSON.stringify(n),httpMethod:"POST",httpOptions:null===(o=t.config)||void 0===o?void 0:o.httpOptions,abortSignal:null===(i=t.config)||void 0===i?void 0:i.abortSignal}),r.then((function(t){return en(this,arguments,(function*(){var n,e,o,i;try{for(var s,r=!0,l=on(t);!(n=(s=yield nn(l.next())).done);r=!0){i=s.value,r=!1;const t=i,n=re(0,yield nn(t.json())),e=new qt;Object.assign(e,n),yield yield nn(e);}}catch(t){e={error:t};}finally{try{r||n||!(o=l.return)||(yield nn(o.call(l)));}finally{if(e)throw e.error}}}))}))}}async embedContent(t){var n,e,o,i;let r,l="",a={};if(this.apiClient.isVertexAI()){const o=Qn(this.apiClient,t);return l=s("{model}:predict",o._url),a=o._query,delete o.config,delete o._url,delete o._query,r=this.apiClient.request({path:l,queryParams:a,body:JSON.stringify(o),httpMethod:"POST",httpOptions:null===(n=t.config)||void 0===n?void 0:n.httpOptions,abortSignal:null===(e=t.config)||void 0===e?void 0:e.abortSignal}).then((t=>t.json())),r.then((t=>{const n=ye(this.apiClient,t),e=new Lt;return Object.assign(e,n),e}))}{const n=jn(this.apiClient,t);return l=s("{model}:batchEmbedContents",n._url),a=n._query,delete n.config,delete n._url,delete n._query,r=this.apiClient.request({path:l,queryParams:a,body:JSON.stringify(n),httpMethod:"POST",httpOptions:null===(o=t.config)||void 0===o?void 0:o.httpOptions,abortSignal:null===(i=t.config)||void 0===i?void 0:i.abortSignal}).then((t=>t.json())),r.then((t=>{const n=le(this.apiClient,t),e=new Lt;return Object.assign(e,n),e}))}}async generateImagesInternal(t){var n,e,o,i;let a,u="",c={};if(this.apiClient.isVertexAI()){const o=te(this.apiClient,t);return u=s("{model}:predict",o._url),c=o._query,delete o.config,delete o._url,delete o._query,a=this.apiClient.request({path:u,queryParams:c,body:JSON.stringify(o),httpMethod:"POST",httpOptions:null===(n=t.config)||void 0===n?void 0:n.httpOptions,abortSignal:null===(e=t.config)||void 0===e?void 0:e.abortSignal}).then((t=>t.json())),a.then((t=>{const n=function(t,n){const e={},o=l(n,["predictions"]);if(null!=o){let t=o;Array.isArray(t)&&(t=t.map((t=>Ee(0,t)))),r(e,["generatedImages"],t);}const i=l(n,["positivePromptSafetyAttributes"]);return null!=i&&r(e,["positivePromptSafetyAttributes"],ve(0,i)),e}(this.apiClient,t),e=new Gt;return Object.assign(e,n),e}))}{const n=Fn(this.apiClient,t);return u=s("{model}:predict",n._url),c=n._query,delete n.config,delete n._url,delete n._query,a=this.apiClient.request({path:u,queryParams:c,body:JSON.stringify(n),httpMethod:"POST",httpOptions:null===(o=t.config)||void 0===o?void 0:o.httpOptions,abortSignal:null===(i=t.config)||void 0===i?void 0:i.abortSignal}).then((t=>t.json())),a.then((t=>{const n=function(t,n){const e={},o=l(n,["predictions"]);if(null!=o){let t=o;Array.isArray(t)&&(t=t.map((t=>ue(0,t)))),r(e,["generatedImages"],t);}const i=l(n,["positivePromptSafetyAttributes"]);return null!=i&&r(e,["positivePromptSafetyAttributes"],ae(0,i)),e}(this.apiClient,t),e=new Gt;return Object.assign(e,n),e}))}}async get(t){var n,e,o,i;let u,c="",d={};if(this.apiClient.isVertexAI()){const o=function(t,n){const e={},o=l(n,["model"]);null!=o&&r(e,["_url","name"],a(t,o));const i=l(n,["config"]);return null!=i&&r(e,["config"],i),e}(this.apiClient,t);return c=s("{name}",o._url),d=o._query,delete o.config,delete o._url,delete o._query,u=this.apiClient.request({path:c,queryParams:d,body:JSON.stringify(o),httpMethod:"GET",httpOptions:null===(n=t.config)||void 0===n?void 0:n.httpOptions,abortSignal:null===(e=t.config)||void 0===e?void 0:e.abortSignal}).then((t=>t.json())),u.then((t=>Ce(this.apiClient,t)))}{const n=function(t,n){const e={},o=l(n,["model"]);null!=o&&r(e,["_url","name"],a(t,o));const i=l(n,["config"]);return null!=i&&r(e,["config"],i),e}(this.apiClient,t);return c=s("{name}",n._url),d=n._query,delete n.config,delete n._url,delete n._query,u=this.apiClient.request({path:c,queryParams:d,body:JSON.stringify(n),httpMethod:"GET",httpOptions:null===(o=t.config)||void 0===o?void 0:o.httpOptions,abortSignal:null===(i=t.config)||void 0===i?void 0:i.abortSignal}).then((t=>t.json())),u.then((t=>ce(this.apiClient,t)))}}async update(t){var n,e,o,i;let r,l="",a={};if(this.apiClient.isVertexAI()){const o=ne(this.apiClient,t);return l=s("{model}",o._url),a=o._query,delete o.config,delete o._url,delete o._query,r=this.apiClient.request({path:l,queryParams:a,body:JSON.stringify(o),httpMethod:"PATCH",httpOptions:null===(n=t.config)||void 0===n?void 0:n.httpOptions,abortSignal:null===(e=t.config)||void 0===e?void 0:e.abortSignal}).then((t=>t.json())),r.then((t=>Ce(this.apiClient,t)))}{const n=Bn(this.apiClient,t);return l=s("{name}",n._url),a=n._query,delete n.config,delete n._url,delete n._query,r=this.apiClient.request({path:l,queryParams:a,body:JSON.stringify(n),httpMethod:"PATCH",httpOptions:null===(o=t.config)||void 0===o?void 0:o.httpOptions,abortSignal:null===(i=t.config)||void 0===i?void 0:i.abortSignal}).then((t=>t.json())),r.then((t=>ce(this.apiClient,t)))}}async delete(t){var n,e,o,i;let u,c="",d={};if(this.apiClient.isVertexAI()){const o=function(t,n){const e={},o=l(n,["model"]);null!=o&&r(e,["_url","name"],a(t,o));const i=l(n,["config"]);return null!=i&&r(e,["config"],i),e}(this.apiClient,t);return c=s("{name}",o._url),d=o._query,delete o.config,delete o._url,delete o._query,u=this.apiClient.request({path:c,queryParams:d,body:JSON.stringify(o),httpMethod:"DELETE",httpOptions:null===(n=t.config)||void 0===n?void 0:n.httpOptions,abortSignal:null===(e=t.config)||void 0===e?void 0:e.abortSignal}).then((t=>t.json())),u.then((()=>{const t={},n=new kt;return Object.assign(n,t),n}))}{const n=function(t,n){const e={},o=l(n,["model"]);null!=o&&r(e,["_url","name"],a(t,o));const i=l(n,["config"]);return null!=i&&r(e,["config"],i),e}(this.apiClient,t);return c=s("{name}",n._url),d=n._query,delete n.config,delete n._url,delete n._query,u=this.apiClient.request({path:c,queryParams:d,body:JSON.stringify(n),httpMethod:"DELETE",httpOptions:null===(o=t.config)||void 0===o?void 0:o.httpOptions,abortSignal:null===(i=t.config)||void 0===i?void 0:i.abortSignal}).then((t=>t.json())),u.then((()=>{const t={},n=new kt;return Object.assign(n,t),n}))}}async countTokens(t){var n,e,o,i;let a,u="",c={};if(this.apiClient.isVertexAI()){const o=ee(this.apiClient,t);return u=s("{model}:countTokens",o._url),c=o._query,delete o.config,delete o._url,delete o._query,a=this.apiClient.request({path:u,queryParams:c,body:JSON.stringify(o),httpMethod:"POST",httpOptions:null===(n=t.config)||void 0===n?void 0:n.httpOptions,abortSignal:null===(e=t.config)||void 0===e?void 0:e.abortSignal}).then((t=>t.json())),a.then((t=>{const n=function(t,n){const e={},o=l(n,["totalTokens"]);return null!=o&&r(e,["totalTokens"],o),e}(this.apiClient,t),e=new Vt;return Object.assign(e,n),e}))}{const n=Hn(this.apiClient,t);return u=s("{model}:countTokens",n._url),c=n._query,delete n.config,delete n._url,delete n._query,a=this.apiClient.request({path:u,queryParams:c,body:JSON.stringify(n),httpMethod:"POST",httpOptions:null===(o=t.config)||void 0===o?void 0:o.httpOptions,abortSignal:null===(i=t.config)||void 0===i?void 0:i.abortSignal}).then((t=>t.json())),a.then((t=>{const n=function(t,n){const e={},o=l(n,["totalTokens"]);null!=o&&r(e,["totalTokens"],o);const i=l(n,["cachedContentTokenCount"]);return null!=i&&r(e,["cachedContentTokenCount"],i),e}(this.apiClient,t),e=new Vt;return Object.assign(e,n),e}))}}async computeTokens(t){var n,e;let o,i="",u={};if(this.apiClient.isVertexAI()){const c=function(t,n){const e={},o=l(n,["model"]);null!=o&&r(e,["_url","model"],a(t,o));const i=l(n,["contents"]);if(null!=i){let t=E(0,i);Array.isArray(t)&&(t=t.map((t=>Yn(0,t)))),r(e,["contents"],t);}const s=l(n,["config"]);return null!=s&&r(e,["config"],s),e}(this.apiClient,t);return i=s("{model}:computeTokens",c._url),u=c._query,delete c.config,delete c._url,delete c._query,o=this.apiClient.request({path:i,queryParams:u,body:JSON.stringify(c),httpMethod:"POST",httpOptions:null===(n=t.config)||void 0===n?void 0:n.httpOptions,abortSignal:null===(e=t.config)||void 0===e?void 0:e.abortSignal}).then((t=>t.json())),o.then((t=>{const n=function(t,n){const e={},o=l(n,["tokensInfo"]);return null!=o&&r(e,["tokensInfo"],o),e}(this.apiClient,t),e=new jt;return Object.assign(e,n),e}))}throw new Error("This method is only supported by the Vertex AI.")}async generateVideos(t){var n,e,o,i;let r,l="",a={};if(this.apiClient.isVertexAI()){const o=oe(this.apiClient,t);return l=s("{model}:predictLongRunning",o._url),a=o._query,delete o.config,delete o._url,delete o._query,r=this.apiClient.request({path:l,queryParams:a,body:JSON.stringify(o),httpMethod:"POST",httpOptions:null===(n=t.config)||void 0===n?void 0:n.httpOptions,abortSignal:null===(e=t.config)||void 0===e?void 0:e.abortSignal}).then((t=>t.json())),r.then((t=>_e(this.apiClient,t)))}{const n=Jn(this.apiClient,t);return l=s("{model}:predictLongRunning",n._url),a=n._query,delete n.config,delete n._url,delete n._query,r=this.apiClient.request({path:l,queryParams:a,body:JSON.stringify(n),httpMethod:"POST",httpOptions:null===(o=t.config)||void 0===o?void 0:o.httpOptions,abortSignal:null===(i=t.config)||void 0===i?void 0:i.abortSignal}).then((t=>t.json())),r.then((t=>pe(this.apiClient,t)))}}}
/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */function be(t,n){const e={},o=l(n,["_self"]);return null!=o&&r(e,["video"],function(t,n){const e={},o=l(n,["video","uri"]);null!=o&&r(e,["uri"],o);const i=l(n,["video","encodedVideo"]);null!=i&&r(e,["videoBytes"],S(0,i));const s=l(n,["encoding"]);return null!=s&&r(e,["mimeType"],s),e}(0,o)),e}function we(t,n){const e={},o=l(n,["name"]);null!=o&&r(e,["name"],o);const i=l(n,["metadata"]);null!=i&&r(e,["metadata"],i);const s=l(n,["done"]);null!=s&&r(e,["done"],s);const a=l(n,["error"]);null!=a&&r(e,["error"],a);const u=l(n,["response","generateVideoResponse"]);return null!=u&&r(e,["response"],function(t,n){const e={},o=l(n,["generatedSamples"]);if(null!=o){let t=o;Array.isArray(t)&&(t=t.map((t=>be(0,t)))),r(e,["generatedVideos"],t);}const i=l(n,["raiMediaFilteredCount"]);null!=i&&r(e,["raiMediaFilteredCount"],i);const s=l(n,["raiMediaFilteredReasons"]);return null!=s&&r(e,["raiMediaFilteredReasons"],s),e}(0,u)),e}function Pe(t,n){const e={},o=l(n,["_self"]);return null!=o&&r(e,["video"],function(t,n){const e={},o=l(n,["gcsUri"]);null!=o&&r(e,["uri"],o);const i=l(n,["bytesBase64Encoded"]);null!=i&&r(e,["videoBytes"],S(0,i));const s=l(n,["mimeType"]);return null!=s&&r(e,["mimeType"],s),e}(0,o)),e}function Ne(t,n){const e={},o=l(n,["name"]);null!=o&&r(e,["name"],o);const i=l(n,["metadata"]);null!=i&&r(e,["metadata"],i);const s=l(n,["done"]);null!=s&&r(e,["done"],s);const a=l(n,["error"]);null!=a&&r(e,["error"],a);const u=l(n,["response"]);return null!=u&&r(e,["response"],function(t,n){const e={},o=l(n,["videos"]);if(null!=o){let t=o;Array.isArray(t)&&(t=t.map((t=>Pe(0,t)))),r(e,["generatedVideos"],t);}const i=l(n,["raiMediaFilteredCount"]);null!=i&&r(e,["raiMediaFilteredCount"],i);const s=l(n,["raiMediaFilteredReasons"]);return null!=s&&r(e,["raiMediaFilteredReasons"],s),e}(0,u)),e}
/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */class Re extends i{constructor(t){super(),this.apiClient=t;}async getVideosOperation(t){const n=t.operation,e=t.config;if(void 0===n.name||""===n.name)throw new Error("Operation name is required.");if(this.apiClient.isVertexAI()){const t=n.name.split("/operations/")[0];let o;return e&&"httpOptions"in e&&(o=e.httpOptions),this.fetchPredictVideosOperationInternal({operationName:n.name,resourceName:t,config:{httpOptions:o}})}return this.getVideosOperationInternal({operationName:n.name,config:e})}async getVideosOperationInternal(t){var n,e,o,i;let a,u="",c={};if(this.apiClient.isVertexAI()){const o=function(t,n){const e={},o=l(n,["operationName"]);null!=o&&r(e,["_url","operationName"],o);const i=l(n,["config"]);return null!=i&&r(e,["config"],i),e}(this.apiClient,t);return u=s("{operationName}",o._url),c=o._query,delete o.config,delete o._url,delete o._query,a=this.apiClient.request({path:u,queryParams:c,body:JSON.stringify(o),httpMethod:"GET",httpOptions:null===(n=t.config)||void 0===n?void 0:n.httpOptions,abortSignal:null===(e=t.config)||void 0===e?void 0:e.abortSignal}).then((t=>t.json())),a.then((t=>Ne(this.apiClient,t)))}{const n=function(t,n){const e={},o=l(n,["operationName"]);null!=o&&r(e,["_url","operationName"],o);const i=l(n,["config"]);return null!=i&&r(e,["config"],i),e}(this.apiClient,t);return u=s("{operationName}",n._url),c=n._query,delete n.config,delete n._url,delete n._query,a=this.apiClient.request({path:u,queryParams:c,body:JSON.stringify(n),httpMethod:"GET",httpOptions:null===(o=t.config)||void 0===o?void 0:o.httpOptions,abortSignal:null===(i=t.config)||void 0===i?void 0:i.abortSignal}).then((t=>t.json())),a.then((t=>we(this.apiClient,t)))}}async fetchPredictVideosOperationInternal(t){var n,e;let o,i="",a={};if(this.apiClient.isVertexAI()){const u=function(t,n){const e={},o=l(n,["operationName"]);null!=o&&r(e,["operationName"],o);const i=l(n,["resourceName"]);null!=i&&r(e,["_url","resourceName"],i);const s=l(n,["config"]);return null!=s&&r(e,["config"],s),e}(this.apiClient,t);return i=s("{resourceName}:fetchPredictOperation",u._url),a=u._query,delete u.config,delete u._url,delete u._query,o=this.apiClient.request({path:i,queryParams:a,body:JSON.stringify(u),httpMethod:"POST",httpOptions:null===(n=t.config)||void 0===n?void 0:n.httpOptions,abortSignal:null===(e=t.config)||void 0===e?void 0:e.abortSignal}).then((t=>t.json())),o.then((t=>Ne(this.apiClient,t)))}throw new Error("This method is only supported by the Vertex AI.")}}
/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */const De=/^data: (.*)(?:\n\n|\r\r|\r\n\r\n)/;class Me extends Error{constructor(t,n){super(t,n?{cause:n}:{cause:(new Error).stack}),this.message=t,this.name="ClientError";}}class xe extends Error{constructor(t,n){super(t,n?{cause:n}:{cause:(new Error).stack}),this.message=t,this.name="ServerError";}}class Ue{constructor(t){var n,e;this.clientOptions=Object.assign(Object.assign({},t),{project:t.project,location:t.location,apiKey:t.apiKey,vertexai:t.vertexai});const o={};this.clientOptions.vertexai?(o.apiVersion=null!==(n=this.clientOptions.apiVersion)&&void 0!==n?n:"v1beta1",this.getProject()||this.getLocation()?(o.baseUrl=`https://${this.clientOptions.location}-aiplatform.googleapis.com/`,this.clientOptions.apiKey=void 0):(o.baseUrl="https://aiplatform.googleapis.com/",this.clientOptions.project=void 0,this.clientOptions.location=void 0)):(o.apiVersion=null!==(e=this.clientOptions.apiVersion)&&void 0!==e?e:"v1beta",o.baseUrl="https://generativelanguage.googleapis.com/"),o.headers=this.getDefaultHeaders(),this.clientOptions.httpOptions=o,t.httpOptions&&(this.clientOptions.httpOptions=this.patchHttpOptions(o,t.httpOptions));}isVertexAI(){var t;return null!==(t=this.clientOptions.vertexai)&&void 0!==t&&t}getProject(){return this.clientOptions.project}getLocation(){return this.clientOptions.location}getApiVersion(){if(this.clientOptions.httpOptions&&void 0!==this.clientOptions.httpOptions.apiVersion)return this.clientOptions.httpOptions.apiVersion;throw new Error("API version is not set.")}getBaseUrl(){if(this.clientOptions.httpOptions&&void 0!==this.clientOptions.httpOptions.baseUrl)return this.clientOptions.httpOptions.baseUrl;throw new Error("Base URL is not set.")}getRequestUrl(){return this.getRequestUrlInternal(this.clientOptions.httpOptions)}getHeaders(){if(this.clientOptions.httpOptions&&void 0!==this.clientOptions.httpOptions.headers)return this.clientOptions.httpOptions.headers;throw new Error("Headers are not set.")}getRequestUrlInternal(t){if(!t||void 0===t.baseUrl||void 0===t.apiVersion)throw new Error("HTTP options are not correctly set.");const n=[t.baseUrl.endsWith("/")?t.baseUrl.slice(0,-1):t.baseUrl];return t.apiVersion&&""!==t.apiVersion&&n.push(t.apiVersion),n.join("/")}getBaseResourcePath(){return `projects/${this.clientOptions.project}/locations/${this.clientOptions.location}`}getApiKey(){return this.clientOptions.apiKey}getWebsocketBaseUrl(){const t=this.getBaseUrl(),n=new URL(t);return n.protocol="http:"==n.protocol?"ws":"wss",n.toString()}setBaseUrl(t){if(!this.clientOptions.httpOptions)throw new Error("HTTP options are not correctly set.");this.clientOptions.httpOptions.baseUrl=t;}constructUrl(t,n,e){const o=[this.getRequestUrlInternal(n)];e&&o.push(this.getBaseResourcePath()),""!==t&&o.push(t);return new URL(`${o.join("/")}`)}shouldPrependVertexProjectPath(t){return !this.clientOptions.apiKey&&(!!this.clientOptions.vertexai&&(!t.path.startsWith("projects/")&&("GET"!==t.httpMethod||!t.path.startsWith("publishers/google/models"))))}async request(t){let n=this.clientOptions.httpOptions;t.httpOptions&&(n=this.patchHttpOptions(this.clientOptions.httpOptions,t.httpOptions));const e=this.shouldPrependVertexProjectPath(t),o=this.constructUrl(t.path,n,e);if(t.queryParams)for(const[n,e]of Object.entries(t.queryParams))o.searchParams.append(n,String(e));let i={};if("GET"===t.httpMethod){if(t.body&&"{}"!==t.body)throw new Error("Request body should be empty for GET request, but got non empty request body")}else i.body=t.body;return i=await this.includeExtraHttpOptionsToRequestInit(i,n,t.abortSignal),this.unaryApiCall(o,i,t.httpMethod)}patchHttpOptions(t,n){const e=JSON.parse(JSON.stringify(t));for(const[t,o]of Object.entries(n))"object"==typeof o?e[t]=Object.assign(Object.assign({},e[t]),o):void 0!==o&&(e[t]=o);return e}async requestStream(t){let n=this.clientOptions.httpOptions;t.httpOptions&&(n=this.patchHttpOptions(this.clientOptions.httpOptions,t.httpOptions));const e=this.shouldPrependVertexProjectPath(t),o=this.constructUrl(t.path,n,e);o.searchParams.has("alt")&&"sse"===o.searchParams.get("alt")||o.searchParams.set("alt","sse");let i={};return i.body=t.body,i=await this.includeExtraHttpOptionsToRequestInit(i,n,t.abortSignal),this.streamApiCall(o,i,t.httpMethod)}async includeExtraHttpOptionsToRequestInit(t,n,e){if(n&&n.timeout||e){const o=new AbortController,i=o.signal;n.timeout&&(null==n?void 0:n.timeout)>0&&setTimeout((()=>o.abort()),n.timeout),e&&e.addEventListener("abort",(()=>{o.abort();})),t.signal=i;}return t.headers=await this.getHeadersInternal(n),t}async unaryApiCall(t,n,e){return this.apiCall(t.toString(),Object.assign(Object.assign({},n),{method:e})).then((async t=>(await qe(t),new Kt(t)))).catch((t=>{throw t instanceof Error?t:new Error(JSON.stringify(t))}))}async streamApiCall(t,n,e){return this.apiCall(t.toString(),Object.assign(Object.assign({},n),{method:e})).then((async t=>(await qe(t),this.processStreamResponse(t)))).catch((t=>{throw t instanceof Error?t:new Error(JSON.stringify(t))}))}processStreamResponse(t){var n;return en(this,arguments,(function*(){const e=null===(n=null==t?void 0:t.body)||void 0===n?void 0:n.getReader(),o=new TextDecoder("utf-8");if(!e)throw new Error("Response body is empty");try{let n="";for(;;){const{done:i,value:s}=yield nn(e.read());if(i){if(n.trim().length>0)throw new Error("Incomplete JSON segment at the end");break}const r=o.decode(s);try{const t=JSON.parse(r);if("error"in t){const n=JSON.parse(JSON.stringify(t.error)),e=n.status,o=n.code,i=`got status: ${e}. ${JSON.stringify(t)}`;if(o>=400&&o<500){throw new Me(i)}if(o>=500&&o<600){throw new xe(i)}}}catch(t){const n=t;if("ClientError"===n.name||"ServerError"===n.name)throw t}n+=r;let l=n.match(De);for(;l;){const e=l[1];try{const o=new Response(e,{headers:null==t?void 0:t.headers,status:null==t?void 0:t.status,statusText:null==t?void 0:t.statusText});yield yield nn(new Kt(o)),n=n.slice(l[0].length),l=n.match(De);}catch(t){throw new Error(`exception parsing stream chunk ${e}. ${t}`)}}}}finally{e.releaseLock();}}))}async apiCall(t,n){return fetch(t,n).catch((t=>{throw new Error(`exception ${t} sending request`)}))}getDefaultHeaders(){const t={},n="google-genai-sdk/0.12.0 "+this.clientOptions.userAgentExtra;return t["User-Agent"]=n,t["x-goog-api-client"]=n,t["Content-Type"]="application/json",t}async getHeadersInternal(t){const n=new Headers;if(t&&t.headers){for(const[e,o]of Object.entries(t.headers))n.append(e,o);t.timeout&&t.timeout>0&&n.append("X-Server-Timeout",String(Math.ceil(t.timeout/1e3)));}return await this.clientOptions.auth.addAuthHeaders(n),n}async uploadFile(t,n){var e;const o={};null!=n&&(o.mimeType=n.mimeType,o.name=n.name,o.displayName=n.displayName),o.name&&!o.name.startsWith("files/")&&(o.name=`files/${o.name}`);const i=this.clientOptions.uploader,s=await i.stat(t);o.sizeBytes=String(s.size);const r=null!==(e=null==n?void 0:n.mimeType)&&void 0!==e?e:s.type;if(void 0===r||""===r)throw new Error("Can not determine mimeType. Please provide mimeType in the config.");o.mimeType=r;const l=await this.fetchUploadUrl(o,n);return i.upload(t,l,this)}async fetchUploadUrl(t,n){var e;let o={};o=(null==n?void 0:n.httpOptions)?n.httpOptions:{apiVersion:"",headers:{"Content-Type":"application/json","X-Goog-Upload-Protocol":"resumable","X-Goog-Upload-Command":"start","X-Goog-Upload-Header-Content-Length":`${t.sizeBytes}`,"X-Goog-Upload-Header-Content-Type":`${t.mimeType}`}};const i={file:t},r=await this.request({path:s("upload/v1beta/files",i._url),body:JSON.stringify(i),httpMethod:"POST",httpOptions:o});if(!r||!(null==r?void 0:r.headers))throw new Error("Server did not return an HttpResponse or the returned HttpResponse did not have headers.");const l=null===(e=null==r?void 0:r.headers)||void 0===e?void 0:e["x-goog-upload-url"];if(void 0===l)throw new Error("Failed to get upload url. Server did not return the x-google-upload-url in the headers");return l}}async function qe(t){var n;if(void 0===t)throw new xe("response is undefined");if(!t.ok){const e=t.status,o=t.statusText;let i;i=(null===(n=t.headers.get("content-type"))||void 0===n?void 0:n.includes("application/json"))?await t.json():{error:{message:await t.text(),code:t.status,status:t.statusText}};const s=`got status: ${e} ${o}. ${JSON.stringify(i)}`;if(e>=400&&e<500){throw new Me(s)}if(e>=500&&e<600){throw new xe(s)}throw new Error(s)}}
/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */function Le(t,n){const e={},o=l(n,["config"]);return null!=o&&r(e,["config"],function(t,n,e){const o=l(n,["pageSize"]);void 0!==e&&null!=o&&r(e,["_query","pageSize"],o);const i=l(n,["pageToken"]);void 0!==e&&null!=i&&r(e,["_query","pageToken"],i);const s=l(n,["filter"]);return void 0!==e&&null!=s&&r(e,["_query","filter"],s),{}}(0,o,e)),e}function Ge(t,n){const e={};if(void 0!==l(n,["gcsUri"]))throw new Error("gcsUri parameter is not supported in Gemini API.");const o=l(n,["examples"]);if(null!=o){let t=o;Array.isArray(t)&&(t=t.map((t=>function(t,n){const e={},o=l(n,["textInput"]);null!=o&&r(e,["textInput"],o);const i=l(n,["output"]);return null!=i&&r(e,["output"],i),e}(0,t)))),r(e,["examples","examples"],t);}return e}function ke(t,n){const e={},o=l(n,["baseModel"]);null!=o&&r(e,["baseModel"],o);const i=l(n,["trainingDataset"]);null!=i&&r(e,["tuningTask","trainingData"],Ge(0,i));const s=l(n,["config"]);return null!=s&&r(e,["config"],function(t,n,e){const o={};if(void 0!==l(n,["validationDataset"]))throw new Error("validationDataset parameter is not supported in Gemini API.");const i=l(n,["tunedModelDisplayName"]);if(void 0!==e&&null!=i&&r(e,["displayName"],i),void 0!==l(n,["description"]))throw new Error("description parameter is not supported in Gemini API.");const s=l(n,["epochCount"]);void 0!==e&&null!=s&&r(e,["tuningTask","hyperparameters","epochCount"],s);const a=l(n,["learningRateMultiplier"]);if(null!=a&&r(o,["tuningTask","hyperparameters","learningRateMultiplier"],a),void 0!==l(n,["adapterSize"]))throw new Error("adapterSize parameter is not supported in Gemini API.");const u=l(n,["batchSize"]);void 0!==e&&null!=u&&r(e,["tuningTask","hyperparameters","batchSize"],u);const c=l(n,["learningRate"]);return void 0!==e&&null!=c&&r(e,["tuningTask","hyperparameters","learningRate"],c),o}(0,s,e)),e}function Ve(t,n){const e={},o=l(n,["config"]);return null!=o&&r(e,["config"],function(t,n,e){const o=l(n,["pageSize"]);void 0!==e&&null!=o&&r(e,["_query","pageSize"],o);const i=l(n,["pageToken"]);void 0!==e&&null!=i&&r(e,["_query","pageToken"],i);const s=l(n,["filter"]);return void 0!==e&&null!=s&&r(e,["_query","filter"],s),{}}(0,o,e)),e}function je(t,n,e){const o=l(n,["validationDataset"]);void 0!==e&&null!=o&&r(e,["supervisedTuningSpec"],function(t,n){const e={},o=l(n,["gcsUri"]);return null!=o&&r(e,["validationDatasetUri"],o),e}(0,o));const i=l(n,["tunedModelDisplayName"]);void 0!==e&&null!=i&&r(e,["tunedModelDisplayName"],i);const s=l(n,["description"]);void 0!==e&&null!=s&&r(e,["description"],s);const a=l(n,["epochCount"]);void 0!==e&&null!=a&&r(e,["supervisedTuningSpec","hyperParameters","epochCount"],a);const u=l(n,["learningRateMultiplier"]);void 0!==e&&null!=u&&r(e,["supervisedTuningSpec","hyperParameters","learningRateMultiplier"],u);const c=l(n,["adapterSize"]);if(void 0!==e&&null!=c&&r(e,["supervisedTuningSpec","hyperParameters","adapterSize"],c),void 0!==l(n,["batchSize"]))throw new Error("batchSize parameter is not supported in Vertex AI.");if(void 0!==l(n,["learningRate"]))throw new Error("learningRate parameter is not supported in Vertex AI.");return {}}function Fe(t,n){const e={},o=l(n,["baseModel"]);null!=o&&r(e,["baseModel"],o);const i=l(n,["trainingDataset"]);null!=i&&r(e,["supervisedTuningSpec","trainingDatasetUri"],function(t,n,e){const o=l(n,["gcsUri"]);if(void 0!==e&&null!=o&&r(e,["supervisedTuningSpec","trainingDatasetUri"],o),void 0!==l(n,["examples"]))throw new Error("examples parameter is not supported in Vertex AI.");return {}}(0,i,e));const s=l(n,["config"]);return null!=s&&r(e,["config"],je(0,s,e)),e}function Be(t,n){const e={},o=l(n,["name"]);null!=o&&r(e,["name"],o);const i=l(n,["state"]);null!=i&&r(e,["state"],A(0,i));const s=l(n,["createTime"]);null!=s&&r(e,["createTime"],s);const a=l(n,["tuningTask","startTime"]);null!=a&&r(e,["startTime"],a);const u=l(n,["tuningTask","completeTime"]);null!=u&&r(e,["endTime"],u);const c=l(n,["updateTime"]);null!=c&&r(e,["updateTime"],c);const d=l(n,["description"]);null!=d&&r(e,["description"],d);const p=l(n,["baseModel"]);null!=p&&r(e,["baseModel"],p);const h=l(n,["_self"]);null!=h&&r(e,["tunedModel"],function(t,n){const e={},o=l(n,["name"]);null!=o&&r(e,["model"],o);const i=l(n,["name"]);return null!=i&&r(e,["endpoint"],i),e}(0,h));const f=l(n,["distillationSpec"]);null!=f&&r(e,["distillationSpec"],f);const g=l(n,["experiment"]);null!=g&&r(e,["experiment"],g);const m=l(n,["labels"]);null!=m&&r(e,["labels"],m);const y=l(n,["pipelineJob"]);null!=y&&r(e,["pipelineJob"],y);const v=l(n,["tunedModelDisplayName"]);return null!=v&&r(e,["tunedModelDisplayName"],v),e}function He(t,n){const e={},o=l(n,["name"]);null!=o&&r(e,["name"],o);const i=l(n,["state"]);null!=i&&r(e,["state"],A(0,i));const s=l(n,["createTime"]);null!=s&&r(e,["createTime"],s);const a=l(n,["startTime"]);null!=a&&r(e,["startTime"],a);const u=l(n,["endTime"]);null!=u&&r(e,["endTime"],u);const c=l(n,["updateTime"]);null!=c&&r(e,["updateTime"],c);const d=l(n,["error"]);null!=d&&r(e,["error"],d);const p=l(n,["description"]);null!=p&&r(e,["description"],p);const h=l(n,["baseModel"]);null!=h&&r(e,["baseModel"],h);const f=l(n,["tunedModel"]);null!=f&&r(e,["tunedModel"],function(t,n){const e={},o=l(n,["model"]);null!=o&&r(e,["model"],o);const i=l(n,["endpoint"]);return null!=i&&r(e,["endpoint"],i),e}(0,f));const g=l(n,["supervisedTuningSpec"]);null!=g&&r(e,["supervisedTuningSpec"],g);const m=l(n,["tuningDataStats"]);null!=m&&r(e,["tuningDataStats"],m);const y=l(n,["encryptionSpec"]);null!=y&&r(e,["encryptionSpec"],y);const v=l(n,["partnerModelTuningSpec"]);null!=v&&r(e,["partnerModelTuningSpec"],v);const E=l(n,["distillationSpec"]);null!=E&&r(e,["distillationSpec"],E);const C=l(n,["experiment"]);null!=C&&r(e,["experiment"],C);const T=l(n,["labels"]);null!=T&&r(e,["labels"],T);const _=l(n,["pipelineJob"]);null!=_&&r(e,["pipelineJob"],_);const O=l(n,["tunedModelDisplayName"]);return null!=O&&r(e,["tunedModelDisplayName"],O),e}
/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
class Je extends i{constructor(t){super(),this.apiClient=t,this.get=async t=>await this.getInternal(t),this.list=async(t={})=>new Tt(F.PAGED_ITEM_TUNING_JOBS,(t=>this.listInternal(t)),await this.listInternal(t),t),this.tune=async t=>{if(this.apiClient.isVertexAI())return await this.tuneInternal(t);{const n=await this.tuneMldevInternal(t);let e="";void 0!==n.metadata&&void 0!==n.metadata.tunedModel?e=n.metadata.tunedModel:void 0!==n.name&&n.name.includes("/operations/")&&(e=n.name.split("/operations/")[0]);return {name:e,state:ot.JOB_STATE_QUEUED}}};}async getInternal(t){var n,e,o,i;let a,u="",c={};if(this.apiClient.isVertexAI()){const o=function(t,n){const e={},o=l(n,["name"]);null!=o&&r(e,["_url","name"],o);const i=l(n,["config"]);return null!=i&&r(e,["config"],i),e}(this.apiClient,t);return u=s("{name}",o._url),c=o._query,delete o.config,delete o._url,delete o._query,a=this.apiClient.request({path:u,queryParams:c,body:JSON.stringify(o),httpMethod:"GET",httpOptions:null===(n=t.config)||void 0===n?void 0:n.httpOptions,abortSignal:null===(e=t.config)||void 0===e?void 0:e.abortSignal}).then((t=>t.json())),a.then((t=>He(this.apiClient,t)))}{const n=function(t,n){const e={},o=l(n,["name"]);null!=o&&r(e,["_url","name"],o);const i=l(n,["config"]);return null!=i&&r(e,["config"],i),e}(this.apiClient,t);return u=s("{name}",n._url),c=n._query,delete n.config,delete n._url,delete n._query,a=this.apiClient.request({path:u,queryParams:c,body:JSON.stringify(n),httpMethod:"GET",httpOptions:null===(o=t.config)||void 0===o?void 0:o.httpOptions,abortSignal:null===(i=t.config)||void 0===i?void 0:i.abortSignal}).then((t=>t.json())),a.then((t=>Be(this.apiClient,t)))}}async listInternal(t){var n,e,o,i;let a,u="",c={};if(this.apiClient.isVertexAI()){const o=Ve(this.apiClient,t);return u=s("tuningJobs",o._url),c=o._query,delete o.config,delete o._url,delete o._query,a=this.apiClient.request({path:u,queryParams:c,body:JSON.stringify(o),httpMethod:"GET",httpOptions:null===(n=t.config)||void 0===n?void 0:n.httpOptions,abortSignal:null===(e=t.config)||void 0===e?void 0:e.abortSignal}).then((t=>t.json())),a.then((t=>{const n=function(t,n){const e={},o=l(n,["nextPageToken"]);null!=o&&r(e,["nextPageToken"],o);const i=l(n,["tuningJobs"]);if(null!=i){let t=i;Array.isArray(t)&&(t=t.map((t=>He(0,t)))),r(e,["tuningJobs"],t);}return e}(this.apiClient,t),e=new Bt;return Object.assign(e,n),e}))}{const n=Le(this.apiClient,t);return u=s("tunedModels",n._url),c=n._query,delete n.config,delete n._url,delete n._query,a=this.apiClient.request({path:u,queryParams:c,body:JSON.stringify(n),httpMethod:"GET",httpOptions:null===(o=t.config)||void 0===o?void 0:o.httpOptions,abortSignal:null===(i=t.config)||void 0===i?void 0:i.abortSignal}).then((t=>t.json())),a.then((t=>{const n=function(t,n){const e={},o=l(n,["nextPageToken"]);null!=o&&r(e,["nextPageToken"],o);const i=l(n,["tunedModels"]);if(null!=i){let t=i;Array.isArray(t)&&(t=t.map((t=>Be(0,t)))),r(e,["tuningJobs"],t);}return e}(this.apiClient,t),e=new Bt;return Object.assign(e,n),e}))}}async tuneInternal(t){var n,e;let o,i="",r={};if(this.apiClient.isVertexAI()){const l=Fe(this.apiClient,t);return i=s("tuningJobs",l._url),r=l._query,delete l.config,delete l._url,delete l._query,o=this.apiClient.request({path:i,queryParams:r,body:JSON.stringify(l),httpMethod:"POST",httpOptions:null===(n=t.config)||void 0===n?void 0:n.httpOptions,abortSignal:null===(e=t.config)||void 0===e?void 0:e.abortSignal}).then((t=>t.json())),o.then((t=>He(this.apiClient,t)))}throw new Error("This method is only supported by the Vertex AI.")}async tuneMldevInternal(t){var n,e;let o,i="",a={};if(this.apiClient.isVertexAI())throw new Error("This method is only supported by the Gemini Developer API.");{const u=ke(this.apiClient,t);return i=s("tunedModels",u._url),a=u._query,delete u.config,delete u._url,delete u._query,o=this.apiClient.request({path:i,queryParams:a,body:JSON.stringify(u),httpMethod:"POST",httpOptions:null===(n=t.config)||void 0===n?void 0:n.httpOptions,abortSignal:null===(e=t.config)||void 0===e?void 0:e.abortSignal}).then((t=>t.json())),o.then((t=>function(t,n){const e={},o=l(n,["name"]);null!=o&&r(e,["name"],o);const i=l(n,["metadata"]);null!=i&&r(e,["metadata"],i);const s=l(n,["done"]);null!=s&&r(e,["done"],s);const a=l(n,["error"]);return null!=a&&r(e,["error"],a),e}(this.apiClient,t)))}}}class Ye{async upload(t,n,e){if("string"==typeof t)throw new Error("File path is not supported in browser uploader.");return await async function(t,n,e){var o,i;let s=0,r=0,l=new Kt(new Response),a="upload";for(s=t.size;r<s;){const i=Math.min(8388608,s-r),u=t.slice(r,r+i);if(r+i>=s&&(a+=", finalize"),l=await e.request({path:"",body:u,httpMethod:"POST",httpOptions:{apiVersion:"",baseUrl:n,headers:{"X-Goog-Upload-Command":a,"X-Goog-Upload-Offset":String(r),"Content-Length":String(i)}}}),r+=i,"active"!==(null===(o=null==l?void 0:l.headers)||void 0===o?void 0:o["x-goog-upload-status"]))break;if(s<=r)throw new Error("All content has been uploaded, but the upload status is not finalized.")}const u=await(null==l?void 0:l.json());if("final"!==(null===(i=null==l?void 0:l.headers)||void 0===i?void 0:i["x-goog-upload-status"]))throw new Error("Failed to upload file: Upload status is not finalized.");return u.file}(t,n,e)}async stat(t){if("string"==typeof t)throw new Error("File path is not supported in browser uploader.");return await async function(t){return {size:t.size,type:t.type}}(t)}}
/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */class Ke{create(t,n,e){return new We(t,n,e)}}class We{constructor(t,n,e){this.url=t,this.headers=n,this.callbacks=e;}connect(){this.ws=new WebSocket(this.url),this.ws.onopen=this.callbacks.onopen,this.ws.onerror=this.callbacks.onerror,this.ws.onclose=this.callbacks.onclose,this.ws.onmessage=this.callbacks.onmessage;}send(t){if(void 0===this.ws)throw new Error("WebSocket is not connected");this.ws.send(t);}close(){if(void 0===this.ws)throw new Error("WebSocket is not connected");this.ws.close();}}
/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */const $e="x-goog-api-key";class ze{constructor(t){this.apiKey=t;}async addAuthHeaders(t){null===t.get($e)&&t.append($e,this.apiKey);}}
/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */class Xe{constructor(t){var n;if(null==t.apiKey)throw new Error("An API Key must be set when running in a browser");if(t.project||t.location)throw new Error("Vertex AI project based authentication is not supported on browser runtimes. Please do not provide a project or location.");this.vertexai=null!==(n=t.vertexai)&&void 0!==n&&n,this.apiKey=t.apiKey;const e=o(t,void 0,void 0);e&&(t.httpOptions?t.httpOptions.baseUrl=e:t.httpOptions={baseUrl:e}),this.apiVersion=t.apiVersion;const i=new ze(this.apiKey);this.apiClient=new Ue({auth:i,apiVersion:this.apiVersion,apiKey:this.apiKey,vertexai:this.vertexai,httpOptions:t.httpOptions,userAgentExtra:"gl-node/web",uploader:new Ye}),this.models=new Se(this.apiClient),this.live=new Oe(this.apiClient,i,new Ke),this.chats=new ln(this.models,this.apiClient),this.caches=new Qt(this.apiClient),this.files=new pn(this.apiClient),this.operations=new Re(this.apiClient),this.tunings=new Je(this.apiClient);}}

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

function getRuntimeRequire(packageName) {
    try {
        const nodeRequire = window.require;
        return nodeRequire(packageName);
    }
    catch (error) {
        console.error(`Failed to require package "${packageName}" at runtime:`, error);
        return null;
    }
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
    _chat;
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
        this._genAI = new Xe({ apiKey });
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
        this._chat = this._genAI.chats.create({
            model: this._modelName,
            config: {
                systemInstruction: this._getSystemInstruction(previousMessages, promptData)
            }
        });
        return this._chat.sendMessageStream({ message: request, config: { responseModalities: [nt.TEXT] } });
    }
    async isSensitiveContent(messages) {
        const request = await this._getSensitiveContentPrompt(messages);
        if (!request.length || request.every((item) => typeof item === "string")) {
            return undefined;
        }
        const schema = {
            type: $.OBJECT,
            properties: {
                isEmetophobia: { type: $.BOOLEAN },
                isArachnophobia: { type: $.BOOLEAN },
                isEpileptic: { type: $.BOOLEAN },
                isSexual: { type: $.BOOLEAN }
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
                        mediasPrompt.push(bt(convertArrayBufferToBase64(buffer), media.mimeType));
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
            await Promise.all(medias.map(async (media) => {
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
            }));
            messagesFiles.push({ message, files });
        }
        const timeout = Date.now() + 30_000;
        const verifiedFiles = new Set();
        while (messagesFiles.some((messageFiles) => messageFiles.files.some((file) => file.state === dt.PROCESSING))) {
            for (const messageFiles of messagesFiles) {
                for (let i = 0; i < messageFiles.files.length; i++) {
                    const file = messageFiles.files[i];
                    if (file.name && !verifiedFiles.has(file.name)) {
                        if (file.state === dt.PROCESSING) {
                            await new Promise((resolve) => setTimeout(resolve, 100));
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
            dataPart: messageFiles.files.filter((file) => file.state === dt.ACTIVE && file.uri && file.mimeType).map((file) => Ot(file.uri, file.mimeType))
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
                    return (!!message.attachments?.length ||
                        message.embeds?.some((embed) => embed.image || embed.video) ||
                        !summaryMinLength ||
                        nChar >= summaryMinLength);
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

class UpdateManager {
    _log;
    _localPluginFilePath;
    _remotePlugin;
    _closeUpdateNotice;
    _fs;
    constructor(_log) {
        this._log = _log;
        const path = getRuntimeRequire("path");
        this._fs = getRuntimeRequire("fs");
        this._localPluginFilePath = path.join(BdApi.Plugins.folder, PLUGIN_FILE_NAME);
    }
    async ask() {
        const shouldUpdate = await this.check();
        if (shouldUpdate) {
            this._showUpdateNotice();
        }
    }
    async check() {
        const [remotePlugin, localPlugin] = await Promise.all([this._getRemotePlugin(), this._getLocalPlugin()]);
        return remotePlugin !== localPlugin;
    }
    async update() {
        try {
            await new Promise((resolve, reject) => {
                if (!this._remotePlugin) {
                    reject(new Error("No remote plugin found"));
                    return;
                }
                this._fs.writeFile(this._localPluginFilePath, this._remotePlugin, (error) => (error ? reject(error) : resolve()));
            });
            this.cancel();
            this._log("Updated successfully", "success");
        }
        catch (error) {
            this._log("Failed to update plugin", "error");
            throw error;
        }
    }
    cancel() {
        if (this._closeUpdateNotice) {
            this._closeUpdateNotice();
            this._closeUpdateNotice = undefined;
        }
    }
    async _getLocalPlugin() {
        try {
            const currentPluginBuffer = await new Promise((resolve, reject) => {
                this._fs.readFile(this._localPluginFilePath, "utf8", (error, data) => (error ? reject(error) : resolve(data)));
            });
            return currentPluginBuffer;
        }
        catch (error) {
            this._log("Failed to read current plugin", "error");
            throw error;
        }
    }
    async _getRemotePlugin() {
        try {
            const response = await fetch(GITHUB_SOURCE);
            if (!response.ok) {
                throw new Error("Failed to fetch remote plugin");
            }
            const data = await response.text();
            this._remotePlugin = data;
            return data;
        }
        catch (error) {
            this._log("Failed to fetch remote plugin", "error");
            throw error;
        }
    }
    _showUpdateNotice() {
        this._closeUpdateNotice = BdApi.UI.showNotice(`${LOG_PREFIX} ${i18n.UPDATE_NOTICE}`, {
            type: "info",
            buttons: [
                {
                    label: i18n.UPDATE,
                    onClick: () => this.update()
                }
            ]
        });
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
    _updateManager;
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
        this._updateManager = new UpdateManager(this._log.bind(this));
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
        if (getSetting(SETTING_CHECK_UPDATES)) {
            this._updateManager.ask();
        }
    }
    stop() {
        this._summaryButton?.toggle(false);
        this._closeApiKeyNotice?.();
        this._closeApiKeyNotice = undefined;
        this._isSensitiveMessageCheck.clear();
        this._unsubscribeEvents();
        BdApi.Patcher.unpatchAll(getConfig().name);
        this._updateManager?.cancel();
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
        BdApi.UI.showToast(logMessage, { type: type === "warn" ? "warning" : type });
        if (type !== "success") {
            console[type](logMessage);
        }
        else {
            console.log(logMessage);
        }
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
