import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // GitHub Pages용 base 경로 (https://github.com/KANGPUNGYUN/AutoPolicy)
  base: '/AutoPolicy/',
})
