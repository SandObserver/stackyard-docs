type I18n = { initI18n(lang: string): Promise<void>; t(key: string, vars?: Record<string, string>): string };

let ready: Promise<Record<string, any>> | null = null;
const app = (path: string) => import(/* @vite-ignore */ path);

/* Import shared modules by the exact specifier the editor uses, or each gets its own copy of the state and strings. */
const load = () =>
  (ready ??= (async () => {
    const link = Object.assign(document.createElement('link'), { rel: 'stylesheet', href: '/css/settings.css' });
    const css = new Promise((done) => link.addEventListener('load', done, { once: true }));
    document.head.append(link);
    const src = await fetch('/js/admin-app-form.js').then((r) => r.text());
    const spec = (name: string) => src.match(new RegExp(`from '(/js/${name}\\.js[^']*)'`))?.[1] ?? `/js/${name}.js`;
    const [form, i18n, lb, st, data, fh, shared, cc] = await Promise.all([
      app('/js/admin-app-form.js'),
      app(spec('i18n')),
      app(spec('listbox')),
      app(spec('admin-state')),
      fetch('/settings/appearance.json').then((r) => r.json()),
      app(spec('fluid-hover')),
      app(spec('admin-shared')),
      app(spec('admin-color-control')),
    ]);
    await Promise.all([i18n.initI18n('en'), css]);
    fh.initFluidHover();
    return { form, i18n, lb, state: st.state, data, shared, cc };
  })());

function labelPens(root: Element, i18n: I18n) {
  for (const pen of root.querySelectorAll('.pe:not([aria-label])')) {
    const label = pen.closest('.row')?.querySelector('.rl');
    if (label) pen.setAttribute('aria-label', i18n.t('common.editNamed', { name: label.textContent!.trim() }));
  }
}

function frame(old: Element, label: string, caption: string, node: Element) {
  const figure = document.createElement('figure');
  figure.className = 'sy-e1 not-content';
  figure.setAttribute('aria-label', label);
  const pane = document.createElement('div');
  pane.className = 'sy-e1-pane sy-app';
  pane.append(node);
  const cap = document.createElement('figcaption');
  cap.innerHTML = `<span class="sy-e1-tag">Live example</span>${caption} Changes here are not saved.`;
  figure.append(pane, cap);
  old.replaceWith(figure);
}

function prefixIds(host: Element, p: string) {
  host.querySelectorAll('[id]').forEach((n) => (n.id = p + n.id));
  host.querySelectorAll('[aria-labelledby]').forEach((n) =>
    n.setAttribute('aria-labelledby', n.getAttribute('aria-labelledby')!.split(' ').map((x) => p + x).join(' ')),
  );
}

