/**
 * @name BDiscordAI
 * @author gassastsina
 * @description Summarize unread messages with Gemini and block sensible medias content.
 * @version 1.0.0
 * @authorId 292388871381975040
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
                            { label: "Gemini 2.5 Pro (Preview)", value: "gemini-2.5-pro-preview-06-05" },
                            { label: "Gemini 2.0 Flash", value: "gemini-2.0-flash" },
                            { label: "Gemini 2.0 Flash-Lite", value: "gemini-2.0-flash-lite" }
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
 * Original file: /npm/@google/genai@0.14.1/dist/web/index.mjs
 *
 * Do NOT use SRI with dynamically generated files! More information: https://www.jsdelivr.com/using-sri-with-dynamic-files
 */
/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
let t,n;function o(e,o,i){var r,s,l;if(!(null===(r=e.httpOptions)||void 0===r?void 0:r.baseUrl)){const r={geminiUrl:t,vertexUrl:n};return e.vertexai?null!==(s=r.vertexUrl)&&void 0!==s?s:o:null!==(l=r.geminiUrl)&&void 0!==l?l:i}return e.httpOptions.baseUrl}
/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */class i{}function r(t,n){return t.replace(/\{([^}]+)\}/g,((t,e)=>{if(Object.prototype.hasOwnProperty.call(n,e)){const t=n[e];return null!=t?String(t):""}throw new Error(`Key '${e}' not found in valueMap.`)}))}function s(t,n,e){for(let o=0;o<n.length-1;o++){const i=n[o];if(i.endsWith("[]")){const r=i.slice(0,-2);if(!(r in t)){if(!Array.isArray(e))throw new Error(`Value must be a list given an array path ${i}`);t[r]=Array.from({length:e.length},(()=>({})));}if(Array.isArray(t[r])){const i=t[r];if(Array.isArray(e))for(let t=0;t<i.length;t++){s(i[t],n.slice(o+1),e[t]);}else for(const t of i)s(t,n.slice(o+1),e);}return}if(i.endsWith("[0]")){const r=i.slice(0,-3);r in t||(t[r]=[{}]);return void s(t[r][0],n.slice(o+1),e)}t[i]&&"object"==typeof t[i]||(t[i]={}),t=t[i];}const o=n[n.length-1],i=t[o];if(void 0!==i){if(!e||"object"==typeof e&&0===Object.keys(e).length)return;if(e===i)return;if("object"!=typeof i||"object"!=typeof e||null===i||null===e)throw new Error(`Cannot set value for an existing key. Key: ${o}`);Object.assign(i,e);}else t[o]=e;}function l(t,n){try{if(1===n.length&&"_self"===n[0])return t;for(let e=0;e<n.length;e++){if("object"!=typeof t||null===t)return;const o=n[e];if(o.endsWith("[]")){const i=o.slice(0,-2);if(i in t){const o=t[i];if(!Array.isArray(o))return;return o.map((t=>l(t,n.slice(e+1))))}return}t=t[o];}return t}catch(t){if(t instanceof TypeError)return;throw t}}
/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */function a(t,n){if(!n||"string"!=typeof n)throw new Error("model is required and must be a string");if(t.isVertexAI()){if(n.startsWith("publishers/")||n.startsWith("projects/")||n.startsWith("models/"))return n;if(n.indexOf("/")>=0){const t=n.split("/",2);return `publishers/${t[0]}/models/${t[1]}`}return `publishers/google/models/${n}`}return n.startsWith("models/")||n.startsWith("tunedModels/")?n:`models/${n}`}function u(t,n){const e=a(t,n);return e?e.startsWith("publishers/")&&t.isVertexAI()?`projects/${t.getProject()}/locations/${t.getLocation()}/${e}`:e.startsWith("models/")&&t.isVertexAI()?`projects/${t.getProject()}/locations/${t.getLocation()}/publishers/google/${e}`:e:""}function c(t,n){return Array.isArray(n)?n.map((n=>d(t,n))):[d(t,n)]}function d(t,n){if("object"==typeof n&&null!==n)return n;throw new Error("Could not parse input as Blob. Unsupported blob type: "+typeof n)}function p(t,n){if(null==n)throw new Error("PartUnion is required");if("object"==typeof n)return n;if("string"==typeof n)return {text:n};throw new Error("Unsupported part type: "+typeof n)}function f(t,n){if(null==n||Array.isArray(n)&&0===n.length)throw new Error("PartListUnion is required");return Array.isArray(n)?n.map((t=>p(0,t))):[p(0,n)]}function h(t){return null!=t&&"object"==typeof t&&"parts"in t&&Array.isArray(t.parts)}function g(t){return null!=t&&"object"==typeof t&&"functionCall"in t}function m(t){return null!=t&&"object"==typeof t&&"functionResponse"in t}function y(t,n){if(null==n)throw new Error("ContentUnion is required");return h(n)?n:{role:"user",parts:f(0,n)}}function v(t,n){if(!n)return [];if(t.isVertexAI()&&Array.isArray(n))return n.flatMap((t=>{const n=y(0,t);return n.parts&&n.parts.length>0&&void 0!==n.parts[0].text?[n.parts[0].text]:[]}));if(t.isVertexAI()){const t=y(0,n);return t.parts&&t.parts.length>0&&void 0!==t.parts[0].text?[t.parts[0].text]:[]}return Array.isArray(n)?n.map((t=>y(0,t))):[y(0,n)]}function E(t,n){if(null==n||Array.isArray(n)&&0===n.length)throw new Error("contents are required");if(!Array.isArray(n)){if(g(n)||m(n))throw new Error("To specify functionCall or functionResponse parts, please wrap them in a Content object, specifying the role for them");return [y(0,n)]}const e=[],o=[],i=h(n[0]);for(const t of n){const n=h(t);if(n!=i)throw new Error("Mixing Content and Parts is not supported, please group the parts into a the appropriate Content objects and specify the roles for them");if(n)e.push(t);else {if(g(t)||m(t))throw new Error("To specify functionCall or functionResponse parts, please wrap them, and any other parts, in Content objects as appropriate, specifying the role for them");o.push(t);}}return i||e.push({role:"user",parts:f(0,o)}),e}function C(t,n){return n}function T(t,n){if("object"==typeof n)return n;if("string"==typeof n)return {voiceConfig:{prebuiltVoiceConfig:{voiceName:n}}};throw new Error("Unsupported speechConfig type: "+typeof n)}function I(t,n){return n}function _(t,n){if(!Array.isArray(n))throw new Error("tool is required and must be an array of Tools");return n}function O(t,n){if("string"!=typeof n)throw new Error("name must be a string");return function(t,n,e,o=1){const i=!n.startsWith(`${e}/`)&&n.split("/").length===o;return t.isVertexAI()?n.startsWith("projects/")?n:n.startsWith("locations/")?`projects/${t.getProject()}/${n}`:n.startsWith(`${e}/`)?`projects/${t.getProject()}/locations/${t.getLocation()}/${n}`:i?`projects/${t.getProject()}/locations/${t.getLocation()}/${e}/${n}`:n:i?`${e}/${n}`:n}(t,n,"cachedContents")}function A(t,n){switch(n){case "STATE_UNSPECIFIED":return "JOB_STATE_UNSPECIFIED";case "CREATING":return "JOB_STATE_RUNNING";case "ACTIVE":return "JOB_STATE_SUCCEEDED";case "FAILED":return "JOB_STATE_FAILED";default:return n}}function S(t,n){if("string"!=typeof n)throw new Error("fromImageBytes must be a string");return n}function b(t,n){var e;let o;var i;if(null!=(i=n)&&"object"==typeof i&&"name"in i&&(o=n.name),!(function(t){return null!=t&&"object"==typeof t&&"uri"in t}(n)&&(o=n.uri,void 0===o)||function(t){return null!=t&&"object"==typeof t&&"video"in t}(n)&&(o=null===(e=n.video)||void 0===e?void 0:e.uri,void 0===o))){if("string"==typeof n&&(o=n),void 0===o)throw new Error("Could not extract file name from the provided input.");if(o.startsWith("https://")){const t=o.split("files/")[1].match(/[a-z0-9]+/);if(null===t)throw new Error(`Could not extract file name from URI ${o}`);o=t[0];}else o.startsWith("files/")&&(o=o.split("files/")[1]);return o}}function w(t,n){let e;return e=t.isVertexAI()?n?"publishers/google/models":"models":n?"models":"tunedModels",e}function P(t,n){for(const t of ["models","tunedModels","publisherModels"])if(o=t,null!==(e=n)&&"object"==typeof e&&o in e)return n[t];var e,o;
/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */return []}function N(t,n){const e={};if(void 0!==l(n,["videoMetadata"]))throw new Error("videoMetadata parameter is not supported in Gemini API.");const o=l(n,["thought"]);null!=o&&s(e,["thought"],o);const i=l(n,["inlineData"]);null!=i&&s(e,["inlineData"],function(t,n){const e={};if(void 0!==l(n,["displayName"]))throw new Error("displayName parameter is not supported in Gemini API.");const o=l(n,["data"]);null!=o&&s(e,["data"],o);const i=l(n,["mimeType"]);return null!=i&&s(e,["mimeType"],i),e}(0,i));const r=l(n,["codeExecutionResult"]);null!=r&&s(e,["codeExecutionResult"],r);const a=l(n,["executableCode"]);null!=a&&s(e,["executableCode"],a);const u=l(n,["fileData"]);null!=u&&s(e,["fileData"],u);const c=l(n,["functionCall"]);null!=c&&s(e,["functionCall"],c);const d=l(n,["functionResponse"]);null!=d&&s(e,["functionResponse"],d);const p=l(n,["text"]);return null!=p&&s(e,["text"],p),e}function D(t,n){const e={},o=l(n,["parts"]);if(null!=o){let t=o;Array.isArray(t)&&(t=t.map((t=>N(0,t)))),s(e,["parts"],t);}const i=l(n,["role"]);return null!=i&&s(e,["role"],i),e}function R(t,n){const e={},o=l(n,["dynamicRetrievalConfig"]);return null!=o&&s(e,["dynamicRetrievalConfig"],function(t,n){const e={},o=l(n,["mode"]);null!=o&&s(e,["mode"],o);const i=l(n,["dynamicThreshold"]);return null!=i&&s(e,["dynamicThreshold"],i),e}(0,o)),e}function M(t,n){const e={},o=l(n,["functionCallingConfig"]);if(null!=o&&s(e,["functionCallingConfig"],function(t,n){const e={},o=l(n,["mode"]);null!=o&&s(e,["mode"],o);const i=l(n,["allowedFunctionNames"]);return null!=i&&s(e,["allowedFunctionNames"],i),e}(0,o)),void 0!==l(n,["retrievalConfig"]))throw new Error("retrievalConfig parameter is not supported in Gemini API.");return e}function x(t,n,e){const o=l(n,["ttl"]);void 0!==e&&null!=o&&s(e,["ttl"],o);const i=l(n,["expireTime"]);void 0!==e&&null!=i&&s(e,["expireTime"],i);const r=l(n,["displayName"]);void 0!==e&&null!=r&&s(e,["displayName"],r);const a=l(n,["contents"]);if(void 0!==e&&null!=a){let t=E(0,a);Array.isArray(t)&&(t=t.map((t=>D(0,t)))),s(e,["contents"],t);}const u=l(n,["systemInstruction"]);void 0!==e&&null!=u&&s(e,["systemInstruction"],D(0,y(0,u)));const c=l(n,["tools"]);if(void 0!==e&&null!=c){let t=c;Array.isArray(t)&&(t=t.map((t=>function(t,n){const e={};if(void 0!==l(n,["retrieval"]))throw new Error("retrieval parameter is not supported in Gemini API.");null!=l(n,["googleSearch"])&&s(e,["googleSearch"],{});const o=l(n,["googleSearchRetrieval"]);if(null!=o&&s(e,["googleSearchRetrieval"],R(0,o)),void 0!==l(n,["enterpriseWebSearch"]))throw new Error("enterpriseWebSearch parameter is not supported in Gemini API.");if(void 0!==l(n,["googleMaps"]))throw new Error("googleMaps parameter is not supported in Gemini API.");const i=l(n,["codeExecution"]);null!=i&&s(e,["codeExecution"],i);const r=l(n,["functionDeclarations"]);return null!=r&&s(e,["functionDeclarations"],r),e}(0,t)))),s(e,["tools"],t);}const d=l(n,["toolConfig"]);return void 0!==e&&null!=d&&s(e,["toolConfig"],M(0,d)),{}}function U(t,n){const e={},o=l(n,["name"]);null!=o&&s(e,["_url","name"],O(t,o));const i=l(n,["config"]);return null!=i&&s(e,["config"],function(t,n,e){const o=l(n,["ttl"]);void 0!==e&&null!=o&&s(e,["ttl"],o);const i=l(n,["expireTime"]);return void 0!==e&&null!=i&&s(e,["expireTime"],i),{}}(0,i,e)),e}function q(t,n){const e={},o=l(n,["config"]);return null!=o&&s(e,["config"],function(t,n,e){const o=l(n,["pageSize"]);void 0!==e&&null!=o&&s(e,["_query","pageSize"],o);const i=l(n,["pageToken"]);return void 0!==e&&null!=i&&s(e,["_query","pageToken"],i),{}}(0,o,e)),e}function L(t,n){const e={},o=l(n,["videoMetadata"]);null!=o&&s(e,["videoMetadata"],o);const i=l(n,["thought"]);null!=i&&s(e,["thought"],i);const r=l(n,["inlineData"]);null!=r&&s(e,["inlineData"],function(t,n){const e={},o=l(n,["displayName"]);null!=o&&s(e,["displayName"],o);const i=l(n,["data"]);null!=i&&s(e,["data"],i);const r=l(n,["mimeType"]);return null!=r&&s(e,["mimeType"],r),e}(0,r));const a=l(n,["codeExecutionResult"]);null!=a&&s(e,["codeExecutionResult"],a);const u=l(n,["executableCode"]);null!=u&&s(e,["executableCode"],u);const c=l(n,["fileData"]);null!=c&&s(e,["fileData"],c);const d=l(n,["functionCall"]);null!=d&&s(e,["functionCall"],d);const p=l(n,["functionResponse"]);null!=p&&s(e,["functionResponse"],p);const f=l(n,["text"]);return null!=f&&s(e,["text"],f),e}function G(t,n){const e={},o=l(n,["parts"]);if(null!=o){let t=o;Array.isArray(t)&&(t=t.map((t=>L(0,t)))),s(e,["parts"],t);}const i=l(n,["role"]);return null!=i&&s(e,["role"],i),e}function k(t,n){const e={},o=l(n,["dynamicRetrievalConfig"]);return null!=o&&s(e,["dynamicRetrievalConfig"],function(t,n){const e={},o=l(n,["mode"]);null!=o&&s(e,["mode"],o);const i=l(n,["dynamicThreshold"]);return null!=i&&s(e,["dynamicThreshold"],i),e}(0,o)),e}function j(t,n){const e={},o=l(n,["apiKeyConfig"]);null!=o&&s(e,["apiKeyConfig"],function(t,n){const e={},o=l(n,["apiKeyString"]);return null!=o&&s(e,["apiKeyString"],o),e}(0,o));const i=l(n,["authType"]);null!=i&&s(e,["authType"],i);const r=l(n,["googleServiceAccountConfig"]);null!=r&&s(e,["googleServiceAccountConfig"],r);const a=l(n,["httpBasicAuthConfig"]);null!=a&&s(e,["httpBasicAuthConfig"],a);const u=l(n,["oauthConfig"]);null!=u&&s(e,["oauthConfig"],u);const c=l(n,["oidcConfig"]);return null!=c&&s(e,["oidcConfig"],c),e}function F(t,n){const e={},o=l(n,["retrieval"]);null!=o&&s(e,["retrieval"],o);null!=l(n,["googleSearch"])&&s(e,["googleSearch"],{});const i=l(n,["googleSearchRetrieval"]);null!=i&&s(e,["googleSearchRetrieval"],k(0,i));null!=l(n,["enterpriseWebSearch"])&&s(e,["enterpriseWebSearch"],{});const r=l(n,["googleMaps"]);null!=r&&s(e,["googleMaps"],function(t,n){const e={},o=l(n,["authConfig"]);return null!=o&&s(e,["authConfig"],j(0,o)),e}(0,r));const a=l(n,["codeExecution"]);null!=a&&s(e,["codeExecution"],a);const u=l(n,["functionDeclarations"]);return null!=u&&s(e,["functionDeclarations"],u),e}function V(t,n){const e={},o=l(n,["latLng"]);return null!=o&&s(e,["latLng"],function(t,n){const e={},o=l(n,["latitude"]);null!=o&&s(e,["latitude"],o);const i=l(n,["longitude"]);return null!=i&&s(e,["longitude"],i),e}(0,o)),e}function H(t,n){const e={},o=l(n,["functionCallingConfig"]);null!=o&&s(e,["functionCallingConfig"],function(t,n){const e={},o=l(n,["mode"]);null!=o&&s(e,["mode"],o);const i=l(n,["allowedFunctionNames"]);return null!=i&&s(e,["allowedFunctionNames"],i),e}(0,o));const i=l(n,["retrievalConfig"]);return null!=i&&s(e,["retrievalConfig"],V(0,i)),e}function B(t,n){const e={},o=l(n,["model"]);null!=o&&s(e,["model"],u(t,o));const i=l(n,["config"]);return null!=i&&s(e,["config"],function(t,n,e){const o=l(n,["ttl"]);void 0!==e&&null!=o&&s(e,["ttl"],o);const i=l(n,["expireTime"]);void 0!==e&&null!=i&&s(e,["expireTime"],i);const r=l(n,["displayName"]);void 0!==e&&null!=r&&s(e,["displayName"],r);const a=l(n,["contents"]);if(void 0!==e&&null!=a){let t=E(0,a);Array.isArray(t)&&(t=t.map((t=>G(0,t)))),s(e,["contents"],t);}const u=l(n,["systemInstruction"]);void 0!==e&&null!=u&&s(e,["systemInstruction"],G(0,y(0,u)));const c=l(n,["tools"]);if(void 0!==e&&null!=c){let t=c;Array.isArray(t)&&(t=t.map((t=>F(0,t)))),s(e,["tools"],t);}const d=l(n,["toolConfig"]);return void 0!==e&&null!=d&&s(e,["toolConfig"],H(0,d)),{}}(0,i,e)),e}function J(t,n){const e={},o=l(n,["name"]);null!=o&&s(e,["_url","name"],O(t,o));const i=l(n,["config"]);return null!=i&&s(e,["config"],function(t,n,e){const o=l(n,["ttl"]);void 0!==e&&null!=o&&s(e,["ttl"],o);const i=l(n,["expireTime"]);return void 0!==e&&null!=i&&s(e,["expireTime"],i),{}}(0,i,e)),e}function Y(t,n){const e={},o=l(n,["config"]);return null!=o&&s(e,["config"],function(t,n,e){const o=l(n,["pageSize"]);void 0!==e&&null!=o&&s(e,["_query","pageSize"],o);const i=l(n,["pageToken"]);return void 0!==e&&null!=i&&s(e,["_query","pageToken"],i),{}}(0,o,e)),e}function K(t,n){const e={},o=l(n,["name"]);null!=o&&s(e,["name"],o);const i=l(n,["displayName"]);null!=i&&s(e,["displayName"],i);const r=l(n,["model"]);null!=r&&s(e,["model"],r);const a=l(n,["createTime"]);null!=a&&s(e,["createTime"],a);const u=l(n,["updateTime"]);null!=u&&s(e,["updateTime"],u);const c=l(n,["expireTime"]);null!=c&&s(e,["expireTime"],c);const d=l(n,["usageMetadata"]);return null!=d&&s(e,["usageMetadata"],d),e}function W(t,n){const e={},o=l(n,["name"]);null!=o&&s(e,["name"],o);const i=l(n,["displayName"]);null!=i&&s(e,["displayName"],i);const r=l(n,["model"]);null!=r&&s(e,["model"],r);const a=l(n,["createTime"]);null!=a&&s(e,["createTime"],a);const u=l(n,["updateTime"]);null!=u&&s(e,["updateTime"],u);const c=l(n,["expireTime"]);null!=c&&s(e,["expireTime"],c);const d=l(n,["usageMetadata"]);return null!=d&&s(e,["usageMetadata"],d),e}
/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
var $,z,X,Z,Q,tt,nt,et,ot,it,rt,st,lt,at,ut,ct,dt,pt,ft,ht,gt,mt,yt,vt,Et,Ct,Tt,It,_t,Ot,At,St,bt,wt,Pt;!function(t){t.PAGED_ITEM_BATCH_JOBS="batchJobs",t.PAGED_ITEM_MODELS="models",t.PAGED_ITEM_TUNING_JOBS="tuningJobs",t.PAGED_ITEM_FILES="files",t.PAGED_ITEM_CACHED_CONTENTS="cachedContents";}($||($={}));class Nt{constructor(t,n,e,o){this.pageInternal=[],this.paramsInternal={},this.requestInternal=n,this.init(t,e,o);}init(t,n,e){var o,i;this.nameInternal=t,this.pageInternal=n[this.nameInternal]||[],this.idxInternal=0;let r={config:{}};r=e?"object"==typeof e?Object.assign({},e):e:{config:{}},r.config&&(r.config.pageToken=n.nextPageToken),this.paramsInternal=r,this.pageInternalSize=null!==(i=null===(o=r.config)||void 0===o?void 0:o.pageSize)&&void 0!==i?i:this.pageInternal.length;}initNextPage(t){this.init(this.nameInternal,t,this.paramsInternal);}get page(){return this.pageInternal}get name(){return this.nameInternal}get pageSize(){return this.pageInternalSize}get params(){return this.paramsInternal}get pageLength(){return this.pageInternal.length}getItem(t){return this.pageInternal[t]}[Symbol.asyncIterator](){return {next:async()=>{if(this.idxInternal>=this.pageLength){if(!this.hasNextPage())return {value:void 0,done:true};await this.nextPage();}const t=this.getItem(this.idxInternal);return this.idxInternal+=1,{value:t,done:false}},return:async()=>({value:void 0,done:true})}}async nextPage(){if(!this.hasNextPage())throw new Error("No more pages to fetch.");const t=await this.requestInternal(this.params);return this.initNextPage(t),this.page}hasNextPage(){var t;return void 0!==(null===(t=this.params.config)||void 0===t?void 0:t.pageToken)}}
/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */!function(t){t.OUTCOME_UNSPECIFIED="OUTCOME_UNSPECIFIED",t.OUTCOME_OK="OUTCOME_OK",t.OUTCOME_FAILED="OUTCOME_FAILED",t.OUTCOME_DEADLINE_EXCEEDED="OUTCOME_DEADLINE_EXCEEDED";}(z||(z={})),function(t){t.LANGUAGE_UNSPECIFIED="LANGUAGE_UNSPECIFIED",t.PYTHON="PYTHON";}(X||(X={})),function(t){t.HARM_CATEGORY_UNSPECIFIED="HARM_CATEGORY_UNSPECIFIED",t.HARM_CATEGORY_HATE_SPEECH="HARM_CATEGORY_HATE_SPEECH",t.HARM_CATEGORY_DANGEROUS_CONTENT="HARM_CATEGORY_DANGEROUS_CONTENT",t.HARM_CATEGORY_HARASSMENT="HARM_CATEGORY_HARASSMENT",t.HARM_CATEGORY_SEXUALLY_EXPLICIT="HARM_CATEGORY_SEXUALLY_EXPLICIT",t.HARM_CATEGORY_CIVIC_INTEGRITY="HARM_CATEGORY_CIVIC_INTEGRITY";}(Z||(Z={})),function(t){t.HARM_BLOCK_METHOD_UNSPECIFIED="HARM_BLOCK_METHOD_UNSPECIFIED",t.SEVERITY="SEVERITY",t.PROBABILITY="PROBABILITY";}(Q||(Q={})),function(t){t.HARM_BLOCK_THRESHOLD_UNSPECIFIED="HARM_BLOCK_THRESHOLD_UNSPECIFIED",t.BLOCK_LOW_AND_ABOVE="BLOCK_LOW_AND_ABOVE",t.BLOCK_MEDIUM_AND_ABOVE="BLOCK_MEDIUM_AND_ABOVE",t.BLOCK_ONLY_HIGH="BLOCK_ONLY_HIGH",t.BLOCK_NONE="BLOCK_NONE",t.OFF="OFF";}(tt||(tt={})),function(t){t.MODE_UNSPECIFIED="MODE_UNSPECIFIED",t.MODE_DYNAMIC="MODE_DYNAMIC";}(nt||(nt={})),function(t){t.AUTH_TYPE_UNSPECIFIED="AUTH_TYPE_UNSPECIFIED",t.NO_AUTH="NO_AUTH",t.API_KEY_AUTH="API_KEY_AUTH",t.HTTP_BASIC_AUTH="HTTP_BASIC_AUTH",t.GOOGLE_SERVICE_ACCOUNT_AUTH="GOOGLE_SERVICE_ACCOUNT_AUTH",t.OAUTH="OAUTH",t.OIDC_AUTH="OIDC_AUTH";}(et||(et={})),function(t){t.TYPE_UNSPECIFIED="TYPE_UNSPECIFIED",t.STRING="STRING",t.NUMBER="NUMBER",t.INTEGER="INTEGER",t.BOOLEAN="BOOLEAN",t.ARRAY="ARRAY",t.OBJECT="OBJECT";}(ot||(ot={})),function(t){t.FINISH_REASON_UNSPECIFIED="FINISH_REASON_UNSPECIFIED",t.STOP="STOP",t.MAX_TOKENS="MAX_TOKENS",t.SAFETY="SAFETY",t.RECITATION="RECITATION",t.LANGUAGE="LANGUAGE",t.OTHER="OTHER",t.BLOCKLIST="BLOCKLIST",t.PROHIBITED_CONTENT="PROHIBITED_CONTENT",t.SPII="SPII",t.MALFORMED_FUNCTION_CALL="MALFORMED_FUNCTION_CALL",t.IMAGE_SAFETY="IMAGE_SAFETY";}(it||(it={})),function(t){t.HARM_PROBABILITY_UNSPECIFIED="HARM_PROBABILITY_UNSPECIFIED",t.NEGLIGIBLE="NEGLIGIBLE",t.LOW="LOW",t.MEDIUM="MEDIUM",t.HIGH="HIGH";}(rt||(rt={})),function(t){t.HARM_SEVERITY_UNSPECIFIED="HARM_SEVERITY_UNSPECIFIED",t.HARM_SEVERITY_NEGLIGIBLE="HARM_SEVERITY_NEGLIGIBLE",t.HARM_SEVERITY_LOW="HARM_SEVERITY_LOW",t.HARM_SEVERITY_MEDIUM="HARM_SEVERITY_MEDIUM",t.HARM_SEVERITY_HIGH="HARM_SEVERITY_HIGH";}(st||(st={})),function(t){t.BLOCKED_REASON_UNSPECIFIED="BLOCKED_REASON_UNSPECIFIED",t.SAFETY="SAFETY",t.OTHER="OTHER",t.BLOCKLIST="BLOCKLIST",t.PROHIBITED_CONTENT="PROHIBITED_CONTENT";}(lt||(lt={})),function(t){t.TRAFFIC_TYPE_UNSPECIFIED="TRAFFIC_TYPE_UNSPECIFIED",t.ON_DEMAND="ON_DEMAND",t.PROVISIONED_THROUGHPUT="PROVISIONED_THROUGHPUT";}(at||(at={})),function(t){t.MODALITY_UNSPECIFIED="MODALITY_UNSPECIFIED",t.TEXT="TEXT",t.IMAGE="IMAGE",t.AUDIO="AUDIO";}(ut||(ut={})),function(t){t.MEDIA_RESOLUTION_UNSPECIFIED="MEDIA_RESOLUTION_UNSPECIFIED",t.MEDIA_RESOLUTION_LOW="MEDIA_RESOLUTION_LOW",t.MEDIA_RESOLUTION_MEDIUM="MEDIA_RESOLUTION_MEDIUM",t.MEDIA_RESOLUTION_HIGH="MEDIA_RESOLUTION_HIGH";}(ct||(ct={})),function(t){t.JOB_STATE_UNSPECIFIED="JOB_STATE_UNSPECIFIED",t.JOB_STATE_QUEUED="JOB_STATE_QUEUED",t.JOB_STATE_PENDING="JOB_STATE_PENDING",t.JOB_STATE_RUNNING="JOB_STATE_RUNNING",t.JOB_STATE_SUCCEEDED="JOB_STATE_SUCCEEDED",t.JOB_STATE_FAILED="JOB_STATE_FAILED",t.JOB_STATE_CANCELLING="JOB_STATE_CANCELLING",t.JOB_STATE_CANCELLED="JOB_STATE_CANCELLED",t.JOB_STATE_PAUSED="JOB_STATE_PAUSED",t.JOB_STATE_EXPIRED="JOB_STATE_EXPIRED",t.JOB_STATE_UPDATING="JOB_STATE_UPDATING",t.JOB_STATE_PARTIALLY_SUCCEEDED="JOB_STATE_PARTIALLY_SUCCEEDED";}(dt||(dt={})),function(t){t.ADAPTER_SIZE_UNSPECIFIED="ADAPTER_SIZE_UNSPECIFIED",t.ADAPTER_SIZE_ONE="ADAPTER_SIZE_ONE",t.ADAPTER_SIZE_TWO="ADAPTER_SIZE_TWO",t.ADAPTER_SIZE_FOUR="ADAPTER_SIZE_FOUR",t.ADAPTER_SIZE_EIGHT="ADAPTER_SIZE_EIGHT",t.ADAPTER_SIZE_SIXTEEN="ADAPTER_SIZE_SIXTEEN",t.ADAPTER_SIZE_THIRTY_TWO="ADAPTER_SIZE_THIRTY_TWO";}(pt||(pt={})),function(t){t.FEATURE_SELECTION_PREFERENCE_UNSPECIFIED="FEATURE_SELECTION_PREFERENCE_UNSPECIFIED",t.PRIORITIZE_QUALITY="PRIORITIZE_QUALITY",t.BALANCED="BALANCED",t.PRIORITIZE_COST="PRIORITIZE_COST";}(ft||(ft={})),function(t){t.MODE_UNSPECIFIED="MODE_UNSPECIFIED",t.MODE_DYNAMIC="MODE_DYNAMIC";}(ht||(ht={})),function(t){t.MODE_UNSPECIFIED="MODE_UNSPECIFIED",t.AUTO="AUTO",t.ANY="ANY",t.NONE="NONE";}(gt||(gt={})),function(t){t.BLOCK_LOW_AND_ABOVE="BLOCK_LOW_AND_ABOVE",t.BLOCK_MEDIUM_AND_ABOVE="BLOCK_MEDIUM_AND_ABOVE",t.BLOCK_ONLY_HIGH="BLOCK_ONLY_HIGH",t.BLOCK_NONE="BLOCK_NONE";}(mt||(mt={})),function(t){t.DONT_ALLOW="DONT_ALLOW",t.ALLOW_ADULT="ALLOW_ADULT",t.ALLOW_ALL="ALLOW_ALL";}(yt||(yt={})),function(t){t.auto="auto",t.en="en",t.ja="ja",t.ko="ko",t.hi="hi";}(vt||(vt={})),function(t){t.MASK_MODE_DEFAULT="MASK_MODE_DEFAULT",t.MASK_MODE_USER_PROVIDED="MASK_MODE_USER_PROVIDED",t.MASK_MODE_BACKGROUND="MASK_MODE_BACKGROUND",t.MASK_MODE_FOREGROUND="MASK_MODE_FOREGROUND",t.MASK_MODE_SEMANTIC="MASK_MODE_SEMANTIC";}(Et||(Et={})),function(t){t.CONTROL_TYPE_DEFAULT="CONTROL_TYPE_DEFAULT",t.CONTROL_TYPE_CANNY="CONTROL_TYPE_CANNY",t.CONTROL_TYPE_SCRIBBLE="CONTROL_TYPE_SCRIBBLE",t.CONTROL_TYPE_FACE_MESH="CONTROL_TYPE_FACE_MESH";}(Ct||(Ct={})),function(t){t.SUBJECT_TYPE_DEFAULT="SUBJECT_TYPE_DEFAULT",t.SUBJECT_TYPE_PERSON="SUBJECT_TYPE_PERSON",t.SUBJECT_TYPE_ANIMAL="SUBJECT_TYPE_ANIMAL",t.SUBJECT_TYPE_PRODUCT="SUBJECT_TYPE_PRODUCT";}(Tt||(Tt={})),function(t){t.EDIT_MODE_DEFAULT="EDIT_MODE_DEFAULT",t.EDIT_MODE_INPAINT_REMOVAL="EDIT_MODE_INPAINT_REMOVAL",t.EDIT_MODE_INPAINT_INSERTION="EDIT_MODE_INPAINT_INSERTION",t.EDIT_MODE_OUTPAINT="EDIT_MODE_OUTPAINT",t.EDIT_MODE_CONTROLLED_EDITING="EDIT_MODE_CONTROLLED_EDITING",t.EDIT_MODE_STYLE="EDIT_MODE_STYLE",t.EDIT_MODE_BGSWAP="EDIT_MODE_BGSWAP",t.EDIT_MODE_PRODUCT_IMAGE="EDIT_MODE_PRODUCT_IMAGE";}(It||(It={})),function(t){t.STATE_UNSPECIFIED="STATE_UNSPECIFIED",t.PROCESSING="PROCESSING",t.ACTIVE="ACTIVE",t.FAILED="FAILED";}(_t||(_t={})),function(t){t.SOURCE_UNSPECIFIED="SOURCE_UNSPECIFIED",t.UPLOADED="UPLOADED",t.GENERATED="GENERATED";}(Ot||(Ot={})),function(t){t.MODALITY_UNSPECIFIED="MODALITY_UNSPECIFIED",t.TEXT="TEXT",t.IMAGE="IMAGE",t.VIDEO="VIDEO",t.AUDIO="AUDIO",t.DOCUMENT="DOCUMENT";}(At||(At={})),function(t){t.START_SENSITIVITY_UNSPECIFIED="START_SENSITIVITY_UNSPECIFIED",t.START_SENSITIVITY_HIGH="START_SENSITIVITY_HIGH",t.START_SENSITIVITY_LOW="START_SENSITIVITY_LOW";}(St||(St={})),function(t){t.END_SENSITIVITY_UNSPECIFIED="END_SENSITIVITY_UNSPECIFIED",t.END_SENSITIVITY_HIGH="END_SENSITIVITY_HIGH",t.END_SENSITIVITY_LOW="END_SENSITIVITY_LOW";}(bt||(bt={})),function(t){t.ACTIVITY_HANDLING_UNSPECIFIED="ACTIVITY_HANDLING_UNSPECIFIED",t.START_OF_ACTIVITY_INTERRUPTS="START_OF_ACTIVITY_INTERRUPTS",t.NO_INTERRUPTION="NO_INTERRUPTION";}(wt||(wt={})),function(t){t.TURN_COVERAGE_UNSPECIFIED="TURN_COVERAGE_UNSPECIFIED",t.TURN_INCLUDES_ONLY_ACTIVITY="TURN_INCLUDES_ONLY_ACTIVITY",t.TURN_INCLUDES_ALL_INPUT="TURN_INCLUDES_ALL_INPUT";}(Pt||(Pt={}));function Rt(t,n){return {fileData:{fileUri:t,mimeType:n}}}function qt(t,n){return {inlineData:{data:t,mimeType:n}}}class Jt{get text(){var t,n,e,o,i,r,s,l;if(0===(null===(o=null===(e=null===(n=null===(t=this.candidates)||void 0===t?void 0:t[0])||void 0===n?void 0:n.content)||void 0===e?void 0:e.parts)||void 0===o?void 0:o.length))return;this.candidates&&this.candidates.length>1&&console.warn("there are multiple candidates in the response, returning text from the first one.");let a="",u=false;const c=[];for(const t of null!==(l=null===(s=null===(r=null===(i=this.candidates)||void 0===i?void 0:i[0])||void 0===r?void 0:r.content)||void 0===s?void 0:s.parts)&&void 0!==l?l:[]){for(const[n,e]of Object.entries(t))"text"===n||"thought"===n||null===e&&void 0===e||c.push(n);if("string"==typeof t.text){if("boolean"==typeof t.thought&&t.thought)continue;u=true,a+=t.text;}}return c.length>0&&console.warn(`there are non-text parts ${c} in the response, returning concatenation of all text parts. Please refer to the non text parts for a full response from model.`),u?a:void 0}get data(){var t,n,e,o,i,r,s,l;if(0===(null===(o=null===(e=null===(n=null===(t=this.candidates)||void 0===t?void 0:t[0])||void 0===n?void 0:n.content)||void 0===e?void 0:e.parts)||void 0===o?void 0:o.length))return;this.candidates&&this.candidates.length>1&&console.warn("there are multiple candidates in the response, returning data from the first one.");let a="";const u=[];for(const t of null!==(l=null===(s=null===(r=null===(i=this.candidates)||void 0===i?void 0:i[0])||void 0===r?void 0:r.content)||void 0===s?void 0:s.parts)&&void 0!==l?l:[]){for(const[n,e]of Object.entries(t))"inlineData"===n||null===e&&void 0===e||u.push(n);t.inlineData&&"string"==typeof t.inlineData.data&&(a+=atob(t.inlineData.data));}return u.length>0&&console.warn(`there are non-data parts ${u} in the response, returning concatenation of all data parts. Please refer to the non data parts for a full response from model.`),a.length>0?btoa(a):void 0}get functionCalls(){var t,n,e,o,i,r,s,l;if(0===(null===(o=null===(e=null===(n=null===(t=this.candidates)||void 0===t?void 0:t[0])||void 0===n?void 0:n.content)||void 0===e?void 0:e.parts)||void 0===o?void 0:o.length))return;this.candidates&&this.candidates.length>1&&console.warn("there are multiple candidates in the response, returning function calls from the first one.");const a=null===(l=null===(s=null===(r=null===(i=this.candidates)||void 0===i?void 0:i[0])||void 0===r?void 0:r.content)||void 0===s?void 0:s.parts)||void 0===l?void 0:l.filter((t=>t.functionCall)).map((t=>t.functionCall)).filter((t=>void 0!==t));return 0!==(null==a?void 0:a.length)?a:void 0}get executableCode(){var t,n,e,o,i,r,s,l,a;if(0===(null===(o=null===(e=null===(n=null===(t=this.candidates)||void 0===t?void 0:t[0])||void 0===n?void 0:n.content)||void 0===e?void 0:e.parts)||void 0===o?void 0:o.length))return;this.candidates&&this.candidates.length>1&&console.warn("there are multiple candidates in the response, returning executable code from the first one.");const u=null===(l=null===(s=null===(r=null===(i=this.candidates)||void 0===i?void 0:i[0])||void 0===r?void 0:r.content)||void 0===s?void 0:s.parts)||void 0===l?void 0:l.filter((t=>t.executableCode)).map((t=>t.executableCode)).filter((t=>void 0!==t));return 0!==(null==u?void 0:u.length)?null===(a=null==u?void 0:u[0])||void 0===a?void 0:a.code:void 0}get codeExecutionResult(){var t,n,e,o,i,r,s,l,a;if(0===(null===(o=null===(e=null===(n=null===(t=this.candidates)||void 0===t?void 0:t[0])||void 0===n?void 0:n.content)||void 0===e?void 0:e.parts)||void 0===o?void 0:o.length))return;this.candidates&&this.candidates.length>1&&console.warn("there are multiple candidates in the response, returning code execution result from the first one.");const u=null===(l=null===(s=null===(r=null===(i=this.candidates)||void 0===i?void 0:i[0])||void 0===r?void 0:r.content)||void 0===s?void 0:s.parts)||void 0===l?void 0:l.filter((t=>t.codeExecutionResult)).map((t=>t.codeExecutionResult)).filter((t=>void 0!==t));return 0!==(null==u?void 0:u.length)?null===(a=null==u?void 0:u[0])||void 0===a?void 0:a.output:void 0}}class Yt{}class Kt{}class Wt{}class $t{}class zt{}class Xt{}class Zt{}class Qt{}class nn{}class en{}class on{}class rn{}class sn{constructor(t){const n={};for(const e of t.headers.entries())n[e[0]]=e[1];this.headers=n,this.responseInternal=t;}json(){return this.responseInternal.json()}}class ln{}class an{}class gn{get text(){var t,n,e;let o="",i=false;const r=[];for(const s of null!==(e=null===(n=null===(t=this.serverContent)||void 0===t?void 0:t.modelTurn)||void 0===n?void 0:n.parts)&&void 0!==e?e:[]){for(const[t,n]of Object.entries(s))"text"!==t&&"thought"!==t&&null!==n&&r.push(t);if("string"==typeof s.text){if("boolean"==typeof s.thought&&s.thought)continue;i=true,o+=s.text;}}return r.length>0&&console.warn(`there are non-text parts ${r} in the response, returning concatenation of all text parts. Please refer to the non text parts for a full response from model.`),i?o:void 0}get data(){var t,n,e;let o="";const i=[];for(const r of null!==(e=null===(n=null===(t=this.serverContent)||void 0===t?void 0:t.modelTurn)||void 0===n?void 0:n.parts)&&void 0!==e?e:[]){for(const[t,n]of Object.entries(r))"inlineData"!==t&&null!==n&&i.push(t);r.inlineData&&"string"==typeof r.inlineData.data&&(o+=atob(r.inlineData.data));}return i.length>0&&console.warn(`there are non-data parts ${i} in the response, returning concatenation of all data parts. Please refer to the non data parts for a full response from model.`),o.length>0?btoa(o):void 0}}/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */class vn extends i{constructor(t){super(),this.apiClient=t,this.list=async(t={})=>new Nt($.PAGED_ITEM_CACHED_CONTENTS,(t=>this.listInternal(t)),await this.listInternal(t),t);}async create(t){var n,e,o,i;let a,c="",d={};if(this.apiClient.isVertexAI()){const o=B(this.apiClient,t);return c=r("cachedContents",o._url),d=o._query,delete o.config,delete o._url,delete o._query,a=this.apiClient.request({path:c,queryParams:d,body:JSON.stringify(o),httpMethod:"POST",httpOptions:null===(n=t.config)||void 0===n?void 0:n.httpOptions,abortSignal:null===(e=t.config)||void 0===e?void 0:e.abortSignal}).then((t=>t.json())),a.then((t=>W(this.apiClient,t)))}{const n=function(t,n){const e={},o=l(n,["model"]);null!=o&&s(e,["model"],u(t,o));const i=l(n,["config"]);return null!=i&&s(e,["config"],x(0,i,e)),e}(this.apiClient,t);return c=r("cachedContents",n._url),d=n._query,delete n.config,delete n._url,delete n._query,a=this.apiClient.request({path:c,queryParams:d,body:JSON.stringify(n),httpMethod:"POST",httpOptions:null===(o=t.config)||void 0===o?void 0:o.httpOptions,abortSignal:null===(i=t.config)||void 0===i?void 0:i.abortSignal}).then((t=>t.json())),a.then((t=>K(this.apiClient,t)))}}async get(t){var n,e,o,i;let a,u="",c={};if(this.apiClient.isVertexAI()){const o=function(t,n){const e={},o=l(n,["name"]);null!=o&&s(e,["_url","name"],O(t,o));const i=l(n,["config"]);return null!=i&&s(e,["config"],i),e}(this.apiClient,t);return u=r("{name}",o._url),c=o._query,delete o.config,delete o._url,delete o._query,a=this.apiClient.request({path:u,queryParams:c,body:JSON.stringify(o),httpMethod:"GET",httpOptions:null===(n=t.config)||void 0===n?void 0:n.httpOptions,abortSignal:null===(e=t.config)||void 0===e?void 0:e.abortSignal}).then((t=>t.json())),a.then((t=>W(this.apiClient,t)))}{const n=function(t,n){const e={},o=l(n,["name"]);null!=o&&s(e,["_url","name"],O(t,o));const i=l(n,["config"]);return null!=i&&s(e,["config"],i),e}(this.apiClient,t);return u=r("{name}",n._url),c=n._query,delete n.config,delete n._url,delete n._query,a=this.apiClient.request({path:u,queryParams:c,body:JSON.stringify(n),httpMethod:"GET",httpOptions:null===(o=t.config)||void 0===o?void 0:o.httpOptions,abortSignal:null===(i=t.config)||void 0===i?void 0:i.abortSignal}).then((t=>t.json())),a.then((t=>K(this.apiClient,t)))}}async delete(t){var n,e,o,i;let a,u="",c={};if(this.apiClient.isVertexAI()){const o=function(t,n){const e={},o=l(n,["name"]);null!=o&&s(e,["_url","name"],O(t,o));const i=l(n,["config"]);return null!=i&&s(e,["config"],i),e}(this.apiClient,t);return u=r("{name}",o._url),c=o._query,delete o.config,delete o._url,delete o._query,a=this.apiClient.request({path:u,queryParams:c,body:JSON.stringify(o),httpMethod:"DELETE",httpOptions:null===(n=t.config)||void 0===n?void 0:n.httpOptions,abortSignal:null===(e=t.config)||void 0===e?void 0:e.abortSignal}).then((t=>t.json())),a.then((()=>{const t={},n=new en;return Object.assign(n,t),n}))}{const n=function(t,n){const e={},o=l(n,["name"]);null!=o&&s(e,["_url","name"],O(t,o));const i=l(n,["config"]);return null!=i&&s(e,["config"],i),e}(this.apiClient,t);return u=r("{name}",n._url),c=n._query,delete n.config,delete n._url,delete n._query,a=this.apiClient.request({path:u,queryParams:c,body:JSON.stringify(n),httpMethod:"DELETE",httpOptions:null===(o=t.config)||void 0===o?void 0:o.httpOptions,abortSignal:null===(i=t.config)||void 0===i?void 0:i.abortSignal}).then((t=>t.json())),a.then((()=>{const t={},n=new en;return Object.assign(n,t),n}))}}async update(t){var n,e,o,i;let s,l="",a={};if(this.apiClient.isVertexAI()){const o=J(this.apiClient,t);return l=r("{name}",o._url),a=o._query,delete o.config,delete o._url,delete o._query,s=this.apiClient.request({path:l,queryParams:a,body:JSON.stringify(o),httpMethod:"PATCH",httpOptions:null===(n=t.config)||void 0===n?void 0:n.httpOptions,abortSignal:null===(e=t.config)||void 0===e?void 0:e.abortSignal}).then((t=>t.json())),s.then((t=>W(this.apiClient,t)))}{const n=U(this.apiClient,t);return l=r("{name}",n._url),a=n._query,delete n.config,delete n._url,delete n._query,s=this.apiClient.request({path:l,queryParams:a,body:JSON.stringify(n),httpMethod:"PATCH",httpOptions:null===(o=t.config)||void 0===o?void 0:o.httpOptions,abortSignal:null===(i=t.config)||void 0===i?void 0:i.abortSignal}).then((t=>t.json())),s.then((t=>K(this.apiClient,t)))}}async listInternal(t){var n,e,o,i;let a,u="",c={};if(this.apiClient.isVertexAI()){const o=Y(this.apiClient,t);return u=r("cachedContents",o._url),c=o._query,delete o.config,delete o._url,delete o._query,a=this.apiClient.request({path:u,queryParams:c,body:JSON.stringify(o),httpMethod:"GET",httpOptions:null===(n=t.config)||void 0===n?void 0:n.httpOptions,abortSignal:null===(e=t.config)||void 0===e?void 0:e.abortSignal}).then((t=>t.json())),a.then((t=>{const n=function(t,n){const e={},o=l(n,["nextPageToken"]);null!=o&&s(e,["nextPageToken"],o);const i=l(n,["cachedContents"]);if(null!=i){let t=i;Array.isArray(t)&&(t=t.map((t=>W(0,t)))),s(e,["cachedContents"],t);}return e}(this.apiClient,t),e=new on;return Object.assign(e,n),e}))}{const n=q(this.apiClient,t);return u=r("cachedContents",n._url),c=n._query,delete n.config,delete n._url,delete n._query,a=this.apiClient.request({path:u,queryParams:c,body:JSON.stringify(n),httpMethod:"GET",httpOptions:null===(o=t.config)||void 0===o?void 0:o.httpOptions,abortSignal:null===(i=t.config)||void 0===i?void 0:i.abortSignal}).then((t=>t.json())),a.then((t=>{const n=function(t,n){const e={},o=l(n,["nextPageToken"]);null!=o&&s(e,["nextPageToken"],o);const i=l(n,["cachedContents"]);if(null!=i){let t=i;Array.isArray(t)&&(t=t.map((t=>K(0,t)))),s(e,["cachedContents"],t);}return e}(this.apiClient,t),e=new on;return Object.assign(e,n),e}))}}}function En(t){var n="function"==typeof Symbol&&Symbol.iterator,e=n&&t[n],o=0;if(e)return e.call(t);if(t&&"number"==typeof t.length)return {next:function(){return t&&o>=t.length&&(t=void 0),{value:t&&t[o++],done:!t}}};throw new TypeError(n?"Object is not iterable.":"Symbol.iterator is not defined.")}function Cn(t){return this instanceof Cn?(this.v=t,this):new Cn(t)}function Tn(t,n,e){if(!Symbol.asyncIterator)throw new TypeError("Symbol.asyncIterator is not defined.");var o,i=e.apply(t,n||[]),r=[];return o=Object.create(("function"==typeof AsyncIterator?AsyncIterator:Object).prototype),s("next"),s("throw"),s("return",(function(t){return function(n){return Promise.resolve(n).then(t,u)}})),o[Symbol.asyncIterator]=function(){return this},o;function s(t,n){i[t]&&(o[t]=function(n){return new Promise((function(e,o){r.push([t,n,e,o])>1||l(t,n);}))},n&&(o[t]=n(o[t])));}function l(t,n){try{(e=i[t](n)).value instanceof Cn?Promise.resolve(e.value.v).then(a,u):c(r[0][2],e);}catch(t){c(r[0][3],t);}var e;}function a(t){l("next",t);}function u(t){l("throw",t);}function c(t,n){t(n),r.shift(),r.length&&l(r[0][0],r[0][1]);}}function In(t){if(!Symbol.asyncIterator)throw new TypeError("Symbol.asyncIterator is not defined.");var n,e=t[Symbol.asyncIterator];return e?e.call(t):(t=En(t),n={},o("next"),o("throw"),o("return"),n[Symbol.asyncIterator]=function(){return this},n);function o(e){n[e]=t[e]&&function(n){return new Promise((function(o,i){(function(t,n,e,o){Promise.resolve(o).then((function(n){t({value:n,done:e});}),n);})(o,i,(n=t[e](n)).done,n.value);}))};}}
/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
function _n(t){var n;if(null==t.candidates||0===t.candidates.length)return  false;const e=null===(n=t.candidates[0])||void 0===n?void 0:n.content;return void 0!==e&&On(e)}function On(t){if(void 0===t.parts||0===t.parts.length)return  false;for(const n of t.parts){if(void 0===n||0===Object.keys(n).length)return  false;if(void 0!==n.text&&""===n.text)return  false}return  true}"function"==typeof SuppressedError&&SuppressedError;class An{constructor(t,n){this.modelsModule=t,this.apiClient=n;}create(t){return new Sn(this.apiClient,this.modelsModule,t.model,t.config,t.history)}}class Sn{constructor(t,n,e,o={},i=[]){this.apiClient=t,this.modelsModule=n,this.model=e,this.config=o,this.history=i,this.sendPromise=Promise.resolve(),function(t){if(0!==t.length){if("user"!==t[0].role)throw new Error("History must start with a user turn.");for(const n of t)if("user"!==n.role&&"model"!==n.role)throw new Error(`Role must be user or model, but got ${n.role}.`)}}(i);}async sendMessage(t){var n;await this.sendPromise;const e=y(this.apiClient,t.message),o=this.modelsModule.generateContent({model:this.model,contents:this.getHistory(true).concat(e),config:null!==(n=t.config)&&void 0!==n?n:this.config});return this.sendPromise=(async()=>{var t,n;const i=null===(n=null===(t=(await o).candidates)||void 0===t?void 0:t[0])||void 0===n?void 0:n.content,r=i?[i]:[];this.recordHistory(e,r);})(),await this.sendPromise,o}async sendMessageStream(t){var n;await this.sendPromise;const e=y(this.apiClient,t.message),o=this.modelsModule.generateContentStream({model:this.model,contents:this.getHistory(true).concat(e),config:null!==(n=t.config)&&void 0!==n?n:this.config});this.sendPromise=o.then((()=>{})).catch((()=>{}));const i=await o;return this.processStreamResponse(i,e)}getHistory(t=false){return t?function(t){if(void 0===t||0===t.length)return [];const n=[],e=t.length;let o=0,i=t[0];for(;o<e;)if("user"===t[o].role)i=t[o],o++;else {const r=[];let s=true;for(;o<e&&"model"===t[o].role;)r.push(t[o]),s&&!On(t[o])&&(s=false),o++;s&&(n.push(i),n.push(...r));}return n}(this.history):this.history}processStreamResponse(t,n){var e,o;return Tn(this,arguments,(function*(){var i,r,s,l;const a=[];try{for(var u,c=!0,d=In(t);!(i=(u=yield Cn(d.next())).done);c=!0){l=u.value,c=!1;const t=l;if(_n(t)){const n=null===(o=null===(e=t.candidates)||void 0===e?void 0:e[0])||void 0===o?void 0:o.content;void 0!==n&&a.push(n);}yield yield Cn(t);}}catch(t){r={error:t};}finally{try{c||i||!(s=d.return)||(yield Cn(s.call(d)));}finally{if(r)throw r.error}}this.recordHistory(n,a);}))}recordHistory(t,n){let e=[];n.length>0&&n.every((t=>"model"===t.role))?e=n:e.push({role:"model",parts:[]}),this.history.push(t),this.history.push(...e);}}
/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */function bn(t,n){const e={},o=l(n,["config"]);return null!=o&&s(e,["config"],function(t,n,e){const o=l(n,["pageSize"]);void 0!==e&&null!=o&&s(e,["_query","pageSize"],o);const i=l(n,["pageToken"]);return void 0!==e&&null!=i&&s(e,["_query","pageToken"],i),{}}(0,o,e)),e}function wn(t,n){const e={},o=l(n,["name"]);null!=o&&s(e,["name"],o);const i=l(n,["displayName"]);null!=i&&s(e,["displayName"],i);const r=l(n,["mimeType"]);null!=r&&s(e,["mimeType"],r);const a=l(n,["sizeBytes"]);null!=a&&s(e,["sizeBytes"],a);const u=l(n,["createTime"]);null!=u&&s(e,["createTime"],u);const c=l(n,["expirationTime"]);null!=c&&s(e,["expirationTime"],c);const d=l(n,["updateTime"]);null!=d&&s(e,["updateTime"],d);const p=l(n,["sha256Hash"]);null!=p&&s(e,["sha256Hash"],p);const f=l(n,["uri"]);null!=f&&s(e,["uri"],f);const h=l(n,["downloadUri"]);null!=h&&s(e,["downloadUri"],h);const g=l(n,["state"]);null!=g&&s(e,["state"],g);const m=l(n,["source"]);null!=m&&s(e,["source"],m);const y=l(n,["videoMetadata"]);null!=y&&s(e,["videoMetadata"],y);const v=l(n,["error"]);return null!=v&&s(e,["error"],function(t,n){const e={},o=l(n,["details"]);null!=o&&s(e,["details"],o);const i=l(n,["message"]);null!=i&&s(e,["message"],i);const r=l(n,["code"]);return null!=r&&s(e,["code"],r),e}(0,v)),e}function Pn(t,n){const e={},o=l(n,["name"]);null!=o&&s(e,["name"],o);const i=l(n,["displayName"]);null!=i&&s(e,["displayName"],i);const r=l(n,["mimeType"]);null!=r&&s(e,["mimeType"],r);const a=l(n,["sizeBytes"]);null!=a&&s(e,["sizeBytes"],a);const u=l(n,["createTime"]);null!=u&&s(e,["createTime"],u);const c=l(n,["expirationTime"]);null!=c&&s(e,["expirationTime"],c);const d=l(n,["updateTime"]);null!=d&&s(e,["updateTime"],d);const p=l(n,["sha256Hash"]);null!=p&&s(e,["sha256Hash"],p);const f=l(n,["uri"]);null!=f&&s(e,["uri"],f);const h=l(n,["downloadUri"]);null!=h&&s(e,["downloadUri"],h);const g=l(n,["state"]);null!=g&&s(e,["state"],g);const m=l(n,["source"]);null!=m&&s(e,["source"],m);const y=l(n,["videoMetadata"]);null!=y&&s(e,["videoMetadata"],y);const v=l(n,["error"]);return null!=v&&s(e,["error"],function(t,n){const e={},o=l(n,["details"]);null!=o&&s(e,["details"],o);const i=l(n,["message"]);null!=i&&s(e,["message"],i);const r=l(n,["code"]);return null!=r&&s(e,["code"],r),e}(0,v)),e}
/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
class Nn extends i{constructor(t){super(),this.apiClient=t,this.list=async(t={})=>new Nt($.PAGED_ITEM_FILES,(t=>this.listInternal(t)),await this.listInternal(t),t);}async upload(t){if(this.apiClient.isVertexAI())throw new Error("Vertex AI does not support uploading files. You can share files through a GCS bucket.");return this.apiClient.uploadFile(t.file,t.config).then((t=>Pn(this.apiClient,t)))}async download(t){await this.apiClient.downloadFile(t);}async listInternal(t){var n,e;let o,i="",a={};if(this.apiClient.isVertexAI())throw new Error("This method is only supported by the Gemini Developer API.");{const u=bn(this.apiClient,t);return i=r("files",u._url),a=u._query,delete u.config,delete u._url,delete u._query,o=this.apiClient.request({path:i,queryParams:a,body:JSON.stringify(u),httpMethod:"GET",httpOptions:null===(n=t.config)||void 0===n?void 0:n.httpOptions,abortSignal:null===(e=t.config)||void 0===e?void 0:e.abortSignal}).then((t=>t.json())),o.then((t=>{const n=function(t,n){const e={},o=l(n,["nextPageToken"]);null!=o&&s(e,["nextPageToken"],o);const i=l(n,["files"]);if(null!=i){let t=i;Array.isArray(t)&&(t=t.map((t=>Pn(0,t)))),s(e,["files"],t);}return e}(this.apiClient,t),e=new rn;return Object.assign(e,n),e}))}}async createInternal(t){var n,e;let o,i="",a={};if(this.apiClient.isVertexAI())throw new Error("This method is only supported by the Gemini Developer API.");{const u=function(t,n){const e={},o=l(n,["file"]);null!=o&&s(e,["file"],wn(0,o));const i=l(n,["config"]);return null!=i&&s(e,["config"],i),e}(this.apiClient,t);return i=r("upload/v1beta/files",u._url),a=u._query,delete u.config,delete u._url,delete u._query,o=this.apiClient.request({path:i,queryParams:a,body:JSON.stringify(u),httpMethod:"POST",httpOptions:null===(n=t.config)||void 0===n?void 0:n.httpOptions,abortSignal:null===(e=t.config)||void 0===e?void 0:e.abortSignal}).then((t=>t.json())),o.then((()=>{const t={},n=new ln;return Object.assign(n,t),n}))}}async get(t){var n,e;let o,i="",a={};if(this.apiClient.isVertexAI())throw new Error("This method is only supported by the Gemini Developer API.");{const u=function(t,n){const e={},o=l(n,["name"]);null!=o&&s(e,["_url","file"],b(0,o));const i=l(n,["config"]);return null!=i&&s(e,["config"],i),e}(this.apiClient,t);return i=r("files/{file}",u._url),a=u._query,delete u.config,delete u._url,delete u._query,o=this.apiClient.request({path:i,queryParams:a,body:JSON.stringify(u),httpMethod:"GET",httpOptions:null===(n=t.config)||void 0===n?void 0:n.httpOptions,abortSignal:null===(e=t.config)||void 0===e?void 0:e.abortSignal}).then((t=>t.json())),o.then((t=>Pn(this.apiClient,t)))}}async delete(t){var n,e;let o,i="",a={};if(this.apiClient.isVertexAI())throw new Error("This method is only supported by the Gemini Developer API.");{const u=function(t,n){const e={},o=l(n,["name"]);null!=o&&s(e,["_url","file"],b(0,o));const i=l(n,["config"]);return null!=i&&s(e,["config"],i),e}(this.apiClient,t);return i=r("files/{file}",u._url),a=u._query,delete u.config,delete u._url,delete u._query,o=this.apiClient.request({path:i,queryParams:a,body:JSON.stringify(u),httpMethod:"DELETE",httpOptions:null===(n=t.config)||void 0===n?void 0:n.httpOptions,abortSignal:null===(e=t.config)||void 0===e?void 0:e.abortSignal}).then((t=>t.json())),o.then((()=>{const t={},n=new an;return Object.assign(n,t),n}))}}}
/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */function Dn(t,n){const e={};if(void 0!==l(n,["videoMetadata"]))throw new Error("videoMetadata parameter is not supported in Gemini API.");const o=l(n,["thought"]);null!=o&&s(e,["thought"],o);const i=l(n,["inlineData"]);null!=i&&s(e,["inlineData"],function(t,n){const e={};if(void 0!==l(n,["displayName"]))throw new Error("displayName parameter is not supported in Gemini API.");const o=l(n,["data"]);null!=o&&s(e,["data"],o);const i=l(n,["mimeType"]);return null!=i&&s(e,["mimeType"],i),e}(0,i));const r=l(n,["codeExecutionResult"]);null!=r&&s(e,["codeExecutionResult"],r);const a=l(n,["executableCode"]);null!=a&&s(e,["executableCode"],a);const u=l(n,["fileData"]);null!=u&&s(e,["fileData"],u);const c=l(n,["functionCall"]);null!=c&&s(e,["functionCall"],c);const d=l(n,["functionResponse"]);null!=d&&s(e,["functionResponse"],d);const p=l(n,["text"]);return null!=p&&s(e,["text"],p),e}function Rn(t,n){const e={},o=l(n,["videoMetadata"]);null!=o&&s(e,["videoMetadata"],o);const i=l(n,["thought"]);null!=i&&s(e,["thought"],i);const r=l(n,["inlineData"]);null!=r&&s(e,["inlineData"],function(t,n){const e={},o=l(n,["displayName"]);null!=o&&s(e,["displayName"],o);const i=l(n,["data"]);null!=i&&s(e,["data"],i);const r=l(n,["mimeType"]);return null!=r&&s(e,["mimeType"],r),e}(0,r));const a=l(n,["codeExecutionResult"]);null!=a&&s(e,["codeExecutionResult"],a);const u=l(n,["executableCode"]);null!=u&&s(e,["executableCode"],u);const c=l(n,["fileData"]);null!=c&&s(e,["fileData"],c);const d=l(n,["functionCall"]);null!=d&&s(e,["functionCall"],d);const p=l(n,["functionResponse"]);null!=p&&s(e,["functionResponse"],p);const f=l(n,["text"]);return null!=f&&s(e,["text"],f),e}function Mn(t,n){const e={},o=l(n,["dynamicRetrievalConfig"]);return null!=o&&s(e,["dynamicRetrievalConfig"],function(t,n){const e={},o=l(n,["mode"]);null!=o&&s(e,["mode"],o);const i=l(n,["dynamicThreshold"]);return null!=i&&s(e,["dynamicThreshold"],i),e}(0,o)),e}function xn(t,n){const e={},o=l(n,["dynamicRetrievalConfig"]);return null!=o&&s(e,["dynamicRetrievalConfig"],function(t,n){const e={},o=l(n,["mode"]);null!=o&&s(e,["mode"],o);const i=l(n,["dynamicThreshold"]);return null!=i&&s(e,["dynamicThreshold"],i),e}(0,o)),e}function Un(t,n){const e={},o=l(n,["apiKeyConfig"]);null!=o&&s(e,["apiKeyConfig"],function(t,n){const e={},o=l(n,["apiKeyString"]);return null!=o&&s(e,["apiKeyString"],o),e}(0,o));const i=l(n,["authType"]);null!=i&&s(e,["authType"],i);const r=l(n,["googleServiceAccountConfig"]);null!=r&&s(e,["googleServiceAccountConfig"],r);const a=l(n,["httpBasicAuthConfig"]);null!=a&&s(e,["httpBasicAuthConfig"],a);const u=l(n,["oauthConfig"]);null!=u&&s(e,["oauthConfig"],u);const c=l(n,["oidcConfig"]);return null!=c&&s(e,["oidcConfig"],c),e}function qn(t,n){const e={},o=l(n,["retrieval"]);null!=o&&s(e,["retrieval"],o);null!=l(n,["googleSearch"])&&s(e,["googleSearch"],{});const i=l(n,["googleSearchRetrieval"]);null!=i&&s(e,["googleSearchRetrieval"],xn(0,i));null!=l(n,["enterpriseWebSearch"])&&s(e,["enterpriseWebSearch"],{});const r=l(n,["googleMaps"]);null!=r&&s(e,["googleMaps"],function(t,n){const e={},o=l(n,["authConfig"]);return null!=o&&s(e,["authConfig"],Un(0,o)),e}(0,r));const a=l(n,["codeExecution"]);null!=a&&s(e,["codeExecution"],a);const u=l(n,["functionDeclarations"]);return null!=u&&s(e,["functionDeclarations"],u),e}function Ln(t,n){const e={},o=l(n,["automaticActivityDetection"]);null!=o&&s(e,["automaticActivityDetection"],function(t,n){const e={},o=l(n,["disabled"]);null!=o&&s(e,["disabled"],o);const i=l(n,["startOfSpeechSensitivity"]);null!=i&&s(e,["startOfSpeechSensitivity"],i);const r=l(n,["endOfSpeechSensitivity"]);null!=r&&s(e,["endOfSpeechSensitivity"],r);const a=l(n,["prefixPaddingMs"]);null!=a&&s(e,["prefixPaddingMs"],a);const u=l(n,["silenceDurationMs"]);return null!=u&&s(e,["silenceDurationMs"],u),e}(0,o));const i=l(n,["activityHandling"]);null!=i&&s(e,["activityHandling"],i);const r=l(n,["turnCoverage"]);return null!=r&&s(e,["turnCoverage"],r),e}function Gn(t,n){const e={},o=l(n,["automaticActivityDetection"]);null!=o&&s(e,["automaticActivityDetection"],function(t,n){const e={},o=l(n,["disabled"]);null!=o&&s(e,["disabled"],o);const i=l(n,["startOfSpeechSensitivity"]);null!=i&&s(e,["startOfSpeechSensitivity"],i);const r=l(n,["endOfSpeechSensitivity"]);null!=r&&s(e,["endOfSpeechSensitivity"],r);const a=l(n,["prefixPaddingMs"]);null!=a&&s(e,["prefixPaddingMs"],a);const u=l(n,["silenceDurationMs"]);return null!=u&&s(e,["silenceDurationMs"],u),e}(0,o));const i=l(n,["activityHandling"]);null!=i&&s(e,["activityHandling"],i);const r=l(n,["turnCoverage"]);return null!=r&&s(e,["turnCoverage"],r),e}function kn(t,n){const e={},o=l(n,["triggerTokens"]);null!=o&&s(e,["triggerTokens"],o);const i=l(n,["slidingWindow"]);return null!=i&&s(e,["slidingWindow"],function(t,n){const e={},o=l(n,["targetTokens"]);return null!=o&&s(e,["targetTokens"],o),e}(0,i)),e}function jn(t,n){const e={},o=l(n,["triggerTokens"]);null!=o&&s(e,["triggerTokens"],o);const i=l(n,["slidingWindow"]);return null!=i&&s(e,["slidingWindow"],function(t,n){const e={},o=l(n,["targetTokens"]);return null!=o&&s(e,["targetTokens"],o),e}(0,i)),e}function Fn(t,n,e){const o=l(n,["generationConfig"]);void 0!==e&&null!=o&&s(e,["setup","generationConfig"],o);const i=l(n,["responseModalities"]);void 0!==e&&null!=i&&s(e,["setup","generationConfig","responseModalities"],i);const r=l(n,["temperature"]);void 0!==e&&null!=r&&s(e,["setup","generationConfig","temperature"],r);const a=l(n,["topP"]);void 0!==e&&null!=a&&s(e,["setup","generationConfig","topP"],a);const u=l(n,["topK"]);void 0!==e&&null!=u&&s(e,["setup","generationConfig","topK"],u);const c=l(n,["maxOutputTokens"]);void 0!==e&&null!=c&&s(e,["setup","generationConfig","maxOutputTokens"],c);const d=l(n,["mediaResolution"]);void 0!==e&&null!=d&&s(e,["setup","generationConfig","mediaResolution"],d);const p=l(n,["seed"]);void 0!==e&&null!=p&&s(e,["setup","generationConfig","seed"],p);const f=l(n,["speechConfig"]);void 0!==e&&null!=f&&s(e,["setup","generationConfig","speechConfig"],f);const h=l(n,["systemInstruction"]);void 0!==e&&null!=h&&s(e,["setup","systemInstruction"],function(t,n){const e={},o=l(n,["parts"]);if(null!=o){let t=o;Array.isArray(t)&&(t=t.map((t=>Dn(0,t)))),s(e,["parts"],t);}const i=l(n,["role"]);return null!=i&&s(e,["role"],i),e}(0,y(0,h)));const g=l(n,["tools"]);if(void 0!==e&&null!=g){let t=_(0,g);Array.isArray(t)&&(t=t.map((t=>function(t,n){const e={};if(void 0!==l(n,["retrieval"]))throw new Error("retrieval parameter is not supported in Gemini API.");null!=l(n,["googleSearch"])&&s(e,["googleSearch"],{});const o=l(n,["googleSearchRetrieval"]);if(null!=o&&s(e,["googleSearchRetrieval"],Mn(0,o)),void 0!==l(n,["enterpriseWebSearch"]))throw new Error("enterpriseWebSearch parameter is not supported in Gemini API.");if(void 0!==l(n,["googleMaps"]))throw new Error("googleMaps parameter is not supported in Gemini API.");const i=l(n,["codeExecution"]);null!=i&&s(e,["codeExecution"],i);const r=l(n,["functionDeclarations"]);return null!=r&&s(e,["functionDeclarations"],r),e}(0,I(0,t))))),s(e,["setup","tools"],t);}const m=l(n,["sessionResumption"]);void 0!==e&&null!=m&&s(e,["setup","sessionResumption"],function(t,n){const e={},o=l(n,["handle"]);if(null!=o&&s(e,["handle"],o),void 0!==l(n,["transparent"]))throw new Error("transparent parameter is not supported in Gemini API.");return e}(0,m));const v=l(n,["inputAudioTranscription"]);void 0!==e&&null!=v&&s(e,["setup","inputAudioTranscription"],{});const E=l(n,["outputAudioTranscription"]);void 0!==e&&null!=E&&s(e,["setup","outputAudioTranscription"],{});const C=l(n,["realtimeInputConfig"]);void 0!==e&&null!=C&&s(e,["setup","realtimeInputConfig"],Ln(0,C));const T=l(n,["contextWindowCompression"]);return void 0!==e&&null!=T&&s(e,["setup","contextWindowCompression"],kn(0,T)),{}}function Vn(t,n,e){const o=l(n,["generationConfig"]);void 0!==e&&null!=o&&s(e,["setup","generationConfig"],o);const i=l(n,["responseModalities"]);void 0!==e&&null!=i&&s(e,["setup","generationConfig","responseModalities"],i);const r=l(n,["temperature"]);void 0!==e&&null!=r&&s(e,["setup","generationConfig","temperature"],r);const a=l(n,["topP"]);void 0!==e&&null!=a&&s(e,["setup","generationConfig","topP"],a);const u=l(n,["topK"]);void 0!==e&&null!=u&&s(e,["setup","generationConfig","topK"],u);const c=l(n,["maxOutputTokens"]);void 0!==e&&null!=c&&s(e,["setup","generationConfig","maxOutputTokens"],c);const d=l(n,["mediaResolution"]);void 0!==e&&null!=d&&s(e,["setup","generationConfig","mediaResolution"],d);const p=l(n,["seed"]);void 0!==e&&null!=p&&s(e,["setup","generationConfig","seed"],p);const f=l(n,["speechConfig"]);void 0!==e&&null!=f&&s(e,["setup","generationConfig","speechConfig"],f);const h=l(n,["systemInstruction"]);void 0!==e&&null!=h&&s(e,["setup","systemInstruction"],function(t,n){const e={},o=l(n,["parts"]);if(null!=o){let t=o;Array.isArray(t)&&(t=t.map((t=>Rn(0,t)))),s(e,["parts"],t);}const i=l(n,["role"]);return null!=i&&s(e,["role"],i),e}(0,y(0,h)));const g=l(n,["tools"]);if(void 0!==e&&null!=g){let t=_(0,g);Array.isArray(t)&&(t=t.map((t=>qn(0,I(0,t))))),s(e,["setup","tools"],t);}const m=l(n,["sessionResumption"]);void 0!==e&&null!=m&&s(e,["setup","sessionResumption"],function(t,n){const e={},o=l(n,["handle"]);null!=o&&s(e,["handle"],o);const i=l(n,["transparent"]);return null!=i&&s(e,["transparent"],i),e}(0,m));const v=l(n,["inputAudioTranscription"]);void 0!==e&&null!=v&&s(e,["setup","inputAudioTranscription"],{});const E=l(n,["outputAudioTranscription"]);void 0!==e&&null!=E&&s(e,["setup","outputAudioTranscription"],{});const C=l(n,["realtimeInputConfig"]);void 0!==e&&null!=C&&s(e,["setup","realtimeInputConfig"],Gn(0,C));const T=l(n,["contextWindowCompression"]);return void 0!==e&&null!=T&&s(e,["setup","contextWindowCompression"],jn(0,T)),{}}function Hn(t,n){const e={},o=l(n,["media"]);null!=o&&s(e,["mediaChunks"],c(t,o));const i=l(n,["audio"]);null!=i&&s(e,["audio"],function(t,n){const e=d(0,n);if(e.mimeType&&e.mimeType.startsWith("audio/"))return e;throw new Error(`Unsupported mime type: ${e.mimeType}`)}(0,i));const r=l(n,["audioStreamEnd"]);null!=r&&s(e,["audioStreamEnd"],r);const a=l(n,["video"]);null!=a&&s(e,["video"],function(t,n){const e=d(0,n);if(e.mimeType&&e.mimeType.startsWith("image/"))return e;throw new Error(`Unsupported mime type: ${e.mimeType}`)}(0,a));const u=l(n,["text"]);null!=u&&s(e,["text"],u);null!=l(n,["activityStart"])&&s(e,["activityStart"],{});return null!=l(n,["activityEnd"])&&s(e,["activityEnd"],{}),e}function Bn(t,n){const e={},o=l(n,["media"]);if(null!=o&&s(e,["mediaChunks"],c(t,o)),void 0!==l(n,["audio"]))throw new Error("audio parameter is not supported in Vertex AI.");const i=l(n,["audioStreamEnd"]);if(null!=i&&s(e,["audioStreamEnd"],i),void 0!==l(n,["video"]))throw new Error("video parameter is not supported in Vertex AI.");if(void 0!==l(n,["text"]))throw new Error("text parameter is not supported in Vertex AI.");null!=l(n,["activityStart"])&&s(e,["activityStart"],{});return null!=l(n,["activityEnd"])&&s(e,["activityEnd"],{}),e}function Jn(t,n){const e={},o=l(n,["thought"]);null!=o&&s(e,["thought"],o);const i=l(n,["inlineData"]);null!=i&&s(e,["inlineData"],function(t,n){const e={},o=l(n,["data"]);null!=o&&s(e,["data"],o);const i=l(n,["mimeType"]);return null!=i&&s(e,["mimeType"],i),e}(0,i));const r=l(n,["codeExecutionResult"]);null!=r&&s(e,["codeExecutionResult"],r);const a=l(n,["executableCode"]);null!=a&&s(e,["executableCode"],a);const u=l(n,["fileData"]);null!=u&&s(e,["fileData"],u);const c=l(n,["functionCall"]);null!=c&&s(e,["functionCall"],c);const d=l(n,["functionResponse"]);null!=d&&s(e,["functionResponse"],d);const p=l(n,["text"]);return null!=p&&s(e,["text"],p),e}function Yn(t,n){const e={},o=l(n,["videoMetadata"]);null!=o&&s(e,["videoMetadata"],o);const i=l(n,["thought"]);null!=i&&s(e,["thought"],i);const r=l(n,["inlineData"]);null!=r&&s(e,["inlineData"],function(t,n){const e={},o=l(n,["displayName"]);null!=o&&s(e,["displayName"],o);const i=l(n,["data"]);null!=i&&s(e,["data"],i);const r=l(n,["mimeType"]);return null!=r&&s(e,["mimeType"],r),e}(0,r));const a=l(n,["codeExecutionResult"]);null!=a&&s(e,["codeExecutionResult"],a);const u=l(n,["executableCode"]);null!=u&&s(e,["executableCode"],u);const c=l(n,["fileData"]);null!=c&&s(e,["fileData"],c);const d=l(n,["functionCall"]);null!=d&&s(e,["functionCall"],d);const p=l(n,["functionResponse"]);null!=p&&s(e,["functionResponse"],p);const f=l(n,["text"]);return null!=f&&s(e,["text"],f),e}function Kn(t,n){const e={},o=l(n,["text"]);null!=o&&s(e,["text"],o);const i=l(n,["finished"]);return null!=i&&s(e,["finished"],i),e}function Wn(t,n){const e={},o=l(n,["text"]);null!=o&&s(e,["text"],o);const i=l(n,["finished"]);return null!=i&&s(e,["finished"],i),e}function $n(t,n){const e={},o=l(n,["modelTurn"]);null!=o&&s(e,["modelTurn"],function(t,n){const e={},o=l(n,["parts"]);if(null!=o){let t=o;Array.isArray(t)&&(t=t.map((t=>Jn(0,t)))),s(e,["parts"],t);}const i=l(n,["role"]);return null!=i&&s(e,["role"],i),e}(0,o));const i=l(n,["turnComplete"]);null!=i&&s(e,["turnComplete"],i);const r=l(n,["interrupted"]);null!=r&&s(e,["interrupted"],r);const a=l(n,["groundingMetadata"]);null!=a&&s(e,["groundingMetadata"],a);const u=l(n,["generationComplete"]);null!=u&&s(e,["generationComplete"],u);const c=l(n,["inputTranscription"]);null!=c&&s(e,["inputTranscription"],Kn(0,c));const d=l(n,["outputTranscription"]);return null!=d&&s(e,["outputTranscription"],Kn(0,d)),e}function zn(t,n){const e={},o=l(n,["modelTurn"]);null!=o&&s(e,["modelTurn"],function(t,n){const e={},o=l(n,["parts"]);if(null!=o){let t=o;Array.isArray(t)&&(t=t.map((t=>Yn(0,t)))),s(e,["parts"],t);}const i=l(n,["role"]);return null!=i&&s(e,["role"],i),e}(0,o));const i=l(n,["turnComplete"]);null!=i&&s(e,["turnComplete"],i);const r=l(n,["interrupted"]);null!=r&&s(e,["interrupted"],r);const a=l(n,["groundingMetadata"]);null!=a&&s(e,["groundingMetadata"],a);const u=l(n,["generationComplete"]);null!=u&&s(e,["generationComplete"],u);const c=l(n,["inputTranscription"]);null!=c&&s(e,["inputTranscription"],Wn(0,c));const d=l(n,["outputTranscription"]);return null!=d&&s(e,["outputTranscription"],Wn(0,d)),e}function Xn(t,n){const e={},o=l(n,["functionCalls"]);if(null!=o){let t=o;Array.isArray(t)&&(t=t.map((t=>function(t,n){const e={},o=l(n,["id"]);null!=o&&s(e,["id"],o);const i=l(n,["args"]);null!=i&&s(e,["args"],i);const r=l(n,["name"]);return null!=r&&s(e,["name"],r),e}(0,t)))),s(e,["functionCalls"],t);}return e}function Zn(t,n){const e={},o=l(n,["functionCalls"]);if(null!=o){let t=o;Array.isArray(t)&&(t=t.map((t=>function(t,n){const e={},o=l(n,["args"]);null!=o&&s(e,["args"],o);const i=l(n,["name"]);return null!=i&&s(e,["name"],i),e}(0,t)))),s(e,["functionCalls"],t);}return e}function Qn(t,n){const e={},o=l(n,["modality"]);null!=o&&s(e,["modality"],o);const i=l(n,["tokenCount"]);return null!=i&&s(e,["tokenCount"],i),e}function te(t,n){const e={},o=l(n,["modality"]);null!=o&&s(e,["modality"],o);const i=l(n,["tokenCount"]);return null!=i&&s(e,["tokenCount"],i),e}function ne(t,n){const e={};null!=l(n,["setupComplete"])&&s(e,["setupComplete"],{});const o=l(n,["serverContent"]);null!=o&&s(e,["serverContent"],$n(0,o));const i=l(n,["toolCall"]);null!=i&&s(e,["toolCall"],Xn(0,i));const r=l(n,["toolCallCancellation"]);null!=r&&s(e,["toolCallCancellation"],function(t,n){const e={},o=l(n,["ids"]);return null!=o&&s(e,["ids"],o),e}(0,r));const a=l(n,["usageMetadata"]);null!=a&&s(e,["usageMetadata"],function(t,n){const e={},o=l(n,["promptTokenCount"]);null!=o&&s(e,["promptTokenCount"],o);const i=l(n,["cachedContentTokenCount"]);null!=i&&s(e,["cachedContentTokenCount"],i);const r=l(n,["responseTokenCount"]);null!=r&&s(e,["responseTokenCount"],r);const a=l(n,["toolUsePromptTokenCount"]);null!=a&&s(e,["toolUsePromptTokenCount"],a);const u=l(n,["thoughtsTokenCount"]);null!=u&&s(e,["thoughtsTokenCount"],u);const c=l(n,["totalTokenCount"]);null!=c&&s(e,["totalTokenCount"],c);const d=l(n,["promptTokensDetails"]);if(null!=d){let t=d;Array.isArray(t)&&(t=t.map((t=>Qn(0,t)))),s(e,["promptTokensDetails"],t);}const p=l(n,["cacheTokensDetails"]);if(null!=p){let t=p;Array.isArray(t)&&(t=t.map((t=>Qn(0,t)))),s(e,["cacheTokensDetails"],t);}const f=l(n,["responseTokensDetails"]);if(null!=f){let t=f;Array.isArray(t)&&(t=t.map((t=>Qn(0,t)))),s(e,["responseTokensDetails"],t);}const h=l(n,["toolUsePromptTokensDetails"]);if(null!=h){let t=h;Array.isArray(t)&&(t=t.map((t=>Qn(0,t)))),s(e,["toolUsePromptTokensDetails"],t);}return e}(0,a));const u=l(n,["goAway"]);null!=u&&s(e,["goAway"],function(t,n){const e={},o=l(n,["timeLeft"]);return null!=o&&s(e,["timeLeft"],o),e}(0,u));const c=l(n,["sessionResumptionUpdate"]);return null!=c&&s(e,["sessionResumptionUpdate"],function(t,n){const e={},o=l(n,["newHandle"]);null!=o&&s(e,["newHandle"],o);const i=l(n,["resumable"]);null!=i&&s(e,["resumable"],i);const r=l(n,["lastConsumedClientMessageIndex"]);return null!=r&&s(e,["lastConsumedClientMessageIndex"],r),e}(0,c)),e}function ee(t,n){const e={};null!=l(n,["setupComplete"])&&s(e,["setupComplete"],{});const o=l(n,["serverContent"]);null!=o&&s(e,["serverContent"],zn(0,o));const i=l(n,["toolCall"]);null!=i&&s(e,["toolCall"],Zn(0,i));const r=l(n,["toolCallCancellation"]);null!=r&&s(e,["toolCallCancellation"],function(t,n){const e={},o=l(n,["ids"]);return null!=o&&s(e,["ids"],o),e}(0,r));const a=l(n,["usageMetadata"]);null!=a&&s(e,["usageMetadata"],function(t,n){const e={},o=l(n,["promptTokenCount"]);null!=o&&s(e,["promptTokenCount"],o);const i=l(n,["cachedContentTokenCount"]);null!=i&&s(e,["cachedContentTokenCount"],i);const r=l(n,["candidatesTokenCount"]);null!=r&&s(e,["responseTokenCount"],r);const a=l(n,["toolUsePromptTokenCount"]);null!=a&&s(e,["toolUsePromptTokenCount"],a);const u=l(n,["thoughtsTokenCount"]);null!=u&&s(e,["thoughtsTokenCount"],u);const c=l(n,["totalTokenCount"]);null!=c&&s(e,["totalTokenCount"],c);const d=l(n,["promptTokensDetails"]);if(null!=d){let t=d;Array.isArray(t)&&(t=t.map((t=>te(0,t)))),s(e,["promptTokensDetails"],t);}const p=l(n,["cacheTokensDetails"]);if(null!=p){let t=p;Array.isArray(t)&&(t=t.map((t=>te(0,t)))),s(e,["cacheTokensDetails"],t);}const f=l(n,["candidatesTokensDetails"]);if(null!=f){let t=f;Array.isArray(t)&&(t=t.map((t=>te(0,t)))),s(e,["responseTokensDetails"],t);}const h=l(n,["toolUsePromptTokensDetails"]);if(null!=h){let t=h;Array.isArray(t)&&(t=t.map((t=>te(0,t)))),s(e,["toolUsePromptTokensDetails"],t);}const g=l(n,["trafficType"]);return null!=g&&s(e,["trafficType"],g),e}(0,a));const u=l(n,["goAway"]);null!=u&&s(e,["goAway"],function(t,n){const e={},o=l(n,["timeLeft"]);return null!=o&&s(e,["timeLeft"],o),e}(0,u));const c=l(n,["sessionResumptionUpdate"]);return null!=c&&s(e,["sessionResumptionUpdate"],function(t,n){const e={},o=l(n,["newHandle"]);null!=o&&s(e,["newHandle"],o);const i=l(n,["resumable"]);null!=i&&s(e,["resumable"],i);const r=l(n,["lastConsumedClientMessageIndex"]);return null!=r&&s(e,["lastConsumedClientMessageIndex"],r),e}(0,c)),e}
/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */function oe(t,n){const e={};if(void 0!==l(n,["videoMetadata"]))throw new Error("videoMetadata parameter is not supported in Gemini API.");const o=l(n,["thought"]);null!=o&&s(e,["thought"],o);const i=l(n,["inlineData"]);null!=i&&s(e,["inlineData"],function(t,n){const e={};if(void 0!==l(n,["displayName"]))throw new Error("displayName parameter is not supported in Gemini API.");const o=l(n,["data"]);null!=o&&s(e,["data"],o);const i=l(n,["mimeType"]);return null!=i&&s(e,["mimeType"],i),e}(0,i));const r=l(n,["codeExecutionResult"]);null!=r&&s(e,["codeExecutionResult"],r);const a=l(n,["executableCode"]);null!=a&&s(e,["executableCode"],a);const u=l(n,["fileData"]);null!=u&&s(e,["fileData"],u);const c=l(n,["functionCall"]);null!=c&&s(e,["functionCall"],c);const d=l(n,["functionResponse"]);null!=d&&s(e,["functionResponse"],d);const p=l(n,["text"]);return null!=p&&s(e,["text"],p),e}function ie(t,n){const e={},o=l(n,["parts"]);if(null!=o){let t=o;Array.isArray(t)&&(t=t.map((t=>oe(0,t)))),s(e,["parts"],t);}const i=l(n,["role"]);return null!=i&&s(e,["role"],i),e}function re(t,n){const e={},o=l(n,["dynamicRetrievalConfig"]);return null!=o&&s(e,["dynamicRetrievalConfig"],function(t,n){const e={},o=l(n,["mode"]);null!=o&&s(e,["mode"],o);const i=l(n,["dynamicThreshold"]);return null!=i&&s(e,["dynamicThreshold"],i),e}(0,o)),e}function se(t,n){const e={},o=l(n,["functionCallingConfig"]);if(null!=o&&s(e,["functionCallingConfig"],function(t,n){const e={},o=l(n,["mode"]);null!=o&&s(e,["mode"],o);const i=l(n,["allowedFunctionNames"]);return null!=i&&s(e,["allowedFunctionNames"],i),e}(0,o)),void 0!==l(n,["retrievalConfig"]))throw new Error("retrievalConfig parameter is not supported in Gemini API.");return e}function le(t,n){const e={},o=l(n,["prebuiltVoiceConfig"]);return null!=o&&s(e,["prebuiltVoiceConfig"],function(t,n){const e={},o=l(n,["voiceName"]);return null!=o&&s(e,["voiceName"],o),e}(0,o)),e}function ae(t,n,e){const o={},i=l(n,["systemInstruction"]);void 0!==e&&null!=i&&s(e,["systemInstruction"],ie(0,y(0,i)));const r=l(n,["temperature"]);null!=r&&s(o,["temperature"],r);const a=l(n,["topP"]);null!=a&&s(o,["topP"],a);const u=l(n,["topK"]);null!=u&&s(o,["topK"],u);const c=l(n,["candidateCount"]);null!=c&&s(o,["candidateCount"],c);const d=l(n,["maxOutputTokens"]);null!=d&&s(o,["maxOutputTokens"],d);const p=l(n,["stopSequences"]);null!=p&&s(o,["stopSequences"],p);const f=l(n,["responseLogprobs"]);null!=f&&s(o,["responseLogprobs"],f);const h=l(n,["logprobs"]);null!=h&&s(o,["logprobs"],h);const g=l(n,["presencePenalty"]);null!=g&&s(o,["presencePenalty"],g);const m=l(n,["frequencyPenalty"]);null!=m&&s(o,["frequencyPenalty"],m);const v=l(n,["seed"]);null!=v&&s(o,["seed"],v);const E=l(n,["responseMimeType"]);null!=E&&s(o,["responseMimeType"],E);const A=l(n,["responseSchema"]);if(null!=A&&s(o,["responseSchema"],C(0,A)),void 0!==l(n,["routingConfig"]))throw new Error("routingConfig parameter is not supported in Gemini API.");if(void 0!==l(n,["modelSelectionConfig"]))throw new Error("modelSelectionConfig parameter is not supported in Gemini API.");const S=l(n,["safetySettings"]);if(void 0!==e&&null!=S){let t=S;Array.isArray(t)&&(t=t.map((t=>function(t,n){const e={};if(void 0!==l(n,["method"]))throw new Error("method parameter is not supported in Gemini API.");const o=l(n,["category"]);null!=o&&s(e,["category"],o);const i=l(n,["threshold"]);return null!=i&&s(e,["threshold"],i),e}(0,t)))),s(e,["safetySettings"],t);}const b=l(n,["tools"]);if(void 0!==e&&null!=b){let t=_(0,b);Array.isArray(t)&&(t=t.map((t=>function(t,n){const e={};if(void 0!==l(n,["retrieval"]))throw new Error("retrieval parameter is not supported in Gemini API.");null!=l(n,["googleSearch"])&&s(e,["googleSearch"],{});const o=l(n,["googleSearchRetrieval"]);if(null!=o&&s(e,["googleSearchRetrieval"],re(0,o)),void 0!==l(n,["enterpriseWebSearch"]))throw new Error("enterpriseWebSearch parameter is not supported in Gemini API.");if(void 0!==l(n,["googleMaps"]))throw new Error("googleMaps parameter is not supported in Gemini API.");const i=l(n,["codeExecution"]);null!=i&&s(e,["codeExecution"],i);const r=l(n,["functionDeclarations"]);return null!=r&&s(e,["functionDeclarations"],r),e}(0,I(0,t))))),s(e,["tools"],t);}const w=l(n,["toolConfig"]);if(void 0!==e&&null!=w&&s(e,["toolConfig"],se(0,w)),void 0!==l(n,["labels"]))throw new Error("labels parameter is not supported in Gemini API.");const P=l(n,["cachedContent"]);void 0!==e&&null!=P&&s(e,["cachedContent"],O(t,P));const N=l(n,["responseModalities"]);null!=N&&s(o,["responseModalities"],N);const D=l(n,["mediaResolution"]);null!=D&&s(o,["mediaResolution"],D);const R=l(n,["speechConfig"]);if(null!=R&&s(o,["speechConfig"],function(t,n){const e={},o=l(n,["voiceConfig"]);null!=o&&s(e,["voiceConfig"],le(0,o));const i=l(n,["languageCode"]);return null!=i&&s(e,["languageCode"],i),e}(0,T(0,R))),void 0!==l(n,["audioTimestamp"]))throw new Error("audioTimestamp parameter is not supported in Gemini API.");const M=l(n,["thinkingConfig"]);return null!=M&&s(o,["thinkingConfig"],function(t,n){const e={},o=l(n,["includeThoughts"]);null!=o&&s(e,["includeThoughts"],o);const i=l(n,["thinkingBudget"]);return null!=i&&s(e,["thinkingBudget"],i),e}(0,M)),o}function ue(t,n){const e={},o=l(n,["model"]);null!=o&&s(e,["_url","model"],a(t,o));const i=l(n,["contents"]);if(null!=i){let t=E(0,i);Array.isArray(t)&&(t=t.map((t=>ie(0,t)))),s(e,["contents"],t);}const r=l(n,["config"]);return null!=r&&s(e,["generationConfig"],ae(t,r,e)),e}function ce(t,n){const e={},o=l(n,["model"]);null!=o&&s(e,["_url","model"],a(t,o));const i=l(n,["contents"]);null!=i&&s(e,["requests[]","content"],v(t,i));const r=l(n,["config"]);null!=r&&s(e,["config"],function(t,n,e){const o=l(n,["taskType"]);void 0!==e&&null!=o&&s(e,["requests[]","taskType"],o);const i=l(n,["title"]);void 0!==e&&null!=i&&s(e,["requests[]","title"],i);const r=l(n,["outputDimensionality"]);if(void 0!==e&&null!=r&&s(e,["requests[]","outputDimensionality"],r),void 0!==l(n,["mimeType"]))throw new Error("mimeType parameter is not supported in Gemini API.");if(void 0!==l(n,["autoTruncate"]))throw new Error("autoTruncate parameter is not supported in Gemini API.");return {}}(0,r,e));const u=l(n,["model"]);return void 0!==u&&s(e,["requests[]","model"],a(t,u)),e}function de(t,n){const e={},o=l(n,["model"]);null!=o&&s(e,["_url","model"],a(t,o));const i=l(n,["prompt"]);null!=i&&s(e,["instances[0]","prompt"],i);const r=l(n,["config"]);return null!=r&&s(e,["config"],function(t,n,e){if(void 0!==l(n,["outputGcsUri"]))throw new Error("outputGcsUri parameter is not supported in Gemini API.");if(void 0!==l(n,["negativePrompt"]))throw new Error("negativePrompt parameter is not supported in Gemini API.");const o=l(n,["numberOfImages"]);void 0!==e&&null!=o&&s(e,["parameters","sampleCount"],o);const i=l(n,["aspectRatio"]);void 0!==e&&null!=i&&s(e,["parameters","aspectRatio"],i);const r=l(n,["guidanceScale"]);if(void 0!==e&&null!=r&&s(e,["parameters","guidanceScale"],r),void 0!==l(n,["seed"]))throw new Error("seed parameter is not supported in Gemini API.");const a=l(n,["safetyFilterLevel"]);void 0!==e&&null!=a&&s(e,["parameters","safetySetting"],a);const u=l(n,["personGeneration"]);void 0!==e&&null!=u&&s(e,["parameters","personGeneration"],u);const c=l(n,["includeSafetyAttributes"]);void 0!==e&&null!=c&&s(e,["parameters","includeSafetyAttributes"],c);const d=l(n,["includeRaiReason"]);void 0!==e&&null!=d&&s(e,["parameters","includeRaiReason"],d);const p=l(n,["language"]);void 0!==e&&null!=p&&s(e,["parameters","language"],p);const f=l(n,["outputMimeType"]);void 0!==e&&null!=f&&s(e,["parameters","outputOptions","mimeType"],f);const h=l(n,["outputCompressionQuality"]);if(void 0!==e&&null!=h&&s(e,["parameters","outputOptions","compressionQuality"],h),void 0!==l(n,["addWatermark"]))throw new Error("addWatermark parameter is not supported in Gemini API.");if(void 0!==l(n,["enhancePrompt"]))throw new Error("enhancePrompt parameter is not supported in Gemini API.");return {}}(0,r,e)),e}function pe(t,n){const e={},o=l(n,["config"]);return null!=o&&s(e,["config"],function(t,n,e){const o=l(n,["pageSize"]);void 0!==e&&null!=o&&s(e,["_query","pageSize"],o);const i=l(n,["pageToken"]);void 0!==e&&null!=i&&s(e,["_query","pageToken"],i);const r=l(n,["filter"]);void 0!==e&&null!=r&&s(e,["_query","filter"],r);const a=l(n,["queryBase"]);return void 0!==e&&null!=a&&s(e,["_url","models_url"],w(t,a)),{}}(t,o,e)),e}function fe(t,n){const e={},o=l(n,["model"]);null!=o&&s(e,["_url","name"],a(t,o));const i=l(n,["config"]);return null!=i&&s(e,["config"],function(t,n,e){const o=l(n,["displayName"]);void 0!==e&&null!=o&&s(e,["displayName"],o);const i=l(n,["description"]);void 0!==e&&null!=i&&s(e,["description"],i);const r=l(n,["defaultCheckpointId"]);return void 0!==e&&null!=r&&s(e,["defaultCheckpointId"],r),{}}(0,i,e)),e}function he(t,n){const e={},o=l(n,["model"]);null!=o&&s(e,["_url","model"],a(t,o));const i=l(n,["contents"]);if(null!=i){let t=E(0,i);Array.isArray(t)&&(t=t.map((t=>ie(0,t)))),s(e,["contents"],t);}const r=l(n,["config"]);return null!=r&&s(e,["config"],function(t,n){if(void 0!==l(n,["systemInstruction"]))throw new Error("systemInstruction parameter is not supported in Gemini API.");if(void 0!==l(n,["tools"]))throw new Error("tools parameter is not supported in Gemini API.");if(void 0!==l(n,["generationConfig"]))throw new Error("generationConfig parameter is not supported in Gemini API.");return {}}(0,r)),e}function ge(t,n){const e={},o=l(n,["model"]);null!=o&&s(e,["_url","model"],a(t,o));const i=l(n,["prompt"]);null!=i&&s(e,["instances[0]","prompt"],i);const r=l(n,["image"]);null!=r&&s(e,["instances[0]","image"],function(t,n){const e={};if(void 0!==l(n,["gcsUri"]))throw new Error("gcsUri parameter is not supported in Gemini API.");const o=l(n,["imageBytes"]);null!=o&&s(e,["bytesBase64Encoded"],S(0,o));const i=l(n,["mimeType"]);return null!=i&&s(e,["mimeType"],i),e}(0,r));const u=l(n,["config"]);return null!=u&&s(e,["config"],function(t,n,e){const o=l(n,["numberOfVideos"]);if(void 0!==e&&null!=o&&s(e,["parameters","sampleCount"],o),void 0!==l(n,["outputGcsUri"]))throw new Error("outputGcsUri parameter is not supported in Gemini API.");if(void 0!==l(n,["fps"]))throw new Error("fps parameter is not supported in Gemini API.");const i=l(n,["durationSeconds"]);if(void 0!==e&&null!=i&&s(e,["parameters","durationSeconds"],i),void 0!==l(n,["seed"]))throw new Error("seed parameter is not supported in Gemini API.");const r=l(n,["aspectRatio"]);if(void 0!==e&&null!=r&&s(e,["parameters","aspectRatio"],r),void 0!==l(n,["resolution"]))throw new Error("resolution parameter is not supported in Gemini API.");const a=l(n,["personGeneration"]);if(void 0!==e&&null!=a&&s(e,["parameters","personGeneration"],a),void 0!==l(n,["pubsubTopic"]))throw new Error("pubsubTopic parameter is not supported in Gemini API.");const u=l(n,["negativePrompt"]);if(void 0!==e&&null!=u&&s(e,["parameters","negativePrompt"],u),void 0!==l(n,["enhancePrompt"]))throw new Error("enhancePrompt parameter is not supported in Gemini API.");return {}}(0,u,e)),e}function me(t,n){const e={},o=l(n,["videoMetadata"]);null!=o&&s(e,["videoMetadata"],o);const i=l(n,["thought"]);null!=i&&s(e,["thought"],i);const r=l(n,["inlineData"]);null!=r&&s(e,["inlineData"],function(t,n){const e={},o=l(n,["displayName"]);null!=o&&s(e,["displayName"],o);const i=l(n,["data"]);null!=i&&s(e,["data"],i);const r=l(n,["mimeType"]);return null!=r&&s(e,["mimeType"],r),e}(0,r));const a=l(n,["codeExecutionResult"]);null!=a&&s(e,["codeExecutionResult"],a);const u=l(n,["executableCode"]);null!=u&&s(e,["executableCode"],u);const c=l(n,["fileData"]);null!=c&&s(e,["fileData"],c);const d=l(n,["functionCall"]);null!=d&&s(e,["functionCall"],d);const p=l(n,["functionResponse"]);null!=p&&s(e,["functionResponse"],p);const f=l(n,["text"]);return null!=f&&s(e,["text"],f),e}function ye(t,n){const e={},o=l(n,["parts"]);if(null!=o){let t=o;Array.isArray(t)&&(t=t.map((t=>me(0,t)))),s(e,["parts"],t);}const i=l(n,["role"]);return null!=i&&s(e,["role"],i),e}function ve(t,n){const e={},o=l(n,["dynamicRetrievalConfig"]);return null!=o&&s(e,["dynamicRetrievalConfig"],function(t,n){const e={},o=l(n,["mode"]);null!=o&&s(e,["mode"],o);const i=l(n,["dynamicThreshold"]);return null!=i&&s(e,["dynamicThreshold"],i),e}(0,o)),e}function Ee(t,n){const e={},o=l(n,["apiKeyConfig"]);null!=o&&s(e,["apiKeyConfig"],function(t,n){const e={},o=l(n,["apiKeyString"]);return null!=o&&s(e,["apiKeyString"],o),e}(0,o));const i=l(n,["authType"]);null!=i&&s(e,["authType"],i);const r=l(n,["googleServiceAccountConfig"]);null!=r&&s(e,["googleServiceAccountConfig"],r);const a=l(n,["httpBasicAuthConfig"]);null!=a&&s(e,["httpBasicAuthConfig"],a);const u=l(n,["oauthConfig"]);null!=u&&s(e,["oauthConfig"],u);const c=l(n,["oidcConfig"]);return null!=c&&s(e,["oidcConfig"],c),e}function Ce(t,n){const e={},o=l(n,["retrieval"]);null!=o&&s(e,["retrieval"],o);null!=l(n,["googleSearch"])&&s(e,["googleSearch"],{});const i=l(n,["googleSearchRetrieval"]);null!=i&&s(e,["googleSearchRetrieval"],ve(0,i));null!=l(n,["enterpriseWebSearch"])&&s(e,["enterpriseWebSearch"],{});const r=l(n,["googleMaps"]);null!=r&&s(e,["googleMaps"],function(t,n){const e={},o=l(n,["authConfig"]);return null!=o&&s(e,["authConfig"],Ee(0,o)),e}(0,r));const a=l(n,["codeExecution"]);null!=a&&s(e,["codeExecution"],a);const u=l(n,["functionDeclarations"]);return null!=u&&s(e,["functionDeclarations"],u),e}function Te(t,n){const e={},o=l(n,["latLng"]);return null!=o&&s(e,["latLng"],function(t,n){const e={},o=l(n,["latitude"]);null!=o&&s(e,["latitude"],o);const i=l(n,["longitude"]);return null!=i&&s(e,["longitude"],i),e}(0,o)),e}function Ie(t,n){const e={},o=l(n,["functionCallingConfig"]);null!=o&&s(e,["functionCallingConfig"],function(t,n){const e={},o=l(n,["mode"]);null!=o&&s(e,["mode"],o);const i=l(n,["allowedFunctionNames"]);return null!=i&&s(e,["allowedFunctionNames"],i),e}(0,o));const i=l(n,["retrievalConfig"]);return null!=i&&s(e,["retrievalConfig"],Te(0,i)),e}function _e(t,n){const e={},o=l(n,["prebuiltVoiceConfig"]);return null!=o&&s(e,["prebuiltVoiceConfig"],function(t,n){const e={},o=l(n,["voiceName"]);return null!=o&&s(e,["voiceName"],o),e}(0,o)),e}function Oe(t,n,e){const o={},i=l(n,["systemInstruction"]);void 0!==e&&null!=i&&s(e,["systemInstruction"],ye(0,y(0,i)));const r=l(n,["temperature"]);null!=r&&s(o,["temperature"],r);const a=l(n,["topP"]);null!=a&&s(o,["topP"],a);const u=l(n,["topK"]);null!=u&&s(o,["topK"],u);const c=l(n,["candidateCount"]);null!=c&&s(o,["candidateCount"],c);const d=l(n,["maxOutputTokens"]);null!=d&&s(o,["maxOutputTokens"],d);const p=l(n,["stopSequences"]);null!=p&&s(o,["stopSequences"],p);const f=l(n,["responseLogprobs"]);null!=f&&s(o,["responseLogprobs"],f);const h=l(n,["logprobs"]);null!=h&&s(o,["logprobs"],h);const g=l(n,["presencePenalty"]);null!=g&&s(o,["presencePenalty"],g);const m=l(n,["frequencyPenalty"]);null!=m&&s(o,["frequencyPenalty"],m);const v=l(n,["seed"]);null!=v&&s(o,["seed"],v);const E=l(n,["responseMimeType"]);null!=E&&s(o,["responseMimeType"],E);const A=l(n,["responseSchema"]);null!=A&&s(o,["responseSchema"],C(0,A));const S=l(n,["routingConfig"]);null!=S&&s(o,["routingConfig"],S);const b=l(n,["modelSelectionConfig"]);null!=b&&s(o,["modelConfig"],function(t,n){const e={},o=l(n,["featureSelectionPreference"]);return null!=o&&s(e,["featureSelectionPreference"],o),e}(0,b));const w=l(n,["safetySettings"]);if(void 0!==e&&null!=w){let t=w;Array.isArray(t)&&(t=t.map((t=>function(t,n){const e={},o=l(n,["method"]);null!=o&&s(e,["method"],o);const i=l(n,["category"]);null!=i&&s(e,["category"],i);const r=l(n,["threshold"]);return null!=r&&s(e,["threshold"],r),e}(0,t)))),s(e,["safetySettings"],t);}const P=l(n,["tools"]);if(void 0!==e&&null!=P){let t=_(0,P);Array.isArray(t)&&(t=t.map((t=>Ce(0,I(0,t))))),s(e,["tools"],t);}const N=l(n,["toolConfig"]);void 0!==e&&null!=N&&s(e,["toolConfig"],Ie(0,N));const D=l(n,["labels"]);void 0!==e&&null!=D&&s(e,["labels"],D);const R=l(n,["cachedContent"]);void 0!==e&&null!=R&&s(e,["cachedContent"],O(t,R));const M=l(n,["responseModalities"]);null!=M&&s(o,["responseModalities"],M);const x=l(n,["mediaResolution"]);null!=x&&s(o,["mediaResolution"],x);const U=l(n,["speechConfig"]);null!=U&&s(o,["speechConfig"],function(t,n){const e={},o=l(n,["voiceConfig"]);null!=o&&s(e,["voiceConfig"],_e(0,o));const i=l(n,["languageCode"]);return null!=i&&s(e,["languageCode"],i),e}(0,T(0,U)));const q=l(n,["audioTimestamp"]);null!=q&&s(o,["audioTimestamp"],q);const L=l(n,["thinkingConfig"]);return null!=L&&s(o,["thinkingConfig"],function(t,n){const e={},o=l(n,["includeThoughts"]);null!=o&&s(e,["includeThoughts"],o);const i=l(n,["thinkingBudget"]);return null!=i&&s(e,["thinkingBudget"],i),e}(0,L)),o}function Ae(t,n){const e={},o=l(n,["model"]);null!=o&&s(e,["_url","model"],a(t,o));const i=l(n,["contents"]);if(null!=i){let t=E(0,i);Array.isArray(t)&&(t=t.map((t=>ye(0,t)))),s(e,["contents"],t);}const r=l(n,["config"]);return null!=r&&s(e,["generationConfig"],Oe(t,r,e)),e}function Se(t,n){const e={},o=l(n,["model"]);null!=o&&s(e,["_url","model"],a(t,o));const i=l(n,["contents"]);null!=i&&s(e,["instances[]","content"],v(t,i));const r=l(n,["config"]);return null!=r&&s(e,["config"],function(t,n,e){const o=l(n,["taskType"]);void 0!==e&&null!=o&&s(e,["instances[]","task_type"],o);const i=l(n,["title"]);void 0!==e&&null!=i&&s(e,["instances[]","title"],i);const r=l(n,["outputDimensionality"]);void 0!==e&&null!=r&&s(e,["parameters","outputDimensionality"],r);const a=l(n,["mimeType"]);void 0!==e&&null!=a&&s(e,["instances[]","mimeType"],a);const u=l(n,["autoTruncate"]);return void 0!==e&&null!=u&&s(e,["parameters","autoTruncate"],u),{}}(0,r,e)),e}function be(t,n){const e={},o=l(n,["model"]);null!=o&&s(e,["_url","model"],a(t,o));const i=l(n,["prompt"]);null!=i&&s(e,["instances[0]","prompt"],i);const r=l(n,["config"]);return null!=r&&s(e,["config"],function(t,n,e){const o=l(n,["outputGcsUri"]);void 0!==e&&null!=o&&s(e,["parameters","storageUri"],o);const i=l(n,["negativePrompt"]);void 0!==e&&null!=i&&s(e,["parameters","negativePrompt"],i);const r=l(n,["numberOfImages"]);void 0!==e&&null!=r&&s(e,["parameters","sampleCount"],r);const a=l(n,["aspectRatio"]);void 0!==e&&null!=a&&s(e,["parameters","aspectRatio"],a);const u=l(n,["guidanceScale"]);void 0!==e&&null!=u&&s(e,["parameters","guidanceScale"],u);const c=l(n,["seed"]);void 0!==e&&null!=c&&s(e,["parameters","seed"],c);const d=l(n,["safetyFilterLevel"]);void 0!==e&&null!=d&&s(e,["parameters","safetySetting"],d);const p=l(n,["personGeneration"]);void 0!==e&&null!=p&&s(e,["parameters","personGeneration"],p);const f=l(n,["includeSafetyAttributes"]);void 0!==e&&null!=f&&s(e,["parameters","includeSafetyAttributes"],f);const h=l(n,["includeRaiReason"]);void 0!==e&&null!=h&&s(e,["parameters","includeRaiReason"],h);const g=l(n,["language"]);void 0!==e&&null!=g&&s(e,["parameters","language"],g);const m=l(n,["outputMimeType"]);void 0!==e&&null!=m&&s(e,["parameters","outputOptions","mimeType"],m);const y=l(n,["outputCompressionQuality"]);void 0!==e&&null!=y&&s(e,["parameters","outputOptions","compressionQuality"],y);const v=l(n,["addWatermark"]);void 0!==e&&null!=v&&s(e,["parameters","addWatermark"],v);const E=l(n,["enhancePrompt"]);return void 0!==e&&null!=E&&s(e,["parameters","enhancePrompt"],E),{}}(0,r,e)),e}function we(t,n){const e={},o=l(n,["gcsUri"]);null!=o&&s(e,["gcsUri"],o);const i=l(n,["imageBytes"]);null!=i&&s(e,["bytesBase64Encoded"],S(0,i));const r=l(n,["mimeType"]);return null!=r&&s(e,["mimeType"],r),e}function Pe(t,n){const e={},o=l(n,["referenceImage"]);null!=o&&s(e,["referenceImage"],we(0,o));const i=l(n,["referenceId"]);null!=i&&s(e,["referenceId"],i);const r=l(n,["referenceType"]);null!=r&&s(e,["referenceType"],r);const a=l(n,["maskImageConfig"]);null!=a&&s(e,["maskImageConfig"],function(t,n){const e={},o=l(n,["maskMode"]);null!=o&&s(e,["maskMode"],o);const i=l(n,["segmentationClasses"]);null!=i&&s(e,["maskClasses"],i);const r=l(n,["maskDilation"]);return null!=r&&s(e,["dilation"],r),e}(0,a));const u=l(n,["controlImageConfig"]);null!=u&&s(e,["controlImageConfig"],function(t,n){const e={},o=l(n,["controlType"]);null!=o&&s(e,["controlType"],o);const i=l(n,["enableControlImageComputation"]);return null!=i&&s(e,["computeControl"],i),e}(0,u));const c=l(n,["styleImageConfig"]);null!=c&&s(e,["styleImageConfig"],function(t,n){const e={},o=l(n,["styleDescription"]);return null!=o&&s(e,["styleDescription"],o),e}(0,c));const d=l(n,["subjectImageConfig"]);return null!=d&&s(e,["subjectImageConfig"],function(t,n){const e={},o=l(n,["subjectType"]);null!=o&&s(e,["subjectType"],o);const i=l(n,["subjectDescription"]);return null!=i&&s(e,["subjectDescription"],i),e}(0,d)),e}function Ne(t,n){const e={},o=l(n,["model"]);null!=o&&s(e,["_url","model"],a(t,o));const i=l(n,["prompt"]);null!=i&&s(e,["instances[0]","prompt"],i);const r=l(n,["referenceImages"]);if(null!=r){let t=r;Array.isArray(t)&&(t=t.map((t=>Pe(0,t)))),s(e,["instances[0]","referenceImages"],t);}const u=l(n,["config"]);return null!=u&&s(e,["config"],function(t,n,e){const o=l(n,["outputGcsUri"]);void 0!==e&&null!=o&&s(e,["parameters","storageUri"],o);const i=l(n,["negativePrompt"]);void 0!==e&&null!=i&&s(e,["parameters","negativePrompt"],i);const r=l(n,["numberOfImages"]);void 0!==e&&null!=r&&s(e,["parameters","sampleCount"],r);const a=l(n,["aspectRatio"]);void 0!==e&&null!=a&&s(e,["parameters","aspectRatio"],a);const u=l(n,["guidanceScale"]);void 0!==e&&null!=u&&s(e,["parameters","guidanceScale"],u);const c=l(n,["seed"]);void 0!==e&&null!=c&&s(e,["parameters","seed"],c);const d=l(n,["safetyFilterLevel"]);void 0!==e&&null!=d&&s(e,["parameters","safetySetting"],d);const p=l(n,["personGeneration"]);void 0!==e&&null!=p&&s(e,["parameters","personGeneration"],p);const f=l(n,["includeSafetyAttributes"]);void 0!==e&&null!=f&&s(e,["parameters","includeSafetyAttributes"],f);const h=l(n,["includeRaiReason"]);void 0!==e&&null!=h&&s(e,["parameters","includeRaiReason"],h);const g=l(n,["language"]);void 0!==e&&null!=g&&s(e,["parameters","language"],g);const m=l(n,["outputMimeType"]);void 0!==e&&null!=m&&s(e,["parameters","outputOptions","mimeType"],m);const y=l(n,["outputCompressionQuality"]);void 0!==e&&null!=y&&s(e,["parameters","outputOptions","compressionQuality"],y);const v=l(n,["editMode"]);void 0!==e&&null!=v&&s(e,["parameters","editMode"],v);const E=l(n,["baseSteps"]);return void 0!==e&&null!=E&&s(e,["parameters","editConfig","baseSteps"],E),{}}(0,u,e)),e}function De(t,n){const e={},o=l(n,["model"]);null!=o&&s(e,["_url","model"],a(t,o));const i=l(n,["image"]);null!=i&&s(e,["instances[0]","image"],we(0,i));const r=l(n,["upscaleFactor"]);null!=r&&s(e,["parameters","upscaleConfig","upscaleFactor"],r);const u=l(n,["config"]);return null!=u&&s(e,["config"],function(t,n,e){const o=l(n,["includeRaiReason"]);void 0!==e&&null!=o&&s(e,["parameters","includeRaiReason"],o);const i=l(n,["outputMimeType"]);void 0!==e&&null!=i&&s(e,["parameters","outputOptions","mimeType"],i);const r=l(n,["outputCompressionQuality"]);void 0!==e&&null!=r&&s(e,["parameters","outputOptions","compressionQuality"],r);const a=l(n,["numberOfImages"]);void 0!==e&&null!=a&&s(e,["parameters","sampleCount"],a);const u=l(n,["mode"]);return void 0!==e&&null!=u&&s(e,["parameters","mode"],u),{}}(0,u,e)),e}function Re(t,n){const e={},o=l(n,["config"]);return null!=o&&s(e,["config"],function(t,n,e){const o=l(n,["pageSize"]);void 0!==e&&null!=o&&s(e,["_query","pageSize"],o);const i=l(n,["pageToken"]);void 0!==e&&null!=i&&s(e,["_query","pageToken"],i);const r=l(n,["filter"]);void 0!==e&&null!=r&&s(e,["_query","filter"],r);const a=l(n,["queryBase"]);return void 0!==e&&null!=a&&s(e,["_url","models_url"],w(t,a)),{}}(t,o,e)),e}function Me(t,n){const e={},o=l(n,["model"]);null!=o&&s(e,["_url","model"],a(t,o));const i=l(n,["config"]);return null!=i&&s(e,["config"],function(t,n,e){const o=l(n,["displayName"]);void 0!==e&&null!=o&&s(e,["displayName"],o);const i=l(n,["description"]);void 0!==e&&null!=i&&s(e,["description"],i);const r=l(n,["defaultCheckpointId"]);return void 0!==e&&null!=r&&s(e,["defaultCheckpointId"],r),{}}(0,i,e)),e}function xe(t,n){const e={},o=l(n,["model"]);null!=o&&s(e,["_url","model"],a(t,o));const i=l(n,["contents"]);if(null!=i){let t=E(0,i);Array.isArray(t)&&(t=t.map((t=>ye(0,t)))),s(e,["contents"],t);}const r=l(n,["config"]);return null!=r&&s(e,["config"],function(t,n,e){const o=l(n,["systemInstruction"]);void 0!==e&&null!=o&&s(e,["systemInstruction"],ye(0,y(0,o)));const i=l(n,["tools"]);if(void 0!==e&&null!=i){let t=i;Array.isArray(t)&&(t=t.map((t=>Ce(0,t)))),s(e,["tools"],t);}const r=l(n,["generationConfig"]);return void 0!==e&&null!=r&&s(e,["generationConfig"],r),{}}(0,r,e)),e}function Ue(t,n){const e={},o=l(n,["model"]);null!=o&&s(e,["_url","model"],a(t,o));const i=l(n,["prompt"]);null!=i&&s(e,["instances[0]","prompt"],i);const r=l(n,["image"]);null!=r&&s(e,["instances[0]","image"],we(0,r));const u=l(n,["config"]);return null!=u&&s(e,["config"],function(t,n,e){const o=l(n,["numberOfVideos"]);void 0!==e&&null!=o&&s(e,["parameters","sampleCount"],o);const i=l(n,["outputGcsUri"]);void 0!==e&&null!=i&&s(e,["parameters","storageUri"],i);const r=l(n,["fps"]);void 0!==e&&null!=r&&s(e,["parameters","fps"],r);const a=l(n,["durationSeconds"]);void 0!==e&&null!=a&&s(e,["parameters","durationSeconds"],a);const u=l(n,["seed"]);void 0!==e&&null!=u&&s(e,["parameters","seed"],u);const c=l(n,["aspectRatio"]);void 0!==e&&null!=c&&s(e,["parameters","aspectRatio"],c);const d=l(n,["resolution"]);void 0!==e&&null!=d&&s(e,["parameters","resolution"],d);const p=l(n,["personGeneration"]);void 0!==e&&null!=p&&s(e,["parameters","personGeneration"],p);const f=l(n,["pubsubTopic"]);void 0!==e&&null!=f&&s(e,["parameters","pubsubTopic"],f);const h=l(n,["negativePrompt"]);void 0!==e&&null!=h&&s(e,["parameters","negativePrompt"],h);const g=l(n,["enhancePrompt"]);return void 0!==e&&null!=g&&s(e,["parameters","enhancePrompt"],g),{}}(0,u,e)),e}function qe(t,n){const e={},o=l(n,["thought"]);null!=o&&s(e,["thought"],o);const i=l(n,["inlineData"]);null!=i&&s(e,["inlineData"],function(t,n){const e={},o=l(n,["data"]);null!=o&&s(e,["data"],o);const i=l(n,["mimeType"]);return null!=i&&s(e,["mimeType"],i),e}(0,i));const r=l(n,["codeExecutionResult"]);null!=r&&s(e,["codeExecutionResult"],r);const a=l(n,["executableCode"]);null!=a&&s(e,["executableCode"],a);const u=l(n,["fileData"]);null!=u&&s(e,["fileData"],u);const c=l(n,["functionCall"]);null!=c&&s(e,["functionCall"],c);const d=l(n,["functionResponse"]);null!=d&&s(e,["functionResponse"],d);const p=l(n,["text"]);return null!=p&&s(e,["text"],p),e}function Le(t,n){const e={},o=l(n,["content"]);null!=o&&s(e,["content"],function(t,n){const e={},o=l(n,["parts"]);if(null!=o){let t=o;Array.isArray(t)&&(t=t.map((t=>qe(0,t)))),s(e,["parts"],t);}const i=l(n,["role"]);return null!=i&&s(e,["role"],i),e}(0,o));const i=l(n,["citationMetadata"]);null!=i&&s(e,["citationMetadata"],function(t,n){const e={},o=l(n,["citationSources"]);return null!=o&&s(e,["citations"],o),e}(0,i));const r=l(n,["tokenCount"]);null!=r&&s(e,["tokenCount"],r);const a=l(n,["finishReason"]);null!=a&&s(e,["finishReason"],a);const u=l(n,["avgLogprobs"]);null!=u&&s(e,["avgLogprobs"],u);const c=l(n,["groundingMetadata"]);null!=c&&s(e,["groundingMetadata"],c);const d=l(n,["index"]);null!=d&&s(e,["index"],d);const p=l(n,["logprobsResult"]);null!=p&&s(e,["logprobsResult"],p);const f=l(n,["safetyRatings"]);return null!=f&&s(e,["safetyRatings"],f),e}function Ge(t,n){const e={},o=l(n,["candidates"]);if(null!=o){let t=o;Array.isArray(t)&&(t=t.map((t=>Le(0,t)))),s(e,["candidates"],t);}const i=l(n,["modelVersion"]);null!=i&&s(e,["modelVersion"],i);const r=l(n,["promptFeedback"]);null!=r&&s(e,["promptFeedback"],r);const a=l(n,["usageMetadata"]);return null!=a&&s(e,["usageMetadata"],a),e}function ke(t,n){const e={},o=l(n,["embeddings"]);if(null!=o){let t=o;Array.isArray(t)&&(t=t.map((t=>function(t,n){const e={},o=l(n,["values"]);return null!=o&&s(e,["values"],o),e}(0,t)))),s(e,["embeddings"],t);}return null!=l(n,["metadata"])&&s(e,["metadata"],{}),e}function je(t,n){const e={},o=l(n,["safetyAttributes","categories"]);null!=o&&s(e,["categories"],o);const i=l(n,["safetyAttributes","scores"]);null!=i&&s(e,["scores"],i);const r=l(n,["contentType"]);return null!=r&&s(e,["contentType"],r),e}function Fe(t,n){const e={},o=l(n,["_self"]);null!=o&&s(e,["image"],function(t,n){const e={},o=l(n,["bytesBase64Encoded"]);null!=o&&s(e,["imageBytes"],S(0,o));const i=l(n,["mimeType"]);return null!=i&&s(e,["mimeType"],i),e}(0,o));const i=l(n,["raiFilteredReason"]);null!=i&&s(e,["raiFilteredReason"],i);const r=l(n,["_self"]);return null!=r&&s(e,["safetyAttributes"],je(0,r)),e}function Ve(t,n){const e={},o=l(n,["name"]);null!=o&&s(e,["name"],o);const i=l(n,["displayName"]);null!=i&&s(e,["displayName"],i);const r=l(n,["description"]);null!=r&&s(e,["description"],r);const a=l(n,["version"]);null!=a&&s(e,["version"],a);const u=l(n,["_self"]);null!=u&&s(e,["tunedModelInfo"],function(t,n){const e={},o=l(n,["baseModel"]);null!=o&&s(e,["baseModel"],o);const i=l(n,["createTime"]);null!=i&&s(e,["createTime"],i);const r=l(n,["updateTime"]);return null!=r&&s(e,["updateTime"],r),e}(0,u));const c=l(n,["inputTokenLimit"]);null!=c&&s(e,["inputTokenLimit"],c);const d=l(n,["outputTokenLimit"]);null!=d&&s(e,["outputTokenLimit"],d);const p=l(n,["supportedGenerationMethods"]);return null!=p&&s(e,["supportedActions"],p),e}function He(t,n){const e={},o=l(n,["_self"]);return null!=o&&s(e,["video"],function(t,n){const e={},o=l(n,["video","uri"]);null!=o&&s(e,["uri"],o);const i=l(n,["video","encodedVideo"]);null!=i&&s(e,["videoBytes"],S(0,i));const r=l(n,["encoding"]);return null!=r&&s(e,["mimeType"],r),e}(0,o)),e}function Be(t,n){const e={},o=l(n,["name"]);null!=o&&s(e,["name"],o);const i=l(n,["metadata"]);null!=i&&s(e,["metadata"],i);const r=l(n,["done"]);null!=r&&s(e,["done"],r);const a=l(n,["error"]);null!=a&&s(e,["error"],a);const u=l(n,["response","generateVideoResponse"]);return null!=u&&s(e,["response"],function(t,n){const e={},o=l(n,["generatedSamples"]);if(null!=o){let t=o;Array.isArray(t)&&(t=t.map((t=>He(0,t)))),s(e,["generatedVideos"],t);}const i=l(n,["raiMediaFilteredCount"]);null!=i&&s(e,["raiMediaFilteredCount"],i);const r=l(n,["raiMediaFilteredReasons"]);return null!=r&&s(e,["raiMediaFilteredReasons"],r),e}(0,u)),e}function Je(t,n){const e={},o=l(n,["videoMetadata"]);null!=o&&s(e,["videoMetadata"],o);const i=l(n,["thought"]);null!=i&&s(e,["thought"],i);const r=l(n,["inlineData"]);null!=r&&s(e,["inlineData"],function(t,n){const e={},o=l(n,["displayName"]);null!=o&&s(e,["displayName"],o);const i=l(n,["data"]);null!=i&&s(e,["data"],i);const r=l(n,["mimeType"]);return null!=r&&s(e,["mimeType"],r),e}(0,r));const a=l(n,["codeExecutionResult"]);null!=a&&s(e,["codeExecutionResult"],a);const u=l(n,["executableCode"]);null!=u&&s(e,["executableCode"],u);const c=l(n,["fileData"]);null!=c&&s(e,["fileData"],c);const d=l(n,["functionCall"]);null!=d&&s(e,["functionCall"],d);const p=l(n,["functionResponse"]);null!=p&&s(e,["functionResponse"],p);const f=l(n,["text"]);return null!=f&&s(e,["text"],f),e}function Ye(t,n){const e={},o=l(n,["content"]);null!=o&&s(e,["content"],function(t,n){const e={},o=l(n,["parts"]);if(null!=o){let t=o;Array.isArray(t)&&(t=t.map((t=>Je(0,t)))),s(e,["parts"],t);}const i=l(n,["role"]);return null!=i&&s(e,["role"],i),e}(0,o));const i=l(n,["citationMetadata"]);null!=i&&s(e,["citationMetadata"],function(t,n){const e={},o=l(n,["citations"]);return null!=o&&s(e,["citations"],o),e}(0,i));const r=l(n,["finishMessage"]);null!=r&&s(e,["finishMessage"],r);const a=l(n,["finishReason"]);null!=a&&s(e,["finishReason"],a);const u=l(n,["avgLogprobs"]);null!=u&&s(e,["avgLogprobs"],u);const c=l(n,["groundingMetadata"]);null!=c&&s(e,["groundingMetadata"],c);const d=l(n,["index"]);null!=d&&s(e,["index"],d);const p=l(n,["logprobsResult"]);null!=p&&s(e,["logprobsResult"],p);const f=l(n,["safetyRatings"]);return null!=f&&s(e,["safetyRatings"],f),e}function Ke(t,n){const e={},o=l(n,["candidates"]);if(null!=o){let t=o;Array.isArray(t)&&(t=t.map((t=>Ye(0,t)))),s(e,["candidates"],t);}const i=l(n,["createTime"]);null!=i&&s(e,["createTime"],i);const r=l(n,["responseId"]);null!=r&&s(e,["responseId"],r);const a=l(n,["modelVersion"]);null!=a&&s(e,["modelVersion"],a);const u=l(n,["promptFeedback"]);null!=u&&s(e,["promptFeedback"],u);const c=l(n,["usageMetadata"]);return null!=c&&s(e,["usageMetadata"],c),e}function We(t,n){const e={},o=l(n,["values"]);null!=o&&s(e,["values"],o);const i=l(n,["statistics"]);return null!=i&&s(e,["statistics"],function(t,n){const e={},o=l(n,["truncated"]);null!=o&&s(e,["truncated"],o);const i=l(n,["token_count"]);return null!=i&&s(e,["tokenCount"],i),e}(0,i)),e}function $e(t,n){const e={},o=l(n,["predictions[]","embeddings"]);if(null!=o){let t=o;Array.isArray(t)&&(t=t.map((t=>We(0,t)))),s(e,["embeddings"],t);}const i=l(n,["metadata"]);return null!=i&&s(e,["metadata"],function(t,n){const e={},o=l(n,["billableCharacterCount"]);return null!=o&&s(e,["billableCharacterCount"],o),e}(0,i)),e}function ze(t,n){const e={},o=l(n,["safetyAttributes","categories"]);null!=o&&s(e,["categories"],o);const i=l(n,["safetyAttributes","scores"]);null!=i&&s(e,["scores"],i);const r=l(n,["contentType"]);return null!=r&&s(e,["contentType"],r),e}function Xe(t,n){const e={},o=l(n,["_self"]);null!=o&&s(e,["image"],function(t,n){const e={},o=l(n,["gcsUri"]);null!=o&&s(e,["gcsUri"],o);const i=l(n,["bytesBase64Encoded"]);null!=i&&s(e,["imageBytes"],S(0,i));const r=l(n,["mimeType"]);return null!=r&&s(e,["mimeType"],r),e}(0,o));const i=l(n,["raiFilteredReason"]);null!=i&&s(e,["raiFilteredReason"],i);const r=l(n,["_self"]);null!=r&&s(e,["safetyAttributes"],ze(0,r));const a=l(n,["prompt"]);return null!=a&&s(e,["enhancedPrompt"],a),e}function Ze(t,n){const e={},o=l(n,["name"]);null!=o&&s(e,["name"],o);const i=l(n,["displayName"]);null!=i&&s(e,["displayName"],i);const r=l(n,["description"]);null!=r&&s(e,["description"],r);const a=l(n,["versionId"]);null!=a&&s(e,["version"],a);const u=l(n,["deployedModels"]);if(null!=u){let t=u;Array.isArray(t)&&(t=t.map((t=>function(t,n){const e={},o=l(n,["endpoint"]);null!=o&&s(e,["name"],o);const i=l(n,["deployedModelId"]);return null!=i&&s(e,["deployedModelId"],i),e}(0,t)))),s(e,["endpoints"],t);}const c=l(n,["labels"]);null!=c&&s(e,["labels"],c);const d=l(n,["_self"]);null!=d&&s(e,["tunedModelInfo"],function(t,n){const e={},o=l(n,["labels","google-vertex-llm-tuning-base-model-id"]);null!=o&&s(e,["baseModel"],o);const i=l(n,["createTime"]);null!=i&&s(e,["createTime"],i);const r=l(n,["updateTime"]);return null!=r&&s(e,["updateTime"],r),e}(0,d));const p=l(n,["defaultCheckpointId"]);null!=p&&s(e,["defaultCheckpointId"],p);const f=l(n,["checkpoints"]);if(null!=f){let t=f;Array.isArray(t)&&(t=t.map((t=>function(t,n){const e={},o=l(n,["checkpointId"]);null!=o&&s(e,["checkpointId"],o);const i=l(n,["epoch"]);null!=i&&s(e,["epoch"],i);const r=l(n,["step"]);return null!=r&&s(e,["step"],r),e}(0,t)))),s(e,["checkpoints"],t);}return e}function Qe(t,n){const e={},o=l(n,["_self"]);return null!=o&&s(e,["video"],function(t,n){const e={},o=l(n,["gcsUri"]);null!=o&&s(e,["uri"],o);const i=l(n,["bytesBase64Encoded"]);null!=i&&s(e,["videoBytes"],S(0,i));const r=l(n,["mimeType"]);return null!=r&&s(e,["mimeType"],r),e}(0,o)),e}function to(t,n){const e={},o=l(n,["name"]);null!=o&&s(e,["name"],o);const i=l(n,["metadata"]);null!=i&&s(e,["metadata"],i);const r=l(n,["done"]);null!=r&&s(e,["done"],r);const a=l(n,["error"]);null!=a&&s(e,["error"],a);const u=l(n,["response"]);return null!=u&&s(e,["response"],function(t,n){const e={},o=l(n,["videos"]);if(null!=o){let t=o;Array.isArray(t)&&(t=t.map((t=>Qe(0,t)))),s(e,["generatedVideos"],t);}const i=l(n,["raiMediaFilteredCount"]);null!=i&&s(e,["raiMediaFilteredCount"],i);const r=l(n,["raiMediaFilteredReasons"]);return null!=r&&s(e,["raiMediaFilteredReasons"],r),e}(0,u)),e}
/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */class no{constructor(t,n,e){this.apiClient=t,this.auth=n,this.webSocketFactory=e;}async connect(t){var n,e,o,i;const r=this.apiClient.getWebsocketBaseUrl(),u=this.apiClient.getApiVersion();let c;const d=function(t){const n=new Headers;for(const[e,o]of Object.entries(t))n.append(e,o);return n}
/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */(this.apiClient.getDefaultHeaders());if(this.apiClient.isVertexAI())c=`${r}/ws/google.cloud.aiplatform.${u}.LlmBidiService/BidiGenerateContent`,await this.auth.addAuthHeaders(d);else {c=`${r}/ws/google.ai.generativelanguage.${u}.GenerativeService.BidiGenerateContent?key=${this.apiClient.getApiKey()}`;}let p=()=>{};const f=new Promise((t=>{p=t;})),h=t.callbacks,g=this.apiClient,m={onopen:function(){var t;null===(t=null==h?void 0:h.onopen)||void 0===t||t.call(h),p({});},onmessage:t=>{!async function(t,n,e){const o=new gn;let i;if(i=e.data instanceof Blob?JSON.parse(await e.data.text()):JSON.parse(e.data),t.isVertexAI()){const t=ee(0,i);Object.assign(o,t);}else {const t=ne(0,i);Object.assign(o,t);}n(o);}(g,h.onmessage,t);},onerror:null!==(n=null==h?void 0:h.onerror)&&void 0!==n?n:function(t){},onclose:null!==(e=null==h?void 0:h.onclose)&&void 0!==e?e:function(t){}},y=this.webSocketFactory.create(c,function(t){const n={};return t.forEach(((t,e)=>{n[e]=t;})),n}(d),m);y.connect(),await f;let v=a(this.apiClient,t.model);if(this.apiClient.isVertexAI()&&v.startsWith("publishers/")){v=`projects/${this.apiClient.getProject()}/locations/${this.apiClient.getLocation()}/`+v;}let E={};this.apiClient.isVertexAI()&&void 0===(null===(o=t.config)||void 0===o?void 0:o.responseModalities)&&(void 0===t.config?t.config={responseModalities:[ut.AUDIO]}:t.config.responseModalities=[ut.AUDIO]),(null===(i=t.config)||void 0===i?void 0:i.generationConfig)&&console.warn("Setting `LiveConnectConfig.generation_config` is deprecated, please set the fields on `LiveConnectConfig` directly. This will become an error in a future version (not before Q3 2025).");const C={model:v,config:t.config,callbacks:t.callbacks};return E=this.apiClient.isVertexAI()?function(t,n){const e={},o=l(n,["model"]);null!=o&&s(e,["setup","model"],a(t,o));const i=l(n,["config"]);return null!=i&&s(e,["config"],Vn(0,i,e)),e}(this.apiClient,C):function(t,n){const e={},o=l(n,["model"]);null!=o&&s(e,["setup","model"],a(t,o));const i=l(n,["config"]);return null!=i&&s(e,["config"],Fn(0,i,e)),e}(this.apiClient,C),delete E.config,y.send(JSON.stringify(E)),new oo(y,this.apiClient)}}const eo={turnComplete:true};class oo{constructor(t,n){this.conn=t,this.apiClient=n;}tLiveClientContent(t,n){if(null!==n.turns&&void 0!==n.turns){let e=[];try{e=E(0,n.turns),e=t.isVertexAI()?e.map((t=>ye(0,t))):e.map((t=>ie(0,t)));}catch(t){throw new Error(`Failed to parse client content "turns", type: '${typeof n.turns}'`)}return {clientContent:{turns:e,turnComplete:n.turnComplete}}}return {clientContent:{turnComplete:n.turnComplete}}}tLiveClienttToolResponse(t,n){let e=[];if(null==n.functionResponses)throw new Error("functionResponses is required.");if(e=Array.isArray(n.functionResponses)?n.functionResponses:[n.functionResponses],0===e.length)throw new Error("functionResponses is required.");for(const n of e){if("object"!=typeof n||null===n||!("name"in n)||!("response"in n))throw new Error(`Could not parse function response, type '${typeof n}'.`);if(!t.isVertexAI()&&!("id"in n))throw new Error("FunctionResponse request must have an `id` field from the response of a ToolCall.FunctionalCalls in Google AI.")}return {toolResponse:{functionResponses:e}}}sendClientContent(t){t=Object.assign(Object.assign({},eo),t);const n=this.tLiveClientContent(this.apiClient,t);this.conn.send(JSON.stringify(n));}sendRealtimeInput(t){let n={};n=this.apiClient.isVertexAI()?{realtimeInput:Bn(this.apiClient,t)}:{realtimeInput:Hn(this.apiClient,t)},this.conn.send(JSON.stringify(n));}sendToolResponse(t){if(null==t.functionResponses)throw new Error("Tool response parameters are required.");const n=this.tLiveClienttToolResponse(this.apiClient,t);this.conn.send(JSON.stringify(n));}close(){this.conn.close();}}class io extends i{constructor(t){super(),this.apiClient=t,this.generateContent=async t=>await this.generateContentInternal(t),this.generateContentStream=async t=>await this.generateContentStreamInternal(t),this.generateImages=async t=>await this.generateImagesInternal(t).then((t=>{var n;let e;const o=[];if(null==t?void 0:t.generatedImages)for(const i of t.generatedImages)i&&(null==i?void 0:i.safetyAttributes)&&"Positive Prompt"===(null===(n=null==i?void 0:i.safetyAttributes)||void 0===n?void 0:n.contentType)?e=null==i?void 0:i.safetyAttributes:o.push(i);let i;return i=e?{generatedImages:o,positivePromptSafetyAttributes:e}:{generatedImages:o},i})),this.list=async t=>{var n;const e={config:Object.assign(Object.assign({},{queryBase:true}),null==t?void 0:t.config)};if(this.apiClient.isVertexAI()&&!e.config.queryBase){if(null===(n=e.config)||void 0===n?void 0:n.filter)throw new Error("Filtering tuned models list for Vertex AI is not currently supported");e.config.filter="labels.tune-type:*";}return new Nt($.PAGED_ITEM_MODELS,(t=>this.listInternal(t)),await this.listInternal(e),e)},this.editImage=async t=>{const n={model:t.model,prompt:t.prompt,referenceImages:[],config:t.config};return t.referenceImages&&t.referenceImages&&(n.referenceImages=t.referenceImages.map((t=>t.toReferenceImageAPI()))),await this.editImageInternal(n)},this.upscaleImage=async t=>{let n={numberOfImages:1,mode:"upscale"};t.config&&(n=Object.assign(Object.assign({},n),t.config));const e={model:t.model,image:t.image,upscaleFactor:t.upscaleFactor,config:n};return await this.upscaleImageInternal(e)};}async generateContentInternal(t){var n,e,o,i;let s,l="",a={};if(this.apiClient.isVertexAI()){const o=Ae(this.apiClient,t);return l=r("{model}:generateContent",o._url),a=o._query,delete o.config,delete o._url,delete o._query,s=this.apiClient.request({path:l,queryParams:a,body:JSON.stringify(o),httpMethod:"POST",httpOptions:null===(n=t.config)||void 0===n?void 0:n.httpOptions,abortSignal:null===(e=t.config)||void 0===e?void 0:e.abortSignal}).then((t=>t.json())),s.then((t=>{const n=Ke(this.apiClient,t),e=new Jt;return Object.assign(e,n),e}))}{const n=ue(this.apiClient,t);return l=r("{model}:generateContent",n._url),a=n._query,delete n.config,delete n._url,delete n._query,s=this.apiClient.request({path:l,queryParams:a,body:JSON.stringify(n),httpMethod:"POST",httpOptions:null===(o=t.config)||void 0===o?void 0:o.httpOptions,abortSignal:null===(i=t.config)||void 0===i?void 0:i.abortSignal}).then((t=>t.json())),s.then((t=>{const n=Ge(this.apiClient,t),e=new Jt;return Object.assign(e,n),e}))}}async generateContentStreamInternal(t){var n,e,o,i;let s,l="",a={};if(this.apiClient.isVertexAI()){const o=Ae(this.apiClient,t);l=r("{model}:streamGenerateContent?alt=sse",o._url),a=o._query,delete o.config,delete o._url,delete o._query;const i=this.apiClient;return s=i.requestStream({path:l,queryParams:a,body:JSON.stringify(o),httpMethod:"POST",httpOptions:null===(n=t.config)||void 0===n?void 0:n.httpOptions,abortSignal:null===(e=t.config)||void 0===e?void 0:e.abortSignal}),s.then((function(t){return Tn(this,arguments,(function*(){var n,e,o,i;try{for(var r,s=!0,l=In(t);!(n=(r=yield Cn(l.next())).done);s=!0){i=r.value,s=!1;const t=i,n=Ke(0,yield Cn(t.json())),e=new Jt;Object.assign(e,n),yield yield Cn(e);}}catch(t){e={error:t};}finally{try{s||n||!(o=l.return)||(yield Cn(o.call(l)));}finally{if(e)throw e.error}}}))}))}{const n=ue(this.apiClient,t);l=r("{model}:streamGenerateContent?alt=sse",n._url),a=n._query,delete n.config,delete n._url,delete n._query;const e=this.apiClient;return s=e.requestStream({path:l,queryParams:a,body:JSON.stringify(n),httpMethod:"POST",httpOptions:null===(o=t.config)||void 0===o?void 0:o.httpOptions,abortSignal:null===(i=t.config)||void 0===i?void 0:i.abortSignal}),s.then((function(t){return Tn(this,arguments,(function*(){var n,e,o,i;try{for(var r,s=!0,l=In(t);!(n=(r=yield Cn(l.next())).done);s=!0){i=r.value,s=!1;const t=i,n=Ge(0,yield Cn(t.json())),e=new Jt;Object.assign(e,n),yield yield Cn(e);}}catch(t){e={error:t};}finally{try{s||n||!(o=l.return)||(yield Cn(o.call(l)));}finally{if(e)throw e.error}}}))}))}}async embedContent(t){var n,e,o,i;let s,l="",a={};if(this.apiClient.isVertexAI()){const o=Se(this.apiClient,t);return l=r("{model}:predict",o._url),a=o._query,delete o.config,delete o._url,delete o._query,s=this.apiClient.request({path:l,queryParams:a,body:JSON.stringify(o),httpMethod:"POST",httpOptions:null===(n=t.config)||void 0===n?void 0:n.httpOptions,abortSignal:null===(e=t.config)||void 0===e?void 0:e.abortSignal}).then((t=>t.json())),s.then((t=>{const n=$e(this.apiClient,t),e=new Yt;return Object.assign(e,n),e}))}{const n=ce(this.apiClient,t);return l=r("{model}:batchEmbedContents",n._url),a=n._query,delete n.config,delete n._url,delete n._query,s=this.apiClient.request({path:l,queryParams:a,body:JSON.stringify(n),httpMethod:"POST",httpOptions:null===(o=t.config)||void 0===o?void 0:o.httpOptions,abortSignal:null===(i=t.config)||void 0===i?void 0:i.abortSignal}).then((t=>t.json())),s.then((t=>{const n=ke(this.apiClient,t),e=new Yt;return Object.assign(e,n),e}))}}async generateImagesInternal(t){var n,e,o,i;let a,u="",c={};if(this.apiClient.isVertexAI()){const o=be(this.apiClient,t);return u=r("{model}:predict",o._url),c=o._query,delete o.config,delete o._url,delete o._query,a=this.apiClient.request({path:u,queryParams:c,body:JSON.stringify(o),httpMethod:"POST",httpOptions:null===(n=t.config)||void 0===n?void 0:n.httpOptions,abortSignal:null===(e=t.config)||void 0===e?void 0:e.abortSignal}).then((t=>t.json())),a.then((t=>{const n=function(t,n){const e={},o=l(n,["predictions"]);if(null!=o){let t=o;Array.isArray(t)&&(t=t.map((t=>Xe(0,t)))),s(e,["generatedImages"],t);}const i=l(n,["positivePromptSafetyAttributes"]);return null!=i&&s(e,["positivePromptSafetyAttributes"],ze(0,i)),e}(this.apiClient,t),e=new Kt;return Object.assign(e,n),e}))}{const n=de(this.apiClient,t);return u=r("{model}:predict",n._url),c=n._query,delete n.config,delete n._url,delete n._query,a=this.apiClient.request({path:u,queryParams:c,body:JSON.stringify(n),httpMethod:"POST",httpOptions:null===(o=t.config)||void 0===o?void 0:o.httpOptions,abortSignal:null===(i=t.config)||void 0===i?void 0:i.abortSignal}).then((t=>t.json())),a.then((t=>{const n=function(t,n){const e={},o=l(n,["predictions"]);if(null!=o){let t=o;Array.isArray(t)&&(t=t.map((t=>Fe(0,t)))),s(e,["generatedImages"],t);}const i=l(n,["positivePromptSafetyAttributes"]);return null!=i&&s(e,["positivePromptSafetyAttributes"],je(0,i)),e}(this.apiClient,t),e=new Kt;return Object.assign(e,n),e}))}}async editImageInternal(t){var n,e;let o,i="",a={};if(this.apiClient.isVertexAI()){const u=Ne(this.apiClient,t);return i=r("{model}:predict",u._url),a=u._query,delete u.config,delete u._url,delete u._query,o=this.apiClient.request({path:i,queryParams:a,body:JSON.stringify(u),httpMethod:"POST",httpOptions:null===(n=t.config)||void 0===n?void 0:n.httpOptions,abortSignal:null===(e=t.config)||void 0===e?void 0:e.abortSignal}).then((t=>t.json())),o.then((t=>{const n=function(t,n){const e={},o=l(n,["predictions"]);if(null!=o){let t=o;Array.isArray(t)&&(t=t.map((t=>Xe(0,t)))),s(e,["generatedImages"],t);}return e}(this.apiClient,t),e=new Wt;return Object.assign(e,n),e}))}throw new Error("This method is only supported by the Vertex AI.")}async upscaleImageInternal(t){var n,e;let o,i="",a={};if(this.apiClient.isVertexAI()){const u=De(this.apiClient,t);return i=r("{model}:predict",u._url),a=u._query,delete u.config,delete u._url,delete u._query,o=this.apiClient.request({path:i,queryParams:a,body:JSON.stringify(u),httpMethod:"POST",httpOptions:null===(n=t.config)||void 0===n?void 0:n.httpOptions,abortSignal:null===(e=t.config)||void 0===e?void 0:e.abortSignal}).then((t=>t.json())),o.then((t=>{const n=function(t,n){const e={},o=l(n,["predictions"]);if(null!=o){let t=o;Array.isArray(t)&&(t=t.map((t=>Xe(0,t)))),s(e,["generatedImages"],t);}return e}(this.apiClient,t),e=new $t;return Object.assign(e,n),e}))}throw new Error("This method is only supported by the Vertex AI.")}async get(t){var n,e,o,i;let u,c="",d={};if(this.apiClient.isVertexAI()){const o=function(t,n){const e={},o=l(n,["model"]);null!=o&&s(e,["_url","name"],a(t,o));const i=l(n,["config"]);return null!=i&&s(e,["config"],i),e}(this.apiClient,t);return c=r("{name}",o._url),d=o._query,delete o.config,delete o._url,delete o._query,u=this.apiClient.request({path:c,queryParams:d,body:JSON.stringify(o),httpMethod:"GET",httpOptions:null===(n=t.config)||void 0===n?void 0:n.httpOptions,abortSignal:null===(e=t.config)||void 0===e?void 0:e.abortSignal}).then((t=>t.json())),u.then((t=>Ze(this.apiClient,t)))}{const n=function(t,n){const e={},o=l(n,["model"]);null!=o&&s(e,["_url","name"],a(t,o));const i=l(n,["config"]);return null!=i&&s(e,["config"],i),e}(this.apiClient,t);return c=r("{name}",n._url),d=n._query,delete n.config,delete n._url,delete n._query,u=this.apiClient.request({path:c,queryParams:d,body:JSON.stringify(n),httpMethod:"GET",httpOptions:null===(o=t.config)||void 0===o?void 0:o.httpOptions,abortSignal:null===(i=t.config)||void 0===i?void 0:i.abortSignal}).then((t=>t.json())),u.then((t=>Ve(this.apiClient,t)))}}async listInternal(t){var n,e,o,i;let a,u="",c={};if(this.apiClient.isVertexAI()){const o=Re(this.apiClient,t);return u=r("{models_url}",o._url),c=o._query,delete o.config,delete o._url,delete o._query,a=this.apiClient.request({path:u,queryParams:c,body:JSON.stringify(o),httpMethod:"GET",httpOptions:null===(n=t.config)||void 0===n?void 0:n.httpOptions,abortSignal:null===(e=t.config)||void 0===e?void 0:e.abortSignal}).then((t=>t.json())),a.then((t=>{const n=function(t,n){const e={},o=l(n,["nextPageToken"]);null!=o&&s(e,["nextPageToken"],o);const i=l(n,["_self"]);if(null!=i){let t=P(0,i);Array.isArray(t)&&(t=t.map((t=>Ze(0,t)))),s(e,["models"],t);}return e}(this.apiClient,t),e=new zt;return Object.assign(e,n),e}))}{const n=pe(this.apiClient,t);return u=r("{models_url}",n._url),c=n._query,delete n.config,delete n._url,delete n._query,a=this.apiClient.request({path:u,queryParams:c,body:JSON.stringify(n),httpMethod:"GET",httpOptions:null===(o=t.config)||void 0===o?void 0:o.httpOptions,abortSignal:null===(i=t.config)||void 0===i?void 0:i.abortSignal}).then((t=>t.json())),a.then((t=>{const n=function(t,n){const e={},o=l(n,["nextPageToken"]);null!=o&&s(e,["nextPageToken"],o);const i=l(n,["_self"]);if(null!=i){let t=P(0,i);Array.isArray(t)&&(t=t.map((t=>Ve(0,t)))),s(e,["models"],t);}return e}(this.apiClient,t),e=new zt;return Object.assign(e,n),e}))}}async update(t){var n,e,o,i;let s,l="",a={};if(this.apiClient.isVertexAI()){const o=Me(this.apiClient,t);return l=r("{model}",o._url),a=o._query,delete o.config,delete o._url,delete o._query,s=this.apiClient.request({path:l,queryParams:a,body:JSON.stringify(o),httpMethod:"PATCH",httpOptions:null===(n=t.config)||void 0===n?void 0:n.httpOptions,abortSignal:null===(e=t.config)||void 0===e?void 0:e.abortSignal}).then((t=>t.json())),s.then((t=>Ze(this.apiClient,t)))}{const n=fe(this.apiClient,t);return l=r("{name}",n._url),a=n._query,delete n.config,delete n._url,delete n._query,s=this.apiClient.request({path:l,queryParams:a,body:JSON.stringify(n),httpMethod:"PATCH",httpOptions:null===(o=t.config)||void 0===o?void 0:o.httpOptions,abortSignal:null===(i=t.config)||void 0===i?void 0:i.abortSignal}).then((t=>t.json())),s.then((t=>Ve(this.apiClient,t)))}}async delete(t){var n,e,o,i;let u,c="",d={};if(this.apiClient.isVertexAI()){const o=function(t,n){const e={},o=l(n,["model"]);null!=o&&s(e,["_url","name"],a(t,o));const i=l(n,["config"]);return null!=i&&s(e,["config"],i),e}(this.apiClient,t);return c=r("{name}",o._url),d=o._query,delete o.config,delete o._url,delete o._query,u=this.apiClient.request({path:c,queryParams:d,body:JSON.stringify(o),httpMethod:"DELETE",httpOptions:null===(n=t.config)||void 0===n?void 0:n.httpOptions,abortSignal:null===(e=t.config)||void 0===e?void 0:e.abortSignal}).then((t=>t.json())),u.then((()=>{const t={},n=new Xt;return Object.assign(n,t),n}))}{const n=function(t,n){const e={},o=l(n,["model"]);null!=o&&s(e,["_url","name"],a(t,o));const i=l(n,["config"]);return null!=i&&s(e,["config"],i),e}(this.apiClient,t);return c=r("{name}",n._url),d=n._query,delete n.config,delete n._url,delete n._query,u=this.apiClient.request({path:c,queryParams:d,body:JSON.stringify(n),httpMethod:"DELETE",httpOptions:null===(o=t.config)||void 0===o?void 0:o.httpOptions,abortSignal:null===(i=t.config)||void 0===i?void 0:i.abortSignal}).then((t=>t.json())),u.then((()=>{const t={},n=new Xt;return Object.assign(n,t),n}))}}async countTokens(t){var n,e,o,i;let a,u="",c={};if(this.apiClient.isVertexAI()){const o=xe(this.apiClient,t);return u=r("{model}:countTokens",o._url),c=o._query,delete o.config,delete o._url,delete o._query,a=this.apiClient.request({path:u,queryParams:c,body:JSON.stringify(o),httpMethod:"POST",httpOptions:null===(n=t.config)||void 0===n?void 0:n.httpOptions,abortSignal:null===(e=t.config)||void 0===e?void 0:e.abortSignal}).then((t=>t.json())),a.then((t=>{const n=function(t,n){const e={},o=l(n,["totalTokens"]);return null!=o&&s(e,["totalTokens"],o),e}(this.apiClient,t),e=new Zt;return Object.assign(e,n),e}))}{const n=he(this.apiClient,t);return u=r("{model}:countTokens",n._url),c=n._query,delete n.config,delete n._url,delete n._query,a=this.apiClient.request({path:u,queryParams:c,body:JSON.stringify(n),httpMethod:"POST",httpOptions:null===(o=t.config)||void 0===o?void 0:o.httpOptions,abortSignal:null===(i=t.config)||void 0===i?void 0:i.abortSignal}).then((t=>t.json())),a.then((t=>{const n=function(t,n){const e={},o=l(n,["totalTokens"]);null!=o&&s(e,["totalTokens"],o);const i=l(n,["cachedContentTokenCount"]);return null!=i&&s(e,["cachedContentTokenCount"],i),e}(this.apiClient,t),e=new Zt;return Object.assign(e,n),e}))}}async computeTokens(t){var n,e;let o,i="",u={};if(this.apiClient.isVertexAI()){const c=function(t,n){const e={},o=l(n,["model"]);null!=o&&s(e,["_url","model"],a(t,o));const i=l(n,["contents"]);if(null!=i){let t=E(0,i);Array.isArray(t)&&(t=t.map((t=>ye(0,t)))),s(e,["contents"],t);}const r=l(n,["config"]);return null!=r&&s(e,["config"],r),e}(this.apiClient,t);return i=r("{model}:computeTokens",c._url),u=c._query,delete c.config,delete c._url,delete c._query,o=this.apiClient.request({path:i,queryParams:u,body:JSON.stringify(c),httpMethod:"POST",httpOptions:null===(n=t.config)||void 0===n?void 0:n.httpOptions,abortSignal:null===(e=t.config)||void 0===e?void 0:e.abortSignal}).then((t=>t.json())),o.then((t=>{const n=function(t,n){const e={},o=l(n,["tokensInfo"]);return null!=o&&s(e,["tokensInfo"],o),e}(this.apiClient,t),e=new Qt;return Object.assign(e,n),e}))}throw new Error("This method is only supported by the Vertex AI.")}async generateVideos(t){var n,e,o,i;let s,l="",a={};if(this.apiClient.isVertexAI()){const o=Ue(this.apiClient,t);return l=r("{model}:predictLongRunning",o._url),a=o._query,delete o.config,delete o._url,delete o._query,s=this.apiClient.request({path:l,queryParams:a,body:JSON.stringify(o),httpMethod:"POST",httpOptions:null===(n=t.config)||void 0===n?void 0:n.httpOptions,abortSignal:null===(e=t.config)||void 0===e?void 0:e.abortSignal}).then((t=>t.json())),s.then((t=>to(this.apiClient,t)))}{const n=ge(this.apiClient,t);return l=r("{model}:predictLongRunning",n._url),a=n._query,delete n.config,delete n._url,delete n._query,s=this.apiClient.request({path:l,queryParams:a,body:JSON.stringify(n),httpMethod:"POST",httpOptions:null===(o=t.config)||void 0===o?void 0:o.httpOptions,abortSignal:null===(i=t.config)||void 0===i?void 0:i.abortSignal}).then((t=>t.json())),s.then((t=>Be(this.apiClient,t)))}}}
/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */function ro(t,n){const e={},o=l(n,["_self"]);return null!=o&&s(e,["video"],function(t,n){const e={},o=l(n,["video","uri"]);null!=o&&s(e,["uri"],o);const i=l(n,["video","encodedVideo"]);null!=i&&s(e,["videoBytes"],S(0,i));const r=l(n,["encoding"]);return null!=r&&s(e,["mimeType"],r),e}(0,o)),e}function so(t,n){const e={},o=l(n,["name"]);null!=o&&s(e,["name"],o);const i=l(n,["metadata"]);null!=i&&s(e,["metadata"],i);const r=l(n,["done"]);null!=r&&s(e,["done"],r);const a=l(n,["error"]);null!=a&&s(e,["error"],a);const u=l(n,["response","generateVideoResponse"]);return null!=u&&s(e,["response"],function(t,n){const e={},o=l(n,["generatedSamples"]);if(null!=o){let t=o;Array.isArray(t)&&(t=t.map((t=>ro(0,t)))),s(e,["generatedVideos"],t);}const i=l(n,["raiMediaFilteredCount"]);null!=i&&s(e,["raiMediaFilteredCount"],i);const r=l(n,["raiMediaFilteredReasons"]);return null!=r&&s(e,["raiMediaFilteredReasons"],r),e}(0,u)),e}function lo(t,n){const e={},o=l(n,["_self"]);return null!=o&&s(e,["video"],function(t,n){const e={},o=l(n,["gcsUri"]);null!=o&&s(e,["uri"],o);const i=l(n,["bytesBase64Encoded"]);null!=i&&s(e,["videoBytes"],S(0,i));const r=l(n,["mimeType"]);return null!=r&&s(e,["mimeType"],r),e}(0,o)),e}function ao(t,n){const e={},o=l(n,["name"]);null!=o&&s(e,["name"],o);const i=l(n,["metadata"]);null!=i&&s(e,["metadata"],i);const r=l(n,["done"]);null!=r&&s(e,["done"],r);const a=l(n,["error"]);null!=a&&s(e,["error"],a);const u=l(n,["response"]);return null!=u&&s(e,["response"],function(t,n){const e={},o=l(n,["videos"]);if(null!=o){let t=o;Array.isArray(t)&&(t=t.map((t=>lo(0,t)))),s(e,["generatedVideos"],t);}const i=l(n,["raiMediaFilteredCount"]);null!=i&&s(e,["raiMediaFilteredCount"],i);const r=l(n,["raiMediaFilteredReasons"]);return null!=r&&s(e,["raiMediaFilteredReasons"],r),e}(0,u)),e}
/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */class uo extends i{constructor(t){super(),this.apiClient=t;}async getVideosOperation(t){const n=t.operation,e=t.config;if(void 0===n.name||""===n.name)throw new Error("Operation name is required.");if(this.apiClient.isVertexAI()){const t=n.name.split("/operations/")[0];let o;return e&&"httpOptions"in e&&(o=e.httpOptions),this.fetchPredictVideosOperationInternal({operationName:n.name,resourceName:t,config:{httpOptions:o}})}return this.getVideosOperationInternal({operationName:n.name,config:e})}async getVideosOperationInternal(t){var n,e,o,i;let a,u="",c={};if(this.apiClient.isVertexAI()){const o=function(t,n){const e={},o=l(n,["operationName"]);null!=o&&s(e,["_url","operationName"],o);const i=l(n,["config"]);return null!=i&&s(e,["config"],i),e}(this.apiClient,t);return u=r("{operationName}",o._url),c=o._query,delete o.config,delete o._url,delete o._query,a=this.apiClient.request({path:u,queryParams:c,body:JSON.stringify(o),httpMethod:"GET",httpOptions:null===(n=t.config)||void 0===n?void 0:n.httpOptions,abortSignal:null===(e=t.config)||void 0===e?void 0:e.abortSignal}).then((t=>t.json())),a.then((t=>ao(this.apiClient,t)))}{const n=function(t,n){const e={},o=l(n,["operationName"]);null!=o&&s(e,["_url","operationName"],o);const i=l(n,["config"]);return null!=i&&s(e,["config"],i),e}(this.apiClient,t);return u=r("{operationName}",n._url),c=n._query,delete n.config,delete n._url,delete n._query,a=this.apiClient.request({path:u,queryParams:c,body:JSON.stringify(n),httpMethod:"GET",httpOptions:null===(o=t.config)||void 0===o?void 0:o.httpOptions,abortSignal:null===(i=t.config)||void 0===i?void 0:i.abortSignal}).then((t=>t.json())),a.then((t=>so(this.apiClient,t)))}}async fetchPredictVideosOperationInternal(t){var n,e;let o,i="",a={};if(this.apiClient.isVertexAI()){const u=function(t,n){const e={},o=l(n,["operationName"]);null!=o&&s(e,["operationName"],o);const i=l(n,["resourceName"]);null!=i&&s(e,["_url","resourceName"],i);const r=l(n,["config"]);return null!=r&&s(e,["config"],r),e}(this.apiClient,t);return i=r("{resourceName}:fetchPredictOperation",u._url),a=u._query,delete u.config,delete u._url,delete u._query,o=this.apiClient.request({path:i,queryParams:a,body:JSON.stringify(u),httpMethod:"POST",httpOptions:null===(n=t.config)||void 0===n?void 0:n.httpOptions,abortSignal:null===(e=t.config)||void 0===e?void 0:e.abortSignal}).then((t=>t.json())),o.then((t=>ao(this.apiClient,t)))}throw new Error("This method is only supported by the Vertex AI.")}}
/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */const co=/^data: (.*)(?:\n\n|\r\r|\r\n\r\n)/;class po extends Error{constructor(t,n){super(t,n?{cause:n}:{cause:(new Error).stack}),this.message=t,this.name="ClientError";}}class fo extends Error{constructor(t,n){super(t,n?{cause:n}:{cause:(new Error).stack}),this.message=t,this.name="ServerError";}}class ho{constructor(t){var n,e;this.clientOptions=Object.assign(Object.assign({},t),{project:t.project,location:t.location,apiKey:t.apiKey,vertexai:t.vertexai});const o={};this.clientOptions.vertexai?(o.apiVersion=null!==(n=this.clientOptions.apiVersion)&&void 0!==n?n:"v1beta1",o.baseUrl=this.baseUrlFromProjectLocation(),this.normalizeAuthParameters()):(o.apiVersion=null!==(e=this.clientOptions.apiVersion)&&void 0!==e?e:"v1beta",o.baseUrl="https://generativelanguage.googleapis.com/"),o.headers=this.getDefaultHeaders(),this.clientOptions.httpOptions=o,t.httpOptions&&(this.clientOptions.httpOptions=this.patchHttpOptions(o,t.httpOptions));}baseUrlFromProjectLocation(){return this.clientOptions.project&&this.clientOptions.location&&"global"!==this.clientOptions.location?`https://${this.clientOptions.location}-aiplatform.googleapis.com/`:"https://aiplatform.googleapis.com/"}normalizeAuthParameters(){this.clientOptions.project&&this.clientOptions.location?this.clientOptions.apiKey=void 0:(this.clientOptions.project=void 0,this.clientOptions.location=void 0);}isVertexAI(){var t;return null!==(t=this.clientOptions.vertexai)&&void 0!==t&&t}getProject(){return this.clientOptions.project}getLocation(){return this.clientOptions.location}getApiVersion(){if(this.clientOptions.httpOptions&&void 0!==this.clientOptions.httpOptions.apiVersion)return this.clientOptions.httpOptions.apiVersion;throw new Error("API version is not set.")}getBaseUrl(){if(this.clientOptions.httpOptions&&void 0!==this.clientOptions.httpOptions.baseUrl)return this.clientOptions.httpOptions.baseUrl;throw new Error("Base URL is not set.")}getRequestUrl(){return this.getRequestUrlInternal(this.clientOptions.httpOptions)}getHeaders(){if(this.clientOptions.httpOptions&&void 0!==this.clientOptions.httpOptions.headers)return this.clientOptions.httpOptions.headers;throw new Error("Headers are not set.")}getRequestUrlInternal(t){if(!t||void 0===t.baseUrl||void 0===t.apiVersion)throw new Error("HTTP options are not correctly set.");const n=[t.baseUrl.endsWith("/")?t.baseUrl.slice(0,-1):t.baseUrl];return t.apiVersion&&""!==t.apiVersion&&n.push(t.apiVersion),n.join("/")}getBaseResourcePath(){return `projects/${this.clientOptions.project}/locations/${this.clientOptions.location}`}getApiKey(){return this.clientOptions.apiKey}getWebsocketBaseUrl(){const t=this.getBaseUrl(),n=new URL(t);return n.protocol="http:"==n.protocol?"ws":"wss",n.toString()}setBaseUrl(t){if(!this.clientOptions.httpOptions)throw new Error("HTTP options are not correctly set.");this.clientOptions.httpOptions.baseUrl=t;}constructUrl(t,n,e){const o=[this.getRequestUrlInternal(n)];e&&o.push(this.getBaseResourcePath()),""!==t&&o.push(t);return new URL(`${o.join("/")}`)}shouldPrependVertexProjectPath(t){return !this.clientOptions.apiKey&&(!!this.clientOptions.vertexai&&(!t.path.startsWith("projects/")&&("GET"!==t.httpMethod||!t.path.startsWith("publishers/google/models"))))}async request(t){let n=this.clientOptions.httpOptions;t.httpOptions&&(n=this.patchHttpOptions(this.clientOptions.httpOptions,t.httpOptions));const e=this.shouldPrependVertexProjectPath(t),o=this.constructUrl(t.path,n,e);if(t.queryParams)for(const[n,e]of Object.entries(t.queryParams))o.searchParams.append(n,String(e));let i={};if("GET"===t.httpMethod){if(t.body&&"{}"!==t.body)throw new Error("Request body should be empty for GET request, but got non empty request body")}else i.body=t.body;return i=await this.includeExtraHttpOptionsToRequestInit(i,n,t.abortSignal),this.unaryApiCall(o,i,t.httpMethod)}patchHttpOptions(t,n){const e=JSON.parse(JSON.stringify(t));for(const[t,o]of Object.entries(n))"object"==typeof o?e[t]=Object.assign(Object.assign({},e[t]),o):void 0!==o&&(e[t]=o);return e}async requestStream(t){let n=this.clientOptions.httpOptions;t.httpOptions&&(n=this.patchHttpOptions(this.clientOptions.httpOptions,t.httpOptions));const e=this.shouldPrependVertexProjectPath(t),o=this.constructUrl(t.path,n,e);o.searchParams.has("alt")&&"sse"===o.searchParams.get("alt")||o.searchParams.set("alt","sse");let i={};return i.body=t.body,i=await this.includeExtraHttpOptionsToRequestInit(i,n,t.abortSignal),this.streamApiCall(o,i,t.httpMethod)}async includeExtraHttpOptionsToRequestInit(t,n,e){if(n&&n.timeout||e){const o=new AbortController,i=o.signal;n.timeout&&(null==n?void 0:n.timeout)>0&&setTimeout((()=>o.abort()),n.timeout),e&&e.addEventListener("abort",(()=>{o.abort();})),t.signal=i;}return t.headers=await this.getHeadersInternal(n),t}async unaryApiCall(t,n,e){return this.apiCall(t.toString(),Object.assign(Object.assign({},n),{method:e})).then((async t=>(await go(t),new sn(t)))).catch((t=>{throw t instanceof Error?t:new Error(JSON.stringify(t))}))}async streamApiCall(t,n,e){return this.apiCall(t.toString(),Object.assign(Object.assign({},n),{method:e})).then((async t=>(await go(t),this.processStreamResponse(t)))).catch((t=>{throw t instanceof Error?t:new Error(JSON.stringify(t))}))}processStreamResponse(t){var n;return Tn(this,arguments,(function*(){const e=null===(n=null==t?void 0:t.body)||void 0===n?void 0:n.getReader(),o=new TextDecoder("utf-8");if(!e)throw new Error("Response body is empty");try{let n="";for(;;){const{done:i,value:r}=yield Cn(e.read());if(i){if(n.trim().length>0)throw new Error("Incomplete JSON segment at the end");break}const s=o.decode(r);try{const t=JSON.parse(s);if("error"in t){const n=JSON.parse(JSON.stringify(t.error)),e=n.status,o=n.code,i=`got status: ${e}. ${JSON.stringify(t)}`;if(o>=400&&o<500){throw new po(i)}if(o>=500&&o<600){throw new fo(i)}}}catch(t){const n=t;if("ClientError"===n.name||"ServerError"===n.name)throw t}n+=s;let l=n.match(co);for(;l;){const e=l[1];try{const o=new Response(e,{headers:null==t?void 0:t.headers,status:null==t?void 0:t.status,statusText:null==t?void 0:t.statusText});yield yield Cn(new sn(o)),n=n.slice(l[0].length),l=n.match(co);}catch(t){throw new Error(`exception parsing stream chunk ${e}. ${t}`)}}}}finally{e.releaseLock();}}))}async apiCall(t,n){return fetch(t,n).catch((t=>{throw new Error(`exception ${t} sending request`)}))}getDefaultHeaders(){const t={},n="google-genai-sdk/0.14.1 "+this.clientOptions.userAgentExtra;return t["User-Agent"]=n,t["x-goog-api-client"]=n,t["Content-Type"]="application/json",t}async getHeadersInternal(t){const n=new Headers;if(t&&t.headers){for(const[e,o]of Object.entries(t.headers))n.append(e,o);t.timeout&&t.timeout>0&&n.append("X-Server-Timeout",String(Math.ceil(t.timeout/1e3)));}return await this.clientOptions.auth.addAuthHeaders(n),n}async uploadFile(t,n){var e;const o={};null!=n&&(o.mimeType=n.mimeType,o.name=n.name,o.displayName=n.displayName),o.name&&!o.name.startsWith("files/")&&(o.name=`files/${o.name}`);const i=this.clientOptions.uploader,r=await i.stat(t);o.sizeBytes=String(r.size);const s=null!==(e=null==n?void 0:n.mimeType)&&void 0!==e?e:r.type;if(void 0===s||""===s)throw new Error("Can not determine mimeType. Please provide mimeType in the config.");o.mimeType=s;const l=await this.fetchUploadUrl(o,n);return i.upload(t,l,this)}async downloadFile(t){const n=this.clientOptions.downloader;await n.download(t,this);}async fetchUploadUrl(t,n){var e;let o={};o=(null==n?void 0:n.httpOptions)?n.httpOptions:{apiVersion:"",headers:{"Content-Type":"application/json","X-Goog-Upload-Protocol":"resumable","X-Goog-Upload-Command":"start","X-Goog-Upload-Header-Content-Length":`${t.sizeBytes}`,"X-Goog-Upload-Header-Content-Type":`${t.mimeType}`}};const i={file:t},s=await this.request({path:r("upload/v1beta/files",i._url),body:JSON.stringify(i),httpMethod:"POST",httpOptions:o});if(!s||!(null==s?void 0:s.headers))throw new Error("Server did not return an HttpResponse or the returned HttpResponse did not have headers.");const l=null===(e=null==s?void 0:s.headers)||void 0===e?void 0:e["x-goog-upload-url"];if(void 0===l)throw new Error("Failed to get upload url. Server did not return the x-google-upload-url in the headers");return l}}async function go(t){var n;if(void 0===t)throw new fo("response is undefined");if(!t.ok){const e=t.status,o=t.statusText;let i;i=(null===(n=t.headers.get("content-type"))||void 0===n?void 0:n.includes("application/json"))?await t.json():{error:{message:await t.text(),code:t.status,status:t.statusText}};const r=`got status: ${e} ${o}. ${JSON.stringify(i)}`;if(e>=400&&e<500){throw new po(r)}if(e>=500&&e<600){throw new fo(r)}throw new Error(r)}}
/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */function mo(t,n){const e={},o=l(n,["config"]);return null!=o&&s(e,["config"],function(t,n,e){const o=l(n,["pageSize"]);void 0!==e&&null!=o&&s(e,["_query","pageSize"],o);const i=l(n,["pageToken"]);void 0!==e&&null!=i&&s(e,["_query","pageToken"],i);const r=l(n,["filter"]);return void 0!==e&&null!=r&&s(e,["_query","filter"],r),{}}(0,o,e)),e}function yo(t,n){const e={};if(void 0!==l(n,["gcsUri"]))throw new Error("gcsUri parameter is not supported in Gemini API.");const o=l(n,["examples"]);if(null!=o){let t=o;Array.isArray(t)&&(t=t.map((t=>function(t,n){const e={},o=l(n,["textInput"]);null!=o&&s(e,["textInput"],o);const i=l(n,["output"]);return null!=i&&s(e,["output"],i),e}(0,t)))),s(e,["examples","examples"],t);}return e}function vo(t,n){const e={},o=l(n,["baseModel"]);null!=o&&s(e,["baseModel"],o);const i=l(n,["trainingDataset"]);null!=i&&s(e,["tuningTask","trainingData"],yo(0,i));const r=l(n,["config"]);return null!=r&&s(e,["config"],function(t,n,e){const o={};if(void 0!==l(n,["validationDataset"]))throw new Error("validationDataset parameter is not supported in Gemini API.");const i=l(n,["tunedModelDisplayName"]);if(void 0!==e&&null!=i&&s(e,["displayName"],i),void 0!==l(n,["description"]))throw new Error("description parameter is not supported in Gemini API.");const r=l(n,["epochCount"]);void 0!==e&&null!=r&&s(e,["tuningTask","hyperparameters","epochCount"],r);const a=l(n,["learningRateMultiplier"]);if(null!=a&&s(o,["tuningTask","hyperparameters","learningRateMultiplier"],a),void 0!==l(n,["exportLastCheckpointOnly"]))throw new Error("exportLastCheckpointOnly parameter is not supported in Gemini API.");if(void 0!==l(n,["adapterSize"]))throw new Error("adapterSize parameter is not supported in Gemini API.");const u=l(n,["batchSize"]);void 0!==e&&null!=u&&s(e,["tuningTask","hyperparameters","batchSize"],u);const c=l(n,["learningRate"]);return void 0!==e&&null!=c&&s(e,["tuningTask","hyperparameters","learningRate"],c),o}(0,r,e)),e}function Eo(t,n){const e={},o=l(n,["config"]);return null!=o&&s(e,["config"],function(t,n,e){const o=l(n,["pageSize"]);void 0!==e&&null!=o&&s(e,["_query","pageSize"],o);const i=l(n,["pageToken"]);void 0!==e&&null!=i&&s(e,["_query","pageToken"],i);const r=l(n,["filter"]);return void 0!==e&&null!=r&&s(e,["_query","filter"],r),{}}(0,o,e)),e}function Co(t,n,e){const o=l(n,["validationDataset"]);void 0!==e&&null!=o&&s(e,["supervisedTuningSpec"],function(t,n){const e={},o=l(n,["gcsUri"]);return null!=o&&s(e,["validationDatasetUri"],o),e}(0,o));const i=l(n,["tunedModelDisplayName"]);void 0!==e&&null!=i&&s(e,["tunedModelDisplayName"],i);const r=l(n,["description"]);void 0!==e&&null!=r&&s(e,["description"],r);const a=l(n,["epochCount"]);void 0!==e&&null!=a&&s(e,["supervisedTuningSpec","hyperParameters","epochCount"],a);const u=l(n,["learningRateMultiplier"]);void 0!==e&&null!=u&&s(e,["supervisedTuningSpec","hyperParameters","learningRateMultiplier"],u);const c=l(n,["exportLastCheckpointOnly"]);void 0!==e&&null!=c&&s(e,["supervisedTuningSpec","exportLastCheckpointOnly"],c);const d=l(n,["adapterSize"]);if(void 0!==e&&null!=d&&s(e,["supervisedTuningSpec","hyperParameters","adapterSize"],d),void 0!==l(n,["batchSize"]))throw new Error("batchSize parameter is not supported in Vertex AI.");if(void 0!==l(n,["learningRate"]))throw new Error("learningRate parameter is not supported in Vertex AI.");return {}}function To(t,n){const e={},o=l(n,["baseModel"]);null!=o&&s(e,["baseModel"],o);const i=l(n,["trainingDataset"]);null!=i&&s(e,["supervisedTuningSpec","trainingDatasetUri"],function(t,n,e){const o=l(n,["gcsUri"]);if(void 0!==e&&null!=o&&s(e,["supervisedTuningSpec","trainingDatasetUri"],o),void 0!==l(n,["examples"]))throw new Error("examples parameter is not supported in Vertex AI.");return {}}(0,i,e));const r=l(n,["config"]);return null!=r&&s(e,["config"],Co(0,r,e)),e}function Io(t,n){const e={},o=l(n,["name"]);null!=o&&s(e,["name"],o);const i=l(n,["state"]);null!=i&&s(e,["state"],A(0,i));const r=l(n,["createTime"]);null!=r&&s(e,["createTime"],r);const a=l(n,["tuningTask","startTime"]);null!=a&&s(e,["startTime"],a);const u=l(n,["tuningTask","completeTime"]);null!=u&&s(e,["endTime"],u);const c=l(n,["updateTime"]);null!=c&&s(e,["updateTime"],c);const d=l(n,["description"]);null!=d&&s(e,["description"],d);const p=l(n,["baseModel"]);null!=p&&s(e,["baseModel"],p);const f=l(n,["_self"]);null!=f&&s(e,["tunedModel"],function(t,n){const e={},o=l(n,["name"]);null!=o&&s(e,["model"],o);const i=l(n,["name"]);return null!=i&&s(e,["endpoint"],i),e}(0,f));const h=l(n,["distillationSpec"]);null!=h&&s(e,["distillationSpec"],h);const g=l(n,["experiment"]);null!=g&&s(e,["experiment"],g);const m=l(n,["labels"]);null!=m&&s(e,["labels"],m);const y=l(n,["pipelineJob"]);null!=y&&s(e,["pipelineJob"],y);const v=l(n,["tunedModelDisplayName"]);return null!=v&&s(e,["tunedModelDisplayName"],v),e}function _o(t,n){const e={},o=l(n,["model"]);null!=o&&s(e,["model"],o);const i=l(n,["endpoint"]);null!=i&&s(e,["endpoint"],i);const r=l(n,["checkpoints"]);if(null!=r){let t=r;Array.isArray(t)&&(t=t.map((t=>function(t,n){const e={},o=l(n,["checkpointId"]);null!=o&&s(e,["checkpointId"],o);const i=l(n,["epoch"]);null!=i&&s(e,["epoch"],i);const r=l(n,["step"]);null!=r&&s(e,["step"],r);const a=l(n,["endpoint"]);return null!=a&&s(e,["endpoint"],a),e}(0,t)))),s(e,["checkpoints"],t);}return e}function Oo(t,n){const e={},o=l(n,["name"]);null!=o&&s(e,["name"],o);const i=l(n,["state"]);null!=i&&s(e,["state"],A(0,i));const r=l(n,["createTime"]);null!=r&&s(e,["createTime"],r);const a=l(n,["startTime"]);null!=a&&s(e,["startTime"],a);const u=l(n,["endTime"]);null!=u&&s(e,["endTime"],u);const c=l(n,["updateTime"]);null!=c&&s(e,["updateTime"],c);const d=l(n,["error"]);null!=d&&s(e,["error"],d);const p=l(n,["description"]);null!=p&&s(e,["description"],p);const f=l(n,["baseModel"]);null!=f&&s(e,["baseModel"],f);const h=l(n,["tunedModel"]);null!=h&&s(e,["tunedModel"],_o(0,h));const g=l(n,["supervisedTuningSpec"]);null!=g&&s(e,["supervisedTuningSpec"],g);const m=l(n,["tuningDataStats"]);null!=m&&s(e,["tuningDataStats"],m);const y=l(n,["encryptionSpec"]);null!=y&&s(e,["encryptionSpec"],y);const v=l(n,["partnerModelTuningSpec"]);null!=v&&s(e,["partnerModelTuningSpec"],v);const E=l(n,["distillationSpec"]);null!=E&&s(e,["distillationSpec"],E);const C=l(n,["experiment"]);null!=C&&s(e,["experiment"],C);const T=l(n,["labels"]);null!=T&&s(e,["labels"],T);const I=l(n,["pipelineJob"]);null!=I&&s(e,["pipelineJob"],I);const _=l(n,["tunedModelDisplayName"]);return null!=_&&s(e,["tunedModelDisplayName"],_),e}
/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
class Ao extends i{constructor(t){super(),this.apiClient=t,this.get=async t=>await this.getInternal(t),this.list=async(t={})=>new Nt($.PAGED_ITEM_TUNING_JOBS,(t=>this.listInternal(t)),await this.listInternal(t),t),this.tune=async t=>{if(this.apiClient.isVertexAI())return await this.tuneInternal(t);{const n=await this.tuneMldevInternal(t);let e="";void 0!==n.metadata&&void 0!==n.metadata.tunedModel?e=n.metadata.tunedModel:void 0!==n.name&&n.name.includes("/operations/")&&(e=n.name.split("/operations/")[0]);return {name:e,state:dt.JOB_STATE_QUEUED}}};}async getInternal(t){var n,e,o,i;let a,u="",c={};if(this.apiClient.isVertexAI()){const o=function(t,n){const e={},o=l(n,["name"]);null!=o&&s(e,["_url","name"],o);const i=l(n,["config"]);return null!=i&&s(e,["config"],i),e}(this.apiClient,t);return u=r("{name}",o._url),c=o._query,delete o.config,delete o._url,delete o._query,a=this.apiClient.request({path:u,queryParams:c,body:JSON.stringify(o),httpMethod:"GET",httpOptions:null===(n=t.config)||void 0===n?void 0:n.httpOptions,abortSignal:null===(e=t.config)||void 0===e?void 0:e.abortSignal}).then((t=>t.json())),a.then((t=>Oo(this.apiClient,t)))}{const n=function(t,n){const e={},o=l(n,["name"]);null!=o&&s(e,["_url","name"],o);const i=l(n,["config"]);return null!=i&&s(e,["config"],i),e}(this.apiClient,t);return u=r("{name}",n._url),c=n._query,delete n.config,delete n._url,delete n._query,a=this.apiClient.request({path:u,queryParams:c,body:JSON.stringify(n),httpMethod:"GET",httpOptions:null===(o=t.config)||void 0===o?void 0:o.httpOptions,abortSignal:null===(i=t.config)||void 0===i?void 0:i.abortSignal}).then((t=>t.json())),a.then((t=>Io(this.apiClient,t)))}}async listInternal(t){var n,e,o,i;let a,u="",c={};if(this.apiClient.isVertexAI()){const o=Eo(this.apiClient,t);return u=r("tuningJobs",o._url),c=o._query,delete o.config,delete o._url,delete o._query,a=this.apiClient.request({path:u,queryParams:c,body:JSON.stringify(o),httpMethod:"GET",httpOptions:null===(n=t.config)||void 0===n?void 0:n.httpOptions,abortSignal:null===(e=t.config)||void 0===e?void 0:e.abortSignal}).then((t=>t.json())),a.then((t=>{const n=function(t,n){const e={},o=l(n,["nextPageToken"]);null!=o&&s(e,["nextPageToken"],o);const i=l(n,["tuningJobs"]);if(null!=i){let t=i;Array.isArray(t)&&(t=t.map((t=>Oo(0,t)))),s(e,["tuningJobs"],t);}return e}(this.apiClient,t),e=new nn;return Object.assign(e,n),e}))}{const n=mo(this.apiClient,t);return u=r("tunedModels",n._url),c=n._query,delete n.config,delete n._url,delete n._query,a=this.apiClient.request({path:u,queryParams:c,body:JSON.stringify(n),httpMethod:"GET",httpOptions:null===(o=t.config)||void 0===o?void 0:o.httpOptions,abortSignal:null===(i=t.config)||void 0===i?void 0:i.abortSignal}).then((t=>t.json())),a.then((t=>{const n=function(t,n){const e={},o=l(n,["nextPageToken"]);null!=o&&s(e,["nextPageToken"],o);const i=l(n,["tunedModels"]);if(null!=i){let t=i;Array.isArray(t)&&(t=t.map((t=>Io(0,t)))),s(e,["tuningJobs"],t);}return e}(this.apiClient,t),e=new nn;return Object.assign(e,n),e}))}}async tuneInternal(t){var n,e;let o,i="",s={};if(this.apiClient.isVertexAI()){const l=To(this.apiClient,t);return i=r("tuningJobs",l._url),s=l._query,delete l.config,delete l._url,delete l._query,o=this.apiClient.request({path:i,queryParams:s,body:JSON.stringify(l),httpMethod:"POST",httpOptions:null===(n=t.config)||void 0===n?void 0:n.httpOptions,abortSignal:null===(e=t.config)||void 0===e?void 0:e.abortSignal}).then((t=>t.json())),o.then((t=>Oo(this.apiClient,t)))}throw new Error("This method is only supported by the Vertex AI.")}async tuneMldevInternal(t){var n,e;let o,i="",a={};if(this.apiClient.isVertexAI())throw new Error("This method is only supported by the Gemini Developer API.");{const u=vo(this.apiClient,t);return i=r("tunedModels",u._url),a=u._query,delete u.config,delete u._url,delete u._query,o=this.apiClient.request({path:i,queryParams:a,body:JSON.stringify(u),httpMethod:"POST",httpOptions:null===(n=t.config)||void 0===n?void 0:n.httpOptions,abortSignal:null===(e=t.config)||void 0===e?void 0:e.abortSignal}).then((t=>t.json())),o.then((t=>function(t,n){const e={},o=l(n,["name"]);null!=o&&s(e,["name"],o);const i=l(n,["metadata"]);null!=i&&s(e,["metadata"],i);const r=l(n,["done"]);null!=r&&s(e,["done"],r);const a=l(n,["error"]);return null!=a&&s(e,["error"],a),e}(this.apiClient,t)))}}}
/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */class So{async download(t,n){throw new Error("Download to file is not supported in the browser, please use a browser compliant download like an <a> tag.")}}const bo="x-goog-upload-status";function wo(t){return new Promise((n=>setTimeout(n,t)))}class Po{async upload(t,n,e){if("string"==typeof t)throw new Error("File path is not supported in browser uploader.");return await async function(t,n,e){var o,i,r;let s=0,l=0,a=new sn(new Response),u="upload";for(s=t.size;l<s;){const r=Math.min(8388608,s-l),c=t.slice(l,l+r);l+r>=s&&(u+=", finalize");let d=0,p=1e3;for(;d<3&&(a=await e.request({path:"",body:c,httpMethod:"POST",httpOptions:{apiVersion:"",baseUrl:n,headers:{"X-Goog-Upload-Command":u,"X-Goog-Upload-Offset":String(l),"Content-Length":String(r)}}}),!(null===(o=null==a?void 0:a.headers)||void 0===o?void 0:o[bo]));)d++,await wo(p),p*=2;if(l+=r,"active"!==(null===(i=null==a?void 0:a.headers)||void 0===i?void 0:i[bo]))break;if(s<=l)throw new Error("All content has been uploaded, but the upload status is not finalized.")}const c=await(null==a?void 0:a.json());if("final"!==(null===(r=null==a?void 0:a.headers)||void 0===r?void 0:r[bo]))throw new Error("Failed to upload file: Upload status is not finalized.");return c.file}(t,n,e)}async stat(t){if("string"==typeof t)throw new Error("File path is not supported in browser uploader.");return await async function(t){return {size:t.size,type:t.type}}(t)}}
/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */class No{create(t,n,e){return new Do(t,n,e)}}class Do{constructor(t,n,e){this.url=t,this.headers=n,this.callbacks=e;}connect(){this.ws=new WebSocket(this.url),this.ws.onopen=this.callbacks.onopen,this.ws.onerror=this.callbacks.onerror,this.ws.onclose=this.callbacks.onclose,this.ws.onmessage=this.callbacks.onmessage;}send(t){if(void 0===this.ws)throw new Error("WebSocket is not connected");this.ws.send(t);}close(){if(void 0===this.ws)throw new Error("WebSocket is not connected");this.ws.close();}}
/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */const Ro="x-goog-api-key";class Mo{constructor(t){this.apiKey=t;}async addAuthHeaders(t){null===t.get(Ro)&&t.append(Ro,this.apiKey);}}
/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */class xo{constructor(t){var n;if(null==t.apiKey)throw new Error("An API Key must be set when running in a browser");if(t.project||t.location)throw new Error("Vertex AI project based authentication is not supported on browser runtimes. Please do not provide a project or location.");this.vertexai=null!==(n=t.vertexai)&&void 0!==n&&n,this.apiKey=t.apiKey;const e=o(t,void 0,void 0);e&&(t.httpOptions?t.httpOptions.baseUrl=e:t.httpOptions={baseUrl:e}),this.apiVersion=t.apiVersion;const i=new Mo(this.apiKey);this.apiClient=new ho({auth:i,apiVersion:this.apiVersion,apiKey:this.apiKey,vertexai:this.vertexai,httpOptions:t.httpOptions,userAgentExtra:"gl-node/web",uploader:new Po,downloader:new So}),this.models=new io(this.apiClient),this.live=new no(this.apiClient,i,new No),this.chats=new An(this.models,this.apiClient),this.caches=new vn(this.apiClient),this.files=new Nn(this.apiClient),this.operations=new uo(this.apiClient),this.tunings=new Ao(this.apiClient);}}

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
        this._genAI = new xo({ apiKey });
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
                systemInstruction: this._getSystemInstruction(previousMessages, promptData),
                responseModalities: [ut.TEXT]
            }
        });
        return this._chat.sendMessageStream({ message: request });
    }
    async isSensitiveContent(messages) {
        const request = await this._getSensitiveContentPrompt(messages);
        if (!request.length || request.every((item) => typeof item === "string")) {
            return undefined;
        }
        const schema = {
            type: ot.OBJECT,
            properties: {
                isEmetophobia: { type: ot.BOOLEAN },
                isArachnophobia: { type: ot.BOOLEAN },
                isEpileptic: { type: ot.BOOLEAN },
                isSexual: { type: ot.BOOLEAN }
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
                        mediasPrompt.push(qt(convertArrayBufferToBase64(buffer), media.mimeType));
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
        while (messagesFiles.some((messageFiles) => messageFiles.files.some((file) => file.state === _t.PROCESSING))) {
            for (const messageFiles of messagesFiles) {
                for (let i = 0; i < messageFiles.files.length; i++) {
                    const file = messageFiles.files[i];
                    if (file.name && !verifiedFiles.has(file.name)) {
                        if (file.state === _t.PROCESSING) {
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
            dataPart: messageFiles.files.filter((file) => file.state === _t.ACTIVE && file.uri && file.mimeType).map((file) => Rt(file.uri, file.mimeType))
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
