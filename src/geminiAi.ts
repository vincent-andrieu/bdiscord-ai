import {
    createPartFromBase64,
    createPartFromUri,
    DeleteFileResponse,
    File,
    FileState,
    GenerateContentResponse,
    GoogleGenAI,
    Part,
    PartUnion,
    Schema,
    Type
} from "@google/genai";
import { i18n } from "./i18n";
import { getSetting, MAX_MEDIA_SIZE, SETTING_AI_MODEL, SETTING_GOOGLE_API_KEY, SETTING_MEDIA_MAX_SIZE } from "./settings";
import { LogLevel, Media, Message } from "./types";
import { convertArrayBufferToBase64, convertTimestampToUnix } from "./utils";

const BASE_URL = "https://generativelanguage.googleapis.com";
const MAX_INLINE_DATA_SIZE = 20_000_000;

type PromptItem = { message: Message; dataPart?: Array<Part> };

export class GeminiAi {
    private _genAI: GoogleGenAI;
    private _apiKey: string;

    private get _modelName(): string {
        const modelName = getSetting<string>(SETTING_AI_MODEL);

        if (!modelName) throw "AI model is missing";
        return modelName;
    }

    constructor(private _log: (message: string, type?: LogLevel) => void) {
        const apiKey = getSetting<string>(SETTING_GOOGLE_API_KEY);

        if (!apiKey) {
            throw "Google API Key is missing";
        }
        this._apiKey = apiKey;
        this._genAI = new GoogleGenAI({ apiKey });
    }

    async purgeMedias(): Promise<void> {
        const listResponse = await this._genAI.files.list();
        const deletingPromises: Array<Promise<DeleteFileResponse>> = [];

        for await (const file of listResponse) {
            if (file.name) {
                deletingPromises.push(this._genAI.files.delete({ name: file.name }));
            }
        }
        if (deletingPromises.length) {
            await Promise.allSettled(deletingPromises);
        }
        if (listResponse.hasNextPage()) {
            await this.purgeMedias();
        }
    }

    async summarizeMessages(previousMessages: Array<Message> = [], unreadMessages: Array<Message>): Promise<AsyncGenerator<GenerateContentResponse>> {
        const promptData = await this._getMediasPrompt(unreadMessages);
        const request: Array<PartUnion> = promptData.flatMap((promptItem) => [getTextPromptItem(promptItem.message), ...(promptItem.dataPart || [])]);

        return this._genAI.models.generateContentStream({
            model: this._modelName,
            config: {
                systemInstruction: this._getSystemInstruction(previousMessages, promptData)
            },
            contents: request
        });
    }

    async isSensitiveContent(
        messages: Array<Message>
    ): Promise<{ isEmetophobia: boolean; isArachnophobia: boolean; isEpileptic: boolean; isSexual: boolean } | undefined> {
        const request: Array<PartUnion> = await this._getSensitiveContentPrompt(messages);

        if (!request.length || request.every((item) => typeof item === "string")) {
            return undefined;
        }
        const schema: Schema = {
            type: Type.OBJECT,
            properties: {
                isEmetophobia: { type: Type.BOOLEAN },
                isArachnophobia: { type: Type.BOOLEAN },
                isEpileptic: { type: Type.BOOLEAN },
                isSexual: { type: Type.BOOLEAN }
            },
            required: ["isEmetophobia", "isArachnophobia", "isEpileptic", "isSexual"]
        };
        const response = await this._genAI.models.generateContent({
            model: this._modelName,
            config: {
                systemInstruction: [`Check if the content is sensitive for:`, `- Emetophobia`, `- Arachnophobia`, `- Epilepsy`, `- Sexuality`].join(
                    "\n"
                ),
                responseMimeType: "application/json",
                responseSchema: schema
            },
            contents: request
        });

        return response.text ? JSON.parse(response.text) : undefined;
    }

