import { defineConfig } from "vite";

export default defineConfig({
    base: '/Weather-forecast/',
    root: '.',
    publicDir: 'public',
    build: {
        outDir: 'dist',
    }
});