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

const ORIGINAL = 'virtual:starlight-original-icon';
const STARLIGHT_ICON = resolve(process.cwd(), 'node_modules/@astrojs/starlight/user-components/Icon.astro');
const OVERRIDE = resolve(process.cwd(), 'src/components/StarlightIcon.astro');

export function starlightIcons() {
  if (!existsSync(STARLIGHT_ICON)) throw new Error(`${STARLIGHT_ICON} is missing. Update src/lib/vite-icon-modules.mjs.`);
  return {
    name: 'sy-starlight-icons',
    enforce: 'pre',
    async resolveId(id, importer, options) {
      if (id === ORIGINAL) return STARLIGHT_ICON;
      if (!importer || importer.split('?')[0] === OVERRIDE || !id.endsWith('Icon.astro')) return null;
      const found = await this.resolve(id, importer, { ...options, skipSelf: true });
      return found?.id.split('?')[0] === STARLIGHT_ICON ? OVERRIDE : null;
    },
  };
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
