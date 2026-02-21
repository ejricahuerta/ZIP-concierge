# ZIP Concierge - run API + web (run from repo root in PowerShell)
# Prereq: Node 20+, PostgreSQL. Set apps/api/.env with DATABASE_URL and JWT_SECRET.

$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot

if (-not (Test-Path "node_modules")) {
    Write-Host "Installing dependencies..."
    npm install
    if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
}

if (-not (Test-Path "apps\api\node_modules\.prisma")) {
    Write-Host "Generating Prisma client..."
    npm run db:generate
    if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
}

Write-Host "Starting API and Web in new windows..."
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot'; npm run dev --workspace=api"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot'; npm run dev --workspace=web-public"
Write-Host "API: http://localhost:4000/api/v1"
Write-Host "Web: http://localhost:3000"
Write-Host "Close those windows to stop."
