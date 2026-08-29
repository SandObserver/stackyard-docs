---
title: Security
description: What Stackyard protects, what it deliberately does not, and how to deploy it safely.
---

**In the admin:** General, then Security. See the [Settings reference](/docs/settings-reference/).

Read this before exposing Stackyard beyond your own network.

## Where Stackyard should run

Stackyard serves plain HTTP and does not terminate TLS.

:::caution
Stackyard is not designed or hardened for direct exposure to the public internet. Authentication exists to separate local users. It is not an internet-facing security boundary.
:::

Run it on a trusted network, or behind a reverse proxy that terminates TLS and adds its own access control. See [Advanced configuration](/docs/advanced-configuration/).

## Authentication

- Passwords are hashed with scrypt and a per-password salt, stored in PHC string format.
- Session tokens are HMAC-signed and verified with a constant-time comparison.
- Sessions expire after an idle lifetime, 12 hours by default. A session in use is reissued past the halfway mark.
- Login is rate-limited to 5 attempts per IP per 15 minutes. Counters are in memory, so a restart clears them and they are not shared across replicas. Run a single instance behind any proxy.
- Changing the password rotates the session secret, signing out every other device. Sign out all devices does the same without changing the password.

Authentication is only in force once a password is stored. Until then, the endpoint that sets one accepts the first caller. See [First setup](/docs/first-setup/).

## Secrets

Stored secrets are stripped from the config before it reaches the browser. A populated field reports as set without returning its value, in config responses and in exports alike.

A secret is restored only for the request it was stored for. If a save changes where the credential would be sent, by editing a badge URL, its non-secret headers, or any non-secret field of a widget's config, the stored value is not restored and Stackyard names what must be re-entered. Matching on an item's id alone would let an imported config point an existing credential somewhere new.

Secrets are stored in plain text in `apps.json` on the data volume. Protect that volume with filesystem permissions and backups.

## The SSRF guard

The server blocks outbound requests to private, loopback, link-local, carrier-grade NAT, multicast and reserved ranges, in IPv4 and IPv6. It resolves the host, checks the address, then pins the resolved IP so the connection cannot be re-pointed after the check.

`localhost` is refused by name. Dotless hostnames such as Docker container names are trusted, as is the host IP set in General.

`ALLOW_PRIVATE_IPS=true` disables the guard entirely. Most homelab installs need it.

The guard limits what a compromised widget can reach. It does not protect against an admin, who can already point widgets anywhere.

## Outbound requests

| Host | Why |
| --- | --- |
| `cdn.jsdelivr.net` | The dashboard-icons set. |
| Unsplash | Wallpaper, only when the wallpaper source is Unsplash. |
| `api.github.com` | The update check, when About is opened, at most once an hour. |

Nothing else leaves your network, and no usage data is collected.

Icons load through the server, which caches each one for 24 hours, so the CDN does not learn which services your dashboard shows. Set the wallpaper to an image or a solid colour and Unsplash is never contacted.

## The container

The provided Compose file drops all capabilities, adds back only what is needed, sets `no-new-privileges`, and bounds memory, process count and log size.

Inside, supervisord runs as root to bind port 80 and start both processes. It drops the API to the unprivileged `node` user, and nginx drops its workers to `nginx`. The API, which parses untrusted input, never runs as root.

## Verifying a release image

Every released image is signed with [cosign](https://docs.sigstore.dev/) using keyless signing, bound to the GitHub Actions workflow that built it and recorded in Sigstore's transparency log.

```sh
cosign verify ghcr.io/sandobserver/stackyard:1.5.0 \
  --certificate-identity-regexp '^https://github.com/SandObserver/stackyard/' \
  --certificate-oidc-issuer https://token.actions.githubusercontent.com
```

Both flags matter. Without them cosign accepts a signature from any identity, which proves only that something signed the image.

Each release build also scans the image with Trivy and fails on a HIGH or CRITICAL finding that has a fix, so a flagged image never reaches a registry. A scheduled job rescans the published `latest` image every week, on both platforms, which covers a vulnerability disclosed after a release.

The build produces an SPDX SBOM listing what is inside the image. It is attached to the run as an artifact, and attested to the registry beside the signature, so it stays available after the artifact expires:

```sh
cosign verify-attestation ghcr.io/sandobserver/stackyard:1.5.0 \
  --type spdxjson \
  --certificate-identity-regexp '^https://github.com/SandObserver/stackyard/' \
  --certificate-oidc-issuer https://token.actions.githubusercontent.com
```

## Reporting a problem

See [SECURITY.md](https://github.com/SandObserver/stackyard/blob/main/SECURITY.md). The full security notes are in [docs/security.md](https://github.com/SandObserver/stackyard/blob/main/docs/security.md).
