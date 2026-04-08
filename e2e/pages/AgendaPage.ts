import { Page, Locator, expect } from '@playwright/test';
import { UI_TIMEOUT, DATA_TIMEOUT } from '../utils/test-helpers';

/**
 * Page Object para Agenda
 */
export class AgendaPage {
  readonly page: Page;
  
  constructor(page: Page) {
    this.page = page;
  }
  
  async gotoHoje(): Promise<void> {
    await this.page.goto('/agenda/hoje');
    await this.page.waitForLoadState('networkidle', { timeout: DATA_TIMEOUT });
  }
  
  async gotoSemana(): Promise<void> {
    await this.page.goto('/agenda/semana');
    await this.page.waitForLoadState('networkidle', { timeout: DATA_TIMEOUT });
  }
  
  async gotoCreateTarefa(): Promise<void> {
    await this.page.goto('/agenda/tarefas/criar');
    await this.page.waitForSelector('form', { timeout: UI_TIMEOUT });
  }
  
  /**
   * Criar uma nova tarefa
   */
  async createTarefa(titulo: string, descricao?: string): Promise<void> {
    await this.gotoCreateTarefa();
    
    // Preencher título
    const titleInput = this.page.locator('input[name="titulo"], input[name="title"], input[placeholder*="título" i]').first();
    await titleInput.fill(titulo);
    
    // Preencher descrição se fornecida
    if (descricao) {
      const descInput = this.page.locator('textarea[name="descricao"], textarea[name="description"]').first();
      if (await descInput.isVisible().catch(() => false)) {
        await descInput.fill(descricao);
      }
    }
    
    // Clicar em salvar
    const submitButton = this.page.locator('button[type="submit"], button:has-text("Salvar"), button:has-text("Criar")').first();
    await submitButton.click();
    
    await this.page.waitForTimeout(2000);
  }
  
  /**
   * Editar uma tarefa
   */
  async editTarefa(id: string, novoTitulo: string): Promise<void> {
    await this.page.goto(`/agenda/tarefas/${id}/editar`);
    await this.page.waitForSelector('form', { timeout: UI_TIMEOUT });
    
    const titleInput = this.page.locator('input[name="titulo"], input[name="title"]').first();
    await titleInput.fill(novoTitulo);
    
    const submitButton = this.page.locator('button[type="submit"], button:has-text("Salvar")').first();
    await submitButton.click();
    
    await this.page.waitForTimeout(2000);
  }
  
  /**
   * Excluir uma tarefa
   */
  async deleteTarefa(id: string): Promise<void> {
    await this.page.goto(`/agenda/tarefas/${id}`);
    await this.page.waitForLoadState('networkidle', { timeout: DATA_TIMEOUT });
    
    const deleteButton = this.page.locator('button:has-text("Excluir"), button:has-text("Deletar")').first();
    await deleteButton.click();
    
    // Confirmar exclusão
    const confirmButton = this.page.locator('button:has-text("Confirmar"), button:has-text("Sim")').first();
    if (await confirmButton.isVisible().catch(() => false)) {
      await confirmButton.click();
    }
    
    await this.page.waitForTimeout(2000);
  }
  
  /**
   * Verificar se tarefa existe na lista
   */
  async tarefaExists(titulo: string): Promise<boolean> {
    await this.gotoHoje();
    const tarefaElement = this.page.locator(`text=${titulo}`).first();
    return await tarefaElement.isVisible().catch(() => false);
  }
  
  /**
   * Obter contagem de tarefas na lista
   */
  async getTarefasCount(): Promise<number> {
    await this.gotoHoje();
    const tarefas = this.page.locator('[class*="tarefa"], [data-testid*="tarefa"], .task-item').first().isVisible()
      ? await this.page.locator('[class*="tarefa"], [data-testid*="tarefa"], .task-item').count()
      : 0;
    return tarefas;
  }
}
