---
title: Widget data reference
description: The data.js contract for a Stackyard widget. The ctx object, fetching upstream, option endpoints, reporting failures and demo mode.
---

`data.js` runs on the server, in Node, as CommonJS. It exports one async function that takes `ctx`. The saved config is on `ctx.config`.

```js
module.exports = async function (ctx) {
  const { url, apiKey } = ctx.config;
  const r = await ctx.fetchJSON(`${url}/api/items`, {
    headers: { 'X-Api-Key': apiKey },
    timeout: 8000,
  });
  return { items: r.data.slice(0, 10) };
};
```

The return value is served as-is at `/api/widget-data/<id>`.

A widget that renders entirely in the browser, like [Clock](/docs/widgets/clock/) or [Dashboard switch](/docs/widgets/dashboard-switch/), ships no `data.js`.

## ctx

| Property | What it is |
| --- | --- |
| `ctx.config` | The saved widget config, secrets included. Server-side only. |
| `ctx.settings` | A frozen copy of the dashboard settings shared with widgets. An allowlist, currently `stats` only. Everything else is withheld. To share another key, add it to `SHARED_KEYS` in `api/src/widget-settings.js`. |
| `ctx.endpoint` | The endpoint name, set for an `optionsFrom` fetch or a multi-view widget. |
| `ctx.row` | For an `optionsFrom` fetch from a field in a `group`, that row's values. Otherwise `null`. |
| `ctx.params` | Extra query parameters, as `URLSearchParams`. |
| `ctx.fetchJSON(url, opts)` | Fetches a URL and parses the body. Returns `{ status, data }` or throws. JSON is returned as-is. Prometheus text and XML are parsed. Pass `{ raw: true }` for the untouched text. |
| `ctx.parsePrometheus(text)` | Parses a Prometheus metrics body. Non-string input gives an empty object. |
| `ctx.normalizeBase(raw)` | Tidies a user-entered base URL: adds a scheme, drops a trailing slash. |
| `ctx.metrics` | Host metrics: `cpuSample`, `ramPercent`, `cpuTemp`, `diskStats`, `procCount`, `uptimeSeconds`. Each is a function. `cpuSample()` is async and returns `{ cpu, iowait }`. They read `/proc` and `/sys`, so they report the host, not the container limits. |
| `ctx.dispatchProvider(handlers, opts)` | Runs the handler for the provider the user picked. `opts.field` holds the key, `provider` by default. `opts.default` is the fallback key. |
| `ctx.fail(message, opts)` | Reports a failure. Throws. `opts.kind` is one of `ctx.KIND`, `UPSTREAM` by default. |
| `ctx.KIND` | `AUTH`, `INVALID`, `UPSTREAM`, `NETWORK`, `TIMEOUT`, `BLOCKED`, `INTERNAL`. See [API errors](/docs/contributing/api-errors/). |
| `ctx.log` | The structured logger. |

Keep every upstream call behind `ctx.fetchJSON`. It applies the SSRF guard, IP pinning, the size limit and the TLS setting.

### Metrics and XML bodies

Metrics are recognised from `application/openmetrics-text`, `text/plain; version=0.0.4`, or a bare `text/plain` containing a `# TYPE` comment. Other plain text comes back as a string.

XML `data` is keyed by the root tag. Attributes and child elements become keys, a repeated tag becomes an array, and a text-only element becomes its text. Numbers convert only when they round-trip exactly, so `007` stays a string.

Parsed XML and Prometheus objects have a null prototype. Use `Object.hasOwn(o, k)`, not `o.hasOwnProperty(k)`. A feed field called `__proto__` or `constructor` then stays an ordinary key.

## Option endpoints

A `select` with `optionsFrom` calls the same function with `ctx.endpoint` set:

```js
module.exports = async function (ctx) {
  if (ctx.endpoint === 'lists') {
    const r = await ctx.fetchJSON(`${ctx.config.url}/api/lists`, { /* ... */ });
    return { options: r.data.map(l => ({ value: l.id, label: l.name })) };
  }
  return { items: [] };
};
```

See [Options from the service](/docs/create-a-widget/manifest/#options-from-the-service).

## Reporting a failure

Throw. Never return an error as data.

```js
if (!config.apiKey) ctx.fail('API key not configured', { kind: ctx.KIND.INVALID });
if (r.status === 401) ctx.fail('Auth failed, check the API key', { kind: ctx.KIND.AUTH });
if (r.status >= 400) ctx.fail('Service HTTP ' + r.status);
```

A thrown failure becomes a 502. The frontend `poll()` counts it toward `staleAfter`, keeps the last good render, and reports how long ago the data was fresh. A returned `{ error: ... }` arrives as HTTP 200, and `poll()` records it as a success.

Do not catch what `ctx.fetchJSON` throws. Letting it propagate classifies it: a refused connection as a network failure, a deadline as a timeout, the guard as blocked.

Use `ctx.fail`, not `throw new Error`. A thrown message is replaced with a generic one before it reaches the browser, because it may carry a hostname, a path or an upstream body. Never build a `ctx.fail` message from an upstream response or a caught error. A status code is fine.

An error field inside a successful result is a different thing, and correct. A widget reporting several services marks the one that failed and returns the rest:

```js
return { services: [{ name: 'VPN', error: 'Auth required' }, { name: 'Proxy', connected: true }] };
```

## Demo mode

The public demo has no reachable services. A widget can ship `demo.js` beside `data.js`, returning an invented body. It runs only with `DEMO_MODE=true`.

```js
module.exports = function (ctx) {
  const { wave, round } = ctx.demo;
  return { items: [{ name: 'Example' }], total: Math.round(wave(600, 8, 20)) };
};
```

It receives the same `ctx`, plus `ctx.demo` with `wave` and `round`. `wave(periodSec, min, max, phase)` is a clock-driven oscillation, so values drift between polls and every widget on the demo moves together. Build structural data, such as a calendar grid, once and cache it in a module-level variable.

A widget with no `demo.js` runs its real `data.js` on the demo. [System summary](/docs/widgets/system-summary/) has none, because `ctx.metrics` already returns invented figures there.

Only polling gets a demo body. An `optionsFrom` fetch always runs the real code.
