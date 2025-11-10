// generate-extended-sitemap.js
const fs = require('fs');
const path = require('path');
const BASE_URL = 'https://rampaulsaini.github.io/my-omniverse-store/';
const ROOT_DIR = './';
const EXTERNAL_LINKS = [
  'https://drive.google.com/drive/folders/18iPsn9Rjc7E0jNwvIx_h5MwQrhqyYt1Y',
  'https://drive.google.com/drive/folders/1sZEJhlZWFHP7O1kZEINnqFCNgqhOa8XC',
  'https://drive.google.com/drive/folders/1Ap2N-90wM9R75ffOQAiXczZwNu8dTc7u',
  'https://photos.app.goo.gl/bMoqL2Cx7kKpkmMy6',
  'https://photos.app.goo.gl/hBJ4mN176PboQ7bb6',
  'https://youtube.com/@rampaulsaini-yk4gn',
  'http://multicosmovision.blogspot.com/'
];

let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`;

function walkDir(dir) {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const fullPath = path.join(dir,file);
    const stats = fs.statSync(fullPath);
    if(stats.isDirectory()) {
      if (file === '.git' || file === '.github' || file === 'node_modules') return;
      walkDir(fullPath);
    }
    else if(file.endsWith('.html')) {
      const rel = fullPath.replace(ROOT_DIR,'').replace(/\\/g,'/');
      sitemap += `
  <url>
    <loc>${BASE_URL}${rel}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
`;
    }
  });
}

function addExternal(){
  EXTERNAL_LINKS.forEach(link => {
    sitemap += `
  <url>
    <loc>${link}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
`;
  });
}

walkDir(ROOT_DIR);
addExternal();
sitemap += '</urlset>';
fs.writeFileSync(path.join(ROOT_DIR,'sitemap.xml'), sitemap);
console.log('sitemap.xml generated');
                                                        
