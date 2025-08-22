(() => { try {
  const root = document.documentElement;
  const body = document.body;
  const strip = () => {
    root.classList.remove('dark');
    body?.classList?.remove('dark');
    document.querySelectorAll('.dark').forEach(el => el.classList.remove('dark'));
    root.style.colorScheme = 'light';
  };
  // odmah ukloni
  strip();
  // uvijek piši 'light' u localStorage theme ključ
  try { localStorage.setItem('theme','light'); } catch(e) {}
  // spriječi dodavanje 'dark' na root/body
  const patchAdd = el => {
    if (!el?.classList) return;
    const add = el.classList.add.bind(el.classList);
    el.classList.add = (...t) => add(...t.filter(x => x !== 'dark'));
  };
  patchAdd(root); patchAdd(body);
  // budi budan kratko vrijeme i skini svaku novu .dark
  new MutationObserver(() => strip())
    .observe(root, { attributes:true, attributeFilter:['class'], subtree:true, childList:true });
  let n=0; const iv=setInterval(()=>{ strip(); if(++n>20) clearInterval(iv); },150);
} catch(e) {} })();
