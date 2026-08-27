import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
// Note: Vite 8 uses rolldown which has different chunk options
export default defineConfig({
  plugins: [react()],
  build: {
    // Raise the warning limit to suppress the size warning for Three.js apps
    chunkSizeWarningLimit: 3000,
  },
  optimizeDeps: {
    include: ['three', '@react-three/fiber', '@react-three/drei', '@react-three/rapier', 'ecctrl'],
  },
});
