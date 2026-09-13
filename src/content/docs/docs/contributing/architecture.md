---
title: How Stackyard works
description: Stackyard architecture. Nginx and a dependency-free Node API in one container, a single JSON config, and widgets in frames.
---

Stackyard is one container. Nginx serves the interface from `ui/` and passes `/api/` to a Node server in `api/`. The API has no npm dependencies.

## Config

All state is one JSON file, `apps.json`. The admin writes it and the dashboard reads it. Secrets stay on the server and never reach the browser.

## Widgets

Each widget is a frame on the dashboard. The frame asks the API for its data. The API runs that widget's `data.js`, which calls the service. See [Build your first widget](/docs/create-a-widget/).

## Outbound requests

Every request to another host goes through `api/src/proxy.js`. A URL that arrives in a request is checked against private addresses. A URL from saved config is not. `ALLOW_PRIVATE_IPS` turns the check off.

## Frontend

Plain HTML, CSS and ES modules, with no build step. The dashboard and the admin are separate pages.
