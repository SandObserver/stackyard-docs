import { existsSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { readRepoFile, repoPath } from './repo';

type Field = {
  key: string;
  type?: string;
  label?: string;
  hint?: string;
  optional?: boolean;
  cosmetic?: boolean;
  options?: { value: string | number | boolean }[];
  showIf?: { field: string; equals?: unknown; in?: unknown[] };
  fields?: Field[];
};

const code = (v: unknown) => (v === '' ? '`""`' : `\`${String(v).replace(/`/g, "'")}\``);
const cell = (v: string) => v.replace(/\|/g, '\\|').replace(/\n/g, ' ');

const readJson = (relativePath: string): any => {
  const raw = readRepoFile(relativePath);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

async function importRepoModule(relativePath: string): Promise<any> {
  const source = readRepoFile(relativePath);
  if (!source) return null;
  try {
    return await import(/* @vite-ignore */ `data:text/javascript;base64,${Buffer.from(source).toString('base64')}`);
  } catch {
    return null;
  }
}

function itemsSection(demo: any): string | null {
  const items: any[] = Array.isArray(demo?.items) ? demo.items : [];
  const app = items.find((i) => i?.type === 'app' && i.monitoring?.healthcheck?.enabled);
  const folder = items.find((i) => i?.type === 'folder' && Array.isArray(i.children));
  const widget = items.find((i) => i?.type === 'widget' && i.widgetType === 'dns') ?? items.find((i) => i?.type === 'widget');
  if (!app || !folder || !widget) return null;
  const block = (v: unknown) => '```json\n' + JSON.stringify(v, null, 2) + '\n```';
  return [
    '## Items',
    'Every entry in `items` needs a unique `id` and a `type`: `app`, `folder` or `widget`. These examples are taken from the public demo.',
    '### App',
    'A health check needs `container`, `pingUrl` or `proxmoxGuest` while `enabled` is `true`.',
    block(app),
    '### Folder',
    '`children` lists the ids of apps. Only apps can be in a folder.',
    block(folder),
    '### Widget',
    '`widgetType` names a widget below. `widgetConfig` holds its fields. `widgetSize` is one of its sizes.',
    block(widget),
  ].join('\n\n');
}

function settingsSection(schema: any, languages: string[]): string | null {
  const specs: any[] = Array.isArray(schema?.SETTINGS) ? schema.SETTINGS : [];
  if (!specs.length) return null;
  const values = (key: string) => {
    if (key === 'language') return languages.map(code).join(', ');
    if (key === 'logLevel' && Array.isArray(schema.LOG_LEVELS)) return schema.LOG_LEVELS.map(code).join(', ');
    return '';
  };
  const rows = specs.map((s) => {
    const path = s.place === schema.SERVER ? `settings.server.${s.key}` : `settings.${s.key}`;
    const note = s.key === 'auth' ? 'Kept by the server. Set the password through the sign-in routes.' : values(s.key);
    return `| ${code(path)} | ${s.general ? 'General' : ''} | ${cell(note)} |`;
  });
  return [
    '## Settings',
    'A save keeps only these keys and drops any other. A known key with a value it cannot use is refused with `invalid.bad-setting`. What each setting does is on [Settings reference](/docs/settings-reference/).',
    '| Key | Section | Values |\n| --- | --- | --- |\n' + rows.join('\n'),
  ].join('\n\n');
}

function widgetsSection(types: string[]): string | null {
  const parts: string[] = [];
  for (const type of types) {
    const manifest = readJson(`ui/widgets/${type}/widget.json`);
    if (!manifest) continue;
    const en = readJson(`ui/widgets/${type}/i18n/en.json`) ?? {};
    const text = (key?: string) => (key && typeof en[key] === 'string' ? en[key] : '');
    const row = (f: Field, path: string) => {
      const shown = f.showIf
        ? `${code(f.showIf.field)} is ${(f.showIf.in ?? [f.showIf.equals]).map(code).join(' or ')}`
        : '';
      const options = Array.isArray(f.options) ? f.options.map((o) => code(o.value)).join(', ') : '';
      const about = [text(f.label), text(f.hint)].filter(Boolean).join('. ');
      const nested = Array.isArray(f.fields);
      const type = f.type === 'group' ? 'list of rows' : f.type === 'secret' ? 'secret (kept when left out)' : (f.type ?? 'text');
      const required = nested ? '' : f.optional || f.cosmetic ? 'no' : 'yes';
      return `| ${code(path)} | ${type} | ${required} | ${cell(options)} | ${cell(shown)} | ${cell(about)} |`;
    };
    const rows: string[] = [];
    for (const f of Array.isArray(manifest.fields) ? (manifest.fields as Field[]) : []) {
      rows.push(row(f, f.key));
      const prefix = f.type === 'group' ? `${f.key}[].` : `${f.key}.`;
      for (const sub of f.fields ?? []) rows.push(row(sub, prefix + sub.key));
    }
    const sizes = Array.isArray(manifest.sizes) ? manifest.sizes.map(code).join(', ') : '';
    parts.push(
      [
        `### ${text(manifest.label) || type}`,
        `\`widgetType\`: ${code(type)}. Sizes: ${sizes}.`,
        rows.length
          ? '| Field | Type | Required | Values | Shown when | About |\n| --- | --- | --- | --- | --- | --- |\n' + rows.join('\n')
          : 'No fields.',
      ].join('\n\n'),
    );
  }
  if (!parts.length) return null;
  return ['## Widgets', 'The keys of `widgetConfig` for each widget. A required field is only required while it is shown.', ...parts].join('\n\n');
}

function codesSection(errors: any, en: any): string | null {
  const byCode = errors?.BY_CODE;
  if (!byCode || typeof byCode !== 'object') return null;
  const sentence = (key: string) =>
    key.split('.').reduce((v: any, k) => (v && typeof v === 'object' ? v[k] : undefined), en) ?? '';
  const rows = Object.keys(byCode)
    .sort()
    .map((c) => `| ${code(c)} | ${cell(String(sentence(byCode[c])))} |`);
  return [
    '## Error codes',
    'Every refusal carries a `code`. The second column is what the admin shows for it. See [API errors](/docs/contributing/api-errors/) for the shape.',
    '| Code | Meaning |\n| --- | --- |\n' + rows.join('\n'),
  ].join('\n\n');
}

export async function configReferenceMarkdown(): Promise<string | null> {
  const widgetsDir = repoPath('ui/widgets');
  const i18nDir = repoPath('ui/i18n');
  if (!widgetsDir || !existsSync(widgetsDir) || !i18nDir || !existsSync(i18nDir)) return null;
  const types = readdirSync(widgetsDir, { withFileTypes: true })
    .filter((d) => d.isDirectory() && existsSync(resolve(widgetsDir, d.name, 'widget.json')))
    .map((d) => d.name)
    .sort();
  const languages = readdirSync(i18nDir)
    .filter((f) => f.endsWith('.json'))
    .map((f) => f.replace(/\.json$/, ''))
    .sort();
  const sections = [
    itemsSection(readJson('api/demo/demo-config.json')),
    settingsSection(await importRepoModule('ui/js/settings-schema.js'), languages),
    widgetsSection(types),
    codesSection(await importRepoModule('ui/js/admin-error.js'), readJson('ui/i18n/en.json')),
  ];
  if (sections.some((s) => s === null)) return null;
  return sections.join('\n\n');
}
