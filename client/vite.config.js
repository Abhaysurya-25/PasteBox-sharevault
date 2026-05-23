import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const apiUrl = process.env.VITE_API_URL || process.env.VITE_API_BASE_URL
const apiProxyTarget = apiUrl
  ? apiUrl.replace(/\/api\/?$/, '')
  : undefined

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: apiProxyTarget
      ? {
          '/api': apiProxyTarget,
        }
      : undefined,
  },
})