#!/usr/bin/env node
/**
 * Responsive overflow gate — proves no page scrolls horizontally on a narrow phone.
 *
 *   npm run build && node scripts/check-responsive.mjs   # exit 1 on any horizontal overflow
 *
 * WHY THIS EXISTS: the mobile nav once shipped with no collapse, forcing every page ~610px
 * wide at a 390px viewport and clipping content site-wide — and it regressed a second time
 * after the first fix never merged. A pure-Node gate can't see layout, so this one drives
 * headless Chrome over the DevTools Protocol (no puppeteer — Node 22+ ships a global
 * WebSocket) against the BUILT output, sets a 360px mobile viewport, and asserts
 * scrollWidth === innerWidth for every prerendered route.
 *
 * Zero new dependencies: a tiny static server for dist/client + a minimal CDP client.
 */
import { createServer } from 'node:http';
import { spawn } from 'node:child_process';
import { readdir, readFile, access, stat } from 'node:fs/promises';
import { join, extname } from 'node:path';
import { existsSync } from 'node:fs';
import { tmpdir } from 'node:os';

const DIST = 'dist/client';
const VIEWPORT_WIDTH = 360; // strictest common phone; passing 360 implies wider widths fit
const VIEWPORT_HEIGHT = 800;

const MIME = {
  '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.mjs': 'text/javascript',
  '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.avif': 'image/avif', '.gif': 'image/gif',
  '.ico': 'image/x-icon', '.woff2': 'font/woff2', '.woff': 'font/woff', '.ttf': 'font/ttf',
  '.xml': 'application/xml', '.txt': 'text/plain', '.map': 'application/json',
};

const exists = (p) => access(p).then(() => true, () => false);

// ---- resolve a Chrome/Chromium executable (env override → common mac/linux paths) ----
function resolveChrome() {
  const fromEnv = process.env.CHROME_PATH || process.env.PUPPETEER_EXECUTABLE_PATH;
  const candidates = [
    fromEnv,
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/Applications/Chromium.app/Contents/MacOS/Chromium',
    '/usr/bin/google-chrome',
    '/usr/bin/google-chrome-stable',
    '/usr/bin/chromium-browser',
    '/usr/bin/chromium',
  ].filter(Boolean);
  const found = candidates.find((p) => existsSync(p));
  if (!found) {
    console.error('✖ responsive: no Chrome/Chromium found. Set CHROME_PATH to a browser binary.');
    process.exit(1);
  }
  return found;
}

// ---- tiny static server for dist/client (maps /route → /route/index.html) ----
async function serveDist() {
  const server = createServer(async (req, res) => {
    try {
      let urlPath = decodeURIComponent((req.url || '/').split('?')[0]);
      let filePath = join(DIST, urlPath);
      if (await exists(filePath)) {
        const s = await stat(filePath);
        if (s.isDirectory()) filePath = join(filePath, 'index.html');
      } else if (!extname(urlPath)) {
        filePath = join(DIST, urlPath, 'index.html');
      }
      if (!(await exists(filePath))) {
        res.writeHead(404);
        res.end('not found');
        return;
      }
      const body = await readFile(filePath);
      res.writeHead(200, { 'content-type': MIME[extname(filePath)] || 'application/octet-stream' });
      res.end(body);
    } catch {
      res.writeHead(500);
      res.end('error');
    }
  });
  await new Promise((r) => server.listen(0, '127.0.0.1', r));
  return { server, port: server.address().port };
}

// ---- discover every prerendered route by walking dist/client for index.html ----
async function discoverRoutes(dir = DIST, base = '') {
  const routes = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      routes.push(...(await discoverRoutes(join(dir, entry.name), `${base}/${entry.name}`)));
    } else if (entry.name === 'index.html') {
      routes.push(base === '' ? '/' : base);
    }
  }
  return routes;
}

// ---- minimal CDP client over the built-in WebSocket ----
class CDP {
  constructor(ws) {
    this.ws = ws;
    this.id = 0;
    this.pending = new Map();
    this.waiters = [];
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
      setTimeout(() => {
        this.waiters = this.waiters.filter((x) => x !== w);
        reject(new Error(`timed out waiting for ${method}`));
      }, timeoutMs);
    });
  }
}

