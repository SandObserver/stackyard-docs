import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const REPO = process.env.STACKYARD_REPO ?? resolve(process.cwd(), '..', 'stackyard');
const SET = 'virtual:sy-icon-set';
const MOTION = 'virtual:sy-icon-motion';
const SET_IMPORT = /from\s+'\/js\/icon-set\.js[^']*'/;

function read(path) {
  const full = resolve(REPO, path);
  return existsSync(full) ? readFileSync(full, 'utf8') : null;
}

export function iconModules() {
  return {
    name: 'sy-icon-modules',
    resolveId(id) {
      if (id === SET || id === MOTION) return `\0${id}`;
    },
    load(id) {
      if (id === `\0${SET}`) {
        return read('ui/js/icon-set.js') ?? 'export const ICONS = {};\nexport function symbol() { return { defs: "", sym: "" }; }';
      }
      if (id === `\0${MOTION}`) {
        const source = read('ui/js/icon-motion.js');
        if (!source) return 'export const MOTION = {};\nexport function animateIcon() {}';
        if (!SET_IMPORT.test(source)) throw new Error('ui/js/icon-motion.js no longer imports /js/icon-set.js. Update src/lib/vite-icon-modules.mjs.');
        return source.replace(SET_IMPORT, `from '${SET}'`);
      }
    },
  };
}
