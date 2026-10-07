#!/usr/bin/env bash
# Unix/Codespaces wrapper for the platform-independent workshop launcher.
set -euo pipefail
cd "$(dirname "$0")/.."
./node_modules/.bin/tsx scripts/workshop.mts "$@"
