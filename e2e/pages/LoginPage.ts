import { Page, Locator, expect } from '@playwright/test';
import { UI_TIMEOUT, DATA_TIMEOUT } from '../utils/test-helpers';

/**
 * Page Object para a página de Login
 */
export class LoginPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;
  readonly errorMessage: Locator;
  
  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.locator('input[type="email"]').first();
    this.passwordInput = page.locator('input[type="password"]').first();
    this.submitButton = page.locator('button[type="submit"]').first();
    this.errorMessage = page.locator('[role="alert"], .error, .text-red').first();
  }
  
  async goto(): Promise<void> {
    await this.page.goto('/login');
    await this.page.waitForSelector('form', { timeout: UI_TIMEOUT });
  }
  
  async login(email: string, password: string): Promise<void> {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
    await this.page.waitForURL(/.*dashboard.*/, { timeout: DATA_TIMEOUT });
  }
  
  async expectError(): Promise<void> {
    await expect(this.errorMessage).toBeVisible({ timeout: UI_TIMEOUT });
  }
}
