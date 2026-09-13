const FINE = '(hover: hover) and (pointer: fine)';
const REDUCE = '(prefers-reduced-motion: reduce)';
const EASE = 'cubic-bezier(.32,.72,0,1)';
const REVEAL_MS = 200;

const HOVER_LISTS = [
  { container: '.sidebar-content', item: 'a, summary' },
  { container: 'starlight-toc nav', item: 'a' },
];
const DISCLOSURES = '#starlight__sidebar details, details.cl-item, details.sy-disc';

const measurable = (el: Element) => {
  const r = el.getBoundingClientRect();
  return r.width > 0 && r.height > 0;
};

const ensurePill = (container: Element, variant: string) => {
  let pill = container.querySelector<HTMLElement>(`:scope > .sy-mp--${variant}`);
  if (!pill) {
    pill = document.createElement('div');
    pill.className = `sy-mp sy-mp--${variant}`;
    pill.setAttribute('aria-hidden', 'true');
    container.prepend(pill);
  }
  return pill;
};

const placePill = (container: Element, pill: HTMLElement, item: Element) => {
  if (!measurable(container) || !measurable(item)) {
    pill.classList.remove('on');
    return;
  }
  const cr = container.getBoundingClientRect();
  const ir = item.getBoundingClientRect();
  const cs = getComputedStyle(item);
  const rtl = cs.direction === 'rtl';
  const inline = (rtl ? cr.right - ir.right : ir.left - cr.left) - container.clientLeft;
  const block = ir.top - cr.top - container.clientTop;
  pill.style.borderRadius = cs.borderRadius;
  pill.style.width = `${ir.width}px`;
  pill.style.height = `${ir.height}px`;
  pill.style.transform = `translate3d(${rtl ? -inline : inline}px,${block}px,0)`;
  if (!pill.classList.contains('on')) {
    pill.getBoundingClientRect();
    pill.classList.add('on');
  }
};

const hovered = new Map<Element, Element | null>();
const tocs = new Set<Element>();

const refresh = () => {
  for (const [container, item] of hovered) {
    const pill = ensurePill(container, 'hover');
    if (item?.isConnected) placePill(container, pill, item);
    else pill.classList.remove('on');
  }
  for (const nav of tocs) {
    const current = nav.querySelector('a[aria-current="true"]');
    if (current) placePill(nav, ensurePill(nav, 'toc'), current);
  }
};

if (matchMedia(FINE).matches) {
  for (const cfg of HOVER_LISTS) {
    for (const container of document.querySelectorAll(cfg.container)) {
      container.addEventListener('pointerover', (e) => {
        if ((e as PointerEvent).pointerType !== 'mouse') return;
        const item = (e.target as Element).closest(cfg.item);
        if (!item || !container.contains(item)) return;
        hovered.set(container, item);
        refresh();
      });
      container.addEventListener('pointerleave', () => {
        hovered.set(container, null);
        refresh();
      });
    }
  }
}

for (const nav of document.querySelectorAll('starlight-toc nav')) {
  tocs.add(nav);
  new MutationObserver(refresh).observe(nav, {
    subtree: true,
    attributes: true,
    attributeFilter: ['aria-current'],
  });
}

const resizeObserver = new ResizeObserver(refresh);
for (const cfg of HOVER_LISTS) {
  for (const container of document.querySelectorAll(cfg.container)) resizeObserver.observe(container);
}
refresh();

const running = new WeakMap<HTMLDetailsElement, Animation[]>();

const heightWhen = (details: HTMLDetailsElement, open: boolean) => {
  details.open = open;
  return details.getBoundingClientRect().height;
};

const animateDisclosure = (details: HTMLDetailsElement, open: boolean) => {
  const from = details.getBoundingClientRect().height;
  for (const a of running.get(details) ?? []) a.cancel();
  const closed = heightWhen(details, false);
  const expanded = heightWhen(details, true);
  const duration = open ? REVEAL_MS : REVEAL_MS * 0.8;
  details.style.overflow = 'hidden';

  const size = details.animate(
    { height: [`${from}px`, `${open ? expanded : closed}px`] },
    { duration, easing: EASE },
  );
  const content = [...details.children].filter((el) => el.tagName !== 'SUMMARY');
  const fades = content.map((el) =>
    el.animate(
      { opacity: open ? [0, 1] : [1, 0] },
      open
        ? { duration: REVEAL_MS * 0.55, delay: REVEAL_MS * 0.25, easing: 'linear', fill: 'backwards' }
        : { duration: REVEAL_MS * 0.32, easing: 'linear', fill: 'forwards' },
    ),
  );
  running.set(details, [size, ...fades]);

  let frame = requestAnimationFrame(function follow() {
    refresh();
    frame = requestAnimationFrame(follow);
  });
  size.onfinish = () => {
    cancelAnimationFrame(frame);
    if (!open) details.open = false;
    for (const f of fades) f.cancel();
    details.style.overflow = '';
    running.delete(details);
    refresh();
  };
  size.oncancel = () => cancelAnimationFrame(frame);
};

/* Bubble phase on the document, never capture. Starlight saves a sidebar group
   as the inverse of its open state when the click reaches the sidebar. Changing
   it before then saves the wrong state. */
document.addEventListener('click', (e) => {
  if (e.defaultPrevented || matchMedia(REDUCE).matches) return;
  const target = e.target as Element;
  const summary = target.closest?.('summary');
  if (!summary || target.closest('a')) return;
  const details = summary.parentElement;
  if (!(details instanceof HTMLDetailsElement) || !details.matches(DISCLOSURES)) return;
  if (details.querySelector(':scope > summary') !== summary) return;
  e.preventDefault();
  const opening = running.has(details) ? details.dataset.syClosing === 'true' : !details.open;
  details.dataset.syClosing = String(!opening);
  animateDisclosure(details, opening);
});
