import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
// Vite 8 uses Rolldown which requires manualChunks as a function
export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Three.js ecosystem in its own chunk (largest dependency)
          if (id.includes('node_modules/three/') || 
              id.includes('node_modules/@react-three/')) {
            return 'three-vendor';
          }
          // Framer Motion in its own chunk (used only by Stack/Certificates)
          if (id.includes('node_modules/framer-motion/')) {
            return 'framer-motion';
          }
          // React core
          if (id.includes('node_modules/react/') || 
              id.includes('node_modules/react-dom/')) {
            return 'react-vendor';
          }
        },
      },
    },
  },
  optimizeDeps: {
    include: ['three', '@react-three/fiber', '@react-three/drei'],
  },
});
