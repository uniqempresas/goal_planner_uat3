import { Page, Locator, expect } from '@playwright/test';
import { UI_TIMEOUT, DATA_TIMEOUT } from '../utils/test-helpers';

/**
 * Page Object para CRUD de Metas
 */
export class MetasPage {
  readonly page: Page;
  
  constructor(page: Page) {
    this.page = page;
  }
  
  async goto(tipo: 'grandes' | 'anual' | 'mensal' | 'semanal' | 'diaria'): Promise<void> {
    await this.page.goto(`/metas/${tipo}`);
    await this.page.waitForLoadState('networkidle', { timeout: DATA_TIMEOUT });
  }
  
  async gotoCreate(tipo: 'grandes' | 'anual' | 'mensal' | 'semanal' | 'diaria'): Promise<void> {
    await this.page.goto(`/metas/${tipo}/criar`);
    await this.page.waitForSelector('form, [data-testid="form"]', { timeout: UI_TIMEOUT });
  }
  
  /**
   * Criar uma nova meta
   */
  async createMeta(titulo: string, descricao?: string): Promise<void> {
    // Preencher título
    const titleInput = this.page.locator('input[name="titulo"], input[name="title"], input[placeholder*="título" i]').first();
    await titleInput.fill(titulo);
    
    // Preencher descrição se fornecida
    if (descricao) {
      const descInput = this.page.locator('textarea[name="descricao"], textarea[name="description"], input[name="descricao"]').first();
      if (await descInput.isVisible().catch(() => false)) {
        await descInput.fill(descricao);
      }
    }
    
    // Clicar em salvar/criar
    const submitButton = this.page.locator('button[type="submit"], button:has-text("Salvar"), button:has-text("Criar")').first();
    await submitButton.click();
    
    // Aguardar redirecionamento ou mensagem de sucesso
    await this.page.waitForTimeout(2000);
  }
  
  /**
   * Editar uma meta existente
   */
  async editMeta(id: string, novoTitulo: string): Promise<void> {
    await this.page.goto(`/metas/grandes/${id}/editar`);
    await this.page.waitForSelector('form', { timeout: UI_TIMEOUT });
    
    const titleInput = this.page.locator('input[name="titulo"], input[name="title"]').first();
    await titleInput.fill(novoTitulo);
    
    const submitButton = this.page.locator('button[type="submit"], button:has-text("Salvar")').first();
    await submitButton.click();
    
    await this.page.waitForTimeout(2000);
  }
  
  /**
   * Excluir uma meta
   */
  async deleteMeta(id: string): Promise<void> {
    await this.page.goto(`/metas/grandes/${id}`);
    await this.page.waitForLoadState('networkidle', { timeout: DATA_TIMEOUT });
    
    // Clicar em excluir
    const deleteButton = this.page.locator('button:has-text("Excluir"), button:has-text("Deletar"), [data-testid="delete-button"]').first();
    await deleteButton.click();
    
    // Confirmar exclusão se houver modal
    const confirmButton = this.page.locator('button:has-text("Confirmar"), button:has-text("Sim"), button:has-text("Excluir")').first();
    if (await confirmButton.isVisible().catch(() => false)) {
      await confirmButton.click();
    }
    
    await this.page.waitForTimeout(2000);
  }
  
  /**
   * Criar meta filha
   */
  async createChildMeta(parentId: string, titulo: string): Promise<void> {
    await this.page.goto(`/metas/grandes/${parentId}`);
    await this.page.waitForLoadState('networkidle', { timeout: DATA_TIMEOUT });
    
    // Clicar em adicionar meta filha
    const addButton = this.page.locator('button:has-text("Adicionar"), button:has-text("Criar meta"), a:has-text("Criar")').first();
    await addButton.click();
    
    // Preencher formulário
    const titleInput = this.page.locator('input[name="titulo"], input[name="title"]').first();
    await titleInput.fill(titulo);
    
    const submitButton = this.page.locator('button[type="submit"], button:has-text("Salvar")').first();
    await submitButton.click();
    
    await this.page.waitForTimeout(2000);
  }
  
  /**
   * Verificar se meta existe na lista
   */
  async metaExists(titulo: string): Promise<boolean> {
    const metaElement = this.page.locator(`text=${titulo}`).first();
    return await metaElement.isVisible().catch(() => false);
  }
  
  /**
   * Obter URL atual
   */
  async getCurrentUrl(): Promise<string> {
    return this.page.url();
  }
}
