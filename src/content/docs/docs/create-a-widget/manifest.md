---
title: Widget manifest reference
description: Every widget.json option for a Stackyard widget. Views, sizes, list icons, card backgrounds, field types and option pickers.
---

`widget.json` describes a widget: its `label`, the card `sizes` it offers, the settings form, and for a multi-view widget, its views.

```json
{
  "name": "mywidget",
  "label": "My Widget",
  "sizes": ["small", "medium"],
  "fields": [
    { "key": "url", "type": "text", "label": "Service URL", "placeholder": "http://host:port" }
  ]
}
```

- **`name`** must match the folder name.
- **`label`** is the name in the admin list and the type picker, and the default widget name when the user saves without one.
- **`sizes`** is the set of card sizes offered: `small`, `medium`, `large`, `xlarge`.

An invalid manifest is skipped at startup with a logged reason. Only that widget is disabled.

## Views

A widget can ship more than one page and let the user pick, like the [GitHub](/docs/widgets/github/) and [Clock](/docs/widgets/clock/) widgets. Declare each view and its file, the field that holds the choice, and the default:

```json
{
  "viewField": "clockStyle",
  "defaultView": "digital",
  "views": {
    "digital": { "label": "Digital", "src": "digital.html" },
    "analog":  { "label": "Analog",  "src": "analog.html" }
  }
}
```

`viewField` names a field the user sets, usually a `select`. Its value is matched against the `views` keys. With no `views` block, the page is `index.html`. A single-view widget whose file is not `index.html` declares it as one view, with no `viewField`.

`viewField` must name a declared field. If that field lists `options`, its values and the `views` keys must be the same set. A manifest that breaks either rule is rejected, because both failures are otherwise silent. A field using `optionsFrom` is not checked, since its choices are fetched at runtime.

### Sizes per view

A view can narrow the widget sizes, for a layout that works at one size only. The [Connections](/docs/widgets/connections/) map is Medium only:

```json
"views": {
  "map": { "label": "Map", "src": "connections-map.html", "sizes": ["medium"] },
  "vpn": { "label": "VPN", "src": "connections-vpn.html" }
}
```

Each list must be a subset of the top-level `sizes`. A view without `sizes` offers all of them.

## List icon

Settings lists every item with an icon. A widget that names a `glyph` shows it. One that names none shows its card size.

| `glyph` | What it depicts |
| --- | --- |
| `clock` | A dial and hands |
| `weather` | A sun behind a cloud |
| `gauge` | A dial with a needle, for a measured figure |
| `shield` | A shield with record lines, for a name server |
| `drive` | A drive with a trace across it |
| `archive` | A store with an arrow into it |
| `shelf` | Book spines |
| `play` | A play mark in a frame |
| `network` | Three linked nodes |
| `merge` | Two branches joining one |
| `panels` | Two panels, one handing over to the other |

Two widgets may not name the same glyph. A test refuses it. A name not on this list is rejected at startup.

## Card background

The card behind a widget is glass by default: dark, semi-transparent and blurred, so the wallpaper reads through. A widget can name another:

| `card` | What it looks like |
| --- | --- |
| `dark` | Solid dark, `#1c1c1e`. |
| `light` | Solid white. |
| `translucent` | Darker than the default but more transparent, with a stronger blur. |

A `card` inside a `views` entry overrides the widget-level one for that view.

Keep the default glass when the widget paints its own interior. The [Weather](/docs/widgets/weather/) widget does this, white by day and dark by night.

Under the increased-contrast setting, `translucent` becomes as dense as the default card. An unknown name is rejected.

## Field types

| Type | What the user sees |
| --- | --- |
| `text` | An inline-edit row. |
| `number` | An inline-edit row that stores a number. |
| `secret` | An inline-edit row for a masked value. Shows `Configured` once set. The value stays on the server. Leaving it blank keeps the stored value. |
| `toggle` | An on and off switch, stored as a boolean. |
| `color` | The swatch and colour control used elsewhere in the admin. Saves `#rrggbb`. |
| `select` | A dropdown. `"variant": "pills"` renders a radio group. With `optionsFrom` it adds a Fetch button. |
| `multiselect` | A checklist dropdown. The value is an array. |
| `group` | A repeatable set of sub-fields in a nested `fields` array, each entry its own card with Add and Remove. Groups cannot nest. |
| `picklist` | A fixed number of dropdowns filled from one fetch. Saves an array, `null` where unset. Needs `count` or `countBySize`, plus `options` or `optionsFrom`. |
| `object` | One nested set of sub-fields in a `fields` array, saved one level deep. Objects cannot nest. |

