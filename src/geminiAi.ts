import {
    ChatSession,
    FileDataPart,
    GenerateContentStreamResult,
    GoogleGenerativeAI,
    InlineDataPart,
    Part,
    Schema,
    SchemaType
} from "@google/generative-ai";
import { FileMetadataResponse, FileState, GoogleAIFileManager, UploadFileResponse } from "@google/generative-ai/server";
import { getSetting, SETTING_AI_MODEL, SETTING_GOOGLE_API_KEY } from "./config";
import { i18n } from "./i18n";
import { LogLevel, Media, Message } from "./types";
import { convertArrayBufferToBase64, convertTimestampToUnix } from "./utils";

const BASE_URL = "https://generativelanguage.googleapis.com";
const MAX_INLINE_DATA_SIZE = 20_000_000;
const MAX_MEDIA_SIZE = 50_000_000;

type PromptItem = { message: Message; dataPart?: Array<InlineDataPart> | Array<FileDataPart> };

export class GeminiAi {
    private _genAI: GoogleGenerativeAI;
    private _fileManager: GoogleAIFileManager;

    private _chat?: ChatSession;

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

    async summarizeMessages(unreadMessages: Array<Message>, previousMessages: Array<Message> = []): Promise<GenerateContentStreamResult> {
        const promptData = await this._getMediasPrompt(unreadMessages);
        const request: Array<string | Part> = promptData.flatMap((promptItem) => [
            getTextPromptItem(promptItem.message),
            ...(promptItem.dataPart || [])
        ]);

        if (!this._chat) {
            const model = this._genAI.getGenerativeModel({
                model: this._modelName,
                systemInstruction: getSystemInstruction()
            });

            this._chat = model.startChat({
                history: previousMessages.map((message) => ({ role: "user", parts: [{ text: getTextPromptItem(message) }] }))
            });
        }

        return await this._chat.sendMessageStream(request);
    }

    async suggestAnswer() {
        if (!this._chat) {
            throw "Chat session is missing";
        }
        return await this._chat.sendMessageStream("Propose 1 réponse à la conversation");
    }

    async isSensitiveContent(messages: Array<Message>): Promise<{ isEmetophobia: boolean; isArachnophobia: boolean } | undefined> {
        const request: Array<string | Part> = await this._getSensitiveContentPrompt(messages);

        if (!request.length || request.every((item) => typeof item === "string")) {
            return undefined;
        }
        const schema: Schema = {
            type: SchemaType.OBJECT,
            properties: {
                isEmetophobia: {
                    type: SchemaType.BOOLEAN
                },
                isArachnophobia: {
                    type: SchemaType.BOOLEAN
                }
            },
            required: ["isEmetophobia", "isArachnophobia"]
        };
        const model = this._genAI.getGenerativeModel({
            model: this._modelName,
            generationConfig: {
                responseMimeType: "application/json",
                responseSchema: schema
            },
            systemInstruction: [`Check if the content is sensitive for people with:`, `- Emetophobia`, `- Arachnophobia`].join("\n")
        });

        const response = await model.generateContent(request);

        return JSON.parse(response.response.text());
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
        const filterCondition = (media: Media) => media?.mimeType && media.size && media.size <= MAX_MEDIA_SIZE;

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

        for (const message of messages) {
            const medias = [message.images, message.videos, message.audios].filter(Boolean).flat() as Array<Media>;
            const files: Array<FileMetadataResponse> = [];

            for (const media of medias) {
                try {
                    files.push(await this._uploadFileFromUrl(media));
                } catch (error) {
                    this._log(`Failed to upload media ${error}`, "warn");
                }
            }
            messagesFiles.push({ message, files });
        }

        const timeout = Date.now() + 60_000;
        while (messagesFiles.some((messageFiles) => messageFiles.files.some((file) => file.state === FileState.PROCESSING))) {
            for (const messageFiles of messagesFiles) {
                for (let i = 0; i < messageFiles.files.length; i++) {
                    if (messageFiles.files[i].state === FileState.PROCESSING) {
                        await new Promise((resolve) => setTimeout(resolve, 100));

                        try {
                            messageFiles.files[i] = await this._fileManager.getFile(messageFiles.files[i].name);
                        } catch (error) {
                            this._log(`Failed to fetch file metadata ${error}`, "warn");
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

function getSystemInstruction(): string {
    const now = new Date();
    const timestamp = convertTimestampToUnix(now);
    const formattedTime = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const formattedLongDate = now.toLocaleDateString(undefined, { day: "numeric", month: "long", year: "numeric" });
    const formattedShortDateTime = now.toLocaleDateString(undefined, { day: "numeric", month: "long", year: "numeric" }) + " " + formattedTime;
    const formattedLongDateTime =
        now.toLocaleDateString(undefined, { weekday: "long", day: "numeric", month: "long", year: "numeric" }) + " " + formattedTime;

    return [
        `Tu es une IA qui permet à l'utilisateur de résumer des messages, des images, des vidéos et des audios sur la messagerie Discord. Ta réponse est au format markdown.`,
        `Les images, vidéos et/ou audios ont été envoyés dans des messages.`,
        `Certains messages peuvent avoir une syntaxe particulière et permet de notifier des personnes. Tu peux les réutiliser dans ta réponse pour qu'ils soient interprétés. Voici quelques exemples :`,
        `- Nom d'utilisateur : <@1234>`,
        `- Nom de rôle : <@&1234>`,
        `- Emoji personnalisé : <a:nom:1234>`,
        `- Emoji natif : :joy:`,
        `- Nom des channels : <#1234>`,
        `- Lien vers un message : https://discord.com/channels/1234/1234/1234`,
        `- La mise en forme des liens markdown n'est pas prit en charge : [texte](url)`,
        `Tu peux utiliser le timestamp unix pour préciser une date. Voici des exemples avec le timestamp de l'heure actuelle :`,
        `- A utiliser pour les dates dans les 24h : <t:${timestamp}:t> => ${formattedTime}`,
        `- A utiliser pour les dates antérieurs à 1 jours : <t:${timestamp}:f> => ${formattedShortDateTime}`,
        `- A utiliser pour les dates antérieurs à 2 jours : <t:${timestamp}:D> => ${formattedLongDate}`,
        `- A utiliser pour les dates dans le futur : <t:${timestamp}:F> => ${formattedLongDateTime}`,
        `- Date/Heure relative : <t:${timestamp}:R> => à l'instant`
    ].join("\n");
}

function getTextPromptItem(message: Message): string {
    return JSON.stringify({
        [i18n("author")]: message.author.username,
        [i18n("date")]: message.date,
        [i18n("content")]: message.content
    } as Record<string, string>);
}
