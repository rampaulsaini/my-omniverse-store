// js/buy.js
// keeps Buy button label dynamic and links to payment product
(function(){
  // === Configure these ===
  const GUMROAD_URL = ''; // if you have Gumroad product, put URL here; else PayPal/UPI will be used in fallback
  const PAYPAL_LINK = 'https://paypal.me/sainirampaul60/199INR';
  const BASE_PRICE = 199;

  function computePrice(){
    const h = new Date().getHours();
    // symbolic time-based modulation (client-side only)
    return BASE_PRICE + Math.floor(Math.sin(h/24 * Math.PI*2) * 20);
  }

  const buyBtn = document.getElementById('buy');
  if(!buyBtn) return;

  const price = computePrice();
  buyBtn.textContent = `Buy Now ₹${price}`;

  // link behavior
  if(GUMROAD_URL && GUMROAD_URL.length > 5){
    buyBtn.href = GUMROAD_URL;
  } else {
    // fallback: PayPal link
    buyBtn.href = PAYPAL_LINK;
  }

  // optional: on-click analytics demo
  buyBtn.addEventListener('click', ()=>{
    console.log('Buy clicked — price shown:', price, 'link:', buyBtn.href);
  });
})();
