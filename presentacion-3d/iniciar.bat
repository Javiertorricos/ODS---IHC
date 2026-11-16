@echo off
setlocal
cd /d "%~dp0"
title Presentacion 3D - Biblioteca para Estudiantes
set PORT=8080
where python >nul 2>nul && goto :py
where py >nul 2>nul && goto :pylauncher
where node >nul 2>nul && goto :node
echo No se encontro Python ni Node: abriendo el archivo directamente...
start "" "%~dp0index.html"
exit /b
:py
start "" http://localhost:%PORT%/
echo Presentacion en http://localhost:%PORT%/  (cierra esta ventana para detenerla)
python -m http.server %PORT%
exit /b
:pylauncher
start "" http://localhost:%PORT%/
py -m http.server %PORT%
exit /b
:node
start "" http://localhost:%PORT%/
npx --yes http-server -p %PORT% .
exit /b
