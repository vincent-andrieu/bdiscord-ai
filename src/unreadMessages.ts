import {
    DiscordChannelMessages,
    GuildMemberStore,
    LogLevel,
    Message,
    MessageActions,
    MessageStore,
    ReadStateStore,
    SelectedChannelStore,
    SelectedGuildStore
} from "./types";
import { getOldestId, mapMessages } from "./utils";

const HAS_UNREAD_MIN_CHAR = 300;

export class UnreadMessage {
    get channelId(): string | undefined {
        return this._selectedChannelStore.getCurrentlySelectedChannelId();
    }

    constructor(
        private _selectedGuildStore: SelectedGuildStore,
        private _guildMemberStore: GuildMemberStore,
        private _selectedChannelStore: SelectedChannelStore,
        private _readStateStore: ReadStateStore,
        private _messageStore: MessageStore,
        private _messageActions: MessageActions,
        private _log: (message: string, type: LogLevel) => void
    ) {}

    public hasUnreadMessages(channelId: string | undefined = this.channelId): boolean {
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

    public async getUnreadMessages(channelId: string | undefined = this.channelId): Promise<{ referenceMessage: string; messages: Array<Message> }> {
        if (!channelId) throw "No channel selected";
        const channelReadState = this._readStateStore.getReadStatesByChannel()[channelId];

        if (channelReadState.oldestUnreadMessageId) {
            const oldestMessageId =
                getOldestId(channelReadState.oldestUnreadMessageId, channelReadState.ackMessageId) === channelReadState.oldestUnreadMessageId ||
                this._messageStore.getMessages(channelId).some((message) => message.id === channelReadState.ackMessageId)
                    ? channelReadState.oldestUnreadMessageId
                    : channelReadState.ackMessageId;
            const messages = await this._fetchAllMessages(channelId, oldestMessageId);
            const unreadMessages = messages.filter((message) => getOldestId(message.id, oldestMessageId) === oldestMessageId);

            return {
                referenceMessage: oldestMessageId,
                messages: mapMessages(
                    {
                        selectedGuildStore: this._selectedGuildStore,
                        guildMemberStore: this._guildMemberStore
                    },
                    unreadMessages
                )
            };
        }
        throw "No unread messages";
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
}
