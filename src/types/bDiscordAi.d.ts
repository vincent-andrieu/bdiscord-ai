export type LogLevel = "error" | "warn";

export type Author = {
    username: string;
    roles: Array<string>;
};

export type Message = {
    id: string;
    author: Author;
    content: string;
    date: number;
};
