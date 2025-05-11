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
                            { label: "Gemini 2.5 Pro (Preview)", value: "gemini-2.5-pro-exp-03-25" },
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
 * Original file: /npm/@google/genai@0.13.0/dist/web/index.mjs
 *
 * Do NOT use SRI with dynamically generated files! More information: https://www.jsdelivr.com/using-sri-with-dynamic-files
 */
/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
let t,n;function o(e,o,i){var r,l,s;if(!(null===(r=e.httpOptions)||void 0===r?void 0:r.baseUrl)){const r={geminiUrl:t,vertexUrl:n};return e.vertexai?null!==(l=r.vertexUrl)&&void 0!==l?l:o:null!==(s=r.geminiUrl)&&void 0!==s?s:i}return e.httpOptions.baseUrl}
/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */class i{}function r(t,n){return t.replace(/\{([^}]+)\}/g,((t,e)=>{if(Object.prototype.hasOwnProperty.call(n,e)){const t=n[e];return null!=t?String(t):""}throw new Error(`Key '${e}' not found in valueMap.`)}))}function l(t,n,e){for(let o=0;o<n.length-1;o++){const i=n[o];if(i.endsWith("[]")){const r=i.slice(0,-2);if(!(r in t)){if(!Array.isArray(e))throw new Error(`Value must be a list given an array path ${i}`);t[r]=Array.from({length:e.length},(()=>({})));}if(Array.isArray(t[r])){const i=t[r];if(Array.isArray(e))for(let t=0;t<i.length;t++){l(i[t],n.slice(o+1),e[t]);}else for(const t of i)l(t,n.slice(o+1),e);}return}if(i.endsWith("[0]")){const r=i.slice(0,-3);r in t||(t[r]=[{}]);return void l(t[r][0],n.slice(o+1),e)}t[i]&&"object"==typeof t[i]||(t[i]={}),t=t[i];}const o=n[n.length-1],i=t[o];if(void 0!==i){if(!e||"object"==typeof e&&0===Object.keys(e).length)return;if(e===i)return;if("object"!=typeof i||"object"!=typeof e||null===i||null===e)throw new Error(`Cannot set value for an existing key. Key: ${o}`);Object.assign(i,e);}else t[o]=e;}function s(t,n){try{if(1===n.length&&"_self"===n[0])return t;for(let e=0;e<n.length;e++){if("object"!=typeof t||null===t)return;const o=n[e];if(o.endsWith("[]")){const i=o.slice(0,-2);if(i in t){const o=t[i];if(!Array.isArray(o))return;return o.map((t=>s(t,n.slice(e+1))))}return}t=t[o];}return t}catch(t){if(t instanceof TypeError)return;throw t}}
/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */function a(t,n){if(!n||"string"!=typeof n)throw new Error("model is required and must be a string");if(t.isVertexAI()){if(n.startsWith("publishers/")||n.startsWith("projects/")||n.startsWith("models/"))return n;if(n.indexOf("/")>=0){const t=n.split("/",2);return `publishers/${t[0]}/models/${t[1]}`}return `publishers/google/models/${n}`}return n.startsWith("models/")||n.startsWith("tunedModels/")?n:`models/${n}`}function u(t,n){const e=a(t,n);return e?e.startsWith("publishers/")&&t.isVertexAI()?`projects/${t.getProject()}/locations/${t.getLocation()}/${e}`:e.startsWith("models/")&&t.isVertexAI()?`projects/${t.getProject()}/locations/${t.getLocation()}/publishers/google/${e}`:e:""}function c(t,n){return Array.isArray(n)?n.map((n=>d(t,n))):[d(t,n)]}function d(t,n){if("object"==typeof n&&null!==n)return n;throw new Error("Could not parse input as Blob. Unsupported blob type: "+typeof n)}function p(t,n){if(null==n)throw new Error("PartUnion is required");if("object"==typeof n)return n;if("string"==typeof n)return {text:n};throw new Error("Unsupported part type: "+typeof n)}function f(t,n){if(null==n||Array.isArray(n)&&0===n.length)throw new Error("PartListUnion is required");return Array.isArray(n)?n.map((t=>p(0,t))):[p(0,n)]}function h(t){return null!=t&&"object"==typeof t&&"parts"in t&&Array.isArray(t.parts)}function g(t){return null!=t&&"object"==typeof t&&"functionCall"in t}function m(t){return null!=t&&"object"==typeof t&&"functionResponse"in t}function y(t,n){if(null==n)throw new Error("ContentUnion is required");return h(n)?n:{role:"user",parts:f(0,n)}}function v(t,n){if(!n)return [];if(t.isVertexAI()&&Array.isArray(n))return n.flatMap((t=>{const n=y(0,t);return n.parts&&n.parts.length>0&&void 0!==n.parts[0].text?[n.parts[0].text]:[]}));if(t.isVertexAI()){const t=y(0,n);return t.parts&&t.parts.length>0&&void 0!==t.parts[0].text?[t.parts[0].text]:[]}return Array.isArray(n)?n.map((t=>y(0,t))):[y(0,n)]}function C(t,n){if(null==n||Array.isArray(n)&&0===n.length)throw new Error("contents are required");if(!Array.isArray(n)){if(g(n)||m(n))throw new Error("To specify functionCall or functionResponse parts, please wrap them in a Content object, specifying the role for them");return [y(0,n)]}const e=[],o=[],i=h(n[0]);for(const t of n){const n=h(t);if(n!=i)throw new Error("Mixing Content and Parts is not supported, please group the parts into a the appropriate Content objects and specify the roles for them");if(n)e.push(t);else {if(g(t)||m(t))throw new Error("To specify functionCall or functionResponse parts, please wrap them, and any other parts, in Content objects as appropriate, specifying the role for them");o.push(t);}}return i||e.push({role:"user",parts:f(0,o)}),e}function E(t,n){return n}function T(t,n){if("object"==typeof n)return n;if("string"==typeof n)return {voiceConfig:{prebuiltVoiceConfig:{voiceName:n}}};throw new Error("Unsupported speechConfig type: "+typeof n)}function _(t,n){return n}function O(t,n){if(!Array.isArray(n))throw new Error("tool is required and must be an array of Tools");return n}function A(t,n){if("string"!=typeof n)throw new Error("name must be a string");return function(t,n,e,o=1){const i=!n.startsWith(`${e}/`)&&n.split("/").length===o;return t.isVertexAI()?n.startsWith("projects/")?n:n.startsWith("locations/")?`projects/${t.getProject()}/${n}`:n.startsWith(`${e}/`)?`projects/${t.getProject()}/locations/${t.getLocation()}/${n}`:i?`projects/${t.getProject()}/locations/${t.getLocation()}/${e}/${n}`:n:i?`${e}/${n}`:n}(t,n,"cachedContents")}function I(t,n){switch(n){case "STATE_UNSPECIFIED":return "JOB_STATE_UNSPECIFIED";case "CREATING":return "JOB_STATE_RUNNING";case "ACTIVE":return "JOB_STATE_SUCCEEDED";case "FAILED":return "JOB_STATE_FAILED";default:return n}}function S(t,n){if("string"!=typeof n)throw new Error("fromImageBytes must be a string");return n}function b(t,n){var e;let o;var i;if(null!=(i=n)&&"object"==typeof i&&"name"in i&&(o=n.name),!(function(t){return null!=t&&"object"==typeof t&&"uri"in t}(n)&&(o=n.uri,void 0===o)||function(t){return null!=t&&"object"==typeof t&&"video"in t}(n)&&(o=null===(e=n.video)||void 0===e?void 0:e.uri,void 0===o))){if("string"==typeof n&&(o=n),void 0===o)throw new Error("Could not extract file name from the provided input.");if(o.startsWith("https://")){const t=o.split("files/")[1].match(/[a-z0-9]+/);if(null===t)throw new Error(`Could not extract file name from URI ${o}`);o=t[0];}else o.startsWith("files/")&&(o=o.split("files/")[1]);return o}}function w(t,n){let e;return e=t.isVertexAI()?n?"publishers/google/models":"models":n?"models":"tunedModels",e}function P(t,n){for(const t of ["models","tunedModels","publisherModels"])if(o=t,null!==(e=n)&&"object"==typeof e&&o in e)return n[t];var e,o;
/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */return []}function N(t,n){const e={},o=s(n,["parts"]);if(null!=o){let t=o;Array.isArray(t)&&(t=t.map((t=>function(t,n){const e={};if(void 0!==s(n,["videoMetadata"]))throw new Error("videoMetadata parameter is not supported in Gemini API.");const o=s(n,["thought"]);null!=o&&l(e,["thought"],o);const i=s(n,["codeExecutionResult"]);null!=i&&l(e,["codeExecutionResult"],i);const r=s(n,["executableCode"]);null!=r&&l(e,["executableCode"],r);const a=s(n,["fileData"]);null!=a&&l(e,["fileData"],a);const u=s(n,["functionCall"]);null!=u&&l(e,["functionCall"],u);const c=s(n,["functionResponse"]);null!=c&&l(e,["functionResponse"],c);const d=s(n,["inlineData"]);null!=d&&l(e,["inlineData"],d);const p=s(n,["text"]);return null!=p&&l(e,["text"],p),e}(0,t)))),l(e,["parts"],t);}const i=s(n,["role"]);return null!=i&&l(e,["role"],i),e}function R(t,n){const e={},o=s(n,["dynamicRetrievalConfig"]);return null!=o&&l(e,["dynamicRetrievalConfig"],function(t,n){const e={},o=s(n,["mode"]);null!=o&&l(e,["mode"],o);const i=s(n,["dynamicThreshold"]);return null!=i&&l(e,["dynamicThreshold"],i),e}(0,o)),e}function D(t,n){const e={},o=s(n,["functionCallingConfig"]);if(null!=o&&l(e,["functionCallingConfig"],function(t,n){const e={},o=s(n,["mode"]);null!=o&&l(e,["mode"],o);const i=s(n,["allowedFunctionNames"]);return null!=i&&l(e,["allowedFunctionNames"],i),e}(0,o)),void 0!==s(n,["retrievalConfig"]))throw new Error("retrievalConfig parameter is not supported in Gemini API.");return e}function M(t,n,e){const o=s(n,["ttl"]);void 0!==e&&null!=o&&l(e,["ttl"],o);const i=s(n,["expireTime"]);void 0!==e&&null!=i&&l(e,["expireTime"],i);const r=s(n,["displayName"]);void 0!==e&&null!=r&&l(e,["displayName"],r);const a=s(n,["contents"]);if(void 0!==e&&null!=a){let t=C(0,a);Array.isArray(t)&&(t=t.map((t=>N(0,t)))),l(e,["contents"],t);}const u=s(n,["systemInstruction"]);void 0!==e&&null!=u&&l(e,["systemInstruction"],N(0,y(0,u)));const c=s(n,["tools"]);if(void 0!==e&&null!=c){let t=c;Array.isArray(t)&&(t=t.map((t=>function(t,n){const e={};if(void 0!==s(n,["retrieval"]))throw new Error("retrieval parameter is not supported in Gemini API.");null!=s(n,["googleSearch"])&&l(e,["googleSearch"],{});const o=s(n,["googleSearchRetrieval"]);if(null!=o&&l(e,["googleSearchRetrieval"],R(0,o)),void 0!==s(n,["enterpriseWebSearch"]))throw new Error("enterpriseWebSearch parameter is not supported in Gemini API.");if(void 0!==s(n,["googleMaps"]))throw new Error("googleMaps parameter is not supported in Gemini API.");const i=s(n,["codeExecution"]);null!=i&&l(e,["codeExecution"],i);const r=s(n,["functionDeclarations"]);return null!=r&&l(e,["functionDeclarations"],r),e}(0,t)))),l(e,["tools"],t);}const d=s(n,["toolConfig"]);return void 0!==e&&null!=d&&l(e,["toolConfig"],D(0,d)),{}}function x(t,n){const e={},o=s(n,["name"]);null!=o&&l(e,["_url","name"],A(t,o));const i=s(n,["config"]);return null!=i&&l(e,["config"],function(t,n,e){const o=s(n,["ttl"]);void 0!==e&&null!=o&&l(e,["ttl"],o);const i=s(n,["expireTime"]);return void 0!==e&&null!=i&&l(e,["expireTime"],i),{}}(0,i,e)),e}function U(t,n){const e={},o=s(n,["config"]);return null!=o&&l(e,["config"],function(t,n,e){const o=s(n,["pageSize"]);void 0!==e&&null!=o&&l(e,["_query","pageSize"],o);const i=s(n,["pageToken"]);return void 0!==e&&null!=i&&l(e,["_query","pageToken"],i),{}}(0,o,e)),e}function q(t,n){const e={},o=s(n,["parts"]);if(null!=o){let t=o;Array.isArray(t)&&(t=t.map((t=>function(t,n){const e={},o=s(n,["videoMetadata"]);null!=o&&l(e,["videoMetadata"],o);const i=s(n,["thought"]);null!=i&&l(e,["thought"],i);const r=s(n,["codeExecutionResult"]);null!=r&&l(e,["codeExecutionResult"],r);const a=s(n,["executableCode"]);null!=a&&l(e,["executableCode"],a);const u=s(n,["fileData"]);null!=u&&l(e,["fileData"],u);const c=s(n,["functionCall"]);null!=c&&l(e,["functionCall"],c);const d=s(n,["functionResponse"]);null!=d&&l(e,["functionResponse"],d);const p=s(n,["inlineData"]);null!=p&&l(e,["inlineData"],p);const f=s(n,["text"]);return null!=f&&l(e,["text"],f),e}(0,t)))),l(e,["parts"],t);}const i=s(n,["role"]);return null!=i&&l(e,["role"],i),e}function L(t,n){const e={},o=s(n,["dynamicRetrievalConfig"]);return null!=o&&l(e,["dynamicRetrievalConfig"],function(t,n){const e={},o=s(n,["mode"]);null!=o&&l(e,["mode"],o);const i=s(n,["dynamicThreshold"]);return null!=i&&l(e,["dynamicThreshold"],i),e}(0,o)),e}function G(t,n){const e={},o=s(n,["apiKeyConfig"]);null!=o&&l(e,["apiKeyConfig"],function(t,n){const e={},o=s(n,["apiKeyString"]);return null!=o&&l(e,["apiKeyString"],o),e}(0,o));const i=s(n,["authType"]);null!=i&&l(e,["authType"],i);const r=s(n,["googleServiceAccountConfig"]);null!=r&&l(e,["googleServiceAccountConfig"],r);const a=s(n,["httpBasicAuthConfig"]);null!=a&&l(e,["httpBasicAuthConfig"],a);const u=s(n,["oauthConfig"]);null!=u&&l(e,["oauthConfig"],u);const c=s(n,["oidcConfig"]);return null!=c&&l(e,["oidcConfig"],c),e}function k(t,n){const e={},o=s(n,["retrieval"]);null!=o&&l(e,["retrieval"],o);null!=s(n,["googleSearch"])&&l(e,["googleSearch"],{});const i=s(n,["googleSearchRetrieval"]);null!=i&&l(e,["googleSearchRetrieval"],L(0,i));null!=s(n,["enterpriseWebSearch"])&&l(e,["enterpriseWebSearch"],{});const r=s(n,["googleMaps"]);null!=r&&l(e,["googleMaps"],function(t,n){const e={},o=s(n,["authConfig"]);return null!=o&&l(e,["authConfig"],G(0,o)),e}(0,r));const a=s(n,["codeExecution"]);null!=a&&l(e,["codeExecution"],a);const u=s(n,["functionDeclarations"]);return null!=u&&l(e,["functionDeclarations"],u),e}function j(t,n){const e={},o=s(n,["latLng"]);return null!=o&&l(e,["latLng"],function(t,n){const e={},o=s(n,["latitude"]);null!=o&&l(e,["latitude"],o);const i=s(n,["longitude"]);return null!=i&&l(e,["longitude"],i),e}(0,o)),e}function H(t,n){const e={},o=s(n,["functionCallingConfig"]);null!=o&&l(e,["functionCallingConfig"],function(t,n){const e={},o=s(n,["mode"]);null!=o&&l(e,["mode"],o);const i=s(n,["allowedFunctionNames"]);return null!=i&&l(e,["allowedFunctionNames"],i),e}(0,o));const i=s(n,["retrievalConfig"]);return null!=i&&l(e,["retrievalConfig"],j(0,i)),e}function V(t,n){const e={},o=s(n,["model"]);null!=o&&l(e,["model"],u(t,o));const i=s(n,["config"]);return null!=i&&l(e,["config"],function(t,n,e){const o=s(n,["ttl"]);void 0!==e&&null!=o&&l(e,["ttl"],o);const i=s(n,["expireTime"]);void 0!==e&&null!=i&&l(e,["expireTime"],i);const r=s(n,["displayName"]);void 0!==e&&null!=r&&l(e,["displayName"],r);const a=s(n,["contents"]);if(void 0!==e&&null!=a){let t=C(0,a);Array.isArray(t)&&(t=t.map((t=>q(0,t)))),l(e,["contents"],t);}const u=s(n,["systemInstruction"]);void 0!==e&&null!=u&&l(e,["systemInstruction"],q(0,y(0,u)));const c=s(n,["tools"]);if(void 0!==e&&null!=c){let t=c;Array.isArray(t)&&(t=t.map((t=>k(0,t)))),l(e,["tools"],t);}const d=s(n,["toolConfig"]);return void 0!==e&&null!=d&&l(e,["toolConfig"],H(0,d)),{}}(0,i,e)),e}function B(t,n){const e={},o=s(n,["name"]);null!=o&&l(e,["_url","name"],A(t,o));const i=s(n,["config"]);return null!=i&&l(e,["config"],function(t,n,e){const o=s(n,["ttl"]);void 0!==e&&null!=o&&l(e,["ttl"],o);const i=s(n,["expireTime"]);return void 0!==e&&null!=i&&l(e,["expireTime"],i),{}}(0,i,e)),e}function F(t,n){const e={},o=s(n,["config"]);return null!=o&&l(e,["config"],function(t,n,e){const o=s(n,["pageSize"]);void 0!==e&&null!=o&&l(e,["_query","pageSize"],o);const i=s(n,["pageToken"]);return void 0!==e&&null!=i&&l(e,["_query","pageToken"],i),{}}(0,o,e)),e}function J(t,n){const e={},o=s(n,["name"]);null!=o&&l(e,["name"],o);const i=s(n,["displayName"]);null!=i&&l(e,["displayName"],i);const r=s(n,["model"]);null!=r&&l(e,["model"],r);const a=s(n,["createTime"]);null!=a&&l(e,["createTime"],a);const u=s(n,["updateTime"]);null!=u&&l(e,["updateTime"],u);const c=s(n,["expireTime"]);null!=c&&l(e,["expireTime"],c);const d=s(n,["usageMetadata"]);return null!=d&&l(e,["usageMetadata"],d),e}function Y(t,n){const e={},o=s(n,["name"]);null!=o&&l(e,["name"],o);const i=s(n,["displayName"]);null!=i&&l(e,["displayName"],i);const r=s(n,["model"]);null!=r&&l(e,["model"],r);const a=s(n,["createTime"]);null!=a&&l(e,["createTime"],a);const u=s(n,["updateTime"]);null!=u&&l(e,["updateTime"],u);const c=s(n,["expireTime"]);null!=c&&l(e,["expireTime"],c);const d=s(n,["usageMetadata"]);return null!=d&&l(e,["usageMetadata"],d),e}
/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
var K,W,$,z,X,Z,Q,tt,nt,et,ot,it,rt,lt,st,at,ut,ct,dt,pt,ft,ht,gt,mt,yt,vt,Ct,Et,Tt,_t,Ot,At,It,St;!function(t){t.PAGED_ITEM_BATCH_JOBS="batchJobs",t.PAGED_ITEM_MODELS="models",t.PAGED_ITEM_TUNING_JOBS="tuningJobs",t.PAGED_ITEM_FILES="files",t.PAGED_ITEM_CACHED_CONTENTS="cachedContents";}(K||(K={}));class bt{constructor(t,n,e,o){this.pageInternal=[],this.paramsInternal={},this.requestInternal=n,this.init(t,e,o);}init(t,n,e){var o,i;this.nameInternal=t,this.pageInternal=n[this.nameInternal]||[],this.idxInternal=0;let r={config:{}};r=e?"object"==typeof e?Object.assign({},e):e:{config:{}},r.config&&(r.config.pageToken=n.nextPageToken),this.paramsInternal=r,this.pageInternalSize=null!==(i=null===(o=r.config)||void 0===o?void 0:o.pageSize)&&void 0!==i?i:this.pageInternal.length;}initNextPage(t){this.init(this.nameInternal,t,this.paramsInternal);}get page(){return this.pageInternal}get name(){return this.nameInternal}get pageSize(){return this.pageInternalSize}get params(){return this.paramsInternal}get pageLength(){return this.pageInternal.length}getItem(t){return this.pageInternal[t]}[Symbol.asyncIterator](){return {next:async()=>{if(this.idxInternal>=this.pageLength){if(!this.hasNextPage())return {value:void 0,done:true};await this.nextPage();}const t=this.getItem(this.idxInternal);return this.idxInternal+=1,{value:t,done:false}},return:async()=>({value:void 0,done:true})}}async nextPage(){if(!this.hasNextPage())throw new Error("No more pages to fetch.");const t=await this.requestInternal(this.params);return this.initNextPage(t),this.page}hasNextPage(){var t;return void 0!==(null===(t=this.params.config)||void 0===t?void 0:t.pageToken)}}
/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */!function(t){t.OUTCOME_UNSPECIFIED="OUTCOME_UNSPECIFIED",t.OUTCOME_OK="OUTCOME_OK",t.OUTCOME_FAILED="OUTCOME_FAILED",t.OUTCOME_DEADLINE_EXCEEDED="OUTCOME_DEADLINE_EXCEEDED";}(W||(W={})),function(t){t.LANGUAGE_UNSPECIFIED="LANGUAGE_UNSPECIFIED",t.PYTHON="PYTHON";}($||($={})),function(t){t.HARM_CATEGORY_UNSPECIFIED="HARM_CATEGORY_UNSPECIFIED",t.HARM_CATEGORY_HATE_SPEECH="HARM_CATEGORY_HATE_SPEECH",t.HARM_CATEGORY_DANGEROUS_CONTENT="HARM_CATEGORY_DANGEROUS_CONTENT",t.HARM_CATEGORY_HARASSMENT="HARM_CATEGORY_HARASSMENT",t.HARM_CATEGORY_SEXUALLY_EXPLICIT="HARM_CATEGORY_SEXUALLY_EXPLICIT",t.HARM_CATEGORY_CIVIC_INTEGRITY="HARM_CATEGORY_CIVIC_INTEGRITY";}(z||(z={})),function(t){t.HARM_BLOCK_METHOD_UNSPECIFIED="HARM_BLOCK_METHOD_UNSPECIFIED",t.SEVERITY="SEVERITY",t.PROBABILITY="PROBABILITY";}(X||(X={})),function(t){t.HARM_BLOCK_THRESHOLD_UNSPECIFIED="HARM_BLOCK_THRESHOLD_UNSPECIFIED",t.BLOCK_LOW_AND_ABOVE="BLOCK_LOW_AND_ABOVE",t.BLOCK_MEDIUM_AND_ABOVE="BLOCK_MEDIUM_AND_ABOVE",t.BLOCK_ONLY_HIGH="BLOCK_ONLY_HIGH",t.BLOCK_NONE="BLOCK_NONE",t.OFF="OFF";}(Z||(Z={})),function(t){t.MODE_UNSPECIFIED="MODE_UNSPECIFIED",t.MODE_DYNAMIC="MODE_DYNAMIC";}(Q||(Q={})),function(t){t.AUTH_TYPE_UNSPECIFIED="AUTH_TYPE_UNSPECIFIED",t.NO_AUTH="NO_AUTH",t.API_KEY_AUTH="API_KEY_AUTH",t.HTTP_BASIC_AUTH="HTTP_BASIC_AUTH",t.GOOGLE_SERVICE_ACCOUNT_AUTH="GOOGLE_SERVICE_ACCOUNT_AUTH",t.OAUTH="OAUTH",t.OIDC_AUTH="OIDC_AUTH";}(tt||(tt={})),function(t){t.TYPE_UNSPECIFIED="TYPE_UNSPECIFIED",t.STRING="STRING",t.NUMBER="NUMBER",t.INTEGER="INTEGER",t.BOOLEAN="BOOLEAN",t.ARRAY="ARRAY",t.OBJECT="OBJECT";}(nt||(nt={})),function(t){t.FINISH_REASON_UNSPECIFIED="FINISH_REASON_UNSPECIFIED",t.STOP="STOP",t.MAX_TOKENS="MAX_TOKENS",t.SAFETY="SAFETY",t.RECITATION="RECITATION",t.LANGUAGE="LANGUAGE",t.OTHER="OTHER",t.BLOCKLIST="BLOCKLIST",t.PROHIBITED_CONTENT="PROHIBITED_CONTENT",t.SPII="SPII",t.MALFORMED_FUNCTION_CALL="MALFORMED_FUNCTION_CALL",t.IMAGE_SAFETY="IMAGE_SAFETY";}(et||(et={})),function(t){t.HARM_PROBABILITY_UNSPECIFIED="HARM_PROBABILITY_UNSPECIFIED",t.NEGLIGIBLE="NEGLIGIBLE",t.LOW="LOW",t.MEDIUM="MEDIUM",t.HIGH="HIGH";}(ot||(ot={})),function(t){t.HARM_SEVERITY_UNSPECIFIED="HARM_SEVERITY_UNSPECIFIED",t.HARM_SEVERITY_NEGLIGIBLE="HARM_SEVERITY_NEGLIGIBLE",t.HARM_SEVERITY_LOW="HARM_SEVERITY_LOW",t.HARM_SEVERITY_MEDIUM="HARM_SEVERITY_MEDIUM",t.HARM_SEVERITY_HIGH="HARM_SEVERITY_HIGH";}(it||(it={})),function(t){t.BLOCKED_REASON_UNSPECIFIED="BLOCKED_REASON_UNSPECIFIED",t.SAFETY="SAFETY",t.OTHER="OTHER",t.BLOCKLIST="BLOCKLIST",t.PROHIBITED_CONTENT="PROHIBITED_CONTENT";}(rt||(rt={})),function(t){t.TRAFFIC_TYPE_UNSPECIFIED="TRAFFIC_TYPE_UNSPECIFIED",t.ON_DEMAND="ON_DEMAND",t.PROVISIONED_THROUGHPUT="PROVISIONED_THROUGHPUT";}(lt||(lt={})),function(t){t.MODALITY_UNSPECIFIED="MODALITY_UNSPECIFIED",t.TEXT="TEXT",t.IMAGE="IMAGE",t.AUDIO="AUDIO";}(st||(st={})),function(t){t.MEDIA_RESOLUTION_UNSPECIFIED="MEDIA_RESOLUTION_UNSPECIFIED",t.MEDIA_RESOLUTION_LOW="MEDIA_RESOLUTION_LOW",t.MEDIA_RESOLUTION_MEDIUM="MEDIA_RESOLUTION_MEDIUM",t.MEDIA_RESOLUTION_HIGH="MEDIA_RESOLUTION_HIGH";}(at||(at={})),function(t){t.JOB_STATE_UNSPECIFIED="JOB_STATE_UNSPECIFIED",t.JOB_STATE_QUEUED="JOB_STATE_QUEUED",t.JOB_STATE_PENDING="JOB_STATE_PENDING",t.JOB_STATE_RUNNING="JOB_STATE_RUNNING",t.JOB_STATE_SUCCEEDED="JOB_STATE_SUCCEEDED",t.JOB_STATE_FAILED="JOB_STATE_FAILED",t.JOB_STATE_CANCELLING="JOB_STATE_CANCELLING",t.JOB_STATE_CANCELLED="JOB_STATE_CANCELLED",t.JOB_STATE_PAUSED="JOB_STATE_PAUSED",t.JOB_STATE_EXPIRED="JOB_STATE_EXPIRED",t.JOB_STATE_UPDATING="JOB_STATE_UPDATING",t.JOB_STATE_PARTIALLY_SUCCEEDED="JOB_STATE_PARTIALLY_SUCCEEDED";}(ut||(ut={})),function(t){t.ADAPTER_SIZE_UNSPECIFIED="ADAPTER_SIZE_UNSPECIFIED",t.ADAPTER_SIZE_ONE="ADAPTER_SIZE_ONE",t.ADAPTER_SIZE_TWO="ADAPTER_SIZE_TWO",t.ADAPTER_SIZE_FOUR="ADAPTER_SIZE_FOUR",t.ADAPTER_SIZE_EIGHT="ADAPTER_SIZE_EIGHT",t.ADAPTER_SIZE_SIXTEEN="ADAPTER_SIZE_SIXTEEN",t.ADAPTER_SIZE_THIRTY_TWO="ADAPTER_SIZE_THIRTY_TWO";}(ct||(ct={})),function(t){t.FEATURE_SELECTION_PREFERENCE_UNSPECIFIED="FEATURE_SELECTION_PREFERENCE_UNSPECIFIED",t.PRIORITIZE_QUALITY="PRIORITIZE_QUALITY",t.BALANCED="BALANCED",t.PRIORITIZE_COST="PRIORITIZE_COST";}(dt||(dt={})),function(t){t.MODE_UNSPECIFIED="MODE_UNSPECIFIED",t.MODE_DYNAMIC="MODE_DYNAMIC";}(pt||(pt={})),function(t){t.MODE_UNSPECIFIED="MODE_UNSPECIFIED",t.AUTO="AUTO",t.ANY="ANY",t.NONE="NONE";}(ft||(ft={})),function(t){t.BLOCK_LOW_AND_ABOVE="BLOCK_LOW_AND_ABOVE",t.BLOCK_MEDIUM_AND_ABOVE="BLOCK_MEDIUM_AND_ABOVE",t.BLOCK_ONLY_HIGH="BLOCK_ONLY_HIGH",t.BLOCK_NONE="BLOCK_NONE";}(ht||(ht={})),function(t){t.DONT_ALLOW="DONT_ALLOW",t.ALLOW_ADULT="ALLOW_ADULT",t.ALLOW_ALL="ALLOW_ALL";}(gt||(gt={})),function(t){t.auto="auto",t.en="en",t.ja="ja",t.ko="ko",t.hi="hi";}(mt||(mt={})),function(t){t.STATE_UNSPECIFIED="STATE_UNSPECIFIED",t.PROCESSING="PROCESSING",t.ACTIVE="ACTIVE",t.FAILED="FAILED";}(yt||(yt={})),function(t){t.SOURCE_UNSPECIFIED="SOURCE_UNSPECIFIED",t.UPLOADED="UPLOADED",t.GENERATED="GENERATED";}(vt||(vt={})),function(t){t.MASK_MODE_DEFAULT="MASK_MODE_DEFAULT",t.MASK_MODE_USER_PROVIDED="MASK_MODE_USER_PROVIDED",t.MASK_MODE_BACKGROUND="MASK_MODE_BACKGROUND",t.MASK_MODE_FOREGROUND="MASK_MODE_FOREGROUND",t.MASK_MODE_SEMANTIC="MASK_MODE_SEMANTIC";}(Ct||(Ct={})),function(t){t.CONTROL_TYPE_DEFAULT="CONTROL_TYPE_DEFAULT",t.CONTROL_TYPE_CANNY="CONTROL_TYPE_CANNY",t.CONTROL_TYPE_SCRIBBLE="CONTROL_TYPE_SCRIBBLE",t.CONTROL_TYPE_FACE_MESH="CONTROL_TYPE_FACE_MESH";}(Et||(Et={})),function(t){t.SUBJECT_TYPE_DEFAULT="SUBJECT_TYPE_DEFAULT",t.SUBJECT_TYPE_PERSON="SUBJECT_TYPE_PERSON",t.SUBJECT_TYPE_ANIMAL="SUBJECT_TYPE_ANIMAL",t.SUBJECT_TYPE_PRODUCT="SUBJECT_TYPE_PRODUCT";}(Tt||(Tt={})),function(t){t.MODALITY_UNSPECIFIED="MODALITY_UNSPECIFIED",t.TEXT="TEXT",t.IMAGE="IMAGE",t.VIDEO="VIDEO",t.AUDIO="AUDIO",t.DOCUMENT="DOCUMENT";}(_t||(_t={})),function(t){t.START_SENSITIVITY_UNSPECIFIED="START_SENSITIVITY_UNSPECIFIED",t.START_SENSITIVITY_HIGH="START_SENSITIVITY_HIGH",t.START_SENSITIVITY_LOW="START_SENSITIVITY_LOW";}(Ot||(Ot={})),function(t){t.END_SENSITIVITY_UNSPECIFIED="END_SENSITIVITY_UNSPECIFIED",t.END_SENSITIVITY_HIGH="END_SENSITIVITY_HIGH",t.END_SENSITIVITY_LOW="END_SENSITIVITY_LOW";}(At||(At={})),function(t){t.ACTIVITY_HANDLING_UNSPECIFIED="ACTIVITY_HANDLING_UNSPECIFIED",t.START_OF_ACTIVITY_INTERRUPTS="START_OF_ACTIVITY_INTERRUPTS",t.NO_INTERRUPTION="NO_INTERRUPTION";}(It||(It={})),function(t){t.TURN_COVERAGE_UNSPECIFIED="TURN_COVERAGE_UNSPECIFIED",t.TURN_INCLUDES_ONLY_ACTIVITY="TURN_INCLUDES_ONLY_ACTIVITY",t.TURN_INCLUDES_ALL_INPUT="TURN_INCLUDES_ALL_INPUT";}(St||(St={}));function Pt(t,n){return {fileData:{fileUri:t,mimeType:n}}}function Mt(t,n){return {inlineData:{data:t,mimeType:n}}}class Vt{get text(){var t,n,e,o,i,r,l,s;if(0===(null===(o=null===(e=null===(n=null===(t=this.candidates)||void 0===t?void 0:t[0])||void 0===n?void 0:n.content)||void 0===e?void 0:e.parts)||void 0===o?void 0:o.length))return;this.candidates&&this.candidates.length>1&&console.warn("there are multiple candidates in the response, returning text from the first one.");let a="",u=false;const c=[];for(const t of null!==(s=null===(l=null===(r=null===(i=this.candidates)||void 0===i?void 0:i[0])||void 0===r?void 0:r.content)||void 0===l?void 0:l.parts)&&void 0!==s?s:[]){for(const[n,e]of Object.entries(t))"text"===n||"thought"===n||null===e&&void 0===e||c.push(n);if("string"==typeof t.text){if("boolean"==typeof t.thought&&t.thought)continue;u=true,a+=t.text;}}return c.length>0&&console.warn(`there are non-text parts ${c} in the response, returning concatenation of all text parts. Please refer to the non text parts for a full response from model.`),u?a:void 0}get data(){var t,n,e,o,i,r,l,s;if(0===(null===(o=null===(e=null===(n=null===(t=this.candidates)||void 0===t?void 0:t[0])||void 0===n?void 0:n.content)||void 0===e?void 0:e.parts)||void 0===o?void 0:o.length))return;this.candidates&&this.candidates.length>1&&console.warn("there are multiple candidates in the response, returning data from the first one.");let a="";const u=[];for(const t of null!==(s=null===(l=null===(r=null===(i=this.candidates)||void 0===i?void 0:i[0])||void 0===r?void 0:r.content)||void 0===l?void 0:l.parts)&&void 0!==s?s:[]){for(const[n,e]of Object.entries(t))"inlineData"===n||null===e&&void 0===e||u.push(n);t.inlineData&&"string"==typeof t.inlineData.data&&(a+=atob(t.inlineData.data));}return u.length>0&&console.warn(`there are non-data parts ${u} in the response, returning concatenation of all data parts. Please refer to the non data parts for a full response from model.`),a.length>0?btoa(a):void 0}get functionCalls(){var t,n,e,o,i,r,l,s;if(0===(null===(o=null===(e=null===(n=null===(t=this.candidates)||void 0===t?void 0:t[0])||void 0===n?void 0:n.content)||void 0===e?void 0:e.parts)||void 0===o?void 0:o.length))return;this.candidates&&this.candidates.length>1&&console.warn("there are multiple candidates in the response, returning function calls from the first one.");const a=null===(s=null===(l=null===(r=null===(i=this.candidates)||void 0===i?void 0:i[0])||void 0===r?void 0:r.content)||void 0===l?void 0:l.parts)||void 0===s?void 0:s.filter((t=>t.functionCall)).map((t=>t.functionCall)).filter((t=>void 0!==t));return 0!==(null==a?void 0:a.length)?a:void 0}get executableCode(){var t,n,e,o,i,r,l,s,a;if(0===(null===(o=null===(e=null===(n=null===(t=this.candidates)||void 0===t?void 0:t[0])||void 0===n?void 0:n.content)||void 0===e?void 0:e.parts)||void 0===o?void 0:o.length))return;this.candidates&&this.candidates.length>1&&console.warn("there are multiple candidates in the response, returning executable code from the first one.");const u=null===(s=null===(l=null===(r=null===(i=this.candidates)||void 0===i?void 0:i[0])||void 0===r?void 0:r.content)||void 0===l?void 0:l.parts)||void 0===s?void 0:s.filter((t=>t.executableCode)).map((t=>t.executableCode)).filter((t=>void 0!==t));return 0!==(null==u?void 0:u.length)?null===(a=null==u?void 0:u[0])||void 0===a?void 0:a.code:void 0}get codeExecutionResult(){var t,n,e,o,i,r,l,s,a;if(0===(null===(o=null===(e=null===(n=null===(t=this.candidates)||void 0===t?void 0:t[0])||void 0===n?void 0:n.content)||void 0===e?void 0:e.parts)||void 0===o?void 0:o.length))return;this.candidates&&this.candidates.length>1&&console.warn("there are multiple candidates in the response, returning code execution result from the first one.");const u=null===(s=null===(l=null===(r=null===(i=this.candidates)||void 0===i?void 0:i[0])||void 0===r?void 0:r.content)||void 0===l?void 0:l.parts)||void 0===s?void 0:s.filter((t=>t.codeExecutionResult)).map((t=>t.codeExecutionResult)).filter((t=>void 0!==t));return 0!==(null==u?void 0:u.length)?null===(a=null==u?void 0:u[0])||void 0===a?void 0:a.output:void 0}}class Bt{}class Ft{}class Jt{}class Yt{}class Kt{}class Wt{}class zt{}class Xt{}class Zt{}class Qt{}class tn{constructor(t){const n={};for(const e of t.headers.entries())n[e[0]]=e[1];this.headers=n,this.responseInternal=t;}json(){return this.responseInternal.json()}}class nn{}class en{}class rn{get text(){var t,n,e;let o="",i=false;const r=[];for(const l of null!==(e=null===(n=null===(t=this.serverContent)||void 0===t?void 0:t.modelTurn)||void 0===n?void 0:n.parts)&&void 0!==e?e:[]){for(const[t,n]of Object.entries(l))"text"!==t&&"thought"!==t&&null!==n&&r.push(t);if("string"==typeof l.text){if("boolean"==typeof l.thought&&l.thought)continue;i=true,o+=l.text;}}return r.length>0&&console.warn(`there are non-text parts ${r} in the response, returning concatenation of all text parts. Please refer to the non text parts for a full response from model.`),i?o:void 0}get data(){var t,n,e;let o="";const i=[];for(const r of null!==(e=null===(n=null===(t=this.serverContent)||void 0===t?void 0:t.modelTurn)||void 0===n?void 0:n.parts)&&void 0!==e?e:[]){for(const[t,n]of Object.entries(r))"inlineData"!==t&&null!==n&&i.push(t);r.inlineData&&"string"==typeof r.inlineData.data&&(o+=atob(r.inlineData.data));}return i.length>0&&console.warn(`there are non-data parts ${i} in the response, returning concatenation of all data parts. Please refer to the non data parts for a full response from model.`),o.length>0?btoa(o):void 0}}/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */class an extends i{constructor(t){super(),this.apiClient=t,this.list=async(t={})=>new bt(K.PAGED_ITEM_CACHED_CONTENTS,(t=>this.listInternal(t)),await this.listInternal(t),t);}async create(t){var n,e,o,i;let a,c="",d={};if(this.apiClient.isVertexAI()){const o=V(this.apiClient,t);return c=r("cachedContents",o._url),d=o._query,delete o.config,delete o._url,delete o._query,a=this.apiClient.request({path:c,queryParams:d,body:JSON.stringify(o),httpMethod:"POST",httpOptions:null===(n=t.config)||void 0===n?void 0:n.httpOptions,abortSignal:null===(e=t.config)||void 0===e?void 0:e.abortSignal}).then((t=>t.json())),a.then((t=>Y(this.apiClient,t)))}{const n=function(t,n){const e={},o=s(n,["model"]);null!=o&&l(e,["model"],u(t,o));const i=s(n,["config"]);return null!=i&&l(e,["config"],M(0,i,e)),e}(this.apiClient,t);return c=r("cachedContents",n._url),d=n._query,delete n.config,delete n._url,delete n._query,a=this.apiClient.request({path:c,queryParams:d,body:JSON.stringify(n),httpMethod:"POST",httpOptions:null===(o=t.config)||void 0===o?void 0:o.httpOptions,abortSignal:null===(i=t.config)||void 0===i?void 0:i.abortSignal}).then((t=>t.json())),a.then((t=>J(this.apiClient,t)))}}async get(t){var n,e,o,i;let a,u="",c={};if(this.apiClient.isVertexAI()){const o=function(t,n){const e={},o=s(n,["name"]);null!=o&&l(e,["_url","name"],A(t,o));const i=s(n,["config"]);return null!=i&&l(e,["config"],i),e}(this.apiClient,t);return u=r("{name}",o._url),c=o._query,delete o.config,delete o._url,delete o._query,a=this.apiClient.request({path:u,queryParams:c,body:JSON.stringify(o),httpMethod:"GET",httpOptions:null===(n=t.config)||void 0===n?void 0:n.httpOptions,abortSignal:null===(e=t.config)||void 0===e?void 0:e.abortSignal}).then((t=>t.json())),a.then((t=>Y(this.apiClient,t)))}{const n=function(t,n){const e={},o=s(n,["name"]);null!=o&&l(e,["_url","name"],A(t,o));const i=s(n,["config"]);return null!=i&&l(e,["config"],i),e}(this.apiClient,t);return u=r("{name}",n._url),c=n._query,delete n.config,delete n._url,delete n._query,a=this.apiClient.request({path:u,queryParams:c,body:JSON.stringify(n),httpMethod:"GET",httpOptions:null===(o=t.config)||void 0===o?void 0:o.httpOptions,abortSignal:null===(i=t.config)||void 0===i?void 0:i.abortSignal}).then((t=>t.json())),a.then((t=>J(this.apiClient,t)))}}async delete(t){var n,e,o,i;let a,u="",c={};if(this.apiClient.isVertexAI()){const o=function(t,n){const e={},o=s(n,["name"]);null!=o&&l(e,["_url","name"],A(t,o));const i=s(n,["config"]);return null!=i&&l(e,["config"],i),e}(this.apiClient,t);return u=r("{name}",o._url),c=o._query,delete o.config,delete o._url,delete o._query,a=this.apiClient.request({path:u,queryParams:c,body:JSON.stringify(o),httpMethod:"DELETE",httpOptions:null===(n=t.config)||void 0===n?void 0:n.httpOptions,abortSignal:null===(e=t.config)||void 0===e?void 0:e.abortSignal}).then((t=>t.json())),a.then((()=>{const t={},n=new Xt;return Object.assign(n,t),n}))}{const n=function(t,n){const e={},o=s(n,["name"]);null!=o&&l(e,["_url","name"],A(t,o));const i=s(n,["config"]);return null!=i&&l(e,["config"],i),e}(this.apiClient,t);return u=r("{name}",n._url),c=n._query,delete n.config,delete n._url,delete n._query,a=this.apiClient.request({path:u,queryParams:c,body:JSON.stringify(n),httpMethod:"DELETE",httpOptions:null===(o=t.config)||void 0===o?void 0:o.httpOptions,abortSignal:null===(i=t.config)||void 0===i?void 0:i.abortSignal}).then((t=>t.json())),a.then((()=>{const t={},n=new Xt;return Object.assign(n,t),n}))}}async update(t){var n,e,o,i;let l,s="",a={};if(this.apiClient.isVertexAI()){const o=B(this.apiClient,t);return s=r("{name}",o._url),a=o._query,delete o.config,delete o._url,delete o._query,l=this.apiClient.request({path:s,queryParams:a,body:JSON.stringify(o),httpMethod:"PATCH",httpOptions:null===(n=t.config)||void 0===n?void 0:n.httpOptions,abortSignal:null===(e=t.config)||void 0===e?void 0:e.abortSignal}).then((t=>t.json())),l.then((t=>Y(this.apiClient,t)))}{const n=x(this.apiClient,t);return s=r("{name}",n._url),a=n._query,delete n.config,delete n._url,delete n._query,l=this.apiClient.request({path:s,queryParams:a,body:JSON.stringify(n),httpMethod:"PATCH",httpOptions:null===(o=t.config)||void 0===o?void 0:o.httpOptions,abortSignal:null===(i=t.config)||void 0===i?void 0:i.abortSignal}).then((t=>t.json())),l.then((t=>J(this.apiClient,t)))}}async listInternal(t){var n,e,o,i;let a,u="",c={};if(this.apiClient.isVertexAI()){const o=F(this.apiClient,t);return u=r("cachedContents",o._url),c=o._query,delete o.config,delete o._url,delete o._query,a=this.apiClient.request({path:u,queryParams:c,body:JSON.stringify(o),httpMethod:"GET",httpOptions:null===(n=t.config)||void 0===n?void 0:n.httpOptions,abortSignal:null===(e=t.config)||void 0===e?void 0:e.abortSignal}).then((t=>t.json())),a.then((t=>{const n=function(t,n){const e={},o=s(n,["nextPageToken"]);null!=o&&l(e,["nextPageToken"],o);const i=s(n,["cachedContents"]);if(null!=i){let t=i;Array.isArray(t)&&(t=t.map((t=>Y(0,t)))),l(e,["cachedContents"],t);}return e}(this.apiClient,t),e=new Zt;return Object.assign(e,n),e}))}{const n=U(this.apiClient,t);return u=r("cachedContents",n._url),c=n._query,delete n.config,delete n._url,delete n._query,a=this.apiClient.request({path:u,queryParams:c,body:JSON.stringify(n),httpMethod:"GET",httpOptions:null===(o=t.config)||void 0===o?void 0:o.httpOptions,abortSignal:null===(i=t.config)||void 0===i?void 0:i.abortSignal}).then((t=>t.json())),a.then((t=>{const n=function(t,n){const e={},o=s(n,["nextPageToken"]);null!=o&&l(e,["nextPageToken"],o);const i=s(n,["cachedContents"]);if(null!=i){let t=i;Array.isArray(t)&&(t=t.map((t=>J(0,t)))),l(e,["cachedContents"],t);}return e}(this.apiClient,t),e=new Zt;return Object.assign(e,n),e}))}}}function un(t){var n="function"==typeof Symbol&&Symbol.iterator,e=n&&t[n],o=0;if(e)return e.call(t);if(t&&"number"==typeof t.length)return {next:function(){return t&&o>=t.length&&(t=void 0),{value:t&&t[o++],done:!t}}};throw new TypeError(n?"Object is not iterable.":"Symbol.iterator is not defined.")}function cn(t){return this instanceof cn?(this.v=t,this):new cn(t)}function dn(t,n,e){if(!Symbol.asyncIterator)throw new TypeError("Symbol.asyncIterator is not defined.");var o,i=e.apply(t,n||[]),r=[];return o=Object.create(("function"==typeof AsyncIterator?AsyncIterator:Object).prototype),l("next"),l("throw"),l("return",(function(t){return function(n){return Promise.resolve(n).then(t,u)}})),o[Symbol.asyncIterator]=function(){return this},o;function l(t,n){i[t]&&(o[t]=function(n){return new Promise((function(e,o){r.push([t,n,e,o])>1||s(t,n);}))},n&&(o[t]=n(o[t])));}function s(t,n){try{(e=i[t](n)).value instanceof cn?Promise.resolve(e.value.v).then(a,u):c(r[0][2],e);}catch(t){c(r[0][3],t);}var e;}function a(t){s("next",t);}function u(t){s("throw",t);}function c(t,n){t(n),r.shift(),r.length&&s(r[0][0],r[0][1]);}}function pn(t){if(!Symbol.asyncIterator)throw new TypeError("Symbol.asyncIterator is not defined.");var n,e=t[Symbol.asyncIterator];return e?e.call(t):(t=un(t),n={},o("next"),o("throw"),o("return"),n[Symbol.asyncIterator]=function(){return this},n);function o(e){n[e]=t[e]&&function(n){return new Promise((function(o,i){(function(t,n,e,o){Promise.resolve(o).then((function(n){t({value:n,done:e});}),n);})(o,i,(n=t[e](n)).done,n.value);}))};}}
/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
function fn(t){var n;if(null==t.candidates||0===t.candidates.length)return  false;const e=null===(n=t.candidates[0])||void 0===n?void 0:n.content;return void 0!==e&&hn(e)}function hn(t){if(void 0===t.parts||0===t.parts.length)return  false;for(const n of t.parts){if(void 0===n||0===Object.keys(n).length)return  false;if(void 0!==n.text&&""===n.text)return  false}return  true}"function"==typeof SuppressedError&&SuppressedError;class gn{constructor(t,n){this.modelsModule=t,this.apiClient=n;}create(t){return new mn(this.apiClient,this.modelsModule,t.model,t.config,t.history)}}class mn{constructor(t,n,e,o={},i=[]){this.apiClient=t,this.modelsModule=n,this.model=e,this.config=o,this.history=i,this.sendPromise=Promise.resolve(),function(t){if(0!==t.length){if("user"!==t[0].role)throw new Error("History must start with a user turn.");for(const n of t)if("user"!==n.role&&"model"!==n.role)throw new Error(`Role must be user or model, but got ${n.role}.`)}}(i);}async sendMessage(t){var n;await this.sendPromise;const e=y(this.apiClient,t.message),o=this.modelsModule.generateContent({model:this.model,contents:this.getHistory(true).concat(e),config:null!==(n=t.config)&&void 0!==n?n:this.config});return this.sendPromise=(async()=>{var t,n;const i=null===(n=null===(t=(await o).candidates)||void 0===t?void 0:t[0])||void 0===n?void 0:n.content,r=i?[i]:[];this.recordHistory(e,r);})(),await this.sendPromise,o}async sendMessageStream(t){var n;await this.sendPromise;const e=y(this.apiClient,t.message),o=this.modelsModule.generateContentStream({model:this.model,contents:this.getHistory(true).concat(e),config:null!==(n=t.config)&&void 0!==n?n:this.config});this.sendPromise=o.then((()=>{})).catch((()=>{}));const i=await o;return this.processStreamResponse(i,e)}getHistory(t=false){return t?function(t){if(void 0===t||0===t.length)return [];const n=[],e=t.length;let o=0,i=t[0];for(;o<e;)if("user"===t[o].role)i=t[o],o++;else {const r=[];let l=true;for(;o<e&&"model"===t[o].role;)r.push(t[o]),l&&!hn(t[o])&&(l=false),o++;l&&(n.push(i),n.push(...r));}return n}(this.history):this.history}processStreamResponse(t,n){var e,o;return dn(this,arguments,(function*(){var i,r,l,s;const a=[];try{for(var u,c=!0,d=pn(t);!(i=(u=yield cn(d.next())).done);c=!0){s=u.value,c=!1;const t=s;if(fn(t)){const n=null===(o=null===(e=t.candidates)||void 0===e?void 0:e[0])||void 0===o?void 0:o.content;void 0!==n&&a.push(n);}yield yield cn(t);}}catch(t){r={error:t};}finally{try{c||i||!(l=d.return)||(yield cn(l.call(d)));}finally{if(r)throw r.error}}this.recordHistory(n,a);}))}recordHistory(t,n){let e=[];n.length>0&&n.every((t=>"model"===t.role))?e=n:e.push({role:"model",parts:[]}),this.history.push(t),this.history.push(...e);}}
/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */function yn(t,n){const e={},o=s(n,["config"]);return null!=o&&l(e,["config"],function(t,n,e){const o=s(n,["pageSize"]);void 0!==e&&null!=o&&l(e,["_query","pageSize"],o);const i=s(n,["pageToken"]);return void 0!==e&&null!=i&&l(e,["_query","pageToken"],i),{}}(0,o,e)),e}function vn(t,n){const e={},o=s(n,["name"]);null!=o&&l(e,["name"],o);const i=s(n,["displayName"]);null!=i&&l(e,["displayName"],i);const r=s(n,["mimeType"]);null!=r&&l(e,["mimeType"],r);const a=s(n,["sizeBytes"]);null!=a&&l(e,["sizeBytes"],a);const u=s(n,["createTime"]);null!=u&&l(e,["createTime"],u);const c=s(n,["expirationTime"]);null!=c&&l(e,["expirationTime"],c);const d=s(n,["updateTime"]);null!=d&&l(e,["updateTime"],d);const p=s(n,["sha256Hash"]);null!=p&&l(e,["sha256Hash"],p);const f=s(n,["uri"]);null!=f&&l(e,["uri"],f);const h=s(n,["downloadUri"]);null!=h&&l(e,["downloadUri"],h);const g=s(n,["state"]);null!=g&&l(e,["state"],g);const m=s(n,["source"]);null!=m&&l(e,["source"],m);const y=s(n,["videoMetadata"]);null!=y&&l(e,["videoMetadata"],y);const v=s(n,["error"]);return null!=v&&l(e,["error"],function(t,n){const e={},o=s(n,["details"]);null!=o&&l(e,["details"],o);const i=s(n,["message"]);null!=i&&l(e,["message"],i);const r=s(n,["code"]);return null!=r&&l(e,["code"],r),e}(0,v)),e}function Cn(t,n){const e={},o=s(n,["name"]);null!=o&&l(e,["name"],o);const i=s(n,["displayName"]);null!=i&&l(e,["displayName"],i);const r=s(n,["mimeType"]);null!=r&&l(e,["mimeType"],r);const a=s(n,["sizeBytes"]);null!=a&&l(e,["sizeBytes"],a);const u=s(n,["createTime"]);null!=u&&l(e,["createTime"],u);const c=s(n,["expirationTime"]);null!=c&&l(e,["expirationTime"],c);const d=s(n,["updateTime"]);null!=d&&l(e,["updateTime"],d);const p=s(n,["sha256Hash"]);null!=p&&l(e,["sha256Hash"],p);const f=s(n,["uri"]);null!=f&&l(e,["uri"],f);const h=s(n,["downloadUri"]);null!=h&&l(e,["downloadUri"],h);const g=s(n,["state"]);null!=g&&l(e,["state"],g);const m=s(n,["source"]);null!=m&&l(e,["source"],m);const y=s(n,["videoMetadata"]);null!=y&&l(e,["videoMetadata"],y);const v=s(n,["error"]);return null!=v&&l(e,["error"],function(t,n){const e={},o=s(n,["details"]);null!=o&&l(e,["details"],o);const i=s(n,["message"]);null!=i&&l(e,["message"],i);const r=s(n,["code"]);return null!=r&&l(e,["code"],r),e}(0,v)),e}
/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
class En extends i{constructor(t){super(),this.apiClient=t,this.list=async(t={})=>new bt(K.PAGED_ITEM_FILES,(t=>this.listInternal(t)),await this.listInternal(t),t);}async upload(t){if(this.apiClient.isVertexAI())throw new Error("Vertex AI does not support uploading files. You can share files through a GCS bucket.");return this.apiClient.uploadFile(t.file,t.config).then((t=>Cn(this.apiClient,t)))}async download(t){await this.apiClient.downloadFile(t);}async listInternal(t){var n,e;let o,i="",a={};if(this.apiClient.isVertexAI())throw new Error("This method is only supported by the Gemini Developer API.");{const u=yn(this.apiClient,t);return i=r("files",u._url),a=u._query,delete u.config,delete u._url,delete u._query,o=this.apiClient.request({path:i,queryParams:a,body:JSON.stringify(u),httpMethod:"GET",httpOptions:null===(n=t.config)||void 0===n?void 0:n.httpOptions,abortSignal:null===(e=t.config)||void 0===e?void 0:e.abortSignal}).then((t=>t.json())),o.then((t=>{const n=function(t,n){const e={},o=s(n,["nextPageToken"]);null!=o&&l(e,["nextPageToken"],o);const i=s(n,["files"]);if(null!=i){let t=i;Array.isArray(t)&&(t=t.map((t=>Cn(0,t)))),l(e,["files"],t);}return e}(this.apiClient,t),e=new Qt;return Object.assign(e,n),e}))}}async createInternal(t){var n,e;let o,i="",a={};if(this.apiClient.isVertexAI())throw new Error("This method is only supported by the Gemini Developer API.");{const u=function(t,n){const e={},o=s(n,["file"]);null!=o&&l(e,["file"],vn(0,o));const i=s(n,["config"]);return null!=i&&l(e,["config"],i),e}(this.apiClient,t);return i=r("upload/v1beta/files",u._url),a=u._query,delete u.config,delete u._url,delete u._query,o=this.apiClient.request({path:i,queryParams:a,body:JSON.stringify(u),httpMethod:"POST",httpOptions:null===(n=t.config)||void 0===n?void 0:n.httpOptions,abortSignal:null===(e=t.config)||void 0===e?void 0:e.abortSignal}).then((t=>t.json())),o.then((()=>{const t={},n=new nn;return Object.assign(n,t),n}))}}async get(t){var n,e;let o,i="",a={};if(this.apiClient.isVertexAI())throw new Error("This method is only supported by the Gemini Developer API.");{const u=function(t,n){const e={},o=s(n,["name"]);null!=o&&l(e,["_url","file"],b(0,o));const i=s(n,["config"]);return null!=i&&l(e,["config"],i),e}(this.apiClient,t);return i=r("files/{file}",u._url),a=u._query,delete u.config,delete u._url,delete u._query,o=this.apiClient.request({path:i,queryParams:a,body:JSON.stringify(u),httpMethod:"GET",httpOptions:null===(n=t.config)||void 0===n?void 0:n.httpOptions,abortSignal:null===(e=t.config)||void 0===e?void 0:e.abortSignal}).then((t=>t.json())),o.then((t=>Cn(this.apiClient,t)))}}async delete(t){var n,e;let o,i="",a={};if(this.apiClient.isVertexAI())throw new Error("This method is only supported by the Gemini Developer API.");{const u=function(t,n){const e={},o=s(n,["name"]);null!=o&&l(e,["_url","file"],b(0,o));const i=s(n,["config"]);return null!=i&&l(e,["config"],i),e}(this.apiClient,t);return i=r("files/{file}",u._url),a=u._query,delete u.config,delete u._url,delete u._query,o=this.apiClient.request({path:i,queryParams:a,body:JSON.stringify(u),httpMethod:"DELETE",httpOptions:null===(n=t.config)||void 0===n?void 0:n.httpOptions,abortSignal:null===(e=t.config)||void 0===e?void 0:e.abortSignal}).then((t=>t.json())),o.then((()=>{const t={},n=new en;return Object.assign(n,t),n}))}}}
/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */function Tn(t,n){const e={},o=s(n,["parts"]);if(null!=o){let t=o;Array.isArray(t)&&(t=t.map((t=>function(t,n){const e={};if(void 0!==s(n,["videoMetadata"]))throw new Error("videoMetadata parameter is not supported in Gemini API.");const o=s(n,["thought"]);null!=o&&l(e,["thought"],o);const i=s(n,["codeExecutionResult"]);null!=i&&l(e,["codeExecutionResult"],i);const r=s(n,["executableCode"]);null!=r&&l(e,["executableCode"],r);const a=s(n,["fileData"]);null!=a&&l(e,["fileData"],a);const u=s(n,["functionCall"]);null!=u&&l(e,["functionCall"],u);const c=s(n,["functionResponse"]);null!=c&&l(e,["functionResponse"],c);const d=s(n,["inlineData"]);null!=d&&l(e,["inlineData"],d);const p=s(n,["text"]);return null!=p&&l(e,["text"],p),e}(0,t)))),l(e,["parts"],t);}const i=s(n,["role"]);return null!=i&&l(e,["role"],i),e}function _n(t,n){const e={},o=s(n,["parts"]);if(null!=o){let t=o;Array.isArray(t)&&(t=t.map((t=>function(t,n){const e={},o=s(n,["videoMetadata"]);null!=o&&l(e,["videoMetadata"],o);const i=s(n,["thought"]);null!=i&&l(e,["thought"],i);const r=s(n,["codeExecutionResult"]);null!=r&&l(e,["codeExecutionResult"],r);const a=s(n,["executableCode"]);null!=a&&l(e,["executableCode"],a);const u=s(n,["fileData"]);null!=u&&l(e,["fileData"],u);const c=s(n,["functionCall"]);null!=c&&l(e,["functionCall"],c);const d=s(n,["functionResponse"]);null!=d&&l(e,["functionResponse"],d);const p=s(n,["inlineData"]);null!=p&&l(e,["inlineData"],p);const f=s(n,["text"]);return null!=f&&l(e,["text"],f),e}(0,t)))),l(e,["parts"],t);}const i=s(n,["role"]);return null!=i&&l(e,["role"],i),e}function On(t,n){const e={},o=s(n,["dynamicRetrievalConfig"]);return null!=o&&l(e,["dynamicRetrievalConfig"],function(t,n){const e={},o=s(n,["mode"]);null!=o&&l(e,["mode"],o);const i=s(n,["dynamicThreshold"]);return null!=i&&l(e,["dynamicThreshold"],i),e}(0,o)),e}function An(t,n){const e={},o=s(n,["dynamicRetrievalConfig"]);return null!=o&&l(e,["dynamicRetrievalConfig"],function(t,n){const e={},o=s(n,["mode"]);null!=o&&l(e,["mode"],o);const i=s(n,["dynamicThreshold"]);return null!=i&&l(e,["dynamicThreshold"],i),e}(0,o)),e}function In(t,n){const e={},o=s(n,["apiKeyConfig"]);null!=o&&l(e,["apiKeyConfig"],function(t,n){const e={},o=s(n,["apiKeyString"]);return null!=o&&l(e,["apiKeyString"],o),e}(0,o));const i=s(n,["authType"]);null!=i&&l(e,["authType"],i);const r=s(n,["googleServiceAccountConfig"]);null!=r&&l(e,["googleServiceAccountConfig"],r);const a=s(n,["httpBasicAuthConfig"]);null!=a&&l(e,["httpBasicAuthConfig"],a);const u=s(n,["oauthConfig"]);null!=u&&l(e,["oauthConfig"],u);const c=s(n,["oidcConfig"]);return null!=c&&l(e,["oidcConfig"],c),e}function Sn(t,n){const e={},o=s(n,["retrieval"]);null!=o&&l(e,["retrieval"],o);null!=s(n,["googleSearch"])&&l(e,["googleSearch"],{});const i=s(n,["googleSearchRetrieval"]);null!=i&&l(e,["googleSearchRetrieval"],An(0,i));null!=s(n,["enterpriseWebSearch"])&&l(e,["enterpriseWebSearch"],{});const r=s(n,["googleMaps"]);null!=r&&l(e,["googleMaps"],function(t,n){const e={},o=s(n,["authConfig"]);return null!=o&&l(e,["authConfig"],In(0,o)),e}(0,r));const a=s(n,["codeExecution"]);null!=a&&l(e,["codeExecution"],a);const u=s(n,["functionDeclarations"]);return null!=u&&l(e,["functionDeclarations"],u),e}function bn(t,n){const e={},o=s(n,["automaticActivityDetection"]);null!=o&&l(e,["automaticActivityDetection"],function(t,n){const e={},o=s(n,["disabled"]);null!=o&&l(e,["disabled"],o);const i=s(n,["startOfSpeechSensitivity"]);null!=i&&l(e,["startOfSpeechSensitivity"],i);const r=s(n,["endOfSpeechSensitivity"]);null!=r&&l(e,["endOfSpeechSensitivity"],r);const a=s(n,["prefixPaddingMs"]);null!=a&&l(e,["prefixPaddingMs"],a);const u=s(n,["silenceDurationMs"]);return null!=u&&l(e,["silenceDurationMs"],u),e}(0,o));const i=s(n,["activityHandling"]);null!=i&&l(e,["activityHandling"],i);const r=s(n,["turnCoverage"]);return null!=r&&l(e,["turnCoverage"],r),e}function wn(t,n){const e={},o=s(n,["automaticActivityDetection"]);null!=o&&l(e,["automaticActivityDetection"],function(t,n){const e={},o=s(n,["disabled"]);null!=o&&l(e,["disabled"],o);const i=s(n,["startOfSpeechSensitivity"]);null!=i&&l(e,["startOfSpeechSensitivity"],i);const r=s(n,["endOfSpeechSensitivity"]);null!=r&&l(e,["endOfSpeechSensitivity"],r);const a=s(n,["prefixPaddingMs"]);null!=a&&l(e,["prefixPaddingMs"],a);const u=s(n,["silenceDurationMs"]);return null!=u&&l(e,["silenceDurationMs"],u),e}(0,o));const i=s(n,["activityHandling"]);null!=i&&l(e,["activityHandling"],i);const r=s(n,["turnCoverage"]);return null!=r&&l(e,["turnCoverage"],r),e}function Pn(t,n){const e={},o=s(n,["triggerTokens"]);null!=o&&l(e,["triggerTokens"],o);const i=s(n,["slidingWindow"]);return null!=i&&l(e,["slidingWindow"],function(t,n){const e={},o=s(n,["targetTokens"]);return null!=o&&l(e,["targetTokens"],o),e}(0,i)),e}function Nn(t,n){const e={},o=s(n,["triggerTokens"]);null!=o&&l(e,["triggerTokens"],o);const i=s(n,["slidingWindow"]);return null!=i&&l(e,["slidingWindow"],function(t,n){const e={},o=s(n,["targetTokens"]);return null!=o&&l(e,["targetTokens"],o),e}(0,i)),e}function Rn(t,n,e){const o=s(n,["generationConfig"]);void 0!==e&&null!=o&&l(e,["setup","generationConfig"],o);const i=s(n,["responseModalities"]);void 0!==e&&null!=i&&l(e,["setup","generationConfig","responseModalities"],i);const r=s(n,["temperature"]);void 0!==e&&null!=r&&l(e,["setup","generationConfig","temperature"],r);const a=s(n,["topP"]);void 0!==e&&null!=a&&l(e,["setup","generationConfig","topP"],a);const u=s(n,["topK"]);void 0!==e&&null!=u&&l(e,["setup","generationConfig","topK"],u);const c=s(n,["maxOutputTokens"]);void 0!==e&&null!=c&&l(e,["setup","generationConfig","maxOutputTokens"],c);const d=s(n,["mediaResolution"]);void 0!==e&&null!=d&&l(e,["setup","generationConfig","mediaResolution"],d);const p=s(n,["seed"]);void 0!==e&&null!=p&&l(e,["setup","generationConfig","seed"],p);const f=s(n,["speechConfig"]);void 0!==e&&null!=f&&l(e,["setup","generationConfig","speechConfig"],f);const h=s(n,["systemInstruction"]);void 0!==e&&null!=h&&l(e,["setup","systemInstruction"],Tn(0,y(0,h)));const g=s(n,["tools"]);if(void 0!==e&&null!=g){let t=O(0,g);Array.isArray(t)&&(t=t.map((t=>function(t,n){const e={};if(void 0!==s(n,["retrieval"]))throw new Error("retrieval parameter is not supported in Gemini API.");null!=s(n,["googleSearch"])&&l(e,["googleSearch"],{});const o=s(n,["googleSearchRetrieval"]);if(null!=o&&l(e,["googleSearchRetrieval"],On(0,o)),void 0!==s(n,["enterpriseWebSearch"]))throw new Error("enterpriseWebSearch parameter is not supported in Gemini API.");if(void 0!==s(n,["googleMaps"]))throw new Error("googleMaps parameter is not supported in Gemini API.");const i=s(n,["codeExecution"]);null!=i&&l(e,["codeExecution"],i);const r=s(n,["functionDeclarations"]);return null!=r&&l(e,["functionDeclarations"],r),e}(0,_(0,t))))),l(e,["setup","tools"],t);}const m=s(n,["sessionResumption"]);void 0!==e&&null!=m&&l(e,["setup","sessionResumption"],function(t,n){const e={},o=s(n,["handle"]);if(null!=o&&l(e,["handle"],o),void 0!==s(n,["transparent"]))throw new Error("transparent parameter is not supported in Gemini API.");return e}(0,m));const v=s(n,["inputAudioTranscription"]);void 0!==e&&null!=v&&l(e,["setup","inputAudioTranscription"],{});const C=s(n,["outputAudioTranscription"]);void 0!==e&&null!=C&&l(e,["setup","outputAudioTranscription"],{});const E=s(n,["realtimeInputConfig"]);void 0!==e&&null!=E&&l(e,["setup","realtimeInputConfig"],bn(0,E));const T=s(n,["contextWindowCompression"]);return void 0!==e&&null!=T&&l(e,["setup","contextWindowCompression"],Pn(0,T)),{}}function Dn(t,n,e){const o=s(n,["generationConfig"]);void 0!==e&&null!=o&&l(e,["setup","generationConfig"],o);const i=s(n,["responseModalities"]);void 0!==e&&null!=i&&l(e,["setup","generationConfig","responseModalities"],i);const r=s(n,["temperature"]);void 0!==e&&null!=r&&l(e,["setup","generationConfig","temperature"],r);const a=s(n,["topP"]);void 0!==e&&null!=a&&l(e,["setup","generationConfig","topP"],a);const u=s(n,["topK"]);void 0!==e&&null!=u&&l(e,["setup","generationConfig","topK"],u);const c=s(n,["maxOutputTokens"]);void 0!==e&&null!=c&&l(e,["setup","generationConfig","maxOutputTokens"],c);const d=s(n,["mediaResolution"]);void 0!==e&&null!=d&&l(e,["setup","generationConfig","mediaResolution"],d);const p=s(n,["seed"]);void 0!==e&&null!=p&&l(e,["setup","generationConfig","seed"],p);const f=s(n,["speechConfig"]);void 0!==e&&null!=f&&l(e,["setup","generationConfig","speechConfig"],f);const h=s(n,["systemInstruction"]);void 0!==e&&null!=h&&l(e,["setup","systemInstruction"],_n(0,y(0,h)));const g=s(n,["tools"]);if(void 0!==e&&null!=g){let t=O(0,g);Array.isArray(t)&&(t=t.map((t=>Sn(0,_(0,t))))),l(e,["setup","tools"],t);}const m=s(n,["sessionResumption"]);void 0!==e&&null!=m&&l(e,["setup","sessionResumption"],function(t,n){const e={},o=s(n,["handle"]);null!=o&&l(e,["handle"],o);const i=s(n,["transparent"]);return null!=i&&l(e,["transparent"],i),e}(0,m));const v=s(n,["inputAudioTranscription"]);void 0!==e&&null!=v&&l(e,["setup","inputAudioTranscription"],{});const C=s(n,["outputAudioTranscription"]);void 0!==e&&null!=C&&l(e,["setup","outputAudioTranscription"],{});const E=s(n,["realtimeInputConfig"]);void 0!==e&&null!=E&&l(e,["setup","realtimeInputConfig"],wn(0,E));const T=s(n,["contextWindowCompression"]);return void 0!==e&&null!=T&&l(e,["setup","contextWindowCompression"],Nn(0,T)),{}}function Mn(t,n){const e={},o=s(n,["media"]);null!=o&&l(e,["mediaChunks"],c(t,o));const i=s(n,["audio"]);null!=i&&l(e,["audio"],function(t,n){const e=d(0,n);if(e.mimeType&&e.mimeType.startsWith("audio/"))return e;throw new Error(`Unsupported mime type: ${e.mimeType}`)}(0,i));const r=s(n,["audioStreamEnd"]);null!=r&&l(e,["audioStreamEnd"],r);const a=s(n,["video"]);null!=a&&l(e,["video"],function(t,n){const e=d(0,n);if(e.mimeType&&e.mimeType.startsWith("image/"))return e;throw new Error(`Unsupported mime type: ${e.mimeType}`)}(0,a));const u=s(n,["text"]);null!=u&&l(e,["text"],u);null!=s(n,["activityStart"])&&l(e,["activityStart"],{});return null!=s(n,["activityEnd"])&&l(e,["activityEnd"],{}),e}function xn(t,n){const e={},o=s(n,["media"]);if(null!=o&&l(e,["mediaChunks"],c(t,o)),void 0!==s(n,["audio"]))throw new Error("audio parameter is not supported in Vertex AI.");const i=s(n,["audioStreamEnd"]);if(null!=i&&l(e,["audioStreamEnd"],i),void 0!==s(n,["video"]))throw new Error("video parameter is not supported in Vertex AI.");if(void 0!==s(n,["text"]))throw new Error("text parameter is not supported in Vertex AI.");null!=s(n,["activityStart"])&&l(e,["activityStart"],{});return null!=s(n,["activityEnd"])&&l(e,["activityEnd"],{}),e}function Un(t,n){const e={},o=s(n,["parts"]);if(null!=o){let t=o;Array.isArray(t)&&(t=t.map((t=>function(t,n){const e={},o=s(n,["thought"]);null!=o&&l(e,["thought"],o);const i=s(n,["codeExecutionResult"]);null!=i&&l(e,["codeExecutionResult"],i);const r=s(n,["executableCode"]);null!=r&&l(e,["executableCode"],r);const a=s(n,["fileData"]);null!=a&&l(e,["fileData"],a);const u=s(n,["functionCall"]);null!=u&&l(e,["functionCall"],u);const c=s(n,["functionResponse"]);null!=c&&l(e,["functionResponse"],c);const d=s(n,["inlineData"]);null!=d&&l(e,["inlineData"],d);const p=s(n,["text"]);return null!=p&&l(e,["text"],p),e}(0,t)))),l(e,["parts"],t);}const i=s(n,["role"]);return null!=i&&l(e,["role"],i),e}function qn(t,n){const e={},o=s(n,["parts"]);if(null!=o){let t=o;Array.isArray(t)&&(t=t.map((t=>function(t,n){const e={},o=s(n,["videoMetadata"]);null!=o&&l(e,["videoMetadata"],o);const i=s(n,["thought"]);null!=i&&l(e,["thought"],i);const r=s(n,["codeExecutionResult"]);null!=r&&l(e,["codeExecutionResult"],r);const a=s(n,["executableCode"]);null!=a&&l(e,["executableCode"],a);const u=s(n,["fileData"]);null!=u&&l(e,["fileData"],u);const c=s(n,["functionCall"]);null!=c&&l(e,["functionCall"],c);const d=s(n,["functionResponse"]);null!=d&&l(e,["functionResponse"],d);const p=s(n,["inlineData"]);null!=p&&l(e,["inlineData"],p);const f=s(n,["text"]);return null!=f&&l(e,["text"],f),e}(0,t)))),l(e,["parts"],t);}const i=s(n,["role"]);return null!=i&&l(e,["role"],i),e}function Ln(t,n){const e={},o=s(n,["text"]);null!=o&&l(e,["text"],o);const i=s(n,["finished"]);return null!=i&&l(e,["finished"],i),e}function Gn(t,n){const e={},o=s(n,["text"]);null!=o&&l(e,["text"],o);const i=s(n,["finished"]);return null!=i&&l(e,["finished"],i),e}function kn(t,n){const e={},o=s(n,["functionCalls"]);if(null!=o){let t=o;Array.isArray(t)&&(t=t.map((t=>function(t,n){const e={},o=s(n,["id"]);null!=o&&l(e,["id"],o);const i=s(n,["args"]);null!=i&&l(e,["args"],i);const r=s(n,["name"]);return null!=r&&l(e,["name"],r),e}(0,t)))),l(e,["functionCalls"],t);}return e}function jn(t,n){const e={},o=s(n,["functionCalls"]);if(null!=o){let t=o;Array.isArray(t)&&(t=t.map((t=>function(t,n){const e={},o=s(n,["args"]);null!=o&&l(e,["args"],o);const i=s(n,["name"]);return null!=i&&l(e,["name"],i),e}(0,t)))),l(e,["functionCalls"],t);}return e}function Hn(t,n){const e={},o=s(n,["modality"]);null!=o&&l(e,["modality"],o);const i=s(n,["tokenCount"]);return null!=i&&l(e,["tokenCount"],i),e}function Vn(t,n){const e={},o=s(n,["modality"]);null!=o&&l(e,["modality"],o);const i=s(n,["tokenCount"]);return null!=i&&l(e,["tokenCount"],i),e}function Bn(t,n){const e={};null!=s(n,["setupComplete"])&&l(e,["setupComplete"],{});const o=s(n,["serverContent"]);null!=o&&l(e,["serverContent"],function(t,n){const e={},o=s(n,["modelTurn"]);null!=o&&l(e,["modelTurn"],Un(0,o));const i=s(n,["turnComplete"]);null!=i&&l(e,["turnComplete"],i);const r=s(n,["interrupted"]);null!=r&&l(e,["interrupted"],r);const a=s(n,["groundingMetadata"]);null!=a&&l(e,["groundingMetadata"],a);const u=s(n,["generationComplete"]);null!=u&&l(e,["generationComplete"],u);const c=s(n,["inputTranscription"]);null!=c&&l(e,["inputTranscription"],Ln(0,c));const d=s(n,["outputTranscription"]);return null!=d&&l(e,["outputTranscription"],Ln(0,d)),e}(0,o));const i=s(n,["toolCall"]);null!=i&&l(e,["toolCall"],kn(0,i));const r=s(n,["toolCallCancellation"]);null!=r&&l(e,["toolCallCancellation"],function(t,n){const e={},o=s(n,["ids"]);return null!=o&&l(e,["ids"],o),e}(0,r));const a=s(n,["usageMetadata"]);null!=a&&l(e,["usageMetadata"],function(t,n){const e={},o=s(n,["promptTokenCount"]);null!=o&&l(e,["promptTokenCount"],o);const i=s(n,["cachedContentTokenCount"]);null!=i&&l(e,["cachedContentTokenCount"],i);const r=s(n,["responseTokenCount"]);null!=r&&l(e,["responseTokenCount"],r);const a=s(n,["toolUsePromptTokenCount"]);null!=a&&l(e,["toolUsePromptTokenCount"],a);const u=s(n,["thoughtsTokenCount"]);null!=u&&l(e,["thoughtsTokenCount"],u);const c=s(n,["totalTokenCount"]);null!=c&&l(e,["totalTokenCount"],c);const d=s(n,["promptTokensDetails"]);if(null!=d){let t=d;Array.isArray(t)&&(t=t.map((t=>Hn(0,t)))),l(e,["promptTokensDetails"],t);}const p=s(n,["cacheTokensDetails"]);if(null!=p){let t=p;Array.isArray(t)&&(t=t.map((t=>Hn(0,t)))),l(e,["cacheTokensDetails"],t);}const f=s(n,["responseTokensDetails"]);if(null!=f){let t=f;Array.isArray(t)&&(t=t.map((t=>Hn(0,t)))),l(e,["responseTokensDetails"],t);}const h=s(n,["toolUsePromptTokensDetails"]);if(null!=h){let t=h;Array.isArray(t)&&(t=t.map((t=>Hn(0,t)))),l(e,["toolUsePromptTokensDetails"],t);}return e}(0,a));const u=s(n,["goAway"]);null!=u&&l(e,["goAway"],function(t,n){const e={},o=s(n,["timeLeft"]);return null!=o&&l(e,["timeLeft"],o),e}(0,u));const c=s(n,["sessionResumptionUpdate"]);return null!=c&&l(e,["sessionResumptionUpdate"],function(t,n){const e={},o=s(n,["newHandle"]);null!=o&&l(e,["newHandle"],o);const i=s(n,["resumable"]);null!=i&&l(e,["resumable"],i);const r=s(n,["lastConsumedClientMessageIndex"]);return null!=r&&l(e,["lastConsumedClientMessageIndex"],r),e}(0,c)),e}function Fn(t,n){const e={};null!=s(n,["setupComplete"])&&l(e,["setupComplete"],{});const o=s(n,["serverContent"]);null!=o&&l(e,["serverContent"],function(t,n){const e={},o=s(n,["modelTurn"]);null!=o&&l(e,["modelTurn"],qn(0,o));const i=s(n,["turnComplete"]);null!=i&&l(e,["turnComplete"],i);const r=s(n,["interrupted"]);null!=r&&l(e,["interrupted"],r);const a=s(n,["groundingMetadata"]);null!=a&&l(e,["groundingMetadata"],a);const u=s(n,["generationComplete"]);null!=u&&l(e,["generationComplete"],u);const c=s(n,["inputTranscription"]);null!=c&&l(e,["inputTranscription"],Gn(0,c));const d=s(n,["outputTranscription"]);return null!=d&&l(e,["outputTranscription"],Gn(0,d)),e}(0,o));const i=s(n,["toolCall"]);null!=i&&l(e,["toolCall"],jn(0,i));const r=s(n,["toolCallCancellation"]);null!=r&&l(e,["toolCallCancellation"],function(t,n){const e={},o=s(n,["ids"]);return null!=o&&l(e,["ids"],o),e}(0,r));const a=s(n,["usageMetadata"]);null!=a&&l(e,["usageMetadata"],function(t,n){const e={},o=s(n,["promptTokenCount"]);null!=o&&l(e,["promptTokenCount"],o);const i=s(n,["cachedContentTokenCount"]);null!=i&&l(e,["cachedContentTokenCount"],i);const r=s(n,["candidatesTokenCount"]);null!=r&&l(e,["responseTokenCount"],r);const a=s(n,["toolUsePromptTokenCount"]);null!=a&&l(e,["toolUsePromptTokenCount"],a);const u=s(n,["thoughtsTokenCount"]);null!=u&&l(e,["thoughtsTokenCount"],u);const c=s(n,["totalTokenCount"]);null!=c&&l(e,["totalTokenCount"],c);const d=s(n,["promptTokensDetails"]);if(null!=d){let t=d;Array.isArray(t)&&(t=t.map((t=>Vn(0,t)))),l(e,["promptTokensDetails"],t);}const p=s(n,["cacheTokensDetails"]);if(null!=p){let t=p;Array.isArray(t)&&(t=t.map((t=>Vn(0,t)))),l(e,["cacheTokensDetails"],t);}const f=s(n,["candidatesTokensDetails"]);if(null!=f){let t=f;Array.isArray(t)&&(t=t.map((t=>Vn(0,t)))),l(e,["responseTokensDetails"],t);}const h=s(n,["toolUsePromptTokensDetails"]);if(null!=h){let t=h;Array.isArray(t)&&(t=t.map((t=>Vn(0,t)))),l(e,["toolUsePromptTokensDetails"],t);}const g=s(n,["trafficType"]);return null!=g&&l(e,["trafficType"],g),e}(0,a));const u=s(n,["goAway"]);null!=u&&l(e,["goAway"],function(t,n){const e={},o=s(n,["timeLeft"]);return null!=o&&l(e,["timeLeft"],o),e}(0,u));const c=s(n,["sessionResumptionUpdate"]);return null!=c&&l(e,["sessionResumptionUpdate"],function(t,n){const e={},o=s(n,["newHandle"]);null!=o&&l(e,["newHandle"],o);const i=s(n,["resumable"]);null!=i&&l(e,["resumable"],i);const r=s(n,["lastConsumedClientMessageIndex"]);return null!=r&&l(e,["lastConsumedClientMessageIndex"],r),e}(0,c)),e}
/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */function Jn(t,n){const e={},o=s(n,["parts"]);if(null!=o){let t=o;Array.isArray(t)&&(t=t.map((t=>function(t,n){const e={};if(void 0!==s(n,["videoMetadata"]))throw new Error("videoMetadata parameter is not supported in Gemini API.");const o=s(n,["thought"]);null!=o&&l(e,["thought"],o);const i=s(n,["codeExecutionResult"]);null!=i&&l(e,["codeExecutionResult"],i);const r=s(n,["executableCode"]);null!=r&&l(e,["executableCode"],r);const a=s(n,["fileData"]);null!=a&&l(e,["fileData"],a);const u=s(n,["functionCall"]);null!=u&&l(e,["functionCall"],u);const c=s(n,["functionResponse"]);null!=c&&l(e,["functionResponse"],c);const d=s(n,["inlineData"]);null!=d&&l(e,["inlineData"],d);const p=s(n,["text"]);return null!=p&&l(e,["text"],p),e}(0,t)))),l(e,["parts"],t);}const i=s(n,["role"]);return null!=i&&l(e,["role"],i),e}function Yn(t,n){const e={},o=s(n,["dynamicRetrievalConfig"]);return null!=o&&l(e,["dynamicRetrievalConfig"],function(t,n){const e={},o=s(n,["mode"]);null!=o&&l(e,["mode"],o);const i=s(n,["dynamicThreshold"]);return null!=i&&l(e,["dynamicThreshold"],i),e}(0,o)),e}function Kn(t,n){const e={},o=s(n,["functionCallingConfig"]);if(null!=o&&l(e,["functionCallingConfig"],function(t,n){const e={},o=s(n,["mode"]);null!=o&&l(e,["mode"],o);const i=s(n,["allowedFunctionNames"]);return null!=i&&l(e,["allowedFunctionNames"],i),e}(0,o)),void 0!==s(n,["retrievalConfig"]))throw new Error("retrievalConfig parameter is not supported in Gemini API.");return e}function Wn(t,n){const e={},o=s(n,["prebuiltVoiceConfig"]);return null!=o&&l(e,["prebuiltVoiceConfig"],function(t,n){const e={},o=s(n,["voiceName"]);return null!=o&&l(e,["voiceName"],o),e}(0,o)),e}function $n(t,n,e){const o={},i=s(n,["systemInstruction"]);void 0!==e&&null!=i&&l(e,["systemInstruction"],Jn(0,y(0,i)));const r=s(n,["temperature"]);null!=r&&l(o,["temperature"],r);const a=s(n,["topP"]);null!=a&&l(o,["topP"],a);const u=s(n,["topK"]);null!=u&&l(o,["topK"],u);const c=s(n,["candidateCount"]);null!=c&&l(o,["candidateCount"],c);const d=s(n,["maxOutputTokens"]);null!=d&&l(o,["maxOutputTokens"],d);const p=s(n,["stopSequences"]);null!=p&&l(o,["stopSequences"],p);const f=s(n,["responseLogprobs"]);null!=f&&l(o,["responseLogprobs"],f);const h=s(n,["logprobs"]);null!=h&&l(o,["logprobs"],h);const g=s(n,["presencePenalty"]);null!=g&&l(o,["presencePenalty"],g);const m=s(n,["frequencyPenalty"]);null!=m&&l(o,["frequencyPenalty"],m);const v=s(n,["seed"]);null!=v&&l(o,["seed"],v);const C=s(n,["responseMimeType"]);null!=C&&l(o,["responseMimeType"],C);const I=s(n,["responseSchema"]);if(null!=I&&l(o,["responseSchema"],E(0,I)),void 0!==s(n,["routingConfig"]))throw new Error("routingConfig parameter is not supported in Gemini API.");if(void 0!==s(n,["modelSelectionConfig"]))throw new Error("modelSelectionConfig parameter is not supported in Gemini API.");const S=s(n,["safetySettings"]);if(void 0!==e&&null!=S){let t=S;Array.isArray(t)&&(t=t.map((t=>function(t,n){const e={};if(void 0!==s(n,["method"]))throw new Error("method parameter is not supported in Gemini API.");const o=s(n,["category"]);null!=o&&l(e,["category"],o);const i=s(n,["threshold"]);return null!=i&&l(e,["threshold"],i),e}(0,t)))),l(e,["safetySettings"],t);}const b=s(n,["tools"]);if(void 0!==e&&null!=b){let t=O(0,b);Array.isArray(t)&&(t=t.map((t=>function(t,n){const e={};if(void 0!==s(n,["retrieval"]))throw new Error("retrieval parameter is not supported in Gemini API.");null!=s(n,["googleSearch"])&&l(e,["googleSearch"],{});const o=s(n,["googleSearchRetrieval"]);if(null!=o&&l(e,["googleSearchRetrieval"],Yn(0,o)),void 0!==s(n,["enterpriseWebSearch"]))throw new Error("enterpriseWebSearch parameter is not supported in Gemini API.");if(void 0!==s(n,["googleMaps"]))throw new Error("googleMaps parameter is not supported in Gemini API.");const i=s(n,["codeExecution"]);null!=i&&l(e,["codeExecution"],i);const r=s(n,["functionDeclarations"]);return null!=r&&l(e,["functionDeclarations"],r),e}(0,_(0,t))))),l(e,["tools"],t);}const w=s(n,["toolConfig"]);if(void 0!==e&&null!=w&&l(e,["toolConfig"],Kn(0,w)),void 0!==s(n,["labels"]))throw new Error("labels parameter is not supported in Gemini API.");const P=s(n,["cachedContent"]);void 0!==e&&null!=P&&l(e,["cachedContent"],A(t,P));const N=s(n,["responseModalities"]);null!=N&&l(o,["responseModalities"],N);const R=s(n,["mediaResolution"]);null!=R&&l(o,["mediaResolution"],R);const D=s(n,["speechConfig"]);if(null!=D&&l(o,["speechConfig"],function(t,n){const e={},o=s(n,["voiceConfig"]);null!=o&&l(e,["voiceConfig"],Wn(0,o));const i=s(n,["languageCode"]);return null!=i&&l(e,["languageCode"],i),e}(0,T(0,D))),void 0!==s(n,["audioTimestamp"]))throw new Error("audioTimestamp parameter is not supported in Gemini API.");const M=s(n,["thinkingConfig"]);return null!=M&&l(o,["thinkingConfig"],function(t,n){const e={},o=s(n,["includeThoughts"]);null!=o&&l(e,["includeThoughts"],o);const i=s(n,["thinkingBudget"]);return null!=i&&l(e,["thinkingBudget"],i),e}(0,M)),o}function zn(t,n){const e={},o=s(n,["model"]);null!=o&&l(e,["_url","model"],a(t,o));const i=s(n,["contents"]);if(null!=i){let t=C(0,i);Array.isArray(t)&&(t=t.map((t=>Jn(0,t)))),l(e,["contents"],t);}const r=s(n,["config"]);return null!=r&&l(e,["generationConfig"],$n(t,r,e)),e}function Xn(t,n){const e={},o=s(n,["model"]);null!=o&&l(e,["_url","model"],a(t,o));const i=s(n,["contents"]);null!=i&&l(e,["requests[]","content"],v(t,i));const r=s(n,["config"]);null!=r&&l(e,["config"],function(t,n,e){const o=s(n,["taskType"]);void 0!==e&&null!=o&&l(e,["requests[]","taskType"],o);const i=s(n,["title"]);void 0!==e&&null!=i&&l(e,["requests[]","title"],i);const r=s(n,["outputDimensionality"]);if(void 0!==e&&null!=r&&l(e,["requests[]","outputDimensionality"],r),void 0!==s(n,["mimeType"]))throw new Error("mimeType parameter is not supported in Gemini API.");if(void 0!==s(n,["autoTruncate"]))throw new Error("autoTruncate parameter is not supported in Gemini API.");return {}}(0,r,e));const u=s(n,["model"]);return void 0!==u&&l(e,["requests[]","model"],a(t,u)),e}function Zn(t,n){const e={},o=s(n,["model"]);null!=o&&l(e,["_url","model"],a(t,o));const i=s(n,["prompt"]);null!=i&&l(e,["instances[0]","prompt"],i);const r=s(n,["config"]);return null!=r&&l(e,["config"],function(t,n,e){if(void 0!==s(n,["outputGcsUri"]))throw new Error("outputGcsUri parameter is not supported in Gemini API.");if(void 0!==s(n,["negativePrompt"]))throw new Error("negativePrompt parameter is not supported in Gemini API.");const o=s(n,["numberOfImages"]);void 0!==e&&null!=o&&l(e,["parameters","sampleCount"],o);const i=s(n,["aspectRatio"]);void 0!==e&&null!=i&&l(e,["parameters","aspectRatio"],i);const r=s(n,["guidanceScale"]);if(void 0!==e&&null!=r&&l(e,["parameters","guidanceScale"],r),void 0!==s(n,["seed"]))throw new Error("seed parameter is not supported in Gemini API.");const a=s(n,["safetyFilterLevel"]);void 0!==e&&null!=a&&l(e,["parameters","safetySetting"],a);const u=s(n,["personGeneration"]);void 0!==e&&null!=u&&l(e,["parameters","personGeneration"],u);const c=s(n,["includeSafetyAttributes"]);void 0!==e&&null!=c&&l(e,["parameters","includeSafetyAttributes"],c);const d=s(n,["includeRaiReason"]);void 0!==e&&null!=d&&l(e,["parameters","includeRaiReason"],d);const p=s(n,["language"]);void 0!==e&&null!=p&&l(e,["parameters","language"],p);const f=s(n,["outputMimeType"]);void 0!==e&&null!=f&&l(e,["parameters","outputOptions","mimeType"],f);const h=s(n,["outputCompressionQuality"]);if(void 0!==e&&null!=h&&l(e,["parameters","outputOptions","compressionQuality"],h),void 0!==s(n,["addWatermark"]))throw new Error("addWatermark parameter is not supported in Gemini API.");if(void 0!==s(n,["enhancePrompt"]))throw new Error("enhancePrompt parameter is not supported in Gemini API.");return {}}(0,r,e)),e}function Qn(t,n){const e={},o=s(n,["config"]);return null!=o&&l(e,["config"],function(t,n,e){const o=s(n,["pageSize"]);void 0!==e&&null!=o&&l(e,["_query","pageSize"],o);const i=s(n,["pageToken"]);void 0!==e&&null!=i&&l(e,["_query","pageToken"],i);const r=s(n,["filter"]);void 0!==e&&null!=r&&l(e,["_query","filter"],r);const a=s(n,["queryBase"]);return void 0!==e&&null!=a&&l(e,["_url","models_url"],w(t,a)),{}}(t,o,e)),e}function te(t,n){const e={},o=s(n,["model"]);null!=o&&l(e,["_url","name"],a(t,o));const i=s(n,["config"]);return null!=i&&l(e,["config"],function(t,n,e){const o=s(n,["displayName"]);void 0!==e&&null!=o&&l(e,["displayName"],o);const i=s(n,["description"]);return void 0!==e&&null!=i&&l(e,["description"],i),{}}(0,i,e)),e}function ne(t,n){const e={},o=s(n,["model"]);null!=o&&l(e,["_url","model"],a(t,o));const i=s(n,["contents"]);if(null!=i){let t=C(0,i);Array.isArray(t)&&(t=t.map((t=>Jn(0,t)))),l(e,["contents"],t);}const r=s(n,["config"]);return null!=r&&l(e,["config"],function(t,n){if(void 0!==s(n,["systemInstruction"]))throw new Error("systemInstruction parameter is not supported in Gemini API.");if(void 0!==s(n,["tools"]))throw new Error("tools parameter is not supported in Gemini API.");if(void 0!==s(n,["generationConfig"]))throw new Error("generationConfig parameter is not supported in Gemini API.");return {}}(0,r)),e}function ee(t,n){const e={},o=s(n,["model"]);null!=o&&l(e,["_url","model"],a(t,o));const i=s(n,["prompt"]);null!=i&&l(e,["instances[0]","prompt"],i);const r=s(n,["image"]);null!=r&&l(e,["instances[0]","image"],function(t,n){const e={};if(void 0!==s(n,["gcsUri"]))throw new Error("gcsUri parameter is not supported in Gemini API.");const o=s(n,["imageBytes"]);null!=o&&l(e,["bytesBase64Encoded"],S(0,o));const i=s(n,["mimeType"]);return null!=i&&l(e,["mimeType"],i),e}(0,r));const u=s(n,["config"]);return null!=u&&l(e,["config"],function(t,n,e){const o=s(n,["numberOfVideos"]);if(void 0!==e&&null!=o&&l(e,["parameters","sampleCount"],o),void 0!==s(n,["outputGcsUri"]))throw new Error("outputGcsUri parameter is not supported in Gemini API.");if(void 0!==s(n,["fps"]))throw new Error("fps parameter is not supported in Gemini API.");const i=s(n,["durationSeconds"]);if(void 0!==e&&null!=i&&l(e,["parameters","durationSeconds"],i),void 0!==s(n,["seed"]))throw new Error("seed parameter is not supported in Gemini API.");const r=s(n,["aspectRatio"]);if(void 0!==e&&null!=r&&l(e,["parameters","aspectRatio"],r),void 0!==s(n,["resolution"]))throw new Error("resolution parameter is not supported in Gemini API.");const a=s(n,["personGeneration"]);if(void 0!==e&&null!=a&&l(e,["parameters","personGeneration"],a),void 0!==s(n,["pubsubTopic"]))throw new Error("pubsubTopic parameter is not supported in Gemini API.");const u=s(n,["negativePrompt"]);if(void 0!==e&&null!=u&&l(e,["parameters","negativePrompt"],u),void 0!==s(n,["enhancePrompt"]))throw new Error("enhancePrompt parameter is not supported in Gemini API.");return {}}(0,u,e)),e}function oe(t,n){const e={},o=s(n,["parts"]);if(null!=o){let t=o;Array.isArray(t)&&(t=t.map((t=>function(t,n){const e={},o=s(n,["videoMetadata"]);null!=o&&l(e,["videoMetadata"],o);const i=s(n,["thought"]);null!=i&&l(e,["thought"],i);const r=s(n,["codeExecutionResult"]);null!=r&&l(e,["codeExecutionResult"],r);const a=s(n,["executableCode"]);null!=a&&l(e,["executableCode"],a);const u=s(n,["fileData"]);null!=u&&l(e,["fileData"],u);const c=s(n,["functionCall"]);null!=c&&l(e,["functionCall"],c);const d=s(n,["functionResponse"]);null!=d&&l(e,["functionResponse"],d);const p=s(n,["inlineData"]);null!=p&&l(e,["inlineData"],p);const f=s(n,["text"]);return null!=f&&l(e,["text"],f),e}(0,t)))),l(e,["parts"],t);}const i=s(n,["role"]);return null!=i&&l(e,["role"],i),e}function ie(t,n){const e={},o=s(n,["dynamicRetrievalConfig"]);return null!=o&&l(e,["dynamicRetrievalConfig"],function(t,n){const e={},o=s(n,["mode"]);null!=o&&l(e,["mode"],o);const i=s(n,["dynamicThreshold"]);return null!=i&&l(e,["dynamicThreshold"],i),e}(0,o)),e}function re(t,n){const e={},o=s(n,["apiKeyConfig"]);null!=o&&l(e,["apiKeyConfig"],function(t,n){const e={},o=s(n,["apiKeyString"]);return null!=o&&l(e,["apiKeyString"],o),e}(0,o));const i=s(n,["authType"]);null!=i&&l(e,["authType"],i);const r=s(n,["googleServiceAccountConfig"]);null!=r&&l(e,["googleServiceAccountConfig"],r);const a=s(n,["httpBasicAuthConfig"]);null!=a&&l(e,["httpBasicAuthConfig"],a);const u=s(n,["oauthConfig"]);null!=u&&l(e,["oauthConfig"],u);const c=s(n,["oidcConfig"]);return null!=c&&l(e,["oidcConfig"],c),e}function le(t,n){const e={},o=s(n,["retrieval"]);null!=o&&l(e,["retrieval"],o);null!=s(n,["googleSearch"])&&l(e,["googleSearch"],{});const i=s(n,["googleSearchRetrieval"]);null!=i&&l(e,["googleSearchRetrieval"],ie(0,i));null!=s(n,["enterpriseWebSearch"])&&l(e,["enterpriseWebSearch"],{});const r=s(n,["googleMaps"]);null!=r&&l(e,["googleMaps"],function(t,n){const e={},o=s(n,["authConfig"]);return null!=o&&l(e,["authConfig"],re(0,o)),e}(0,r));const a=s(n,["codeExecution"]);null!=a&&l(e,["codeExecution"],a);const u=s(n,["functionDeclarations"]);return null!=u&&l(e,["functionDeclarations"],u),e}function se(t,n){const e={},o=s(n,["latLng"]);return null!=o&&l(e,["latLng"],function(t,n){const e={},o=s(n,["latitude"]);null!=o&&l(e,["latitude"],o);const i=s(n,["longitude"]);return null!=i&&l(e,["longitude"],i),e}(0,o)),e}function ae(t,n){const e={},o=s(n,["functionCallingConfig"]);null!=o&&l(e,["functionCallingConfig"],function(t,n){const e={},o=s(n,["mode"]);null!=o&&l(e,["mode"],o);const i=s(n,["allowedFunctionNames"]);return null!=i&&l(e,["allowedFunctionNames"],i),e}(0,o));const i=s(n,["retrievalConfig"]);return null!=i&&l(e,["retrievalConfig"],se(0,i)),e}function ue(t,n){const e={},o=s(n,["prebuiltVoiceConfig"]);return null!=o&&l(e,["prebuiltVoiceConfig"],function(t,n){const e={},o=s(n,["voiceName"]);return null!=o&&l(e,["voiceName"],o),e}(0,o)),e}function ce(t,n,e){const o={},i=s(n,["systemInstruction"]);void 0!==e&&null!=i&&l(e,["systemInstruction"],oe(0,y(0,i)));const r=s(n,["temperature"]);null!=r&&l(o,["temperature"],r);const a=s(n,["topP"]);null!=a&&l(o,["topP"],a);const u=s(n,["topK"]);null!=u&&l(o,["topK"],u);const c=s(n,["candidateCount"]);null!=c&&l(o,["candidateCount"],c);const d=s(n,["maxOutputTokens"]);null!=d&&l(o,["maxOutputTokens"],d);const p=s(n,["stopSequences"]);null!=p&&l(o,["stopSequences"],p);const f=s(n,["responseLogprobs"]);null!=f&&l(o,["responseLogprobs"],f);const h=s(n,["logprobs"]);null!=h&&l(o,["logprobs"],h);const g=s(n,["presencePenalty"]);null!=g&&l(o,["presencePenalty"],g);const m=s(n,["frequencyPenalty"]);null!=m&&l(o,["frequencyPenalty"],m);const v=s(n,["seed"]);null!=v&&l(o,["seed"],v);const C=s(n,["responseMimeType"]);null!=C&&l(o,["responseMimeType"],C);const I=s(n,["responseSchema"]);null!=I&&l(o,["responseSchema"],E(0,I));const S=s(n,["routingConfig"]);null!=S&&l(o,["routingConfig"],S);const b=s(n,["modelSelectionConfig"]);null!=b&&l(o,["modelConfig"],function(t,n){const e={},o=s(n,["featureSelectionPreference"]);return null!=o&&l(e,["featureSelectionPreference"],o),e}(0,b));const w=s(n,["safetySettings"]);if(void 0!==e&&null!=w){let t=w;Array.isArray(t)&&(t=t.map((t=>function(t,n){const e={},o=s(n,["method"]);null!=o&&l(e,["method"],o);const i=s(n,["category"]);null!=i&&l(e,["category"],i);const r=s(n,["threshold"]);return null!=r&&l(e,["threshold"],r),e}(0,t)))),l(e,["safetySettings"],t);}const P=s(n,["tools"]);if(void 0!==e&&null!=P){let t=O(0,P);Array.isArray(t)&&(t=t.map((t=>le(0,_(0,t))))),l(e,["tools"],t);}const N=s(n,["toolConfig"]);void 0!==e&&null!=N&&l(e,["toolConfig"],ae(0,N));const R=s(n,["labels"]);void 0!==e&&null!=R&&l(e,["labels"],R);const D=s(n,["cachedContent"]);void 0!==e&&null!=D&&l(e,["cachedContent"],A(t,D));const M=s(n,["responseModalities"]);null!=M&&l(o,["responseModalities"],M);const x=s(n,["mediaResolution"]);null!=x&&l(o,["mediaResolution"],x);const U=s(n,["speechConfig"]);null!=U&&l(o,["speechConfig"],function(t,n){const e={},o=s(n,["voiceConfig"]);null!=o&&l(e,["voiceConfig"],ue(0,o));const i=s(n,["languageCode"]);return null!=i&&l(e,["languageCode"],i),e}(0,T(0,U)));const q=s(n,["audioTimestamp"]);null!=q&&l(o,["audioTimestamp"],q);const L=s(n,["thinkingConfig"]);return null!=L&&l(o,["thinkingConfig"],function(t,n){const e={},o=s(n,["includeThoughts"]);null!=o&&l(e,["includeThoughts"],o);const i=s(n,["thinkingBudget"]);return null!=i&&l(e,["thinkingBudget"],i),e}(0,L)),o}function de(t,n){const e={},o=s(n,["model"]);null!=o&&l(e,["_url","model"],a(t,o));const i=s(n,["contents"]);if(null!=i){let t=C(0,i);Array.isArray(t)&&(t=t.map((t=>oe(0,t)))),l(e,["contents"],t);}const r=s(n,["config"]);return null!=r&&l(e,["generationConfig"],ce(t,r,e)),e}function pe(t,n){const e={},o=s(n,["model"]);null!=o&&l(e,["_url","model"],a(t,o));const i=s(n,["contents"]);null!=i&&l(e,["instances[]","content"],v(t,i));const r=s(n,["config"]);return null!=r&&l(e,["config"],function(t,n,e){const o=s(n,["taskType"]);void 0!==e&&null!=o&&l(e,["instances[]","task_type"],o);const i=s(n,["title"]);void 0!==e&&null!=i&&l(e,["instances[]","title"],i);const r=s(n,["outputDimensionality"]);void 0!==e&&null!=r&&l(e,["parameters","outputDimensionality"],r);const a=s(n,["mimeType"]);void 0!==e&&null!=a&&l(e,["instances[]","mimeType"],a);const u=s(n,["autoTruncate"]);return void 0!==e&&null!=u&&l(e,["parameters","autoTruncate"],u),{}}(0,r,e)),e}function fe(t,n){const e={},o=s(n,["model"]);null!=o&&l(e,["_url","model"],a(t,o));const i=s(n,["prompt"]);null!=i&&l(e,["instances[0]","prompt"],i);const r=s(n,["config"]);return null!=r&&l(e,["config"],function(t,n,e){const o=s(n,["outputGcsUri"]);void 0!==e&&null!=o&&l(e,["parameters","storageUri"],o);const i=s(n,["negativePrompt"]);void 0!==e&&null!=i&&l(e,["parameters","negativePrompt"],i);const r=s(n,["numberOfImages"]);void 0!==e&&null!=r&&l(e,["parameters","sampleCount"],r);const a=s(n,["aspectRatio"]);void 0!==e&&null!=a&&l(e,["parameters","aspectRatio"],a);const u=s(n,["guidanceScale"]);void 0!==e&&null!=u&&l(e,["parameters","guidanceScale"],u);const c=s(n,["seed"]);void 0!==e&&null!=c&&l(e,["parameters","seed"],c);const d=s(n,["safetyFilterLevel"]);void 0!==e&&null!=d&&l(e,["parameters","safetySetting"],d);const p=s(n,["personGeneration"]);void 0!==e&&null!=p&&l(e,["parameters","personGeneration"],p);const f=s(n,["includeSafetyAttributes"]);void 0!==e&&null!=f&&l(e,["parameters","includeSafetyAttributes"],f);const h=s(n,["includeRaiReason"]);void 0!==e&&null!=h&&l(e,["parameters","includeRaiReason"],h);const g=s(n,["language"]);void 0!==e&&null!=g&&l(e,["parameters","language"],g);const m=s(n,["outputMimeType"]);void 0!==e&&null!=m&&l(e,["parameters","outputOptions","mimeType"],m);const y=s(n,["outputCompressionQuality"]);void 0!==e&&null!=y&&l(e,["parameters","outputOptions","compressionQuality"],y);const v=s(n,["addWatermark"]);void 0!==e&&null!=v&&l(e,["parameters","addWatermark"],v);const C=s(n,["enhancePrompt"]);return void 0!==e&&null!=C&&l(e,["parameters","enhancePrompt"],C),{}}(0,r,e)),e}function he(t,n){const e={},o=s(n,["config"]);return null!=o&&l(e,["config"],function(t,n,e){const o=s(n,["pageSize"]);void 0!==e&&null!=o&&l(e,["_query","pageSize"],o);const i=s(n,["pageToken"]);void 0!==e&&null!=i&&l(e,["_query","pageToken"],i);const r=s(n,["filter"]);void 0!==e&&null!=r&&l(e,["_query","filter"],r);const a=s(n,["queryBase"]);return void 0!==e&&null!=a&&l(e,["_url","models_url"],w(t,a)),{}}(t,o,e)),e}function ge(t,n){const e={},o=s(n,["model"]);null!=o&&l(e,["_url","model"],a(t,o));const i=s(n,["config"]);return null!=i&&l(e,["config"],function(t,n,e){const o=s(n,["displayName"]);void 0!==e&&null!=o&&l(e,["displayName"],o);const i=s(n,["description"]);return void 0!==e&&null!=i&&l(e,["description"],i),{}}(0,i,e)),e}function me(t,n){const e={},o=s(n,["model"]);null!=o&&l(e,["_url","model"],a(t,o));const i=s(n,["contents"]);if(null!=i){let t=C(0,i);Array.isArray(t)&&(t=t.map((t=>oe(0,t)))),l(e,["contents"],t);}const r=s(n,["config"]);return null!=r&&l(e,["config"],function(t,n,e){const o=s(n,["systemInstruction"]);void 0!==e&&null!=o&&l(e,["systemInstruction"],oe(0,y(0,o)));const i=s(n,["tools"]);if(void 0!==e&&null!=i){let t=i;Array.isArray(t)&&(t=t.map((t=>le(0,t)))),l(e,["tools"],t);}const r=s(n,["generationConfig"]);return void 0!==e&&null!=r&&l(e,["generationConfig"],r),{}}(0,r,e)),e}function ye(t,n){const e={},o=s(n,["model"]);null!=o&&l(e,["_url","model"],a(t,o));const i=s(n,["prompt"]);null!=i&&l(e,["instances[0]","prompt"],i);const r=s(n,["image"]);null!=r&&l(e,["instances[0]","image"],function(t,n){const e={},o=s(n,["gcsUri"]);null!=o&&l(e,["gcsUri"],o);const i=s(n,["imageBytes"]);null!=i&&l(e,["bytesBase64Encoded"],S(0,i));const r=s(n,["mimeType"]);return null!=r&&l(e,["mimeType"],r),e}(0,r));const u=s(n,["config"]);return null!=u&&l(e,["config"],function(t,n,e){const o=s(n,["numberOfVideos"]);void 0!==e&&null!=o&&l(e,["parameters","sampleCount"],o);const i=s(n,["outputGcsUri"]);void 0!==e&&null!=i&&l(e,["parameters","storageUri"],i);const r=s(n,["fps"]);void 0!==e&&null!=r&&l(e,["parameters","fps"],r);const a=s(n,["durationSeconds"]);void 0!==e&&null!=a&&l(e,["parameters","durationSeconds"],a);const u=s(n,["seed"]);void 0!==e&&null!=u&&l(e,["parameters","seed"],u);const c=s(n,["aspectRatio"]);void 0!==e&&null!=c&&l(e,["parameters","aspectRatio"],c);const d=s(n,["resolution"]);void 0!==e&&null!=d&&l(e,["parameters","resolution"],d);const p=s(n,["personGeneration"]);void 0!==e&&null!=p&&l(e,["parameters","personGeneration"],p);const f=s(n,["pubsubTopic"]);void 0!==e&&null!=f&&l(e,["parameters","pubsubTopic"],f);const h=s(n,["negativePrompt"]);void 0!==e&&null!=h&&l(e,["parameters","negativePrompt"],h);const g=s(n,["enhancePrompt"]);return void 0!==e&&null!=g&&l(e,["parameters","enhancePrompt"],g),{}}(0,u,e)),e}function ve(t,n){const e={},o=s(n,["parts"]);if(null!=o){let t=o;Array.isArray(t)&&(t=t.map((t=>function(t,n){const e={},o=s(n,["thought"]);null!=o&&l(e,["thought"],o);const i=s(n,["codeExecutionResult"]);null!=i&&l(e,["codeExecutionResult"],i);const r=s(n,["executableCode"]);null!=r&&l(e,["executableCode"],r);const a=s(n,["fileData"]);null!=a&&l(e,["fileData"],a);const u=s(n,["functionCall"]);null!=u&&l(e,["functionCall"],u);const c=s(n,["functionResponse"]);null!=c&&l(e,["functionResponse"],c);const d=s(n,["inlineData"]);null!=d&&l(e,["inlineData"],d);const p=s(n,["text"]);return null!=p&&l(e,["text"],p),e}(0,t)))),l(e,["parts"],t);}const i=s(n,["role"]);return null!=i&&l(e,["role"],i),e}function Ce(t,n){const e={},o=s(n,["content"]);null!=o&&l(e,["content"],ve(0,o));const i=s(n,["citationMetadata"]);null!=i&&l(e,["citationMetadata"],function(t,n){const e={},o=s(n,["citationSources"]);return null!=o&&l(e,["citations"],o),e}(0,i));const r=s(n,["tokenCount"]);null!=r&&l(e,["tokenCount"],r);const a=s(n,["finishReason"]);null!=a&&l(e,["finishReason"],a);const u=s(n,["avgLogprobs"]);null!=u&&l(e,["avgLogprobs"],u);const c=s(n,["groundingMetadata"]);null!=c&&l(e,["groundingMetadata"],c);const d=s(n,["index"]);null!=d&&l(e,["index"],d);const p=s(n,["logprobsResult"]);null!=p&&l(e,["logprobsResult"],p);const f=s(n,["safetyRatings"]);return null!=f&&l(e,["safetyRatings"],f),e}function Ee(t,n){const e={},o=s(n,["candidates"]);if(null!=o){let t=o;Array.isArray(t)&&(t=t.map((t=>Ce(0,t)))),l(e,["candidates"],t);}const i=s(n,["modelVersion"]);null!=i&&l(e,["modelVersion"],i);const r=s(n,["promptFeedback"]);null!=r&&l(e,["promptFeedback"],r);const a=s(n,["usageMetadata"]);return null!=a&&l(e,["usageMetadata"],a),e}function Te(t,n){const e={},o=s(n,["embeddings"]);if(null!=o){let t=o;Array.isArray(t)&&(t=t.map((t=>function(t,n){const e={},o=s(n,["values"]);return null!=o&&l(e,["values"],o),e}(0,t)))),l(e,["embeddings"],t);}return null!=s(n,["metadata"])&&l(e,["metadata"],{}),e}function _e(t,n){const e={},o=s(n,["safetyAttributes","categories"]);null!=o&&l(e,["categories"],o);const i=s(n,["safetyAttributes","scores"]);null!=i&&l(e,["scores"],i);const r=s(n,["contentType"]);return null!=r&&l(e,["contentType"],r),e}function Oe(t,n){const e={},o=s(n,["_self"]);null!=o&&l(e,["image"],function(t,n){const e={},o=s(n,["bytesBase64Encoded"]);null!=o&&l(e,["imageBytes"],S(0,o));const i=s(n,["mimeType"]);return null!=i&&l(e,["mimeType"],i),e}(0,o));const i=s(n,["raiFilteredReason"]);null!=i&&l(e,["raiFilteredReason"],i);const r=s(n,["_self"]);return null!=r&&l(e,["safetyAttributes"],_e(0,r)),e}function Ae(t,n){const e={},o=s(n,["name"]);null!=o&&l(e,["name"],o);const i=s(n,["displayName"]);null!=i&&l(e,["displayName"],i);const r=s(n,["description"]);null!=r&&l(e,["description"],r);const a=s(n,["version"]);null!=a&&l(e,["version"],a);const u=s(n,["_self"]);null!=u&&l(e,["tunedModelInfo"],function(t,n){const e={},o=s(n,["baseModel"]);null!=o&&l(e,["baseModel"],o);const i=s(n,["createTime"]);null!=i&&l(e,["createTime"],i);const r=s(n,["updateTime"]);return null!=r&&l(e,["updateTime"],r),e}(0,u));const c=s(n,["inputTokenLimit"]);null!=c&&l(e,["inputTokenLimit"],c);const d=s(n,["outputTokenLimit"]);null!=d&&l(e,["outputTokenLimit"],d);const p=s(n,["supportedGenerationMethods"]);return null!=p&&l(e,["supportedActions"],p),e}function Ie(t,n){const e={},o=s(n,["_self"]);return null!=o&&l(e,["video"],function(t,n){const e={},o=s(n,["video","uri"]);null!=o&&l(e,["uri"],o);const i=s(n,["video","encodedVideo"]);null!=i&&l(e,["videoBytes"],S(0,i));const r=s(n,["encoding"]);return null!=r&&l(e,["mimeType"],r),e}(0,o)),e}function Se(t,n){const e={},o=s(n,["name"]);null!=o&&l(e,["name"],o);const i=s(n,["metadata"]);null!=i&&l(e,["metadata"],i);const r=s(n,["done"]);null!=r&&l(e,["done"],r);const a=s(n,["error"]);null!=a&&l(e,["error"],a);const u=s(n,["response","generateVideoResponse"]);return null!=u&&l(e,["response"],function(t,n){const e={},o=s(n,["generatedSamples"]);if(null!=o){let t=o;Array.isArray(t)&&(t=t.map((t=>Ie(0,t)))),l(e,["generatedVideos"],t);}const i=s(n,["raiMediaFilteredCount"]);null!=i&&l(e,["raiMediaFilteredCount"],i);const r=s(n,["raiMediaFilteredReasons"]);return null!=r&&l(e,["raiMediaFilteredReasons"],r),e}(0,u)),e}function be(t,n){const e={},o=s(n,["parts"]);if(null!=o){let t=o;Array.isArray(t)&&(t=t.map((t=>function(t,n){const e={},o=s(n,["videoMetadata"]);null!=o&&l(e,["videoMetadata"],o);const i=s(n,["thought"]);null!=i&&l(e,["thought"],i);const r=s(n,["codeExecutionResult"]);null!=r&&l(e,["codeExecutionResult"],r);const a=s(n,["executableCode"]);null!=a&&l(e,["executableCode"],a);const u=s(n,["fileData"]);null!=u&&l(e,["fileData"],u);const c=s(n,["functionCall"]);null!=c&&l(e,["functionCall"],c);const d=s(n,["functionResponse"]);null!=d&&l(e,["functionResponse"],d);const p=s(n,["inlineData"]);null!=p&&l(e,["inlineData"],p);const f=s(n,["text"]);return null!=f&&l(e,["text"],f),e}(0,t)))),l(e,["parts"],t);}const i=s(n,["role"]);return null!=i&&l(e,["role"],i),e}function we(t,n){const e={},o=s(n,["content"]);null!=o&&l(e,["content"],be(0,o));const i=s(n,["citationMetadata"]);null!=i&&l(e,["citationMetadata"],function(t,n){const e={},o=s(n,["citations"]);return null!=o&&l(e,["citations"],o),e}(0,i));const r=s(n,["finishMessage"]);null!=r&&l(e,["finishMessage"],r);const a=s(n,["finishReason"]);null!=a&&l(e,["finishReason"],a);const u=s(n,["avgLogprobs"]);null!=u&&l(e,["avgLogprobs"],u);const c=s(n,["groundingMetadata"]);null!=c&&l(e,["groundingMetadata"],c);const d=s(n,["index"]);null!=d&&l(e,["index"],d);const p=s(n,["logprobsResult"]);null!=p&&l(e,["logprobsResult"],p);const f=s(n,["safetyRatings"]);return null!=f&&l(e,["safetyRatings"],f),e}function Pe(t,n){const e={},o=s(n,["candidates"]);if(null!=o){let t=o;Array.isArray(t)&&(t=t.map((t=>we(0,t)))),l(e,["candidates"],t);}const i=s(n,["createTime"]);null!=i&&l(e,["createTime"],i);const r=s(n,["responseId"]);null!=r&&l(e,["responseId"],r);const a=s(n,["modelVersion"]);null!=a&&l(e,["modelVersion"],a);const u=s(n,["promptFeedback"]);null!=u&&l(e,["promptFeedback"],u);const c=s(n,["usageMetadata"]);return null!=c&&l(e,["usageMetadata"],c),e}function Ne(t,n){const e={},o=s(n,["values"]);null!=o&&l(e,["values"],o);const i=s(n,["statistics"]);return null!=i&&l(e,["statistics"],function(t,n){const e={},o=s(n,["truncated"]);null!=o&&l(e,["truncated"],o);const i=s(n,["token_count"]);return null!=i&&l(e,["tokenCount"],i),e}(0,i)),e}function Re(t,n){const e={},o=s(n,["predictions[]","embeddings"]);if(null!=o){let t=o;Array.isArray(t)&&(t=t.map((t=>Ne(0,t)))),l(e,["embeddings"],t);}const i=s(n,["metadata"]);return null!=i&&l(e,["metadata"],function(t,n){const e={},o=s(n,["billableCharacterCount"]);return null!=o&&l(e,["billableCharacterCount"],o),e}(0,i)),e}function De(t,n){const e={},o=s(n,["safetyAttributes","categories"]);null!=o&&l(e,["categories"],o);const i=s(n,["safetyAttributes","scores"]);null!=i&&l(e,["scores"],i);const r=s(n,["contentType"]);return null!=r&&l(e,["contentType"],r),e}function Me(t,n){const e={},o=s(n,["_self"]);null!=o&&l(e,["image"],function(t,n){const e={},o=s(n,["gcsUri"]);null!=o&&l(e,["gcsUri"],o);const i=s(n,["bytesBase64Encoded"]);null!=i&&l(e,["imageBytes"],S(0,i));const r=s(n,["mimeType"]);return null!=r&&l(e,["mimeType"],r),e}(0,o));const i=s(n,["raiFilteredReason"]);null!=i&&l(e,["raiFilteredReason"],i);const r=s(n,["_self"]);null!=r&&l(e,["safetyAttributes"],De(0,r));const a=s(n,["prompt"]);return null!=a&&l(e,["enhancedPrompt"],a),e}function xe(t,n){const e={},o=s(n,["name"]);null!=o&&l(e,["name"],o);const i=s(n,["displayName"]);null!=i&&l(e,["displayName"],i);const r=s(n,["description"]);null!=r&&l(e,["description"],r);const a=s(n,["versionId"]);null!=a&&l(e,["version"],a);const u=s(n,["deployedModels"]);if(null!=u){let t=u;Array.isArray(t)&&(t=t.map((t=>function(t,n){const e={},o=s(n,["endpoint"]);null!=o&&l(e,["name"],o);const i=s(n,["deployedModelId"]);return null!=i&&l(e,["deployedModelId"],i),e}(0,t)))),l(e,["endpoints"],t);}const c=s(n,["labels"]);null!=c&&l(e,["labels"],c);const d=s(n,["_self"]);return null!=d&&l(e,["tunedModelInfo"],function(t,n){const e={},o=s(n,["labels","google-vertex-llm-tuning-base-model-id"]);null!=o&&l(e,["baseModel"],o);const i=s(n,["createTime"]);null!=i&&l(e,["createTime"],i);const r=s(n,["updateTime"]);return null!=r&&l(e,["updateTime"],r),e}(0,d)),e}function Ue(t,n){const e={},o=s(n,["_self"]);return null!=o&&l(e,["video"],function(t,n){const e={},o=s(n,["gcsUri"]);null!=o&&l(e,["uri"],o);const i=s(n,["bytesBase64Encoded"]);null!=i&&l(e,["videoBytes"],S(0,i));const r=s(n,["mimeType"]);return null!=r&&l(e,["mimeType"],r),e}(0,o)),e}function qe(t,n){const e={},o=s(n,["name"]);null!=o&&l(e,["name"],o);const i=s(n,["metadata"]);null!=i&&l(e,["metadata"],i);const r=s(n,["done"]);null!=r&&l(e,["done"],r);const a=s(n,["error"]);null!=a&&l(e,["error"],a);const u=s(n,["response"]);return null!=u&&l(e,["response"],function(t,n){const e={},o=s(n,["videos"]);if(null!=o){let t=o;Array.isArray(t)&&(t=t.map((t=>Ue(0,t)))),l(e,["generatedVideos"],t);}const i=s(n,["raiMediaFilteredCount"]);null!=i&&l(e,["raiMediaFilteredCount"],i);const r=s(n,["raiMediaFilteredReasons"]);return null!=r&&l(e,["raiMediaFilteredReasons"],r),e}(0,u)),e}
/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */class Le{constructor(t,n,e){this.apiClient=t,this.auth=n,this.webSocketFactory=e;}async connect(t){var n,e,o,i;const r=this.apiClient.getWebsocketBaseUrl(),u=this.apiClient.getApiVersion();let c;const d=function(t){const n=new Headers;for(const[e,o]of Object.entries(t))n.append(e,o);return n}
/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */(this.apiClient.getDefaultHeaders());if(this.apiClient.isVertexAI())c=`${r}/ws/google.cloud.aiplatform.${u}.LlmBidiService/BidiGenerateContent`,await this.auth.addAuthHeaders(d);else {c=`${r}/ws/google.ai.generativelanguage.${u}.GenerativeService.BidiGenerateContent?key=${this.apiClient.getApiKey()}`;}let p=()=>{};const f=new Promise((t=>{p=t;})),h=t.callbacks,g=this.apiClient,m={onopen:function(){var t;null===(t=null==h?void 0:h.onopen)||void 0===t||t.call(h),p({});},onmessage:t=>{!async function(t,n,e){const o=new rn;let i;if(i=e.data instanceof Blob?JSON.parse(await e.data.text()):JSON.parse(e.data),t.isVertexAI()){const t=Fn(0,i);Object.assign(o,t);}else {const t=Bn(0,i);Object.assign(o,t);}n(o);}(g,h.onmessage,t);},onerror:null!==(n=null==h?void 0:h.onerror)&&void 0!==n?n:function(t){},onclose:null!==(e=null==h?void 0:h.onclose)&&void 0!==e?e:function(t){}},y=this.webSocketFactory.create(c,function(t){const n={};return t.forEach(((t,e)=>{n[e]=t;})),n}(d),m);y.connect(),await f;let v=a(this.apiClient,t.model);if(this.apiClient.isVertexAI()&&v.startsWith("publishers/")){v=`projects/${this.apiClient.getProject()}/locations/${this.apiClient.getLocation()}/`+v;}let C={};this.apiClient.isVertexAI()&&void 0===(null===(o=t.config)||void 0===o?void 0:o.responseModalities)&&(void 0===t.config?t.config={responseModalities:[st.AUDIO]}:t.config.responseModalities=[st.AUDIO]),(null===(i=t.config)||void 0===i?void 0:i.generationConfig)&&console.warn("Setting `LiveConnectConfig.generation_config` is deprecated, please set the fields on `LiveConnectConfig` directly. This will become an error in a future version (not before Q3 2025).");const E={model:v,config:t.config,callbacks:t.callbacks};return C=this.apiClient.isVertexAI()?function(t,n){const e={},o=s(n,["model"]);null!=o&&l(e,["setup","model"],a(t,o));const i=s(n,["config"]);return null!=i&&l(e,["config"],Dn(0,i,e)),e}(this.apiClient,E):function(t,n){const e={},o=s(n,["model"]);null!=o&&l(e,["setup","model"],a(t,o));const i=s(n,["config"]);return null!=i&&l(e,["config"],Rn(0,i,e)),e}(this.apiClient,E),delete C.config,y.send(JSON.stringify(C)),new ke(y,this.apiClient)}}const Ge={turnComplete:true};class ke{constructor(t,n){this.conn=t,this.apiClient=n;}tLiveClientContent(t,n){if(null!==n.turns&&void 0!==n.turns){let e=[];try{e=C(0,n.turns),e=t.isVertexAI()?e.map((t=>oe(0,t))):e.map((t=>Jn(0,t)));}catch(t){throw new Error(`Failed to parse client content "turns", type: '${typeof n.turns}'`)}return {clientContent:{turns:e,turnComplete:n.turnComplete}}}return {clientContent:{turnComplete:n.turnComplete}}}tLiveClienttToolResponse(t,n){let e=[];if(null==n.functionResponses)throw new Error("functionResponses is required.");if(e=Array.isArray(n.functionResponses)?n.functionResponses:[n.functionResponses],0===e.length)throw new Error("functionResponses is required.");for(const n of e){if("object"!=typeof n||null===n||!("name"in n)||!("response"in n))throw new Error(`Could not parse function response, type '${typeof n}'.`);if(!t.isVertexAI()&&!("id"in n))throw new Error("FunctionResponse request must have an `id` field from the response of a ToolCall.FunctionalCalls in Google AI.")}return {toolResponse:{functionResponses:e}}}sendClientContent(t){t=Object.assign(Object.assign({},Ge),t);const n=this.tLiveClientContent(this.apiClient,t);this.conn.send(JSON.stringify(n));}sendRealtimeInput(t){let n={};n=this.apiClient.isVertexAI()?{realtimeInput:xn(this.apiClient,t)}:{realtimeInput:Mn(this.apiClient,t)},this.conn.send(JSON.stringify(n));}sendToolResponse(t){if(null==t.functionResponses)throw new Error("Tool response parameters are required.");const n=this.tLiveClienttToolResponse(this.apiClient,t);this.conn.send(JSON.stringify(n));}close(){this.conn.close();}}class je extends i{constructor(t){super(),this.apiClient=t,this.generateContent=async t=>await this.generateContentInternal(t),this.generateContentStream=async t=>await this.generateContentStreamInternal(t),this.generateImages=async t=>await this.generateImagesInternal(t).then((t=>{var n;let e;const o=[];if(null==t?void 0:t.generatedImages)for(const i of t.generatedImages)i&&(null==i?void 0:i.safetyAttributes)&&"Positive Prompt"===(null===(n=null==i?void 0:i.safetyAttributes)||void 0===n?void 0:n.contentType)?e=null==i?void 0:i.safetyAttributes:o.push(i);let i;return i=e?{generatedImages:o,positivePromptSafetyAttributes:e}:{generatedImages:o},i})),this.list=async t=>{var n;const e={config:Object.assign(Object.assign({},{queryBase:true}),null==t?void 0:t.config)};if(this.apiClient.isVertexAI()&&!e.config.queryBase){if(null===(n=e.config)||void 0===n?void 0:n.filter)throw new Error("Filtering tuned models list for Vertex AI is not currently supported");e.config.filter="labels.tune-type:*";}return new bt(K.PAGED_ITEM_MODELS,(t=>this.listInternal(t)),await this.listInternal(e),e)};}async generateContentInternal(t){var n,e,o,i;let l,s="",a={};if(this.apiClient.isVertexAI()){const o=de(this.apiClient,t);return s=r("{model}:generateContent",o._url),a=o._query,delete o.config,delete o._url,delete o._query,l=this.apiClient.request({path:s,queryParams:a,body:JSON.stringify(o),httpMethod:"POST",httpOptions:null===(n=t.config)||void 0===n?void 0:n.httpOptions,abortSignal:null===(e=t.config)||void 0===e?void 0:e.abortSignal}).then((t=>t.json())),l.then((t=>{const n=Pe(this.apiClient,t),e=new Vt;return Object.assign(e,n),e}))}{const n=zn(this.apiClient,t);return s=r("{model}:generateContent",n._url),a=n._query,delete n.config,delete n._url,delete n._query,l=this.apiClient.request({path:s,queryParams:a,body:JSON.stringify(n),httpMethod:"POST",httpOptions:null===(o=t.config)||void 0===o?void 0:o.httpOptions,abortSignal:null===(i=t.config)||void 0===i?void 0:i.abortSignal}).then((t=>t.json())),l.then((t=>{const n=Ee(this.apiClient,t),e=new Vt;return Object.assign(e,n),e}))}}async generateContentStreamInternal(t){var n,e,o,i;let l,s="",a={};if(this.apiClient.isVertexAI()){const o=de(this.apiClient,t);s=r("{model}:streamGenerateContent?alt=sse",o._url),a=o._query,delete o.config,delete o._url,delete o._query;const i=this.apiClient;return l=i.requestStream({path:s,queryParams:a,body:JSON.stringify(o),httpMethod:"POST",httpOptions:null===(n=t.config)||void 0===n?void 0:n.httpOptions,abortSignal:null===(e=t.config)||void 0===e?void 0:e.abortSignal}),l.then((function(t){return dn(this,arguments,(function*(){var n,e,o,i;try{for(var r,l=!0,s=pn(t);!(n=(r=yield cn(s.next())).done);l=!0){i=r.value,l=!1;const t=i,n=Pe(0,yield cn(t.json())),e=new Vt;Object.assign(e,n),yield yield cn(e);}}catch(t){e={error:t};}finally{try{l||n||!(o=s.return)||(yield cn(o.call(s)));}finally{if(e)throw e.error}}}))}))}{const n=zn(this.apiClient,t);s=r("{model}:streamGenerateContent?alt=sse",n._url),a=n._query,delete n.config,delete n._url,delete n._query;const e=this.apiClient;return l=e.requestStream({path:s,queryParams:a,body:JSON.stringify(n),httpMethod:"POST",httpOptions:null===(o=t.config)||void 0===o?void 0:o.httpOptions,abortSignal:null===(i=t.config)||void 0===i?void 0:i.abortSignal}),l.then((function(t){return dn(this,arguments,(function*(){var n,e,o,i;try{for(var r,l=!0,s=pn(t);!(n=(r=yield cn(s.next())).done);l=!0){i=r.value,l=!1;const t=i,n=Ee(0,yield cn(t.json())),e=new Vt;Object.assign(e,n),yield yield cn(e);}}catch(t){e={error:t};}finally{try{l||n||!(o=s.return)||(yield cn(o.call(s)));}finally{if(e)throw e.error}}}))}))}}async embedContent(t){var n,e,o,i;let l,s="",a={};if(this.apiClient.isVertexAI()){const o=pe(this.apiClient,t);return s=r("{model}:predict",o._url),a=o._query,delete o.config,delete o._url,delete o._query,l=this.apiClient.request({path:s,queryParams:a,body:JSON.stringify(o),httpMethod:"POST",httpOptions:null===(n=t.config)||void 0===n?void 0:n.httpOptions,abortSignal:null===(e=t.config)||void 0===e?void 0:e.abortSignal}).then((t=>t.json())),l.then((t=>{const n=Re(this.apiClient,t),e=new Bt;return Object.assign(e,n),e}))}{const n=Xn(this.apiClient,t);return s=r("{model}:batchEmbedContents",n._url),a=n._query,delete n.config,delete n._url,delete n._query,l=this.apiClient.request({path:s,queryParams:a,body:JSON.stringify(n),httpMethod:"POST",httpOptions:null===(o=t.config)||void 0===o?void 0:o.httpOptions,abortSignal:null===(i=t.config)||void 0===i?void 0:i.abortSignal}).then((t=>t.json())),l.then((t=>{const n=Te(this.apiClient,t),e=new Bt;return Object.assign(e,n),e}))}}async generateImagesInternal(t){var n,e,o,i;let a,u="",c={};if(this.apiClient.isVertexAI()){const o=fe(this.apiClient,t);return u=r("{model}:predict",o._url),c=o._query,delete o.config,delete o._url,delete o._query,a=this.apiClient.request({path:u,queryParams:c,body:JSON.stringify(o),httpMethod:"POST",httpOptions:null===(n=t.config)||void 0===n?void 0:n.httpOptions,abortSignal:null===(e=t.config)||void 0===e?void 0:e.abortSignal}).then((t=>t.json())),a.then((t=>{const n=function(t,n){const e={},o=s(n,["predictions"]);if(null!=o){let t=o;Array.isArray(t)&&(t=t.map((t=>Me(0,t)))),l(e,["generatedImages"],t);}const i=s(n,["positivePromptSafetyAttributes"]);return null!=i&&l(e,["positivePromptSafetyAttributes"],De(0,i)),e}(this.apiClient,t),e=new Ft;return Object.assign(e,n),e}))}{const n=Zn(this.apiClient,t);return u=r("{model}:predict",n._url),c=n._query,delete n.config,delete n._url,delete n._query,a=this.apiClient.request({path:u,queryParams:c,body:JSON.stringify(n),httpMethod:"POST",httpOptions:null===(o=t.config)||void 0===o?void 0:o.httpOptions,abortSignal:null===(i=t.config)||void 0===i?void 0:i.abortSignal}).then((t=>t.json())),a.then((t=>{const n=function(t,n){const e={},o=s(n,["predictions"]);if(null!=o){let t=o;Array.isArray(t)&&(t=t.map((t=>Oe(0,t)))),l(e,["generatedImages"],t);}const i=s(n,["positivePromptSafetyAttributes"]);return null!=i&&l(e,["positivePromptSafetyAttributes"],_e(0,i)),e}(this.apiClient,t),e=new Ft;return Object.assign(e,n),e}))}}async get(t){var n,e,o,i;let u,c="",d={};if(this.apiClient.isVertexAI()){const o=function(t,n){const e={},o=s(n,["model"]);null!=o&&l(e,["_url","name"],a(t,o));const i=s(n,["config"]);return null!=i&&l(e,["config"],i),e}(this.apiClient,t);return c=r("{name}",o._url),d=o._query,delete o.config,delete o._url,delete o._query,u=this.apiClient.request({path:c,queryParams:d,body:JSON.stringify(o),httpMethod:"GET",httpOptions:null===(n=t.config)||void 0===n?void 0:n.httpOptions,abortSignal:null===(e=t.config)||void 0===e?void 0:e.abortSignal}).then((t=>t.json())),u.then((t=>xe(this.apiClient,t)))}{const n=function(t,n){const e={},o=s(n,["model"]);null!=o&&l(e,["_url","name"],a(t,o));const i=s(n,["config"]);return null!=i&&l(e,["config"],i),e}(this.apiClient,t);return c=r("{name}",n._url),d=n._query,delete n.config,delete n._url,delete n._query,u=this.apiClient.request({path:c,queryParams:d,body:JSON.stringify(n),httpMethod:"GET",httpOptions:null===(o=t.config)||void 0===o?void 0:o.httpOptions,abortSignal:null===(i=t.config)||void 0===i?void 0:i.abortSignal}).then((t=>t.json())),u.then((t=>Ae(this.apiClient,t)))}}async listInternal(t){var n,e,o,i;let a,u="",c={};if(this.apiClient.isVertexAI()){const o=he(this.apiClient,t);return u=r("{models_url}",o._url),c=o._query,delete o.config,delete o._url,delete o._query,a=this.apiClient.request({path:u,queryParams:c,body:JSON.stringify(o),httpMethod:"GET",httpOptions:null===(n=t.config)||void 0===n?void 0:n.httpOptions,abortSignal:null===(e=t.config)||void 0===e?void 0:e.abortSignal}).then((t=>t.json())),a.then((t=>{const n=function(t,n){const e={},o=s(n,["nextPageToken"]);null!=o&&l(e,["nextPageToken"],o);const i=s(n,["_self"]);if(null!=i){let t=P(0,i);Array.isArray(t)&&(t=t.map((t=>xe(0,t)))),l(e,["models"],t);}return e}(this.apiClient,t),e=new Jt;return Object.assign(e,n),e}))}{const n=Qn(this.apiClient,t);return u=r("{models_url}",n._url),c=n._query,delete n.config,delete n._url,delete n._query,a=this.apiClient.request({path:u,queryParams:c,body:JSON.stringify(n),httpMethod:"GET",httpOptions:null===(o=t.config)||void 0===o?void 0:o.httpOptions,abortSignal:null===(i=t.config)||void 0===i?void 0:i.abortSignal}).then((t=>t.json())),a.then((t=>{const n=function(t,n){const e={},o=s(n,["nextPageToken"]);null!=o&&l(e,["nextPageToken"],o);const i=s(n,["_self"]);if(null!=i){let t=P(0,i);Array.isArray(t)&&(t=t.map((t=>Ae(0,t)))),l(e,["models"],t);}return e}(this.apiClient,t),e=new Jt;return Object.assign(e,n),e}))}}async update(t){var n,e,o,i;let l,s="",a={};if(this.apiClient.isVertexAI()){const o=ge(this.apiClient,t);return s=r("{model}",o._url),a=o._query,delete o.config,delete o._url,delete o._query,l=this.apiClient.request({path:s,queryParams:a,body:JSON.stringify(o),httpMethod:"PATCH",httpOptions:null===(n=t.config)||void 0===n?void 0:n.httpOptions,abortSignal:null===(e=t.config)||void 0===e?void 0:e.abortSignal}).then((t=>t.json())),l.then((t=>xe(this.apiClient,t)))}{const n=te(this.apiClient,t);return s=r("{name}",n._url),a=n._query,delete n.config,delete n._url,delete n._query,l=this.apiClient.request({path:s,queryParams:a,body:JSON.stringify(n),httpMethod:"PATCH",httpOptions:null===(o=t.config)||void 0===o?void 0:o.httpOptions,abortSignal:null===(i=t.config)||void 0===i?void 0:i.abortSignal}).then((t=>t.json())),l.then((t=>Ae(this.apiClient,t)))}}async delete(t){var n,e,o,i;let u,c="",d={};if(this.apiClient.isVertexAI()){const o=function(t,n){const e={},o=s(n,["model"]);null!=o&&l(e,["_url","name"],a(t,o));const i=s(n,["config"]);return null!=i&&l(e,["config"],i),e}(this.apiClient,t);return c=r("{name}",o._url),d=o._query,delete o.config,delete o._url,delete o._query,u=this.apiClient.request({path:c,queryParams:d,body:JSON.stringify(o),httpMethod:"DELETE",httpOptions:null===(n=t.config)||void 0===n?void 0:n.httpOptions,abortSignal:null===(e=t.config)||void 0===e?void 0:e.abortSignal}).then((t=>t.json())),u.then((()=>{const t={},n=new Yt;return Object.assign(n,t),n}))}{const n=function(t,n){const e={},o=s(n,["model"]);null!=o&&l(e,["_url","name"],a(t,o));const i=s(n,["config"]);return null!=i&&l(e,["config"],i),e}(this.apiClient,t);return c=r("{name}",n._url),d=n._query,delete n.config,delete n._url,delete n._query,u=this.apiClient.request({path:c,queryParams:d,body:JSON.stringify(n),httpMethod:"DELETE",httpOptions:null===(o=t.config)||void 0===o?void 0:o.httpOptions,abortSignal:null===(i=t.config)||void 0===i?void 0:i.abortSignal}).then((t=>t.json())),u.then((()=>{const t={},n=new Yt;return Object.assign(n,t),n}))}}async countTokens(t){var n,e,o,i;let a,u="",c={};if(this.apiClient.isVertexAI()){const o=me(this.apiClient,t);return u=r("{model}:countTokens",o._url),c=o._query,delete o.config,delete o._url,delete o._query,a=this.apiClient.request({path:u,queryParams:c,body:JSON.stringify(o),httpMethod:"POST",httpOptions:null===(n=t.config)||void 0===n?void 0:n.httpOptions,abortSignal:null===(e=t.config)||void 0===e?void 0:e.abortSignal}).then((t=>t.json())),a.then((t=>{const n=function(t,n){const e={},o=s(n,["totalTokens"]);return null!=o&&l(e,["totalTokens"],o),e}(this.apiClient,t),e=new Kt;return Object.assign(e,n),e}))}{const n=ne(this.apiClient,t);return u=r("{model}:countTokens",n._url),c=n._query,delete n.config,delete n._url,delete n._query,a=this.apiClient.request({path:u,queryParams:c,body:JSON.stringify(n),httpMethod:"POST",httpOptions:null===(o=t.config)||void 0===o?void 0:o.httpOptions,abortSignal:null===(i=t.config)||void 0===i?void 0:i.abortSignal}).then((t=>t.json())),a.then((t=>{const n=function(t,n){const e={},o=s(n,["totalTokens"]);null!=o&&l(e,["totalTokens"],o);const i=s(n,["cachedContentTokenCount"]);return null!=i&&l(e,["cachedContentTokenCount"],i),e}(this.apiClient,t),e=new Kt;return Object.assign(e,n),e}))}}async computeTokens(t){var n,e;let o,i="",u={};if(this.apiClient.isVertexAI()){const c=function(t,n){const e={},o=s(n,["model"]);null!=o&&l(e,["_url","model"],a(t,o));const i=s(n,["contents"]);if(null!=i){let t=C(0,i);Array.isArray(t)&&(t=t.map((t=>oe(0,t)))),l(e,["contents"],t);}const r=s(n,["config"]);return null!=r&&l(e,["config"],r),e}(this.apiClient,t);return i=r("{model}:computeTokens",c._url),u=c._query,delete c.config,delete c._url,delete c._query,o=this.apiClient.request({path:i,queryParams:u,body:JSON.stringify(c),httpMethod:"POST",httpOptions:null===(n=t.config)||void 0===n?void 0:n.httpOptions,abortSignal:null===(e=t.config)||void 0===e?void 0:e.abortSignal}).then((t=>t.json())),o.then((t=>{const n=function(t,n){const e={},o=s(n,["tokensInfo"]);return null!=o&&l(e,["tokensInfo"],o),e}(this.apiClient,t),e=new Wt;return Object.assign(e,n),e}))}throw new Error("This method is only supported by the Vertex AI.")}async generateVideos(t){var n,e,o,i;let l,s="",a={};if(this.apiClient.isVertexAI()){const o=ye(this.apiClient,t);return s=r("{model}:predictLongRunning",o._url),a=o._query,delete o.config,delete o._url,delete o._query,l=this.apiClient.request({path:s,queryParams:a,body:JSON.stringify(o),httpMethod:"POST",httpOptions:null===(n=t.config)||void 0===n?void 0:n.httpOptions,abortSignal:null===(e=t.config)||void 0===e?void 0:e.abortSignal}).then((t=>t.json())),l.then((t=>qe(this.apiClient,t)))}{const n=ee(this.apiClient,t);return s=r("{model}:predictLongRunning",n._url),a=n._query,delete n.config,delete n._url,delete n._query,l=this.apiClient.request({path:s,queryParams:a,body:JSON.stringify(n),httpMethod:"POST",httpOptions:null===(o=t.config)||void 0===o?void 0:o.httpOptions,abortSignal:null===(i=t.config)||void 0===i?void 0:i.abortSignal}).then((t=>t.json())),l.then((t=>Se(this.apiClient,t)))}}}
/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */function He(t,n){const e={},o=s(n,["_self"]);return null!=o&&l(e,["video"],function(t,n){const e={},o=s(n,["video","uri"]);null!=o&&l(e,["uri"],o);const i=s(n,["video","encodedVideo"]);null!=i&&l(e,["videoBytes"],S(0,i));const r=s(n,["encoding"]);return null!=r&&l(e,["mimeType"],r),e}(0,o)),e}function Ve(t,n){const e={},o=s(n,["name"]);null!=o&&l(e,["name"],o);const i=s(n,["metadata"]);null!=i&&l(e,["metadata"],i);const r=s(n,["done"]);null!=r&&l(e,["done"],r);const a=s(n,["error"]);null!=a&&l(e,["error"],a);const u=s(n,["response","generateVideoResponse"]);return null!=u&&l(e,["response"],function(t,n){const e={},o=s(n,["generatedSamples"]);if(null!=o){let t=o;Array.isArray(t)&&(t=t.map((t=>He(0,t)))),l(e,["generatedVideos"],t);}const i=s(n,["raiMediaFilteredCount"]);null!=i&&l(e,["raiMediaFilteredCount"],i);const r=s(n,["raiMediaFilteredReasons"]);return null!=r&&l(e,["raiMediaFilteredReasons"],r),e}(0,u)),e}function Be(t,n){const e={},o=s(n,["_self"]);return null!=o&&l(e,["video"],function(t,n){const e={},o=s(n,["gcsUri"]);null!=o&&l(e,["uri"],o);const i=s(n,["bytesBase64Encoded"]);null!=i&&l(e,["videoBytes"],S(0,i));const r=s(n,["mimeType"]);return null!=r&&l(e,["mimeType"],r),e}(0,o)),e}function Fe(t,n){const e={},o=s(n,["name"]);null!=o&&l(e,["name"],o);const i=s(n,["metadata"]);null!=i&&l(e,["metadata"],i);const r=s(n,["done"]);null!=r&&l(e,["done"],r);const a=s(n,["error"]);null!=a&&l(e,["error"],a);const u=s(n,["response"]);return null!=u&&l(e,["response"],function(t,n){const e={},o=s(n,["videos"]);if(null!=o){let t=o;Array.isArray(t)&&(t=t.map((t=>Be(0,t)))),l(e,["generatedVideos"],t);}const i=s(n,["raiMediaFilteredCount"]);null!=i&&l(e,["raiMediaFilteredCount"],i);const r=s(n,["raiMediaFilteredReasons"]);return null!=r&&l(e,["raiMediaFilteredReasons"],r),e}(0,u)),e}
/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */class Je extends i{constructor(t){super(),this.apiClient=t;}async getVideosOperation(t){const n=t.operation,e=t.config;if(void 0===n.name||""===n.name)throw new Error("Operation name is required.");if(this.apiClient.isVertexAI()){const t=n.name.split("/operations/")[0];let o;return e&&"httpOptions"in e&&(o=e.httpOptions),this.fetchPredictVideosOperationInternal({operationName:n.name,resourceName:t,config:{httpOptions:o}})}return this.getVideosOperationInternal({operationName:n.name,config:e})}async getVideosOperationInternal(t){var n,e,o,i;let a,u="",c={};if(this.apiClient.isVertexAI()){const o=function(t,n){const e={},o=s(n,["operationName"]);null!=o&&l(e,["_url","operationName"],o);const i=s(n,["config"]);return null!=i&&l(e,["config"],i),e}(this.apiClient,t);return u=r("{operationName}",o._url),c=o._query,delete o.config,delete o._url,delete o._query,a=this.apiClient.request({path:u,queryParams:c,body:JSON.stringify(o),httpMethod:"GET",httpOptions:null===(n=t.config)||void 0===n?void 0:n.httpOptions,abortSignal:null===(e=t.config)||void 0===e?void 0:e.abortSignal}).then((t=>t.json())),a.then((t=>Fe(this.apiClient,t)))}{const n=function(t,n){const e={},o=s(n,["operationName"]);null!=o&&l(e,["_url","operationName"],o);const i=s(n,["config"]);return null!=i&&l(e,["config"],i),e}(this.apiClient,t);return u=r("{operationName}",n._url),c=n._query,delete n.config,delete n._url,delete n._query,a=this.apiClient.request({path:u,queryParams:c,body:JSON.stringify(n),httpMethod:"GET",httpOptions:null===(o=t.config)||void 0===o?void 0:o.httpOptions,abortSignal:null===(i=t.config)||void 0===i?void 0:i.abortSignal}).then((t=>t.json())),a.then((t=>Ve(this.apiClient,t)))}}async fetchPredictVideosOperationInternal(t){var n,e;let o,i="",a={};if(this.apiClient.isVertexAI()){const u=function(t,n){const e={},o=s(n,["operationName"]);null!=o&&l(e,["operationName"],o);const i=s(n,["resourceName"]);null!=i&&l(e,["_url","resourceName"],i);const r=s(n,["config"]);return null!=r&&l(e,["config"],r),e}(this.apiClient,t);return i=r("{resourceName}:fetchPredictOperation",u._url),a=u._query,delete u.config,delete u._url,delete u._query,o=this.apiClient.request({path:i,queryParams:a,body:JSON.stringify(u),httpMethod:"POST",httpOptions:null===(n=t.config)||void 0===n?void 0:n.httpOptions,abortSignal:null===(e=t.config)||void 0===e?void 0:e.abortSignal}).then((t=>t.json())),o.then((t=>Fe(this.apiClient,t)))}throw new Error("This method is only supported by the Vertex AI.")}}
/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */const Ye=/^data: (.*)(?:\n\n|\r\r|\r\n\r\n)/;class Ke extends Error{constructor(t,n){super(t,n?{cause:n}:{cause:(new Error).stack}),this.message=t,this.name="ClientError";}}class We extends Error{constructor(t,n){super(t,n?{cause:n}:{cause:(new Error).stack}),this.message=t,this.name="ServerError";}}class $e{constructor(t){var n,e;this.clientOptions=Object.assign(Object.assign({},t),{project:t.project,location:t.location,apiKey:t.apiKey,vertexai:t.vertexai});const o={};this.clientOptions.vertexai?(o.apiVersion=null!==(n=this.clientOptions.apiVersion)&&void 0!==n?n:"v1beta1",o.baseUrl=this.baseUrlFromProjectLocation(),this.normalizeAuthParameters()):(o.apiVersion=null!==(e=this.clientOptions.apiVersion)&&void 0!==e?e:"v1beta",o.baseUrl="https://generativelanguage.googleapis.com/"),o.headers=this.getDefaultHeaders(),this.clientOptions.httpOptions=o,t.httpOptions&&(this.clientOptions.httpOptions=this.patchHttpOptions(o,t.httpOptions));}baseUrlFromProjectLocation(){return this.clientOptions.project&&this.clientOptions.location&&"global"!==this.clientOptions.location?`https://${this.clientOptions.location}-aiplatform.googleapis.com/`:"https://aiplatform.googleapis.com/"}normalizeAuthParameters(){this.clientOptions.project&&this.clientOptions.location?this.clientOptions.apiKey=void 0:(this.clientOptions.project=void 0,this.clientOptions.location=void 0);}isVertexAI(){var t;return null!==(t=this.clientOptions.vertexai)&&void 0!==t&&t}getProject(){return this.clientOptions.project}getLocation(){return this.clientOptions.location}getApiVersion(){if(this.clientOptions.httpOptions&&void 0!==this.clientOptions.httpOptions.apiVersion)return this.clientOptions.httpOptions.apiVersion;throw new Error("API version is not set.")}getBaseUrl(){if(this.clientOptions.httpOptions&&void 0!==this.clientOptions.httpOptions.baseUrl)return this.clientOptions.httpOptions.baseUrl;throw new Error("Base URL is not set.")}getRequestUrl(){return this.getRequestUrlInternal(this.clientOptions.httpOptions)}getHeaders(){if(this.clientOptions.httpOptions&&void 0!==this.clientOptions.httpOptions.headers)return this.clientOptions.httpOptions.headers;throw new Error("Headers are not set.")}getRequestUrlInternal(t){if(!t||void 0===t.baseUrl||void 0===t.apiVersion)throw new Error("HTTP options are not correctly set.");const n=[t.baseUrl.endsWith("/")?t.baseUrl.slice(0,-1):t.baseUrl];return t.apiVersion&&""!==t.apiVersion&&n.push(t.apiVersion),n.join("/")}getBaseResourcePath(){return `projects/${this.clientOptions.project}/locations/${this.clientOptions.location}`}getApiKey(){return this.clientOptions.apiKey}getWebsocketBaseUrl(){const t=this.getBaseUrl(),n=new URL(t);return n.protocol="http:"==n.protocol?"ws":"wss",n.toString()}setBaseUrl(t){if(!this.clientOptions.httpOptions)throw new Error("HTTP options are not correctly set.");this.clientOptions.httpOptions.baseUrl=t;}constructUrl(t,n,e){const o=[this.getRequestUrlInternal(n)];e&&o.push(this.getBaseResourcePath()),""!==t&&o.push(t);return new URL(`${o.join("/")}`)}shouldPrependVertexProjectPath(t){return !this.clientOptions.apiKey&&(!!this.clientOptions.vertexai&&(!t.path.startsWith("projects/")&&("GET"!==t.httpMethod||!t.path.startsWith("publishers/google/models"))))}async request(t){let n=this.clientOptions.httpOptions;t.httpOptions&&(n=this.patchHttpOptions(this.clientOptions.httpOptions,t.httpOptions));const e=this.shouldPrependVertexProjectPath(t),o=this.constructUrl(t.path,n,e);if(t.queryParams)for(const[n,e]of Object.entries(t.queryParams))o.searchParams.append(n,String(e));let i={};if("GET"===t.httpMethod){if(t.body&&"{}"!==t.body)throw new Error("Request body should be empty for GET request, but got non empty request body")}else i.body=t.body;return i=await this.includeExtraHttpOptionsToRequestInit(i,n,t.abortSignal),this.unaryApiCall(o,i,t.httpMethod)}patchHttpOptions(t,n){const e=JSON.parse(JSON.stringify(t));for(const[t,o]of Object.entries(n))"object"==typeof o?e[t]=Object.assign(Object.assign({},e[t]),o):void 0!==o&&(e[t]=o);return e}async requestStream(t){let n=this.clientOptions.httpOptions;t.httpOptions&&(n=this.patchHttpOptions(this.clientOptions.httpOptions,t.httpOptions));const e=this.shouldPrependVertexProjectPath(t),o=this.constructUrl(t.path,n,e);o.searchParams.has("alt")&&"sse"===o.searchParams.get("alt")||o.searchParams.set("alt","sse");let i={};return i.body=t.body,i=await this.includeExtraHttpOptionsToRequestInit(i,n,t.abortSignal),this.streamApiCall(o,i,t.httpMethod)}async includeExtraHttpOptionsToRequestInit(t,n,e){if(n&&n.timeout||e){const o=new AbortController,i=o.signal;n.timeout&&(null==n?void 0:n.timeout)>0&&setTimeout((()=>o.abort()),n.timeout),e&&e.addEventListener("abort",(()=>{o.abort();})),t.signal=i;}return t.headers=await this.getHeadersInternal(n),t}async unaryApiCall(t,n,e){return this.apiCall(t.toString(),Object.assign(Object.assign({},n),{method:e})).then((async t=>(await ze(t),new tn(t)))).catch((t=>{throw t instanceof Error?t:new Error(JSON.stringify(t))}))}async streamApiCall(t,n,e){return this.apiCall(t.toString(),Object.assign(Object.assign({},n),{method:e})).then((async t=>(await ze(t),this.processStreamResponse(t)))).catch((t=>{throw t instanceof Error?t:new Error(JSON.stringify(t))}))}processStreamResponse(t){var n;return dn(this,arguments,(function*(){const e=null===(n=null==t?void 0:t.body)||void 0===n?void 0:n.getReader(),o=new TextDecoder("utf-8");if(!e)throw new Error("Response body is empty");try{let n="";for(;;){const{done:i,value:r}=yield cn(e.read());if(i){if(n.trim().length>0)throw new Error("Incomplete JSON segment at the end");break}const l=o.decode(r);try{const t=JSON.parse(l);if("error"in t){const n=JSON.parse(JSON.stringify(t.error)),e=n.status,o=n.code,i=`got status: ${e}. ${JSON.stringify(t)}`;if(o>=400&&o<500){throw new Ke(i)}if(o>=500&&o<600){throw new We(i)}}}catch(t){const n=t;if("ClientError"===n.name||"ServerError"===n.name)throw t}n+=l;let s=n.match(Ye);for(;s;){const e=s[1];try{const o=new Response(e,{headers:null==t?void 0:t.headers,status:null==t?void 0:t.status,statusText:null==t?void 0:t.statusText});yield yield cn(new tn(o)),n=n.slice(s[0].length),s=n.match(Ye);}catch(t){throw new Error(`exception parsing stream chunk ${e}. ${t}`)}}}}finally{e.releaseLock();}}))}async apiCall(t,n){return fetch(t,n).catch((t=>{throw new Error(`exception ${t} sending request`)}))}getDefaultHeaders(){const t={},n="google-genai-sdk/0.13.0 "+this.clientOptions.userAgentExtra;return t["User-Agent"]=n,t["x-goog-api-client"]=n,t["Content-Type"]="application/json",t}async getHeadersInternal(t){const n=new Headers;if(t&&t.headers){for(const[e,o]of Object.entries(t.headers))n.append(e,o);t.timeout&&t.timeout>0&&n.append("X-Server-Timeout",String(Math.ceil(t.timeout/1e3)));}return await this.clientOptions.auth.addAuthHeaders(n),n}async uploadFile(t,n){var e;const o={};null!=n&&(o.mimeType=n.mimeType,o.name=n.name,o.displayName=n.displayName),o.name&&!o.name.startsWith("files/")&&(o.name=`files/${o.name}`);const i=this.clientOptions.uploader,r=await i.stat(t);o.sizeBytes=String(r.size);const l=null!==(e=null==n?void 0:n.mimeType)&&void 0!==e?e:r.type;if(void 0===l||""===l)throw new Error("Can not determine mimeType. Please provide mimeType in the config.");o.mimeType=l;const s=await this.fetchUploadUrl(o,n);return i.upload(t,s,this)}async downloadFile(t){const n=this.clientOptions.downloader;await n.download(t,this);}async fetchUploadUrl(t,n){var e;let o={};o=(null==n?void 0:n.httpOptions)?n.httpOptions:{apiVersion:"",headers:{"Content-Type":"application/json","X-Goog-Upload-Protocol":"resumable","X-Goog-Upload-Command":"start","X-Goog-Upload-Header-Content-Length":`${t.sizeBytes}`,"X-Goog-Upload-Header-Content-Type":`${t.mimeType}`}};const i={file:t},l=await this.request({path:r("upload/v1beta/files",i._url),body:JSON.stringify(i),httpMethod:"POST",httpOptions:o});if(!l||!(null==l?void 0:l.headers))throw new Error("Server did not return an HttpResponse or the returned HttpResponse did not have headers.");const s=null===(e=null==l?void 0:l.headers)||void 0===e?void 0:e["x-goog-upload-url"];if(void 0===s)throw new Error("Failed to get upload url. Server did not return the x-google-upload-url in the headers");return s}}async function ze(t){var n;if(void 0===t)throw new We("response is undefined");if(!t.ok){const e=t.status,o=t.statusText;let i;i=(null===(n=t.headers.get("content-type"))||void 0===n?void 0:n.includes("application/json"))?await t.json():{error:{message:await t.text(),code:t.status,status:t.statusText}};const r=`got status: ${e} ${o}. ${JSON.stringify(i)}`;if(e>=400&&e<500){throw new Ke(r)}if(e>=500&&e<600){throw new We(r)}throw new Error(r)}}
/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */function Xe(t,n){const e={},o=s(n,["config"]);return null!=o&&l(e,["config"],function(t,n,e){const o=s(n,["pageSize"]);void 0!==e&&null!=o&&l(e,["_query","pageSize"],o);const i=s(n,["pageToken"]);void 0!==e&&null!=i&&l(e,["_query","pageToken"],i);const r=s(n,["filter"]);return void 0!==e&&null!=r&&l(e,["_query","filter"],r),{}}(0,o,e)),e}function Ze(t,n){const e={};if(void 0!==s(n,["gcsUri"]))throw new Error("gcsUri parameter is not supported in Gemini API.");const o=s(n,["examples"]);if(null!=o){let t=o;Array.isArray(t)&&(t=t.map((t=>function(t,n){const e={},o=s(n,["textInput"]);null!=o&&l(e,["textInput"],o);const i=s(n,["output"]);return null!=i&&l(e,["output"],i),e}(0,t)))),l(e,["examples","examples"],t);}return e}function Qe(t,n){const e={},o=s(n,["baseModel"]);null!=o&&l(e,["baseModel"],o);const i=s(n,["trainingDataset"]);null!=i&&l(e,["tuningTask","trainingData"],Ze(0,i));const r=s(n,["config"]);return null!=r&&l(e,["config"],function(t,n,e){const o={};if(void 0!==s(n,["validationDataset"]))throw new Error("validationDataset parameter is not supported in Gemini API.");const i=s(n,["tunedModelDisplayName"]);if(void 0!==e&&null!=i&&l(e,["displayName"],i),void 0!==s(n,["description"]))throw new Error("description parameter is not supported in Gemini API.");const r=s(n,["epochCount"]);void 0!==e&&null!=r&&l(e,["tuningTask","hyperparameters","epochCount"],r);const a=s(n,["learningRateMultiplier"]);if(null!=a&&l(o,["tuningTask","hyperparameters","learningRateMultiplier"],a),void 0!==s(n,["adapterSize"]))throw new Error("adapterSize parameter is not supported in Gemini API.");const u=s(n,["batchSize"]);void 0!==e&&null!=u&&l(e,["tuningTask","hyperparameters","batchSize"],u);const c=s(n,["learningRate"]);return void 0!==e&&null!=c&&l(e,["tuningTask","hyperparameters","learningRate"],c),o}(0,r,e)),e}function to(t,n){const e={},o=s(n,["config"]);return null!=o&&l(e,["config"],function(t,n,e){const o=s(n,["pageSize"]);void 0!==e&&null!=o&&l(e,["_query","pageSize"],o);const i=s(n,["pageToken"]);void 0!==e&&null!=i&&l(e,["_query","pageToken"],i);const r=s(n,["filter"]);return void 0!==e&&null!=r&&l(e,["_query","filter"],r),{}}(0,o,e)),e}function no(t,n,e){const o=s(n,["validationDataset"]);void 0!==e&&null!=o&&l(e,["supervisedTuningSpec"],function(t,n){const e={},o=s(n,["gcsUri"]);return null!=o&&l(e,["validationDatasetUri"],o),e}(0,o));const i=s(n,["tunedModelDisplayName"]);void 0!==e&&null!=i&&l(e,["tunedModelDisplayName"],i);const r=s(n,["description"]);void 0!==e&&null!=r&&l(e,["description"],r);const a=s(n,["epochCount"]);void 0!==e&&null!=a&&l(e,["supervisedTuningSpec","hyperParameters","epochCount"],a);const u=s(n,["learningRateMultiplier"]);void 0!==e&&null!=u&&l(e,["supervisedTuningSpec","hyperParameters","learningRateMultiplier"],u);const c=s(n,["adapterSize"]);if(void 0!==e&&null!=c&&l(e,["supervisedTuningSpec","hyperParameters","adapterSize"],c),void 0!==s(n,["batchSize"]))throw new Error("batchSize parameter is not supported in Vertex AI.");if(void 0!==s(n,["learningRate"]))throw new Error("learningRate parameter is not supported in Vertex AI.");return {}}function eo(t,n){const e={},o=s(n,["baseModel"]);null!=o&&l(e,["baseModel"],o);const i=s(n,["trainingDataset"]);null!=i&&l(e,["supervisedTuningSpec","trainingDatasetUri"],function(t,n,e){const o=s(n,["gcsUri"]);if(void 0!==e&&null!=o&&l(e,["supervisedTuningSpec","trainingDatasetUri"],o),void 0!==s(n,["examples"]))throw new Error("examples parameter is not supported in Vertex AI.");return {}}(0,i,e));const r=s(n,["config"]);return null!=r&&l(e,["config"],no(0,r,e)),e}function oo(t,n){const e={},o=s(n,["name"]);null!=o&&l(e,["name"],o);const i=s(n,["state"]);null!=i&&l(e,["state"],I(0,i));const r=s(n,["createTime"]);null!=r&&l(e,["createTime"],r);const a=s(n,["tuningTask","startTime"]);null!=a&&l(e,["startTime"],a);const u=s(n,["tuningTask","completeTime"]);null!=u&&l(e,["endTime"],u);const c=s(n,["updateTime"]);null!=c&&l(e,["updateTime"],c);const d=s(n,["description"]);null!=d&&l(e,["description"],d);const p=s(n,["baseModel"]);null!=p&&l(e,["baseModel"],p);const f=s(n,["_self"]);null!=f&&l(e,["tunedModel"],function(t,n){const e={},o=s(n,["name"]);null!=o&&l(e,["model"],o);const i=s(n,["name"]);return null!=i&&l(e,["endpoint"],i),e}(0,f));const h=s(n,["distillationSpec"]);null!=h&&l(e,["distillationSpec"],h);const g=s(n,["experiment"]);null!=g&&l(e,["experiment"],g);const m=s(n,["labels"]);null!=m&&l(e,["labels"],m);const y=s(n,["pipelineJob"]);null!=y&&l(e,["pipelineJob"],y);const v=s(n,["tunedModelDisplayName"]);return null!=v&&l(e,["tunedModelDisplayName"],v),e}function io(t,n){const e={},o=s(n,["name"]);null!=o&&l(e,["name"],o);const i=s(n,["state"]);null!=i&&l(e,["state"],I(0,i));const r=s(n,["createTime"]);null!=r&&l(e,["createTime"],r);const a=s(n,["startTime"]);null!=a&&l(e,["startTime"],a);const u=s(n,["endTime"]);null!=u&&l(e,["endTime"],u);const c=s(n,["updateTime"]);null!=c&&l(e,["updateTime"],c);const d=s(n,["error"]);null!=d&&l(e,["error"],d);const p=s(n,["description"]);null!=p&&l(e,["description"],p);const f=s(n,["baseModel"]);null!=f&&l(e,["baseModel"],f);const h=s(n,["tunedModel"]);null!=h&&l(e,["tunedModel"],function(t,n){const e={},o=s(n,["model"]);null!=o&&l(e,["model"],o);const i=s(n,["endpoint"]);return null!=i&&l(e,["endpoint"],i),e}(0,h));const g=s(n,["supervisedTuningSpec"]);null!=g&&l(e,["supervisedTuningSpec"],g);const m=s(n,["tuningDataStats"]);null!=m&&l(e,["tuningDataStats"],m);const y=s(n,["encryptionSpec"]);null!=y&&l(e,["encryptionSpec"],y);const v=s(n,["partnerModelTuningSpec"]);null!=v&&l(e,["partnerModelTuningSpec"],v);const C=s(n,["distillationSpec"]);null!=C&&l(e,["distillationSpec"],C);const E=s(n,["experiment"]);null!=E&&l(e,["experiment"],E);const T=s(n,["labels"]);null!=T&&l(e,["labels"],T);const _=s(n,["pipelineJob"]);null!=_&&l(e,["pipelineJob"],_);const O=s(n,["tunedModelDisplayName"]);return null!=O&&l(e,["tunedModelDisplayName"],O),e}
/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
class ro extends i{constructor(t){super(),this.apiClient=t,this.get=async t=>await this.getInternal(t),this.list=async(t={})=>new bt(K.PAGED_ITEM_TUNING_JOBS,(t=>this.listInternal(t)),await this.listInternal(t),t),this.tune=async t=>{if(this.apiClient.isVertexAI())return await this.tuneInternal(t);{const n=await this.tuneMldevInternal(t);let e="";void 0!==n.metadata&&void 0!==n.metadata.tunedModel?e=n.metadata.tunedModel:void 0!==n.name&&n.name.includes("/operations/")&&(e=n.name.split("/operations/")[0]);return {name:e,state:ut.JOB_STATE_QUEUED}}};}async getInternal(t){var n,e,o,i;let a,u="",c={};if(this.apiClient.isVertexAI()){const o=function(t,n){const e={},o=s(n,["name"]);null!=o&&l(e,["_url","name"],o);const i=s(n,["config"]);return null!=i&&l(e,["config"],i),e}(this.apiClient,t);return u=r("{name}",o._url),c=o._query,delete o.config,delete o._url,delete o._query,a=this.apiClient.request({path:u,queryParams:c,body:JSON.stringify(o),httpMethod:"GET",httpOptions:null===(n=t.config)||void 0===n?void 0:n.httpOptions,abortSignal:null===(e=t.config)||void 0===e?void 0:e.abortSignal}).then((t=>t.json())),a.then((t=>io(this.apiClient,t)))}{const n=function(t,n){const e={},o=s(n,["name"]);null!=o&&l(e,["_url","name"],o);const i=s(n,["config"]);return null!=i&&l(e,["config"],i),e}(this.apiClient,t);return u=r("{name}",n._url),c=n._query,delete n.config,delete n._url,delete n._query,a=this.apiClient.request({path:u,queryParams:c,body:JSON.stringify(n),httpMethod:"GET",httpOptions:null===(o=t.config)||void 0===o?void 0:o.httpOptions,abortSignal:null===(i=t.config)||void 0===i?void 0:i.abortSignal}).then((t=>t.json())),a.then((t=>oo(this.apiClient,t)))}}async listInternal(t){var n,e,o,i;let a,u="",c={};if(this.apiClient.isVertexAI()){const o=to(this.apiClient,t);return u=r("tuningJobs",o._url),c=o._query,delete o.config,delete o._url,delete o._query,a=this.apiClient.request({path:u,queryParams:c,body:JSON.stringify(o),httpMethod:"GET",httpOptions:null===(n=t.config)||void 0===n?void 0:n.httpOptions,abortSignal:null===(e=t.config)||void 0===e?void 0:e.abortSignal}).then((t=>t.json())),a.then((t=>{const n=function(t,n){const e={},o=s(n,["nextPageToken"]);null!=o&&l(e,["nextPageToken"],o);const i=s(n,["tuningJobs"]);if(null!=i){let t=i;Array.isArray(t)&&(t=t.map((t=>io(0,t)))),l(e,["tuningJobs"],t);}return e}(this.apiClient,t),e=new zt;return Object.assign(e,n),e}))}{const n=Xe(this.apiClient,t);return u=r("tunedModels",n._url),c=n._query,delete n.config,delete n._url,delete n._query,a=this.apiClient.request({path:u,queryParams:c,body:JSON.stringify(n),httpMethod:"GET",httpOptions:null===(o=t.config)||void 0===o?void 0:o.httpOptions,abortSignal:null===(i=t.config)||void 0===i?void 0:i.abortSignal}).then((t=>t.json())),a.then((t=>{const n=function(t,n){const e={},o=s(n,["nextPageToken"]);null!=o&&l(e,["nextPageToken"],o);const i=s(n,["tunedModels"]);if(null!=i){let t=i;Array.isArray(t)&&(t=t.map((t=>oo(0,t)))),l(e,["tuningJobs"],t);}return e}(this.apiClient,t),e=new zt;return Object.assign(e,n),e}))}}async tuneInternal(t){var n,e;let o,i="",l={};if(this.apiClient.isVertexAI()){const s=eo(this.apiClient,t);return i=r("tuningJobs",s._url),l=s._query,delete s.config,delete s._url,delete s._query,o=this.apiClient.request({path:i,queryParams:l,body:JSON.stringify(s),httpMethod:"POST",httpOptions:null===(n=t.config)||void 0===n?void 0:n.httpOptions,abortSignal:null===(e=t.config)||void 0===e?void 0:e.abortSignal}).then((t=>t.json())),o.then((t=>io(this.apiClient,t)))}throw new Error("This method is only supported by the Vertex AI.")}async tuneMldevInternal(t){var n,e;let o,i="",a={};if(this.apiClient.isVertexAI())throw new Error("This method is only supported by the Gemini Developer API.");{const u=Qe(this.apiClient,t);return i=r("tunedModels",u._url),a=u._query,delete u.config,delete u._url,delete u._query,o=this.apiClient.request({path:i,queryParams:a,body:JSON.stringify(u),httpMethod:"POST",httpOptions:null===(n=t.config)||void 0===n?void 0:n.httpOptions,abortSignal:null===(e=t.config)||void 0===e?void 0:e.abortSignal}).then((t=>t.json())),o.then((t=>function(t,n){const e={},o=s(n,["name"]);null!=o&&l(e,["name"],o);const i=s(n,["metadata"]);null!=i&&l(e,["metadata"],i);const r=s(n,["done"]);null!=r&&l(e,["done"],r);const a=s(n,["error"]);return null!=a&&l(e,["error"],a),e}(this.apiClient,t)))}}}
/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */class lo{async download(t,n){throw new Error("Download to file is not supported in the browser, please use a browser compliant download like an <a> tag.")}}const so="x-goog-upload-status";function ao(t){return new Promise((n=>setTimeout(n,t)))}class uo{async upload(t,n,e){if("string"==typeof t)throw new Error("File path is not supported in browser uploader.");return await async function(t,n,e){var o,i,r;let l=0,s=0,a=new tn(new Response),u="upload";for(l=t.size;s<l;){const r=Math.min(8388608,l-s),c=t.slice(s,s+r);s+r>=l&&(u+=", finalize");let d=0,p=1e3;for(;d<3&&(a=await e.request({path:"",body:c,httpMethod:"POST",httpOptions:{apiVersion:"",baseUrl:n,headers:{"X-Goog-Upload-Command":u,"X-Goog-Upload-Offset":String(s),"Content-Length":String(r)}}}),!(null===(o=null==a?void 0:a.headers)||void 0===o?void 0:o[so]));)d++,await ao(p),p*=2;if(s+=r,"active"!==(null===(i=null==a?void 0:a.headers)||void 0===i?void 0:i[so]))break;if(l<=s)throw new Error("All content has been uploaded, but the upload status is not finalized.")}const c=await(null==a?void 0:a.json());if("final"!==(null===(r=null==a?void 0:a.headers)||void 0===r?void 0:r[so]))throw new Error("Failed to upload file: Upload status is not finalized.");return c.file}(t,n,e)}async stat(t){if("string"==typeof t)throw new Error("File path is not supported in browser uploader.");return await async function(t){return {size:t.size,type:t.type}}(t)}}
/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */class co{create(t,n,e){return new po(t,n,e)}}class po{constructor(t,n,e){this.url=t,this.headers=n,this.callbacks=e;}connect(){this.ws=new WebSocket(this.url),this.ws.onopen=this.callbacks.onopen,this.ws.onerror=this.callbacks.onerror,this.ws.onclose=this.callbacks.onclose,this.ws.onmessage=this.callbacks.onmessage;}send(t){if(void 0===this.ws)throw new Error("WebSocket is not connected");this.ws.send(t);}close(){if(void 0===this.ws)throw new Error("WebSocket is not connected");this.ws.close();}}
/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */const fo="x-goog-api-key";class ho{constructor(t){this.apiKey=t;}async addAuthHeaders(t){null===t.get(fo)&&t.append(fo,this.apiKey);}}
/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */class go{constructor(t){var n;if(null==t.apiKey)throw new Error("An API Key must be set when running in a browser");if(t.project||t.location)throw new Error("Vertex AI project based authentication is not supported on browser runtimes. Please do not provide a project or location.");this.vertexai=null!==(n=t.vertexai)&&void 0!==n&&n,this.apiKey=t.apiKey;const e=o(t,void 0,void 0);e&&(t.httpOptions?t.httpOptions.baseUrl=e:t.httpOptions={baseUrl:e}),this.apiVersion=t.apiVersion;const i=new ho(this.apiKey);this.apiClient=new $e({auth:i,apiVersion:this.apiVersion,apiKey:this.apiKey,vertexai:this.vertexai,httpOptions:t.httpOptions,userAgentExtra:"gl-node/web",uploader:new uo,downloader:new lo}),this.models=new je(this.apiClient),this.live=new Le(this.apiClient,i,new co),this.chats=new gn(this.models,this.apiClient),this.caches=new an(this.apiClient),this.files=new En(this.apiClient),this.operations=new Je(this.apiClient),this.tunings=new ro(this.apiClient);}}

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
        this._genAI = new go({ apiKey });
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
        return this._chat.sendMessageStream({ message: request, config: { responseModalities: [st.TEXT] } });
    }
    async isSensitiveContent(messages) {
        const request = await this._getSensitiveContentPrompt(messages);
        if (!request.length || request.every((item) => typeof item === "string")) {
            return undefined;
        }
        const schema = {
            type: nt.OBJECT,
            properties: {
                isEmetophobia: { type: nt.BOOLEAN },
                isArachnophobia: { type: nt.BOOLEAN },
                isEpileptic: { type: nt.BOOLEAN },
                isSexual: { type: nt.BOOLEAN }
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
                        mediasPrompt.push(Mt(convertArrayBufferToBase64(buffer), media.mimeType));
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
        while (messagesFiles.some((messageFiles) => messageFiles.files.some((file) => file.state === yt.PROCESSING))) {
            for (const messageFiles of messagesFiles) {
                for (let i = 0; i < messageFiles.files.length; i++) {
                    const file = messageFiles.files[i];
                    if (file.name && !verifiedFiles.has(file.name)) {
                        if (file.state === yt.PROCESSING) {
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
            dataPart: messageFiles.files.filter((file) => file.state === yt.ACTIVE && file.uri && file.mimeType).map((file) => Pt(file.uri, file.mimeType))
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
        const root = BdApi.ReactDOM.createRoot(node);
        root.render(button);
        BdApi.DOM.onRemoved(node, this._add.bind(this));
    }
    _remove() {
        const element = document.getElementById(this._id);
        if (element) {
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
        const channelReadState = this._readStateStore.getReadStatesByChannel().get(channelId);
        if (channelReadState?.oldestUnreadMessageId) {
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
        const channelReadState = this._readStateStore.getReadStatesByChannel().get(channelId);
        if (channelReadState?.oldestUnreadMessageId) {
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
