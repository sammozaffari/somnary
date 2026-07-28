#!/usr/bin/env node
/**
 * Accessibility gate (audit WF-1) — the automatable half of the mandatory rendered + keyboard pass,
 * as a real gate instead of a hand check. Drives headless Chrome over the DevTools Protocol against
 * the BUILT output (the SAME zero-dependency harness as check-responsive.mjs — no puppeteer, no
 * playwright, no axe: Node 22+ ships a global WebSocket) and runs structural WCAG checks per route:
 *
 *   1 · exactly one <h1>, and headings never skip a level (h2→h4)      [1.3.1 / 2.4.6]
 *   2 · every <img> has an alt attribute (alt="" allowed for decorative) [1.1.1]
 *   3 · every input/select/textarea has an accessible name             [3.3.2 / 4.1.2]
 *   4 · every <button>/<a href> has an accessible name                 [2.4.4 / 4.1.2]
 *   5 · no positive tabindex (breaks keyboard order)                   [2.4.3]
 *
 *   npm run build && node scripts/check-a11y.mjs   # exit 1 on any violation
 *
 * It is intentionally conservative (only unambiguous, machine-decidable failures) so a green run is
 * trustworthy; it does NOT replace the human visual pass, it removes the tedious, regressable half.
 */
import { createServer } from 'node:http';
import { spawn } from 'node:child_process';
import { readdir, readFile, access, stat } from 'node:fs/promises';
import { join, extname } from 'node:path';
import { existsSync } from 'node:fs';
import { tmpdir } from 'node:os';

const DIST = 'dist/client';
const MIME = {
  '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.mjs': 'text/javascript',
  '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.avif': 'image/avif', '.gif': 'image/gif',
  '.ico': 'image/x-icon', '.woff2': 'font/woff2', '.woff': 'font/woff', '.ttf': 'font/ttf',
  '.xml': 'application/xml', '.txt': 'text/plain', '.map': 'application/json',
};
const exists = (p) => access(p).then(() => true, () => false);

function resolveChrome() {
  const candidates = [
    process.env.CHROME_PATH, process.env.PUPPETEER_EXECUTABLE_PATH,
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/Applications/Chromium.app/Contents/MacOS/Chromium',
    '/usr/bin/google-chrome', '/usr/bin/google-chrome-stable',
    '/usr/bin/chromium-browser', '/usr/bin/chromium',
  ].filter(Boolean);
  const found = candidates.find((p) => existsSync(p));
  if (!found) {
    console.error('✖ a11y: no Chrome/Chromium found. Set CHROME_PATH to a browser binary.');
    process.exit(1);
  }
  return found;
}

async function serveDist() {
  const server = createServer(async (req, res) => {
    try {
      const urlPath = decodeURIComponent((req.url || '/').split('?')[0]);
      let filePath = join(DIST, urlPath);
      if (await exists(filePath)) {
        if ((await stat(filePath)).isDirectory()) filePath = join(filePath, 'index.html');
      } else if (!extname(urlPath)) filePath = join(DIST, urlPath, 'index.html');
      if (!(await exists(filePath))) { res.writeHead(404); res.end('not found'); return; }
      res.writeHead(200, { 'content-type': MIME[extname(filePath)] || 'application/octet-stream' });
      res.end(await readFile(filePath));
    } catch { res.writeHead(500); res.end('error'); }
  });
  await new Promise((r) => server.listen(0, '127.0.0.1', r));
  return { server, port: server.address().port };
}

async function discoverRoutes(dir = DIST, base = '') {
  const routes = [];
  for (const e of await readdir(dir, { withFileTypes: true })) {
    if (e.isDirectory()) routes.push(...(await discoverRoutes(join(dir, e.name), `${base}/${e.name}`)));
    else if (e.name === 'index.html') routes.push(base === '' ? '/' : base);
  }
  return routes;
}

