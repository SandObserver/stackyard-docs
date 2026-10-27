---
title: Add apps and folders to your dashboard
description: Add app tiles with icons by name, group them in folders, and pin them to the dock in Stackyard.
---

**In the admin:** Dashboard.

## Apps

Press <span class="sy-btn sy-btn--primary">Add</span>, choose App, and enter a name, URL, icon and colour.

A name is up to 64 characters. Keep a username and password out of the URL: anyone who can open the dashboard can read it. Stackyard shows a warning when the URL holds one.

For the icon, type the service name, such as `sonarr`. Stackyard searches [dashboard-icons](https://github.com/homarr-labs/dashboard-icons), [selfh.st](https://github.com/selfhst/icons), [simple-icons](https://github.com/simple-icons/simple-icons) and [lobehub](https://github.com/lobehub/lobe-icons). A URL or an uploaded file also works. Icons load through your server, so the icon CDN never sees your list of services.

### Tile colour

Pick the tile colour under Style.

| Style | What the tile looks like |
| --- | --- |
| Dark | A near-black tile in both display modes. |
| White | A white tile in both display modes. |
| Auto | Dark in dark mode, white in light mode. |
| Clear | Frosted glass, so the wallpaper reads through, like a folder tile. |
| Color | One of thirteen system colours, each drawn for the display mode it is shown in, or a colour you set. |

Color shows the system colours, sliders for hue, saturation and brightness, and a colour code. A colour set by code or slider is used exactly as given in both modes.

An icon that is a white shape can disappear on White, Auto in light mode, or Clear. Pick Dark or Color for those.

Drag rows in the Dashboard list to reorder the grid.

## Folders

A folder holds apps behind one tile. Press Add, choose Folder, then Add Apps. Folders do not nest, and widgets cannot go in one.

## Dock

Turn on Show in Dock on an app to pin it to the bar at the bottom. The dock holds four apps.

The Dashboard list shows docked apps in a Dock group above Home screen. Drag an app into the Dock group to dock it, or out of it to undock it. A docked app leaves its folder.

The Settings tile can go in the dock too. Press Edit on it and turn on Show in Dock. Show in Dock stays off while Show Settings on dashboard is off.
