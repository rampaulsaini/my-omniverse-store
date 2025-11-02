// js/app.js
// Responsible for visual animation and playing assets/audio.mp3
const AUDIO_PATH = 'assets/audio.mp3';
const canvas = document.getElementById('scene');
const ctx = canvas.getContext('2d');
const debugEl = document.getElementById('debug');
const log = (m)=>{ if(debugEl) debugEl.textContent += m + '\n'; console.log(m); };

// responsive canvas
function resize(){
  const rect = canvas.getBoundingClientRect();
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.floor(rect.width * dpr);
  canvas.height = Math.floor(rect.height * dpr);
  ctx.setTransform(dpr,0,0,dpr,0,0);
}
window.addEventListener('resize', resize);
resize();

// particles
let particles = [];
(function initParticles(){
  for(let i=0;i<140;i++){
    particles.push({
      angle: Math.random()*Math.PI*2,
      radius: 40 + Math.random()*420,
      speed: 0.0006 + Math.random()*0.002,
      size: 0.4 + Math.random()*2.6,
      phase: Math.random()*Math.PI*2
    });
  }
})();

// audio setup
let audioEl, audioCtx, srcNode, analyser, isPlaying=false;
async function setupAudio(){
  if(audioCtx) return;
  audioEl = new Audio(AUDIO_PATH);
  audioEl.crossOrigin = 'anonymous';
  audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  srcNode = audioCtx.createMediaElementSource(audioEl);
  analyser = audioCtx.createAnalyser();
  analyser.fftSize = 2048;
  const gain = audioCtx.createGain();
  srcNode.connect(gain).connect(analyser).connect(audioCtx.destination);
  log('Audio setup done.');
}

// draw loop
function draw(){
  const w = canvas.width / (window.devicePixelRatio || 1);
  const h = canvas.height / (window.devicePixelRatio || 1);
  const cx = w/2, cy = h/2;
  ctx.clearRect(0,0,w,h);

  // subtle background
  const grad = ctx.createLinearGradient(0,0,0,h);
  grad.addColorStop(0, 'rgba(6,16,36,0.05)');
  grad.addColorStop(1, 'rgba(4,8,24,0.25)');
  ctx.fillStyle = grad;
  ctx.fillRect(0,0,w,h);

  // stars
  for(let i=0;i<30;i++){
    const rx = (Math.sin(i*12.9898 + Date.now()*0.0001)+1)/2 * w;
    const ry = (Math.cos(i*7.233 + Date.now()*0.00007)+1)/2 * h;
    ctx.fillStyle = 'rgba(255,255,255,0.02)';
    ctx.fillRect(rx,ry,1,1);
  }

  // compute level
  let level = 0.06;
  if(analyser){
    const data = new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteFrequencyData(data);
    let sum = 0;
    for(let v of data) sum += v;
    const avg = sum / data.length;
    level = Math.max(0.06, (avg/255)*1.6);
  }

  // rings
  for(let i=0;i<4;i++){
    const r = 70 + i*80 + Math.sin(Date.now()*0.0008 + i) * 22 * level;
    ctx.beginPath();
    ctx.strokeStyle = `rgba(233,199,122,${0.08 + 0.02*i})`;
    ctx.lineWidth = 1 + i*1.2;
    ctx.arc(cx, cy, r, 0, Math.PI*2);
    ctx.stroke();
  }

  // particles
  ctx.globalCompositeOperation = 'lighter';
  particles.forEach(p=>{
    p.phase += p.speed * (1 + level*2.4);
    p.angle += 0.00035*(1+level);
    const x = cx + Math.cos(p.angle + p.phase) * p.radius * (0.95 + level*0.7);
    const y = cy + Math.sin(p.angle + p.phase) * p.radius * (0.95 + level*0.7);
    ctx.fillStyle = 'rgba(233,199,122,0.7)';
    ctx.beginPath();
    ctx.arc(x,y,p.size*(1+level*1.1),0,Math.PI*2);
    ctx.fill();
  });
  ctx.globalCompositeOperation = 'source-over';

  // central glyph
  ctx.save();
  ctx.translate(cx,cy);
  const pulse = 1 + Math.sin(Date.now()*0.0012)*0.02 + level*0.06;
  ctx.scale(pulse,pulse);
  const aura = ctx.createRadialGradient(0,0,10,0,0,220);
  aura.addColorStop(0,'rgba(233,199,122,0.16)');
  aura.addColorStop(1,'rgba(233,199,122,0)');
  ctx.fillStyle = aura;
  ctx.beginPath(); ctx.arc(0,0,120,0,Math.PI*2); ctx.fill();
  ctx.beginPath(); ctx.fillStyle='white'; ctx.arc(0,0,26,0,Math.PI*2); ctx.fill();
  ctx.beginPath(); ctx.fillStyle='rgba(6,18,34,1)'; ctx.arc(0,0,10,0,Math.PI*2); ctx.fill();
  ctx.beginPath(); ctx.strokeStyle='rgba(233,199,122,0.95)'; ctx.lineWidth=3; ctx.arc(0,0,52,0,Math.PI*2); ctx.stroke();
  ctx.restore();

  // signature
  ctx.fillStyle = 'rgba(233,199,122,0.92)';
  ctx.font = '16px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('꙰ शिरोमणिrampaulsaini', cx, cy + 220);

  requestAnimationFrame(draw);
}
requestAnimationFrame(draw);

// controls wiring
document.getElementById('play').addEventListener('click', async ()=>{
  try{
    await setupAudio();
    if(!audioCtx) { log('AudioContext init failed'); return; }
    if(!isPlaying){
      await audioCtx.resume();
      audioEl.play();
      isPlaying = true;
      document.getElementById('play').textContent = 'Pause';
      log('🎧 Playing...');
    } else {
      audioEl.pause();
      isPlaying = false;
      document.getElementById('play').textContent = 'Play / Pause';
      log('⏸️ Paused');
    }
  }catch(err){
    log('Audio error: ' + err.message);
  }
});

// initial quick audio check
(async function(){
  log('Checking ' + AUDIO_PATH);
  try{
    const r = await fetch(AUDIO_PATH, { method:'HEAD' });
    if(!r.ok) throw new Error('HTTP ' + r.status);
    log('✅ Found audio file');
  }catch(e){ log('❌ Audio not accessible: ' + e.message); return; }

  // quick element test
  try {
    const test = new Audio(AUDIO_PATH);
    test.addEventListener('canplaythrough', ()=> log('✅ Audio loaded (canplaythrough).'));
    test.addEventListener('error', ()=> log('❌ Audio element error. Check file MIME/CORS.'));
    await test.play().then(()=>{ log('🎧 Test playback started.'); test.pause(); }).catch(()=>{ log('⚠️ Autoplay blocked — tap page then Play.'); });
  } catch(e){
    log('Audio test failed: ' + e.message);
  }
})();
                   
