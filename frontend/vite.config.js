// Vite configuration for Rental Nepal frontend
// Configures React, Tailwind CSS, and development server settings
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'


// Vite configuration with React and Tailwind CSS plugins
export default defineConfig({
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:4000",
        changeOrigin: true,
        secure: false,
      },
    },
  },
  plugins: [
    tailwindcss(),
    react()],
})