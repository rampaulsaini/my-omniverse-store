// Simple animated background + Audio player
const canvas = document.getElementById('scene');
const ctx = canvas.getContext('2d');
const playBtn = document.getElementById('play');
const debug = document.getElementById('debug');
const log = (m)=>{debug.textContent+=m+'\n'; console.log(m);};

const audio = new Audio('assets/audio.mp3');
audio.crossOrigin = 'anonymous';
let playing = false;

playBtn.addEventListener('click', async ()=>{
  try {
    if(!playing){
      await audio.play();
      playing = true;
      playBtn.textContent = 'Pause';
      log('🎧 Playing...');
    } else {
      audio.pause();
      playing = false;
      playBtn.textContent = 'Play / Pause';
      log('⏸️ Paused');
    }
  } catch(e){
    log('❌ Audio error: ' + e.message);
  }
});

function resize(){
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();

const particles = Array.from({length: 80}, ()=>({
  x: Math.random()*canvas.width,
  y: Math.random()*canvas.height,
  r: Math.random()*1.8+0.5,
  s: Math.random()*0.5+0.2
}));

function draw(){
  ctx.fillStyle = 'rgba(0,0,0,0.15)';
  ctx.fillRect(0,0,canvas.width,canvas.height);
  ctx.fillStyle = 'rgba(233,199,122,0.7)';
  particles.forEach(p=>{
    ctx.beginPath();
    ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
    ctx.fill();
    p.y += p.s;
    if(p.y > canvas.height) p.y = 0;
  });
  requestAnimationFrame(draw);
}
draw();

log('꙰ Page loaded — tap Play to start audio');
