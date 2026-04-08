import { test as base, expect, Page } from '@playwright/test';

/**
 * Credenciais de teste
 */
export const TEST_CREDENTIALS = {
  email: 'henriqsillva@gmail.com',
  password: '@HQ29lh19',
};

/**
 * Timeout padrão para operações de UI
 */
export const UI_TIMEOUT = 15000;

/**
 * Timeout para carregamento de dados
 */
export const DATA_TIMEOUT = 30000;

/**
 * Helper para login no sistema
 */
export async function login(page: Page, email: string, password: string): Promise<void> {
  await page.goto('/login');
  await page.waitForSelector('[data-testid="login-form"], form', { timeout: UI_TIMEOUT });
  
  // Preencher formulário de login
  const emailInput = page.locator('input[type="email"], input[name="email"], input[placeholder*="email" i]').first();
  const passwordInput = page.locator('input[type="password"], input[name="password"]').first();
  const submitButton = page.locator('button[type="submit"], button:has-text("Entrar"), button:has-text("Login")').first();
  
  await emailInput.fill(email);
  await passwordInput.fill(password);
  await submitButton.click();
  
  // Aguardar redirecionamento para dashboard
  await page.waitForURL(/.*dashboard.*/, { timeout: DATA_TIMEOUT });
}

/**
 * Helper para logout
 */
export async function logout(page: Page): Promise<void> {
  const logoutButton = page.locator('button[title="Sair"], button:has-text("Sair"), [data-testid="logout-button"]').first();
  if (await logoutButton.isVisible().catch(() => false)) {
    await logoutButton.click();
    await page.waitForURL(/.*login|.*/, { timeout: UI_TIMEOUT });
  }
}

/**
 * Helper para verificar se há NaN na página
 */
export async function checkForNaN(page: Page): Promise<{ hasNaN: boolean; elements: string[] }> {
  const result = await page.evaluate(() => {
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    const nanElements: string[] = [];
    let node: Node | null;
    
    while ((node = walker.nextNode())) {
      const text = node.textContent || '';
      if (text.includes('NaN') || text.includes('nan')) {
        const parent = node.parentElement;
        if (parent) {
          nanElements.push(`${parent.tagName}: ${text.trim()}`);
        }
      }
    }
    
    return { hasNaN: nanElements.length > 0, elements: nanElements };
  });
  
  return result;
}

/**
 * Helper para obter data atual formatada em pt-BR
 */
export function getCurrentDateFormatted(): string {
  const today = new Date();
  return today.toLocaleDateString('pt-BR', { 
    day: 'numeric', 
    month: 'short', 
    year: 'numeric' 
  });
}

/**
 * Helper para obter data específica formatada
 */
export function getDateFormatted(date: Date): string {
  return date.toLocaleDateString('pt-BR', { 
    day: 'numeric', 
    month: 'short', 
    year: 'numeric' 
  });
}

/**
 * Esperar por toast/notificação
 */
export async function waitForToast(page: Page, text?: string, timeout: number = 10000): Promise<void> {
  const toastSelector = '[role="alert"], .toast, .notification, [data-testid="toast"]',
  if (text) {
    await expect(page.locator(toastSelector).filter({ hasText: text })).toBeVisible({ timeout });
  } else {
    await expect(page.locator(toastSelector).first()).toBeVisible({ timeout });
  }
}

/**
 * Clicar em botão e aguardar navegação
 */
export async function clickAndWaitForNavigation(
  page: Page, 
  selector: string, 
  expectedUrl?: string | RegExp
): Promise<void> {
  await Promise.all([
    page.waitForNavigation({ timeout: DATA_TIMEOUT }),
    page.click(selector),
  ]);
  
  if (expectedUrl) {
    await expect(page).toHaveURL(expectedUrl);
  }
}

/**
 * Preencher formulário com dados
 */
export async function fillForm(page: Page, data: Record<string, string>): Promise<void> {
  for (const [field, value] of Object.entries(data)) {
    const input = page.locator(`[name="${field}"], [data-testid="${field}"], input[placeholder*="${field}" i]`).first();
    await input.fill(value);
  }
}

/**
 * Test estendido com fixtures customizadas
 */
export const test = base.extend<{
  authenticatedPage: Page;
}>({
  authenticatedPage: async ({ page }, use) => {
    await login(page, TEST_CREDENTIALS.email, TEST_CREDENTIALS.password);
    await use(page);
    await logout(page);
  },
});

export { expect };
