import { AudioMimeType, ImageMimeType, VideoMimeType } from "src/constants";

export type LogLevel = "error" | "warn";

export type Author = {
    username: string;
    roles: Array<string>;
};

export type Message = {
    id: string;
    author: Author;
    content: string;
    images?: Array<Image>;
    videos?: Array<Video>;
    audios?: Array<Audio>;
    date: number;
};

export type Media = Image | Video | Audio;

export type Image = {
    name: string;
    url: string;
    mimeType?: ImageMimeType;
    size?: number;
};

export type Video = {
    name: string;
    url: string;
    mimeType?: VideoMimeType;
    size?: number;
    thumbnail?: string;
};

export type Audio = {
    name: string;
    url: string;
    mimeType: AudioMimeType;
    size: number;
};
