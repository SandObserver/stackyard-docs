---
title: Widget checklist
description: What to check before opening a pull request for a new Stackyard widget.
---

CI validates every manifest. Run the same check locally with `cd api && node --test`.

## Files

- `widget.json` with `name` matching the folder, `label`, `sizes` and `fields`.
- `data.js`, unless the widget runs entirely in the browser.
- `index.html`.
- `i18n/en.json`, plus one catalog per shipped language.
- `demo.js`, optional.

## Behaviour

- Upstream calls go through `ctx.fetchJSON`.
- Failures use `ctx.fail`, never a returned error.
- Empty and failed look different.
- The page calls no other host.
- Spacing next to text uses logical properties.

## Look

- Transparent background, system font, palette colours.
- Readable at every size it offers.

A refused manifest is logged at startup and nowhere else. Check `docker logs <container>`.
