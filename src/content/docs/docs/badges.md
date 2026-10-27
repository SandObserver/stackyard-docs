---
title: Status badges and health checks
description: Add health checks, fixed labels and live values from any API to Stackyard app tiles.
---

**In the admin:** Dashboard, open an app, then Badge.

A badge is the small pill on an app tile. Each app can have three kinds.

<figure class="sy-shot">
  <img class="sy-shot__light" src="/img/admin/app-edit-badge-c78c6f39.png" alt="The Badge section of an app: Health Check, Fixed Label and Live Activity" loading="lazy"><img class="sy-shot__dark" src="/img/admin/app-edit-badge-dark-ea12a49b.png" alt="The Badge section of an app: Health Check, Fixed Label and Live Activity" loading="lazy">
</figure>

## Health check

Shows whether the service is up.

- **Ping** reads the HTTP status of a URL. A link-local address (`169.254.0.0/16`, `fe80::/10`) is never pinged, by address or by a name that resolves to one. That range holds the cloud metadata service.
- **Container** reads the container state from Docker. It needs a socket proxy such as [docker-socket-proxy](https://github.com/tecnativa/docker-socket-proxy) and its address in Docker Socket URL in General, or in `SOCKET_PROXY_URL`. A proxy that allows only versioned API paths, such as `/v1.47/containers/json`, works too. Never mount the Docker socket into Stackyard.
- **Proxmox** reads whether a Proxmox VE virtual machine or container is running. Pick it from the Guest list. It needs the Proxmox connection in General.

Every check type needs **Health Checks** on in General.

### Proxmox token

1. In Proxmox, open **Datacenter**, **Permissions**, **API Tokens**, and add a token.
2. Give the role **PVEAuditor** on path `/`. The role is read only.
3. If **Privilege Separation** is on, give the role to the token itself, not only to its user. Otherwise the token sees no guests.
4. In Stackyard, enter the address, the token ID (`user@realm!name`) and the secret, then press <span class="sy-btn sy-btn--ghost">Test</span>. It reports how many guests the token can see.

One request to Proxmox serves every Proxmox tile.

A problem shows a red `!`. Hover it for the reason. Turn on Hide Healthy Badge in General to hide the green state.

## Fixed label

Up to 10 characters of text, in a colour you pick.

Badge colours are Accent, Success, Warning, Danger and Info. Each is drawn for the display mode it is shown in. The colour wheel opens the system colours and a colour code for anything else.

## Live activity

A number from any API. Enter the API URL, add a header if the API needs a key, and press <span class="sy-btn sy-btn--ghost">Fetch</span>. Stackyard lists every number in the response, including a number sent as text, such as `"21.5"`. Pick one.

If the API asks for a username and password, turn on **Authentication** and enter them under **Sign In**. The password stays on the server. A username and password typed into the URL are not sent.

Tick **Secret** on a header to keep its value on the server. Poll sets how often it reads, in seconds. Every open dashboard shares that reading.

### More than one value

One API can feed up to five values. Press Add Label for each.

<figure class="sy-shot">
  <img class="sy-shot__light" src="/img/admin/app-edit-labels-881b3c07.png" alt="Two labels, each with Value, Label Text, Color, Unit and Show From" loading="lazy"><img class="sy-shot__dark" src="/img/admin/app-edit-labels-dark-3cc08348.png" alt="Two labels, each with Value, Label Text, Color, Unit and Show From" loading="lazy">
</figure>

- **Show From** keeps a value hidden below that count.
- The tile shows the first value that has something to report. A second pill behind it means more.
- Hover, tap or focus the badge to list all values.
- **Show as a Single Badge** adds them into one number.

Counts above 99 show as `99+`.

## When an app has more than one

A tile draws one badge. If an app has a health check, a fixed label and live activity together, the tile shows the first that applies:

| Order | Badge | When it shows |
| --- | --- | --- |
| 1 | Health problem | The service is down. It hides everything else, so a fault is never masked by a number. |
| 2 | Live activity | A value has reached its Show From. |
| 3 | Fixed label | Nothing above applies. |
| 4 | Healthy dot | The service is up and nothing else shows. Hidden by Hide Healthy Badge. |

The others stay available in the list that opens on hover or tap.

A folder shows the badge of the app inside it that is reporting.

## Stale values

When a poll fails, the last value stays on the tile, dimmed with a dashed outline. A failed poll never reads as zero. An error answer from the service, such as a rejected API key, counts as a failed poll. A folder is dimmed the same way when an app inside it fails.
