---
title: Install Stackyard on TrueNAS
description: Install Stackyard on TrueNAS from the Apps catalog.
next:
  link: /docs/first-setup/
  label: First setup
---

Install Stackyard from the [TrueNAS Apps catalog](https://apps.truenas.com/catalog/stackyard_community/). It is in the community train.

Open Apps, select Discover Apps, search for Stackyard, then select Install. The default WebUI port is 30245.

The form has two storage entries: Data Storage for the config and Icons Storage for uploaded icons. Each is an ixVolume by default. Set a host path to keep the files in a dataset of your own.

The app runs as user and group 568, the `apps` account. Any other non-root user works. See [Security](/docs/security/#the-container).

Allow Private IPs is on by default. Other settings go under Additional Environment Variables. Each is described under [Environment variables](/docs/installation/docker/#environment-variables).

## After installing

Select Web UI on the app's page, then work through [First setup](/docs/first-setup/).

Stackyard can read system stats and disk health from the TrueNAS API. See [System summary](/docs/widgets/system-summary/) and [Disk health](/docs/widgets/disk-health/).
