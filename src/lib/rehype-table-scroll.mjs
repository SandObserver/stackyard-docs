// @ts-check

/* Wraps every markdown table in a horizontally scrollable container, so a wide
   table scrolls instead of clipping its last column on a narrow screen. */

const CLASS = 'sy-tscroll';

/** @param {any} node */
function wrapTables(node) {
  if (!node || !Array.isArray(node.children)) return;
  const children = node.children;
  for (const child of children) wrapTables(child);
  node.children = children.map(child =>
    child.type === 'element' && child.tagName === 'table'
      ? {
          type: 'element',
          tagName: 'div',
          properties: { className: [CLASS] },
          children: [child],
        }
      : child,
  );
}

export default function rehypeTableScroll() {
  /** @param {any} tree */
  return tree => wrapTables(tree);
}
