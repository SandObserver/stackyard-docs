---
title: Adding services
description: Add app tiles, group them into folders, put them in the dock, and reorder the grid.
---

**In the admin:** Dashboard. See the [Settings reference](/docs/settings-reference/).

Apps are added under **Dashboard** in the admin UI. Nothing here edits a file by hand.

## Add an app

Press <span class="sy-btn sy-btn--primary">Add</span>, then fill in the app.

<figure class="sy-shot">
  <img class="sy-shot__light" src="/img/admin/app-edit-basics.png" alt="The app edit form, showing Name, URL, Icon and Color" loading="lazy"><img class="sy-shot__dark" src="/img/admin/app-edit-basics-dark.png" alt="The app edit form, showing Name, URL, Icon and Color" loading="lazy">
  <figcaption>Name, URL, icon and tile colour. Icon takes a name, a URL, or an upload.</figcaption>
</figure>

## Icons

Type a name and Stackyard resolves it from the community [dashboard-icons](https://github.com/homarr-labs/dashboard-icons) set. Typing `sonarr` finds the Sonarr icon. You can also paste a full URL or upload a file. Uploads are stored in `./icons` and served from your own server.

Icons load through the server, which fetches each one once, sanitizes SVGs, and caches it for 24 hours. The CDN does not learn which services your dashboard shows.

If no icon resolves, the tile shows the first letter of the name.

Color takes a swatch or a hex value. `Dark` and `Light` are fixed tile colours, not theme-aware: the dashboard is always dark, so a tile keeps the colour you set.

## The dock

The dock is the row of icons pinned at the bottom of the dashboard. Turn on Show in Dock on an app to put it there.

It holds four apps. Once full, the toggle refuses more until you remove one. Widgets cannot go in the dock.

## Folders

A folder groups apps behind one tile, whose artwork is a grid of the icons inside it.

Create one from <span class="sy-btn sy-btn--primary">Add</span>, name it, then use Add Apps to choose the contents. Folders cannot be nested, and a widget cannot go in a folder.

## Reordering

The Dashboard list holds everything on the grid in one flat list. List order is grid order. Drag a row's handle, or use the arrows on the row, and the new order is saved straight away. There is nothing to confirm.

<figure class="sy-shot">
  <img class="sy-shot__light" src="/img/admin/dashboard-list.png" alt="The Dashboard list, with drag handles, move arrows and an Edit button on each row" loading="lazy"><img class="sy-shot__dark" src="/img/admin/dashboard-list-dark.png" alt="The Dashboard list, with drag handles, move arrows and an Edit button on each row" loading="lazy">
  <figcaption>Each row carries a drag handle, the move arrows, and Edit.</figcaption>
</figure>

Rows are tagged with what is configured on them.

<figure class="sy-shot">
  <img class="sy-shot__light" src="/img/admin/dashboard-apps.png" alt="The list filtered to apps, showing Dock and Badge tags" loading="lazy"><img class="sy-shot__dark" src="/img/admin/dashboard-apps-dark.png" alt="The list filtered to apps, showing Dock and Badge tags" loading="lazy">
  <figcaption>Filtered to apps. The move arrows are hidden while a filter is on, so reordering is disabled until you clear it.</figcaption>
</figure>

## Next

Add context to a tile with [Badges](/docs/badges/), or add a [Widget](/docs/widgets/).
