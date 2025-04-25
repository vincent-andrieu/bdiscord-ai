import { DiscordMessageFlags, DiscordMessageState, DiscordMessageType, GEMINI_VIDEOS_LIMIT } from "./constants";
import { isAudioMimeType, isImageMimeType, isVideoMimeType } from "./medias";
import { Audio, DiscordMessage, DiscordMessageComponent, DiscordUser, GuildMemberStore, Image, Message, SelectedGuildStore, Video } from "./types";

export function getOldestId(a: string | undefined, b: string): string;
export function getOldestId(a: string, b?: string): string;
export function getOldestId(a: string, b: string): string;
export function getOldestId(a?: string, b?: string): string | undefined;
export function getOldestId(a?: string, b?: string): string | undefined {
    if (!a && !b) {
        return undefined;
    }

    if (!a) {
        return b;
    }
    if (!b) {
        return a;
    }
    if (a.length === b.length) {
        return a < b ? a : b;
    }
    return a.length < b.length ? a : b;
}

export function convertTimestampToUnix(timestamp: Date | string | number): number {
    return Math.floor(new Date(timestamp).getTime() / 1000);
}

export function convertArrayBufferToBase64(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer);
    let binary = "";
    const chunk = 1024;

    for (let i = 0; i < bytes.length; i += chunk) {
        const slice = bytes.subarray(i, i + chunk);
        binary += String.fromCharCode.apply(null, Array.from(slice));
    }
    return btoa(binary);
}

export function convertBase64ToArrayBuffer(base64: string): ArrayBuffer {
    const binaryString = atob(base64);
    const bytes = new Uint8Array(binaryString.length);

    for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
}

export function generateMessageId(previousMessageId: string): string {
    return (BigInt(previousMessageId) + BigInt(1)).toString();
}

export function createMessage({
    guildId,
    channelId,
    previousMessageId,
    id = previousMessageId ? generateMessageId(previousMessageId) : undefined,
    author,
    content,
    flags = DiscordMessageFlags.DEFAULT,
    reply,
    components
}: {
    guildId: string;
    channelId: string;
    previousMessageId?: string;
    id?: string;
    author: DiscordUser;
    content: string;
    flags: DiscordMessageFlags;
    reply?: DiscordMessage;
    components?: Array<DiscordMessageComponent>;
}): DiscordMessage {
    if (!id) {
        throw new Error("Either id or previousMessageId must be provided");
    }
    const messageReference = reply
        ? {
              guild_id: guildId,
              channel_id: channelId,
              message_id: reply.id,
              type: 0
          }
        : undefined;
    return {
        id,
        author,
        blocked: false,
        bot: false,
        channel_id: channelId,
        components: components?.length
            ? [
                  {
                      components: components,
                      id: "0",
                      type: 1
                  }
              ]
            : undefined,
        content: content,
        flags: flags,
        ignored: false,
        isSearchHit: false,
        isUnsupported: false,
        mentionChannels: [],
        mentionEveryone: false,
        mentionRoles: [],
        mentioned: false,
        mentions: [],
        messageReference: messageReference,
        message_reference: messageReference,
        referenced_message: reply,
        nonce: null,
        pinned: false,
        reactions: [],
        state: DiscordMessageState.SENT,
        timestamp: new Date().toISOString(),
        tts: false,
        type: reply ? DiscordMessageType.REPLY : DiscordMessageType.DEFAULT
    };
}

export function mapMessages(
    stores: {
        selectedGuildStore: SelectedGuildStore;
        guildMemberStore: GuildMemberStore;
    },
    messages: Array<DiscordMessage>,
    maxVideos: number = GEMINI_VIDEOS_LIMIT
): Array<Message> {
    const guildId = stores.selectedGuildStore.getGuildId();
    let countVideos = 0;

    const addImage = (url: string): Image => {
        const extension = url.split(".").pop();
        const mimeType = extension ? `image/${extension}` : undefined;

        return {
            name: url,
            mimeType: mimeType && isImageMimeType(mimeType) ? mimeType : undefined,
            url: url
        };
    };

    const mappedMessages = messages.map((message) => {
        const member = stores.guildMemberStore.getMember(guildId, message.author.id);
        const images: Array<Image> = [];
        const videos: Array<Video> = [];
        const audios: Array<Audio> = [];

        // Add attachments
        message.attachments?.forEach((attachment) => {
            if (isImageMimeType(attachment.content_type)) {
                images.push({
                    name: attachment.proxy_url,
                    url: attachment.proxy_url,
                    mimeType: attachment.content_type,
                    size: attachment.size
                });
            } else if (isVideoMimeType(attachment.content_type)) {
                videos.push({
                    name: attachment.proxy_url,
                    url: attachment.proxy_url,
                    mimeType: attachment.content_type,
                    size: attachment.size
                });
            } else if (isAudioMimeType(attachment.content_type)) {
                audios.push({
                    name: attachment.proxy_url,
                    url: attachment.proxy_url,
                    mimeType: attachment.content_type,
                    size: attachment.size
                });
            }
        });

        // Add embeds
        message.embeds?.forEach((embed) => {
            if (embed.type === "image" && embed.image) {
                const url = embed.image.proxyURL || embed.image.proxy_url || embed.image.url;

                images.push(addImage(url));
            } else if (["video", "gifv"].includes(embed.type) && embed.video) {
                const url = embed.video.proxyURL || embed.video.proxy_url;

                if (url) {
                    const extension = url.split(".").pop();
                    const mimeType = extension ? `video/${extension}` : undefined;

                    videos.push({
                        name: url,
                        mimeType: mimeType && isVideoMimeType(mimeType) ? mimeType : undefined,
                        url: url,
                        thumbnail: embed.thumbnail.proxyURL || embed.thumbnail.proxy_url
                    });
                } else {
                    const thumbnailUrl = embed.thumbnail.proxyURL || embed.thumbnail.proxy_url;

                    if (thumbnailUrl) {
                        images.push(addImage(thumbnailUrl));
                    }
                }
            }
        });

        countVideos += videos.length;
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

    // Limit the number of videos to maxVideos
    if (countVideos > maxVideos) {
        for (const message of mappedMessages) {
            const videos: Array<Video | undefined> = message.videos;

            if (countVideos > maxVideos) {
                for (let k = 0; k < videos.length && countVideos > maxVideos; k++) {
                    const thumbnailUrl = videos[k]?.thumbnail;

                    if (thumbnailUrl) {
                        message.images.push(addImage(thumbnailUrl));
                    }
                    videos[k] = undefined;
                    countVideos--;
                }
                message.videos = videos.filter((video) => video) as Array<Video>;
            }
        }
    }
    return mappedMessages;
}
