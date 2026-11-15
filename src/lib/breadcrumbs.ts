type Entry =
  | { type: 'link'; label: string; href: string; isCurrent: boolean }
  | { type: 'group'; label: string; entries: Entry[] };

const hasCurrent = (entries: Entry[]): boolean =>
  entries.some((e) => (e.type === 'link' ? e.isCurrent : hasCurrent(e.entries)));

export function currentGroup(sidebar: Entry[]): string | null {
  const group = sidebar.find((e) => e.type === 'group' && hasCurrent(e.entries));
  return group ? group.label : null;
}
