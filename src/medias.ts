import { isImageMimeType, isVideoMimeType, LOG_PREFIX, MEDIA_FETCH_CONCURRENCY } from "./constants";
import { Image, Media, Message, Video } from "./types";
import { mapWithConcurrency } from "./utils";

/**
 * @param messages Array of messages with medias to fetch metadata
 * @returns Return medias that failed to fetch metadata
 */
export async function fetchMediasMetadata(messages: Array<Message>): Promise<Array<Media>> {
    const failedMedias: Array<Media> = [];
    const medias = messages
        .flatMap((message) => [message.images, message.videos].filter(Boolean).flat() as Array<Image | Video>)
        .filter((media) => !media.mimeType || !media.size);

    // Metadata requests are independent, so they run through a pool instead of one round trip after the other
    await mapWithConcurrency(medias, MEDIA_FETCH_CONCURRENCY, async (media) => {
        try {
            const metadata = await fetchMediaMetadata(media.url);

            if (metadata.url) {
                media.url = metadata.url;
            }
            if (!media.mimeType && (isImageMimeType(metadata.contentType) || isVideoMimeType(metadata.contentType))) {
                media.mimeType = metadata.contentType;
            }
            if (!media.size && metadata.contentLength) {
                media.size = metadata.contentLength;
            }
        } catch (error) {
            console.error(LOG_PREFIX, "Failed to fetch media metadata", error);
            failedMedias.push(media);
        }
    });
    return failedMedias;
}

async function fetchMediaMetadata(url: string): Promise<{ url?: string; contentType?: string; contentLength?: number }> {
    // `fetch` follows redirects on its own, the final url is exposed by `response.url`
    const response = await fetch(url, { method: "HEAD" });

    if (!response.ok) {
        throw new Error(`Failed to fetch media (${url}) metadata: ${response.status} ${response.statusText}`);
    }
    const contentType = response.headers.get("content-type") || undefined;
    const contentLength = response.headers.get("content-length") || undefined;

    return {
        url: response.redirected && response.url ? response.url : undefined,
        contentType: contentType,
        contentLength: contentLength ? Number(contentLength) : undefined
    };
}
