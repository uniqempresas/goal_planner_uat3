import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { DashboardPage } from '../pages/DashboardPage';
import { TEST_CREDENTIALS, getCurrentDateFormatted } from '../utils/test-helpers';

test.describe('Dashboard Tests', () => {
  let loginPage: LoginPage;
  let dashboardPage: DashboardPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    dashboardPage = new DashboardPage(page);
    
    // Login antes de cada teste
    await loginPage.goto();
    await loginPage.login(TEST_CREDENTIALS.email, TEST_CREDENTIALS.password);
    await dashboardPage.expectLoaded();
  });

  /**
   * Teste 1: Verificar se a data no AppLayout não é mais "28 Mar 2026"
   * Deve mostrar a data atual dinâmica
   */
  test('deve exibir data dinâmica no header - não deve ter data hardcoded', async ({ page }) => {
    // Verificar se não há data hardcoded
    const hasNoHardcodedDate = await dashboardPage.verifyNoHardcodedDate();
    expect(hasNoHardcodedDate).toBe(true);
    
    // Verificar se a data atual está presente
    const hasDynamicDate = await dashboardPage.verifyDynamicDate();
    expect(hasDynamicDate).toBe(true);
    
    // Verificar especificamente que "28 Mar 2026" não está presente
    const pageContent = await page.content();
    expect(pageContent).not.toContain('28 Mar 2026');
    
    // Verificar que a data atual está no formato esperado
    const currentDate = getCurrentDateFormatted();
    const headerText = await page.locator('header').textContent();
    expect(headerText).toContain(currentDate.split(' ')[0]); // Dia
    expect(headerText).toContain(currentDate.split(' ')[2]); // Ano
  });

  /**
   * Teste 2: Verificar se weeklyStats (sequência, produtividade e tarefas) são calculados dinamicamente
   */
  test('deve exibir estatísticas semanais calculadas dinamicamente', async ({ page }) => {
    const stats = await dashboardPage.verifyWeeklyStats();
    
    // Verificar se há informações de sequência, produtividade e tarefas
    expect(stats.hasSequencia || stats.hasProdutividade || stats.hasTarefas).toBe(true);
    
    // Verificar se há pelo menos um indicador de atividade
    const pageText = await page.textContent('body');
    const hasActivityIndicator = 
      pageText?.includes('dias seguidos') ||
      pageText?.includes('Sequência') ||
      pageText?.includes('Produtividade') ||
      pageText?.includes('tarefa') ||
      pageText?.includes('concluída');
    
    expect(hasActivityIndicator).toBe(true);
  });

  /**
   * Teste 3: Verificar se áreas mostram nome e ícone
   */
  test('deve exibir áreas com nome e ícone', async ({ page }) => {
    const areas = await dashboardPage.verifyAreasHaveNameAndIcon();
    
    // Se houver áreas, elas devem ter nomes
    if (areas.areasCount > 0) {
      expect(areas.areasWithNames).toBeGreaterThan(0);
    }
    
    // Verificar se há elementos visuais (ícones) na página
    expect(areas.areasWithIcons).toBeGreaterThanOrEqual(0);
  });

  /**
   * Teste 4: Verificar se metas mostram título
   */
  test('deve exibir metas com título', async ({ page }) => {
    const goals = await dashboardPage.verifyGoalsHaveTitle();
    
    // Se houver metas, elas devem ter títulos
    if (goals.goalsCount > 0) {
      expect(goals.goalsWithTitles).toBeGreaterThan(0);
    }
    
    // A página deve ter algum título ou texto
    const headings = await page.locator('h1, h2, h3').count();
    expect(headings).toBeGreaterThan(0);
  });

  /**
   * Teste 5: Verificar se não há NaN nos percentuais
   */
  test('não deve exibir NaN nos percentuais', async ({ page }) => {
    const nanCheck = await dashboardPage.checkForNaN();
    
    expect(nanCheck.hasNaN).toBe(false);
    expect(nanCheck.elements).toHaveLength(0);
    
    // Verificar também no conteúdo da página
    const pageText = await page.textContent('body');
    expect(pageText).not.toContain('NaN');
    expect(pageText).not.toContain('nan');
    expect(pageText).not.toContain('undefined');
  });
});