class CDP {
  constructor(ws) {
    this.ws = ws; this.id = 0; this.pending = new Map(); this.waiters = [];
    ws.addEventListener('message', (ev) => {
      const msg = JSON.parse(ev.data);
      if (msg.id != null && this.pending.has(msg.id)) {
        const { resolve, reject } = this.pending.get(msg.id);
        this.pending.delete(msg.id);
        msg.error ? reject(new Error(msg.error.message)) : resolve(msg.result);
      } else if (msg.method) {
        this.waiters = this.waiters.filter((w) => (w.method === msg.method ? (w.resolve(msg.params), false) : true));
      }
    });
  }
  send(method, params = {}) {
    const id = ++this.id;
    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
      this.ws.send(JSON.stringify({ id, method, params }));
    });
  }
  once(method, timeoutMs = 15000) {
    return new Promise((resolve, reject) => {
      const w = { method, resolve };
      this.waiters.push(w);
      setTimeout(() => { this.waiters = this.waiters.filter((x) => x !== w); reject(new Error(`timed out: ${method}`)); }, timeoutMs);
    });
  }
}

// Injected into each page — pure DOM, returns { violations: string[] }. Accessible-name logic is a
// pragmatic subset of the accname algorithm (aria-label(ledby) → text/alt → title).
const AUDIT = `(async () => {
  await document.fonts.ready.catch(() => {});
  const V = [];
  const named = (el) => {
    if (el.getAttribute('aria-label')?.trim()) return true;
    const lb = el.getAttribute('aria-labelledby');
    if (lb && lb.split(/\\s+/).some((id) => document.getElementById(id)?.textContent.trim())) return true;
    if (el.textContent && el.textContent.trim()) return true;
    if (el.querySelector('img[alt]')?.getAttribute('alt')?.trim()) return true;
    if (el.getAttribute('title')?.trim()) return true;
    return false;
  };
  const desc = (el) => el.tagName.toLowerCase() + (el.id ? '#' + el.id : (el.className && el.className.toString().trim() ? '.' + el.className.toString().trim().split(/\\s+/)[0] : ''));

  // 1 · headings
  const hs = [...document.querySelectorAll('h1,h2,h3,h4,h5,h6')];
  const h1s = hs.filter((h) => h.tagName === 'H1');
  if (h1s.length !== 1) V.push('headings: expected exactly one <h1>, found ' + h1s.length);
  let prev = 0;
  for (const h of hs) {
    const lvl = +h.tagName[1];
    if (prev && lvl > prev + 1) V.push('headings: skips from h' + prev + ' to h' + lvl + ' at "' + h.textContent.trim().slice(0, 40) + '"');
    prev = lvl;
  }
  // 2 · images
  for (const img of document.querySelectorAll('img')) {
    if (!img.hasAttribute('alt')) V.push('img without alt: ' + (img.getAttribute('src') || '').split('/').pop());
  }
  // 3 · form controls
  for (const el of document.querySelectorAll('input:not([type=hidden]), select, textarea')) {
    const hasLabel = el.id && document.querySelector('label[for="' + CSS.escape(el.id) + '"]');
    const wrapped = el.closest('label');
    if (!hasLabel && !wrapped && !el.getAttribute('aria-label')?.trim() && !el.getAttribute('aria-labelledby')) {
      V.push('form control without accessible name: ' + desc(el));
    }
  }
  // 4 · buttons + links
  for (const el of document.querySelectorAll('button, a[href]')) {
    if (el.getAttribute('aria-hidden') === 'true') continue;
    if (!named(el)) V.push('interactive without accessible name: ' + desc(el));
  }
  // 5 · positive tabindex
  for (const el of document.querySelectorAll('[tabindex]')) {
    if (parseInt(el.getAttribute('tabindex'), 10) > 0) V.push('positive tabindex (' + el.getAttribute('tabindex') + '): ' + desc(el));
  }
  return JSON.stringify({ violations: [...new Set(V)] });
})()`;

