// Place at .github/scripts/generate-products.js
const fs = require('fs');
const path = require('path');

const ASSETS_DIR = path.join(process.cwd(), 'assets');
const OUT = path.join(process.cwd(), 'products.json');

function humanFileSize(bytes) {
  const thresh = 1024;
  if(Math.abs(bytes) < thresh) return bytes + ' B';
  const units = ['KB','MB','GB','TB'];
  let u = -1;
  do {
    bytes /= thresh;
    ++u;
  } while(Math.abs(bytes) >= thresh && u < units.length - 1);
  return bytes.toFixed(1) + ' ' + units[u];
}

function scan() {
  if(!fs.existsSync(ASSETS_DIR)) {
    console.log('No assets dir, creating:', ASSETS_DIR);
    fs.mkdirSync(ASSETS_DIR, { recursive: true });
  }
  const items = fs.readdirSync(ASSETS_DIR).filter(f => !f.startsWith('.'));
  const products = items.map(filename => {
    const p = path.join(ASSETS_DIR, filename);
    const stat = fs.statSync(p);
    return {
      filename,
      title: filename.replace(/[-_]/g,' ').replace(/\.\w+$/, ''),
      description: '',
      type: path.extname(filename).toLowerCase(),
      size: humanFileSize(stat.size),
      url: `assets/${encodeURIComponent(filename)}`,
      note: ''
    };
  });
  fs.writeFileSync(OUT, JSON.stringify(products, null, 2), 'utf8');
  console.log('Wrote', OUT);
}

scan();
