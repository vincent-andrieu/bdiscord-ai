import { AudioMimeType, ImageMimeType, VideoMimeType } from "src/constants";

export type LogLevel = "success" | "error" | "warn";

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

export type SensitiveVerdict = {
    isEmetophobia: boolean;
    isArachnophobia: boolean;
    isEpileptic: boolean;
    isSexual: boolean;
};

/** Outcome of a single message check. `verdict` is absent when there was nothing to analyse or when the check failed. */
export type SensitiveCheckResult = {
    messageId: string;
    verdict?: SensitiveVerdict;
    hasFailed: boolean;
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
