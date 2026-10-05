#!/usr/bin/env bash
# Runs both dev servers side by side. Ctrl+C stops both.
#   public:  http://localhost:5173  (its /private page uses the last vault.json from ./build.sh)
#   private: http://localhost:5174  (unencrypted, with live reload)
set -euo pipefail
cd "$(dirname "$0")"

for app in private public; do
	[[ -d "$app/node_modules" ]] || npm --prefix "$app" install
done

trap 'kill 0' EXIT
npm --prefix public run dev -- --port 5173 --strictPort &
npm --prefix private run dev -- --port 5174 --strictPort &
wait
