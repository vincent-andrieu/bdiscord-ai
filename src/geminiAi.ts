import { FileDataPart, GenerateContentStreamResult, GoogleGenerativeAI, InlineDataPart, Part, Schema, SchemaType } from "@google/generative-ai";
import { FileMetadataResponse, FileState, GoogleAIFileManager, UploadFileResponse } from "@google/generative-ai/server";
import { i18n } from "./i18n";
import { getSetting, MAX_MEDIA_SIZE, SETTING_AI_MODEL, SETTING_GOOGLE_API_KEY, SETTING_MEDIA_MAX_SIZE } from "./settings";
import { LogLevel, Media, Message } from "./types";
import { convertArrayBufferToBase64, convertTimestampToUnix } from "./utils";

const BASE_URL = "https://generativelanguage.googleapis.com";
const MAX_INLINE_DATA_SIZE = 20_000_000;

type PromptItem = { message: Message; dataPart?: Array<InlineDataPart> | Array<FileDataPart> };

export class GeminiAi {
    private _genAI: GoogleGenerativeAI;
    private _fileManager: GoogleAIFileManager;

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
        this._genAI = new GoogleGenerativeAI(apiKey);
        this._fileManager = new GoogleAIFileManager(apiKey);
    }

    async purgeMedias(): Promise<void> {
        const listResponse = await this._fileManager.listFiles();

        if (listResponse.files) {
            await Promise.allSettled(listResponse.files.map((file) => this._fileManager.deleteFile(file.name)));
        }
        if (listResponse.nextPageToken) {
            await this.purgeMedias();
        }
    }

    async summarizeMessages(previousMessages: Array<Message> = [], unreadMessages: Array<Message>): Promise<GenerateContentStreamResult> {
        const promptData = await this._getMediasPrompt(unreadMessages);
        const request: Array<string | Part> = promptData.flatMap((promptItem) => [
            getTextPromptItem(promptItem.message),
            ...(promptItem.dataPart || [])
        ]);

        const model = this._genAI.getGenerativeModel({
            model: this._modelName,
            systemInstruction: this._getSystemInstruction(previousMessages, promptData)
        });

        return await model.generateContentStream(request);
    }

    async isSensitiveContent(
        messages: Array<Message>
    ): Promise<{ isEmetophobia: boolean; isArachnophobia: boolean; isEpileptic: boolean; isSexual: boolean } | undefined> {
        const request: Array<string | Part> = await this._getSensitiveContentPrompt(messages);

        if (!request.length || request.every((item) => typeof item === "string")) {
            return undefined;
        }
        const schema: Schema = {
            type: SchemaType.OBJECT,
            properties: {
                isEmetophobia: { type: SchemaType.BOOLEAN },
                isArachnophobia: { type: SchemaType.BOOLEAN },
                isEpileptic: { type: SchemaType.BOOLEAN },
                isSexual: { type: SchemaType.BOOLEAN }
            },
            required: ["isEmetophobia", "isArachnophobia", "isEpileptic", "isSexual"]
        };
        const model = this._genAI.getGenerativeModel({
            model: this._modelName,
            generationConfig: {
                responseMimeType: "application/json",
                responseSchema: schema
            },
            systemInstruction: [`Check if the content is sensitive for:`, `- Emetophobia`, `- Arachnophobia`, `- Epilepsy`, `- Sexuality`].join("\n")
        });

        const response = await model.generateContent(request);

        return JSON.parse(response.response.text());
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
            const mediasPrompt: Array<InlineDataPart> = [];
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
                            mediasPrompt.push({
                                inlineData: {
                                    mimeType: media.mimeType,
                                    data: convertArrayBufferToBase64(buffer)
                                }
                            });
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
        const messagesFiles: Array<{ message: Message; files: Array<FileMetadataResponse> }> = [];
        const uploadedCache: Record<string, FileMetadataResponse> = {};

        for (const message of messages) {
            const medias = [message.images, message.videos, message.audios].filter(Boolean).flat() as Array<Media>;
            const files: Array<FileMetadataResponse> = [];

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

        const timeout = Date.now() + 60_000;
        const verifiedFiles = new Set<string>();
        while (messagesFiles.some((messageFiles) => messageFiles.files.some((file) => file.state === FileState.PROCESSING))) {
            for (const messageFiles of messagesFiles) {
                for (let i = 0; i < messageFiles.files.length; i++) {
                    if (!verifiedFiles.has(messageFiles.files[i].name)) {
                        if (messageFiles.files[i].state === FileState.PROCESSING) {
                            await new Promise((resolve) => setTimeout(resolve, 100));

                            try {
                                messageFiles.files[i] = await this._fileManager.getFile(messageFiles.files[i].name);
                            } catch (error) {
                                this._log(`Failed to fetch file metadata ${error}`, "warn");
                            }
                        } else {
                            verifiedFiles.add(messageFiles.files[i].name);
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
            dataPart: messageFiles.files
                .filter((file) => file.state === FileState.ACTIVE)
                .map((file) => ({ fileData: { mimeType: file.mimeType, fileUri: file.uri } }))
        }));
    }

    private async _uploadFileFromUrl(media: Media): Promise<FileMetadataResponse> {
        if (!media.mimeType) throw "Media mimeType is missing";
        // Step 1: Fetch the remote file
        const fileResponse = await fetch(media.url);
        if (!fileResponse.ok) {
            throw new Error(`Failed to fetch file: ${fileResponse.statusText}`);
        }

        // Get the file data as ArrayBuffer
        const fileData = await fileResponse.arrayBuffer();

        // Step 2: Get size
        const numBytes = fileData.byteLength;

        // Step 3: Start the resumable upload process
        const initResponse = await fetch(`${BASE_URL}/upload/v1beta/files?key=${this._fileManager.apiKey}`, {
            method: "POST",
            headers: {
                "X-Goog-Upload-Protocol": "resumable",
                "X-Goog-Upload-Command": "start",
                "X-Goog-Upload-Header-Content-Length": numBytes.toString(),
                "X-Goog-Upload-Header-Content-Type": media.mimeType,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                file: {
                    display_name: media.name
                }
            })
        });

        // Get the upload URL from the response headers
        const uploadUrl = initResponse.headers.get("x-goog-upload-url");
        if (!uploadUrl) {
            throw new Error("Failed to get upload URL");
        }

        // Step 4: Upload the file data
        const uploadResponse = await fetch(uploadUrl, {
            method: "POST",
            headers: {
                "Content-Length": numBytes.toString(),
                "X-Goog-Upload-Offset": "0",
                "X-Goog-Upload-Command": "upload, finalize"
            },
            body: fileData
        });

        if (!uploadResponse.ok) {
            throw new Error(`Upload failed: ${uploadResponse.statusText}`);
        }

        // Parse the response to get the file URI
        const fileInfo: UploadFileResponse = await uploadResponse.json();
        return fileInfo.file;
    }
}

function getTextPromptItem(message: Message): string {
    return JSON.stringify({
        [i18n.AUTHOR]: message.author.username,
        [i18n.DATE]: message.date,
        [i18n.CONTENT]: message.content
    } as Record<string, string>);
}
