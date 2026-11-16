// @ts-check
import { createHash } from 'node:crypto';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const FILE = resolve(process.cwd(), 'src', 'data', 'settings-examples.json');

const raw = existsSync(FILE) ? readFileSync(FILE, 'utf8') : '{}';
/** @type {Record<string, string>} */
export const examples = JSON.parse(raw).examples ?? {};
/* Pass to the plugin as an option. Without it, a new snapshot builds pages with the old examples. */
export const examplesDigest = createHash('sha256').update(raw).digest('hex');

/** @param {string} html */
export function exampleName(html) {
  const s = html.trim();
  const marker = s.match(/^<div data-sy-example="([a-z-]+)"><\/div>$/);
  if (marker) return marker[1];
  if (!s.startsWith('<figure class="sy-shot">') || !s.endsWith('</figure>')) return null;
  return s.match(/<img[^>]* src="\/img\/admin\/([a-z-]+?)-[0-9a-f]{8}\.png"/)?.[1] ?? null;
}

/** @param {any} node */
function replace(node) {
  if (!node || !Array.isArray(node.children)) return;
  for (const child of node.children) {
    if (child.type !== 'raw') {
      replace(child);
      continue;
    }
    const name = exampleName(child.value);
    if (name && examples[name]) child.value = examples[name];
  }
}

export default function rehypeSettingsExamples() {
  /** @param {any} tree */
  return tree => replace(tree);
}
