import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // IMPORTANT: base must match your repo name for GitHub Pages
  base: '/canada-tax-smart-calc/',
  define: {
    'process.env': {}
  }
})
