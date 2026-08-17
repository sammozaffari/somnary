/* ds-loader: loads somnary components for card/kit HTMLs.
   Prefers the compiled _ds_bundle.js when present; otherwise fetches the .jsx sources,
   transpiles with Babel standalone, and evaluates the module graph. */
(function () {
  const abs = (p, base) => new URL(p, base || location.href).href;
  async function fetchText(url) { const r = await fetch(url); if (!r.ok) throw new Error(r.status + ' ' + url); return r.text(); }
  function findNamespace(probe) {
    for (const k of Object.keys(window)) {
      try { const v = window[k]; if (v && typeof v === 'object' && v[probe]) return v; } catch (e) {}
    }
    return null;
  }
  window.loadDS = async function (entries, opts) {
    opts = opts || {};
    const probe = opts.probe || 'BucketShape';
    // 1) try the compiled bundle
    const bundleUrl = abs(opts.bundle || (document.currentScript ? '' : '') || '_ds_bundle.js', opts.base || location.href);
    try {
      const code = await fetchText(bundleUrl);
      (0, eval)(code);
      const ns = findNamespace(probe);
      if (ns) return ns;
    } catch (e) { /* no bundle — compile from sources */ }
    // 2) compile from sources
    const sources = {};
    const IMP = /import\s+[^'"]*?from\s*['"]([^'"]+)['"];?/g;
    async function collect(url) {
      if (sources[url]) return;
      const src = await fetchText(url);
      const deps = [];
      let m; const re = new RegExp(IMP.source, 'g');
      while ((m = re.exec(src))) { const d = m[1]; if (d !== 'react' && d !== 'react-dom' && d !== 'react-dom/client') deps.push(abs(d, url)); }
      sources[url] = { src, deps };
      await Promise.all(deps.map(collect));
    }
    const entryUrls = entries.map(e => abs(e, opts.base || location.href));
    await Promise.all(entryUrls.map(collect));
    const mods = {};
    function evalMod(url) {
      if (mods[url]) return mods[url].exports;
      const code = Babel.transform(sources[url].src, { presets: [['env', { modules: 'commonjs' }], ['react', { runtime: 'classic' }]], filename: url }).code;
      const module = { exports: {} };
      mods[url] = module;
      const req = (rel) => rel === 'react' ? window.React : rel === 'react-dom' || rel === 'react-dom/client' ? window.ReactDOM : evalMod(abs(rel, url));
      new Function('require', 'module', 'exports', code)(req, module, module.exports);
      return module.exports;
    }
    const DS = {};
    for (const u of entryUrls) Object.assign(DS, evalMod(u));
    return DS;
  };
})();
