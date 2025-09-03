import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 4200,
    proxy: {
      // Only proxy actual API endpoints, not image URLs
      '^/api/(?!placeholder|picsum|via\.placeholder|loremflickr)': {
        target: 'https://localhost:5001',
        changeOrigin: true,
        secure: false,
      }
    }
  }
})