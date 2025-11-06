// js/store.js
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

  // modal
  const buyModal = document.getElementById('buyModal');
  const modalClose = document.getElementById('modalClose');
  const modalTitle = document.getElementById('modalTitle');
  const modalBody = document.getElementById('modalBody');
  const paypalContainerId = 'paypal-container';

  function openModal(){
    buyModal.style.display='grid'; buyModal.setAttribute('aria-hidden','false');
  }
  function closeModal(){ buyModal.style.display='none'; buyModal.setAttribute('aria-hidden','true'); }

  modalClose.addEventListener('click', closeModal);

  // helpers
  function driveUrl(id){ return `https://drive.google.com/uc?export=download&id=${id}`; }
  function escapeHtml(s){ return (s||'').toString().replace(/[&<>"']/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
  function copyToClipboard(text){ if(navigator.clipboard) navigator.clipboard.writeText(text).catch(()=>{ const ta=document.createElement('textarea'); ta.value=text; document.body.appendChild(ta); ta.select(); document.execCommand('copy'); ta.remove(); }); }

  // render
  function render(list){
    gallery.innerHTML='';
    list.forEach(item=>{
      const card = document.createElement('div'); card.className='card';
      card.innerHTML = `
        <div class="title">${escapeHtml(item.title)}</div>
        <div class="audio-row">
          <audio id="audio-${item.id}" preload="metadata" controls>
            <source src="${driveUrl(item.fileId)}" type="audio/mpeg">
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
      card.querySelector(`[data-play="${item.id}"]`).addEventListener('click', async ()=>{
        stopAll();
        try{ await audio.play(); if(timeout) clearTimeout(timeout); timeout = setTimeout(()=>{ audio.pause(); audio.currentTime=0; }, (item.previewSec||CONFIG.previewTimeoutSecs||10)*1000); }catch(e){ console.warn('play',e); alert('Playback failed; allow site audio if using mobile browser'); }
      });
      card.querySelector(`[data-stop="${item.id}"]`).addEventListener('click', ()=>{ if(timeout) clearTimeout(timeout); audio.pause(); audio.currentTime=0; });
      card.querySelector(`[data-share="${item.id}"]`).addEventListener('click', ()=>{ copyToClipboard(`${item.title} - ${driveUrl(item.fileId)}`); alert('Link copied'); });
      card.querySelector(`[data-buy="${item.id}"]`).addEventListener('click', ()=> openBuy(item));
      audio.addEventListener('pause', ()=>{ if(timeout) clearTimeout(timeout); });
    });
  }

  function stopAll(){ document.querySelectorAll('audio').forEach(a=>{ try{ a.pause(); a.currentTime=0;}catch(e){} }); }

  function openBuy(item){
    modalTitle.textContent = `Buy: ${item.title} — ₹${item.price}`;
    modalBody.textContent = `Pay using one of the methods below. For automated delivery enable backend (Firebase + GCS).`;
    // update manual buttons
    document.getElementById('paytmLink').href = CONFIG.paytmLink || '#';
    document.getElementById('paypalMe').href = CONFIG.paypalMeLink || '#';
    // store purchase item in modal dataset
    buyModal.dataset.itemId = item.id;
    // prepare PayPal button if SDK loaded and client id configured
    if(window.paypal && CONFIG.paypalClientId){
      // clear previous
      document.getElementById(paypalContainerId).innerHTML = '';
      paypal.Buttons({
        createOrder: function(data, actions){
          return actions.order.create({ purchase_units: [{ amount: { value: item.price.toString() } }] });
        },
        onApprove: function(data, actions){
          return actions.order.capture().then(function(details){
            // details.id is orderId — send to backend verify endpoint (if available)
            // If you don't have backend: capture screenshot/send txn to admin for manual delivery
            alert('Payment completed. Order ID: ' + details.id + '\\nSend this to admin for delivery.');
          });
        },
        onError: function(err){ console.error('paypal error', err); alert('PayPal error.'); }
      }).render('#' + paypalContainerId);
    } else {
      document.getElementById(paypalContainerId).innerHTML = '<div class="small">PayPal client not configured (admin).</div>';
    }

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
    if(val==='title') items.sort((a,b)=> a.title.localeCompare(b.title));
    else if(val==='price') items.sort((a,b)=> (a.price||0)-(b.price||0));
    render(items);
  });
  refreshBtn.addEventListener('click', async ()=> { items = await loadItems(); render(items); });

  // initial load
  items = await loadItems();
  render(items);

})();
                                          
