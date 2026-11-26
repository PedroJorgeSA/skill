#!/usr/bin/env bash
# Tira uma captura 1920×1080 de cada slide, no quadro final (?static).
# Uso: scripts/capturar.sh <pasta-do-deck> [pasta-de-saida]
# Precisa de Chrome/Chromium. Defina CHROME=/caminho se não for achado sozinho.
set -euo pipefail
DECK="${1:?informe a pasta do deck}"; OUT="${2:-$DECK/capturas}"; PORT="${PORT:-4399}"
mkdir -p "$OUT"
if [ -z "${CHROME:-}" ]; then
  for c in \
    "$(ls -d "$HOME"/Library/Caches/ms-playwright/chromium_headless_shell-*/*/chrome-headless-shell 2>/dev/null | tail -1)" \
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
    "$(command -v chromium || true)" "$(command -v google-chrome || true)"; do
    [ -n "$c" ] && [ -x "$c" ] && CHROME="$c" && break
  done
fi
[ -n "${CHROME:-}" ] || { echo "Chrome não encontrado; defina CHROME=" >&2; exit 1; }

( cd "$DECK" && python3 -m http.server "$PORT" >/dev/null 2>&1 ) & SRV=$!
trap 'kill $SRV 2>/dev/null' EXIT
sleep 1
N=$(grep -c '<section class="slide' "$DECK/index.html")
for i in $(seq 1 "$N"); do
  "$CHROME" --headless --use-angle=swiftshader --enable-unsafe-swiftshader --hide-scrollbars \
    --window-size=1920,1080 --virtual-time-budget=4000 \
    --screenshot="$OUT/$(printf %02d "$i").png" "http://127.0.0.1:$PORT/?static#$i" >/dev/null 2>&1 &
  P=$!; ( sleep 25; kill $P 2>/dev/null ) & wait $P 2>/dev/null || true
done
echo "$N capturas em $OUT"
