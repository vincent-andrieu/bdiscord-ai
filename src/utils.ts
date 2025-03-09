import { DiscordMessageFlags, DiscordMessageState, DiscordMessageType } from "./constants";
import { DiscordMessage, DiscordUser } from "./types";

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
