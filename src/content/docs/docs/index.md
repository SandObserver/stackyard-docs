---
title: What is Stackyard
head:
  - tag: title
    content: What is Stackyard? A self-hosted homelab dashboard
description: Stackyard is a calm, self-hosted homelab dashboard for your apps, with status badges and widgets, configured in a web UI.
---

Stackyard is a home screen for your homelab: app tiles, folders, a dock and a few widgets over your wallpaper, all set up in a web UI.

<picture>
  <source type="image/avif" srcset="/img/dashboard-720-6f55cd6b.avif 720w, /img/dashboard-1080-3ad4f1f4.avif 1080w, /img/dashboard-1440-b1cb73a0.avif 1440w, /img/dashboard-1800-228c262e.avif 1800w" sizes="(min-width: 50rem) 45rem, calc(100vw - 2rem)" />
  <source type="image/webp" srcset="/img/dashboard-720-b5e28cb9.webp 720w, /img/dashboard-1080-691b0aa8.webp 1080w, /img/dashboard-1440-467523a7.webp 1440w, /img/dashboard-1800-f6072153.webp 1800w" sizes="(min-width: 50rem) 45rem, calc(100vw - 2rem)" />
  <img src="/img/dashboard-fc57bd2d.jpg" srcset="/img/dashboard-720-559de860.jpg 720w, /img/dashboard-1080-472e2a66.jpg 1080w, /img/dashboard-1440-bd4dc5c9.jpg 1440w, /img/dashboard-fc57bd2d.jpg 1800w" sizes="(min-width: 50rem) 45rem, calc(100vw - 2rem)" width="1800" height="1125" fetchpriority="high" decoding="async" alt="The Stackyard dashboard, with widgets, app tiles, two folders and the dock." />
</picture>

Most homelab dashboards end up as a wall of widgets. Every service gets a card, every card says it is fine, and after a week you stop reading any of them.

Stackyard keeps the wall off the page. Widgets are for the few things worth a glance, like the weather or what is playing. Everything else is a plain app tile that opens in one tap, and shows a badge only when it needs you.

It runs as one container, with no database and no runtime dependencies, and installs to your phone's home screen. It does not keep history, send alerts or have user accounts. If you need those, [compare the dashboards](/docs/is-stackyard-for-you/) first.

Try the [demo](https://demo.sandobserver.com), or [install it with Docker](/docs/installation/docker/).