## Field options

| Key | Meaning |
| --- | --- |
| `label` | Shown to the user. Required. |
| `placeholder` | The hint in an empty `text`, `number` or `secret` row. |
| `default` | The value used when none is saved. |
| `hint` | Short help under the field. On a `group`, it shows at the bottom of the section. |
| `optional` | When `true`, the field is not required to save. A required `secret` counts as missing only when nothing is stored. |
| `transient` | When `true`, the field is sent to an `optionsFrom` fetch but not saved. Use it for a search box. Top-level fields only. |
| `carries` | For a `select` with `optionsFrom`: extra config keys this picker writes, from the chosen option's `set` block. |
| `showIf` | Shows the field only when a sibling matches: `{ "field": "provider", "equals": "adguard" }`, or `{ "field": "provider", "in": ["adguard", "pihole"] }`. Anything else is rejected. |
| `optionsFrom` | For a `select`: the data endpoint that returns the options at config time. |
| `variant` | For a `select`: `"pills"` renders a radio group. |
| `min`, `max` | For a `group`: the fewest and most entries. |
| `maxBySize` | For a `group`: a cap per size, such as `{ "small": 2, "medium": 5 }`. Extra entries are trimmed on a smaller size. |
| `countBySize` | For a `group`: a fixed row count per size, such as `{ "small": 1, "medium": 3 }`, with no Add or Remove. |

## One key, asked for differently

Two sibling fields may share a `key`, so the same value is asked for differently depending on another field. Give each one a `showIf`:

```json
{ "key": "url", "type": "text", "label": "Metrics URL", "placeholder": "conduit:9090",
  "showIf": { "field": "type", "equals": "conduit" } },
{ "key": "url", "type": "text", "label": "Management API URL", "placeholder": "netbird:33073",
  "showIf": { "field": "type", "equals": "netbird" } }
```

Hidden fields are skipped when values are read back, so only the visible one saves. A repeated key without a `showIf` on every declaration is rejected. The validator does not check that the conditions exclude each other.

## A fixed list of picks

A `picklist` stores a plain array of ids, one per physical slot, filled from one call. [Disk health](/docs/widgets/disk-health/) uses it for bays:

```json
{ "key": "bays", "type": "picklist", "label": "Bays", "rowLabel": "Bay",
  "optionsFrom": "devices", "countBySize": { "small": 4, "medium": 10 } }
```

One Fetch button loads the options once for every row. The saved value is always `count` entries long, such as `["sda-abc", null, ...]`.

A `group` whose `min` equals its `max` is fixed-length too.

## Nested settings

Use `object` for config stored one level deep:

```json
{ "key": "vpn", "type": "object", "label": "Connection", "fields": [
  { "key": "url", "type": "text", "label": "Control server URL" },
  { "key": "apiKey", "type": "secret", "label": "API key", "optional": true }
] }
```

That saves `{ "vpn": { "url": "...", "apiKey": "..." } }`. A sub-field `showIf` names a sibling inside the same object. Its secrets are scrubbed and kept like top-level ones.

## Options from the service

When a `select` can only be filled after the user enters a URL and key, give it `"optionsFrom": "<endpoint>"`. The form shows a **Fetch** button, which calls `data.js` with `ctx.endpoint` set to that name. Return `{ options: [{ value, label }, ...] }`.

The fetch receives the current form values, `transient` fields included.

An option can write other keys too. List them in `carries` and return them in the option's `set`. [Weather](/docs/widgets/weather/) stores coordinates this way:

```json
{ "key": "city", "type": "select", "optionsFrom": "geocode", "carries": ["lat", "lon"] }
```

```js
return { options: [{ value: 'Ottawa, Ontario, Canada', label: 'Ottawa, Ontario, Canada', set: { lat: 45.42, lon: -75.7 } }] };
```

Saved values under carried keys are kept when the widget is edited without touching the picker.

A `select` inside a `group` can use `optionsFrom`. Each row fetches on its own, and `ctx.row` holds that row's values:

```js
if (ctx.endpoint === 'jobs') {
  const slot = ctx.row || {};
  const r = await ctx.fetchJSON(`${ctx.normalizeBase(slot.url)}/api/jobs`, { /* ... */ });
  return { options: r.data.map(j => ({ value: j.id, label: j.name })) };
}
```
