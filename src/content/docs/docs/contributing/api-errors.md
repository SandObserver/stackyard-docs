---
title: Stackyard API error reference
description: The error shape the Stackyard API returns and what each error kind means.
---

Every API error has a readable `error`, a `kind` to branch on, and sometimes a `detail`.

```json
{ "error": "Could not reach the service.", "kind": "network", "detail": { "code": "ECONNREFUSED" } }
```

Never match words in `error`. Use `kind`.

The `error` text is written from the `kind`, never copied from the underlying error, so no internal host or path reaches the browser. The original is logged.

## Kinds

| Kind | Meaning |
| --- | --- |
| `network` | The target could not be reached. |
| `timeout` | The target was too slow. |
| `blocked` | Stackyard refused the request, by its guard or rate limit. |
| `auth` | The Stackyard session or password. Never an upstream key. |
| `upstream` | The target answered with an error. `detail.status` holds it. |
| `invalid` | A malformed request, or a missing item. |
| `internal` | Anything else. |

An upstream 401 or 403 is `upstream`, not `auth`. Treat an unknown `kind` as `internal`.

## detail

Only these keys, only server-derived values, and omitted when empty.

| Kind | Key |
| --- | --- |
| `network`, `timeout` | `code`, a Node error code |
| `upstream` | `status`, the HTTP status |
| `invalid` | `code`, such as `ERR_INVALID_URL` |
| `blocked` | `reason`, `private-address` |

A new kind goes in `KIND` in both `api/src/api-error.js` and `ui/js/admin-error.js`. A test fails until they match.
