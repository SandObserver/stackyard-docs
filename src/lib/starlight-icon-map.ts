/* Keys are Starlight icon names. scripts/check-dist.mjs fails the build when a
   mapped Starlight icon still ships, so a renamed key cannot pass silently. */
export const STARLIGHT_ICON_MAP: Record<string, { id: string; transform?: string }> = {
  magnifier: { id: 'search' },
  sun: { id: 'appearance' },
  moon: { id: 'appearance' },
  laptop: { id: 'appearance' },
  'down-caret': { id: 'chevrons' },
  'right-caret': { id: 'back', transform: 'matrix(-1 0 0 1 24 0)' },
  'left-caret': { id: 'back' },
  pencil: { id: 'edit' },
  'right-arrow': { id: 'arrow-up', transform: 'rotate(90 12 12)' },
  'left-arrow': { id: 'arrow-up', transform: 'rotate(-90 12 12)' },
  bars: { id: 'menu' },
  close: { id: 'close' },
  'link-alt': { id: 'link' },
  information: { id: 'info' },
  warning: { id: 'warning' },
  error: { id: 'failure' },
};
