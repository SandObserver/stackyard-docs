---
title: Support
description: Where to get help, how to read the logs, and how to file a bug report that gets fixed.
---

For a problem you are trying to solve yourself, start with [Troubleshooting](/docs/troubleshooting/). This page is about getting help from a person.

## Where to ask

| What | Where |
| --- | --- |
| Bug reports and feature requests | [GitHub issues](https://github.com/SandObserver/stackyard/issues) |
| Questions and setup help | A GitHub issue with the `question` label |
| Suspected security vulnerability | Privately, never a public issue. See [Security](/docs/security/). |

Search the existing issues first. Most setup questions have been asked already.

## Filing a bug report

A report that includes these is usually fixed without a second round of questions.

- The version. Find it in **About** in the settings.
- How you deployed it, and the image tag you are running.
- What you expected, and what happened instead.
- Steps to reproduce it.
- Logs from around the time of the problem.
- For anything visual, your browser and a screenshot.

Two things worth checking before you file.

Set the browser zoom to 100% first. Layout at any other zoom is not a reliable bug report. See [Not actually broken](/docs/troubleshooting/#not-actually-broken).

Redact secrets before pasting logs or config. Tokens, API keys and internal hostnames are worth removing.

## Reading the logs

The API logs to the container's stdout. nginx logs request errors to stderr and keeps no access log, so both reach the same place:

```sh
docker logs <container-name>
```

With Compose:

```sh
docker compose logs -f
```

In Portainer, open the container and use the **Logs** view.

### What a log line looks like

Every API record is one line:

```
<ISO-8601 UTC timestamp> <LVL> msg=<message> key=value
```

`LVL` is one of `DBG`, `INF`, `WRN`, `ERR` or `AUD`. `AUD` marks a security-relevant event and is never filtered by the level setting.

A few things that are easy to misread:

- Warnings appear at both the `warn` and `error` levels. Choosing **Errors** in settings still shows them.
- The startup banner is not a record. It has no timestamp and no level, and it always prints.
- Secrets are never logged. A value that could carry one, such as the address of a service that failed a connection test, is reduced to its host.
- Lines from supervisord and nginx have their own shapes. They are not Stackyard records.

The format is logfmt. Anything shipping to Loki or Grafana parses it with `| logfmt` and no custom rules.

To change how much is logged, set **Logging Level** in **General**, or see [Advanced configuration](/docs/advanced-configuration/).

## Supporting Stackyard

- Like it? Tell someone about it.
- Found a bug, or have an idea? [Open an issue](https://github.com/SandObserver/stackyard/issues).
- Want to buy me a coffee? [buymeacoffee.com/sandobserver](https://buymeacoffee.com/sandobserver)
