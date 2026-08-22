---
title: Badges
description: Health checks, fixed labels, and live activity counts on an app tile.
---

**In the admin:** Dashboard, then any app. See the [Settings reference](/docs/settings-reference/).

A badge is the small pill on the corner of an app tile. It carries context without adding a widget.

<div class="sy-tiles sy-tiles--row">
  <div class="sy-tile sy-tile--plain">
    <span class="sy-tile__art" style="background:#3a3a3c">
      <span class="sy-badge" style="background:#ff4245">!</span>
    </span>
    <span class="sy-tile__cap">Health check</span>
  </div>
  <div class="sy-tile sy-tile--plain">
    <span class="sy-tile__art" style="background:#4a4a6a">
      <span class="sy-badge" style="background:#0091ff">4K</span>
    </span>
    <span class="sy-tile__cap">Fixed label</span>
  </div>
  <div class="sy-tile sy-tile--plain">
    <span class="sy-tile__art" style="background:#5a4636">
      <span class="sy-badge" style="background:#0091ff">7</span>
    </span>
    <span class="sy-tile__cap">Live activity</span>
  </div>
</div>

Each kind is turned on per app, in that app's edit form under Badge.

<figure class="sy-shot">
  <img class="sy-shot__light" src="/img/admin/app-edit-badge.png" alt="The Badge section of an app's edit form: Health Check, Fixed Label and Live Activity" loading="lazy"><img class="sy-shot__dark" src="/img/admin/app-edit-badge-dark.png" alt="The Badge section of an app's edit form: Health Check, Fixed Label and Live Activity" loading="lazy">
  <figcaption>The three kinds, each with its own toggle. Live Activity opens the API fields when it is on.</figcaption>
</figure>

## Health check

Reports whether a service is up.

| Type | What it reads |
| --- | --- |
| Container | The container's state from the Docker daemon. |
| Ping | The HTTP status from a URL you give it. |

Healthy shows green. A problem shows <span class="sy-badge sy-badge--inline" style="background:#ff4245">!</span> and hovering gives the reason: container not found, container not running, daemon reported it unhealthy, ping failed, or ping returned an error status.

Container checks need Docker Container Health Checks turned on in General, plus socket access. See [Advanced configuration](/docs/advanced-configuration/). Ping checks need neither.

Turn on Hide Healthy Badge in General to show a badge only when something is wrong.

## Fixed label

Text you type once, capped at 10 characters. Pick a colour from the swatches or give a hex value.

## Live activity

A number read from a service's own API.

Enter the API URL and press <span class="sy-btn sy-btn--ghost">Fetch</span>. Stackyard reads the response and lists every number it found, including array lengths and counts of matching items, so you pick one. No custom widget, no code.

<div class="sy-table-wide">

| Field | What it does | Example |
| --- | --- | --- |
| API URL | The endpoint to poll. | `https://requests.example.com/api/v1/request/count` |
| Value | Which number from the response to show. | `pending` |
| Authentication | A header or parameter to send. Tick Secret to keep the value out of the browser. | Header `X-Api-Key`, Secret ticked |
| Unit | A short suffix after the number. | `requests` |
| Show From | The count below which the badge stays hidden. | `1` |
| Poll | How often to re-read the endpoint. | `300` seconds |
| Color | The badge fill. | `#ffcc00` |

</div>

That example badges a request manager with its pending count. Pointing the same fields at Sonarr's queue instead badges episodes still downloading.

Show From sets a floor, so a queue that is never quite empty stays quiet until it matters. Leave it blank to badge any count above zero. A count above 99 shows as `99+`.

## Which badge wins

An app can have several configured. The first of these that applies is the one drawn.

<div class="sy-order">
  <div class="sy-order__step">
    <span class="sy-order__rank">1</span>
    <span class="sy-order__demo"><span class="sy-badge sy-badge--inline" style="background:#ff4245">!</span></span>
    <span class="sy-order__text">Health problem<small>Always outranks a count, so a fault is never hidden behind a number.</small></span>
  </div>
  <div class="sy-order__step">
    <span class="sy-order__rank">2</span>
    <span class="sy-order__demo"><span class="sy-badge sy-badge--inline" style="background:#0091ff">7</span></span>
    <span class="sy-order__text">Live activity<small>Only at or above Show From.</small></span>
  </div>
  <div class="sy-order__step">
    <span class="sy-order__rank">3</span>
    <span class="sy-order__demo"><span class="sy-badge sy-badge--inline" style="background:#0091ff">4K</span></span>
    <span class="sy-order__text">Fixed label</span>
  </div>
  <div class="sy-order__step">
    <span class="sy-order__rank">4</span>
    <span class="sy-order__demo"><span class="sy-badge sy-badge--inline" style="background:#30d158">&nbsp;</span></span>
    <span class="sy-order__text">Healthy<small>Hidden when Hide Healthy Badge is on.</small></span>
  </div>
  <div class="sy-order__step">
    <span class="sy-order__rank">5</span>
    <span class="sy-order__demo"></span>
    <span class="sy-order__text">Nothing</span>
  </div>
</div>

## Stale values

If a poll fails, the last known badge stays on the tile and is marked stale. A failed poll is never read as zero.

<div class="sy-tiles sy-tiles--row">
  <div class="sy-tile sy-tile--plain">
    <span class="sy-tile__art" style="background:#5a4636">
      <span class="sy-badge" style="background:#0091ff">7</span>
    </span>
    <span class="sy-tile__cap">Current</span>
  </div>
  <div class="sy-tile sy-tile--plain">
    <span class="sy-tile__art" style="background:#5a4636">
      <span class="sy-badge sy-badge--stale" style="background:#0091ff">7</span>
    </span>
    <span class="sy-tile__cap">Stale</span>
  </div>
</div>

## Accessibility

Every badge carries a text description for screen readers, so meaning is never carried by colour alone. Dark text is used where it beats white for contrast.
