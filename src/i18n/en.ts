export const en = {
    AUTHOR: "Author",
    CONTENT: "Content",
    DATE: "Date",
    DONE: "Done",
    ADD: "Add",
    UPDATE: "Update",
    API_KEY_NOTICE: "No Google API key is configured",
    UPDATE_NOTICE: "New version available",
    SETTING_CATEGORY_GEMINI_AI: "Gemini AI",
    SETTING_GOOGLE_API_KEY: "Google API Key",
    SETTING_GOOGLE_API_KEY_NOTE: "Generate a key at https://aistudio.google.com/apikey",
    SETTING_AI_MODEL_SUMMARY: "Model for summaries",
    SETTING_AI_MODEL_SUMMARY_NOTE: "Select the Gemini model to use for summaries",
    SETTING_AI_MODEL_SENSITIVE_CONTENT: "Model for sensitive contents",
    SETTING_AI_MODEL_SENSITIVE_CONTENT_NOTE: "Select the Gemini model to use for sensitive contents",
    SETTING_MEDIA_MAX_SIZE: "Maximum media size",
    SETTING_MEDIA_MAX_SIZE_NOTE: "Maximum size of media to download (in Mo)",
    SETTING_JUMP_TO_MESSAGE: "Auto scroll",
    SETTING_JUMP_TO_MESSAGE_NOTE: "Automatically scroll to the summary",
    SETTING_SUMMARY_MIN_LENGTH: "Minimum length to summarize",
    SETTING_SUMMARY_MIN_LENGTH_NOTE: "Minimum length of content to display the button",
    SETTING_CATEGORY_SENSITIVE: "Sensitive content",
    SETTING_EMETOPHOBIA_MODE: "Emetophobia",
    SETTING_ARACHNOPHOBIA_MODE: "Arachnophobia",
    SETTING_EPILEPSY_MODE: "Epilepsy",
    SETTING_SEXUALITY_MODE: "Sexuality",
    SETTING_SENSITIVE_NOTE: "Enable spoilers for files and disable embedded images/videos",
    SETTING_SENSITIVE_PANIC_MODE: "Panic mode",
    SETTING_SENSITIVE_PANIC_MODE_NOTE: "Instantly disables sensitive content and re-enables them after verification. (May cause small freezes)",
    SETTING_CATEGORY_OTHERS: "Others",
    SETTING_CHECK_UPDATES: "Check for updates",
    SETTING_CHECK_UPDATES_NOTE: "Check for updates on plugin startup",
    SUMMARY_BUTTON: "Summarize",
    SYSTEM_INSTRUCTIONS: {
        INTRODUCTION:
            "You are an AI that helps the user summarize messages, images, videos, and audios on Discord messaging by themes concisely. Your response is in markdown format.",
        MEDIAS: "Images, videos and audios have been sent in messages.",
        CONTENT: (params: {
            timestamp: number;
            formattedTime: string;
            formattedLongDate: string;
            formattedShortDateTime: string;
            formattedLongDateTime: string;
        }) => [
            "Some messages may have a specific syntax for tagging people. You can reuse them in your response so they are interpreted. Here are some examples:",
            "- Username: <@1234>",
            "- Role name: <@&1234>",
            "- Custom emoji: <a:name:1234>",
            "- Native emoji: :joy:",
            "- Channel names: <#1234>",
            "- Link to a message: https://discord.com/channels/1234/1234/1234",
            "- Markdown link formatting is not supported: [text](url)",
            "You can use the unix timestamp to specify a date. Here are examples with the current time timestamp:",
            `- Use for dates within 24 hours: <t:${params.timestamp}:t> => ${params.formattedTime}`,
            `- Use for dates older than 1 day: <t:${params.timestamp}:f> => ${params.formattedShortDateTime}`,
            `- Use for dates older than 2 days: <t:${params.timestamp}:D> => ${params.formattedLongDate}`,
            `- Use for future dates: <t:${params.timestamp}:F> => ${params.formattedLongDateTime}`,
            `- Relative date/time: <t:${params.timestamp}:R> => just now`,
            "Context of previous messages:"
        ]
    },
    SUMMARY_IMAGE_REQUEST: "Generate an image to illustrate the summary"
} as const;
