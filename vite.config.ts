import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { PUBLIC_PATH } from './src/constants/constants';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: PUBLIC_PATH,
});
