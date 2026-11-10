// @ts-check
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fromHtml } from 'hast-util-from-html';

const REPO = process.env.STACKYARD_REPO ?? resolve(process.cwd(), '..', 'stackyard');
const SOURCE = resolve(REPO, 'ui/js/icon-set.js');

/* Load at config time. The module runner that serves astro.config.mjs closes
   before Markdown renders, and a later import from this file throws. */
const set = existsSync(SOURCE)
  ? await import(`data:text/javascript;base64,${Buffer.from(readFileSync(SOURCE, 'utf8')).toString('base64')}`)
  : null;

const ASIDE_ICONS = { note: 'info', caution: 'warning', danger: 'failure' };
let seq = 0;

/** @param {any} node @returns {string[]} */
const classes = (node) => [node.properties?.className ?? []].flat().map(String);

/** @param {any} svg @param {string} id */
function redraw(svg, id) {
  if (!set?.ICONS[id]) return;
  const { defs, sym } = set.symbol(id, set.ICONS[id]);
  const markup = `${defs ? `<defs>${defs}</defs>` : ''}${sym.replace(/^<symbol[^>]*>|<\/symbol>$/g, '')}`
    .split(`sy-solid-${id}`)
    .join(`sy-md${seq++}-${id}`);
  svg.children = /** @type {any} */ (fromHtml(`<svg>${markup}</svg>`, { fragment: true, space: 'svg' }).children[0]).children;
  delete svg.properties.fill;
}

export default function rehypeStackyardIcons() {
  /** @param {any} node @param {string} [aside] */
  const walk = (node, aside) => {
    if (node.type !== 'element' && node.type !== 'root') return;
    const cls = node.type === 'element' ? classes(node) : [];
    const variant = cls.find((c) => c.startsWith('starlight-aside--'))?.slice('starlight-aside--'.length) ?? aside;
    if (node.tagName === 'svg' && cls.includes('starlight-aside__icon')) {
      if (variant && ASIDE_ICONS[variant]) redraw(node, ASIDE_ICONS[variant]);
      return;
    }
    if (node.tagName === 'span' && cls.includes('sl-anchor-icon')) {
      const svg = node.children.find((/** @type {any} */ c) => c.tagName === 'svg');
      if (svg) redraw(svg, 'link');
      return;
    }
    for (const child of node.children ?? []) walk(child, variant);
  };
  return (/** @type {any} */ tree) => walk(tree);
}
