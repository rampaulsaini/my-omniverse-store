// scripts/metadata-fetcher.js
// Node (CommonJS) friendly. Requires node-fetch v2 for older Node versions.
// npm install node-fetch@2

const fetch = require('node-fetch');

async function fetchRepoInfo(user, repo) {
  const api = `https://api.github.com/repos/${encodeURIComponent(user)}/${encodeURIComponent(repo)}`;
  const res = await fetch(api, { headers: { 'User-Agent': 'omniverse-dashboard' } });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return await res.json();
}

async function fetchMultipleRepos(user, repos = []) {
  const results = {};
  await Promise.all(repos.map(async r => {
    try {
      results[r] = await fetchRepoInfo(user, r);
    } catch (e) {
      results[r] = { error: e.message };
    }
  }));
  return results;
}

// Basic HEAD check using fetch. Note: browser HEAD may be blocked by CORS.
// Best used server-side or in CI.
async function headCheck(url, timeout = 6000) {
  try {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);
    const res = await fetch(url, { method: 'HEAD', signal: controller.signal });
    clearTimeout(id);
    return { ok: res.ok, status: res.status, headers: Object.fromEntries(res.headers) };
  } catch (e) {
    return { ok: false, status: 'error', error: e.message };
  }
}

async function getGithubRateLimit() {
  const api = 'https://api.github.com/rate_limit';
  const res = await fetch(api, { headers: { 'User-Agent': 'omniverse-dashboard' } });
  if (!res.ok) throw new Error(`${res.status}`);
  return await res.json();
}

module.exports = { fetchRepoInfo, fetchMultipleRepos, headCheck, getGithubRateLimit };

/*
Usage example (node):
const { fetchRepoInfo, headCheck } = require('./scripts/metadata-fetcher');
fetchRepoInfo('rampaulsaini','Omniverse-AI').then(console.log).catch(console.error);
headCheck('https://rampaulsaini.github.io/Omniverse-AI/').then(console.log);
*/
        
