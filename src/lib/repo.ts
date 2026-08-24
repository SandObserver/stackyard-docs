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

export type Heading = { depth: number; slug: string; text: string };

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/<[^>]+>/g, '')
    .replace(/[^\p{L}\p{N}]+/gu, '-')
    .replace(/^-+|-+$/g, '');
}

/* marked emits headings with no id, so nothing on a generated page is
   linkable and Starlight's table of contents renders empty. */
export function withHeadingIds(html: string, depths = [2, 3]): { html: string; headings: Heading[] } {
  const headings: Heading[] = [];
  const seen = new Map<string, number>();
  const out = html.replace(
    /<h([1-6])([^>]*)>([\s\S]*?)<\/h\1>/g,
    (match, level: string, attrs: string, inner: string) => {
      const depth = Number(level);
      if (!depths.includes(depth) || /\bid=/.test(attrs)) return match;
      const text = inner.replace(/<[^>]+>/g, '').trim();
      const base = slugify(text) || `section-${headings.length + 1}`;
      const n = seen.get(base) ?? 0;
      seen.set(base, n + 1);
      const slug = n ? `${base}-${n}` : base;
      headings.push({ depth, slug, text });
      return `<h${depth} id="${slug}"${attrs}>${inner}</h${depth}>`;
    },
  );
  return { html: out, headings };
}
