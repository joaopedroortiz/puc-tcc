import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests', // Onde estão seus arquivos .spec.js
  fullyParallel: true,
  reporter: 'html',
  use: {
    /* Base URL para usar em page.goto('/') */
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
  },
  /* Configuração para subir o servidor automaticamente */
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: true,
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});