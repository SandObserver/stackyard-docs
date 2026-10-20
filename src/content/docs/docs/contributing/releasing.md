---
title: How Stackyard releases are made
description: How a Stackyard version is cut, signed and published, and how the public demo runs.
---

## Cut a release

1. Run **Release prep** in Actions with the version, such as `1.8.0`.
2. It dates the `[Unreleased]` section, bumps the version, and opens a pull request.
3. Merge it. The tag builds, scans, signs and publishes the image and the release page. A stable tag also publishes the demo.
4. Merge the Community Applications pull request that follows.

A tag like `v1.8.0-beta.1` publishes a pre-release and leaves `latest` and the demo alone.

If a release build fails, fix `main`, delete the tag, and push it again.

## Secrets

- `RELEASE_APP_CLIENT_ID` and `RELEASE_APP_PRIVATE_KEY`: a GitHub App with read and write on Contents and Pull requests, installed on this repository only. The built-in token cannot trigger the release workflows. The app is also a bypass actor on the `main` ruleset, so it can push changelog entries after each merge.
- `DOCS_DEPLOY_HOOK_URL`: a Cloudflare Pages deploy hook. It rebuilds this site after a stable release. The release still succeeds without it.
- `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID`: a token made from the Edit Cloudflare Workers template, and its account. They publish the demo after a stable release. The release still succeeds without them.

## Demo

`DEMO_MODE=true` serves `api/demo/demo-config.json`, blocks every write, and makes no outbound requests. Widgets read their `demo.js` instead.

`api/test/demo.test.js` fails on a private address, a secret or an unknown host in the demo config.

The **Demo** workflow publishes the demo as a static copy on Cloudflare Workers. It starts the released image in demo mode, records its answers for ten minutes, and serves them from a script in each page. A version goes live only after a browser tour of its preview address matches the image. To republish, run **Demo** in Actions with a published version.
