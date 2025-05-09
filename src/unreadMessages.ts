import { GEMINI_VIDEOS_LIMIT } from "./constants";
import { getSetting, SETTING_SUMMARY_MIN_LENGTH } from "./settings";
import {
    ChannelReadState,
    DiscordChannelMessages,
    DiscordMessage,
    GuildMemberStore,
    Message,
    MessageActions,
    MessageStore,
    ReadStateStore,
    SelectedChannelStore,
    SelectedGuildStore
} from "./types";
import { getOldestId, mapMessages } from "./utils";

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
        private _messageActions: MessageActions
    ) {}

    public hasUnreadMessages(channelId: string | undefined = this.channelId): boolean {
        if (!channelId) return false;
        const channelReadState: ChannelReadState | undefined = this._readStateStore.getReadStatesByChannel()[channelId];

        if (channelReadState?.oldestUnreadMessageId) {
            const messages = this._messageStore.getMessages(channelId);
            const summaryMinLength = getSetting<number>(SETTING_SUMMARY_MIN_LENGTH);
            let nChar = 0;

            return messages.some((message) => {
                if (getOldestId(message.id, channelReadState.oldestUnreadMessageId || undefined) === channelReadState.oldestUnreadMessageId) {
                    nChar += message.content.length;

                    return (
                        !!message.attachments?.length ||
                        message.embeds?.some((embed) => embed.image || embed.video) ||
                        !summaryMinLength ||
                        nChar >= summaryMinLength
                    );
                }
                return false;
            });
        }
        return false;
    }

    public async getUnreadMessages(
        channelId: string | undefined = this.channelId
    ): Promise<{ referenceMessage: string; previousMessages: Array<Message>; unreadMessages: Array<Message> }> {
        if (!channelId) throw "No channel selected";
        const channelReadState: ChannelReadState | undefined = this._readStateStore.getReadStatesByChannel()[channelId];

        if (channelReadState?.oldestUnreadMessageId) {
            const oldestMessageId =
                getOldestId(channelReadState.oldestUnreadMessageId, channelReadState.ackMessageId) === channelReadState.oldestUnreadMessageId ||
                this._messageStore.getMessages(channelId).some((message) => message.id === channelReadState.ackMessageId)
                    ? channelReadState.oldestUnreadMessageId
                    : channelReadState.ackMessageId;
            const messages = await this._fetchAllMessages(channelId, oldestMessageId, channelReadState.lastMessageId);
            const { previousMessages, unreadMessages } = messages.reduce(
                (acc: { previousMessages: Array<DiscordMessage>; unreadMessages: Array<DiscordMessage> }, message) => {
                    if (getOldestId(message.id, oldestMessageId) === oldestMessageId) {
                        acc.unreadMessages.push(message);
                    } else {
                        acc.previousMessages.push(message);
                    }
                    return acc;
                },
                { previousMessages: [], unreadMessages: [] }
            ) as { previousMessages: Array<DiscordMessage>; unreadMessages: Array<DiscordMessage> };
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

    private async _fetchAllMessages(channelId: string, oldestMessage: string, latestMessage: string): Promise<DiscordChannelMessages> {
        await this._fetchAllMessagesBefore(channelId, oldestMessage);
        return this._fetchAllMessagesAfter(channelId, latestMessage);
    }

    private async _fetchAllMessagesBefore(channelId: string, oldestMessage: string): Promise<DiscordChannelMessages> {
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

    private async _fetchAllMessagesAfter(channelId: string, lastMessage: string): Promise<DiscordChannelMessages> {
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
