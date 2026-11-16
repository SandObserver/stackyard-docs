import { createHash } from 'node:crypto';
import { globSync, readFileSync } from 'node:fs';

const SOURCES = ['public/settings/*.json', 'public/css/settings.css', 'public/i18n/en.json', 'public/js/**/*.js', 'src/scripts/settings-examples.ts'];

export function settingsSourceHash() {
  const hash = createHash('sha256');
  for (const file of SOURCES.flatMap((p) => globSync(p)).sort()) hash.update(file).update(readFileSync(file));
  return hash.digest('hex');
}
