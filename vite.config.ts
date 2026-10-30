import { fileURLToPath, URL } from 'node:url'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    // The auth API has no CORS: in development the browser talks to the dev server, which forwards /v1.
    proxy: {
      '/v1': 'http://localhost:8080',
      // The storage API also serves /v1, so it lives under its own prefix that the proxy removes.
      '/storage-api': { target: 'http://localhost:8084', rewrite: (path) => path.replace(/^\/storage-api/, '') },
      // Same for the documents API, which has no CORS either.
      '/documents-api': { target: 'http://localhost:8085', rewrite: (path) => path.replace(/^\/documents-api/, '') },
      // Same for the messaging API (run it with HTTP_PORT=8083).
      // Same for the Pulso API (its default port, 3001).
      '/pulso-api': { target: 'http://localhost:3001', rewrite: (path) => path.replace(/^\/pulso-api/, '') },
      '/messaging-api': { target: 'http://localhost:8083', rewrite: (path) => path.replace(/^\/messaging-api/, '') },
    },
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
