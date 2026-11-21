---
title: Contribute to Stackyard
description: The rules a Stackyard change must keep, how to run it locally, and the checks a pull request must pass.
prev: false
---

## Rules

- One container. No extra services, no database.
- No runtime dependencies. The frontend has no framework and no build step.
- Server code is CommonJS. Frontend code is ES modules.

Open an issue first if a change needs a dependency or a build step.

## Run locally

Run the working tree with Docker Compose 2.23 or later:

```sh
docker compose -f docker-compose.dev.yml watch
```

It serves `http://127.0.0.1:8701`. A saved file reaches the container within a few seconds. A change under `api/src` or `ui/widgets` restarts it. A change to the Dockerfile, nginx or supervisord config rebuilds the image. Data is kept in the `stackyard-dev_data` and `stackyard-dev_icons` volumes.

Without Docker, use Node 26 or later. Start the API with `npm start` in `api/`, setting `CONFIG_PATH`, `ICONS_PATH` and `WIDGETS_PATH=../ui/widgets`. Serve `ui/` with any server that proxies `/api/` and `/health` to `127.0.0.1:3000`, as `nginx/dashboard.conf` does.

## Tests

A behavior change ships with its tests. A bug fix ships with a test that fails without it.

Run `npm ci --ignore-scripts` in the repository root first.

```sh
npm test
(cd api && node --test test/link-url.test.js)
(cd api && node --test --test-name-pattern="Node floor")
```

`npm test` runs the backend, frontend and `test/repo` suites in CI's order. It stops at the first failure. The second line runs one file. The third runs every test whose name matches the pattern.

Playwright specs in `e2e/` run against `BASE_URL`, default `http://127.0.0.1:8730`. They replace the whole config. They refuse a server that holds items they did not write, such as the dev instance, unless `E2E_ALLOW_WIPE=1` is set. The steps to run one spec against a local image are in [CONTRIBUTING.md](https://github.com/SandObserver/stackyard/blob/main/CONTRIBUTING.md#before-opening-a-pr).

## Pull request checks

The checks CI runs are listed in [CONTRIBUTING.md](https://github.com/SandObserver/stackyard/blob/main/CONTRIBUTING.md#before-opening-a-pr).

- Do not edit `CHANGELOG.md`. List user-visible changes in the pull request description under **Changelog**, as `- ` lines below a Keep a Changelog heading such as `### Fixed`. Merging adds them to `[Unreleased]`.
- After editing `ui/js` or `ui/css`, run `node scripts/bump-cache-busting.js` and commit the result. Never edit a `?v=` stamp by hand.
- A new `ui/js` module needs two entries in `tsconfig.frontend.json`: the path and its `?v=*` form.
- Run Biome through `npm run lint`. A bare `npx biome` runs an unrelated package.