const MEASURE = `(async () => {
  await document.fonts.ready;
  await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));
  const de = document.scrollingElement || document.documentElement;
  const vw = window.innerWidth, scrollW = de.scrollWidth;
  const offenders = [];
  if (scrollW > vw + 1) {
    for (const el of document.querySelectorAll('*')) {
      const r = el.getBoundingClientRect();
      if (r.right > vw + 1 && r.width > 24) {
        const cls = (el.className && el.className.toString().trim().split(/\\s+/)[0]) || '';
        offenders.push(el.tagName.toLowerCase() + (cls ? '.' + cls : '') + ' (right=' + Math.round(r.right) + ')');
      }
    }
  }
  return JSON.stringify({ vw, scrollW, offenders: [...new Set(offenders)].slice(0, 8) });
})()`;

async function main() {
  if (!(await exists(DIST))) {
    console.error(`✖ responsive: ${DIST} not found — run \`npm run build\` first.`);
    process.exit(1);
  }

  const chrome = resolveChrome();
  const { server, port } = await serveDist();
  const routes = (await discoverRoutes()).sort();
  const base = `http://127.0.0.1:${port}`;

  // launch headless Chrome, parse the DevTools ws endpoint from stderr
  const child = spawn(chrome, [
    '--headless=new', '--disable-gpu', '--no-sandbox', '--disable-dev-shm-usage',
    '--remote-debugging-port=0', `--user-data-dir=${join(tmpdir(), 'somnary-responsive-' + process.pid)}`,
    'about:blank',
  ]);
  const wsUrl = await new Promise((resolve, reject) => {
    let buf = '';
    const to = setTimeout(() => reject(new Error('Chrome did not report a DevTools endpoint')), 20000);
    child.stderr.on('data', (d) => {
      buf += d.toString();
      const m = buf.match(/ws:\/\/127\.0\.0\.1:(\d+)\//);
      if (m) { clearTimeout(to); resolve({ dv: `127.0.0.1:${m[1]}` }); }
    });
    child.on('exit', (c) => reject(new Error(`Chrome exited early (${c})`)));
  });

  // open a fresh page target and connect to it
  const target = await fetch(`http://${wsUrl.dv}/json/new`, { method: 'PUT' }).then((r) => r.json());
  const ws = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((r, j) => { ws.addEventListener('open', r); ws.addEventListener('error', j); });
  const cdp = new CDP(ws);

  await cdp.send('Page.enable');
  // mobile:false is deliberate — mobile:true invokes Chrome's mobile-emulation path where the
  // meta-viewport tag drives layout and the width balloons to ~980px. With mobile:false the
  // override sets a true 360px LAYOUT viewport, which is what the max-width media queries read.
  await cdp.send('Emulation.setDeviceMetricsOverride', {
    width: VIEWPORT_WIDTH, height: VIEWPORT_HEIGHT, deviceScaleFactor: 1, mobile: false,
  });

  // self-check: never let the gate silently run at the wrong width (that would pass everything)
  await cdp.send('Page.navigate', { url: base + '/' });
  await cdp.once('Page.loadEventFired').catch(() => {});
  const probe = await cdp.send('Runtime.evaluate', { expression: 'window.innerWidth', returnByValue: true });
  if (probe.result.value !== VIEWPORT_WIDTH) {
    console.error(`✖ responsive: viewport override failed — innerWidth is ${probe.result.value}, expected ${VIEWPORT_WIDTH}. Aborting so this can't false-pass.`);
    ws.close(); child.kill(); server.close();
    process.exit(1);
  }

  const failures = [];
  for (const route of routes) {
    const loaded = cdp.once('Page.loadEventFired');
    await cdp.send('Page.navigate', { url: base + route });
    await loaded.catch(() => {});
    const { result } = await cdp.send('Runtime.evaluate', {
      expression: MEASURE, awaitPromise: true, returnByValue: true,
    });
    const data = JSON.parse(result.value);
    if (data.scrollW > data.vw + 1) {
      failures.push({ route, ...data });
      console.error(`✖ ${route}  scrollWidth ${data.scrollW} > viewport ${data.vw}  →  ${data.offenders.join(', ')}`);
    }
  }

  ws.close();
  child.kill();
  server.close();

  if (failures.length) {
    console.error(`\n✖ responsive: ${failures.length}/${routes.length} route(s) overflow at ${VIEWPORT_WIDTH}px.`);
    process.exit(1);
  }
  console.log(`✓ responsive: ${routes.length} route(s) fit a ${VIEWPORT_WIDTH}px viewport — no horizontal overflow.`);
}

main().catch((e) => {
  console.error('✖ responsive gate errored:', e.message);
  process.exit(1);
});
