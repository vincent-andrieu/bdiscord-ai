import {
    createPartFromBase64,
    createPartFromUri,
    File,
    FileState,
    GenerateContentResponse,
    GoogleGenAI,
    Modality,
    Part,
    PartUnion,
    Schema,
    ToolListUnion,
    Type
} from "@google/genai";
import {
    GEMINI_FILE_DISPLAY_NAME_PREFIX,
    GEMINI_FILE_PROCESSING_POLL_DELAY,
    GEMINI_FILE_PROCESSING_TIMEOUT,
    LOG_PREFIX,
    MAX_INLINE_DATA_SIZE,
    MEDIA_FETCH_CONCURRENCY,
    SENSITIVE_CHECK_CONCURRENCY
} from "./constants";
import { i18n } from "./i18n";
import { getSetting, SETTING_AI_MODEL_SENSITIVE_CONTENT, SETTING_AI_MODEL_SUMMARY, SETTING_GOOGLE_API_KEY, SETTING_MEDIA_MAX_SIZE } from "./settings";
import { LogLevel, Media, Message, SensitiveCheckResult, SensitiveVerdict } from "./types";
import { convertBlobToBase64, convertTimestampToUnix, getErrorMessage, mapWithConcurrency } from "./utils";

/** Gemini display names are capped at 512 characters and medias are keyed by url, which can be long. */
const MAX_FILE_DISPLAY_NAME_LENGTH = 400;

type PromptItem = { message: Message; dataPart?: Array<Part> };
type UploadedFile = File & Required<Pick<File, "uri" | "mimeType">>;

const SENSITIVE_SCHEMA: Schema = {
    type: Type.OBJECT,
    properties: {
        isEmetophobia: { type: Type.BOOLEAN },
        isArachnophobia: { type: Type.BOOLEAN },
        isEpileptic: { type: Type.BOOLEAN },
        isSexual: { type: Type.BOOLEAN }
    },
    required: ["isEmetophobia", "isArachnophobia", "isEpileptic", "isSexual"]
};

const SENSITIVE_SYSTEM_INSTRUCTION = ["Check if the content is sensitive for:", "- Emetophobia", "- Arachnophobia", "- Epilepsy", "- Sexuality"].join(
    "\n"
);

export class GeminiAi {
    private _genAI: GoogleGenAI;

    private get _summaryModelName(): string {
        const modelName = getSetting<string>(SETTING_AI_MODEL_SUMMARY);

        if (!modelName) throw new Error("AI model is missing");
        return modelName;
    }

    private get _sensitiveModelName(): string {
        const modelName = getSetting<string>(SETTING_AI_MODEL_SENSITIVE_CONTENT);

        if (!modelName) throw new Error("AI model is missing");
        return modelName;
    }

    constructor(private _log: (message: string, type?: LogLevel) => void) {
        const apiKey = getSetting<string>(SETTING_GOOGLE_API_KEY);

        if (!apiKey) {
            throw new Error("Google API Key is missing");
        }
        this._genAI = new GoogleGenAI({ apiKey });
    }

    /**
     * Only removes the files this plugin uploaded: the same API key can be shared with other tools, and the File API
     * is account wide.
     */
    async purgeMedias(): Promise<void> {
        const deletingPromises: Array<Promise<unknown>> = [];
        // The pager fetches the next pages on its own while being iterated
        const listResponse = await this._genAI.files.list();

        for await (const file of listResponse) {
            if (file.name && file.displayName?.startsWith(GEMINI_FILE_DISPLAY_NAME_PREFIX)) {
                deletingPromises.push(this._genAI.files.delete({ name: file.name }));
            }
        }
        if (deletingPromises.length) {
            await Promise.allSettled(deletingPromises);
        }
    }

    async summarizeMessages(
        guildId: string,
        channelId: string,
        unreadMessages: Array<Message>,
        abortSignal?: AbortSignal
    ): Promise<AsyncGenerator<GenerateContentResponse>> {
        const promptData = await this._getMediasPrompt(unreadMessages);
        const request: Array<PartUnion> = promptData.flatMap((promptItem) => [getTextPromptItem(promptItem.message), ...(promptItem.dataPart || [])]);
        const tools: ToolListUnion = [{ urlContext: {} }];

        return this._genAI.models.generateContentStream({
            model: this._summaryModelName,
            config: {
                systemInstruction: this._getSystemInstruction(guildId, channelId, promptData),
                responseModalities: [Modality.TEXT],
                tools,
                abortSignal
            },
            contents: request
        });
    }

