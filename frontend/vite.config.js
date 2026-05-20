import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'School Booking System',
        short_name: 'SchoolBooking',
        description: 'Enterprise Asset Management for Schools',
        theme_color: '#0f172a',
        background_color: '#0f172a',
        display: 'standalone',
        icons: [
          { src: '/logo.png', sizes: '192x192', type: 'image/png', purpose: 'any maskable' },
          { src: '/logo.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' }
        ]
      }
    })
  ],
  server: {
    proxy: {
      '/api': 'http://localhost:5200'
    }
  }
})
