import { readFileSync } from 'node:fs';
import path from 'node:path';

/** The card and the dark-only flag a widget declares, so a preview cannot drift
    from the product. `file` picks the view when the widget has several. */
export function manifestCard(type: string, viewFile: string) {
  try {
    /* From the project root: import.meta.url points into the build output. */
    const file = path.join(process.cwd(), 'public', 'widgets', type, 'widget.json');
    const m = JSON.parse(readFileSync(file, 'utf8'));
    const view = Object.values(m.views ?? {}).find((v: any) => v?.src === viewFile) as any;
    return {
      card: (view?.card ?? m.card ?? null) as string | null,
      appearance: m.appearance === 'dark' ? 'dark' : undefined,
    };
  } catch {
    return { card: null, appearance: undefined };
  }
}
