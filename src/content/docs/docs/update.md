---
title: Update Stackyard
description: Update Stackyard to a new release with Docker Compose, docker run, Unraid or TrueNAS.
prev: false
---

**In Settings:** About shows the installed version and an update notice.

The UI ships inside the image. An update replaces the container and keeps the `/data` and `/icons` volumes.

Back up both volumes first. See [What the volumes hold](/docs/import-export/backup-and-restore/#what-the-volumes-hold). Read the [Changelog](/docs/changelog/) for changes that need action.

## Docker Compose

Run these in the folder that holds your Compose file:

```sh
docker compose pull
docker compose up -d
```

## docker run

Pull the image, then remove the container and start it again with your original options:

```sh
docker pull ghcr.io/sandobserver/stackyard:latest
docker stop stackyard
docker rm stackyard
docker run -d --name stackyard --restart unless-stopped \
  -p 8700:80 -v stackyard_data:/data -v stackyard_icons:/icons \
  ghcr.io/sandobserver/stackyard:latest
```

Removing the container does not remove named volumes.

## Unraid

1. Open the **Docker** tab.
2. Select the update notice on the Stackyard container.
3. Select **Apply Update**.

## TrueNAS

1. Open **Apps**.
2. Select Stackyard.
3. Select **Update**.

## After updating

Reload the dashboard. If the UI has not changed, see [Troubleshooting](/docs/troubleshooting/#ui-looks-the-same-after-an-update).
