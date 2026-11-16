type I18n = { initI18n(lang: string): Promise<void>; t(key: string, vars?: Record<string, string>): string };

let ready: Promise<Record<string, any>> | null = null;
let icons: { ICONS: Record<string, unknown>; symbol(id: string, icon: unknown): { defs: string; sym: string } };
const app = (path: string) => import(/* @vite-ignore */ path);

/* Import shared modules by the exact specifier the editor uses, or each gets its own copy of the state and strings. */
const load = () =>
  (ready ??= (async () => {
    let link = document.querySelector<HTMLLinkElement>('link[href="/css/settings.css"]');
    let css: Promise<unknown> = Promise.resolve();
    if (!link?.sheet) {
      link ??= document.head.appendChild(Object.assign(document.createElement('link'), { rel: 'stylesheet', href: '/css/settings.css' }));
      css = new Promise((done) => link!.addEventListener('load', done, { once: true }));
    }
    const src = await fetch('/js/admin-app-form.js').then((r) => r.text());
    const spec = (name: string) => src.match(new RegExp(`from '(/js/${name}\\.js[^']*)'`))?.[1] ?? `/js/${name}.js`;
    const [form, i18n, lb, st, data, fh, shared, cc, iconSet, sections] = await Promise.all([
      app('/js/admin-app-form.js'),
      app(spec('i18n')),
      app(spec('listbox')),
      app(spec('admin-state')),
      fetch('/settings/appearance.json').then((r) => r.json()),
      app(spec('fluid-hover')),
      app(spec('admin-shared')),
      app(spec('admin-color-control')),
      app(spec('icon-set')),
      fetch('/settings/sections.json').then((r) => r.json()),
    ]);
    icons = iconSet;
    await Promise.all([i18n.initI18n('en'), css]);
    fh.initFluidHover();
    return { form, i18n, lb, state: st.state, data, sections, shared, cc };
  })());

function labelPens(root: Element, i18n: I18n) {
  for (const pen of root.querySelectorAll('.pe:not([aria-label])')) {
    const label = pen.closest('.row')?.querySelector('.rl');
    if (label) pen.setAttribute('aria-label', i18n.t('common.editNamed', { name: label.textContent!.trim() }));
  }
}

/* Keep a sprite per example. Masked icons from another component's sprite render blank on iOS Safari. */
function ownSprite(figure: Element, name: string) {
  const pre = `sy-e1-${name}-`;
  const uses = [...figure.querySelectorAll('use')].filter((u) => u.getAttribute('href')?.startsWith('#sy-solid-'));
  const ids = new Set(uses.map((u) => u.getAttribute('href')!.slice('#sy-solid-'.length)));
  if (!ids.size) return;
  let defs = '';
  let syms = '';
  for (const id of ids) {
    if (!icons.ICONS[id]) continue;
    const s = icons.symbol(id, icons.ICONS[id]);
    defs += s.defs;
    syms += s.sym;
  }
  for (const u of uses) u.setAttribute('href', `#${pre}${u.getAttribute('href')!.slice('#sy-solid-'.length)}`);
  const src = `<svg xmlns="http://www.w3.org/2000/svg" class="sy-sprite" width="0" height="0" aria-hidden="true" focusable="false"><defs>${defs}</defs>${syms}</svg>`;
  const svg = new DOMParser().parseFromString(src.replaceAll('sy-solid-', pre), 'image/svg+xml').documentElement;
  figure.prepend(document.importNode(svg, true));
}

function frame(old: Element, name: string, label: string, caption: string, node: Element, note = 'Changes here are not saved.') {
  const figure = document.createElement('figure');
  figure.className = 'sy-e1 not-content';
  figure.dataset.shot = name;
  figure.dataset.live = '';
  figure.setAttribute('aria-label', old.getAttribute('aria-label') ?? old.querySelector('img')?.alt ?? label);
  const pane = document.createElement('div');
  pane.className = 'sy-e1-pane sy-app';
  pane.append(node);
  const cap = document.createElement('figcaption');
  cap.innerHTML = `<span class="sy-e1-tag">Live example</span>${caption}${note ? ` ${note}` : ''}`;
  figure.append(pane, cap);
  ownSprite(figure, name);
  old.replaceWith(figure);
  document.dispatchEvent(new CustomEvent('sy-example-live', { detail: { old, figure } }));
}

function prefixIds(host: Element, p: string) {
  host.querySelectorAll('[id]').forEach((n) => {
    if (!n.closest('svg')) n.id = p + n.id;
  });
  for (const a of ['aria-labelledby', 'aria-describedby'])
    host.querySelectorAll(`[${a}]`).forEach((n) => n.setAttribute(a, n.getAttribute(a)!.split(' ').map((x) => p + x).join(' ')));
}

async function section(name: 'security' | 'backup' | 'about', spot: Element) {
  const { sections, i18n, shared } = await load();
  const host = document.createElement('div');
  host.innerHTML = sections[name];
  const p = `e1${name[0]}-`;
  prefixIds(host, p);
  const $ = (id: string) => host.querySelector<HTMLElement>(`#${p}${id}`)!;
  if (name === 'security') {
    const en = $('sec-en') as HTMLInputElement;
    en.addEventListener('change', () => {
      shared.reveal($('ie-pw-wrap'), en.checked);
      shared.reveal($('pw-hint-wrap'), en.checked);
    });
    frame(spot, name, 'The Security group in General', 'Security, in General.', host);
  } else if (name === 'backup') {
    for (const input of host.querySelectorAll('input[type="file"]')) input.addEventListener('click', (e) => e.preventDefault());
    frame(spot, name, 'The Backup group in General', 'Backup, in General.', host, 'The buttons here do not import or export.');
  } else {
    frame(spot, name, 'The About section of Settings', 'About, in Settings. It shows the installed version, and a notice when an update is out.', host, '');
  }
  await i18n.initI18n('en');
  if (name === 'about') $('about-version').textContent = i18n.t('about.version', { v: String(sections.version).replace(/^v/, '') });
  labelPens(host, i18n);
}

async function appearance(shot: Element, wallpaperSpot: Element | null) {
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
  frame(shot, 'appearance', 'The Appearance section of Settings', 'Display options in Appearance.', host);
  if (wallpaperSpot) frame(wallpaperSpot, 'wallpaper', 'The Wallpaper group in Appearance', 'Wallpaper in Appearance.', wp);
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
    frame(badge, 'app-edit-badge', 'The Badge section of an app', 'The three badge kinds for one app.', wrap);
  }
  if (labels) {
    const wrap = Object.assign(document.createElement('div'), { className: 'sy-e1-form' });
    wrap.append(host.querySelector('#act-labels-wrap')!);
    frame(labels, 'app-edit-labels', 'Labels for one app badge', 'Labels for one app badge.', wrap);
  }
  host.remove();
}

const shot = (name: string) =>
  document.querySelector(`[data-shot="${name}"], [data-sy-example="${name}"]`) ??
  document.querySelector(`figure.sy-shot img[src*="/img/admin/${name}-"]`)?.closest('figure') ??
  null;
const ap = shot('appearance');
if (ap) appearance(ap, shot('wallpaper'));
const badge = shot('app-edit-badge');
const labels = shot('app-edit-labels');
if (badge || labels) appForm(badge, labels);
for (const name of ['security', 'backup', 'about'] as const) {
  const spot = shot(name);
  if (spot) section(name, spot);
}
