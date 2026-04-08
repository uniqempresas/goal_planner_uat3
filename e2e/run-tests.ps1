# Script para executar testes E2E
# Uso: ./run-tests.ps1 [opcional: URL base]

param(
    [string]$BaseUrl = "",
    [string]$TestPattern = "",
    [switch]$SkipWebServer,
    [switch]$UI,
    [switch]$Debug,
    [switch]$Headed
)

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Goal Planner - E2E Test Runner" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Verificar se Playwright está instalado
Write-Host "Verificando Playwright..." -ForegroundColor Yellow
$playwrightExists = Get-Command npx -ErrorAction SilentlyContinue
if (-not $playwrightExists) {
    Write-Host "❌ npx não encontrado. Certifique-se de que Node.js está instalado." -ForegroundColor Red
    exit 1
}

# Verificar se browsers estão instalados
Write-Host "Verificando browsers do Playwright..." -ForegroundColor Yellow
& npx playwright install chromium 2>$null | Out-Null

# Configurar variáveis de ambiente
$env:CI = "false"
if ($BaseUrl) {
    $env:BASE_URL = $BaseUrl
    Write-Host "Usando URL base: $BaseUrl" -ForegroundColor Green
}

if ($SkipWebServer) {
    $env:SKIP_WEB_SERVER = "true"
    Write-Host "Pulando inicialização do servidor web" -ForegroundColor Yellow
}

# Construir comando
$cmd = "npx playwright test"

if ($TestPattern) {
    $cmd += " $TestPattern"
}

if ($UI) {
    $cmd += " --ui"
}

if ($Debug) {
    $cmd += " --debug"
}

if ($Headed) {
    $cmd += " --headed"
}

# Adicionar reporter
$cmd += " --reporter=list"

Write-Host ""
Write-Host "Executando: $cmd" -ForegroundColor Cyan
Write-Host ""

# Executar testes
Invoke-Expression $cmd

$exitCode = $LASTEXITCODE

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan

if ($exitCode -eq 0) {
    Write-Host "✅ Todos os testes passaram!" -ForegroundColor Green
} else {
    Write-Host "❌ Alguns testes falharam (código: $exitCode)" -ForegroundColor Red
    Write-Host ""
    Write-Host "Para ver o relatório HTML:" -ForegroundColor Yellow
    Write-Host "  npx playwright show-report" -ForegroundColor White
}

Write-Host "========================================" -ForegroundColor Cyan

exit $exitCode
