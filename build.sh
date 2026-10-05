#!/usr/bin/env bash
# Builds the private site, encrypts it into public/static/vault.json,
# then builds the public site into docs/ (what GitHub Pages serves).
set -euo pipefail
cd "$(dirname "$0")"

if [[ -z "${MUZZY_PASSWORD:-}" ]]; then
	read -rsp "Password: " MUZZY_PASSWORD; echo
	read -rsp "Repeat password: " confirm; echo
	[[ "$MUZZY_PASSWORD" == "$confirm" ]] || { echo "Passwords don't match" >&2; exit 1; }
fi
export MUZZY_PASSWORD

for app in private public; do
	[[ -d "$app/node_modules" ]] || npm --prefix "$app" install
done

echo "==> Building private"
npm --prefix private run build
npm --prefix private run encrypt

echo "==> Building public"
npm --prefix public run build
