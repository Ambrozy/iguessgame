import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  testMatch: /.*\.e2e\.js/,
  use: { baseURL: 'http://localhost:4173/iguessgame/' },
  webServer: {
    command: 'npx vite preview --port 4173 --strictPort',
    url: 'http://localhost:4173/iguessgame/',
    reuseExistingServer: true,
  },
});
