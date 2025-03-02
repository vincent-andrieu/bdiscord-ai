import { DiscordChannelMessages, DiscordUser } from "./discord";

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
