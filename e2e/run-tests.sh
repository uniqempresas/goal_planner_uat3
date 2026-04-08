#!/bin/bash

# Script para executar testes E2E no Linux/Mac
# Uso: ./run-tests.sh [opcional: URL base]

set -e

BASE_URL=""
TEST_PATTERN=""
SKIP_WEB_SERVER=""
UI_MODE=""
DEBUG_MODE=""
HEADED=""

# Parse arguments
while [[ $# -gt 0 ]]; do
  case $1 in
    --url|-u)
      BASE_URL="$2"
      shift 2
      ;;
    --pattern|-p)
      TEST_PATTERN="$2"
      shift 2
      ;;
    --skip-server|-s)
      SKIP_WEB_SERVER="true"
      shift
      ;;
    --ui)
      UI_MODE="true"
      shift
      ;;
    --debug|-d)
      DEBUG_MODE="true"
      shift
      ;;
    --headed|-h)
      HEADED="true"
      shift
      ;;
    --help)
      echo "Uso: ./run-tests.sh [opções]"
      echo ""
      echo "Opções:"
      echo "  -u, --url URL         URL base da aplicação"
      echo "  -p, --pattern PATTERN Padrão de testes a executar"
      echo "  -s, --skip-server     Pular inicialização do servidor"
      echo "  --ui                  Rodar em modo UI"
      echo "  -d, --debug           Rodar em modo debug"
      echo "  -h, --headed          Rodar com navegador visível"
      echo "  --help                Mostrar esta ajuda"
      exit 0
      ;;
    *)
      echo "Opção desconhecida: $1"
      exit 1
      ;;
  esac
done

echo "========================================"
echo "  Goal Planner - E2E Test Runner"
echo "========================================"
echo ""

# Verificar se Playwright está instalado
echo "Verificando Playwright..."
if ! command -v npx &> /dev/null; then
    echo "❌ npx não encontrado. Certifique-se de que Node.js está instalado."
    exit 1
fi

# Verificar se browsers estão instalados
echo "Verificando browsers do Playwright..."
npx playwright install chromium 2>/dev/null || true

# Configurar variáveis de ambiente
export CI="false"

if [ -n "$BASE_URL" ]; then
    export BASE_URL="$BASE_URL"
    echo "✓ Usando URL base: $BASE_URL"
fi

if [ -n "$SKIP_WEB_SERVER" ]; then
    export SKIP_WEB_SERVER="true"
    echo "✓ Pulando inicialização do servidor web"
fi

# Construir comando
CMD="npx playwright test"

if [ -n "$TEST_PATTERN" ]; then
    CMD="$CMD $TEST_PATTERN"
fi

if [ -n "$UI_MODE" ]; then
    CMD="$CMD --ui"
fi

if [ -n "$DEBUG_MODE" ]; then
    CMD="$CMD --debug"
fi

if [ -n "$HEADED" ]; then
    CMD="$CMD --headed"
fi

# Adicionar reporter
CMD="$CMD --reporter=list"

echo ""
echo "Executando: $CMD"
echo ""

# Executar testes
if $CMD; then
    echo ""
    echo "========================================"
    echo "✅ Todos os testes passaram!"
    echo "========================================"
    exit 0
else
    EXIT_CODE=$?
    echo ""
    echo "========================================"
    echo "❌ Alguns testes falharam (código: $EXIT_CODE)"
    echo ""
    echo "Para ver o relatório HTML:"
    echo "  npx playwright show-report"
    echo "========================================"
    exit $EXIT_CODE
fi
