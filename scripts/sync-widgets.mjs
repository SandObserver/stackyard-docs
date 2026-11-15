/* Keep the color-scheme meta this script injects. Widget documents are
   transparent. Without it Chrome paints an opaque white canvas behind them in
   dark mode and the card disappears. */
import { execFileSync } from 'node:child_process';
import { cpSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { scopeCss } from './scope-css.mjs';

const REPO = process.env.STACKYARD_REPO ?? resolve(process.cwd(), '..', 'stackyard');
const PUB = resolve(process.cwd(), 'public');
const VENDOR = resolve(process.cwd(), 'vendor', 'stackyard');
const META = '<meta name="color-scheme" content="dark">';
const ROBOTS = '<meta name="robots" content="noindex">';

const git = (...args) => execFileSync('git', ['-C', REPO, ...args], { encoding: 'utf8' }).trim();
const REF =
  process.argv[2] ??
  git('tag', '--list', 'v*', '--sort=-v:refname')
    .split('\n')
    .find((t) => /^v\d+\.\d+\.\d+$/.test(t));
if (!REF) throw new Error(`No release tag in ${REPO}. Pass a ref: npm run sync-widgets -- v1.2.3`);

const PATHS = ['ui/widgets', 'ui/js', 'ui/css/tokens.css', 'ui/css/admin.css', 'ui/i18n/en.json', 'ui/admin/index.html', 'docs/widget-template'];
const tree = mkdtempSync(join(tmpdir(), 'stackyard-'));
const tar = join(tree, 'tree.tar');
execFileSync('git', ['-C', REPO, 'archive', '--format=tar', '-o', tar, REF, ...PATHS]);
execFileSync('tar', ['-xf', tar, '-C', tree]);

for (const [from, to] of [
  ['ui/widgets', join(PUB, 'widgets')],
  ['ui/js', join(PUB, 'js')],
  ['docs/widget-template', join(PUB, 'widgets', 'mywidget')],
  ['ui/css/tokens.css', join(VENDOR, 'tokens.css')],
  ['ui/css/admin.css', join(VENDOR, 'admin.css')],
  ['ui/i18n/en.json', join(PUB, 'i18n', 'en.json')],
  ['ui/admin/index.html', join(VENDOR, 'admin.html')],
]) {
  rmSync(to, { recursive: true, force: true });
  mkdirSync(dirname(to), { recursive: true });
  cpSync(join(tree, from), to, { recursive: true, filter: (src) => !src.endsWith('README.md') });
}
writeFileSync(join(VENDOR, 'VERSION'), `${REF}\n`);
rmSync(join(PUB, 'css'), { recursive: true, force: true });
mkdirSync(join(PUB, 'css'));
const appCss = ['tokens.css', 'admin.css'].map((f) => readFileSync(join(VENDOR, f), 'utf8')).join('\n');
writeFileSync(join(PUB, 'css', 'settings.css'), scopeCss(appCss, '.sy-app, .row-dd-list'));

const admin = readFileSync(join(VENDOR, 'admin.html'), 'utf8');
const start = admin.indexOf('<section class="sec" id="sec-appearance"');
if (start < 0) throw new Error('Settings section sec-appearance is gone');
const section = admin.slice(start, admin.indexOf('</section>', start));
const appearance = section.slice(section.indexOf('<h2 class="grp-hdr"'));
const LIFTED = ['set-lbl-d', 'set-lbl-m', 'theme-slot', 'dev-transparency', 'set-awake', 'set-type-search', 'bg-type-slot', 'bg-unsplash-fields', 'bg-url-fields', 'bg-color-fields', 'bg-color-slot', 'bg-file-v', 'ie-bgurl-v', 'bg-fit-slot', 'bg-br', 'bg-brightness-row', 'bgcol-hint', 'bg-url-hint'];
for (const id of LIFTED) if (!appearance.includes(`id="${id}"`)) throw new Error(`Appearance element #${id} is gone`);
mkdirSync(join(PUB, 'settings'), { recursive: true });
writeFileSync(join(PUB, 'settings', 'appearance.json'), JSON.stringify({ appearance }));
rmSync(tree, { recursive: true, force: true });

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) walk(full, out);
    else if (name.endsWith('.html')) out.push(full);
  }
  return out;
}

let patched = 0;
for (const file of walk(join(PUB, 'widgets'))) {
  let html = readFileSync(file, 'utf8');
  const charset = html.match(/<meta charset="[^"]*">/i);
  if (!charset) continue;
  const inject = [];
  if (!html.includes('name="color-scheme"')) inject.push(META);
  if (!html.includes('name="robots"')) inject.push(ROBOTS);
  if (inject.length === 0) continue;
  html = html.replace(charset[0], [charset[0], ...inject].join('\n'));
  writeFileSync(file, html);
  patched++;
}

console.log(`app UI synced from ${REPO} at ${REF}; meta injected into ${patched} documents`);
