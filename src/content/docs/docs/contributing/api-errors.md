---
title: Stackyard API error reference
description: The error shape the Stackyard API returns and what each error kind means.
---

Every API error has a readable `error`, a `kind` and a `code` to branch on, and sometimes a `detail`.

```json
{ "error": "every item needs a non-empty id and type", "kind": "invalid", "code": "invalid.missing-id" }
```

Never match words in `error`. Use `code`, or `kind` for a code you do not know. Every code and its meaning is on [Config reference](/docs/contributing/config-reference/#error-codes).

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

Server-derived values only, and omitted when empty.

| Key | Holds |
| --- | --- |
| `id` | The refused item or setting. |
| `field` | The refused field of that item. |
| `max` | The limit that was passed. |
| `status` | The upstream HTTP status. |
| `code` | A Node error code. |
| `minutes` | How long to wait before trying again. |
| `host` | The address the refusal is about. |

A new kind goes in `KIND` in both `api/src/api-error.js` and `ui/js/admin-error.js`. A test fails until they match.
