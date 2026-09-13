---
title: Translations
description: How Stackyard translations work, how to add a key or a language, and the terms translators must keep.
---

Translations are plain JSON files in `ui/i18n/`, one per language. No build step and no dependency. `en.json` is the source, and the fallback for any missing key.

A translator changes JSON files only. No application code is involved.

## Languages

`LANGUAGES` in `ui/js/i18n.js` is the one place a language is defined. Nothing else decides what is offered, which direction it reads, or how its name is spelled.

| Code | Language | Direction | Status |
| --- | --- | --- | --- |
| `en` | English | ltr | source |
| `fa` | Persian | rtl | machine |
| `zh-Hans` | Chinese (Simplified) | ltr | machine |
| `es` | Spanish | ltr | machine |
| `de` | German | ltr | machine |
| `fr` | French | ltr | machine |

Codes are BCP 47 tags. A code is also the catalog filename.

`source` marks the language the strings are written in. `machine` marks a catalog produced by machine translation. **No speaker of that language has checked a `machine` catalog.** It is complete and structurally valid, but its wording is unverified. A correction from a speaker overrides what is there.

## Translator notes

- Translate values, not keys. Keep the JSON structure identical to `en.json`.
- Keep placeholders such as `{count}` and `{name}` exactly as they are. A renamed or dropped placeholder takes the value out of the sentence.
- Keep the markup tags `<strong>`, `<em>`, `<code>` and `<br>` intact. No other tag renders.
- Translate a whole message. Word order, articles and punctuation move when the language changes.
- Leave proper nouns and technical tokens as they are: Unsplash, Docker, URLs, environment variable names, HTTP header names.

### Terms with a fixed meaning

| Term | Meaning |
| --- | --- |
| tile | One item on the dashboard grid. |
| badge | The small status readout drawn on a tile. |
| folder | A tile that opens to hold other tiles. |
| widget | A tile that runs its own page in a frame. |
| Dock | The fixed row of tiles at the foot of the dashboard. |
| upstream | The service a tile points at, not Stackyard. |
| stale | The last reading is old. The service was not reached this time. |
| unavailable | The service answered, and it is not working. |

Some languages have words that must or must not be used. `ui/test/i18n-coverage.test.mjs` holds that list and fails on a forbidden word.

## Fallback

Fallback is per key, not per locale. A key missing from the selected language falls back to English on its own, and the rest of the page stays translated.

A key missing from English too renders as the key itself. The reachability test fails the build before that reaches a reader.

## Counted messages

A message with a count is stored once per plural category. The language's own rules choose the category:

```json
"loaded_one": "Loaded {count} option",
"loaded_other": "Loaded {count} options"
```

Call it with a numeric `count`:

```js
t('widgetCfg.loaded', { count: opts.length });
```

Never choose the form in code. `count === 1` is an English rule. French and Persian put zero in `one`, Chinese has one form for every count, and other languages have `few` and `many`.

Read the categories a language uses from the runtime:

```sh
node -e "console.log(new Intl.PluralRules('fr').resolvedOptions().pluralCategories)"
```

Every category listed must exist in that catalog, and no others.

## Add a key

1. Add it to `ui/i18n/en.json`, under the section it belongs to.
2. Add the same key to the other five catalogs.
3. Reference it by its full dotted name, such as `t('general.logLevel')` or `data-i18n="general.logLevel"`, so the reachability test can see it.

A key nothing references fails the test suite. So does a reference to a missing key, and English written straight into the source, which `ui/test/hardcoded-strings.test.mjs` catches.

In static markup, name the key on the element:

| Attribute | Sets |
| --- | --- |
| `data-i18n` | text content |
| `data-i18n-html` | text content, with the allowed markup tags |
| `data-i18n-ph` | `placeholder` |
| `data-i18n-al` | `aria-label` |
| `data-i18n-title` | `title` |

## Add a language

1. Add it to `LANGUAGES` in `ui/js/i18n.js`:

   ```js
   { code: 'it', name: 'Italiano', english: 'Italian', dir: 'ltr', status: 'machine' },
   ```

2. Copy `en.json` to `ui/i18n/it.json` and translate the values.
3. Copy `en.json` to `ui/widgets/<name>/i18n/it.json` for every widget and translate those too.
4. Split each counted message into the categories the language uses.
5. Update the language table on this page.

The language then appears under Settings, General, Language.

## Development locales

Two locales exist for testing and are never offered in the selector. Add `?lang=` to the dashboard or admin URL:

```
http://localhost:8080/?lang=en-XA
http://localhost:8080/admin/?lang=cimode
```

- **`en-XA`** accents every letter, pads the text by about 40% and brackets each message. Clipped text, bad wrapping and joined fragments show up while still readable.
- **`cimode`** loads no catalog, so every string renders as its key. Text that bypasses the translation system stands out.

Neither is saved. `e2e/localisation.spec.js` loads the dashboard and Settings in `en-XA` and fails on any control whose text overflows without an ellipsis, at desktop and at 390px wide.

## Validation

```sh
cd ui/test && node --test i18n.test.mjs i18n-reachability.test.mjs i18n-coverage.test.mjs widget-i18n.test.mjs i18n-markup.test.mjs
```

These run offline and contact no translation service.

## Widget strings

A widget frame never loads the dashboard i18n module. The selected code arrives on the frame URL as `lang`.

Everything a widget shows, in its settings form and in the widget itself, comes from its own folder:

```
ui/widgets/<name>/
  widget.json
  i18n/
    en.json      the source
    fa.json      one file per language
```

In `widget.json`, write the key where the text would go:

```json
{ "key": "dnsUrl", "type": "text", "label": "dnsUrl.label", "hint": "dnsUrl.hint" }
```

`label`, `placeholder`, `hint`, `rowLabel` and `fetchLabel` are resolved this way. The API substitutes the selected language when it serves the manifest.

In the widget page, ask the toolbox:

```js
import { loadStrings, wt } from '/js/widget-toolbox.js?v=1';
await loadStrings();
wt('ui.queriesBlocked', 'Queries Blocked');
```

Resolution is the selected language, then the widget `en.json`, then the text passed in. The toolbox has no counted-message form. A widget that needs one selects the category itself with `Intl.PluralRules`.

See [Build your first widget](/docs/create-a-widget/).
