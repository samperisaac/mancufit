import { defineConfig } from 'vite';
// import { VitePWA } from 'vite-plugin-pwa';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [
    react(),
    /*
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: [
        'favicon.ico',
        'robots.txt',
        'assets/icon-192.png',
        'assets/icon-512.png'
      ],
      manifest: {
        name: 'MancuFit',
        short_name: 'MancuFit',
        description: 'Registra tus ejercicios y pesos en casa con la app de confianza MancuFit',
        start_url: 'https://mancufit.netlify.app/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#ffffff',
        orientation: 'portrait',
        icons: [
          { src: 'assets/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'assets/icon-512.png', sizes: '512x512', type: 'image/png' }
        ]
      }
    })
    */
  ]
});