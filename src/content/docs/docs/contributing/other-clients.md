---
title: Build another client
description: How an app or script signs in to Stackyard and reads the dashboard. Unstable, with no compatibility promise.
---

The API serves the dashboard and the admin. It has no version and can change in any release. Read the version first, and refuse one you have not tested.

## Sign in

1. `GET /api/auth/check`. If `enabled` is `false`, sign-in is off and no cookie is needed.
2. `POST /api/auth/login` with `{"password": "..."}`.
3. Keep the `ds` cookie from the response. Send it on every request.

While no password is set, Stackyard answers only local addresses and the names in **Allowed Addresses**. Any other `Host` gets a `403`.

A session ends after 12 hours unused, or 30 days after sign-in. `SESSION_MAX_AGE_DAYS` changes the first. A `401` with `"kind": "auth"` means sign in again.

## Origin header

Every `POST`, sign-in included, needs an `Origin` header with the same host as the `Host` header. Without it, the request gets a `403`.

```
Origin: http://stackyard.lan:8700
```

## Read the dashboard

| Request | Returns |
| --- | --- |
| `GET /api/version` | `current`, the installed version. |
| `GET /api/config` | The layout: `items` and `settings`. Stored secrets are removed. |

`_rev` in the config changes on every save. Poll `/api/config` and redraw when it changes. The dashboard polls every 15 seconds. Do not poll faster.

## Widgets

Show a widget by loading its page in a web view:

```
/widgets/<widgetType>/<page>?id=<item id>&size=<widgetSize>
```

`<page>` is `index.html`, unless the widget's entry in `GET /api/widgets` has `views`. Then it is the `src` of the view that the item's `widgetConfig[viewField]` names, or of `defaultView` when that is unset.

The page fetches its own data with the session cookie. The data each widget returns is private to its page and changes without notice.

## Errors

See [API errors](/docs/contributing/api-errors/).
