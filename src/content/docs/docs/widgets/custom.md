---
title: Custom
description: Embed any web page on the dashboard as a widget.
---

Puts a URL of your choice on the grid, in an iframe. Use it for a service's own
status page, a Grafana panel, or anything else that renders in a frame.

Sizes: Small, Medium, Large, X-Large.

## Configuration

| Field | What it does | Required |
| --- | --- | --- |
| Name | The label in the admin list. | Yes |
| Size | How many grid cells the card takes. | Yes |
| Iframe URL | The page to embed. | Yes |

## Advanced

These map to the iframe's own attributes. Leave them alone unless the embedded
page needs them.

| Field | What it does |
| --- | --- |
| Referrer Policy | Which referrer the frame sends. Defaults to the browser's own behaviour. |
| Allow (feature policy) | The frame's `allow` attribute, for example `autoplay; fullscreen`. |
| Allow Fullscreen | Lets the embedded page go fullscreen. On by default. |
| Refresh Interval | Reloads the frame on a timer, in milliseconds. Minimum 250. |

:::caution
A custom widget loads whatever the URL returns, straight into your dashboard.
Point it only at pages you trust. Unlike the built-in widgets, the request goes
from your browser to that page, so it is not proxied or sanitized by Stackyard,
and the page can see it is being framed.
:::

## Notes

A page that refuses to be framed will not render. Many sites set
`X-Frame-Options` or a `frame-ancestors` policy that blocks embedding, and there
is nothing Stackyard can do about that from its side. Check the browser console
if a frame stays blank.

There is no preview of this widget here, because what it shows is entirely the
page you point it at.
