import { spawn } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { createServer } from 'node:http';
import { tmpdir } from 'node:os';
import { extname, join, resolve } from 'node:path';

const DIST = resolve(process.cwd(), 'dist');
const OUT = resolve(process.cwd(), 'src', 'data', 'settings-examples.json');
const CHROME = process.env.CHROME ?? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const PAGES = {
  '/docs/customization/': ['appearance', 'wallpaper'],
  '/docs/badges/': ['app-edit-badge', 'app-edit-labels'],
  '/docs/security/': ['security'],
  '/docs/import-export/backup-and-restore/': ['backup'],
  '/docs/update/': ['about'],
};
const TYPES = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.mjs': 'text/javascript', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.woff2': 'font/woff2' };

if (!existsSync(DIST)) throw new Error('No dist. Run npm run build first.');
if (!existsSync(CHROME)) throw new Error(`No Chrome at ${CHROME}. Set CHROME to its path.`);

const server = createServer((req, res) => {
  let file = join(DIST, decodeURIComponent(new URL(req.url, 'http://x').pathname));
  if (existsSync(file) && statSync(file).isDirectory()) file = join(file, 'index.html');
  if (!file.startsWith(DIST) || !existsSync(file)) return res.writeHead(404).end();
  res.writeHead(200, { 'content-type': TYPES[extname(file)] ?? 'application/octet-stream' }).end(readFileSync(file));
});
await new Promise((done) => server.listen(0, '127.0.0.1', done));
const origin = `http://127.0.0.1:${server.address().port}`;

const profile = mkdtempSync(join(tmpdir(), 'snapshot-chrome-'));
const chrome = spawn(CHROME, ['--headless=new', '--remote-debugging-port=0', `--user-data-dir=${profile}`, 'about:blank'], { stdio: ['ignore', 'ignore', 'pipe'] });
const wsUrl = await new Promise((done, fail) => {
  let log = '';
  chrome.stderr.on('data', (d) => {
    log += d;
    const m = log.match(/DevTools listening on (ws:\S+)/);
    if (m) done(m[1]);
  });
  chrome.on('exit', () => fail(new Error(`Chrome exited:\n${log}`)));
});

const ws = new WebSocket(wsUrl);
await new Promise((done) => (ws.onopen = done));
let seq = 0;
const pending = new Map();
ws.onmessage = (e) => {
  const m = JSON.parse(e.data);
  pending.get(m.id)?.(m);
  pending.delete(m.id);
};
const send = (method, params = {}, sessionId) =>
  new Promise((done) => {
    const id = ++seq;
    pending.set(id, done);
    ws.send(JSON.stringify({ id, method, params, sessionId }));
  });
const { result: { targetId } } = await send('Target.createTarget', { url: 'about:blank' });
const { result: { sessionId } } = await send('Target.attachToTarget', { targetId, flatten: true });
const page = (method, params) => send(method, params, sessionId);
await page('Emulation.setDeviceMetricsOverride', { width: 1280, height: 900, deviceScaleFactor: 1, mobile: false });

const capture = (names) => `(async () => {
  const names = ${JSON.stringify(names)};
  for (let i = 0; i < 100; i++) {
    if (names.every((n) => document.querySelector('figure[data-shot="' + n + '"][data-live]'))) break;
    await new Promise((r) => setTimeout(r, 100));
  }
  await document.fonts.ready;
  await new Promise((r) => setTimeout(r, 300));
  const REFS = ['for', 'aria-labelledby', 'aria-describedby', 'aria-controls', 'aria-owns', 'aria-activedescendant', 'popovertarget', 'list'];
  const out = {};
  for (const n of names) {
    const live = document.querySelector('figure[data-shot="' + n + '"][data-live]');
    if (!live) throw new Error('Live example ' + n + ' did not render');
    const copy = live.cloneNode(true);
    const from = [live, ...live.querySelectorAll('*')];
    const to = [copy, ...copy.querySelectorAll('*')];
    from.forEach((el, i) => {
      const c = to[i];
      if (el instanceof HTMLInputElement) {
        c.toggleAttribute('checked', el.checked);
        if (el.type !== 'checkbox' && el.type !== 'radio') c.setAttribute('value', el.value);
      }
      if (c.closest('svg')) return;
      if (c.id) c.id = 's-' + c.id;
      for (const a of REFS) if (c.hasAttribute(a)) c.setAttribute(a, c.getAttribute(a).split(' ').map((x) => 's-' + x).join(' '));
    });
    delete copy.dataset.live;
    out[n] = copy.outerHTML;
  }
  return out;
})()`;

const examples = {};
try {
  for (const [path, names] of Object.entries(PAGES)) {
    await page('Page.navigate', { url: origin + path });
    for (let ready = false; !ready; ) {
      const r = await page('Runtime.evaluate', { expression: `location.pathname === ${JSON.stringify(path)} && document.readyState === 'complete'`, returnByValue: true });
      ready = r.result.result.value === true;
      if (!ready) await new Promise((r) => setTimeout(r, 100));
    }
    const r = await page('Runtime.evaluate', { expression: capture(names), awaitPromise: true, returnByValue: true });
    if (r.result.exceptionDetails) throw new Error(`${path}: ${r.result.exceptionDetails.exception?.description}`);
    Object.assign(examples, r.result.result.value);
  }
} finally {
  ws.close();
  const exited = new Promise((done) => chrome.once('exit', done));
  chrome.kill();
  await exited;
  server.close();
  rmSync(profile, { recursive: true, force: true, maxRetries: 5 });
}

mkdirSync(resolve(OUT, '..'), { recursive: true });
writeFileSync(OUT, `${JSON.stringify(examples, null, 2)}\n`);
console.log(`saved ${Object.keys(examples).join(', ')} to ${OUT}. Run npm run build again.`);
