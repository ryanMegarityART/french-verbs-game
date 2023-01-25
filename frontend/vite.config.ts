import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import cjs from 'rollup-plugin-cjs';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        index: resolve(__dirname, 'src/index.html'),
      },
      plugins: [cjs()],
    },
    commonjsOptions: {
      exclude: [/./],
    },
  },
});