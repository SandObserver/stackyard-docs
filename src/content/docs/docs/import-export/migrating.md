---
title: Import from Homepage or Dashy
description: Import links and folders into Stackyard from a gethomepage (Homepage) or Dashy YAML config, or from gethomepage labels on your Docker containers.
---

**In the admin:** General, then Backup.

Stackyard reads Homepage and Dashy YAML files, and Homepage labels on Docker containers. It adds apps and folders and changes nothing already there. A preview lists what will be added, changed or left out. The import is one way.

## What comes across

- Each link becomes an app. Each group or section becomes a folder. A nested group becomes a folder named `Group / Subgroup`.
- A host and port, such as `plex.lan:32400`, gets `http://`.
- An icon comes across as a [dashboard-icons](https://github.com/homarr-labs/dashboard-icons) name or a `cdn.jsdelivr.net` link.
- A Homepage `siteMonitor` or a Dashy status check becomes the health check. Certificate checking stays on unless you tick **Allow self-signed certificate** in the preview.

## What is dropped

The app still imports without:

- Widgets. A widget becomes a plain app.
- Descriptions, abbreviations, tags, colours, icon fonts, emoji and other icon links.
- A Homepage ICMP `ping`, a container on another Docker server, and a Dashy `localUrl` or extra page.
- A health-check address that is only a path or uses a variable.
- A username and password in an address.

Names over 64 characters are shortened.

## What is skipped

An entry without a name or a usable link is skipped. A link that is only a path, uses an unsafe scheme or needs a variable is not usable.

A file with more than 5,000 entries, or with YAML merge keys (`<<`) that expand too far, is refused.

## From Docker labels

**Import from Docker labels** reads every container, stopped ones included. It needs **Health Checks** on and a **Docker Socket URL** with read access to containers, such as `CONTAINERS=1` on docker-socket-proxy.

- A container needs `homepage.name` and `homepage.group`. The group becomes a folder.
- Apps sort by `homepage.weight`, then name. Folders sort by name.
- `homepage.href`, `homepage.icon` and `homepage.siteMonitor` are read. Each app gets a health check on its container.
- Widget labels and instance labels, such as `homepage.instance.internal.href`, are not read.

The 5,000 limit applies to containers too.
