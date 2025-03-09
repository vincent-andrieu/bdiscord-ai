import { isAudioMimeType, isImageMimeType, isVideoMimeType } from "./medias";
import {
    Audio,
    DiscordChannelMessages,
    DiscordMessage,
    GuildMemberStore,
    Image,
    LogLevel,
    Message,
    MessageActions,
    MessageStore,
    ReadStateStore,
    SelectedChannelStore,
    SelectedGuildStore,
    Video
} from "./types";
import { convertTimestampToUnix, getOldestId } from "./utils";

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
                messages: this._mapMessages(unreadMessages)
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

    private _mapMessages(messages: Array<DiscordMessage>): Array<Message> {
        const guildId = this._selectedGuildStore.getGuildId();

        return messages.map((message) => {
            const member = this._guildMemberStore.getMember(guildId, message.author.id);
            const images: Array<Image> = [];
            const videos: Array<Video> = [];
            const audios: Array<Audio> = [];

            // Add attachments
            message.attachments?.forEach((attachment) => {
                if (isImageMimeType(attachment.content_type)) {
                    images.push({
                        name: attachment.url,
                        url: attachment.url,
                        mimeType: attachment.content_type,
                        size: attachment.size
                    });
                } else if (isVideoMimeType(attachment.content_type)) {
                    videos.push({
                        name: attachment.url,
                        url: attachment.url,
                        mimeType: attachment.content_type,
                        size: attachment.size
                    });
                } else if (isAudioMimeType(attachment.content_type)) {
                    audios.push({
                        name: attachment.url,
                        url: attachment.url,
                        mimeType: attachment.content_type,
                        size: attachment.size
                    });
                }
            });

            // Add embeds
            message.embeds?.forEach((embed) => {
                if (embed.type === "image" && embed.image) {
                    const url = embed.image.proxyURL || embed.image.url;
                    const extension = url.split(".").pop();
                    const mimeType = extension ? `image/${extension}` : undefined;

                    images.push({
                        name: url,
                        mimeType: mimeType && isImageMimeType(mimeType) ? mimeType : undefined,
                        url: url
                    });
                } else if (embed.type === "video" && embed.video) {
                    const url = embed.video.proxyURL || embed.video.url;
                    const extension = url.split(".").pop();
                    const mimeType = extension ? `video/${extension}` : undefined;

                    videos.push({
                        name: url,
                        mimeType: mimeType && isVideoMimeType(mimeType) ? mimeType : undefined,
                        url: url
                    });
                }
            });

            return {
                id: message.id,
                author: {
                    username: `<@${message.author.id}>`,
                    roles: member?.roles.map((roleId) => `<@&${roleId}>`) || []
                },
                content: message.content,
                images,
                videos,
                audios,
                date: convertTimestampToUnix(message.timestamp)
            };
        });
    }
}
