---
title: Troubleshooting Stackyard
description: Find a problem by its symptom, then the cause and the fix.
prev: false
tableOfContents:
  minHeadingLevel: 2
  maxHeadingLevel: 2
---

Problems are grouped by what you see. If you have a message or a log line, see [Error messages](/docs/troubleshooting/messages/).

For how to read the logs and how to file a bug, see [Support](/docs/support/).

## Getting in

### Login returns to the login screen

The session cookie is marked `Secure` on HTTPS. Behind a reverse proxy that terminates TLS, the browser is sent a cookie it refuses to store, and login fails with no error.

Set `TRUST_PROXY=true` and make the proxy send `X-Forwarded-Proto: https`. Only set it when a proxy you control is in front of Stackyard. See [Security](/docs/security/).

### One person's failed logins lock everyone out

Logins are limited to 5 attempts per IP per 15 minutes. Behind another reverse proxy, Stackyard's nginx sees that proxy as the client, so every request through it shares one bucket.

Set `TRUSTED_PROXY` to where the proxy is, for example `TRUSTED_PROXY=172.18.0.0/16`. See [Use a reverse proxy](/docs/reverse-proxy/).

### Forgotten password

There is no reset link. Recover it by editing the config file directly.

1. Stop the container.
2. Open `apps.json` in the `data` volume.
3. Under `settings.auth`, delete the `passwordHash` line and set `enabled` to `false`.
4. Start the container.

The dashboard opens without a password. Set a new one in **General**, **Password Protection**.

Back the file up before editing it. See [Backup and restore](/docs/import-export/backup-and-restore/).

### No password works

The saved password is damaged, so Stackyard cannot check any password. The dashboard stays locked.

1. Try to sign in. Stackyard prints a setup code to the container log.
2. Enter the code on the sign-in page, with a new password.

A restart makes a new code.

## The dashboard

### Stackyard Isn't Responding

The page loaded but the API behind it did not answer. The UI is served by nginx and the data comes from the API, and they are separate processes in the same container.

Check `docker logs <container>` for either process failing to start. A data volume that the container's `node` user cannot write to is a common cause.

### Stackyard cannot read its settings file

The dashboard and Settings show this screen when `apps.json` is damaged or cannot be read. Stackyard does not change the file. Sign-in and saving stay off until the file is fixed, so no one can replace your settings or your password.

There are two causes:

- **Damaged.** The file is not valid JSON, or it has the wrong shape. Stackyard copies it to `apps.json.corrupt-<timestamp>` in the same folder. Each distinct breakage keeps its own copy.
- **Cannot be read.** The file exists, but the container's `node` user is not allowed to read it.

To fix it, on the server:

1. If the file is damaged, open the copy the screen names, fix the error, and save it as `apps.json`. The container log gives the error and its position. You can instead replace `apps.json` with a file you saved with **Export**. An export holds no password, so set one again in **General**, **Password Protection** straight away.
2. If the file cannot be read, give the `node` user read and write access to `apps.json` in the `data` volume.
3. To start again with no settings, delete `apps.json`. First-time setup then runs.
4. Choose **Check again**.

The container log shows `config file cannot be used; sign-in and saving are refused until it is fixed`, with the reason and the copy's name.

### Stackyard does not answer on this address

