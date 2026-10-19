import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Peringatan ukuran chunk dinaikkan sedikit: bundel undangan memang
    // memuat pustaka animasi, namun sudah dipecah per-vendor agar dapat
    // di-cache ulang secara terpisah oleh peramban tamu.
    chunkSizeWarningLimit: 700,
    rolldownOptions: {
      output: {
        codeSplitting: {
          groups: [
            { name: 'vendor-motion', test: /node_modules[\\/]framer-motion/ },
            { name: 'vendor-icons', test: /node_modules[\\/]lucide-react/ },
            { name: 'vendor-react', test: /node_modules[\\/](react|react-dom|scheduler)[\\/]/ },
          ],
        },
      },
    },
  },
});
