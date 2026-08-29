---
title: Advanced configuration
description: Deployment-level settings. Environment variables, reverse proxies, host access, and Docker health checks.
---

Everyday setup happens in the web UI. Nothing on this page is required for a normal install. These are deployment concerns: how the container is reached, what it may reach, and how it identifies clients.

## Environment variables

Every variable is optional. The defaults are what the container ships with.

| Variable | Default | What it does |
| --- | --- | --- |
| `ALLOW_PRIVATE_IPS` | unset | Turns the SSRF guard off, so badges and widgets may reach private, LAN and loopback addresses. Most homelab installs need it. |
| `SOCKET_PROXY_URL` | unset | A Docker socket proxy, for container health monitoring. |
| `TRUST_PROXY` | unset | Believe `X-Forwarded-Proto`, so a request through a TLS-terminating proxy gets a `Secure` cookie. |
| `TRUSTED_PROXY` | unset | Where a front proxy sits, so nginx can resolve the real client for rate limiting. |
| `SESSION_MAX_AGE_DAYS` | `0.5` | Idle session lifetime in days before re-login, so 12 hours by default. Accepts a fraction. A session in use is extended. |
| `PASSWORD_HASH_MEMORY` | `16mib` | Memory per password hash. One of `8mib`, `16mib`, `32mib`, `64mib`, `128mib`. |
| `LOG_LEVEL` | `info` | `debug`, `info`, `warn` or `error`. `warn` and `error` behave the same. The General settings page also sets this, and that wins once the config has loaded. |
| `DEMO_MODE` | unset | Run as a read-only public showcase. |
| `CONFIG_PATH` | `/data/apps.json` | Where the config file lives. |
| `ICONS_PATH` | `/icons` | Where uploaded icons are written. |
| `WIDGETS_PATH` | `/usr/share/nginx/html/widgets` | Where widget folders are read from. A wrong path loads an empty registry and every widget reports as unknown. |
| `PORT` | `80` | Only for a hosting platform that reads `PORT` to decide where to route. It must be `80`, the port the container serves on. It does not move anything inside the container. To reach the dashboard on another port, change the published port instead. |

If `CONFIG_PATH` or `ICONS_PATH` points at a folder that does not exist, the container logs a warning at startup. Writes to that path fail until the folder exists.

The repo's [`docker-compose.yml`](https://github.com/SandObserver/stackyard/blob/main/docker-compose.yml) carries each of these as a commented line.

## Reaching services on private IPs

The SSRF guard blocks requests to private, loopback and link-local addresses. Most homelab services live on private IPs, so most installs need the guard off:

```yaml
environment:
  - ALLOW_PRIVATE_IPS=true
```

Read [Security](/docs/security/) before setting it. Two things work without it: dotless hostnames such as Docker container names, and the host IP you set in General settings.

## Reaching services on the Docker host

On Linux a container cannot reach the host's LAN IP by default. Add:

```yaml
extra_hosts:
  - "host.docker.internal:host-gateway"
```

`host-gateway` is a Docker built-in that resolves to the host machine's IP.

## Behind a reverse proxy

Two variables apply, and they do different things.

`TRUST_PROXY=true` makes Stackyard believe `X-Forwarded-Proto: https`, so the session cookie gets its `Secure` flag. Set it only when a proxy you control is actually in front of the app.

:::caution
If `TRUST_PROXY=true` is set while Stackyard is also reachable directly, a client can claim `X-Forwarded-Proto: https` and be issued a `Secure` cookie over plain HTTP.
:::

`TRUSTED_PROXY` tells nginx where the front proxy sits, so it can resolve the real client address for rate limiting:

```
TRUSTED_PROXY=172.18.0.0/16
TRUSTED_PROXY="172.18.0.0/16 10.0.0.5"
```

Without it, every request through the proxy counts as the same client and rate limiting becomes one shared bucket.

Rate-limit counters are held in memory and are not shared across replicas. Run a single instance behind any proxy.

## Docker container health checks

The health-check badge can read a container's state from the Docker daemon. This needs a Docker socket proxy, a separate container that exposes a narrowed read-only view of the socket.

[tecnativa/docker-socket-proxy](https://github.com/tecnativa/docker-socket-proxy) is the usual choice:

```yaml
services:
  socket-proxy:
    image: tecnativa/docker-socket-proxy
    environment:
      - CONTAINERS=1
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock:ro
    networks:
      - socket_proxy
    restart: unless-stopped

  stackyard:
    environment:
      - SOCKET_PROXY_URL=http://socket-proxy:2375
    networks:
      - socket_proxy

networks:
  socket_proxy:
```

Then turn on Docker Container Health Checks in General.

:::caution
Never mount the Docker socket into Stackyard itself. A name such as `http://socket-proxy:2375` resolves only when both containers share a network. An IP address works only when the proxy publishes its port beyond the host's own loopback.
:::

Ping-based health checks need none of this. See [Badges](/docs/badges/).

## Optional host mounts

Two mounts extend what the System Summary widget can read when its source is This Machine:

```yaml
volumes:
  # CPU temperature sensors
  - /sys/class/thermal:/sys/class/thermal:ro
  # Disk usage for a mount path
  - /mnt/your-drive:/mnt/your-drive:ro
```

## TLS

Stackyard does not terminate TLS and serves plain HTTP only. Put it behind a reverse proxy that terminates TLS. See [Security](/docs/security/).
