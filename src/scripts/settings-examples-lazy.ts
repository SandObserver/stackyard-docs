const load = () => import('./settings-examples');

const path = (root: Element, node: Element) => {
  const steps: number[] = [];
  for (let n = node; n !== root && n.parentElement; n = n.parentElement) steps.unshift([...n.parentElement.children].indexOf(n));
  return steps;
};
const follow = (root: Element, steps: number[]) => steps.reduce<Element | undefined>((n, i) => n?.children[i], root);

const saved = [...document.querySelectorAll('figure[data-shot]:not([data-live])')];
if (saved.length === 0) {
  if (document.querySelector('[data-sy-example], figure.sy-shot img[src*="/img/admin/"]')) load();
} else {
  let started = false;
  let pending: { target: Element; click: boolean; box?: HTMLInputElement } | null = null;
  const start = () => {
    if (started) return;
    started = true;
    load();
  };
  document.addEventListener('sy-example-live', (e) => {
    const { old, figure } = (e as CustomEvent<{ old: Element; figure: Element }>).detail;
    if (!pending || !old.contains(pending.target)) return;
    const twin = follow(figure, path(old, pending.target)) as HTMLElement | undefined;
    const { click, box } = pending;
    pending = null;
    if (!twin) return;
    twin.focus({ preventScroll: true });
    if (box ? (twin as HTMLInputElement).checked !== box.checked : click) twin.click();
  });
  for (const fig of saved) {
    fig.addEventListener('pointerenter', start, { once: true });
    fig.addEventListener('pointerdown', start, { once: true });
    fig.addEventListener('focusin', (e) => {
      start();
      pending ??= { target: e.target as Element, click: false };
    });
    fig.addEventListener(
      'click',
      (e) => {
        const target = e.target as Element;
        if (!fig.isConnected || target.closest('a[href]')) return;
        const box = target.closest('label')?.querySelector<HTMLInputElement>('input[type="checkbox"]');
        if (box) {
          pending = { target: box, click: false, box };
          start();
          return;
        }
        e.preventDefault();
        pending = { target, click: true };
        start();
      },
      { capture: true },
    );
  }
}
