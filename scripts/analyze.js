// scripts/analyze.js
// Lightweight static analysis for a single page
const fetch = require('node-fetch');
const cheerio = require('cheerio');

async function analyzePage(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch ${url}`);
  const html = await res.text();
  const $ = cheerio.load(html);

  const title = $('title').text().trim() || null;
  const hasMetaDescription = $('meta[name="description"]').length > 0;
  const scripts = $('script[src]').length;
  const inlineScripts = $('script:not([src])').length;
  const images = $('img[src]').length;
  const links = $('a[href]').length;
  const length = html.length;

  const metaRobots = $('meta[name="robots"]').attr('content') || null;
  const viewport = $('meta[name="viewport"]').attr('content') || null;

  return { url, title, hasMetaDescription, metaRobots, viewport, scripts, inlineScripts, images, links, length };
}

// CLI
if (require.main === module) {
  (async () => {
    const url = process.argv[2];
    if (!url) { console.error('Usage: node scripts/analyze.js <url>'); process.exit(1); }
    try {
      const out = await analyzePage(url);
      console.log(JSON.stringify(out, null, 2));
    } catch (e) {
      console.error(e);
    }
  })();
}

module.exports = { analyzePage };
          
