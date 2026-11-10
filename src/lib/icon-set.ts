import { readRepoFile } from './repo';

type Shape = Record<string, unknown>;
type Icon = { shapes: Shape[]; gap?: number; inkMask?: boolean };
type IconModule = {
  ICONS: Record<string, Icon>;
  symbol: (id: string, icon: Icon) => { defs: string; sym: string };
  rect: (...a: unknown[]) => Shape;
  bar: (...a: unknown[]) => Shape;
  line: (...a: unknown[]) => Shape;
};

let loaded: Promise<IconModule | null> | undefined;

export function loadIconSet(): Promise<IconModule | null> {
  loaded ??= (async () => {
    const source = readRepoFile('ui/js/icon-set.js');
    if (!source) return null;
    return import(/* @vite-ignore */ `data:text/javascript;base64,${Buffer.from(source).toString('base64')}`);
  })();
  return loaded;
}

/* Used only when the app checkout predates them. The build fails on a missing id. */
function docIcons(m: IconModule): Record<string, Icon> {
  return {
    start: {
      inkMask: false,
      shapes: [m.line('M12 2v9M8 7l4 4 4-4', 'accent'), m.rect(2, 14, 20, 8, 4), m.bar(5, 17, 6)],
    },
    run: {
      gap: 0,
      shapes: [m.rect(2, 4, 20, 16, 4), m.line('M6 9l3 3-3 3', 'accent'), m.bar(12, 14, 6)],
    },
    create: {
      shapes: [m.rect(3, 5, 16, 16, 4), m.line('M19 3v4M17 5h4', 'accent'), m.bar(6, 10, 6), m.bar(6, 14, 10)],
    },
  };
}

let inlineSeq = 0;

/* Mask and clip ids are renamed per call. A repeated id paints every copy with the first one's mask. */
export async function inlineIcon(id: string, transform = ''): Promise<string | null> {
  const m = await loadIconSet();
  if (!m?.ICONS[id]) return null;
  const { defs, sym } = m.symbol(id, m.ICONS[id]);
  const body = sym.replace(/^<symbol[^>]*>|<\/symbol>$/g, '');
  const markup = `${defs ? `<defs>${defs}</defs>` : ''}${transform ? `<g transform="${transform}">${body}</g>` : body}`;
  return markup.split(`sy-solid-${id}`).join(`sy-il${inlineSeq++}-${id}`);
}

export async function iconMaskUri(id: string): Promise<string | null> {
  const m = await loadIconSet();
  if (!m?.ICONS[id]) return null;
  const { defs, sym } = m.symbol(id, m.ICONS[id]);
  const body = sym
    .replace(/^<symbol[^>]*>|<\/symbol>$/g, '')
    .replace(/ class="([^"]+)"/g, (_, cls: string) => {
      const stroke = cls.split(' ').some((c) => c.endsWith('s'));
      const fill = cls.split(' ').some((c) => !c.endsWith('s'));
      return `${fill ? ' fill="#000"' : ''}${stroke ? ' stroke="#000"' : ''}`;
    });
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">${defs ? `<defs>${defs}</defs>` : ''}${body}</svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

export async function iconSprite(ids: string[]): Promise<string> {
  const m = await loadIconSet();
  if (!m) return '';
  const all = { ...docIcons(m), ...m.ICONS };
  let defs = '';
  let syms = '';
  for (const id of new Set(ids)) {
    if (!all[id]) throw new Error(`Unknown icon: ${id}`);
    const s = m.symbol(id, all[id]);
    defs += s.defs;
    syms += s.sym;
  }
  return `<svg class="sy-sprite" width="0" height="0" aria-hidden="true" focusable="false"><defs>${defs}</defs>${syms}</svg>`;
}
