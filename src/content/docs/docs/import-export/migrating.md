---
title: Migrating from another dashboard
description: Import links and folders from a gethomepage or Dashy YAML config.
---

**In the admin:** General, then Backup. See the [Settings reference](/docs/settings-reference/).

Stackyard reads gethomepage and Dashy configuration files, so you do not have to retype every link. Find it under **General**, Import from another dashboard.

## What comes across

Links and folders. An app in the source becomes an app tile, and a group or section becomes a folder.

:::note
This is one way. It does not keep the two in sync, and it writes nothing back.
:::

## What does not

A widget in the source becomes a plain app tile, never a Stackyard widget. The two projects model widgets differently, so there is nothing to translate.

Descriptions, abbreviations, tags, and per-item colours are dropped. Icons are not carried over either, because Stackyard resolves icons by name. See [Adding services](/docs/adding-services/).

## What is skipped

An entry is skipped when it has no label, has no link, or its link is not safe to follow. Relative links are skipped, because they have no meaning outside the dashboard that wrote them, as are values the other dashboard resolves from its own environment.

Stackyard reports how many apps and folders were imported, and lists what it could not import and why.

## After importing

Set up badges and widgets in Stackyard. See [Badges](/docs/badges/) and [Widgets](/docs/widgets/).
