// @ts-check
import { execFileSync } from 'node:child_process';
import { existsSync } from 'node:fs';

const git = (...args) => execFileSync('git', args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();

/* A shallow clone gives every file the last commit's date. Return no date instead. */
function fullHistory() {
  try {
    if (git('rev-parse', '--is-shallow-repository') === 'false') return true;
    git('fetch', '--unshallow', '--quiet');
    return git('rev-parse', '--is-shallow-repository') === 'false';
  } catch {
    return false;
  }
}

function sourceOf(pathname) {
  if (pathname === '/') return ['src/pages/index.astro'];
  const slug = pathname.replace(/^\/|\/$/g, '');
  const base = `src/content/docs/${slug}`;
  return [`${base}.md`, `${base}.mdx`, `${base}/index.md`, `${base}/index.mdx`];
}

let history;
const cache = new Map();

/** @param {string} url */
export function lastModified(url) {
  history ??= fullHistory();
  if (!history) return undefined;
  const file = sourceOf(new URL(url).pathname).find((f) => existsSync(f));
  if (!file) return undefined;
  if (!cache.has(file)) cache.set(file, git('log', '-1', '--format=%cI', '--', file) || undefined);
  return cache.get(file);
}
