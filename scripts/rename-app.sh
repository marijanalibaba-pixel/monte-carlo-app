#!/usr/bin/env bash
set -euo pipefail

# >>> Postavi ime ovdje (možeš promijeniti i kratko ime ako želiš kraći label na home screenu)
NEW_NAME="${NEW_NAME:-Flow Forcasting}"
NEW_SHORT="${NEW_SHORT:-Flow Forcasting}"

[ -f client/public/manifest.webmanifest ] || { echo "❌ Missing client/public/manifest.webmanifest"; exit 1; }
[ -f client/index.html ] || { echo "❌ Missing client/index.html"; exit 1; }

# Backupi
cp client/public/manifest.webmanifest "client/public/manifest.webmanifest.bak.$(date +%s)"
cp client/index.html "client/index.html.bak.$(date +%s)"
[ -f package.json ] && cp package.json "package.json.bak.$(date +%s)" || true

# Manifest: promijeni name + short_name
node - <<'NODE'
const fs=require('fs');
const path='client/public/manifest.webmanifest';
const NEW_NAME=process.env.NEW_NAME||'Flow Forcasting';
const NEW_SHORT=process.env.NEW_SHORT||'Flow Forcasting';
const j=JSON.parse(fs.readFileSync(path,'utf8'));
j.name = NEW_NAME;
j.short_name = NEW_SHORT;
fs.writeFileSync(path, JSON.stringify(j,null,2));
console.log('✓ manifest.webmanifest updated:', {name:j.name, short_name:j.short_name});
NODE

# index.html: <title>
node - <<'NODE'
const fs=require('fs');
const p='client/index.html';
let html=fs.readFileSync(p,'utf8');
if (/<title>.*<\/title>/i.test(html)) {
  html=html.replace(/<title>.*<\/title>/i, '<title>Flow Forcasting</title>');
} else {
  html=html.replace(/<head>/i, '<head>\n    <title>Flow Forcasting</title>');
}
fs.writeFileSync(p, html);
console.log('✓ client/index.html <title> set to Flow Forcasting');
NODE

# (Opcionalno) rename package.json "name" -> koristi se samo za NPM metadata
if [ -f package.json ]; then
  node - <<'NODE'
  const fs=require('fs');
  const p='package.json';
  const j=JSON.parse(fs.readFileSync(p,'utf8'));
  j.name = 'flow-forcasting';
  fs.writeFileSync(p, JSON.stringify(j,null,2));
  console.log('✓ package.json name set to flow-forcasting');
NODE
fi

echo "All set."