    private _getSystemInstruction(previousMessages: Array<Message>, promptData: Array<PromptItem>): string {
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
            ...i18n.SYSTEM_INSTRUCTIONS.CONTENT({ timestamp, formattedTime, formattedLongDate, formattedShortDateTime, formattedLongDateTime }),
            ...previousMessages.map((message) => `- ${getTextPromptItem(message)}`)
        ]
            .filter(Boolean)
            .join("\n");
    }

    private async _getSensitiveContentPrompt(messages: Array<Message>): Promise<Array<string | Part>> {
        const filteredMessages = this._filterUploadableMedias(messages);

        if (this._getMediasTotalSize(filteredMessages) > MAX_INLINE_DATA_SIZE) {
            return [];
        }
        return (await this._getMediasInlineData(filteredMessages))
            .flatMap((promptItem) => [promptItem.message.content, ...(promptItem.dataPart || ([] as Array<Part>))])
            .filter((promptItem) => typeof promptItem !== "string" || promptItem.trim().length > 0);
    }

    private async _getMediasPrompt(messages: Array<Message>): Promise<Array<PromptItem>> {
        const filteredMessages = this._filterUploadableMedias(messages);

        if (this._getMediasTotalSize(filteredMessages) < MAX_INLINE_DATA_SIZE) {
            return this._getMediasInlineData(filteredMessages);
        }
        return this._getMediasFileManager(filteredMessages);
    }

    private _filterUploadableMedias(messages: Array<Message>): Array<Message> {
        const maxMediaSize = (getSetting<number>(SETTING_MEDIA_MAX_SIZE) || MAX_MEDIA_SIZE) * 1_000_000;
        const filterCondition = (media: Media) => media?.mimeType && media.size && media.size <= maxMediaSize;

        return messages.map((message) => ({
            ...message,
            images: message.images?.filter(filterCondition),
            videos: message.videos?.filter(filterCondition),
            audios: message.audios?.filter(filterCondition)
        }));
    }

    private _getMediasTotalSize(messages: Array<Message>): number {
        return messages.reduce(
            (total, message) =>
                total +
                (message.images?.reduce((sum, image) => sum + (image.size || 0), 0) || 0) +
                (message.videos?.reduce((sum, video) => sum + (video.size || 0), 0) || 0) +
                (message.audios?.reduce((sum, audio) => sum + audio.size, 0) || 0),
            0
        );
    }

    private async _getMediasInlineData(messages: Array<Message>): Promise<Array<PromptItem>> {
        const promptItems: Array<PromptItem> = [];

        for (const message of messages) {
            const medias = [message.images, message.videos, message.audios].filter(Boolean).flat() as Array<Media>;
            const mediasPrompt: Array<Part> = [];
            const convertingMediasToBuffer: Array<Promise<unknown>> = [];

            for (const media of medias) {
                try {
                    const response = await fetch(media.url);
                    if (!response.ok) {
                        throw `${media.url}: ${response.status} ${response.statusText}`;
                    }

                    convertingMediasToBuffer.push(
                        response.arrayBuffer().then((buffer) => {
                            if (!media.mimeType) throw "Media mimeType is missing";
                            mediasPrompt.push(createPartFromBase64(convertArrayBufferToBase64(buffer), media.mimeType));
                        })
                    );
                } catch (error) {
                    this._log(`Failed to fetch media ${error}`, "warn");
                }
            }

            await Promise.allSettled(convertingMediasToBuffer);
            promptItems.push({ message, dataPart: mediasPrompt });
        }
        return promptItems;
    }

    private async _getMediasFileManager(messages: Array<Message>): Promise<Array<PromptItem>> {
        const messagesFiles: Array<{ message: Message; files: Array<File> }> = [];
        const uploadedCache: Record<string, File> = {};

        for (const message of messages) {
            const medias = [message.images, message.videos, message.audios].filter(Boolean).flat() as Array<Media>;
            const files: Array<File> = [];

            for (const media of medias) {
                try {
                    if (uploadedCache[media.url]) {
                        files.push(uploadedCache[media.url]);
                    } else {
                        const file = await this._uploadFileFromUrl(media);

                        files.push(file);
                        uploadedCache[media.url] = file;
                    }
                } catch (error) {
                    this._log(`Failed to upload media ${error}`, "warn");
                }
            }
            messagesFiles.push({ message, files });
        }

        const timeout = Date.now() + 30_000;
        const verifiedFiles = new Set<string>();
        while (messagesFiles.some((messageFiles) => messageFiles.files.some((file) => file.state === FileState.PROCESSING))) {
            for (const messageFiles of messagesFiles) {
                for (let i = 0; i < messageFiles.files.length; i++) {
                    const file = messageFiles.files[i];

                    if (file.name && !verifiedFiles.has(file.name)) {
                        if (file.state === FileState.PROCESSING) {
                            try {
                                messageFiles.files[i] = await this._genAI.files.get({ name: file.name });
                            } catch (error) {
                                this._log(`Failed to fetch file metadata ${error}`, "warn");
                            }
                        } else {
                            verifiedFiles.add(file.name);
                        }
                    }
                }
            }

            if (Date.now() > timeout) {
                this._log("Timeout while waiting processing files", "warn");
                break;
            }
        }

        return messagesFiles.map((messageFiles) => ({
            message: messageFiles.message,
            dataPart: (
                messageFiles.files.filter((file) => file.state === FileState.ACTIVE && file.uri && file.mimeType) as Array<
                    File & Required<Pick<File, "uri" | "mimeType">>
                >
            ).map((file) => createPartFromUri(file.uri, file.mimeType))
        }));
    }

    private async _uploadFileFromUrl(media: Media): Promise<File> {
        if (!media.mimeType) throw "Media mimeType is missing";
        const fileResponse = await fetch(media.url);
        if (!fileResponse.ok) {
            throw new Error(`Failed to fetch file: ${fileResponse.statusText}`);
        }

        const fileData = await fileResponse.arrayBuffer();

        return this._genAI.files.upload({
            file: new Blob([fileData], { type: media.mimeType })
        });
    }
}

function getTextPromptItem(message: Message): string {
    return JSON.stringify({
        [i18n.AUTHOR]: message.author.username,
        [i18n.DATE]: message.date,
        [i18n.CONTENT]: message.content
    } as Record<string, string>);
}
