#!/usr/bin/env bash
set -euo pipefail

REPO_URL="https://github.com/marijanalibaba-pixel/monte-carlo-app.git"
DEFAULT_EMAIL="${GIT_EMAIL:-you@example.com}"   # promijeni kasnije u svoj mail ako želiš
DEFAULT_NAME="${GIT_NAME:-marijanalibaba-pixel}"

echo "== Checking repo =="
if [ -d .git ]; then
  echo "Git repo već postoji."
else
  git init
fi

# user.name / user.email samo ako nisu postavljeni
git config user.name >/dev/null 2>&1 || git config user.name "$DEFAULT_NAME"
git config user.email >/dev/null 2>&1 || git config user.email "$DEFAULT_EMAIL"

# main grana
current_branch=$(git symbolic-ref --short -q HEAD || echo "")
if [ -z "$current_branch" ]; then
  git checkout -b main
else
  git branch -M main
fi

# origin remote
if git remote | grep -q '^origin$'; then
  existing=$(git remote get-url origin)
  if [ "$existing" != "$REPO_URL" ]; then
    echo ""
    echo "⚠️  origin je već postavljen na: $existing"
    echo "   STOP OVDJE i javi mi treba li to zamijeniti s: $REPO_URL"
    exit 0
  fi
else
  git remote add origin "$REPO_URL"
fi

# .gitignore nadopuna (bez prepisivanja)
IGNORE_BLOCK=$'# Added by setup-git.sh\nnode_modules/\n.DS_Store\n.env\n.env.*\ndist/\n.vercel/\n'
if [ -f .gitignore ]; then
  if ! grep -q 'Added by setup-git.sh' .gitignore; then
    printf "%s" "$IGNORE_BLOCK" >> .gitignore
  fi
else
  printf "%s" "$IGNORE_BLOCK" > .gitignore
fi

git add .
git commit -m "Initial commit from Replit" || echo "Nothing to commit (možda već ima commita)."

echo ""
echo "== Spremno za push =="
echo "Pokreni sada:"
echo "  git push -u origin main"
