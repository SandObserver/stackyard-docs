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
