#!/usr/bin/env bash
# Presentacion 3D - Linux / macOS
cd "$(dirname "$0")" || exit 1
PORT=8080
URL="http://localhost:$PORT/"
abrir() { (sleep 1; xdg-open "$1" || open "$1") >/dev/null 2>&1 & }
if command -v python3 >/dev/null 2>&1; then
  abrir "$URL"; echo "Presentacion en $URL (Ctrl+C para detener)"; exec python3 -m http.server "$PORT"
elif command -v python >/dev/null 2>&1; then
  abrir "$URL"; exec python -m http.server "$PORT"
elif command -v npx >/dev/null 2>&1; then
  abrir "$URL"; exec npx --yes http-server -p "$PORT" .
else
  echo "Sin servidor disponible: abriendo index.html directamente"
  abrir "file://$PWD/index.html"; sleep 2
fi
