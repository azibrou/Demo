import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  // GitHub Pages project site: https://<user>.github.io/Demo/
  // Use '/' during dev so the dev server matches localhost paths; use repo base for production build.
  base: command === 'build' ? '/Demo/' : '/',
  plugins: [react(), tailwindcss()],
}))
