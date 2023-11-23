import {fileURLToPath, URL} from 'node:url'

import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import * as path from "path";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        vue(),
    ],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url)),
            'icons': path.resolve(__dirname, "node_modules/vue-material-design-icons")
        },
        extensions: [
            '.vue', '.js', '.ts'
        ]
    },
    build: {
        cssCodeSplit: false,
        lib: {
            entry: path.resolve(__dirname, "./src/index.ts"),
            name: "vue-quick-chat-3",
            fileName: (format) => `vue-quick-chat-3.${format}.js`,
        },
        rollupOptions: {
            external: ["vue"],
            output: {
                globals: {
                    vue: "Vue",
                },
            },
        },
    }
})
