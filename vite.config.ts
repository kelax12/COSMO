// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: true, // autorise tous les hosts (nécessaire pour CodeSandbox)
    port: 3000,         // port de dev
    strictPort: false    // permet à Vite de choisir un port libre si 3000 est occupé
  },
  resolve: {
    alias: {
      '@': '/src' // pratique pour les imports absolus depuis /src
    }
  }
})