async function appearance(shot: Element, wallpaperHeading: Element | null) {
  const { data, lb, i18n, shared, cc } = await load();
  const host = document.createElement('div');
  host.innerHTML = data.appearance;
  const $ = (id: string) => host.querySelector<HTMLElement>(`#${id}`)!;
  const live = (id: string) => document.getElementById(`e1a-${id}`)!;
  ($('set-lbl-d') as HTMLInputElement).checked = true;
  ($('set-type-search') as HTMLInputElement).checked = true;
  const pick = (slot: string, label: string, options: { value: string; label: string }[], value: string, onChange?: (v: string) => void) =>
    $(slot).replaceWith(lb.createListbox({ label, options, value, onChange }).el);
  pick('theme-slot', 'Display Mode', [{ value: 'system', label: 'System Default' }, { value: 'light', label: 'Light' }, { value: 'dark', label: 'Dark' }], 'system');
  const showBg = (type: string) =>
    shared.swapContent(live('bg-unsplash-fields').parentElement, () => {
      for (const k of ['unsplash', 'url', 'color']) live(`bg-${k}-fields`).classList.toggle('d-none', k !== type);
      live('bg-brightness-row').classList.toggle('d-none', type === 'color');
      live('bgcol-hint').classList.toggle('d-none', type !== 'unsplash');
      live('bg-url-hint').classList.toggle('d-none', type !== 'url');
    });
  pick('bg-type-slot', 'Source', [{ value: 'unsplash', label: 'Unsplash' }, { value: 'url', label: 'Image' }, { value: 'color', label: 'Solid color' }], 'url', showBg);
  cc.renderColorControl($('bg-color-slot'), { value: '#1c1c1e', idPrefix: 'e1a-bg-color', label: 'Color' });
  pick('bg-fit-slot', 'Fit', [{ value: 'fill', label: 'Fill' }, { value: 'fit', label: 'Fit' }], 'fill');
  $('bg-unsplash-fields').classList.add('d-none');
  $('bg-url-fields').classList.remove('d-none');
  $('bgcol-hint').classList.add('d-none');
  for (const [id, v] of [['bg-file-v', 'demo-wallpaper.jpg'], ['ie-bgurl-v', '/demo-wallpaper.jpg']]) {
    $(id).textContent = v;
    $(id).classList.remove('is-ph');
    $(id).removeAttribute('data-i18n');
  }
  const br = $('bg-br') as HTMLInputElement;
  br.value = '0.4';
  const paint = () => br.style.setProperty('--range-fill', String((+br.value - +br.min) / (+br.max - +br.min)));
  paint();
  br.addEventListener('input', paint);
  const rt = $('dev-transparency').closest('.grp')!;
  if (rt.nextElementSibling?.classList.contains('grp-tip')) rt.nextElementSibling.remove();
  rt.remove();
  const wpHdr = [...host.querySelectorAll('.grp-hdr')].find((h) => h.getAttribute('data-i18n') === 'appearance.wallpaper')!;
  const wp = document.createElement('div');
  while (wpHdr.nextSibling) wp.append(wpHdr.nextSibling);
  wpHdr.remove();
  prefixIds(host, 'e1a-');
  prefixIds(wp, 'e1a-');
  await i18n.initI18n('en');
  frame(shot, shot.querySelector('img')?.alt ?? 'The Appearance section of Settings', 'Display options in Appearance.', host);
  if (wallpaperHeading) {
    const spot = document.createElement('div');
    wallpaperHeading.after(spot);
    frame(spot, 'The Wallpaper group in Appearance', 'Wallpaper in Appearance.', wp);
  }
  await i18n.initI18n('en');
  labelPens(host, i18n);
  labelPens(wp, i18n);
}

/* One editor instance: its script finds elements by id, so a second copy would wire to the first. */
async function appForm(badge: Element | null, labels: Element | null) {
  const { form, state, i18n } = await load();
  state.spaths = ['errors', 'pending'];
  state.fnums = [
    { path: 'errors', label: 'errors', value: 3 },
    { path: 'pending', label: 'pending', value: 12 },
  ];
  state.slabels = Object.assign(Object.create(null), {
    errors: { name: 'errors', unit: 'err', color: 'danger', min: '' },
    pending: { name: 'pending', unit: 'pending', color: 'warning', min: '' },
  });
  const host = document.createElement('div');
  host.hidden = true;
  document.body.append(host);
  form.buildAppForm(host, {
    name: 'Requests',
    url: 'https://requests.example.com',
    monitoring: { healthcheck: { enabled: false }, activity: { enabled: false, url: 'https://requests.example.com/api/v1/request/count', interval: 300 } },
  });
  await i18n.initI18n('en');
  labelPens(host, i18n);
  const kids = [...host.children];
  const b = kids.findIndex((n) => n.classList.contains('grp-hdr') && n.textContent!.trim() === 'Badge');
  if (badge) {
    const wrap = Object.assign(document.createElement('div'), { className: 'sy-e1-form' });
    wrap.append(kids[b + 1]);
    frame(badge, badge.querySelector('img')?.alt ?? 'The Badge section of an app', 'The three badge kinds for one app.', wrap);
  }
  if (labels) {
    const wrap = Object.assign(document.createElement('div'), { className: 'sy-e1-form' });
    wrap.append(host.querySelector('#act-labels-wrap')!);
    frame(labels, labels.querySelector('img')?.alt ?? 'Labels for one app badge', 'Labels for one app badge.', wrap);
  }
  host.remove();
}

const shot = (name: string) => document.querySelector(`figure.sy-shot img[src*="/img/admin/${name}-"]`)?.closest('figure') ?? null;
const ap = shot('appearance');
if (ap) appearance(ap, document.getElementById('wallpaper')?.closest('.sl-heading-wrapper') ?? null);
const badge = shot('app-edit-badge');
const labels = shot('app-edit-labels');
if (badge || labels) appForm(badge, labels);
