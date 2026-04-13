import { test, expect } from '@playwright/test';

test('debug criacao meta semanal - capturar logs', async ({ page }) => {
  // Array para capturar logs do console
  const consoleLogs: string[] = [];
  
  page.on('console', msg => {
    const logText = `[${msg.type()}] ${msg.text()}`;
    consoleLogs.push(logText);
    console.log(logText); // Também loga no terminal do teste
  });

  page.on('pageerror', error => {
    console.error('Page error:', error.message);
  });

  // 1. Navegar para a página inicial primeiro (verifica se servidor está rodando)
  await page.goto('http://localhost:5173/', { timeout: 10000 });
  
  console.log('Página inicial carregada');
  console.log('URL atual:', page.url());
  
  // Tirar screenshot da página inicial
  await page.screenshot({ path: 'test-results/pagina-inicial.png' });
  
  // 2. Tentar navegar para a página de criação
  await page.goto('http://localhost:5173/metas/semanal/criar', { timeout: 10000 });
  
  // Aguardar a página carregar
  await page.waitForSelector('text=Criar Meta Semanal');
  
  // 2. Preencher o título
  await page.fill('[placeholder="Ex: Finalizar tarefa X"]', 'Meta Semanal Teste Debug');
  
  // 3. Selecionar uma data futura (7 dias a partir de hoje)
  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + 7);
  const dateString = futureDate.toISOString().split('T')[0]; // Formato YYYY-MM-DD
  
  console.log(`Data que será preenchida: ${dateString}`);
  
  await page.fill('input[type="date"]', dateString);
  
  // 4. Capturar valor do campo de data antes de submeter
  const prazoValue = await page.inputValue('input[type="date"]');
  console.log(`Valor capturado do campo prazo: ${prazoValue}`);
  
  // 5. Clicar no botão de criar
  await page.click('button:has-text("Criar Meta Semanal")');
  
  // 6. Aguardar um pouco para ver se há erro ou redirecionamento
  await page.waitForTimeout(3000);
  
  // 7. Verificar se houve erro na página
  const errorVisible = await page.isVisible('text=Dia do mês deve estar entre').catch(() => false);
  
  if (errorVisible) {
    console.log('❌ ERRO ENCONTRADO: Dia do mês deve estar entre 1 e 31');
    
    // Tentar capturar mais detalhes do erro
    const errorText = await page.textContent('body');
    console.log('Conteúdo da página:', errorText?.substring(0, 500));
  } else {
    console.log('✅ Nenhum erro visível na página');
  }
  
  // 8. Verificar URL atual
  const currentUrl = page.url();
  console.log(`URL atual: ${currentUrl}`);
  
  // 9. Dump de todos os logs do console
  console.log('\n========== CONSOLE LOGS ==========');
  consoleLogs.forEach((log, index) => {
    console.log(`${index + 1}. ${log}`);
  });
  console.log('==================================\n');
  
  // 10. Screenshots para análise
  await page.screenshot({ 
    path: 'test-results/meta-semanal-debug.png',
    fullPage: true 
  });
  
  console.log('Screenshot salvo em: test-results/meta-semanal-debug.png');
});
