import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    restoreMocks: true,
    globals: true,
    environment: 'jsdom',
    setupFiles: ['tests/setup.ts'],
    coverage: {
      provider: 'v8',
      reportOnFailure: true,
      include: ['**/*.tsx'],
    },
  },
});
