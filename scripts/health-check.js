// scripts/health-check.js
// Node-friendly health check. Use in CI or locally.

const fetch = require('node-fetch');

async function checkSite(url, timeout = 5000) {
  try {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);
    const res = await fetch(url, { method: 'GET', signal: controller.signal });
    clearTimeout(id);
    return { url, ok: res.ok, status: res.status, length: parseInt(res.headers.get('content-length') || '0'), redirected: res.redirected };
  } catch (e) {
    return { url, ok: false, status: 'error', error: e.message };
  }
}

async function checkSites(urls = [], timeout = 5000) {
  return await Promise.all(urls.map(u => checkSite(u, timeout)));
}

// CLI friendly
if (require.main === module) {
  const urls = process.argv.slice(2);
  if (!urls.length) {
    console.error('Usage: node scripts/health-check.js <url1> <url2> ...');
    process.exit(1);
  }
  (async () => {
    const res = await checkSites(urls, 6000);
    console.log(JSON.stringify(res, null, 2));
  })();
}

module.exports = { checkSite, checkSites };

