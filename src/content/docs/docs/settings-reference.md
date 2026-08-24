---
title: Settings reference
description: Every setting in the admin, in the order you meet it, with a link to the page that explains it.
---

The admin has four sections down the left. This page follows them in order, using the same group headings you see on screen, so you can find a setting here by remembering where it sits in the app.

Open the admin from the Settings icon on the dashboard.

## General

Everything about the server itself.

At the top, before any group:

| Setting | What it does |
| --- | --- |
| Title | The name of this Stackyard instance. |
| Description | Free text shown alongside the title. |
| Host IP | Your server's own address. Setting it lets badges and widgets reach services on that IP, which the SSRF guard would otherwise block. See [Security](/docs/security/). |

### Language

| Setting | What it does |
| --- | --- |
| Language | The interface language. English, Persian, Simplified Chinese, Spanish, German or French. Persian flips the whole layout to right to left. See [Customization](/docs/customization/#language). |

### Monitoring

| Setting | What it does |
| --- | --- |
| Logging Level | How much detail goes to the container log. Errors shows warnings and errors. Security events are always logged. See [Support](/docs/support/#reading-the-logs). |
| Docker Container Health Checks | Turns on container status for apps. Needs a socket proxy address below. See [Badges](/docs/badges/). |
| Hide Healthy Badge | Shows the health dot only when something is wrong. |
| Socket URL | Where your Docker socket proxy is. Never the Docker socket itself. See [Advanced configuration](/docs/advanced-configuration/). |

If every app suddenly shows as unhealthy, the socket proxy address is the usual cause. See [Troubleshooting](/docs/troubleshooting/#every-app-with-a-container-shows-as-unhealthy-at-once).

### Security

| Setting | What it does |
| --- | --- |
| Password Protection | Sets or changes the dashboard password. Minimum 8 characters. Leave blank to keep the existing one. |
| Sign out all devices | Ends every session everywhere, including the one you are using. Use it if you think a session may be compromised. |

Locked out? See [password recovery](/docs/troubleshooting/#i-forgot-the-password-and-i-am-locked-out).

### Backup

| Setting | What it does |
| --- | --- |
| Import / Export | Downloads your whole config as one file, or restores it. See [Backup and restore](/docs/import-export/backup-and-restore/). |
| Import from another dashboard | Reads gethomepage and Dashy files. Apps and folders are added. See [Migrating](/docs/import-export/migrating/). |

## Appearance

How the dashboard looks. Every change applies immediately. Explained in full on [Customization](/docs/customization/).

### App Title

| Setting | What it does |
| --- | --- |
| App Title | The title drawn on the dashboard itself. |
| Show On Desktop | Whether that title appears on a large screen. |
| Show On Mobile | Whether it appears on a phone. |

### Display

| Setting | What it does |
| --- | --- |
| Keep Screen Awake | Stops the screen dimming while the dashboard is open. Browsers only allow this over HTTPS. |
| Settings Display Mode | Light, dark or system, for these settings pages only. Stored in this browser, so it does not follow you to another device. |

### Wallpaper

| Setting | What it does |
| --- | --- |
| Source | Unsplash, an image, or a solid colour. |
| API Key | Unsplash only. See [Getting an Unsplash key](/docs/customization/#getting-an-unsplash-key). |
| Collection ID | Unsplash only. Leave blank for a random photo. See [Finding a Collection ID](/docs/customization/#finding-a-collection-id). |
| Image | Upload a file, or link one by URL. Both are stored on your own server. |
| Fit | Fill crops to cover the screen. Fit shows the whole image. |
| Color | A solid background colour, as `#rrggbb` or a CSS colour name. |
| Brightness | Dims the wallpaper so tiles and labels stay readable. |

Choosing Image or Solid color means Unsplash is never contacted.

## Dashboard

The contents of your dashboard, and the only place you add things.

Search narrows the list. The **All**, **Apps**, **Widgets** and **Folders** filters limit it by kind. Drag the handle on a row to reorder.

| To do this | See |
| --- | --- |
| Add an app, a folder, or another dashboard page | [Adding services](/docs/adding-services/) |
| Put a live value or a health dot on an app | [Badges](/docs/badges/) |
| Add a widget and fill in its fields | [Widgets](/docs/widgets/) |

## About

Version, an update notice when one is available, and links to the documentation, the source, issue reporting and support.

Check the version here before filing a bug. See [Support](/docs/support/#filing-a-bug-report).
