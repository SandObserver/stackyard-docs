---
title: Import from Homepage or Dashy
description: Import links and folders into Stackyard from a gethomepage (Homepage) or Dashy YAML config.
---

**In the admin:** General, then Backup. See the [Settings reference](/docs/settings-reference/).

Stackyard reads gethomepage and Dashy configuration files, so you do not have to retype every link. Find it under **General**, Import from another dashboard.

## What comes across

Links and folders. An app in the source becomes an app tile, and a group or section becomes a folder.

A link written as a host and port, such as `plex.lan:32400`, is imported with `http://` in front.

Icons come across when they are a [dashboard-icons](https://github.com/homarr-labs/dashboard-icons) name or an icon link on `cdn.jsdelivr.net`.

A Homepage `siteMonitor` or a Dashy status check becomes the app's health check. A Dashy check that allows insecure certificates is imported with certificate checking on, unless you tick **Allow self-signed certificate** in the import preview.

:::note
This is one way. It does not keep the two in sync, and it writes nothing back.
:::

## What does not

A widget in the source becomes a plain app tile, never a Stackyard widget. The two projects model widgets differently, so there is nothing to translate.

Descriptions, abbreviations, tags, and per-item colours are dropped. Icon fonts, emoji, other icon links and paths into the other dashboard's files are dropped too. See [Apps and folders](/docs/apps-and-folders/).

A health-check address that is only a path, or that the other dashboard resolves from its own environment, is dropped. The app imports without that check.

## What is skipped

An entry is skipped when it has no label, has no link, or its link is not safe to follow. Relative links are skipped, because they have no meaning outside the dashboard that wrote them, as are values the other dashboard resolves from its own environment.

A file with more than 5,000 entries is refused, and nothing is imported. So is a file whose YAML merge keys (`<<`) expand too far.

Stackyard reports how many apps and folders were imported, and lists what it could not import and why.

## After importing

Set up badges and widgets in Stackyard. See [Badges](/docs/badges/) and [Widgets](/docs/widgets/).
