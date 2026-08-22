---
title: Overview
description: What widgets are, how to add one, and which services each widget reads.
---

**In the admin:** Dashboard, then Add. See the [Settings reference](/docs/settings-reference/).

A widget is a small visual on the dashboard grid, for information worth a glance rather than a readout.

Each widget runs as a separate document in a sandboxed iframe and fetches only from Stackyard's own API. The server makes the outbound call.

## Add a widget

Under **Dashboard**, press <span class="sy-btn sy-btn--primary">Add</span> and pick Widget. Choose a type, then a card size, then fill in the fields that type needs.

Most types offer Small, some offer Medium or larger. Some fields change with the size, such as how many slots there is room for.

Widgets reorder in the same list as apps and folders. See [Adding services](/docs/adding-services/).

## The widgets

| Widget | Reads from |
| --- | --- |
| [Backup](/docs/widgets/backup/) | Duplicati, Kopia |
| [Books](/docs/widgets/books/) | Audiobookshelf, Komga, Kavita |
| [Clock](/docs/widgets/clock/) | Nothing. It renders in the browser. |
| [Connections](/docs/widgets/connections/) | Gluetun, Psiphon Conduit, NetBird, Plausible, Umami |
| [Custom](/docs/widgets/custom/) | Any page you point it at, in an iframe. |
| [Dashboard switch](/docs/widgets/dashboard-switch/) | Nothing. It links to other dashboards. |
| [Disk health](/docs/widgets/disk-health/) | Scrutiny, TrueNAS |
| [DNS](/docs/widgets/dns/) | AdGuard Home, Pi-hole, Technitium, NextDNS |
| [GitHub](/docs/widgets/github/) | The GitHub API |
| [Now Playing](/docs/widgets/now-playing/) | Plex, Jellyfin, Emby, Navidrome |
| [System summary](/docs/widgets/system-summary/) | This machine, Glances, Beszel, Unraid |
| [Weather](/docs/widgets/weather/) | Open-Meteo. No API key needed. |

## Credentials

A field marked Secret is stored on the server and never sent back to the browser. It shows as set without revealing its value.

Changing where a credential would be sent, by editing a URL or a non-secret field, clears the stored value and Stackyard names what to re-enter. This stops an imported config from taking a credential out of an install.

## Writing a widget

Adding a widget is a folder plus one registry entry, with no changes to the rest of the app. See [Development](/docs/development/).
