import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'path'

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()],
    build: {
      lib: {
        entry: resolve('electron/main/index.ts'),
      },
    },
  },
  preload: {
    plugins: [externalizeDepsPlugin()],
    build: {
      lib: {
        entry: resolve('electron/preload/index.ts'),
        formats: ['cjs'],
        fileName: () => 'index.js',
      },
    },
  },
  renderer: {
    root: 'src',
    plugins: [react(), tailwindcss()],
    build: {
      rollupOptions: {
        input: resolve('src/index.html'),
      },
    },
    server: {
      proxy: {
        '/api': {
          target: 'http://localhost:3030',
          changeOrigin: true,
          bypass(req) {
            // Don't proxy TypeScript source files — they live in src/api/ and
            // would otherwise be forwarded to Express, returning 404.
            if (req.url?.match(/\.tsx?(\?|$)/)) return req.url
          },
        },
      },
    },
  },
})
