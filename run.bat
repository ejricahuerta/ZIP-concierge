@echo off
REM ZIP Concierge - run API + web. Prereq: Node 20+, PostgreSQL. Set apps\api\.env
cd /d "%~dp0"

if not exist node_modules (
  echo Installing dependencies...
  call npm install
  if errorlevel 1 exit /b 1
)

if not exist apps\api\node_modules\.prisma (
  echo Generating Prisma client...
  call npm run db:generate
  if errorlevel 1 exit /b 1
)

echo Starting API and Web in separate windows...
start "ZIP API" cmd /k "cd /d %~dp0 && npm run dev --workspace=api"
start "ZIP Web" cmd /k "cd /d %~dp0 && npm run dev --workspace=web-public"
echo API: http://localhost:4000/api/v1
echo Web: http://localhost:3000
echo Close the API and Web windows to stop.
