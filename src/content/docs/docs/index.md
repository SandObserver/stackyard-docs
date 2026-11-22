---
title: What is Stackyard
head:
  - tag: title
    content: What is Stackyard? A self-hosted homelab dashboard
description: Stackyard is a calm, self-hosted homelab dashboard for your apps, with status badges and widgets, configured in a web UI.
---

Stackyard is a home screen for your homelab: app tiles, folders, a dock and a few widgets over your wallpaper, all set up in a web UI.

<picture>
  <source type="image/avif" srcset="/img/dashboard-720-8d6c188b.avif 720w, /img/dashboard-1080-51c76c3f.avif 1080w, /img/dashboard-1440-81639d2d.avif 1440w, /img/dashboard-1800-8680886c.avif 1800w" sizes="(min-width: 50rem) 45rem, calc(100vw - 2rem)" />
  <source type="image/webp" srcset="/img/dashboard-720-3babc149.webp 720w, /img/dashboard-1080-cbe01aee.webp 1080w, /img/dashboard-1440-5383e39e.webp 1440w, /img/dashboard-1800-dea657fa.webp 1800w" sizes="(min-width: 50rem) 45rem, calc(100vw - 2rem)" />
  <img src="/img/dashboard-1800-8418e6f9.jpg" srcset="/img/dashboard-720-3f0c41cc.jpg 720w, /img/dashboard-1080-95384d17.jpg 1080w, /img/dashboard-1440-b0271be7.jpg 1440w, /img/dashboard-1800-8418e6f9.jpg 1800w" sizes="(min-width: 50rem) 45rem, calc(100vw - 2rem)" width="1800" height="1200" fetchpriority="high" decoding="async" alt="The Stackyard dashboard, with widgets, app tiles, two folders and the dock." />
</picture>

Most homelab dashboards end up as a wall of widgets. Every service gets a card, every card says it is fine, and after a week you stop reading any of them.

Stackyard keeps the wall off the page. Widgets are for the few things worth a glance, like the weather or what is playing. Everything else is a plain app tile that opens in one tap, and shows a badge only when it needs you.

It runs as one container, with no database and no runtime dependencies, and installs to your phone's home screen. It does not keep history, send alerts or have user accounts. If you need those, [compare the dashboards](/docs/is-stackyard-for-you/) first.

Try the [demo](https://demo.sandobserver.com), or [install it with Docker](/docs/installation/docker/).
