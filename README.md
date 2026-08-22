# Stackyard docs and landing site

The marketing landing page and documentation for
[Stackyard](https://github.com/SandObserver/stackyard), a self-hosted homelab
dashboard.

Built with [Astro](https://astro.build) and
[Starlight](https://starlight.astro.build). Static output, no backend. Search is
[Pagefind](https://pagefind.app), generated at build time.

## Running it

```sh
npm install
npm run dev
```

The landing page is at `/`. The documentation is at `/docs/`.

| Command | Does |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` | Build to `dist/` |
| `npm run preview` | Serve the built site |

## Content that tracks the app repo

The Development and Changelog pages are generated at build time from
`CONTRIBUTING.md` and `CHANGELOG.md` in the Stackyard repository, so they never
drift from the source.

The build looks for that checkout at `../stackyard`. Point it elsewhere with
`STACKYARD_REPO`:

```sh
STACKYARD_REPO=/path/to/stackyard npm run build
```

Without it the build still succeeds. Both pages then link to GitHub instead.

## Layout

| Path | Holds |
| --- | --- |
| `src/pages/index.astro` | The landing page, including the live dashboard showcase |
| `src/content/docs/docs/` | Documentation pages, one Markdown file per page |
| `src/pages/docs/` | The two pages generated from the app repo |
| `src/styles/tokens.css` | Stackyard's design tokens, copied from the app |
| `src/styles/docs.css` | Starlight dressed in those tokens |
| `public/icons/` | Service icons used by the showcase and feature sections |

`src/styles/tokens.css` is a copy of `ui/css/tokens.css` in the app repo. There
is no automatic sync. Re-copy it when the app's tokens change.

## Icons

Service marks come from [selfh.st/icons](https://selfh.st/icons) and
[dashboard-icons](https://github.com/homarr-labs/dashboard-icons), the same set
Stackyard resolves app icons from. Each mark belongs to its own project.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md). Run `npm run build` and `npm run check`
before opening a pull request.

## License

Apache-2.0. See [LICENSE](LICENSE) and [NOTICE](NOTICE).
