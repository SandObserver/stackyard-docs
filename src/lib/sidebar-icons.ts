/* Keys are sidebar group labels and link paths in astro.config.mjs. Renaming
   either there drops the icon here. */
const GROUPS: Record<string, string> = {
  'Get started': 'start',
  'Build your dashboard': 'dashboard',
  Widgets: 'widget',
  'Run Stackyard': 'run',
  'Create a widget': 'create',
  Contributing: 'heart',
  About: 'info',
};

const LINKS: Record<string, string> = {
  '/docs/settings-reference/': 'general',
  '/docs/troubleshooting/': 'bug',
  '/docs/widgets/': 'docs',
  '/docs/widgets/backup/': 'backup',
  '/docs/widgets/books/': 'books',
  '/docs/widgets/clock/': 'clock',
  '/docs/widgets/connections/': 'connections',
  '/docs/widgets/custom/': 'edit',
  '/docs/widgets/dashboard-switch/': 'switcher',
  '/docs/widgets/disk-health/': 'disk',
  '/docs/widgets/dns/': 'dns',
  '/docs/widgets/github/': 'github',
  '/docs/widgets/now-playing/': 'nowplaying',
  '/docs/widgets/system-summary/': 'system',
  '/docs/widgets/weather/': 'weather',
};

export const SIDEBAR_ICON_IDS = [...new Set([...Object.values(GROUPS), ...Object.values(LINKS)])];

export function sidebarIcon(entry: { type: string; label: string; href?: string }): string | undefined {
  return entry.type === 'group' ? GROUPS[entry.label] : LINKS[entry.href ?? ''];
}
