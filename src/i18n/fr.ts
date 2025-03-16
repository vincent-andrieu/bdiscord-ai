export const fr = {
    AUTHOR: "Auteur",
    CONTENT: "Contenu",
    DATE: "Date",
    DONE: "Terminé",
    ADD: "Ajouter",
    API_KEY_NOTICE: "Aucune clée API Google n'est configurée",
    SETTING_CATEGORY_GEMINI_AI: "Gemini AI",
    SETTING_GOOGLE_API_KEY: "Google API Key",
    SETTING_GOOGLE_API_KEY_NOTE: "Clée à générer sur https://aistudio.google.com/apikey",
    SETTING_AI_MODEL: "Modèle",
    SETTING_AI_MODEL_NOTE: "Sélectionne le modèle Gemini à utiliser",
    SETTING_MEDIA_MAX_SIZE: "Taille maximale des médias",
    SETTING_MEDIA_MAX_SIZE_NOTE: "Taille max des médias à télécharger (en Mo)",
    SETTING_JUMP_TO_MESSAGE: "Scroll auto",
    SETTING_JUMP_TO_MESSAGE_NOTE: "Scroll automatiquement sur le résumé",
    SETTING_SUMMARY_MIN_LENGTH: "Longueur minimale pour résumer",
    SETTING_SUMMARY_MIN_LENGTH_NOTE: "Longueur minimale du contenu pour afficher le bouton",
    SETTING_CATEGORY_SENSITIVE: "Contenu sensible",
    SETTING_EMETOPHOBIA_MODE: "Émétophobie",
    SETTING_ARACHNOPHOBIA_MODE: "Arachnophobie",
    SETTING_EPILEPSY_MODE: "Épilepsie",
    SETTING_SEXUALITY_MODE: "Sexualité",
    SETTING_SENSITIVE_NOTE: "Active le spoiler pour les fichiers et désactive les images/vidéos embeded",
    SETTING_SENSITIVE_PANIC_MODE: "Panic mode",
    SETTING_SENSITIVE_PANIC_MODE_NOTE:
        "Désactive instantanément le contenu sensible puis les réactive après la vérification. (Peut provoquer des petits freezes)",
    SUMMARY_BUTTON: "Résumer",
    SYSTEM_INSTRUCTIONS: {
        INTRODUCTION:
            "Tu es une IA qui permet à l'utilisateur de résumer des messages, des images, des vidéos et des audios sur la messagerie Discord. Ta réponse est au format markdown.",
        MEDIAS: "Les images, vidéos et audios ont été envoyés dans des messages.",
        CONTENT: (params: {
            timestamp: number;
            formattedTime: string;
            formattedLongDate: string;
            formattedShortDateTime: string;
            formattedLongDateTime: string;
        }) => [
            "Certains messages peuvent avoir une syntaxe particulière et permet de notifier des personnes. Tu peux les réutiliser dans ta réponse pour qu'ils soient interprétés. Voici quelques exemples :",
            "- Nom d'utilisateur : <@1234>",
            "- Nom de rôle : <@&1234>",
            "- Emoji personnalisé : <a:nom:1234>",
            "- Emoji natif : :joy:",
            "- Nom des channels : <#1234>",
            "- Lien vers un message : https://discord.com/channels/1234/1234/1234",
            "- La mise en forme des liens markdown n'est pas prit en charge : [texte](url)",
            "Tu peux utiliser le timestamp unix pour préciser une date. Voici des exemples avec le timestamp de l'heure actuelle :",
            `- A utiliser pour les dates dans les 24h : <t:${params.timestamp}:t> => ${params.formattedTime}`,
            `- A utiliser pour les dates antérieurs à 1 jours : <t:${params.timestamp}:f> => ${params.formattedShortDateTime}`,
            `- A utiliser pour les dates antérieurs à 2 jours : <t:${params.timestamp}:D> => ${params.formattedLongDate}`,
            `- A utiliser pour les dates dans le futur : <t:${params.timestamp}:F> => ${params.formattedLongDateTime}`,
            `- Date/Heure relative : <t:${params.timestamp}:R> => à l'instant`,
            "Contexte des messages précédents :"
        ]
    }
};
