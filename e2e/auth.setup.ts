import { test as setup, expect } from '@playwright/test';
import { TEST_CREDENTIALS, login } from './utils/test-helpers';
import path from 'path';

/**
 * Setup de autenticação para reutilizar estado entre testes
 * Isso evita ter que fazer login em cada teste individual
 */

const authFile = path.join(__dirname, '../playwright/.auth/user.json');

setup('authenticate', async ({ page }) => {
  // Realizar login
  await login(page, TEST_CREDENTIALS.email, TEST_CREDENTIALS.password);
  
  // Verificar se chegou ao dashboard
  await expect(page).toHaveURL(/.*dashboard.*/);
  await expect(page.locator('body')).toBeVisible();
  
  // Salvar estado de autenticação
  await page.context().storageState({ path: authFile });
});
