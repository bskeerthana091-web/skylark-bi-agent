import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3050,
    strictPort: true,
    host: true,
    proxy: {
      '/api/monday': {
        target: 'https://api.monday.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/monday/, '/v2')
      }
    }
  }
});
