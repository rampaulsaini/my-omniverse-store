// js/app.js - simple particles background + audio play
const CANVAS = document.getElementById('scene');
const ctx = CANVAS.getContext('2d');
const playBtn = document.getElementById('play');
const debug = document.getElementById('debug');
const log = (m)=>{ if(debug) debug.textContent += m + '\n'; console.log(m); };

// audio file (relative path in same repo)
const AUDIO_PATH = 'assets/audio.mp3';
let audio = null;
let playing = false;

// init canvas size
function resizeCanvas(){
  CANVAS.width = window.innerWidth;
  CANVAS.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// particles
const particles = Array.from({length:90}, ()=>({
  x: Math.random()*CANVAS.width,
  y: Math.random()*CANVAS.height,
  r: Math.random()*1.8+0.6,
  s: Math.random()*0.6+0.2,
  t: Math.random()*Math.PI*2
}));

function draw(){
  // subtle fade for motion trail
  ctx.fillStyle = 'rgba(0,0,0,0.18)';
  ctx.fillRect(0,0,CANVAS.width,CANVAS.height);

  // glow center
  const grad = ctx.createRadialGradient(CANVAS.width/2, CANVAS.height/2, 10, CANVAS.width/2, CANVAS.height/2, Math.max(CANVAS.width, CANVAS.height)/1.5);
  grad.addColorStop(0, 'rgba(233,199,122,0.06)');
  grad.addColorStop(1, 'rgba(0,0,0,0.0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0,0,CANVAS.width,CANVAS.height);

  // particles drift
  ctx.fillStyle = 'rgba(233,199,122,0.75)';
  particles.forEach(p=>{
    p.y += p.s;
    p.t += 0.01;
    p.x += Math.sin(p.t)*0.3;
    if(p.y > CANVAS.height + 10){ p.y = -10; p.x = Math.random()*CANVAS.width; }
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
    ctx.fill();
  });

  // central glyph
  ctx.save();
  ctx.translate(CANVAS.width/2, CANVAS.height/2);
  ctx.beginPath();
  ctx.fillStyle = 'rgba(255,255,255,0.95)';
  ctx.arc(0,0,18,0,Math.PI*2);
  ctx.fill();
  ctx.restore();

  requestAnimationFrame(draw);
}
requestAnimationFrame(draw);

// audio setup and control
async function ensureAudio(){
  if(audio) return audio;
  try{
    audio = new Audio(AUDIO_PATH);
    audio.crossOrigin = 'anonymous';
    audio.preload = 'auto';
    // small listeners
    audio.addEventListener('canplay', ()=> log('✅ audio canplay'));
    audio.addEventListener('error', ()=> {
      const e = audio.error;
      const code = e ? e.code : 'no-code';
      log('❌ audio error code=' + code + ' (1=network,2=decode,3=not-supported)');
    });
    // try a HEAD fetch to check server, catches 404 quickly
    try{
      const r = await fetch(AUDIO_PATH, { method: 'HEAD' });
      if(!r.ok) throw new Error('HTTP ' + r.status);
      log('✅ Found audio: ' + AUDIO_PATH);
    }catch(err){
      log('❌ Audio HEAD check failed: ' + err.message);
    }
    return audio;
  }catch(err){
    log('Audio init error: ' + err.message);
    return null;
  }
}

playBtn.addEventListener('click', async ()=>{
  const a = await ensureAudio();
  if(!a){ log('No audio available.'); return; }
  try{
    if(!playing){
      // resume context if needed (handled by browser)
      await a.play();
      playing = true;
      playBtn.textContent = 'Pause';
      log('🎧 Playing...');
    } else {
      a.pause();
      playing = false;
      playBtn.textContent = 'Play / Pause';
      log('⏸️ Paused');
    }
  }catch(err){
    log('Play failed: ' + err.message);
  }
});

// initial message
log('꙰ Page ready — tap Play to start narration.');
    
