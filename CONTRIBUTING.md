# Contributing

This repository holds Stackyard's landing page and documentation site. The
application lives in [SandObserver/stackyard](https://github.com/SandObserver/stackyard).

## Running it

Node 22.12 or newer.

```sh
npm ci
npm run dev        # development server
npm run build      # production build
npm run preview    # serve the production build
```

Judge anything visual against the production build, not the development server.
The development server does not pick up `astro.config.mjs` changes.

## Before opening a PR

```sh
npm run build
npm run check
```

`npm run check` gates the build output: internal links and heading anchors,
local asset references, house style, and that the placeholder domain never
ships.

## Where things live

| Path | Holds |
| --- | --- |
| `src/pages/index.astro` | The landing page |
| `src/content/docs/docs/` | Documentation pages, one Markdown file per page |
| `src/pages/docs/` | Pages generated from the app repo at build time |
| `src/components/` | Widget preview components |
| `src/styles/` | Design tokens and the Starlight theme |
| `public/widgets/`, `public/js/` | Copies of the app's widget code |
| `public/api/` | Static config and data stubs the previews read |

## Two rules that are not negotiable

**Show the real product.** Widget previews run the application's own code in an
iframe. Never reproduce a widget's appearance in CSS.

**Never ship captured private data.** Stub payloads under `public/api/` are
written by hand. Anything captured from a live instance carries internal
hostnames, IPs and real domains, and must be replaced before it is committed.

## Widget previews

`public/widgets/` and `public/js/` are copies of the app's `ui/widgets/` and
`ui/js/`. Refresh them with a checkout of the app repo beside this one:

```sh
npm run sync-widgets
```

The copies are committed, because CI has no checkout of the app repo. Re-run the
sync and commit the result whenever a widget changes.

## Docs style

Short, plain, literal sentences. One fact per sentence. Say each thing once and
link to it from anywhere else that needs it. Never document a feature, field or
value without verifying it against the application source.
