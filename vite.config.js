import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
    base: '/board-games/', // Cambia 'board-games' por el nombre exacto de tu repositorio
})
