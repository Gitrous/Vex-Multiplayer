#!/usr/bin/env bash
# Runs every time the Codespace is opened or refreshed (devcontainer.json, postAttachCommand):
#   1. fetch the repository's default branch and fast-forward to it (VEX_BRANCH=... picks another);
#      local changes are never overwritten: with uncommitted edits the update is skipped
#   2. npm install when package.json / package-lock.json changed, then npm run build
#   3. stop the running multiplayer server and start it again in the background
# Can also be run by hand: bash .devcontainer/update-and-serve.sh
set -u
cd "$(dirname "$0")/.."

PORT="${PORT:-8080}"
LOG=/tmp/vex-server.log
PIDFILE=/tmp/vex-server.pid

# Opening several tabs at once must not run two updates side by side.
exec 9>/tmp/vex-update.lock
if ! flock -n 9; then
  echo "Ya hay una actualización en marcha."
  exit 0
fi

echo "== 1/3 Actualizando el código =="
if git fetch --quiet origin; then
  branch="${VEX_BRANCH:-$(git remote show origin 2>/dev/null | sed -n 's/.*HEAD branch: //p')}"
  branch="${branch:-$(git rev-parse --abbrev-ref HEAD)}"
  if ! git diff --quiet || ! git diff --cached --quiet; then
    echo "Hay cambios sin guardar en git: no actualizo para no perderlos (git status para verlos)."
  else
    if [ "$(git rev-parse --abbrev-ref HEAD)" != "$branch" ]; then
      git checkout --quiet "$branch" || git checkout --quiet -b "$branch" "origin/$branch"
    fi
    if ! git merge-base --is-ancestor HEAD "origin/$branch"; then
      echo "Tu rama $branch tiene commits que no están en GitHub: no actualizo (git status para verlo)."
    elif git merge --quiet --ff-only "origin/$branch"; then
      echo "Rama $branch al día: $(git log -1 --format='%h %s')"
    else
      echo "No se pudo actualizar (¿archivos nuevos sin guardar en git con el mismo nombre?): git status para verlo."
    fi
  fi
else
  echo "No se pudo contactar con GitHub: sigo con el código que ya hay."
fi

echo "== 2/3 Compilando =="
deps_hash="$(cat package.json package-lock.json 2>/dev/null | sha1sum | cut -d' ' -f1)"
if [ ! -d node_modules ] || [ "$(cat node_modules/.vex-deps-hash 2>/dev/null)" != "$deps_hash" ]; then
  npm install --no-audit --no-fund && echo "$deps_hash" > node_modules/.vex-deps-hash
fi
if ! npm run --silent build; then
  echo "La compilación ha fallado: el servidor no se reinicia."
  exit 1
fi

echo "== 3/3 Reiniciando el servidor =="
if [ -f "$PIDFILE" ]; then
  kill "$(cat "$PIDFILE")" 2>/dev/null
  rm -f "$PIDFILE"
fi
# Also one started by hand in a terminal (npm start / npm run dev), which would keep the port busy.
pkill -f "^node server/server.mjs" 2>/dev/null
pkill -f "^node tools/build.mjs --serve" 2>/dev/null
for _ in $(seq 20); do
  curl -s -o /dev/null "http://127.0.0.1:$PORT/" || break
  sleep 0.25
done

# setsid + nohup: the server keeps running after this script (and the tab that started it) ends.
# 9>&-: it must not inherit the lock, or the next update would think this one never finished.
PORT="$PORT" setsid nohup node server/server.mjs >>"$LOG" 2>&1 </dev/null 9>&- &
echo $! >"$PIDFILE"
for _ in $(seq 40); do
  if curl -s -o /dev/null "http://127.0.0.1:$PORT/"; then
    if [ -n "${CODESPACE_NAME:-}" ]; then
      url="https://$CODESPACE_NAME-$PORT.${GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN:-app.github.dev}/"
    else
      url="http://localhost:$PORT/"
    fi
    echo "Servidor en marcha: $url   (registro: $LOG)"
    exit 0
  fi
  sleep 0.25
done
echo "El servidor no arranca. Últimas líneas de $LOG:"
tail -n 20 "$LOG"
exit 1
