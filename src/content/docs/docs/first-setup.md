---
title: First setup after installing Stackyard
description: Set a password, add your first app and widget, and find where each setting lives.
prev: false
next:
  link: /docs/apps-and-folders/
  label: Add apps and folders
---

Follow these steps in order. They end with a protected dashboard that holds one app and one widget.

## Open Settings

Open `http://<host>:8700/admin` in a browser. Use the port you mapped if it is not 8700. On TrueNAS the default is 30245.

A dashboard with nothing on it shows a welcome screen. Its **Open settings** button also goes to Settings. The link under it imports a [backup](/docs/import-export/backup-and-restore/) or [another dashboard's config](/docs/import-export/migrating/).

## Set a password

:::caution
Until a password is set, the endpoint that sets one accepts the first caller with no authentication. On a shared network, the first person to reach a fresh install can claim the account. To close this gap, set `INITIAL_PASSWORD` before the first start. See [Environment variables](/docs/installation/docker/#environment-variables).
:::

1. In **General**, turn on **Password Protection**.
2. Enter a password of 15 to 1024 characters in **Password** and **Confirm Password**. Common passwords are refused.
3. Press <span class="sy-btn sy-btn--primary">Save</span>.

The password is a gate between local users, not an authentication layer. See [Security](/docs/security/).

## Add your first app

1. In **Dashboard**, press <span class="sy-btn sy-btn--primary">Add</span> and choose App.
2. Enter a name and the app's URL.
3. For the icon, type the service name, such as `sonarr`.
4. Press <span class="sy-btn sy-btn--primary">Save</span>.

## Add your first widget

The Clock widget needs no service, so it works straight away.

1. In **Dashboard**, press <span class="sy-btn sy-btn--primary">Add</span> and choose Widget.
2. Choose Clock, then a card size.
3. Press <span class="sy-btn sy-btn--primary">Save</span>.

Open the dashboard. The app and the clock are on the grid.

## Where settings live

| Section | What it covers |
| --- | --- |
| **General** | Server identity and behaviour: title, host IP, language, logging, password, health checks, and config [import and export](/docs/import-export/backup-and-restore/). |
| **Appearance** | How the dashboard looks: wallpaper, labels, and theme. See [Wallpaper and themes](/docs/customization/). |
| **Dashboard** | What is on the dashboard: apps, widgets, folders, and their order. See [Apps and folders](/docs/apps-and-folders/). |
| **About** | Version, update notice, and links to the project. |

Each section saves on its own with <span class="sy-btn sy-btn--primary">Save</span>.

Set **Host IP** in **General** if your services run on the same machine as Stackyard. Badge and widget URLs can then point at that address.
