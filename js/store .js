// js/store.js
(function(){
  const items = window.YATHARTH_ITEMS || [];
  const gallery = document.getElementById('gallery');
  const search = document.getElementById('search');
  const sort = document.getElementById('sort');

  function driveUrl(id){ return `https://drive.google.com/uc?export=download&id=${id}`; }

  function render(list){
    gallery.innerHTML = '';
    list.forEach(item => {
      const div = document.createElement('div'); div.className='card';
      div.innerHTML = `
        <div class="title">${escapeHtml(item.title)}</div>
        <audio id="audio-${item.id}" preload="metadata" controls>
          <source src="${driveUrl(item.fileId)}" type="audio/mpeg">
        </audio>
        <div class="small">Preview: ${item.previewSec || 10}s • <strong>₹${item.price}</strong></div>
        <div class="controls-row">
          <button class="btn" data-play="${item.id}">Preview</button>
          <button class="secondary" data-stop="${item.id}">Stop</button>
          <a class="btn" href="${item.buyLink}" target="_blank">Buy</a>
          <button class="secondary" data-share="${item.id}">Share</button>
        </div>`;
      gallery.appendChild(div);

      const audio = div.querySelector(`#audio-${item.id}`);
      let previewTimer = null;

      div.querySelector(`[data-play="${item.id}"]`).addEventListener('click', async ()=>{
        stopAll();
        try{
          await audio.play();
          if(previewTimer) clearTimeout(previewTimer);
          previewTimer = setTimeout(()=>{ audio.pause(); audio.currentTime=0; }, (item.previewSec||10)*1000);
        }catch(e){ console.warn('play error', e); }
      });

      div.querySelector(`[data-stop="${item.id}"]`).addEventListener('click', ()=>{
        if(previewTimer) clearTimeout(previewTimer);
        audio.pause(); audio.currentTime=0;
      });

      div.querySelector(`[data-share="${item.id}"]`).addEventListener('click', ()=>{
        const txt = `${item.title} - ${driveUrl(item.fileId)}`;
        copyToClipboard(txt);
        alert('Link copied to clipboard');
      });
    });
  }

  function stopAll(){
    document.querySelectorAll('audio').forEach(a=>{ a.pause(); a.currentTime=0; });
  }

  function escapeHtml(s){ return (s||'').replace(/[&<>"']/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
  function copyToClipboard(txt){ if(navigator.clipboard) navigator.clipboard.writeText(txt).catch(()=>fallbackCopy(txt)); else fallbackCopy(txt); }
  function fallbackCopy(t){ const ta=document.createElement('textarea'); ta.value=t; document.body.appendChild(ta); ta.select(); document.execCommand('copy'); ta.remove(); }

  search.addEventListener('input', ()=> {
    const q = search.value.trim().toLowerCase();
    const filtered = items.filter(i => i.title.toLowerCase().includes(q) || (i.id||'').toLowerCase().includes(q));
    render(filtered);
  });

  sort.addEventListener('change', ()=> {
    const v = sort.value;
    if(v==='title') items.sort((a,b)=> a.title.localeCompare(b.title));
    if(v==='price') items.sort((a,b)=> (a.price||0)-(b.price||0));
    render(items);
  });

  // initial render
  render(items);
})();
