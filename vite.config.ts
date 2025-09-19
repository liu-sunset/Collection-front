import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    port: 3000,
    open: true,
    proxy: {
      '/getBiliUserInfo': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false
      },
      '/getBiliCollectionInfo': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false
      },
      '/getdouallcollection': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false
      },
      '/image-proxy': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false
      }
    }
  }
})