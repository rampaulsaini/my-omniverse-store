// scripts/link-checker.js
// Node script: crawl links on a single page and check HEAD status
// npm install node-fetch@2 cheerio

const fetch = require('node-fetch');
const cheerio = require('cheerio');
const { URL } = require('url');

async function crawlLinks(pageUrl) {
  const res = await fetch(pageUrl);
  if (!res.ok) throw new Error(`Failed to fetch ${pageUrl}: ${res.status}`);
  const html = await res.text();
  const $ = cheerio.load(html);
  const hrefs = new Set();

  $('a[href]').each((i, el) => {
    const h = $(el).attr('href').trim();
    if (h && !h.startsWith('javascript:') && !h.startsWith('mailto:') && h !== '#') {
      try {
        const abs = new URL(h, pageUrl).toString();
        hrefs.add(abs);
      } catch (_) { /* ignore invalid URLs */ }
    }
  });

  const checks = await Promise.all(Array.from(hrefs).map(async u => {
    try {
      // use HEAD first, fallback to GET
      let r = await fetch(u, { method: 'HEAD' });
      if (r.status === 405 || r.status === 501) r = await fetch(u, { method: 'GET' });
      return { url: u, status: r.status, ok: r.ok };
    } catch (e) {
      return { url: u, status: 'error', error: e.message };
    }
  }));

  return checks;
}

// CLI usage: node scripts/link-checker.js https://example.com/page
if (require.main === module) {
  (async () => {
    const page = process.argv[2];
    if (!page) {
      console.error('Usage: node scripts/link-checker.js <page-url>');
      process.exit(1);
    }
    try {
      const result = await crawlLinks(page);
      console.log(JSON.stringify(result, null, 2));
    } catch (e) {
      console.error(e);
    }
  })();
}

module.exports = { crawlLinks };
    
