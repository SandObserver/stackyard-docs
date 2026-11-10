---
title: Security
description: What Stackyard protects, what it deliberately does not, and how to deploy it safely.
next: false
---

**In Settings:** General, then Security. See the [Settings reference](/docs/settings-reference/).

Read this before exposing Stackyard beyond your own network.

## Where Stackyard should run

Stackyard serves plain HTTP and does not terminate TLS.

:::caution
Stackyard is not designed or hardened for direct exposure to the public internet. Authentication exists to separate local users. It is not an internet-facing security boundary.
:::

Run it on a trusted network, or behind a reverse proxy that terminates TLS and adds its own access control. See [Use a reverse proxy](/docs/reverse-proxy/).

## Authentication

- Passwords are hashed with scrypt and a per-password salt, stored in PHC string format.
- Session tokens are HMAC-signed and verified with a constant-time comparison.
- Sessions expire after an idle lifetime, 12 hours by default. A session in use is reissued past the halfway mark.
- A session ends 30 days after sign-in even while in use, or after the idle lifetime if that is longer.
- Signing out ends the session on the server. A copy of its cookie stops working too.
- Login is rate-limited to 5 attempts per IP per 15 minutes. All IPv6 addresses in one /64 count as one IP. Counters are in memory, so a restart clears them and they are not shared across replicas. Run a single instance behind any proxy.
- Attempts made under an address that is not local and not in **Allowed Addresses** share a separate limit. A page on another site that points its own name at your server cannot use up yours. Add your reverse proxy's name to the list to keep it on your own limit. While you are signed in on a name that is not listed, **General** offers to add it.
- Changing the password rotates the session secret, signing out every other device. **Sign Out All Devices** ends every session, this browser included, without changing the password.
- New passwords need 15 to 1024 characters and are checked against a list of common passwords. Existing shorter passwords keep working.
- A sign-in or password request over 32 KB is refused.
- A sign-in checked against a password that changed meanwhile is refused.
- Changing the password, or turning protection off, needs the current password as well as a session. Wrong attempts count toward the login limit of 5 per IP per 15 minutes.

Authentication is only in force once a password is stored. Until then, the endpoint that sets one accepts the first caller. `INITIAL_PASSWORD` or `INITIAL_PASSWORD_FILE` stores one on the first start, before any request is answered. It is ignored once a password was set, skipped or removed. If it cannot be stored, the container stops. `INITIAL_PASSWORD` shows in `docker inspect`, so prefer `INITIAL_PASSWORD_FILE` with a Docker secret. See [First setup](/docs/first-setup/).

### Addresses without a password

While no password is set, Stackyard answers only on IP addresses, `localhost`, single-label names, names under `.local`, `.home.arpa`, `.internal` and `.localhost`, and the names in **Allowed Addresses**. Any other address gets a 403. This stops a web page on another site from pointing its own name at your server (DNS rebinding) and changing your settings.

Stackyard never adds a name to the list by itself. Open a fresh install by its IP address or a local name, then add other names in **General**. With a password set, every address works and the list is not checked.

A refused address can still get a password. Stackyard prints a one-time setup code to the container log, and the refused page accepts that code. Reading the log proves ownership of the server. A restart makes a new code.

## Secrets

Stored secrets are stripped from the config before it reaches the browser. A populated field reports as set without returning its value, in config responses and in exports alike.

A secret is restored only for the request it was stored for. If a save changes where the credential would be sent, by editing a badge URL, its non-secret headers, its sign-in username, or a widget field that decides where it goes, the stored value is not restored and Stackyard names what must be re-entered. Matching on an item's id alone would let an imported config point an existing credential somewhere new. These count as such a change too: turning **Allow self-signed certificate** on or off for an app, turning `settings.server.skipTlsVerify` on or off for widgets, changing a widget's type, and changing or removing the port map (`settings.server.portMap`). The Proxmox secret in **General** is cleared when its address, token ID or **Allow self-signed certificate** changes.

