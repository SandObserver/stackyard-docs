---
title: Run Stackyard behind a reverse proxy with TLS
description: Put Stackyard behind a TLS-terminating reverse proxy, and set TRUST_PROXY and TRUSTED_PROXY so login and rate limiting work.
---

Stackyard serves plain HTTP only. It does not terminate TLS. For HTTPS, put it behind a reverse proxy that terminates TLS.

Two features need HTTPS: **Keep Screen Awake**, and logging in from behind a proxy.

## The two variables

Two environment variables apply, and they do different things.

`TRUST_PROXY=true` makes Stackyard believe `X-Forwarded-Proto: https`, so the session cookie gets its `Secure` flag. Set it only when a proxy you control is actually in front of the app.

:::caution
If `TRUST_PROXY=true` is set while Stackyard is also reachable directly, a client can claim `X-Forwarded-Proto: https` and be issued a `Secure` cookie over plain HTTP.
:::

`TRUSTED_PROXY` tells nginx where the front proxy sits, so it can resolve the real client address for rate limiting:

```text
TRUSTED_PROXY=traefik
TRUSTED_PROXY=10.0.0.5
TRUSTED_PROXY="traefik 10.0.0.5"
```

A name is the proxy's container name. Stackyard resolves it when the container starts. A name that does not resolve is not trusted, and the log says so. If the proxy gets a new address, restart Stackyard.

Use a single IP address for a proxy on another host. A whole network such as `172.18.0.0/16` also works, but it trusts every container in it, and the log warns at start.

Without it, every request through the proxy counts as the same client, and rate limiting becomes one shared bucket.

## While no password is set

A request through a proxy is answered only if its `Host` header is in **Allowed Addresses**. An IP address or a local name does not count. `X-Forwarded-Host` is ignored, so the proxy must pass the original `Host` header.

Stackyard detects a proxy from its forwarding headers. A proxy that sends none looks like a direct visit. Make the proxy send `X-Forwarded-For`, and set a password before you publish Stackyard.

Turning protection off through a proxy is refused unless the current name is in **Allowed Addresses**.

## In Compose

```yaml
services:
  stackyard:
    environment:
      - TRUST_PROXY=true
      - TRUSTED_PROXY=traefik
```

Make the proxy send `X-Forwarded-Proto: https`.

## Caddy

Caddy sends `X-Forwarded-Proto` without extra configuration. Run it on the same Docker network as Stackyard:

```text
dashboard.home.arpa {
    reverse_proxy stackyard:80
}
```

## Traefik

Add these labels to the Stackyard service. Replace `websecure` and `letsencrypt` with your own entry point and certificate resolver:

```yaml
services:
  stackyard:
    labels:
      - traefik.enable=true
      - traefik.http.routers.stackyard.rule=Host(`dashboard.home.arpa`)
      - traefik.http.routers.stackyard.entrypoints=websecure
      - traefik.http.routers.stackyard.tls.certresolver=letsencrypt
      - traefik.http.services.stackyard.loadbalancer.server.port=80
```

## Behind a sign-in proxy

A sign-in proxy such as Authelia or Authentik redirects every request without a session to its login page. Safari requests the tab icon and the home screen icon without the session cookie. The home screen icon and the installed app name can then be missing.

Let these paths through without sign-in. They hold only the app name, colours and icon, including a favicon you uploaded:

- `/manifest.json`
- `/favicon.ico`
- `/apple-touch-icon.png` and its sized and `-precomposed` variants
- `/icons/favicon.png`, `/icons/favicon.svg`, `/icons/favicon-192.png`, `/icons/favicon-512.png` and `/icons/favicon-maskable.png`
- `/icons/shortcut-settings-96.png`

Do not let all of `/icons/` through. It also holds your uploaded icons and wallpapers.

For Authelia, put this rule above the rule that protects Stackyard. The first rule that matches applies.

```yaml
access_control:
  rules:
    - domain: 'dashboard.home.arpa'
      policy: 'bypass'
      resources:
        - '^/manifest\.json$'
        - '^/favicon\.ico$'
        - '^/apple-touch-icon(-[0-9]{2,4}x[0-9]{2,4})?(-precomposed)?\.png$'
        - '^/icons/favicon\.(png|svg)$'
        - '^/icons/favicon-(192|512|maskable)\.png$'
        - '^/icons/shortcut-settings-96\.png$'
```

Check a path with `authelia access-control check-policy --config configuration.yml --url https://dashboard.home.arpa/manifest.json`.

## One instance

Rate-limit counters are held in memory and are not shared across replicas. Run a single instance behind any proxy.

## When login fails

A login that returns to the login screen with no error usually means `TRUST_PROXY` is unset or the proxy does not send the header. See [Troubleshooting](/docs/troubleshooting/#login-returns-to-the-login-screen).

Stackyard is not hardened for the public internet, even behind a proxy. See [Security](/docs/security/).
