import { AudioMimeType, audioMimeTypes, ImageMimeType, imageMimeTypes, LOG_PREFIX, VideoMimeType, videoMimeTypes } from "./constants";
import { Image, Message, Video } from "./types";

export function isImageMimeType(mimeType: string): mimeType is ImageMimeType {
    return imageMimeTypes.includes(mimeType as ImageMimeType);
}
export function isVideoMimeType(mimeType: string): mimeType is VideoMimeType {
    return videoMimeTypes.includes(mimeType as VideoMimeType);
}
export function isAudioMimeType(mimeType: string): mimeType is AudioMimeType {
    return audioMimeTypes.includes(mimeType as AudioMimeType);
}

export async function fetchMediasMetadata(messages: Array<Message>): Promise<void> {
    const medias = messages.flatMap((message) => [message.images, message.videos].filter(Boolean).flat() as Array<Image | Video>);

    for (const media of medias) {
        if (media.mimeType && media.size) {
            continue;
        }
        try {
            const metadata = await fetchMediaMetadata(media.url);

            if (metadata.url) {
                media.url = metadata.url;
            }
            if (!media.mimeType && metadata.contentType && (isImageMimeType(metadata.contentType) || isVideoMimeType(metadata.contentType))) {
                media.mimeType = metadata.contentType;
            }
            if (!media.size && metadata.contentLength) {
                media.size = metadata.contentLength;
            }
        } catch (error) {
            console.error(LOG_PREFIX, "Failed to fetch media metadata", error);
        }
    }
}

async function fetchMediaMetadata(url: string, n = 0): Promise<{ url?: string; contentType?: string; contentLength?: number }> {
    const response = await fetch(url, { method: "HEAD" });

    if (!response.ok) {
        throw new Error(`Failed to fetch media (${url}) metadata: ${response.status} ${response.statusText}`);
    }
    const contentType = response.headers.get("content-type") || undefined;
    const contentLength = response.headers.get("content-length") || undefined;

    if (!contentType && n < 3) {
        const location = response.headers.get("location");

        if (location) {
            return fetchMediaMetadata(location, n + 1);
        }
    }

    return {
        url: n > 0 ? url : undefined,
        contentType: contentType,
        contentLength: contentLength ? Number(contentLength) : undefined
    };
}
