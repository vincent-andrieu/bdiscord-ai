import typescript from "rollup-plugin-typescript2";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import { httpResolve } from "rollup-plugin-http-resolve";
import banner from "rollup-plugin-banner2";

export default {
    input: "src/main.ts", // The entry point of your application
    output: {
        file: "build/bdiscord-ai.plugin.js", // The output bundled file
        format: "commonjs" // The output format ('module', 'commonjs', 'iife', 'umd', 'amd', 'system')
    },
    external: [],
    plugins: [
        resolve(), // Allows Rollup to resolve modules
        commonjs(), // Converts CommonJS modules to ES6
        typescript({
            tsconfig: "tsconfig.json"
        }),
        httpResolve({
            resolveIdFallback: (specifier, importer) => {
                if (specifier === "@google/generative-ai") {
                    return `https://esm.run/${specifier}`;
                }
            }
        }),
        banner(() => [
            "/**",
            " * @name BDiscordAI",
            " * @author gassastsina",
            " * @description Summurize unread messages with Gemini and block sensible medias content.",
            " * @authorId 292388871381975040",
            " * @version 1.0.0",
            " */"
        ].join("\n") + '\n')
    ]
};
