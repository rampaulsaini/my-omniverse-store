// js/store.js (updated - copy & replace)
(async function(){
  const CONFIG = window.YATHARTH_CONFIG || {};
  let items = window.YATHARTH_ITEMS || null;

  async function loadItems(){
    if(items) return items;
    try{
      const res = await fetch('data/items.json', {cache:'no-store'});
      items = await res.json();
      window.YATHARTH_ITEMS = items;
      return items;
    }catch(e){ console.error('Failed load items.json', e); return []; }
  }

  const gallery = document.getElementById('gallery');
  const searchEl = document.getElementById('search');
  const sortEl = document.getElementById('sort');
  const refreshBtn = document.getElementById('refreshBtn');

  // modal elements
  const buyModal = document.getElementById('buyModal');
  const modalClose = document.getElementById('modalClose');
  const modalTitle = document.getElementById('modalTitle');
  const modalBody = document.getElementById('modalBody');

  function openModal(){ buyModal.style.display='grid'; buyModal.setAttribute('aria-hidden','false'); }
  function closeModal(){ buyModal.style.display='none'; buyModal.setAttribute('aria-hidden','true'); }
  modalClose.addEventListener('click', closeModal);

  // helpers
  function driveUrl(id){ return `https://drive.google.com/uc?export=download&id=${id}`; }
  function escapeHtml(s){ return (s||'').toString().replace(/[&<>"']/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
  function copyToClipboard(text){ if(navigator.clipboard) navigator.clipboard.writeText(text).catch(()=>{ const ta=document.createElement('textarea'); ta.value=text; document.body.appendChild(ta); ta.select(); document.execCommand('copy'); ta.remove(); }); }

  function render(list){
    gallery.innerHTML='';
    list.forEach(item=>{
      const card = document.createElement('div'); card.className='card';
      const previewId = item.previewFileId || item.fileId;
      card.innerHTML = `
        <div class="title">${escapeHtml(item.title)}</div>
        <div class="audio-row">
          <audio id="audio-${item.id}" preload="metadata" controls>
            <source src="${driveUrl(previewId)}" type="audio/mpeg">
            Your browser does not support audio.
          </audio>
        </div>
        <div class="small">Preview: ${item.previewSec || CONFIG.previewTimeoutSecs || 10}s • <strong>₹${item.price}</strong></div>
        <div class="controls-row">
          <button class="btn" data-play="${item.id}">Preview</button>
          <button class="secondary" data-stop="${item.id}">Stop</button>
          <button class="btn" data-buy="${item.id}">Buy</button>
          <button class="secondary" data-share="${item.id}">Share</button>
        </div>
      `;
      gallery.appendChild(card);

      const audio = card.querySelector(`#audio-${item.id}`);
      let timeout = null;

      // Play button behaviour - enforces preview length
      card.querySelector(`[data-play="${item.id}"]`).addEventListener('click', async ()=>{
        stopAll();
        try{
          await audio.play();
          if(timeout) clearTimeout(timeout);
          timeout = setTimeout(()=>{ try{ audio.pause(); audio.currentTime=0; }catch(e){} }, (item.previewSec||CONFIG.previewTimeoutSecs||10)*1000);
        }catch(e){
          console.warn('play error', e);
          alert('Playback failed — allow site audio or try another browser.');
        }
      });

      // Stop button
      card.querySelector(`[data-stop="${item.id}"]`).addEventListener('click', ()=>{ if(timeout) clearTimeout(timeout); try{ audio.pause(); audio.currentTime=0; }catch(e){} });

      // Share: copy preview link (not full file)
      card.querySelector(`[data-share="${item.id}"]`).addEventListener('click', ()=>{
        const text = `${item.title} — Preview: ${driveUrl(previewId)}\nBuy: ${item.buyLink || CONFIG.paytmLink || ''}`;
        copyToClipboard(text);
        alert('Preview link copied to clipboard');
      });

      // Buy opens modal
      card.querySelector(`[data-buy="${item.id}"]`).addEventListener('click', ()=> openBuy(item));
      audio.addEventListener('pause', ()=>{ if(timeout) clearTimeout(timeout); });
    });
  }

  function stopAll(){ document.querySelectorAll('audio').forEach(a=>{ try{ a.pause(); a.currentTime=0; }catch(e){} }); }

  function openBuy(item){
    modalTitle.textContent = `Buy: ${item.title} — ₹${item.price}`;
    // Build manual payment instructions (copyable)
    const upi = CONFIG.upiAddress || 'yourupi@bank';
    const instr = `
Pay manually:
• UPI / GPay: ${upi}
• PayPal.me: ${CONFIG.paypalMeLink || 'https://paypal.me/yourid'}
• Paytm: ${CONFIG.paytmLink || 'https://p.paytm.me/example'}

After payment, send screenshot + txn id to Telegram/WhatsApp:
• Telegram: ${CONFIG.telegramContact || 'https://t.me/your_telegram'}
• WhatsApp: https://wa.me/<YOUR_NUMBER>

Provide these details:
Item ID: ${item.id}
Amount: ₹${item.price}
Txn ID: (your txn id)

You will receive the download link after verification.
    `.trim();
    modalBody.textContent = instr;
    // Show modal
    openModal();
  }

  // search & sort
  searchEl.addEventListener('input', ()=> {
    const q = searchEl.value.trim().toLowerCase();
    const filtered = (items || []).filter(i=> (i.title||'').toLowerCase().includes(q) || (i.id||'').toLowerCase().includes(q));
    render(filtered);
  });

  sortEl.addEventListener('change', ()=> {
    const val = sortEl.value;
    if(val==='title') items.sort((a,b)=> (a.title||'').localeCompare(b.title));
    else if(val==='price') items.sort((a,b)=> (Number(a.price)||0)-(Number(b.price)||0));
    render(items);
  });

  refreshBtn.addEventListener('click', async ()=> { items = await loadItems(); render(items); });

  // initial load
  items = await loadItems();
  render(items);

})();
            