    /**
     * One request per message, run in parallel. Grouping several messages in a single request would save a negligible
     * amount of tokens (the medias dominate) but forces the model to bind each media to the right message id, which is
     * exactly where a small model misattributes a verdict.
     *
     * `onResult` is called as soon as a message gets its own answer, so a slow or failing message never holds back the
     * ones that already came back. Messages are processed in the order they are given.
     */
    async checkSensitiveContent(
        messages: Array<Message>,
        onResult: (result: SensitiveCheckResult) => void,
        abortSignal?: AbortSignal
    ): Promise<void> {
        await mapWithConcurrency(messages, SENSITIVE_CHECK_CONCURRENCY, async (message) => {
            try {
                const request = await this._getSensitiveContentPrompt(message);

                // Nothing analysable is not a failure, there simply is no usable media on this message
                if (!request.length) {
                    onResult({ messageId: message.id, hasFailed: false });
                    return;
                }
                const response = await this._genAI.models.generateContent({
                    model: this._sensitiveModelName,
                    config: {
                        systemInstruction: SENSITIVE_SYSTEM_INSTRUCTION,
                        responseMimeType: "application/json",
                        responseSchema: SENSITIVE_SCHEMA,
                        abortSignal
                    },
                    contents: request
                });
                const verdict = parseSensitiveResponse(response.text);

                onResult({ messageId: message.id, verdict, hasFailed: !verdict });
            } catch (error) {
                // Logged to the console only: the caller reports a single toast for the whole check
                console.error(LOG_PREFIX, "Failed to check sensitive content", error);
                onResult({ messageId: message.id, hasFailed: true });
            }
        });
        abortSignal?.throwIfAborted();
    }

    private _getSystemInstruction(guildId: string, channelId: string, promptData: Array<PromptItem>): string {
        const now = new Date();
        const timestamp = convertTimestampToUnix(now);
        const formattedTime = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
        const formattedLongDate = now.toLocaleDateString(undefined, { day: "numeric", month: "long", year: "numeric" });
        const formattedShortDateTime = now.toLocaleDateString(undefined, { day: "numeric", month: "long", year: "numeric" }) + " " + formattedTime;
        const formattedLongDateTime =
            now.toLocaleDateString(undefined, { weekday: "long", day: "numeric", month: "long", year: "numeric" }) + " " + formattedTime;

        return [
            i18n.SYSTEM_INSTRUCTIONS.INTRODUCTION,
            promptData.some((prompt) => prompt.dataPart?.length) ? i18n.SYSTEM_INSTRUCTIONS.MEDIAS : undefined,
            ...i18n.SYSTEM_INSTRUCTIONS.CONTENT({
                guildId,
                channelId,
                timestamp,
                formattedTime,
                formattedLongDate,
                formattedShortDateTime,
                formattedLongDateTime
            })
        ]
            .filter(Boolean)
            .join("\n");
    }

    private async _getSensitiveContentPrompt(message: Message): Promise<Array<PartUnion>> {
        const [promptItem] = await this._getMediasPrompt([message]);

        // Only medias can be sensitive here, a message without any usable media is not worth a request
        if (!promptItem?.dataPart?.length) {
            return [];
        }
        return [...(message.content.trim().length ? [message.content] : []), ...promptItem.dataPart];
    }

    private async _getMediasPrompt(messages: Array<Message>): Promise<Array<PromptItem>> {
        const filteredMessages = this._filterUploadableMedias(messages);

        if (this._getMediasTotalSize(filteredMessages) < MAX_INLINE_DATA_SIZE) {
            return this._getMediasInlineData(filteredMessages);
        }
        return this._getMediasFileManager(filteredMessages);
    }

    private _filterUploadableMedias(messages: Array<Message>): Array<Message> {
        const maxMediaSize = getSetting<number>(SETTING_MEDIA_MAX_SIZE) * 1_000_000;
        const filterCondition = (media: Media) => media?.mimeType && media.size && media.size <= maxMediaSize;

        return messages.map((message) => ({
            ...message,
            images: message.images?.filter(filterCondition),
            videos: message.videos?.filter(filterCondition),
            audios: message.audios?.filter(filterCondition)
        }));
    }

    private _getMediasTotalSize(messages: Array<Message>): number {
        return messages.reduce((total, message) => total + getMessageMedias(message).reduce((sum, media) => sum + (media.size || 0), 0), 0);
    }

