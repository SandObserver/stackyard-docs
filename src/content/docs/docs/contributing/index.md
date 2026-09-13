---
title: Contribute to Stackyard
description: The rules a Stackyard change must keep, how to run it locally, and the checks a pull request must pass.
---

## Rules

- One container. No extra services, no database.
- No runtime dependencies. The frontend has no framework and no build step.
- Server code is CommonJS. Frontend code is ES modules.

Open an issue first if a change needs a dependency or a build step.

## Run locally

```sh
docker build -t stackyard:local .
docker run -d -p 8700:80 -v ./data:/data -v ./icons:/icons stackyard:local
```

Without Docker, start the API with `npm start` in `api/`, setting `CONFIG_PATH`, `ICONS_PATH` and `WIDGETS_PATH=../ui/widgets`. Serve `ui/` with any server that proxies `/api/` and `/health` to `127.0.0.1:3000`, as `nginx/dashboard.conf` does.

## Tests

A behaviour change ships with its tests. A bug fix ships with a test that fails without it.

```sh
cd api && npm test
cd ui/test && node --test
```

Playwright specs in `e2e/` run against `BASE_URL`, default `http://127.0.0.1:8730`.

## Pull request checks

CI runs `.github/actions/checks/action.yml`:

```sh
npm ci
node scripts/changelog-check.js
node scripts/changelog-fragments.js --check
node scripts/bump-cache-busting.js --check
npm run paths:check
cd api && npm test
cd api && npx c8 check-coverage --lines 92
cd ui/test && node --test
npm run lint
npm run format:check
npm run typecheck
npm run typecheck:ui
docker build -t stackyard:ci .
```

CodeQL and Trivy also run. Both block on a finding.

- Do not edit `CHANGELOG.md`. Add a fragment in `changelog.d/` named `<section>-<slug>.md`.
- Write `?v=1` on new `/css/` and `/js/` imports. The release sets the real hash.
- A new `ui/js` module needs two entries in `tsconfig.frontend.json`: the path and its `?v=*` form.
- Run Biome through `npm run lint`. A bare `npx biome` runs an unrelated package.
