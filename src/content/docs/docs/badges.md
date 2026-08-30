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

Numbers read from a service's own API.

Enter the API URL and press <span class="sy-btn sy-btn--ghost">Fetch</span>. Stackyard reads the response and lists every number it found, including array lengths and counts of matching items, so you pick from a menu rather than writing a path. No custom widget, no code.

<div class="sy-table-wide">

| Field | What it does | Example |
| --- | --- | --- |
| API URL | The endpoint to poll. | `https://requests.example.com/api/v1/request/count` |
| Authentication | A header or parameter to send. Tick Secret to keep the value out of the browser. | Header `X-Api-Key`, Secret ticked |
| Poll | How often to re-read the endpoint. | `300` seconds |

</div>

### Labels

One poll can feed several labels. Each names one number from the response and carries its own text, colour, unit and threshold.

<figure class="sy-shot">
  <img class="sy-shot__light" src="/img/admin/app-edit-labels.png" alt="Two label cards in an app's edit form, each with Value, Label Text, Color, Unit and Show From, above the Add Label button" loading="lazy"><img class="sy-shot__dark" src="/img/admin/app-edit-labels-dark.png" alt="Two label cards in an app's edit form, each with Value, Label Text, Color, Unit and Show From, above the Add Label button" loading="lazy">
  <figcaption>Press Add Label for another. Drag a card by its handle to reorder it, or use the arrows.</figcaption>
</figure>

<div class="sy-table-wide">

| Field | What it does | Example |
| --- | --- | --- |
| Value | Which number from the response this label reads. | `pending` |
| Label Text | The name shown in the list. Optional. | `pending` |
| Color | The badge fill. Optional. | `#ffcc00` |
| Unit | A short suffix for the number, shown in the list and read out by a screen reader. Optional. | `pending` |
| Show From | The count below which this label stays quiet. Optional. | `5` |

</div>

A label is quiet until its number reaches Show From. Leave Show From blank to report any count above zero. A count above 99 shows as `99+`, with the full number in the list.

The pill carries the number alone, so a unit can never make it wider than the icon it marks. The unit appears in the list beside the number.

An app can have five labels. Only the first one that has something to report is drawn on the tile, so a queue that is never quite empty stays out of the way until it matters.

### Reading more than one

When a second badge is reporting, a matching pill appears behind the first in that badge's colour. It means there is more to see.

<figure class="sy-shot">
  <img src="/img/dashboard/badge-labels-c9fda069.png" alt="Three app tiles: two badges show a second pill behind them, one does not" loading="lazy">
  <figcaption>Jellyfin and Seerr each have more behind the badge. SABnzbd has one label, so nothing is stacked.</figcaption>
</figure>

Hover the badge, tap it on a phone, or move focus to the tile with a keyboard. Everything the tile is reporting opens in a list, with the full numbers and no truncation. Press Escape or tap elsewhere to close it. Tapping the badge opens the list without following the link.

<figure class="sy-shot">
  <img src="/img/dashboard/badge-list-a6444739.png" alt="An app tile with its badge list open, showing pending and approved with their values" loading="lazy">
  <figcaption>The list carries whatever the badge has no room for, in the same order.</figcaption>
</figure>

The list only appears when there is a second badge. One badge is already fully shown on the tile.

### One total instead

Turn on Show as a Single Badge to add every label's value together and show the sum as one number, in the first label's colour. This is how Live Activity behaved before labels, and dashboards that used it keep it.

### Folders

A folder shows the badge of the app inside it that is reporting, rather than a total. Opening its list names each row by the app it came from.

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
    <span class="sy-order__text">Live activity<small>The first label at or above its Show From.</small></span>
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

Whatever is not drawn is still reachable: two or more badges on one tile open the list described above.

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

Every badge carries a text description for screen readers, so meaning is never carried by colour alone, and so does the list behind it. Badge text is white wherever white is readable against the fill, and dark only where white would fail the contrast requirement.

The list opens on keyboard focus as well as on hover and tap, and label order can be changed with the arrow buttons as well as by dragging.
