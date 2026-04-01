import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      // Injecte le SW dans le HTML automatiquement
      injectRegister: 'auto',
      includeAssets: ['favicon.ico', 'AlterEon_2.png', 'profil.jpg'],

      workbox: {
        // Uniquement les assets du build Vite — pas les fichiers publics raw
        globPatterns: ['**/*.{js,css,html,ico,png,jpg,svg}'],
        // Nécessaire pour que React Router / SPA fonctionne offline
        navigateFallback: 'index.html',
        // Exclut les routes Vercel/API du fallback
        navigateFallbackDenylist: [/^\/api\//],
        // Ne pas mettre en cache les sons et PDF (trop lourds, rarement offline)
        globIgnores: ['**/*.mp3', '**/*.pdf'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365,
              },
            },
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'gstatic-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365,
              },
            },
          },
        ],
      },
    }),
  ],
});