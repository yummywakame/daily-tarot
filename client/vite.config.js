import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const base = env.VITE_BASE_PATH || '/'
  const apiOrigin = process.env.DAILY_TAROT_API || env.DAILY_TAROT_API || 'http://localhost:7000'

  return {
    base,
    plugins: [react()],
    build: {
      outDir: 'build',
    },
    server: {
      port: 3000,
      proxy: {
        '^/auth': { target: apiOrigin, changeOrigin: true },
        '^/api': { target: apiOrigin, changeOrigin: true },
      },
    },
  }
})
