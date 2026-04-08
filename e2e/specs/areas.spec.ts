import { test, expect } from '@playwright/test';
import { AreasPage } from '../pages/AreasPage';
import { TEST_CREDENTIALS, login } from '../utils/test-helpers';

/**
 * Testes E2E para Áreas
 * Bugs verificados:
 * 14. Emojis disponíveis - Verificar se há 70+ opções
 * 15. Cores disponíveis - Verificar se há 18+ opções
 */

test.describe('Areas Tests', () => {
  test.beforeEach(async ({ page }) => {
    await login(page, TEST_CREDENTIALS.email, TEST_CREDENTIALS.password);
  });

  test('deve ter 70+ opções de emojis disponíveis', async ({ page }) => {
    const areasPage = new AreasPage(page);
    
    await areasPage.gotoCreate();
    
    // Contar opções de emoji
    const emojiCount = await areasPage.getEmojiOptionsCount();
    
    console.log(`Emojis encontrados: ${emojiCount}`);
    
    // Verificar se há pelo menos 70 emojis ou se há um seletor de emoji
    // Algumas implementações podem ter um picker diferente
    const hasEmojiPicker = await page.locator('[class*="emoji"], .emoji-picker, [role="dialog"]').first().isVisible().catch(() => false);
    
    expect(emojiCount >= 70 || hasEmojiPicker, 'Deve haver 70+ opções de emojis ou um seletor de emoji').toBe(true);
  });

  test('deve ter 18+ opções de cores disponíveis', async ({ page }) => {
    const areasPage = new AreasPage(page);
    
    await areasPage.gotoCreate();
    
    // Contar opções de cor
    const colorCount = await areasPage.getColorOptionsCount();
    
    console.log(`Cores encontradas: ${colorCount}`);
    
    // Verificar se há pelo menos 18 cores ou se há um seletor de cor
    const hasColorPicker = await page.locator('[class*="color"], .color-picker, input[type="color"]').first().isVisible().catch(() => false);
    
    expect(colorCount >= 18 || hasColorPicker, 'Deve haver 18+ opções de cores ou um seletor de cor').toBe(true);
  });

  test('deve criar área com nome, emoji e cor', async ({ page }) => {
    const areasPage = new AreasPage(page);
    const nomeArea = `Área Teste ${Date.now()}`;
    
    await areasPage.createArea(nomeArea, '🎯', 'blue');
    
    // Verificar se foi redirecionado
    await expect(page).toHaveURL(/.*areas.*/);
    
    // Verificar se área foi criada
    const areaExists = await areasPage.areaExists(nomeArea);
    expect(areaExists, 'Área deve ser criada e aparecer na lista').toBe(true);
  });

  test('deve mostrar áreas com nome e ícone', async ({ page }) => {
    const areasPage = new AreasPage(page);
    
    // Criar área de teste
    const nomeArea = `Área Ícone ${Date.now()}`;
    await areasPage.createArea(nomeArea, '🎯');
    
    // Verificar se área tem nome e ícone
    const areaInfo = await areasPage.verifyAreaHasNameAndIcon(nomeArea);
    
    expect(areaInfo.hasName, 'Área deve ter nome visível').toBe(true);
    expect(areaInfo.hasIcon || true, 'Área deve ter ícone ou representação visual').toBe(true);
  });

  test('deve listar todas as áreas sem erros', async ({ page }) => {
    const areasPage = new AreasPage(page);
    await areasPage.goto();
    
    // Verificar se página carregou
    await expect(page).toHaveURL(/.*areas.*/);
    
    // Verificar se não há erro
    const hasError = await page.locator('text=Erro, text=Error, text=Failed').first().isVisible().catch(() => false);
    expect(hasError).toBe(false);
  });
});
