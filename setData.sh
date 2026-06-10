#!/usr/bin/env bash
#
# setData.sh — invoke the Jiragotchi demo-data web trigger.
#
# Usage:
#   ./setData.sh --type leaderboard   # seed Custom Entities leaderboard
#   ./setData.sh --type sql           # seed ~7 days of Forge SQL feed events
#   ./setData.sh --type clear         # wipe KVS + Entities + SQL to a clean state
#
# Shorthand also works:
#   ./setData.sh leaderboard
#   ./setData.sh sql
#   ./setData.sh clear
#
# The web trigger base URL is read from a local file `.webtrigger-url`
# (gitignored). Generate it once per environment with:
#
#   forge webtrigger          # interactively pick: demo-data → your install
#   # paste the printed URL into .webtrigger-url, e.g.:
#   echo 'https://<id>.hello.atlassian-dev.net/x1/<token>' > .webtrigger-url
#
# This script appends the action as a path segment, so the final call is e.g.
#   https://.../x1/<token>/sql

set -euo pipefail
cd "$(dirname "$0")"

URL_FILE=".webtrigger-url"
TYPE=""

# --- parse args -------------------------------------------------------------
while [[ $# -gt 0 ]]; do
  case "$1" in
    --type|-t) TYPE="${2:-}"; shift 2 ;;
    leaderboard|entities|sql|clear) TYPE="$1"; shift ;;
    -h|--help)
      grep '^#' "$0" | sed 's/^# \{0,1\}//'; exit 0 ;;
    *) echo "Unknown argument: $1" >&2; exit 1 ;;
  esac
done

# normalise alias
[[ "$TYPE" == "entities" ]] && TYPE="leaderboard"

if [[ -z "$TYPE" ]]; then
  echo "Error: no action given. Use --type leaderboard|sql|clear" >&2
  exit 1
fi

case "$TYPE" in
  leaderboard|sql|clear) ;;
  *) echo "Error: invalid type '$TYPE' (expected leaderboard|sql|clear)" >&2; exit 1 ;;
esac

# --- resolve base URL -------------------------------------------------------
if [[ ! -f "$URL_FILE" ]]; then
  cat >&2 <<EOF
Error: $URL_FILE not found.

Generate a web trigger URL for the 'demo-data' trigger, then save it:
  forge webtrigger
  echo '<the-printed-url>' > $URL_FILE

(See the header of this script for details.)
EOF
  exit 1
fi

BASE_URL="$(tr -d '[:space:]' < "$URL_FILE")"
BASE_URL="${BASE_URL%/}"   # strip any trailing slash
FULL_URL="${BASE_URL}/${TYPE}"

# --- fire -------------------------------------------------------------------
echo "→ ${TYPE}  (${FULL_URL})"
HTTP_BODY="$(curl -fsS -X POST "$FULL_URL")" || {
  echo "Request failed." >&2
  exit 1
}
echo "$HTTP_BODY"
