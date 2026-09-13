---
title: Widget page reference
description: The index.html side of a Stackyard widget. Frame parameters, the content policy, canvas sizes, text direction and the widget toolbox.
---

A widget page runs in a frame, scaled uniformly from a fixed design size to its card. It reads its `id` from the query string, fetches its own data, and draws it.

- Keep styles and scripts inline or same-origin. There is no shared widget stylesheet.
- Never call an external host. Reach a service through `data.js`.
- The saved config, without secrets, is at `/api/widget-config/<id>`.

## Frame parameters

| Parameter | What it is |
| --- | --- |
| `id` | The dashboard item id. Pass it to `/api/widget-data/<id>` and `/api/widget-config/<id>`. |
| `size` | The size the user placed this widget at, one of the manifest `sizes`. |
| `mobile` | `1` on the mobile layout, absent otherwise. |
| `lang` | The selected language code. See [Translations](/docs/contributing/translations/#widget-strings). |
| `v` | The cache version, stamped at release. Nothing to read. |

## Canvas sizes

| Size | Canvas |
| --- | --- |
| small | 170 × 170 |
| medium | 360 × 170 |
| large | 360 × 360 |
| xlarge | 360 × 540 |

Match the existing look: a transparent background, the system font stack, the dark palette. See [Design system](/docs/contributing/design-system/).

## What a page may load

The widget frame has a stricter Content-Security-Policy than the dashboard. Scripts and styles must be inline or same-origin. `connect-src` is `'self'`, so the only host a widget can call is Stackyard. Images may come from the icon CDN or a `data:` URI.

## Text direction

The dashboard sets the frame direction and language when it mounts the widget. A widget must not set `dir` on its own `<html>`. In Persian the frame becomes right to left, and text, flex rows and grid columns reverse with it.

Write spacing next to text with logical properties, so it reverses too:

```css
.flag { margin-inline-end: 5px }
.meta { padding-inline-start: 13px }
.left { border-inline-end: 1px solid rgba(255, 255, 255, 0.1) }
```

`left: 0; right: 0` is symmetric and needs no change. `left: 50%` with a translate is centring. Artwork is artwork, and mirroring it is usually wrong. `ui/test/rtl-logical-properties.test.mjs` enforces the rule for properties that carry text.

Content that reads the same in every language, such as an IP address, a log tail or a chart axis, pins its own direction on the element:

```html
<div dir="ltr">10.0.0.1</div>
```

Never on the document. The test refuses `dir` on `<html>` or `<body>`, and `direction` on `html`, `body` or `:root`.

## Mobile active state

A widget with an interior state a tap turns on, such as a selected row, takes part in this protocol. Without it, two widgets end up active at once.

```js
parent.postMessage({ type: 'widget-active' }, window.location.origin);

window.__clearActive = () => { /* drop the active state, hide any tooltip */ };
```

The dashboard resets every other widget when it receives the message, and calls `__clearActive` when a tap lands outside any widget. The frames are same-origin, so a widget needs no `message` listener. If you add one, check `e.origin` against `window.location.origin` first.

## Off-screen pages

Every dashboard page is mounted at once. The dashboard slows the polling of widgets on other pages through `window.__setPollRate`, which the toolbox defines. A widget that uses `poll()` needs nothing. A widget with its own timer must read the same hook.

Returning to a page refreshes a widget at once when its data is older than one normal interval.

## Cache busting

Nothing to do by hand. The release build hashes each widget entry file and stamps the version into the manifest.

## Toolbox

Optional, and it bundles the pieces widgets keep needing. Import from `/js/widget-toolbox.js` and keep the `?v=1`:

```js
import { poll, fetchData, sparkline } from '/js/widget-toolbox.js?v=1';
```

### Data

- `widgetId()` returns this widget id from the frame URL.
- `fetchData(endpoint?)` fetches `/api/widget-data/<id>` and returns the parsed JSON. Throws on a non-OK response.
- `getConfig()` fetches this widget config, without secrets.

### Polling

`poll(opts)` runs the fetch and render loop and handles the loading, empty, stale and error states. A single failed poll never blanks a working widget.

```js
poll({
  render: data => { root.textContent = `${data.items.length} items`; },
  isEmpty: data => data.items.length === 0,
  interval: 30000,
});
```

A failure keeps the last good render. After `staleAfter` consecutive failures, 2 by default, it shows the failure and how long ago the last success was. `sinceLabel(ts)` gives that label on its own.

The first fetch runs at once. Each repeat is spread by up to 15%, so widgets on one dashboard do not fetch on the same tick.

### Failure and empty states

Empty and failed are different claims and must look different. `isEmpty(data)` decides which applies. Without a custom handler, `poll()` draws both. With `onError`, add `onEmpty` too.

`errorState(opts)` draws a failure state:

```js
const state = errorState({ root, content: chartEl, caption: metaLineEl });

poll({
  render: d => { state.ok(); draw(d); },
  isEmpty: d => d.items.length === 0,
  onEmpty: () => state.empty(wt('ui.noItems', 'Nothing here')),
  onError: ({ error, everOk, stale, since }) => {
    if (!everOk || stale) state.fail(error, { since, inert: everOk });
  },
});
```

- `content` is what goes inert. Without it, every child of `root` except the caption does.
- `caption` is the widget metadata slot. Without one, a line is placed at the foot of `root`, or over its centre with `place: 'center'`.
- `fail(err, { since, inert })` returns the line it drew. Pass `inert: false` when the widget never had data.
- Set `--wt-cap-color` on a widget with a light card.

The wording comes from the failure kind, not the upstream message. `errorLine(err)` returns the same wording for a widget with its own designed state.

### Links, markup and visuals

- `openUrl(href)` opens a link in a new tab. Use it instead of `window.open`, which the sandbox can block.
- `esc(value)` HTML-escapes a value for `innerHTML`. Use it for anything from config or upstream.
- `sparkline(values, opts?)` returns an `<svg>` area and line chart.
- `barFill(percent, opts?)` returns a track and fill bar. It skips its transition under reduced motion.
- `smoothPath(points)` returns a smoothed SVG path through `[[x, y], ...]`.

Check the toolbox before drawing a visual by hand.
