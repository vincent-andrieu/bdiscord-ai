import { LogLevel, Message } from "./types";
import { DiscordChannelMessages } from "./types/discord";
import { MessageStore, UserStore } from "./types/stores";
import { getOldestId } from "./utils";

export class UnreadMessage {
    private _selectedChannelStore = BdApi.Webpack.getStore("SelectedChannelStore");
    private _readStateStore = BdApi.Webpack.getStore("ReadStateStore");
    private _messageStore: MessageStore = BdApi.Webpack.getStore("MessageStore");
    private _selectedGuildStore = BdApi.Webpack.getStore("SelectedGuildStore");
    private _guildMemberStore = BdApi.Webpack.getStore("GuildMemberStore");
    private _userStore: UserStore = BdApi.Webpack.getStore("UserStore");

    get channelId(): string {
        return this._selectedChannelStore.getChannelId();
    }

    constructor(private _log: (message: string, type: LogLevel) => void) {}

    public hasUnreadMessages(): boolean {
        const channelReadState = this._readStateStore.getReadStatesByChannel()[this.channelId];

        return !!channelReadState.oldestUnreadMessageId;
    }

    public async getUnreadMessages(): Promise<Array<Message>> {
        const channelId = this.channelId;
        const channelReadState = this._readStateStore.getReadStatesByChannel()[channelId];

        if (channelReadState.oldestUnreadMessageId) {
            const oldestMessageId = getOldestId(channelReadState.oldestUnreadMessageId, channelReadState.ackMessageId);
            const messages = await this._fetchAllMessages(channelId, oldestMessageId);
            const unreadMessages = messages.filter((message) => getOldestId(message.id, oldestMessageId) === oldestMessageId);
            const guildMembersNicks: Record<string, string> = {};

            return unreadMessages.map((message) => {
                if (!guildMembersNicks[message.author.id]) {
                    guildMembersNicks[message.author.id] = this._getUserNickname(message.author.id);
                }

                return {
                    author: {
                        id: message.author.id,
                        username: guildMembersNicks[message.author.id] || message.author.username
                    },
                    content: message.content
                };
            });
        }
        return [];
    }

    private async _fetchAllMessages(channelId: string, oldestMessage: string): Promise<DiscordChannelMessages> {
        const messages = this._messageStore.getMessages(channelId);
        const firstMessage = messages.first().id;

        // The second condition is a security to avoid infinite loop if the oldest message has been deleted
        if (!messages.some((message) => message.id === oldestMessage) && getOldestId(firstMessage, oldestMessage) === oldestMessage) {
            await this._fetchMoreMessages(channelId, firstMessage);
            const newMessages = this._messageStore.getMessages(channelId);

            if (newMessages.first().id === firstMessage) {
                this._log("Fail to fetch all messages, loop avoided", "warn");
                return messages;
            }
            return this._fetchAllMessages(channelId, oldestMessage);
        }
        return messages;
    }

    private async _fetchMoreMessages(channelId: string, beforeMessage: string): Promise<void> {
        const MessageActions = BdApi.Webpack.getByKeys("jumpToMessage", "_sendMessage");

        await MessageActions.fetchMessages({ channelId, limit: 100, before: beforeMessage });
    }

    private _getUserNickname(userId: string): string {
        const member = this._guildMemberStore.getMember(this._selectedGuildStore.getGuildId(), userId);

        if (member?.nick) {
            return member.nick;
        }

        const user = this._userStore.getUser(userId);
        return user.globalName || user.username || userId;
    }
}
