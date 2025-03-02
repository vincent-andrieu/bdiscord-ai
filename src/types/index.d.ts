export type LogLevel = "error" | "warn";

export type Author = {
    id: string;
    username: string;
};

export type Message = {
    author: Author;
    content: string;
};
