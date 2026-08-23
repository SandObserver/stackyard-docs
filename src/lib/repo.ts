import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const REPO = process.env.STACKYARD_REPO ?? resolve(process.cwd(), '..', 'stackyard');

/* Returns null when the app repo is absent. Every caller must render a
   fallback, or the page ships empty. */
export function readRepoFile(relativePath: string): string | null {
  const full = resolve(REPO, relativePath);
  if (!full.startsWith(resolve(REPO))) return null;
  if (!existsSync(full)) return null;
  return readFileSync(full, 'utf8');
}

export function stripTitle(markdown: string): string {
  return markdown.replace(/^#\s+.*\n+/, '');
}

export function absolutiseLinks(markdown: string): string {
  const base = 'https://github.com/SandObserver/stackyard/blob/main/';
  return markdown.replace(/\]\((?!https?:|#|\/)([^)]+)\)/g, `](${base}$1)`);
}

/* Returns null when the app repo is absent or its manifest is unreadable.
   scripts/check-dist.mjs fails the build when the badge is missing, so a null
   here cannot ship as a blank footer. */
export function readAppVersion(): string | null {
  const raw = readRepoFile('api/package.json');
  if (!raw) return null;
  try {
    const version = JSON.parse(raw)?.version;
    return typeof version === 'string' && version ? version : null;
  } catch {
    return null;
  }
}
