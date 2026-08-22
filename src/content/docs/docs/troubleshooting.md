---
title: Troubleshooting
description: Find a problem by its symptom, then the cause and the fix.
---

Problems are grouped by what you see. If you only have a log line or an error message, jump to [Messages you might see](#messages-you-might-see).

For how to read the logs and how to file a bug, see [Support](/docs/support/).

## Getting in

### I cannot log in, or I get bounced back to the login screen

The session cookie is marked `Secure` on HTTPS. Behind a reverse proxy that terminates TLS, the browser is sent a cookie it refuses to store, and login fails with no error.

Set `TRUST_PROXY=true` and make the proxy send `X-Forwarded-Proto: https`. Only set it when a proxy you control is in front of Stackyard. See [Security](/docs/security/).

### One person's failed logins lock everyone out

Logins are limited to 5 attempts per IP per 15 minutes. Behind another reverse proxy, Stackyard's nginx sees that proxy as the client, so every request through it shares one bucket.

Set `TRUSTED_PROXY` to where the proxy is, for example `TRUSTED_PROXY=172.18.0.0/16`. See [Advanced configuration](/docs/advanced-configuration/).

### I forgot the password and I am locked out

There is no reset link. Recover it by editing the config file directly.

1. Stop the container.
2. Open `apps.json` in the `data` volume.
3. Under `settings.auth`, delete the `passwordHash` line and set `enabled` to `false`.
4. Start the container.

The dashboard opens without a password. Set a new one in **General**, **Password Protection**.

Back the file up before editing it. See [Backup and restore](/docs/import-export/backup-and-restore/).

## The dashboard

### Could not connect to dashboard API

The page loaded but the API behind it did not answer. The UI is served by nginx and the data comes from the API, and they are separate processes in the same container.

Check `docker logs <container>` for either process failing to start. A data volume that the container's `node` user cannot write to is a common cause.

### My dashboard is empty after a restart

Look in the data volume for a file named `apps.json.corrupt-<timestamp>`. If the config fails to parse on startup, Stackyard copies it aside and starts empty rather than overwriting it. Your previous config is in that file.

Otherwise confirm both volumes are mounted. Without `./data` nothing persists.

### I updated the image but the UI looks the same

The UI files ship inside the image. Pull the new image and recreate the container. In Portainer, redeploy the stack. A browser refresh alone does not do it.

### An icon I re-uploaded still shows the old image

Icons are served with revalidation, so a re-upload appears on the next load. If it does not, hard refresh.

## Apps and badges

### A badge or widget cannot reach a service on my network

The SSRF guard blocks private, loopback and link-local addresses by default, so a URL pointing at `192.168.x.x` or `10.x.x.x` is refused.

Set `ALLOW_PRIVATE_IPS=true`. Read [Security](/docs/security/) first, then see [Advanced configuration](/docs/advanced-configuration/).

Two things work without it. A dotless hostname such as a Docker container name is trusted. So is the Host IP set in **General**.

### The badge shows a dimmed value with a dashed outline

That is the stale state. The last poll failed, so the previous value is shown rather than being read as zero.

Check that the service is reachable and the credential is still valid.

### A credential stopped working after an edit

Changing where a credential would be sent clears the stored value. Editing a badge URL, its non-secret headers, or a non-secret field of a widget's config all count. Unticking **Secret** on a header row clears it on the next save.

Stackyard names the items to re-enter. Enter the credential again and save.

## Widgets

### A widget says "Not configured" or shows an error instead of data

Check three things in order.

1. The server URL and the credential in the widget's settings. A secret field shows as set without revealing the value, and leaving it untouched keeps it.
2. That the container can reach the URL you entered. Right network, right port, no firewall in between.
3. For an HTTPS service with a self-signed certificate, the TLS-skip option.

### A widget briefly shows "Unavailable" then recovers

Widgets keep the last good reading through a transient failure and only surface an error after repeated failures. A flash that clears on its own means one poll timed out.

### Settings unavailable, or a widget is missing from the list

A widget whose definition could not be loaded has its whole stored config withheld, because without the definition the server cannot tell which fields are secret. Nothing is lost. The config is put back on save.

Check the container logs for a definition that failed to load. A `WIDGETS_PATH` pointing at the wrong directory loads an empty registry, and every widget reports as unknown.

### A custom widget I wrote never appears in the type list

A definition that is refused is not listed, and the reason is written to the container log only. Nothing in the admin says why.

Run `docker logs <container>` and look for the refusal at startup. See [Development](/docs/development/).

## Docker and networking

### Stackyard cannot reach services on the Docker host

On Linux a container cannot reach the host's LAN IP without help:

```yaml
extra_hosts:
  - "host.docker.internal:host-gateway"
```

Setting **Host IP** in **General** also allows that address through the SSRF guard.

### The health check badge shows nothing for a container

Container checks read the Docker daemon through a socket proxy. Set `SOCKET_PROXY_URL` to the proxy's address, then turn on **Docker Container Health Checks** in **General**.

A ping check needs neither. Switch the check type to Ping and give it a URL.

### Every app with a container shows as unhealthy at once

The container list comes from a socket proxy, which is a separate container you run yourself. Stackyard only stores its address. When that address cannot be reached, no container is found, and a container that cannot be found counts as not running.

Two addresses that look interchangeable are not, and they fail for opposite reasons.

**A service name** such as `http://socket-proxy:2375` is resolved by Docker's own DNS, which answers only for containers that share a network. Add the proxy's network to the Stackyard service:

```yaml
services:
  stackyard:
    networks:
      - socket_proxy_network

networks:
  socket_proxy_network:
    external: true
    name: socket_proxy_network
```

A service on `network_mode: bridge` is on Docker's default bridge, which has no name resolution at all. No service name works from there.

**An IP address** reaches only what the proxy published. The usual socket proxy compose publishes on the host's loopback:

```yaml
    ports:
      - "127.0.0.1:2375:2375"
```

That port exists on the host and nowhere else. A container's own `127.0.0.1` is not the host's. Packets are dropped rather than refused, so this appears as a timeout, not a connection error.

To use an IP, republish the proxy's port where containers can reach it. The Docker bridge address, usually `172.17.0.1`, reaches containers on that host without exposing anything to the network:

```yaml
    ports:
      - "172.17.0.1:2375:2375"
```

Publishing on `0.0.0.0` also works and is worth avoiding. Even with `POST=0` and `EXEC=0`, it offers an unauthenticated read of every container, image, network and log on that host to anyone who can reach the port.

### A disk slot shows the wrong filesystem

A Glances instance running in Docker reports its own filesystems, not the host's. Mount the host paths into the Glances container.

## Settings that do not apply

### A setting has no effect

Values typed into a Docker UI's environment editor, such as Portainer's stack environment panel, do not reach the container by themselves. Compose uses them to substitute `${NAME}` in the Compose file and passes nothing else through.

The shipped `docker-compose.yml` carries a `${NAME}` line for every operator setting, so the panel works with it. A Compose file that hardcodes values ignores the panel.

Confirm what the container actually received:

```sh
docker exec stackyard env
```

### Keep Screen Awake does nothing

Browsers only allow the wake lock over HTTPS. On a plain HTTP address the toggle has no effect. Put Stackyard behind a reverse proxy that terminates TLS.

### An upload or a save is rejected as too large

Request sizes are limited so one request cannot consume the memory of a small machine.

| What | Limit |
| --- | --- |
| Icon upload | 2 MB |
| Config save | 2 MB |

nginx allows 3 MB, above both, so the API is always the component that refuses and can say what the limit is.

### The container health check is failing

The health check runs through nginx to the API, so it covers both processes. Check the logs for either failing to start. A data volume the container's `node` user cannot write to is a common cause.

## Messages you might see

Messages shown in the admin, and what each one means.

| Message | Meaning |
| --- | --- |
| `Could not connect to dashboard API` | The UI loaded but the API did not answer. See [above](#could-not-connect-to-dashboard-api). |
| `Enter the credential again for: ...` | The request a secret belonged to changed, so the secret was cleared. Re-enter and save. |
| `Nothing at that address answered.` | The socket proxy address is unreachable from inside the container. Usually a proxy published on the host's loopback. |
| `That name is resolved by Docker, which answers only for containers on a shared network.` | The socket proxy service name is not on a network Stackyard shares. |
| `Saved, but the socket proxy did not answer` | The address was stored, but nothing responded. Docker health checks will not work until it does. |
| `Enter the socket proxy address, or turn Docker monitoring off.` | Docker health checks are on with no proxy address set. |
| `Settings unavailable` | The widget's definition could not be loaded. The stored config is kept. |
| `N widgets could not be loaded, so they are not listed below.` | Those definitions were refused at startup. The reason is in the container log. |
| `Container not found` | The socket proxy answered, but no container matched that name. |
| `Ping failed` / `Ping returned <status>` | The URL was reached but did not answer as expected. |
| `That image is too large for the server to accept.` | Over the 2 MB upload limit. |
| `That is not a color. Use #rrggbb or a CSS color name.` | The wallpaper colour field rejects anything else. |
| `Set a password before turning authentication on.` | Authentication needs a password to exist first. |
| `Nothing to import, the file matches your current config.` | The imported file is identical to what is already stored. |
| `<file> is not a gethomepage or Dashy config.` | Only those two formats are recognised. See [Migrating](/docs/import-export/migrating/). |
| `(may be out of date)` | A stale reading. The last poll failed and the previous value is shown. |

## Not actually broken

### The UI looks wrong at a zoom other than 100%

Set the browser's page zoom back to 100% before reporting a layout bug. The admin is laid out in fixed pixels, while the dashboard scales itself from the viewport width, so at any other zoom the two disagree and spacing looks wrong. On iOS the safe-area inset is also reported in points regardless of zoom, so content can sit under the status bar.

This has produced convincing false bug reports. Check the zoom first.

### The demo site is slow to load

The public demo runs on a free tier that sleeps when idle. The first visit can take up to a minute.
