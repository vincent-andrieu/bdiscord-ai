import { GoogleGenerativeAI } from "@google/generative-ai";
import { getSetting, SETTING_GOOGLE_API_KEY } from "./config";
import { i18n } from "./i18n";
import { Message } from "./types";
import { convertTimestampToUnix } from "./utils";

const GEMINI_MODEL = "gemini-2.0-flash";

export class GeminiAi {
    async summarizeMessages(messages: Array<Message>): Promise<string> {
        const apiKey = getSetting(SETTING_GOOGLE_API_KEY);
        if (!apiKey) {
            throw "Google API Key is missing";
        }
        const genAI = new GoogleGenerativeAI(apiKey);

        const model = genAI.getGenerativeModel({
            model: GEMINI_MODEL,
            systemInstruction: this._getSystemInstruction()
        });

        const messagesPrompt = messages.map((message) => ({
            [i18n("author")]: message.author.username,
            [i18n("date")]: message.date,
            [i18n("content")]: message.content
        }));
        const result = await model.generateContent(`Résume ces messages : ${JSON.stringify(messagesPrompt)}`);

        return result.response.text();
    }

    private _getSystemInstruction(): string {
        const now = new Date();
        const timestamp = convertTimestampToUnix(new Date());
        const formattedTime = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
        const formattedLongTime = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
        const formattedShortDate = now.toLocaleDateString();
        const formattedLongDate = now.toLocaleDateString(undefined, { day: "numeric", month: "long", year: "numeric" });
        const formattedShortDateTime = now.toLocaleDateString(undefined, { day: "numeric", month: "long", year: "numeric" }) + " " + formattedTime;
        const formattedLongDateTime = now.toLocaleDateString(undefined, { weekday: "long", day: "numeric", month: "long", year: "numeric" }) + " " + formattedTime;

        return [
            `Tu es une IA qui permet à l'utilisateur de résumer des messages sur la messagerie Discord. Ta réponse est au format markdown.`,
            `Certains messages peuvent avoir une syntaxe particulière et permet de notifier des personnes. Tu peux les réutiliser dans ta réponse pour qu'ils soient interprétés. Voici quelques exemples :`,
            `- Nom d'utilisateur : <@1234>`,
            `- Nom de rôle : <@&1234>`,
            `- Emoji personnalisé : <a:nom:1234>`,
            `- Emoji natif : :joy:`,
            `- Nom des channels : <#1234>`,
            `- Lien vers un message : https://discord.com/channels/1234/1234/1234`,
            `Tu peux utiliser le timestamp unix pour préciser une date. Voici des exemples avec le timestamp actuel :`,
            `- Heure courte : <t:${timestamp}:t> => ${formattedTime}`,
            `- Heure longue : <t:${timestamp}:T> => ${formattedLongTime}`,
            `- Date courte : <t:${timestamp}:d> => ${formattedShortDate}`,
            `- Date longue : <t:${timestamp}:D> => ${formattedLongDate}`,
            `- Date/Heure courte : <t:${timestamp}:f> => ${formattedShortDateTime}`,
            `- Date/Heure longue : <t:${timestamp}:F> => ${formattedLongDateTime}`,
            `- Date/Heure relative : <t:${timestamp}:R> => à l'instant`
        ].join("\n");
    }
}
