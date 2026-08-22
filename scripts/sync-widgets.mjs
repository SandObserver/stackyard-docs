/* Keep the color-scheme meta this script injects. Widget documents are
   transparent. Without it Chrome paints an opaque white canvas behind them in
   dark mode and the card disappears. */
import { cpSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

const REPO = process.env.STACKYARD_REPO ?? resolve(process.cwd(), '..', 'stackyard');
const PUB = resolve(process.cwd(), 'public');
const META = '<meta name="color-scheme" content="dark">';

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
  if (html.includes('name="color-scheme"')) continue;
  const charset = html.match(/<meta charset="[^"]*">/i);
  if (!charset) continue;
  html = html.replace(charset[0], `${charset[0]}\n${META}`);
  writeFileSync(file, html);
  patched++;
}

console.log(`widgets and js synced from ${REPO}; color-scheme declared in ${patched} documents`);
