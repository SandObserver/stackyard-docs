/* Keep the color-scheme meta this script injects. Widget documents are
   transparent. Without it Chrome paints an opaque white canvas behind them in
   dark mode and the card disappears. */
import { execFileSync } from 'node:child_process';
import { cpSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';

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
  ['ui/css/tokens.css', join(PUB, 'css', 'tokens.css')],
  ['ui/css/admin.css', join(PUB, 'css', 'admin.css')],
  ['ui/i18n/en.json', join(PUB, 'i18n', 'en.json')],
  ['ui/admin/index.html', join(VENDOR, 'admin.html')],
]) {
  rmSync(to, { recursive: true, force: true });
  mkdirSync(dirname(to), { recursive: true });
  cpSync(join(tree, from), to, { recursive: true, filter: (src) => !src.endsWith('README.md') });
}
writeFileSync(join(VENDOR, 'VERSION'), `${REF}\n`);
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
