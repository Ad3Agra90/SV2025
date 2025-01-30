import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: '/', // Substitua 'meusite' pelo diretório correto no cPanel
  plugins: [react()],
});
