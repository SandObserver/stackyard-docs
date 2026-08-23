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

## Pull requests

One branch per change, off `main`. `main` is protected: it takes no direct push,
and the `build` check has to pass before a merge.

Branch names are `type/short-kebab-description`. Lowercase, hyphens, no
underscores, no ticket numbers, under about 50 characters. The types in use are
`docs` for content, `fix` for a broken page or build, `feat` for a new page or
component, and `chore` for maintenance.

Pull request titles are `Type: short description`, lowercase after the colon,
matching the branch type. The title becomes the squash commit, so it has to
describe the change on its own.

Write the title and body for someone reading the repository later. Describe the
diff, not how it was arrived at. No references to a conversation, a screenshot,
a previous attempt or a review comment.

`.github/PULL_REQUEST_TEMPLATE.md` fills in when the pull request opens.
Complete every section and set the checklist boxes.

Pick one label, the most specific that fits. Add a second only when the change
genuinely crosses two categories.

| Label | For |
| --- | --- |
| `documentation` | Documentation pages and their structure |
| `content` | Wording, structure, new pages |
| `widget-preview` | Widget previews and their stub data |
| `ui/ux` | Layout, styling and accessibility |
| `accessibility` | A barrier affecting people with disabilities |
| `bug` | Something on the site is broken |
| `security` | A security fix |
| `dependencies` | A dependency update |
| `github_actions` | Workflow and CI changes |
| `javascript` | Build scripts and page logic |
| `refractor` | Cleanup with no behaviour change |

This repository has no `CHANGELOG.md`. The site publishes on merge, and the
Changelog page it serves belongs to the application. Nothing here is versioned.

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
