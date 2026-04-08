import { Page, Locator, expect } from '@playwright/test';
import { UI_TIMEOUT, DATA_TIMEOUT } from '../utils/test-helpers';

/**
 * Page Object para Áreas
 */
export class AreasPage {
  readonly page: Page;
  
  constructor(page: Page) {
    this.page = page;
  }
  
  async goto(): Promise<void> {
    await this.page.goto('/areas');
    await this.page.waitForLoadState('networkidle', { timeout: DATA_TIMEOUT });
  }
  
  async gotoCreate(): Promise<void> {
    await this.page.goto('/areas/criar');
    await this.page.waitForSelector('form', { timeout: UI_TIMEOUT });
  }
  
  /**
   * Obter contagem de emojis disponíveis
   */
  async getEmojiOptionsCount(): Promise<number> {
    await this.gotoCreate();
    
    // Procurar por seletor de emoji
    const emojiButtons = this.page.locator('[class*="emoji"], button:has-text("😀"), .emoji-picker button, [role="button"]').first().isVisible()
      ? await this.page.locator('[class*="emoji"], .emoji-picker button, [role="button"]').count()
      : 0;
    
    // Alternativa: procurar por elementos que pareçam ser opções de emoji
    const emojiOptions = this.page.locator('button, [role="button"]').filter({ hasText: /[\u{1F600}-\u{1F64F}]/u });
    const emojiCount = await emojiOptions.count().catch(() => 0);
    
    return Math.max(emojiButtons, emojiCount);
  }
  
  /**
   * Obter contagem de cores disponíveis
   */
  async getColorOptionsCount(): Promise<number> {
    await this.gotoCreate();
    
    // Procurar por seletor de cor
    const colorButtons = this.page.locator('[class*="color"], .color-picker button, [style*="background-color"]').first().isVisible()
      ? await this.page.locator('[class*="color"], .color-picker button, [style*="background-color"]').count()
      : 0;
    
    return colorButtons;
  }
  
  /**
   * Verificar se área tem nome e ícone
   */
  async verifyAreaHasNameAndIcon(areaName: string): Promise<{
    hasName: boolean;
    hasIcon: boolean;
  }> {
    await this.goto();
    
    const areaElement = this.page.locator(`text=${areaName}`).first();
    const hasName = await areaElement.isVisible().catch(() => false);
    
    // Verificar se há ícone próximo ao nome
    const hasIcon = await this.page.locator(`:has-text("${areaName}") svg, :has-text("${areaName}") [class*="icon"]`).first().isVisible().catch(() => false);
    
    return { hasName, hasIcon };
  }
  
  /**
   * Criar uma nova área
   */
  async createArea(nome: string, emoji?: string, cor?: string): Promise<void> {
    await this.gotoCreate();
    
    // Preencher nome
    const nameInput = this.page.locator('input[name="nome"], input[name="name"], input[placeholder*="nome" i]').first();
    await nameInput.fill(nome);
    
    // Selecionar emoji se fornecido
    if (emoji) {
      const emojiButton = this.page.locator(`button:has-text("${emoji}"), [title="${emoji}"]`).first();
      if (await emojiButton.isVisible().catch(() => false)) {
        await emojiButton.click();
      }
    }
    
    // Selecionar cor se fornecida
    if (cor) {
      const colorButton = this.page.locator(`[style*="${cor}"], button[title*="${cor}"]`).first();
      if (await colorButton.isVisible().catch(() => false)) {
        await colorButton.click();
      }
    }
    
    // Salvar
    const submitButton = this.page.locator('button[type="submit"], button:has-text("Salvar"), button:has-text("Criar")').first();
    await submitButton.click();
    
    await this.page.waitForTimeout(2000);
  }
  
  /**
   * Verificar se área existe
   */
  async areaExists(nome: string): Promise<boolean> {
    await this.goto();
    const areaElement = this.page.locator(`text=${nome}`).first();
    return await areaElement.isVisible().catch(() => false);
  }
}
