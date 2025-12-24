import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  
  // Path Alias (Clean Imports ke liye)
  // Example: import Button from '@/components/UI/Button'
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },

  server: {
    port: 3000,      // Frontend Port
    open: true,      // Run karte hi browser khul jaye
    
    // IMPORTANT: Backend Connection Proxy
    proxy: {
      '/api': {
        target: 'http://localhost:5000', // Backend Server URL
        changeOrigin: true,
        secure: false,
      },
      // Socket.io Proxy (Real-time updates ke liye)
      '/socket.io': {
        target: 'http://localhost:5000',
        ws: true, // Websocket support enabled
        changeOrigin: true,
      }
    },
  },

  build: {
    outDir: 'dist',
    sourcemap: false, // Production mein code chupaane ke liye
    chunkSizeWarningLimit: 1600, // Large chunk warning hatane ke liye
  }
});