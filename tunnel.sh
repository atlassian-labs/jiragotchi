#!/usr/bin/env bash
# Runs `forge tunnel` with robust cleanup so Ctrl+C never leaves the shell borked.
#
# Note: this script intentionally does NOT run Vite. The Custom UI never changes
# during the demo (all live edits are backend resolver code in src/ops/*), so the
# UI is served from the last `forge deploy`. Just remember to deploy before the
# demo so the deployed UI is current:
#     forge deploy
#
set -e
cd "$(dirname "$0")"

# Snapshot terminal settings up front so we can always restore them, even if a
# child process (or forge tunnel itself) leaves the TTY in a weird state.
SAVED_STTY="$(stty -g 2>/dev/null || true)"

TUNNEL_PID=""

# Recursively kill a process and all its descendants, bottom-up.
kill_tree() {
  local pid="$1"; local sig="${2:-TERM}"
  [ -z "$pid" ] && return
  local child
  for child in $(pgrep -P "$pid" 2>/dev/null || true); do
    kill_tree "$child" "$sig"
  done
  kill "-$sig" "$pid" 2>/dev/null || true
}

cleanup() {
  printf "\n\033[33mShutting down tunnel...\033[0m\n"
  kill_tree "$TUNNEL_PID" TERM
  sleep 1
  kill_tree "$TUNNEL_PID" KILL
  # Belt-and-braces: nuke any orphaned forge tunnel processes
  pkill -KILL -f 'forge.*tunnel' 2>/dev/null || true
  # Restore the terminal to the exact state we captured at startup
  [ -n "$SAVED_STTY" ] && stty "$SAVED_STTY" 2>/dev/null || stty sane 2>/dev/null || true
  printf "\033[32m✓ Clean exit.\033[0m\n"
}
# Run cleanup on Ctrl+C, TERM, and on ANY exit path
trap cleanup INT TERM
trap '[ -n "$SAVED_STTY" ] && stty "$SAVED_STTY" 2>/dev/null || true' EXIT

printf "\033[36mStarting forge tunnel...\033[0m (UI served from last deploy)\n\n"
forge tunnel &
TUNNEL_PID=$!

# Block until forge tunnel exits; Ctrl+C routes through the trap above.
wait "$TUNNEL_PID"
