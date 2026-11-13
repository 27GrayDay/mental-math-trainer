import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// На GitHub Pages сайт лежит в /<имя-репозитория>/ — base задаётся в workflow через VITE_BASE
export default defineConfig({
  base: process.env.VITE_BASE ?? '/',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'sounds/*', 'figures/*'],
      manifest: {
        name: 'Тренажёр устного счёта',
        short_name: 'Устный счёт',
        lang: 'ru',
        theme_color: '#f2f2f7',
        background_color: '#f2f2f7',
        display: 'standalone',
        icons: [
          { src: 'pwa-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'pwa-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
    }),
  ],
});
