import { getConfig } from "./settings";

export const LOG_PREFIX = `[${getConfig().name}]`;
export const GEMINI_VIDEOS_LIMIT = 10;
export const PLUGIN_FILE_NAME = "bdiscord-ai.plugin.js";
export const GITHUB_BRANCH = "main";
export const GITHUB_SOURCE = `https://raw.githubusercontent.com/vincent-andrieu/bdiscord-ai/refs/heads/${GITHUB_BRANCH}/build/${PLUGIN_FILE_NAME}`;

export const imageMimeTypes = ["image/png", "image/jpeg", "image/webp", "image/heic", "image/heif"] as const;
export type ImageMimeType = (typeof imageMimeTypes)[number];

export const videoMimeTypes = [
    "video/mp4",
    "video/mpeg",
    "video/mov",
    "video/avi",
    "video/x-flv",
    "video/mpg",
    "video/webm",
    "video/wmv",
    "video/3gpp"
] as const;
export type VideoMimeType = (typeof videoMimeTypes)[number];

export const audioMimeTypes = ["audio/wav", "audio/mp3", "audio/aiff", "audio/aac", "audio/ogg", "audio/flac"] as const;
export type AudioMimeType = (typeof audioMimeTypes)[number];

export enum DiscordMessageType {
    DEFAULT = 0,
    RECIPIENT_ADD = 1,
    RECIPIENT_REMOVE = 2,
    CALL = 3,
    CHANNEL_NAME_CHANGE = 4,
    CHANNEL_ICON_CHANGE = 5,
    CHANNEL_PINNED_MESSAGE = 6,
    USER_JOIN = 7,
    GUILD_BOOST = 8,
    GUILD_BOOST_TIER_1 = 9,
    GUILD_BOOST_TIER_2 = 10,
    GUILD_BOOST_TIER_3 = 11,
    CHANNEL_FOLLOW_ADD = 12,
    GUILD_STREAM = 13,
    GUILD_DISCOVERY_DISQUALIFIED = 14,
    GUILD_DISCOVERY_REQUALIFIED = 15,
    GUILD_DISCOVERY_GRACE_PERIOD_INITIAL_WARNING = 16,
    GUILD_DISCOVERY_GRACE_PERIOD_FINAL_WARNING = 17,
    THREAD_CREATED = 18,
    REPLY = 19,
    CHAT_INPUT_COMMAND = 20,
    THREAD_STARTER_MESSAGE = 21,
    GUILD_INVITE_REMINDER = 22,
    CONTEXT_MENU_COMMAND = 23,
    AUTO_MODERATION_ACTION = 24,
    ROLE_SUBSCRIPTION_PURCHASE = 25,
    INTERACTION_PREMIUM_UPSELL = 26,
    STAGE_START = 27,
    STAGE_END = 28,
    STAGE_SPEAKER = 29,
    STAGE_RAISE_HAND = 30,
    STAGE_TOPIC = 31,
    GUILD_APPLICATION_PREMIUM_SUBSCRIPTION = 32,
    PRIVATE_CHANNEL_INTEGRATION_ADDED = 33,
    PRIVATE_CHANNEL_INTEGRATION_REMOVED = 34,
    PREMIUM_REFERRAL = 35,
    GUILD_INCIDENT_ALERT_MODE_ENABLED = 36,
    GUILD_INCIDENT_ALERT_MODE_DISABLED = 37,
    GUILD_INCIDENT_REPORT_RAID = 38,
    GUILD_INCIDENT_REPORT_FALSE_ALARM = 39,
    GUILD_DEADCHAT_REVIVE_PROMPT = 40,
    CUSTOM_GIFT = 41,
    GUILD_GAMING_STATS_PROMPT = 42,
    PURCHASE_NOTIFICATION = 44,
    VOICE_HANGOUT_INVITE = 45,
    POLL_RESULT = 46,
    CHANGELOG = 47,
    NITRO_NOTIFICATION = 48,
    CHANNEL_LINKED_TO_LOBBY = 49,
    GIFTING_PROMPT = 50,
    IN_GAME_MESSAGE_NUX = 51,
    GUILD_JOIN_REQUEST_ACCEPT_NOTIFICATION = 52,
    GUILD_JOIN_REQUEST_REJECT_NOTIFICATION = 53,
    GUILD_JOIN_REQUEST_WITHDRAWN_NOTIFICATION = 54,
    HD_STREAMING_UPGRADED = 55
}

export enum DiscordMessageFlags {
    DEFAULT = 0,
    CROSSPOSTED = 1,
    IS_CROSSPOST = 2,
    SUPPRESS_EMBEDS = 4,
    SOURCE_MESSAGE_DELETED = 8,
    URGENT = 16,
    HAS_THREAD = 32,
    EPHEMERAL = 64,
    LOADING = 128,
    FAILED_TO_MENTION_SOME_ROLES_IN_THREAD = 256,
    GUILD_FEED_HIDDEN = 512,
    SHOULD_SHOW_LINK_NOT_DISCORD_WARNING = 1024,
    SUPPRESS_NOTIFICATIONS = 4096,
    IS_VOICE_MESSAGE = 8192,
    HAS_SNAPSHOT = 16384,
    IS_COMPONENTS_V2 = 32768,
    SENT_BY_SOCIAL_LAYER_INTEGRATION = 65536
}

export enum DiscordMessageState {
    SENT = "SENT",
    SENDING = "SENDING",
    SEND_FAILED = "SEND_FAILED"
}

export enum DiscordMessageComponentStyle {
    PRIMARY = 1,
    SECONDARY = 2,
    SUCCESS = 3,
    DESTRUCTIVE = 4,
    LINK = 5,
    PREMIUM = 6
}

export enum DiscordComponentVisualState {
    NORMAL = 0,
    LOADING = 1,
    DISABLED = 2
}