No password is set, and the address in your browser is not an IP address, a local name, or an entry in **Allowed Addresses**. Stackyard refuses it so a web page on another site cannot reach your settings. See [Security](/docs/security/#addresses-without-a-password).

1. Open Stackyard by its IP address, or by an address you already allowed.
2. In **General**, add the address to **Allowed Addresses** and save.
3. Choose **Check again**.

To set a password on the refused address instead:

1. Copy the setup code from the container log. Stackyard prints it when it first refuses an address, and makes a new one at each restart.
2. Enter the code under **Set a password here**, with a new password.

With a password, every address works.

### Dashboard is empty after a restart

Confirm both volumes are mounted. Without `/data` nothing persists.

If you replaced your Compose file with the current one, it stores data in the `data` and `icons` volumes, while earlier versions used `./data` and `./icons`. Put the two old volume lines back; the data is still in those folders.

### UI looks the same after an update

The UI files ship inside the image. Pull the new image and recreate the container. See [Update Stackyard](/docs/update/). In Portainer, redeploy the stack. A browser refresh alone does not do it.

### A re-uploaded icon still shows the old image

Icons are served with revalidation, so a re-upload appears on the next load. If it does not, hard refresh.

## Apps and badges

### A badge or widget cannot reach a service on my network

The SSRF guard blocks private, loopback and link-local addresses by default, so a URL pointing at `192.168.x.x` or `10.x.x.x` is refused.

Set `ALLOW_PRIVATE_IPS=true`. Read [Security](/docs/security/) first, then see [Environment variables](/docs/installation/docker/#environment-variables).

Two things work without it. A dotless hostname such as a Docker container name works when it resolves to a network the container is on. The **Host IP** set in **General** also works when it is an IP address.

### The badge shows a dimmed value with a dashed outline

That is the stale state. The last poll failed, so the previous value is shown rather than being read as zero.

Check that the service is reachable and the credential is still valid.

### A credential stopped working after an edit

Changing where or how a credential would be sent clears the stored value. Editing a badge URL, its non-secret headers, its sign-in username, or a widget field that decides where the credential goes all count. Display settings such as units, colors and links do not. These count too: turning **Allow self-signed certificate** on or off for an app, and in the config, turning `settings.server.skipTlsVerify` on or off or changing or removing the port map (`settings.server.portMap`). Unticking **Secret** on a header row clears it on the next save.

Stackyard names the items to re-enter. Enter the credential again and save.

## Widgets

### A widget says "Not set up yet" or shows an error instead of data

Check three things in order.

1. The server URL and the credential in the widget's settings. A secret field shows as set without revealing the value, and leaving it untouched keeps it.
2. That the container can reach the URL you entered. Right network, right port, no firewall in between.
3. For an HTTPS service with a self-signed certificate, the TLS-skip option.

### A widget dims and shows a line instead of its data

The widget keeps its layout, fades what it was showing, and puts one line where its own labels are. The line names the kind of failure, not the service's own message. See [Messages a widget shows](/docs/troubleshooting/messages/).

Widgets keep the last good reading through a transient failure and only surface a line after repeated failures. A line that clears on its own means one poll timed out.

A widget that reached its service and got nothing back stays at full brightness and says so, for example `No data`. That is not a failure.

### Settings unavailable, or a widget is missing from the list

A widget whose definition could not be loaded has its whole stored config withheld, because without the definition the server cannot tell which fields are secret. Nothing is lost. The config is put back on save.

Check the container logs for a definition that failed to load. A `WIDGETS_PATH` pointing at the wrong directory loads an empty registry, and every widget reports as unknown.

### A hand-written custom widget never appears in the type list

A definition that is refused is not listed, and the reason is written to the container log only. Nothing in Settings says why.

Run `docker logs <container>` and look for the refusal at startup. See [Widget checklist](/docs/create-a-widget/checklist/).

## Settings that do not apply

### A setting has no effect

Values typed into a Docker UI's environment editor, such as Portainer's stack environment panel, do not reach the container by themselves. Compose uses them to substitute `${NAME}` in the Compose file and passes nothing else through.

The shipped `docker-compose.yml` carries a `${NAME}` line for every operator setting, so the panel works with it. A Compose file that hardcodes values ignores the panel.

Confirm what the container actually received:

```sh
docker exec stackyard env
```

### Keep Screen Awake does nothing

Browsers only allow the wake lock over HTTPS. On a plain HTTP address the toggle has no effect. Put Stackyard behind a reverse proxy that terminates TLS.

### An upload or a save is rejected as too large

Request sizes are limited so one request cannot consume the memory of a small machine.

| What | Limit |
| --- | --- |
| Icon upload | 2 MB |
| Config save | 2 MB |

nginx allows 3 MB, above both, so the API is always the component that refuses and can say what the limit is.

### The container stops at start, or cannot save, as another account

The container log names the account and what it cannot do:

| Log line | What to do |
| --- | --- |
| `UID 2000 cannot write /data; config and icon writes will fail. Make it writable by 2000:2000 on the host.` | The dashboard serves but nothing saves, and the health check fails. Give the folder to that account on the host, for example `chown -R 2000:2000 ./data ./icons`, and restart. A named volume does not have this problem. |
| `UID 2000 cannot listen on port 80 here; this system allows ports from 1024 up for accounts other than root.` | Set `LISTEN_PORT` to a port the message allows and map that port. |
| `UID 2000 cannot write /run/stackyard. If the container's root filesystem is read-only, mount a tmpfs on /run/stackyard.` | Add a tmpfs mount on `/run/stackyard`. |
| `cannot take ownership of /data; config and icon writes will fail` | The container runs as root without `CAP_CHOWN`. Add `CHOWN` under `cap_add`, or make the folder writable by UID 1000 yourself. |

### The container stops with "Stackyard did not start"

`INITIAL_PASSWORD` or `INITIAL_PASSWORD_FILE` is set, but the password could not be stored on the first start. The log line ends with the reason:

| Reason | What to do |
| --- | --- |
| `INITIAL_PASSWORD_FILE could not be read` | Mount the file, and let the container's account read it. |
| `Password must be at least 15 characters.` | Use a longer password. In `docker-compose.yml` or `.env`, write each `$` as `$$`, or the password arrives shorter. |
| `Password must be at most 1024 characters.` | Use a shorter password. |
| `This password is too common or too easy to guess.` | Choose another password. |
| `holds control characters or text that is not UTF-8` | Save the value as plain UTF-8 text. |

Fix the value and start the container again.

### The container health check is failing

The health check runs through nginx to the API, so it covers both processes. It also fails while the API cannot write `/data` or `/icons`. Check the logs for a process that failed to start or a folder the API cannot write.

## Not actually broken

### The UI looks wrong at a zoom other than 100%

Set the browser's page zoom back to 100% before reporting a layout bug. Settings is laid out in fixed pixels, while the dashboard scales itself from the viewport width, so at any other zoom the two disagree and spacing looks wrong. On iOS the safe-area inset is also reported in points regardless of zoom, so content can sit under the status bar.

This has produced convincing false bug reports. Check the zoom first.
