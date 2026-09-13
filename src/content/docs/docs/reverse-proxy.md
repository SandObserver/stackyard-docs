---
title: Run Stackyard behind a reverse proxy with TLS
description: Put Stackyard behind a TLS-terminating reverse proxy, and set TRUST_PROXY and TRUSTED_PROXY so login and rate limiting work.
---

Stackyard serves plain HTTP only. It does not terminate TLS. For HTTPS, put it behind a reverse proxy that terminates TLS.

Two features need HTTPS: Keep Screen Awake, and logging in from behind a proxy.

## The two variables

Two environment variables apply, and they do different things.

`TRUST_PROXY=true` makes Stackyard believe `X-Forwarded-Proto: https`, so the session cookie gets its `Secure` flag. Set it only when a proxy you control is actually in front of the app.

:::caution
If `TRUST_PROXY=true` is set while Stackyard is also reachable directly, a client can claim `X-Forwarded-Proto: https` and be issued a `Secure` cookie over plain HTTP.
:::

`TRUSTED_PROXY` tells nginx where the front proxy sits, so it can resolve the real client address for rate limiting:

```
TRUSTED_PROXY=172.18.0.0/16
TRUSTED_PROXY="172.18.0.0/16 10.0.0.5"
```

Without it, every request through the proxy counts as the same client, and rate limiting becomes one shared bucket.

## In Compose

```yaml
services:
  stackyard:
    environment:
      - TRUST_PROXY=true
      - TRUSTED_PROXY=172.18.0.0/16
```

Make the proxy send `X-Forwarded-Proto: https`.

## One instance

Rate-limit counters are held in memory and are not shared across replicas. Run a single instance behind any proxy.

## When login fails

A login that returns to the login screen with no error usually means `TRUST_PROXY` is unset or the proxy does not send the header. See [Troubleshooting](/docs/troubleshooting/#i-cannot-log-in-or-i-get-bounced-back-to-the-login-screen).

Stackyard is not hardened for the public internet, even behind a proxy. See [Security](/docs/security/).
