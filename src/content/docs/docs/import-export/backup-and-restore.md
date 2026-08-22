---
title: Backup and restore
description: Export your Stackyard configuration to a file, and import it back.
---

**In the admin:** General, then Backup. See the [Settings reference](/docs/settings-reference/).

Stackyard's whole configuration is one JSON file. <span class="sy-btn sy-btn--ghost">Export</span> and <span class="sy-btn sy-btn--ghost">Import</span> are under **General**.

## Export

Downloads your configuration as `dashboard-apps.json`, containing apps, folders, widgets, badges, and settings. Use it as a backup, or to move an install to another machine.

:::caution
Stored secrets are never included in an export. API keys, tokens and passwords must be entered again after importing.
:::

## Import

Reads a file produced by Export. Stackyard shows how many items will be added, updated and deleted, and asks you to confirm before writing anything. A file matching your current configuration changes nothing and says so.

## What the volumes hold

The config file lives on `/data`. Uploaded icons and stored wallpapers live on `/icons`. An export covers the config only, so back up both volumes to capture uploaded files.

## A corrupt config

If the config fails to parse, or parses with the wrong shape, Stackyard copies it to `apps.json.corrupt-<timestamp>` and starts empty rather than overwriting the broken one. Each distinct breakage keeps its own backup.

If your dashboard is empty after a restart, look for an `apps.json.corrupt-*` file before making changes.

## Coming from another dashboard

To import a gethomepage or Dashy config instead, see [Migrating from another dashboard](/docs/import-export/migrating/).
