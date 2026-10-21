import { defineConfig, devices } from '@playwright/test';

// Os testes rodam no site de verdade (build de produção) com um Supabase simulado em memória
// (tests/e2e/mock-supabase.ts), então não precisam de internet nem de conta no Supabase.
export const SUPABASE_URL = 'https://supabase.test';
export const ADMIN_EMAIL = 'dono@barbearia.test';
const PORT = 4175;

export default defineConfig({
  testDir: 'tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  reporter: process.env.CI ? 'github' : 'list',
  use: {
    baseURL: `http://localhost:${PORT}`,
    locale: 'pt-BR',
    timezoneId: 'America/Sao_Paulo',
    trace: 'retain-on-failure',
  },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'] } },
    { name: 'celular', use: { ...devices['Pixel 7'] } },
  ],
  webServer: {
    command: `vite build --outDir dist-e2e && vite preview --outDir dist-e2e --port ${PORT} --strictPort`,
    url: `http://localhost:${PORT}`,
    reuseExistingServer: !process.env.CI,
    env: {
      VITE_SUPABASE_URL: SUPABASE_URL,
      VITE_SUPABASE_ANON_KEY: 'anon-key-de-teste',
      VITE_ADMIN_EMAIL: ADMIN_EMAIL,
    },
  },
});
