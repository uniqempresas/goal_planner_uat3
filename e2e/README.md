# Testes E2E - Goal Planner

Este diretório contém os testes end-to-end do Goal Planner usando Playwright.

## Estrutura

```
e2e/
├── auth.setup.ts          # Setup de autenticação
├── fixtures/              # Dados de teste
├── pages/                 # Page Objects
│   ├── LoginPage.ts
│   ├── DashboardPage.ts
│   ├── MetasPage.ts
│   ├── AgendaPage.ts
│   └── AreasPage.ts
├── specs/                 # Testes específicos
│   ├── dashboard.spec.ts
│   ├── metas-crud.spec.ts
│   ├── agenda.spec.ts
│   └── areas.spec.ts
└── utils/                 # Utilitários
    └── test-helpers.ts
```

## Executando os Testes

```bash
# Instalar browsers (primeira vez)
npx playwright install

# Rodar todos os testes
npx playwright test

# Rodar testes específicos
npx playwright test dashboard
npx playwright test metas-crud
npx playwright test agenda
npx playwright test areas

# Rodar com UI
npx playwright test --ui

# Rodar em modo debug
npx playwright test --debug

# Gerar relatório HTML
npx playwright show-report
```

## Credenciais de Teste

- Email: henriqsillva@gmail.com
- Senha: @HQ29lh19

## Variáveis de Ambiente

```bash
# Usar URL diferente (produção/staging)
BASE_URL=https://goal-planner.vercel.app npx playwright test

# Pular inicialização do servidor web
SKIP_WEB_SERVER=true npx playwright test

# Rodar em modo CI
CI=true npx playwright test
```
