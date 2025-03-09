import { FileDataPart, GoogleGenerativeAI, InlineDataPart } from "@google/generative-ai";
import { FileMetadataResponse, FileState, GoogleAIFileManager, UploadFileResponse } from "@google/generative-ai/server";
import { getSetting, SETTING_AI_MODEL, SETTING_GOOGLE_API_KEY } from "./config";
import { i18n } from "./i18n";
import { LogLevel, Media, Message } from "./types";
import { convertTimestampToUnix } from "./utils";

const BASE_URL = "https://generativelanguage.googleapis.com";
const MAX_INLINE_DATA_SIZE = 20_000_000;
const MAX_MEDIA_SIZE = 50_000_000;

export class GeminiAi {
    private _genAI: GoogleGenerativeAI;
    private _fileManager: GoogleAIFileManager;

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

    async summarizeMessages(messages: Array<Message>): Promise<string> {
        const mediasPrompt = await this._getMediasPrompt(messages);

        const modelName = getSetting<string>(SETTING_AI_MODEL);
        if (!modelName) throw "AI model is missing";
        const model = this._genAI.getGenerativeModel({
            model: modelName,
            systemInstruction: this._getSystemInstruction(mediasPrompt)
        });

        const messagesPrompt = messages.map((message) => {
            const prompt: Record<string, any> = {
                [i18n("author")]: message.author.username,
                [i18n("date")]: message.date,
                [i18n("content")]: message.content
            };

            if (message.images?.length) {
                prompt[i18n("images")] = JSON.stringify(message.images.map((image) => image.name));
            }
            if (message.videos?.length) {
                prompt[i18n("videos")] = JSON.stringify(message.videos.map((video) => video.name));
            }
            if (message.audios?.length) {
                prompt[i18n("audios")] = JSON.stringify(message.audios.map((audio) => audio.name));
            }
            return prompt;
        });
        const result = await model.generateContent([...mediasPrompt, JSON.stringify(messagesPrompt)]);

        return result.response.text();
    }

    private _getSystemInstruction(mediasPrompt: Array<unknown>): string {
        const now = new Date();
        const timestamp = convertTimestampToUnix(now);
        const formattedTime = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
        const formattedLongDate = now.toLocaleDateString(undefined, { day: "numeric", month: "long", year: "numeric" });
        const formattedShortDateTime = now.toLocaleDateString(undefined, { day: "numeric", month: "long", year: "numeric" }) + " " + formattedTime;
        const formattedLongDateTime =
            now.toLocaleDateString(undefined, { weekday: "long", day: "numeric", month: "long", year: "numeric" }) + " " + formattedTime;

        return [
            `Tu es une IA qui permet à l'utilisateur de résumer des messages, des images, des vidéos et des audios sur la messagerie Discord. Ta réponse est au format markdown.`,
            mediasPrompt.length ? `Les images, vidéos et/ou audios ont été envoyés dans des messages.` : undefined,
            `Certains messages peuvent avoir une syntaxe particulière et permet de notifier des personnes. Tu peux les réutiliser dans ta réponse pour qu'ils soient interprétés. Voici quelques exemples :`,
            `- Nom d'utilisateur : <@1234>`,
            `- Nom de rôle : <@&1234>`,
            `- Emoji personnalisé : <a:nom:1234>`,
            `- Emoji natif : :joy:`,
            `- Nom des channels : <#1234>`,
            `- Lien vers un message : https://discord.com/channels/1234/1234/1234`,
            `Tu peux utiliser le timestamp unix pour préciser une date. Voici des exemples avec le timestamp de l'heure actuelle :`,
            `- A utiliser pour les dates dans les 24h : <t:${timestamp}:t> => ${formattedTime}`,
            `- A utiliser pour les dates antérieurs à 1 jours : <t:${timestamp}:f> => ${formattedShortDateTime}`,
            `- A utiliser pour les dates antérieurs à 2 jours : <t:${timestamp}:D> => ${formattedLongDate}`,
            `- A utiliser pour les dates dans le futur : <t:${timestamp}:F> => ${formattedLongDateTime}`,
            `- Date/Heure relative : <t:${timestamp}:R> => à l'instant`
        ]
            .filter(Boolean)
            .join("\n");
    }

    private async _getMediasPrompt(messages: Array<Message>): Promise<Array<InlineDataPart | FileDataPart>> {
        const medias = this._filterUploadableMedias(messages);

        if (this._getMediasTotalSize(medias) < MAX_INLINE_DATA_SIZE) {
            return this._getMediasInlineData(medias);
        }
        return this._getMediasFileManager(medias);
    }

    private _filterUploadableMedias(messages: Array<Message>): Array<Media> {
        return messages.flatMap(
            (message) =>
                [message.images, message.videos, message.audios]
                    .flat()
                    .filter((media) => media?.mimeType && media.size && media.size <= MAX_MEDIA_SIZE) as Array<Media>
        );
    }

    private _getMediasTotalSize(medias: Array<Media>): number {
        return medias.reduce((total, media) => total + (media.size || 0), 0);
    }

    private async _getMediasInlineData(medias: Array<Media>): Promise<Array<InlineDataPart>> {
        const mediasPrompt: Array<InlineDataPart> = [];

        for (const media of medias) {
            try {
                if (!media.mimeType) throw "Media mimeType is missing";
                const response = await fetch(media.url);
                if (!response.ok) {
                    throw `${media.url}: ${response.status} ${response.statusText}`;
                }

                const buffer = await response.arrayBuffer();
                mediasPrompt.push({
                    inlineData: {
                        mimeType: media.mimeType,
                        data: btoa(String.fromCharCode(...new Uint8Array(buffer)))
                    }
                });
            } catch (error) {
                this._log(`Failed to fetch media ${error}`, "warn");
            }
        }
        return mediasPrompt;
    }

    private async _getMediasFileManager(medias: Array<Media>): Promise<Array<FileDataPart>> {
        const files: Array<FileMetadataResponse> = [];

        for (const media of medias) {
            try {
                files.push(await this._uploadFileFromUrl(media));
            } catch (error) {
                this._log(`Failed to fetch media ${error}`, "warn");
            }
        }

        const timeout = Date.now() + 60_000;
        while (files.some((file) => file.state === FileState.PROCESSING)) {
            await new Promise((resolve) => setTimeout(resolve, 500));

            for (let i = 0; i < files.length; i++) {
                if (files[i].state === FileState.PROCESSING) {
                    try {
                        files[i] = await this._fileManager.getFile(files[i].name);
                    } catch (error) {
                        this._log(`Failed to fetch file metadata ${error}`, "warn");
                    }
                }
            }

            if (Date.now() > timeout) {
                this._log("Timeout while waiting processing files", "warn");
                break;
            }
        }

        return files.filter((file) => file.state === FileState.ACTIVE).map((file) => ({ fileData: { mimeType: file.mimeType, fileUri: file.uri } }));
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
