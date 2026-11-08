const control = document.querySelector<HTMLElement>('[data-sy-filter]');

if (control) {
  const input = control.querySelector('input') as HTMLInputElement;
  const status = control.querySelector<HTMLElement>('[data-sy-filter-status]');
  const none = document.querySelector<HTMLElement>('[data-sy-filter-none]');
  const groups = [...document.querySelectorAll<HTMLElement>('[data-sy-filter-group]')];
  const fold = (value: string) => value.toLowerCase().replace(/[‘’]/g, "'");
  const items = [...document.querySelectorAll<HTMLElement>('[data-sy-filter-item]')].map((el) => ({
    el,
    text: fold(el.textContent ?? ''),
  }));

  const apply = () => {
    const words = fold(input.value).trim().split(/\s+/).filter(Boolean);
    let shown = 0;
    for (const { el, text } of items) {
      const match = words.every((word) => text.includes(word));
      el.hidden = !match;
      if (match) shown++;
    }
    for (const group of groups) {
      group.hidden = !group.querySelector('[data-sy-filter-item]:not([hidden])');
    }
    if (none) none.hidden = shown > 0;
    if (status) status.textContent = words.length ? `${shown} of ${items.length} shown` : '';
  };

  const openTarget = () => {
    const id = decodeURIComponent(location.hash.slice(1));
    const target = id ? document.getElementById(id) : null;
    const details = target?.closest<HTMLDetailsElement>('details[data-sy-filter-item]');
    if (!target || !details) return;
    if (details.hidden) {
      input.value = '';
      apply();
    }
    details.open = true;
    target.scrollIntoView();
  };

  control.hidden = false;
  input.addEventListener('input', apply);
  addEventListener('hashchange', openTarget);
  apply();
  openTarget();
}
