/* Keep the color-scheme meta this script injects. Widget documents are
   transparent. Without it Chrome paints an opaque white canvas behind them in
   dark mode and the card disappears. */
import { cpSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

const REPO = process.env.STACKYARD_REPO ?? resolve(process.cwd(), '..', 'stackyard');
const PUB = resolve(process.cwd(), 'public');
const META = '<meta name="color-scheme" content="dark">';
const ROBOTS = '<meta name="robots" content="noindex">';

for (const [from, to] of [
  [join(REPO, 'ui', 'widgets'), join(PUB, 'widgets')],
  [join(REPO, 'ui', 'js'), join(PUB, 'js')],
]) {
  rmSync(to, { recursive: true, force: true });
  cpSync(from, to, { recursive: true });
}

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

console.log(`widgets and js synced from ${REPO}; meta injected into ${patched} documents`);
