import { defineConfig } from 'vite';

export default defineConfig({
  base: './',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    chunkSizeWarningLimit: 1800,
  },
  server: {
    host: '0.0.0.0',
    port: 5173,
  },
});
