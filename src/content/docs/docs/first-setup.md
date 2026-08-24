---
title: First setup
description: Open the admin UI, set a password, and learn what the four sections do.
---

Open `http://localhost:8700/admin`. The Settings icon on the dashboard goes to the same place.

## Set a password first

In **General**, turn on Password Protection. The minimum length is 8 characters.

:::caution
Until a password is set, the endpoint that sets one accepts the first caller with no authentication. On a shared network, the first person to reach a fresh install can claim the account.
:::

The password is a gate between local users, not an authentication layer. See [Security](/docs/security/).

## The four sections

| Section | What it covers |
| --- | --- |
| **General** | Server identity and behaviour: title, host IP, language, logging, password, Docker health checks, and config [import and export](/docs/import-export/backup-and-restore/). |
| **Appearance** | How the dashboard looks: wallpaper, labels, and theme. See [Customization](/docs/customization/). |
| **Dashboard** | What is on the dashboard: apps, widgets, folders, and their order. See [Adding services](/docs/adding-services/). |
| **About** | Version, update notice, and links to the project. |

Each section saves on its own with <span class="sy-btn sy-btn--primary">Save</span>.

Set **Host IP** if your services run on the same machine as Stackyard. Badge and widget URLs can then point at that address.

## Next

Add your services in [Adding services](/docs/adding-services/).