    private async _getMediasInlineData(messages: Array<Message>): Promise<Array<PromptItem>> {
        const encodedMedias = new Map<string, Part>();

        // Downloads run through a pool and identical urls are only downloaded once
        await mapWithConcurrency(getUniqueMedias(messages), MEDIA_FETCH_CONCURRENCY, async (media) => {
            try {
                if (!media.mimeType) throw new Error("Media mimeType is missing");
                const response = await fetch(media.url);

                if (!response.ok) {
                    throw new Error(`${media.url}: ${response.status} ${response.statusText}`);
                }
                encodedMedias.set(media.url, createPartFromBase64(await convertBlobToBase64(await response.blob()), media.mimeType));
            } catch (error) {
                this._log(`Failed to fetch media ${getErrorMessage(error)}`, "warn");
            }
        });

        return messages.map((message) => ({
            message,
            dataPart: getMessageMedias(message)
                .map((media) => encodedMedias.get(media.url))
                .filter((part): part is Part => !!part)
        }));
    }

    private async _getMediasFileManager(messages: Array<Message>): Promise<Array<PromptItem>> {
        const uploadedFiles = new Map<string, File>();

        await mapWithConcurrency(getUniqueMedias(messages), MEDIA_FETCH_CONCURRENCY, async (media) => {
            try {
                uploadedFiles.set(media.url, await this._uploadFileFromUrl(media));
            } catch (error) {
                this._log(`Failed to upload media ${getErrorMessage(error)}`, "warn");
            }
        });
        await this._waitForProcessedFiles(uploadedFiles);

        return messages.map((message) => ({
            message,
            dataPart: getMessageMedias(message)
                .map((media) => uploadedFiles.get(media.url))
                .filter((file): file is UploadedFile => !!file && file.state === FileState.ACTIVE && !!file.uri && !!file.mimeType)
                .map((file) => createPartFromUri(file.uri, file.mimeType))
        }));
    }

    private async _waitForProcessedFiles(files: Map<string, File>): Promise<void> {
        const timeout = Date.now() + GEMINI_FILE_PROCESSING_TIMEOUT;
        const isProcessing = () => Array.from(files.values()).some((file) => file.state === FileState.PROCESSING);

        while (isProcessing()) {
            if (Date.now() > timeout) {
                this._log("Timeout while waiting processing files", "warn");
                return;
            }
            await new Promise((resolve) => setTimeout(resolve, GEMINI_FILE_PROCESSING_POLL_DELAY));
            await Promise.all(
                Array.from(files.entries()).map(async ([url, file]) => {
                    if (!file.name || file.state !== FileState.PROCESSING) return;
                    try {
                        files.set(url, await this._genAI.files.get({ name: file.name }));
                    } catch (error) {
                        this._log(`Failed to fetch file metadata ${getErrorMessage(error)}`, "warn");
                    }
                })
            );
        }
    }

    private async _uploadFileFromUrl(media: Media): Promise<File> {
        if (!media.mimeType) throw new Error("Media mimeType is missing");
        const fileResponse = await fetch(media.url);

        if (!fileResponse.ok) {
            throw new Error(`Failed to fetch file: ${fileResponse.statusText}`);
        }
        const fileData = await fileResponse.arrayBuffer();

        return this._genAI.files.upload({
            file: new Blob([fileData], { type: media.mimeType }),
            config: {
                mimeType: media.mimeType,
                // Tags the file so `purgeMedias` can tell it apart from files uploaded by anything else
                displayName: `${GEMINI_FILE_DISPLAY_NAME_PREFIX}${media.name}`.slice(0, MAX_FILE_DISPLAY_NAME_LENGTH)
            }
        });
    }
}

function getMessageMedias(message: Message): Array<Media> {
    return [message.images, message.videos, message.audios].filter(Boolean).flat() as Array<Media>;
}

function getUniqueMedias(messages: Array<Message>): Array<Media> {
    const uniqueMedias = new Map<string, Media>();

    for (const message of messages) {
        for (const media of getMessageMedias(message)) {
            if (!uniqueMedias.has(media.url)) {
                uniqueMedias.set(media.url, media);
            }
        }
    }
    return Array.from(uniqueMedias.values());
}

function parseSensitiveResponse(text: string | undefined): SensitiveVerdict | undefined {
    if (!text) return undefined;
    try {
        const parsed = JSON.parse(text) as Partial<SensitiveVerdict> | null;

        if (typeof parsed?.isEmetophobia !== "boolean") {
            return undefined;
        }
        return {
            isEmetophobia: parsed.isEmetophobia,
            isArachnophobia: !!parsed.isArachnophobia,
            isEpileptic: !!parsed.isEpileptic,
            isSexual: !!parsed.isSexual
        };
    } catch {
        return undefined;
    }
}

function getTextPromptItem(message: Message): string {
    return JSON.stringify({
        [i18n.ID]: message.id,
        [i18n.AUTHOR]: message.author.username,
        [i18n.DATE]: message.date,
        [i18n.CONTENT]: message.content
    } as Record<string, string>);
}
