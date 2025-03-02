import { DiscordChannelMessages, DiscordUser } from "./discord";

export type UserStore = {
    getUser: (userId: string) => DiscordUser;
};

export type MessageStore = {
    getMessages(channelId: string): DiscordChannelMessages;
};
