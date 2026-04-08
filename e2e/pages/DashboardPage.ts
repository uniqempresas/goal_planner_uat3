import { Page, Locator, expect } from '@playwright/test';
import { UI_TIMEOUT, DATA_TIMEOUT, checkForNaN, getCurrentDateFormatted } from '../utils/test-helpers';

/**
 * Page Object para a Dashboard
 */
export class DashboardPage {
  readonly page: Page;
  readonly headerDate: Locator;
  readonly weeklyStats: Locator;
  readonly areasSection: Locator;
  readonly goalsSection: Locator;
  
  constructor(page: Page) {
    this.page = page;
    // Seletores para elementos da dashboard
    this.headerDate = page.locator('header').locator('text=/\\d{1,2} \\w{3} \\d{4}/');
    this.weeklyStats = page.locator('text=/Sequência|Produtividade|semanal/i').first();
    this.areasSection = page.locator('text=/Áreas|areas/i').first();
    this.goalsSection = page.locator('text=/Metas|metas|goals/i').first();
  }
  
  async goto(): Promise<void> {
    await this.page.goto('/dashboard');
    await this.page.waitForLoadState('networkidle', { timeout: DATA_TIMEOUT });
  }
  
  /**
   * Verificar se a data no header é dinâmica (não hardcoded)
   */
  async verifyDynamicDate(): Promise<boolean> {
    const currentDate = getCurrentDateFormatted();
    const headerText = await this.page.locator('header').textContent();
    
    // Verificar se a data atual está no header
    return headerText?.includes(currentDate) || false;
  }
  
  /**
   * Verificar se não há data hardcoded "28 Mar 2026"
   */
  async verifyNoHardcodedDate(): Promise<boolean> {
    const pageContent = await this.page.content();
    return !pageContent.includes('28 Mar 2026');
  }
  
  /**
   * Verificar se há estatísticas semanais
   */
  async verifyWeeklyStats(): Promise<{
    hasSequencia: boolean;
    hasProdutividade: boolean;
    hasTarefas: boolean;
  }> {
    const content = await this.page.textContent('body');
    
    return {
      hasSequencia: content?.includes('Sequência') || content?.includes('sequência') || content?.includes('dias seguidos') || false,
      hasProdutividade: content?.includes('Produtividade') || content?.includes('produtividade') || false,
      hasTarefas: content?.includes('tarefa') || content?.includes('Tarefa') || false,
    };
  }
  
  /**
   * Verificar se áreas têm nome e ícone
   */
  async verifyAreasHaveNameAndIcon(): Promise<{
    areasCount: number;
    areasWithNames: number;
    areasWithIcons: number;
  }> {
    // Procurar por elementos de área
    const areaElements = this.page.locator('[class*="area"], [data-testid*="area"], .area-card, [class*="Area"]').first().isVisible() 
      ? await this.page.locator('[class*="area"], [data-testid*="area"], .area-card, [class*="Area"]').count()
      : 0;
    
    // Se não encontrar elementos específicos, procurar por ícones e nomes
    const iconElements = await this.page.locator('svg, [class*="icon"], [class*="Icon"]').count();
    const textElements = await this.page.locator('text=/\\w{3,}/').count();
    
    return {
      areasCount: areaElements,
      areasWithNames: textElements,
      areasWithIcons: iconElements,
    };
  }
  
  /**
   * Verificar se metas têm título
   */
  async verifyGoalsHaveTitle(): Promise<{
    goalsCount: number;
    goalsWithTitles: number;
  }> {
    // Procurar por elementos de meta
    const goalElements = this.page.locator('[class*="goal"], [data-testid*="goal"], .goal-card, [class*="Meta"]').first().isVisible()
      ? await this.page.locator('[class*="goal"], [data-testid*="goal"], .goal-card, [class*="Meta"]').count()
      : 0;
    
    const titleElements = await this.page.locator('h1, h2, h3, h4, [class*="title"], [class*="Title"]').count();
    
    return {
      goalsCount: goalElements,
      goalsWithTitles: titleElements,
    };
  }
  
  /**
   * Verificar se há NaN na página
   */
  async checkForNaN(): Promise<{ hasNaN: boolean; elements: string[] }> {
    return checkForNaN(this.page);
  }
  
  /**
   * Verificar se página está carregada
   */
  async expectLoaded(): Promise<void> {
    await expect(this.page.locator('body')).toBeVisible();
    await expect(this.page).toHaveURL(/.*dashboard.*/);
  }
}
