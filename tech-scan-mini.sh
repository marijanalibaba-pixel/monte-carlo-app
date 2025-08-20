#!/usr/bin/env bash
set +e
echo "Pokrećem kratki skener…"
have_node=1
command -v node >/dev/null 2>&1 || have_node=0
manifest_file=$(find . -type f \( -iname "*manifest*.json" -o -iname "*.webmanifest" \) -not -path "*/node_modules/*" | head -n1)
sw_file=$(find . -type f \( -iname "sw.js" -o -iname "*service*worker*.js" \) -not -path "*/node_modules/*" | head -n1)
icon_192=$(find . -type f \( -iname "*192*.png" -o -iname "*192*.webp" -o -iname "*192*.jpg" -o -iname "*192*.svg" \) -not -path "*/node_modules/*" | head -n1)
icon_512=$(find . -type f \( -iname "*512*.png" -o -iname "*512*.webp" -o -iname "*512*.jpg" -o -iname "*512*.svg" \) -not -path "*/node_modules/*" | head -n1)
env_names=$(
  (grep -R -o -E 'process\.env\.[A-Z0-9_]+' --exclude-dir=node_modules 2>/dev/null; \
   grep -R -o -E 'import\.meta\.env\.[A-Z0-9_]+' --exclude-dir=node_modules 2>/dev/null) \
  | sed -E 's/.*env\.//' | sort -u | head -n 30 | tr '\n' ',' | sed 's/,$//'
)
next_hint=""
[ -d app ] && next_hint="app"
[ -d pages ] && next_hint="${next_hint:+$next_hint,}pages"
[ -d src/pages ] && next_hint="${next_hint:+$next_hint,}src/pages"
[ -d pages/api ] || [ -d app/api ] || [ -d src/pages/api ] && api_hint="next_api"
PKG="no"; FW=""; DEV="n/a"; START="n/a"; BUILD="n/a"; NODE_ENG="n/a"; OUT_GUESS="n/a"; EXPRESS="no"
if [ -f package.json ] && [ $have_node -eq 1 ]; then
  node <<'NODE'
  const fs=require('fs');
  try{
    const p=JSON.parse(fs.readFileSync('package.json','utf8'));
    const scripts=p.scripts||{};
    const engines=p.engines||{};
    const deps={...p.dependencies, ...p.devDependencies};
    const fw=[];
    if (deps?.next) fw.push('Next.js');
    if (deps?.vite) fw.push('Vite');
    if (deps?.['react-scripts']) fw.push('Create React App');
    if (deps?.react && fw.length===0) fw.push('React');
    if (deps?.vue) fw.push('Vue');
    if (deps?.svelte) fw.push('Svelte');
    if (deps?.astro) fw.push('Astro');
    if (deps?.nuxt) fw.push('Nuxt');
    if (deps?.express) fw.push('Express');
    let outGuess='nepoznato';
    const b=(scripts.build||'');
    if (/next\s+build/.test(b)) outGuess='.next';
    else if (/vite/.test(b)) outGuess='dist';
    else if (/react-scripts/.test(b)) outGuess='build';
    else if (/astro/.test(b)) outGuess='dist';
    console.log(`PACKAGE_JSON: yes`);
    console.log(`FRAMEWORKS: ${fw.join(', ')||'nije detektirano'}`);
    console.log(`SCRIPTS.dev: ${scripts.dev||'nedefinirano'}`);
    console.log(`SCRIPTS.start: ${scripts.start||'nedefinirano'}`);
    console.log(`SCRIPTS.build: ${scripts.build||'nedefinirano'}`);
    console.log(`NODE_ENGINE: ${engines.node||'nije specificirano'}`);
    console.log(`BUILD_OUTPUT_GUESS: ${outGuess}`);
    console.log(`EXPRESS_DEP: ${deps?.express?'yes':'no'}`);
  }catch(e){
    console.log('PACKAGE_JSON: yes');
    console.log('(greška pri čitanju package.json)');
  }
NODE
else
  echo "PACKAGE_JSON: no"
fi
echo "NEXT_ROUTER: ${next_hint:-no}"
echo "API_HINT: ${api_hint:-no}"
echo "MANIFEST_PATH: ${manifest_file:-no}"
echo "SERVICE_WORKER: ${sw_file:-no}"
echo "ICON_192: ${icon_192:+yes} ${icon_192}"
echo "ICON_512: ${icon_512:+yes} ${icon_512}"
echo "ENV_VARS: ${env_names:-none}"
