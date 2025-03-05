import { DiscordChannel, DiscordChannelMessages, DiscordEmoji, DiscordGuild, DiscordGuildMember, DiscordRole, DiscordUser } from "./discord";

export type UserStore = {
    getUser: (userId: string) => DiscordUser;
    getCurrentUser: () => DiscordUser;
};

export type ChannelStore = {
    addChangeListener: (listener: Function) => void;
    addConditionalChangeListener: (listener: Function) => void;
    addReactChangeListener: (listener: Function) => void;
    getChannel: (channelId: string) => DiscordChannel;
    getMutableGuildChannelsForGuild: (guildId: string) => { [key: string]: DiscordChannel };
    removeChangeListener: (listener: Function) => void;
    removeReactChangeListener: (listener: Function) => void;
    getAllThreadsForParent: (parentId: string) => DiscordChannel[];
    getBasicChannel: (channelId: string) => DiscordChannel;
    getChannelIds: (guildId: string) => string[];
    getDMChannelFromUserId: (userId: string) => DiscordChannel;
    getDMFromUserId: (userId: string) => DiscordChannel;
    getDMUserIds: () => string[];
    getDebugInfo: () => any;
    getGuildChannelsVersion: (guildId: string) => number;
    getInitialOverlayState: () => any;
    getMutableBasicGuildChannelsForGuild: (guildId: string) => { [key: string]: DiscordChannel };
    getMutableDMsByUserIds: () => { [key: string]: DiscordChannel };
    getMutablePrivateChannels: () => { [key: string]: DiscordChannel };
    getPrivateChannelsVersion: () => number;
    getSortedPrivateChannels: () => DiscordChannel[];
    hasChannel: (channelId: string) => boolean;
    initialize: () => void;
    loadAllGuildAndPrivateChannelsFromDisk: () => Promise<void>;
};

export type SelectedChannelStore = {
    getChannelId(): string;
    getVoiceChannelId(): string;
    getMostRecentSelectedTextChannelId(): string;
    getCurrentlySelectedChannelId(): string | undefined;
    getLastSelectedChannelId(): string;
    getLastSelectedChannels(): string[];
    getLastChannelFollowingDestination(): string;
};

export type MessageStore = {
    getMessages(channelId: string): DiscordChannelMessages;
};

export type GuildMemberStore = {
    getMember(guildId: string, userId: string): DiscordGuildMember | undefined;
};

export type GuildStore = {
    getGuild(guildId: string): DiscordGuild;
    getRole(guildId: string, roleId: string): DiscordRole;
};

export type SelectedGuildStore = {
    getGuildId(): string;
};

export type EmojiStore = {
    getCustomEmojiById(emojiId: string): DiscordEmoji | undefined;
};
