import {
    DiscordMessageFlags,
    DiscordMessageState,
    DiscordMessageType,
    GEMINI_VIDEOS_LIMIT,
    isAudioMimeType,
    isImageMimeType,
    isVideoMimeType
} from "./constants";
import { Audio, DiscordMessage, DiscordMessageComponent, DiscordUser, GuildMemberStore, Image, Message, SelectedGuildStore, Video } from "./types";

export function getRuntimeRequire(packageName: string) {
    try {
        const nodeRequire = window.require;

        return nodeRequire(packageName);
    } catch (error) {
        console.error(`Failed to require package "${packageName}" at runtime:`, error);
        return null;
    }
}

export function getErrorMessage(error: unknown): string {
    if (typeof error === "string") {
        return error;
    }
    if (error instanceof Error) {
        return error.message;
    }
    return String(error);
}

export function isAbortError(error: unknown): boolean {
    return (error as { name?: string } | undefined)?.name === "AbortError";
}

/**
 * Runs `task` over `items` with at most `limit` calls in flight. `task` is expected to handle its own failures: a
 * rejection aborts the whole pool.
 */
export async function mapWithConcurrency<T, R>(items: Array<T>, limit: number, task: (item: T, index: number) => Promise<R>): Promise<Array<R>> {
    const results: Array<R> = new Array(items.length);
    let nextIndex = 0;

    const worker = async () => {
        while (nextIndex < items.length) {
            const index = nextIndex++;

            results[index] = await task(items[index], index);
        }
    };

    await Promise.all(Array.from({ length: Math.max(1, Math.min(limit, items.length)) }, worker));
    return results;
}

export function getOldestId(firstId: string | undefined, secondId: string): string;
export function getOldestId(firstId: string, secondId?: string): string;
export function getOldestId(firstId: string, secondId: string): string;
export function getOldestId(firstId?: string, secondId?: string): string | undefined;
export function getOldestId(firstId?: string, secondId?: string): string | undefined {
    if (!firstId && !secondId) {
        return undefined;
    }

    if (!firstId) {
        return secondId;
    }
    if (!secondId) {
        return firstId;
    }
    if (firstId.length === secondId.length) {
        return firstId < secondId ? firstId : secondId;
    }
    return firstId.length < secondId.length ? firstId : secondId;
}

export function convertTimestampToUnix(timestamp: Date | string | number): number {
    return Math.floor(new Date(timestamp).getTime() / 1000);
}

/**
 * Encoding is delegated to `FileReader` so a multi megabytes media does not freeze the Discord UI thread the way a
 * manual `String.fromCharCode` loop did.
 */
export function convertBlobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onerror = () => reject(reader.error ?? new Error("Failed to encode media"));
        reader.onload = () => {
            const result = reader.result;

            if (typeof result !== "string") {
                reject(new Error("Unexpected media encoding result"));
                return;
            }
            // The reader returns a "data:<mimeType>;base64,<data>" URL
            resolve(result.slice(result.indexOf(",") + 1));
        };
        reader.readAsDataURL(blob);
    });
}

/**
 * Discord CDN urls carry query parameters (`?ex=...&hm=...`) that are re-signed over time, so anything comparing or
 * parsing an url has to drop them first.
 */
export function stripUrlQuery(url: string): string {
    return url.split(/[?#]/)[0];
}

export function getUrlExtension(url: string): string | undefined {
    const path = stripUrlQuery(url);
    const extension = path.split(".").pop()?.toLowerCase();

    return extension && extension !== path ? extension : undefined;
}

export function hashString(value: string): string {
    let hash = 0;

    for (let index = 0; index < value.length; index++) {
        hash = (hash << 5) - hash + value.charCodeAt(index);
        hash |= 0;
    }
    return (hash >>> 0).toString(36);
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
    guildId: string | null;
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
              guild_id: guildId ?? undefined,
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
        const extension = getUrlExtension(url);
        const mimeType = extension ? `image/${extension === "jpg" ? "jpeg" : extension}` : undefined;

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
            const thumbnailUrl = embed.thumbnail?.proxyURL || embed.thumbnail?.proxy_url;

            if (embed.type === "image" && embed.image) {
                const url = embed.image.proxyURL || embed.image.proxy_url || embed.image.url;

                images.push(addImage(url));
            } else if (["video", "gifv"].includes(embed.type) && embed.video) {
                const url = embed.video.url || embed.video.proxyURL || embed.video.proxy_url;

                if (url) {
                    const extension = getUrlExtension(url);
                    const mimeType = extension ? `video/${extension}` : undefined;

                    videos.push({
                        name: url,
                        mimeType: mimeType && isVideoMimeType(mimeType) ? mimeType : undefined,
                        url: url,
                        thumbnail: thumbnailUrl
                    });
                } else if (thumbnailUrl) {
                    images.push(addImage(thumbnailUrl));
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
                for (let index = 0; index < videos.length && countVideos > maxVideos; index++) {
                    const thumbnailUrl = videos[index]?.thumbnail;

                    if (thumbnailUrl) {
                        message.images.push(addImage(thumbnailUrl));
                    }
                    videos[index] = undefined;
                    countVideos--;
                }
                message.videos = videos.filter((video) => video) as Array<Video>;
            }
        }
    }
    return mappedMessages;
}