/** Launch headless Chrome and connect a CDP session to a fresh page. Returns { cdp, cleanup }. */
async function launchCdp() {
  const chrome = resolveChrome();
  const child = spawn(chrome, [
    '--headless=new', '--disable-gpu', '--no-sandbox', '--disable-dev-shm-usage',
    '--remote-debugging-port=0', `--user-data-dir=${join(tmpdir(), 'somnary-a11y-' + process.pid)}`,
    'about:blank',
  ]);
  const wsUrl = await new Promise((resolve, reject) => {
    let buf = '';
    const to = setTimeout(() => reject(new Error('Chrome did not report a DevTools endpoint')), 20000);
    child.stderr.on('data', (d) => {
      buf += d.toString();
      const m = buf.match(/ws:\/\/127\.0\.0\.1:(\d+)\//);
      if (m) { clearTimeout(to); resolve(`127.0.0.1:${m[1]}`); }
    });
    child.on('exit', (c) => reject(new Error(`Chrome exited early (${c})`)));
  });
  const target = await fetch(`http://${wsUrl}/json/new`, { method: 'PUT' }).then((r) => r.json());
  const ws = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((r, j) => { ws.addEventListener('open', r); ws.addEventListener('error', j); });
  const cdp = new CDP(ws);
  await cdp.send('Page.enable');
  return { cdp, cleanup: () => { ws.close(); child.kill(); } };
}

// A page seeded with 4 distinct violations, so a green run can't be a broken-checker false-pass.
const BAD_PAGE =
  'data:text/html,' +
  encodeURIComponent(
    '<h2>no h1</h2><h2>x</h2><h4>skip</h4><img src=x.png><a href="/x"></a><input type="text"><button tabindex="3">go</button>',
  );

async function selftest() {
  const { cdp, cleanup } = await launchCdp();
  const loaded = cdp.once('Page.loadEventFired');
  await cdp.send('Page.navigate', { url: BAD_PAGE });
  await loaded.catch(() => {});
  const { result } = await cdp.send('Runtime.evaluate', { expression: AUDIT, awaitPromise: true, returnByValue: true });
  const { violations } = JSON.parse(result.value);
  cleanup();
  const kinds = ['expected exactly one', 'skips from', 'img without alt', 'without accessible name', 'positive tabindex'];
  const hit = kinds.filter((k) => violations.some((v) => v.includes(k)));
  if (hit.length >= 4) {
    console.log(`✓ a11y self-test: seeded page flagged ${violations.length} violations across ${hit.length} check types.`);
    return;
  }
  console.error('✖ a11y self-test FAILED — checker missed seeded violations:', JSON.stringify(violations));
  process.exit(1);
}

async function main() {
  if (process.argv.includes('--selftest')) return selftest();
  if (!(await exists(DIST))) {
    console.error(`✖ a11y: ${DIST} not found — run \`npm run build\` first.`);
    process.exit(1);
  }
  const { server, port } = await serveDist();
  const routes = (await discoverRoutes()).sort();
  const base = `http://127.0.0.1:${port}`;

  const { cdp, cleanup } = await launchCdp();

  let total = 0;
  const failures = [];
  for (const route of routes) {
    const loaded = cdp.once('Page.loadEventFired');
    await cdp.send('Page.navigate', { url: base + route });
    await loaded.catch(() => {});
    const { result } = await cdp.send('Runtime.evaluate', { expression: AUDIT, awaitPromise: true, returnByValue: true });
    const { violations } = JSON.parse(result.value);
    if (violations.length) {
      total += violations.length;
      failures.push({ route, violations });
      console.error(`✖ ${route}`);
      for (const v of violations) console.error(`    · ${v}`);
    }
  }

  cleanup(); server.close();

  if (failures.length) {
    console.error(`\n✖ a11y: ${total} violation(s) across ${failures.length}/${routes.length} route(s).`);
    process.exit(1);
  }
  console.log(`✓ a11y: ${routes.length} route(s) clean — one h1 / no heading skips, alt text, labelled controls, named interactives, no positive tabindex.`);
}

main().catch((e) => {
  console.error('✖ a11y gate errored:', e.message);
  process.exit(1);
});
