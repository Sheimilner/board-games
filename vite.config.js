import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/board-games/', // Esto es vital para que encuentre los assets en GitHub Pages
})
