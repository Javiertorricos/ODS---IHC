@echo off
setlocal
cd /d "%~dp0"
title Biblioteca para Estudiantes
where node >nul 2>nul || (echo Instala Node.js 18+ desde https://nodejs.org & pause & exit /b 1)
if not exist backend\node_modules ( pushd backend & call npm install & popd )
if not exist frontend\node_modules ( pushd frontend & call npm install & popd )
start "API biblioteca (puerto 3001)" cmd /k "cd /d %~dp0backend && npm start"
timeout /t 2 >nul
start "Web biblioteca" cmd /k "cd /d %~dp0frontend && npm run dev -- --open"
