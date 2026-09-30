#!/bin/bash
# Claude Code on the web: install the tooling and build dist/vex7.js so that
# `npm run build`, `npm test` and `npm run format` work as soon as the session starts.
set -euo pipefail

if [ "${CLAUDE_CODE_REMOTE:-}" != "true" ]; then
  exit 0
fi

cd "$CLAUDE_PROJECT_DIR"
npm install --no-audit --no-fund
npm run build
