(() => {
  const base=new URL('./',location.href), picker=document.getElementById('tool-picker');
  const urlField=document.getElementById('embed-url'), codeField=document.getElementById('embed-code');
  let noticeTimer;
  function update(){
    const url=new URL(picker.value,base).href;
    const height=picker.selectedOptions[0].dataset.height||1000;
    urlField.value=url;
    codeField.textContent=`<iframe src="${url.replace(/&/g,'&amp;')}" title="${picker.selectedOptions[0].textContent}" width="100%" height="${height}" style="border:0" loading="lazy" allow="clipboard-write" sandbox="allow-scripts allow-same-origin allow-downloads allow-forms allow-modals"></iframe>`;
    document.getElementById('preview-embed').href=url;
  }
  async function copy(value){
    try{await navigator.clipboard.writeText(value);const note=document.getElementById('notice');note.textContent='Скопировано';note.classList.add('visible');clearTimeout(noticeTimer);noticeTimer=setTimeout(()=>note.classList.remove('visible'),2500);}
    catch{window.prompt('Скопируйте текст:',value);}
  }
  picker.addEventListener('change',update);update();
  document.getElementById('copy-url').addEventListener('click',()=>copy(urlField.value));
  document.getElementById('copy-code').addEventListener('click',()=>copy(codeField.textContent));
  document.querySelectorAll('[data-copy]').forEach(button=>button.addEventListener('click',()=>copy(new URL(button.dataset.copy,base).href)));
})();
