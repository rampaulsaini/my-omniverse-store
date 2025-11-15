// scripts/scripts.js
// Browser-side utilities for the dashboard UI

window.omniverse = window.omniverse || {};

omniverse.repoMap = (function(){
  const LS_KEY = 'omniverse_repo_map_v1';
  function load() {
    try { return JSON.parse(localStorage.getItem(LS_KEY) || '{}'); }
    catch { return {}; }
  }
  function save(map) {
    localStorage.setItem(LS_KEY, JSON.stringify(map));
  }
  function set(k,v) {
    const m = load(); m[k]=v; save(m);
  }
  function get(k) {
    const m = load(); return m[k];
  }
  function all() { return load(); }
  function clear(){ localStorage.removeItem(LS_KEY); }

  return { load, save, set, get, all, clear };
})();

// small helper to fetch JSON with timeout
omniverse.fetchJson = async function(url, opts = {}, timeout = 7000) {
  const controller = new AbortController();
  const id = setTimeout(()=>controller.abort(), timeout);
  try {
    const res = await fetch(url, {...opts, signal: controller.signal});
    clearTimeout(id);
    if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
    return await res.json();
  } catch (e) {
    clearTimeout(id);
    throw e;
  }
};

// pretty date
omniverse.prettyDate = function(d) {
  try { return new Date(d).toLocaleString(); } catch { return d; }
};
                                     
