import { defineConfig, devices } from '@playwright/test';

/**
 * Configuração do Playwright para testes E2E do Goal Planner
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './e2e',
  
  /* Rodar testes em paralelo */
  fullyParallel: true,
  
  /* Falhar em testes apenas com .only() no CI */
  forbidOnly: !!process.env.CI,
  
  /* Tentativas em caso de falha */
  retries: process.env.CI ? 2 : 1,
  
  /* Workers em paralelo */
  workers: process.env.CI ? 1 : undefined,
  
  /* Repórteres */
  reporter: [
    ['html', { outputFolder: 'playwright-report' }],
    ['list'],
  ],
  
  /* Configurações globais */
  use: {
    /* URL base - usar variável de ambiente ou localhost */
    baseURL: process.env.BASE_URL || 'http://localhost:5173',
    
    /* Coletar trace em caso de falha */
    trace: 'on-first-retry',
    
    /* Screenshot em caso de falha */
    screenshot: 'only-on-failure',
    
    /* Vídeo em caso de falha */
    video: 'on-first-retry',
    
    /* Timeout para ações */
    actionTimeout: 15000,
    
    /* Timeout para navegação */
    navigationTimeout: 30000,
    
    /* Viewport padrão */
    viewport: { width: 1280, height: 720 },
  },
  
  /* Configuração de projetos */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    // Comentado para rodar mais rápido - descomentar se necessário
    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },
    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
  ],
  
  /* Configuração do servidor de desenvolvimento */
  webServer: process.env.SKIP_WEB_SERVER ? undefined : {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  },
});
