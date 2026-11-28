---
title: What is Stackyard
head:
  - tag: title
    content: What is Stackyard? A self-hosted homelab dashboard
description: Stackyard is a calm, self-hosted homelab dashboard for your apps, with status badges and widgets, configured in a web UI.
---

Stackyard is a home screen for your homelab: app tiles, folders, a dock and a few widgets over your wallpaper, all set up in a web UI.

<picture>
  <source type="image/avif" srcset="/img/dashboard-720-022ec688.avif 720w, /img/dashboard-1080-6c7c5b0c.avif 1080w, /img/dashboard-1440-cbb2981f.avif 1440w, /img/dashboard-1800-d9a8ea76.avif 1800w" sizes="(min-width: 50rem) 45rem, calc(100vw - 2rem)" />
  <source type="image/webp" srcset="/img/dashboard-720-345eb2b5.webp 720w, /img/dashboard-1080-b2ac105f.webp 1080w, /img/dashboard-1440-dfa08f1a.webp 1440w, /img/dashboard-1800-7d93b406.webp 1800w" sizes="(min-width: 50rem) 45rem, calc(100vw - 2rem)" />
  <img src="/img/dashboard-1800-93732cfe.jpg" srcset="/img/dashboard-720-64d0423d.jpg 720w, /img/dashboard-1080-362152c3.jpg 1080w, /img/dashboard-1440-c10bd249.jpg 1440w, /img/dashboard-1800-93732cfe.jpg 1800w" sizes="(min-width: 50rem) 45rem, calc(100vw - 2rem)" width="1800" height="1200" fetchpriority="high" decoding="async" alt="The Stackyard dashboard, with widgets, app tiles, two folders and the dock." />
</picture>

Most homelab dashboards end up as a wall of widgets. Every service gets a card, every card says it is fine, and after a week you stop reading any of them.

Stackyard keeps the wall off the page. Widgets are for the few things worth a glance, like the weather or what is playing. Everything else is a plain app tile that opens in one tap, and shows a badge only when it needs you.

It runs as one container, with no database and no runtime dependencies, and installs to your phone's home screen. It does not keep history, send alerts or have user accounts. If you need those, [compare the dashboards](/docs/is-stackyard-for-you/) first.

Try the [demo](https://demo.sandobserver.com), or [install it with Docker](/docs/installation/docker/).
