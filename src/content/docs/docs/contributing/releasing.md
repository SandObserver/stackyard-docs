---
title: How Stackyard releases are made
description: How a Stackyard version is cut, signed and published, and how the public demo runs.
---

## Cut a release

1. Run **Release prep** in Actions with the version, such as `1.8.0`.
2. It folds `changelog.d/` into the changelog, bumps the version, pins the demo image, and opens a pull request.
3. Merge it. The tag builds, scans, signs and publishes the image and the release page.
4. Merge the Community Applications pull request that follows.

A tag like `v1.8.0-beta.1` publishes a pre-release and leaves `latest` and the demo alone.

If a release build fails, fix `main`, delete the tag, and push it again.

## Secrets

- `RELEASE_APP_CLIENT_ID` and `RELEASE_APP_PRIVATE_KEY`: a GitHub App with read and write on Contents and Pull requests, installed on this repository only. The built-in token cannot trigger the release workflows.
- `DOCS_DEPLOY_HOOK_URL`: a Cloudflare Pages deploy hook. It rebuilds this site after a stable release. The release still succeeds without it.

## Demo

`DEMO_MODE=true` serves `api/demo/demo-config.json`, blocks every write, and makes no outbound requests. Widgets read their `demo.js` instead.

`api/test/demo.test.js` fails on a private address, a secret or an unknown host in the demo config.

On Render, `render.yaml` runs a pinned release image. Keep `PORT=80`.
