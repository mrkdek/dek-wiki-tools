(() => {
  'use strict';
  const params = new URLSearchParams(location.search);
  const embedded = params.get('embed') === '1' || window.self !== window.top;
  document.documentElement.classList.toggle('dek-embedded', embedded);
  const allowedTools = ['home','everything','typograph','filecheck','designcheck','rename','imgconvert','imgcheck','flatten'];
  const selectedTool = params.get('tool');
  if (selectedTool && allowedTools.includes(selectedTool) && typeof window.showPage === 'function') {
    const button = Array.from(document.querySelectorAll('.nav-link')).find(el => (el.getAttribute('onclick') || '').includes("'" + selectedTool + "'"));
    window.showPage(selectedTool, button);
    if (embedded && selectedTool !== 'home') document.documentElement.classList.add('dek-single-tool');
  }
  if (!embedded) {
    const bar = document.createElement('div');
    bar.className = 'dek-sitebar';
    const home = document.createElement('a');
    home.href = '../'; home.textContent = 'DEK / Все инструменты';
    const copy = document.createElement('button'); copy.type = 'button'; copy.textContent = 'Скопировать ссылку для wiki';
    copy.addEventListener('click', async () => {
      const url = new URL(location.href); url.searchParams.set('embed','1'); url.hash='';
      const active = document.querySelector('.page.active');
      if (active && active.id !== 'page-home') url.searchParams.set('tool',active.id.replace('page-',''));
      try { await navigator.clipboard.writeText(url.href); copy.textContent='Ссылка скопирована'; }
      catch { window.prompt('Скопируйте ссылку для wiki:',url.href); }
      setTimeout(() => { copy.textContent='Скопировать ссылку для wiki'; },2500);
    });
    bar.append(home,copy); document.body.prepend(bar);
  }
  for (const id of ['page-typograph','page-filecheck']) {
    const area = document.querySelector('#'+id+' .page-subtitle');
    if (area) {
      const note=document.createElement('p');note.className='dek-service-note';
      note.textContent='Для проверки орфографии текст передаётся в сервис Яндекс Спеллер. Остальные операции выполняются в браузере.';
      area.after(note);
    }
  }
  // Useful for hosts which implement resizing; Outline may use its own fixed embed height.
  if (embedded && document.referrer) {
    let parentOrigin;
    try { parentOrigin=new URL(document.referrer).origin; } catch { return; }
    if (!/^https?:\/\//.test(parentOrigin)) return;
    let lastHeight=0;
    const send=() => {
      const height=Math.ceil(document.body.getBoundingClientRect().height);
      if (height!==lastHeight) {lastHeight=height; window.parent.postMessage({type:'dek-tools:resize',height},parentOrigin);}
    };
    new ResizeObserver(send).observe(document.body);send();
  }
})();
