---
title: Add apps and folders to your dashboard
description: Add app tiles with icons by name, group them in folders, and pin them to the dock in Stackyard.
---

**In Settings:** Dashboard.

## Apps

1. Press <span class="sy-btn sy-btn--primary">Add</span> and choose **App**.
2. Enter a name, URL, icon and color.
3. Press <span class="sy-btn sy-btn--primary">Save</span>.

A name is up to 64 characters. Keep a username and password out of the URL: anyone who can open the dashboard can read it. Stackyard shows a warning when the URL holds one.

For the icon, type the service name, such as `sonarr`. Stackyard searches [dashboard-icons](https://github.com/homarr-labs/dashboard-icons), [selfh.st](https://github.com/selfhst/icons), [simple-icons](https://github.com/simple-icons/simple-icons) and [lobehub](https://github.com/lobehub/lobe-icons). A URL or an uploaded file also works. Icons load through your server, so the icon CDN never sees your list of services.

### Tile color

Pick the tile color under **Style**.

| Style | What the tile looks like |
| --- | --- |
| Dark | A near-black tile in both display modes. |
| White | A white tile in both display modes. |
| Auto | Dark in dark mode, white in light mode. |
| Clear | Frosted glass, so the wallpaper reads through, like a folder tile. |
| Color | One of thirteen system colors, each drawn for the display mode it is shown in, or a color you set. |

**Color** shows the system colors, sliders for hue, saturation and brightness, and a color code. A color set by code or slider is used exactly as given in both modes.

An icon that is a white shape can disappear on White, Auto in light mode, or Clear. Pick Dark or Color for those.

Drag rows in the Dashboard list to reorder the grid, or use the up and down arrow keys on a focused row. **Reorder** shows Move Up and Move Down buttons on each row. Press **Done** when finished.

## Folders

A folder holds apps behind one tile. Folders do not nest, and widgets cannot go in one.

1. Press <span class="sy-btn sy-btn--primary">Add</span> and choose **Folder**.
2. Press **Add Apps** and pick the apps.
3. Press <span class="sy-btn sy-btn--primary">Save</span>.

## Dock

Turn on **Show in Dock** on an app to pin it to the bar at the bottom. The dock holds four apps.

The Dashboard list shows docked apps in a Dock group above **Home Screen**. Drag an app into the Dock group to dock it, or out of it to undock it. A docked app leaves its folder.

The Settings tile can go in the dock too:

1. Press **Edit** on the Settings tile.
2. Turn on **Show in Dock**.

**Show in Dock** stays off while **Show Settings on dashboard** is off.
