import { DiscordMessageFlags, DiscordMessageState, DiscordMessageType } from "./constants";
import { isAudioMimeType, isImageMimeType, isVideoMimeType } from "./medias";
import { Audio, DiscordMessage, DiscordUser, GuildMemberStore, Image, Message, SelectedGuildStore, Video } from "./types";

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

export function createMessage(
    guildId: string,
    channelId: string,
    previousMessageId: string,
    author: DiscordUser,
    content: string,
    flags: DiscordMessageFlags = DiscordMessageFlags.DEFAULT,
    reply?: string
): DiscordMessage {
    return {
        id: (BigInt(previousMessageId) + BigInt(1)).toString(),
        author: author,
        blocked: false,
        bot: false,
        channel_id: channelId,
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
        messageReference: reply
            ? {
                  guild_id: guildId,
                  channel_id: channelId,
                  message_id: reply,
                  type: 0
              }
            : undefined,
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
    messages: Array<DiscordMessage>
): Array<Message> {
    const guildId = stores.selectedGuildStore.getGuildId();

    return messages.map((message) => {
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
                const url = embed.image.proxyURL || embed.image.url;
                const extension = url.split(".").pop();
                const mimeType = extension ? `image/${extension}` : undefined;

                images.push({
                    name: url,
                    mimeType: mimeType && isImageMimeType(mimeType) ? mimeType : undefined,
                    url: url
                });
            } else if (["video", "gifv"].includes(embed.type) && embed.video) {
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
