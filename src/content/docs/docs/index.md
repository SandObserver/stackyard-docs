---
title: What is Stackyard
head:
  - tag: title
    content: What is Stackyard? A self-hosted homelab dashboard
description: Stackyard is a calm, self-hosted homelab dashboard for your apps, with status badges and widgets, configured in a web UI.
---

Stackyard is a home screen for your homelab: app tiles, folders, a dock and a few widgets over your wallpaper, all set up in a web UI.

<picture>
  <source type="image/avif" srcset="/img/dashboard-720-4ed5f554.avif 720w, /img/dashboard-1080-666025e2.avif 1080w, /img/dashboard-1440-91cfcc41.avif 1440w, /img/dashboard-1800-57fc34f8.avif 1800w" sizes="(min-width: 50rem) 45rem, calc(100vw - 2rem)" />
  <source type="image/webp" srcset="/img/dashboard-720-d6409f52.webp 720w, /img/dashboard-1080-2aa1e541.webp 1080w, /img/dashboard-1440-fba8e231.webp 1440w, /img/dashboard-1800-799957b1.webp 1800w" sizes="(min-width: 50rem) 45rem, calc(100vw - 2rem)" />
  <img src="/img/dashboard-1048c3eb.jpg" srcset="/img/dashboard-720-f1fc6dbb.jpg 720w, /img/dashboard-1080-76cef4d7.jpg 1080w, /img/dashboard-1440-0f81a683.jpg 1440w, /img/dashboard-1048c3eb.jpg 1800w" sizes="(min-width: 50rem) 45rem, calc(100vw - 2rem)" width="1800" height="1125" fetchpriority="high" decoding="async" alt="The Stackyard dashboard, with widgets, app tiles, two folders and the dock." />
</picture>

Most homelab dashboards end up as a wall of widgets. Every service gets a card, every card says it is fine, and after a week you stop reading any of them.

Stackyard keeps the wall off the page. Widgets are for the few things worth a glance, like the weather or what is playing. Everything else is a plain app tile that opens in one tap, and shows a badge only when it needs you.

It runs as one container, with no database and no runtime dependencies, and installs to your phone's home screen. It does not keep history, send alerts or have user accounts. If you need those, [compare the dashboards](/docs/is-stackyard-for-you/) first.

Try the [demo](https://demo.sandobserver.com), or [install it with Docker](/docs/installation/docker/).
