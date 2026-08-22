---
title: Customization
description: Wallpaper, themes, app titles, language, and running Stackyard from a phone home screen.
---

**In the admin:** Appearance. See the [Settings reference](/docs/settings-reference/).

Set in the admin UI under **Appearance**. Everything applies immediately.

Turning titles off gives a denser grid of icons alone.

Settings Display Mode affects the Settings pages only. The dashboard stays dark: no stylesheet declares a `prefers-color-scheme` rule, so it does not follow the operating system.

Increased contrast and reduced motion are honoured. Reduced transparency drops the blur behind cards and keeps the motion.

:::caution
Browsers only allow Keep Screen Awake over HTTPS. On a plain HTTP address the toggle has no effect. See [Troubleshooting](/docs/troubleshooting/).
:::


<figure class="sy-shot">
  <img class="sy-shot__light" src="/img/admin/appearance.png" alt="The Appearance section of the admin UI" loading="lazy"><img class="sy-shot__dark" src="/img/admin/appearance-dark.png" alt="The Appearance section of the admin UI" loading="lazy">
  <figcaption>Appearance, in the admin UI.</figcaption>
</figure>

## Wallpaper

| Source | What it does |
| --- | --- |
| Image | Upload a file, or paste a link that is downloaded once. |
| Solid color | A single colour behind the grid. |
| Unsplash | A random image, or one from a collection. Needs an Unsplash API key. |

Brightness dims the wallpaper so tiles and labels stay readable. Fit chooses Fill or Fit.

Uploaded and linked images are stored on your own server and served from it. Choosing Image or Solid color means Unsplash is never contacted. See [Security](/docs/security/).

### Getting an Unsplash key

Unsplash needs a free developer account. The key is a plain string you paste into **Appearance**, **Wallpaper**, **API Key**.

1. Sign in at [unsplash.com/developers](https://unsplash.com/developers).
2. Choose **Your apps**, then **New Application**. Accept the API terms.
3. Give it any name and description. A demo application is enough for personal use.
4. Open the application and copy the **Access Key**.

Paste the Access Key, not the Secret Key. Stackyard only reads public photos and never needs the secret.

A demo application is rate limited to 50 requests per hour. Stackyard asks for one image at a time, so that is ample.

### Finding a Collection ID

Leave **Collection ID** blank for a random photo from all of Unsplash. Set it to pull only from one collection.

The ID is the number in the collection's own URL:

```
https://unsplash.com/collections/2203755/mountains
                                 ^^^^^^^
```

That collection's ID is `2203755`. Paste only the number.

## Language

Six languages ship: English, Persian, Simplified Chinese, Spanish, German, and French. Change it in General.

Persian is right to left. The whole layout flips, not only the text.

## On a phone

Stackyard has a real mobile layout, not a shrunken desktop one. The grid re-flows, the search bar moves within thumb reach, and the settings sidebar becomes a tab bar.

Add it to your home screen and it opens in its own window, without browser chrome.

:::note
There is no offline mode, by design. Every tile is live, so a cached copy would show stale badges and widget data.
:::
