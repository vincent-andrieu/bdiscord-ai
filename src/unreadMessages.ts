import {
    DiscordChannelMessages,
    DiscordMessage,
    GuildMemberStore,
    LogLevel,
    Message,
    MessageActions,
    MessageStore,
    SelectedChannelStore,
    SelectedGuildStore
} from "./types";
import { convertTimestampToUnix, getOldestId } from "./utils";

const HAS_UNREAD_MIN_CHAR = 300;

export class UnreadMessage {
    private _readStateStore = BdApi.Webpack.getStore("ReadStateStore");
    private _messageStore = BdApi.Webpack.getStore<MessageStore>("MessageStore");

    get channelId(): string | undefined {
        return this._selectedChannelStore.getCurrentlySelectedChannelId();
    }

    constructor(
        private _selectedGuildStore: SelectedGuildStore,
        private _guildMemberStore: GuildMemberStore,
        private _selectedChannelStore: SelectedChannelStore,
        private _messageActions: MessageActions,
        private _log: (message: string, type: LogLevel) => void
    ) {}

    public hasUnreadMessages(channelId?: string): boolean {
        if (!channelId) channelId = this.channelId;
        if (!channelId) return false;
        const channelReadState = this._readStateStore.getReadStatesByChannel()[channelId];

        if (channelReadState.oldestUnreadMessageId) {
            const messages = this._messageStore.getMessages(channelId);
            let nChar = 0;

            return messages.some((message) => {
                if (getOldestId(message.id, channelReadState.oldestUnreadMessageId) === channelReadState.oldestUnreadMessageId) {
                    nChar += message.content.length;

                    return nChar >= HAS_UNREAD_MIN_CHAR;
                }
                return false;
            });
        }
        return false;
    }

    public async getUnreadMessages(): Promise<Array<Message>> {
        const channelId = this.channelId;
        if (!channelId) return [];
        const channelReadState = this._readStateStore.getReadStatesByChannel()[channelId];

        if (channelReadState.oldestUnreadMessageId) {
            const oldestMessageId = getOldestId(channelReadState.oldestUnreadMessageId, channelReadState.ackMessageId);
            const messages = await this._fetchAllMessages(channelId, oldestMessageId);
            const unreadMessages = messages.filter((message) => getOldestId(message.id, oldestMessageId) === oldestMessageId);

            return this._mapMessages(unreadMessages);
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
        await this._messageActions.fetchMessages({ channelId, limit: 100, before: beforeMessage });
    }

    private _mapMessages(messages: Array<DiscordMessage>): Array<Message> {
        const guildId = this._selectedGuildStore.getGuildId();

        return messages.map((message) => {
            const member = this._guildMemberStore.getMember(guildId, message.author.id);

            return {
                id: message.id,
                author: {
                    username: `<@${message.author.id}>`,
                    roles: member?.roles.map((roleId) => `<@&${roleId}>`) || []
                },
                content: message.content,
                date: convertTimestampToUnix(message.timestamp)
            };
        });
    }
}
