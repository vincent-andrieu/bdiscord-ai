import typescript from "rollup-plugin-typescript2";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import banner from "rollup-plugin-banner2";
import nodePolyfills from 'rollup-plugin-node-polyfills';

export default {
    input: "src/main.ts", // The entry point of your application
    output: {
        file: "build/bdiscord-ai.plugin.js", // The output bundled file
        format: "commonjs" // The output format ('module', 'commonjs', 'iife', 'umd', 'amd', 'system')
    },
    external: ['ws', 'node:fs', 'node:path', 'node:url', 'fs', 'path', 'url', 'crypto', 'http', 'https', 'stream'],
    plugins: [
        nodePolyfills({
            include: ['buffer', 'process', 'util', 'stream', 'events'],
            exclude: ['src/**/*.ts'] // Exclude TypeScript source files
        }),
        resolve({
            preferBuiltins: false,
            browser: true,
            exportConditions: ['browser'],
            skip: ['ws', 'crypto', 'fs', 'path', 'url', 'http', 'https', 'stream']
        }), // Allows Rollup to resolve modules
        commonjs({
            include: ['node_modules/**'],
            transformMixedEsModules: true
        }), // Converts CommonJS modules to ES6
        typescript({
            tsconfig: "tsconfig.json",
            clean: true
        }),
        banner(() => [
            "/**",
            " * @name BDiscordAI",
            " * @author gassastsina",
            " * @description Summarize unread messages with Gemini and block sensible medias content.",
            " * @version 1.0.0",
            " * @authorId 292388871381975040",
            " */"
        ].join("\n") + '\n')
    ]
};
