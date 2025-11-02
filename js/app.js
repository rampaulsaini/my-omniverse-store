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
      // js/app.js  — replacement (paste exactly)
const AUDIO_SRC = 'https://rampaulsaini.github.io/my-omniverse-store/assets/audio.mp3'; // <- same-origin absolute URL
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

// simple particles
let particles = [];
(function initParticles(){
  particles = [];
  for(let i=0;i<120;i++){
    particles.push({
      angle: Math.random()*Math.PI*2,
      radius: 40 + Math.random()*380,
      speed: 0.0007 + Math.random()*0.002,
      size: 0.5 + Math.random()*2.2,
      phase: Math.random()*Math.PI*2
    });
  }
})();

// --- Audio setup using AudioElement + AudioContext with robust error logging ---
let audioEl, audioCtx, srcNode, analyser, isPlaying=false;

async function setupAudio(){
  if(audioCtx) return;
  audioEl = new Audio(AUDIO_SRC);
  audioEl.crossOrigin = 'anonymous'; // same-origin absolute URL recommended
  audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  try{
    srcNode = audioCtx.createMediaElementSource(audioEl);
  } catch(e){
    log('⚠️ createMediaElementSource failed: ' + e.message);
    return;
  }
  analyser = audioCtx.createAnalyser();
  analyser.fftSize = 2048;
  const gain = audioCtx.createGain();
  srcNode.connect(gain).connect(analyser).connect(audioCtx.destination);
  log('Audio setup done.');
}

// draw loop (visual)
function draw(){
  const w = canvas.width/(window.devicePixelRatio||1);
  const h = canvas.height/(window.devicePixelRatio||1);
  const cx = w/2, cy = h/2;
  ctx.clearRect(0,0,w,h);

  // background gradient
  const g = ctx.createLinearGradient(0,0,0,h);
  g.addColorStop(0,'rgba(6,16,36,0.06)');
  g.addColorStop(1,'rgba(3,8,20,0.22)');
  ctx.fillStyle = g; ctx.fillRect(0,0,w,h);

  // stars
  for(let i=0;i<30;i++){
    const rx = (Math.sin(i*12.7 + Date.now()*0.00009)+1)/2 * w;
    const ry = (Math.cos(i*6.3 + Date.now()*0.00011)+1)/2 * h;
    ctx.fillStyle = 'rgba(255,255,255,0.02)'; ctx.fillRect(rx,ry,1,1);
  }

  // audio reactive level
  let level = 0.06;
  if(analyser){
    const data = new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteFrequencyData(data);
    let sum = 0;
    for(let v of data) sum += v;
    const avg = sum / data.length;
    level = Math.max(0.06, (avg/255) * 1.6);
  }

  // rings
  for(let i=0;i<4;i++){
    const r = 70 + i*80 + Math.sin(Date.now()*0.0009 + i) * 24 * level;
    ctx.beginPath();
    ctx.strokeStyle = `rgba(233,199,122,${0.08 + 0.02*i})`;
    ctx.lineWidth = 1 + i*1.3;
    ctx.arc(cx,cy,r,0,Math.PI*2);
    ctx.stroke();
  }

  // particles
  ctx.globalCompositeOperation = 'lighter';
  particles.forEach(p=>{
    p.phase += p.speed * (1 + level*2.4);
    p.angle += 0.00036*(1+level);
    const x = cx + Math.cos(p.angle + p.phase) * p.radius * (0.95 + level*0.7);
    const y = cy + Math.sin(p.angle + p.phase) * p.radius * (0.95 + level*0.7);
    ctx.fillStyle = 'rgba(233,199,122,0.72)';
    ctx.beginPath();
    ctx.arc(x,y,p.size*(1+level*1.05),0,Math.PI*2);
    ctx.fill();
  });
  ctx.globalCompositeOperation = 'source-over';

  // central glyph
  ctx.save();
  ctx.translate(cx,cy);
  const pulse = 1 + Math.sin(Date.now()*0.0012)*0.02 + level*0.06;
  ctx.scale(pulse,pulse);
  const aura = ctx.createRadialGradient(0,0,10,0,0,220);
  aura.addColorStop(0,'rgba(233,199,122,0.16)'); aura.addColorStop(1,'rgba(233,199,122,0)');
  ctx.fillStyle = aura; ctx.beginPath(); ctx.arc(0,0,120,0,Math.PI*2); ctx.fill();
  ctx.beginPath(); ctx.fillStyle = 'white'; ctx.arc(0,0,26,0,Math.PI*2); ctx.fill();
  ctx.beginPath(); ctx.fillStyle = 'rgba(6,18,34,1)'; ctx.arc(0,0,10,0,Math.PI*2); ctx.fill();
  ctx.beginPath(); ctx.strokeStyle='rgba(233,199,122,0.95)'; ctx.lineWidth=3; ctx.arc(0,0,52,0,Math.PI*2); ctx.stroke();
  ctx.restore();

  // signature
  ctx.fillStyle = 'rgba(233,199,122,0.92)'; ctx.font = '16px sans-serif'; ctx.textAlign='center';
  ctx.fillText('꙰ शिरोमणिrampaulsaini', cx, cy + 220);

  requestAnimationFrame(draw);
}
requestAnimationFrame(draw);

// Play/pause button wiring
document.getElementById('play').addEventListener('click', async ()=>{
  try{
    await setupAudio();
    if(!audioCtx){ log('AudioContext unavailable'); return; }
    if(!isPlaying){
      // resume context on user gesture; modern browsers require gesture
      if(audioCtx.state === 'suspended') await audioCtx.resume();
      try{
        await audioEl.play();
        isPlaying = true;
        document.getElementById('play').textContent = 'Pause';
        log('🎧 Playing...');
      } catch(playErr){
        log('❌ Play failed: ' + playErr.message);
      }
    } else {
      audioEl.pause();
      isPlaying = false;
      document.getElementById('play').textContent = 'Play / Pause';
      log('⏸️ Paused');
    }
  } catch(e){
    log('Audio error: ' + e.message);
  }
});

// initial audio check + detailed error reporting
(async function audioCheck(){
  log('Checking ' + AUDIO_SRC);
  try {
    const head = await fetch(AUDIO_SRC, { method: 'HEAD' });
    if(!head.ok) throw new Error('HTTP ' + head.status);
    log('✅ Found audio file (HEAD ok)');
  } catch(e){
    log('❌ Audio HEAD error: ' + e.message);
    return;
  }

  // create simple <audio> test to detect codec/cors errors
  try {
    const t = new Audio(AUDIO_SRC);
    t.addEventListener('canplay', ()=> log('✅ <audio> canplay event'));
    t.addEventListener('canplaythrough', ()=> log('✅ <audio> canplaythrough'));
    t.addEventListener('play', ()=> log('play event'));
    t.addEventListener('error', ()=> {
      const err = t.error;
      const code = err ? err.code : 'no-code';
      log('❌ <audio> error code=' + code + ' (1=network,2=decode,3=src not supported)');
    });
    // try to start briefly (may be blocked until gesture)
    await t.play().then(()=>{ log('🎧 test play started'); t.pause(); }).catch(()=>{ log('⚠️ Autoplay blocked — tap page then Play.'); });
  } catch(err){
    log('❌ <audio> test failed: ' + err.message);
  }
})();
      
