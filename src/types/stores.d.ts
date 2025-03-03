import { DiscordChannelMessages, DiscordEmoji, DiscordGuildMember, DiscordUser } from "./discord";

export type UserStore = {
    getUser: (userId: string) => DiscordUser;
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
    getMember: (guildId: string, userId: string) => DiscordGuildMember | undefined;
};

export type GuildStore = {
    getRole(guildId: string, roleId: string): DiscordRole;
};

export type EmojiStore = {
    getCustomEmojiById: (emojiId: string) => DiscordEmoji | undefined;
};
