# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: meta-semanal-debug.spec.ts >> debug criacao meta semanal - capturar logs
- Location: e2e\meta-semanal-debug.spec.ts:3:1

# Error details

```
TimeoutError: page.waitForSelector: Timeout 15000ms exceeded.
Call log:
  - waiting for locator('text=Criar Meta Semanal') to be visible

```

# Page snapshot

```yaml
- generic [ref=e3]:
  - generic [ref=e4]: "[plugin:vite:import-analysis] Failed to resolve import \"../components/metas/MetaCardModern\" from \"src/app/pages/metas/MetasListPageModern.tsx\". Does the file exist?"
  - generic [ref=e5]: C:/Users/henri/.gemini/antigravity/playground/vector-perseverance/goal_planner_uat3/src/app/pages/metas/MetasListPageModern.tsx:19:31
  - generic [ref=e6]: "32 | } from \"lucide-react\"; 33 | import { useApp } from \"../../contexts/AppContext\"; 34 | import { MetaCardModern } from \"../components/metas/MetaCardModern\"; | ^ 35 | import { StatsCard } from \"../components/metas/StatsCard\"; 36 | import { FocusingQuestionCard } from \"../components/metas/FocusingQuestionCard\";"
  - generic [ref=e7]: at TransformPluginContext._formatLog (file:///C:/Users/henri/.gemini/antigravity/playground/vector-perseverance/goal_planner_uat3/node_modules/vite/dist/node/chunks/dep-DBxKXgDP.js:42499:41) at TransformPluginContext.error (file:///C:/Users/henri/.gemini/antigravity/playground/vector-perseverance/goal_planner_uat3/node_modules/vite/dist/node/chunks/dep-DBxKXgDP.js:42496:16) at normalizeUrl (file:///C:/Users/henri/.gemini/antigravity/playground/vector-perseverance/goal_planner_uat3/node_modules/vite/dist/node/chunks/dep-DBxKXgDP.js:40475:23) at process.processTicksAndRejections (node:internal/process/task_queues:103:5) at async file:///C:/Users/henri/.gemini/antigravity/playground/vector-perseverance/goal_planner_uat3/node_modules/vite/dist/node/chunks/dep-DBxKXgDP.js:40594:37 at async Promise.all (index 8) at async TransformPluginContext.transform (file:///C:/Users/henri/.gemini/antigravity/playground/vector-perseverance/goal_planner_uat3/node_modules/vite/dist/node/chunks/dep-DBxKXgDP.js:40521:7) at async EnvironmentPluginContainer.transform (file:///C:/Users/henri/.gemini/antigravity/playground/vector-perseverance/goal_planner_uat3/node_modules/vite/dist/node/chunks/dep-DBxKXgDP.js:42294:18) at async loadAndTransform (file:///C:/Users/henri/.gemini/antigravity/playground/vector-perseverance/goal_planner_uat3/node_modules/vite/dist/node/chunks/dep-DBxKXgDP.js:35735:27) at async viteTransformMiddleware (file:///C:/Users/henri/.gemini/antigravity/playground/vector-perseverance/goal_planner_uat3/node_modules/vite/dist/node/chunks/dep-DBxKXgDP.js:37250:24
  - generic [ref=e8]:
    - text: Click outside, press Esc key, or fix the code to dismiss.
    - text: You can also disable this overlay by setting
    - code [ref=e9]: server.hmr.overlay
    - text: to
    - code [ref=e10]: "false"
    - text: in
    - code [ref=e11]: vite.config.ts
    - text: .
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test('debug criacao meta semanal - capturar logs', async ({ page }) => {
  4  |   // Array para capturar logs do console
  5  |   const consoleLogs: string[] = [];
  6  |   
  7  |   page.on('console', msg => {
  8  |     const logText = `[${msg.type()}] ${msg.text()}`;
  9  |     consoleLogs.push(logText);
  10 |     console.log(logText); // Também loga no terminal do teste
  11 |   });
  12 | 
  13 |   page.on('pageerror', error => {
  14 |     console.error('Page error:', error.message);
  15 |   });
  16 | 
  17 |   // 1. Navegar para a página de criação
  18 |   await page.goto('http://localhost:5173/metas/semanal/criar');
  19 |   
  20 |   // Aguardar a página carregar
> 21 |   await page.waitForSelector('text=Criar Meta Semanal');
     |              ^ TimeoutError: page.waitForSelector: Timeout 15000ms exceeded.
  22 |   
  23 |   // 2. Preencher o título
  24 |   await page.fill('[placeholder="Ex: Finalizar tarefa X"]', 'Meta Semanal Teste Debug');
  25 |   
  26 |   // 3. Selecionar uma data futura (7 dias a partir de hoje)
  27 |   const futureDate = new Date();
  28 |   futureDate.setDate(futureDate.getDate() + 7);
  29 |   const dateString = futureDate.toISOString().split('T')[0]; // Formato YYYY-MM-DD
  30 |   
  31 |   console.log(`Data que será preenchida: ${dateString}`);
  32 |   
  33 |   await page.fill('input[type="date"]', dateString);
  34 |   
  35 |   // 4. Capturar valor do campo de data antes de submeter
  36 |   const prazoValue = await page.inputValue('input[type="date"]');
  37 |   console.log(`Valor capturado do campo prazo: ${prazoValue}`);
  38 |   
  39 |   // 5. Clicar no botão de criar
  40 |   await page.click('button:has-text("Criar Meta Semanal")');
  41 |   
  42 |   // 6. Aguardar um pouco para ver se há erro ou redirecionamento
  43 |   await page.waitForTimeout(3000);
  44 |   
  45 |   // 7. Verificar se houve erro na página
  46 |   const errorVisible = await page.isVisible('text=Dia do mês deve estar entre').catch(() => false);
  47 |   
  48 |   if (errorVisible) {
  49 |     console.log('❌ ERRO ENCONTRADO: Dia do mês deve estar entre 1 e 31');
  50 |     
  51 |     // Tentar capturar mais detalhes do erro
  52 |     const errorText = await page.textContent('body');
  53 |     console.log('Conteúdo da página:', errorText?.substring(0, 500));
  54 |   } else {
  55 |     console.log('✅ Nenhum erro visível na página');
  56 |   }
  57 |   
  58 |   // 8. Verificar URL atual
  59 |   const currentUrl = page.url();
  60 |   console.log(`URL atual: ${currentUrl}`);
  61 |   
  62 |   // 9. Dump de todos os logs do console
  63 |   console.log('\n========== CONSOLE LOGS ==========');
  64 |   consoleLogs.forEach((log, index) => {
  65 |     console.log(`${index + 1}. ${log}`);
  66 |   });
  67 |   console.log('==================================\n');
  68 |   
  69 |   // 10. Screenshots para análise
  70 |   await page.screenshot({ 
  71 |     path: 'test-results/meta-semanal-debug.png',
  72 |     fullPage: true 
  73 |   });
  74 |   
  75 |   console.log('Screenshot salvo em: test-results/meta-semanal-debug.png');
  76 | });
  77 | 
```