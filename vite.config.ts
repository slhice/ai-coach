import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          ui: ['@headlessui/react', 'lucide-react', 'framer-motion']
        }
      }
    }
  },
  optimizeDeps: {
    include: ['@langchain/core', '@langchain/openai', '@langchain/community']
  },
  server: {
    port: 5173,
    host: true
  }
});