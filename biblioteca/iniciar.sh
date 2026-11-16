#!/usr/bin/env bash
# Biblioteca para Estudiantes - Linux / macOS: instala (si hace falta) y arranca API + web
cd "$(dirname "$0")" || exit 1
command -v node >/dev/null 2>&1 || { echo "Instala Node.js 18+ desde https://nodejs.org"; exit 1; }
[ -d backend/node_modules ]  || (cd backend  && npm install)
[ -d frontend/node_modules ] || (cd frontend && npm install)
trap 'kill 0' EXIT
(cd backend && npm start) &
sleep 2
(cd frontend && npm run dev -- --open) &
wait
