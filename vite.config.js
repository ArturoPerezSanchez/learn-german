import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // Serve the assets/ folder at the web root so SVG cards and audio
  // are reachable as /images/..., /audio/..., etc.
  publicDir: 'assets',
  resolve: {
    alias: { '@': '/src' },
  },
})
