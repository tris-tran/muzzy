#!/usr/bin/env bash
# Builds everything (see build.sh) and serves the real static site, like GitHub Pages would.
#   ./run.sh          serves docs/ on http://localhost:8000
#   ./run.sh 9000     serves on another port
set -euo pipefail
cd "$(dirname "$0")"

./build.sh

port="${1:-8000}"
echo "==> Serving docs/ on http://localhost:$port (Ctrl+C to stop)"
exec python3 -m http.server "$port" --bind 127.0.0.1 --directory docs
