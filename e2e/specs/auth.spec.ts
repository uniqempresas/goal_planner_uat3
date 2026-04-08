import { test, expect } from '@playwright/test';
import { login } from './utils/test-helpers';

/**
 * Teste simples de autenticação
 * Verifica se o login funciona corretamente
 */

test.describe('Autenticação', () => {
  test('deve fazer login com credenciais válidas', async ({ page }) => {
    await page.goto('/login');
    
    // Verificar se formulário está presente
    await expect(page.locator('form')).toBeVisible();
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    
    // Preencher credenciais
    await page.fill('input[type="email"]', 'henriqsillva@gmail.com');
    await page.fill('input[type="password"]', '@HQ29lh19');
    
    // Clicar em entrar
    await page.click('button[type="submit"]');
    
    // Verificar redirecionamento
    await expect(page).toHaveURL(/.*dashboard.*/, { timeout: 30000 });
    
    // Verificar se dashboard carregou
    await expect(page.locator('body')).toBeVisible();
  });
});