Secrets are stored in plain text in `apps.json` on the data volume. Stackyard writes the file readable by its owner only, mode `0600`, and tightens an older file on first read. Protect that volume with filesystem permissions and backups.

## The SSRF guard

The server blocks outbound requests to private, loopback, link-local, carrier-grade NAT, multicast and reserved ranges, in IPv4 and IPv6. It resolves the host, checks the address, then pins the resolved IP so the connection cannot be re-pointed after the check.

`localhost` is refused by name. A dotless hostname such as a Docker container name is resolved and pinned like any other name. It may point at a private address, but not at a loopback or link-local one. The host IP set in **General** is trusted. Only `http` and `https` URLs are fetched. The WebSocket connection TrueNAS widgets use opens on the same URL and passes the same check.

| Range | Why |
| --- | --- |
| `0.0.0.0/8` | this network (RFC 1122) |
| `10.0.0.0/8` | private (RFC 1918) |
| `100.64.0.0/10` | carrier-grade NAT (RFC 6598) |
| `127.0.0.0/8` | loopback (RFC 1122) |
| `169.254.0.0/16` | link-local, includes cloud metadata (RFC 3927) |
| `172.16.0.0/12` | private (RFC 1918) |
| `192.0.0.0/24` | IETF protocol assignments (RFC 6890) |
| `192.168.0.0/16` | private (RFC 1918) |
| `198.18.0.0/15` | benchmarking (RFC 2544) |
| `224.0.0.0/4` | multicast (RFC 5771) |
| `240.0.0.0/4` | reserved, includes broadcast (RFC 1112) |
| `::1`, `::` | IPv6 loopback and unspecified |
| `fc00::/7` | IPv6 unique local |
| `fe80::/10` | IPv6 link-local |
| `fec0::/10` | IPv6 site-local, deprecated (RFC 3879) |
| `2002::/16` | 6to4 (RFC 3056) |
| `64:ff9b:1::/48` | local-use NAT64 (RFC 8215) |
| `ff00::/8` | IPv6 multicast |

An IPv4 address inside an IPv6 literal is checked against the same table.

`ALLOW_PRIVATE_IPS=true` disables the guard entirely. Most homelab installs need it.

The guard limits what a compromised widget can reach. It does not protect against an admin, who can already point widgets anywhere.

## Outbound requests

| Host | Why |
| --- | --- |
| `cdn.jsdelivr.net` | Icon files, and three of the four icon catalog indexes. |
| `raw.githubusercontent.com` | The dashboard-icons index and its files, when jsdelivr does not answer. |
| Unsplash | Wallpaper, only when the wallpaper source is Unsplash. The server keeps one photo for a day, and reports each new photo to Unsplash as used. |
| `api.github.com` | The update check, when Settings is opened, at most once an hour. Also two icon catalog listings, while you type in the icon picker. |

Each widget also reaches the service it reads: the address you set, or the public API of Open-Meteo, OpenWeather, NextDNS or GitHub. Nothing else leaves your network, and no usage data is collected.

Icons load through the server, which caches each one for 24 hours, so the CDN does not learn which services your dashboard shows. The browser keeps each catalog icon for a day. A catalog index is read only while you type in the icon picker, and is cached for 24 hours. A dashboard load fetches none of them. Set the wallpaper to an image or a solid color and Unsplash is never contacted.

## The container

The image runs as the unprivileged `node` account, UID 1000, with no capability. The provided Compose file drops all capabilities, sets `no-new-privileges`, and bounds memory, process count and log size. Any other account works the same way; see [Running as another account](/docs/installation/docker/#running-as-another-account).

Started as root, which the Unraid template does so the container can take ownership of the folders Unraid creates, supervisord drops the API to `node` and nginx drops its workers to `nginx`. The API, which parses untrusted input, never runs as root.

## Verifying a release image

Every released image is signed. See [Verify a release image](/docs/verify-image/).

## Reporting a problem

See [Security policy](/docs/security-policy/).
