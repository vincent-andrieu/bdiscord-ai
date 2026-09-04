import { LOG_PREFIX, MESSAGES_FETCH_LIMIT, MESSAGES_FETCH_MAX_PAGES } from "./constants";
import { getSetting, SETTING_SUMMARY_MIN_LENGTH } from "./settings";
import {
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
        const channelReadState = this._readStateStore.getReadStatesByChannel().get(channelId);

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
    ): Promise<{ referenceMessage: string; unreadMessages: Array<Message> }> {
        if (!channelId) throw "No channel selected";
        const channelReadState = this._readStateStore.getReadStatesByChannel().get(channelId);

        if (channelReadState?.oldestUnreadMessageId) {
            const oldestMessageId =
                getOldestId(channelReadState.oldestUnreadMessageId, channelReadState.ackMessageId) === channelReadState.oldestUnreadMessageId ||
                this._messageStore.getMessages(channelId).some((message) => message.id === channelReadState.ackMessageId)
                    ? channelReadState.oldestUnreadMessageId
                    : channelReadState.ackMessageId;
            const messages = await this._fetchAllMessages(channelId, oldestMessageId, channelReadState.lastMessageId);
            const { unreadMessages } = messages.reduce(
                (acc: { unreadMessages: Array<DiscordMessage> }, message) => {
                    if (getOldestId(message.id, oldestMessageId) === oldestMessageId) {
                        acc.unreadMessages.push(message);
                    }
                    return acc;
                },
                { unreadMessages: [] }
            ) as { unreadMessages: Array<DiscordMessage> };
            const mapMessagesStores = { selectedGuildStore: this._selectedGuildStore, guildMemberStore: this._guildMemberStore };
            const mappedUnreadMessages = mapMessages(mapMessagesStores, unreadMessages);

            return {
                referenceMessage: oldestMessageId,
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
        let messages = this._messageStore.getMessages(channelId);

        // Bounded loop: a huge unread gap must not turn into an endless chain of requests
        for (let page = 0; page < MESSAGES_FETCH_MAX_PAGES; page++) {
            const firstCurrentMessage = messages.length ? messages.first().id : undefined;

            // The last condition is a security to avoid an infinite loop if the oldest message has been deleted
            if (
                !firstCurrentMessage ||
                messages.some((message) => message.id === oldestMessage) ||
                getOldestId(firstCurrentMessage, oldestMessage) !== oldestMessage
            ) {
                return messages;
            }
            await this._messageActions.fetchMessages({ channelId, limit: MESSAGES_FETCH_LIMIT, before: firstCurrentMessage });
            messages = this._messageStore.getMessages(channelId);

            if (!messages.length || messages.first().id === firstCurrentMessage) {
                return messages;
            }
        }
        console.warn(LOG_PREFIX, `Stopped fetching after ${MESSAGES_FETCH_MAX_PAGES} pages before ${oldestMessage}`);
        return messages;
    }

    private async _fetchAllMessagesAfter(channelId: string, lastMessage: string): Promise<DiscordChannelMessages> {
        let messages = this._messageStore.getMessages(channelId);

        for (let page = 0; page < MESSAGES_FETCH_MAX_PAGES; page++) {
            const lastCurrentMessage = messages.length ? messages.last().id : undefined;

            if (
                !lastCurrentMessage ||
                messages.some((message) => message.id === lastMessage) ||
                getOldestId(lastCurrentMessage, lastMessage) !== lastCurrentMessage
            ) {
                return messages;
            }
            await this._messageActions.fetchMessages({ channelId, limit: MESSAGES_FETCH_LIMIT, after: lastCurrentMessage });
            messages = this._messageStore.getMessages(channelId);

            if (!messages.length || messages.last().id === lastCurrentMessage) {
                return messages;
            }
        }
        console.warn(LOG_PREFIX, `Stopped fetching after ${MESSAGES_FETCH_MAX_PAGES} pages after ${lastMessage}`);
        return messages;
    }
}
