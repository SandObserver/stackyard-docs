---
title: Error messages
description: What each Stackyard widget and Settings message means, and where to look next.
---

Find the exact text of the message. For problems without a message, see [Troubleshooting](/docs/troubleshooting/).

## On a widget

One line, in place of the widget's data. Each names a kind of failure rather than repeating what the service said, because a service's own message names hosts, ports and status codes.

| Message | Meaning | Where to look |
| --- | --- | --- |
| `Out of reach` | Nothing answered at the address. | The URL, the network, the port. |
| `Took too long` | The service answered too slowly. | The service's own load, or a link that drops packets. |
| `Key rejected` | The credential was refused. | The API key or token, and its scopes. |
| `Request blocked` | Stackyard refused to make the request. | A private address with `ALLOW_PRIVATE_IPS` unset. See [Security](/docs/security/). |
| `Not set up yet` | The widget has no address or credential yet. | The widget's own settings. |
| `Service error` | The service answered with an error, or with a reply the widget cannot read. | The service's logs, and that the URL points at the service's API. |
| `Something went wrong` | Anything else, including a widget that fails to draw the data it received. | The container logs, then the browser console. |
| `No data` | The service answered, and had nothing to report. | Nothing. This is not a failure. |

The Disk health widget marks a single bay `Not reporting` when the drive it names is no longer in the monitoring service's list. The other bays are unaffected.

## In Settings


| Message | Meaning |
| --- | --- |
| `Stackyard Isn't Responding` | The UI loaded but the API did not answer. See [Troubleshooting](/docs/troubleshooting/#stackyard-isnt-responding). |
| `Enter the same password twice.` | **Password** and **Confirm Password** differ. Nothing was saved. |
| `This password is too common. Choose another one.` | The password is on the list of common passwords. Choose another. |
| `Too easy to guess. Avoid the name or address of this dashboard.` | The password is built from this install's name or host name. |
| `The setup code is incorrect. Copy it again from the container log.` | The code does not match. A restart makes a new code. See [Troubleshooting](/docs/troubleshooting/#stackyard-does-not-answer-on-this-address). |
| `No password works` | The saved password is damaged. See [Troubleshooting](/docs/troubleshooting/#no-password-works). |
| `The current password is incorrect.` | The current password typed to change or remove the password did not match. Nothing was saved. |
| `The password was changed elsewhere. Reload the page and try again.` | The password changed on another device while this save ran. Nothing was saved. |
| `The dashboard was changed elsewhere. Reload the page and try again.` | Another tab or device changed the dashboard after this page loaded it. Nothing was saved. |
| `Too many attempts. Try again in <n> minutes.` | 5 wrong passwords from this IP in 15 minutes. Wait that long, then try again. See [Troubleshooting](/docs/troubleshooting/#one-persons-failed-logins-lock-everyone-out). |
| `Stackyard cannot use its settings file` | The config file is damaged or cannot be read. Sign-in and saving are off until it is fixed. See [Troubleshooting](/docs/troubleshooting/#stackyard-cannot-read-its-settings-file). |
| `Stackyard does not answer on this address` | No password is set and this address is not allowed. See [Troubleshooting](/docs/troubleshooting/#stackyard-does-not-answer-on-this-address). |
| `Keep ... in Allowed Addresses, or this page stops working.` | The save would drop the address this page is open on while no password is set. Remove it from another address. |
| `Enter the credential again for: ...` | The request a secret belonged to changed, so the secret was cleared. Re-enter and save. |
| `Nothing at that address answered.` | The socket proxy address is unreachable from inside the container. Usually a proxy published on the host's loopback. |
| `That name is resolved by Docker, which answers only for containers on a shared network.` | The socket proxy service name is not on a network Stackyard shares. |
| `Saved, but the socket proxy did not answer` | The address was stored, but nothing responded. Docker health checks will not work until it does. |
| `Settings unavailable` | The widget's definition could not be loaded. The stored config is kept. |
| `N widgets could not be loaded, so they are not listed below.` | Those definitions were refused at startup. The reason is in the container log. |
| `Container not found` | The socket proxy answered, but no container matched that name. |
| `Guest not found` | Proxmox answered, but lists no guest with that number. Templates are never listed. See [Troubleshooting](/docs/troubleshooting/docker/#every-proxmox-tile-says-guest-not-found). |
| `Guest stopped` | The Proxmox virtual machine or container is not running. |
| `No data from Proxmox` | Proxmox lists the guest but has no current status for it. Its node is usually offline or has just started. |
| `Proxmox refused the token. Check the token ID and secret.` | The token ID or secret is wrong. |
| `The token cannot read this. Give it the PVEAuditor role.` | The token is valid but lacks a permission. |
| `Enter the Proxmox address, token ID and secret under Health Checks in General.` | An app has a Proxmox check, but no Proxmox connection is set. |
| `Enter the username and password under Sign In. A login in the URL is not sent.` | The **Live Activity** URL holds a username or password before the host. Stackyard does not send it. Enter them under **Authentication**, **Sign In**. |
| `This address has no API path. Enter the service's full API URL.` | The **Live Activity** address names a host only. Badges read a value from an API response, so the address needs the service's API path. |
| `Connected, but this address has no API path. Enter the service's full API URL.` | The address answered, but nothing numeric was found in the response. Same cause as above. |
| `The address answered with a redirect (HTTP <status>). Enter the address it points to.` | Redirects are not followed. Use the final address, which is often a login page when the API path is missing. |
| `The service's answer is too large to read in full. Use an API path that returns less.` | The **Live Activity** response is over 4 MB, or is XML with more than 5,000 elements. Stackyard does not count a partial response. |
| `The service answered, but nothing is at that address (HTTP <status>).` | The host answered with 404. The API path is wrong. |
| `The service answered with an error (HTTP <status>).` | The service returned an error status. 404, 405, 407 and 5xx errors have their own messages. |
| `The host refused the connection. Check the port.` | The host answered, but nothing listens on that port. |
| `The host name could not be found.` | DNS has no record for the name. Check the spelling, or use the container name or IP address. |
| `The host could not be reached on the network.` | No route to the host. Check the IP address and that the host is on. |
| `The service closed the connection before it answered.` | The service hung up mid-reply. Check its logs. |
| `The service did not answer in HTTP. Check http or https and the port.` | Something answered on that port, but not a web server. Often `http` used for an `https` port, or the reverse. |
| `The service uses a self-signed certificate. Turn on “Allow self-signed certificate” to accept it.` | The certificate is self-signed. Turn on the switch for a service on your own network. |
| `The service uses a self-signed certificate. Allowing a self-signed certificate only applies to addresses on your own network.` | The address is public, so the switch does not apply. |
| `The service's certificate has expired.` | Renew the certificate on the service. |
| `The service did not answer in time.` | The service is slow or the network drops packets. |
| `Ping failed` / `Ping returned <status>` | The URL was reached but did not answer as expected. |
| `That image is too large for the server to accept.` | Over the 2 MB upload limit. |
| `Enter a color as #rrggbb or as a CSS color name, such as teal.` | The wallpaper color field rejects anything else. |
| `The wallpaper could not be loaded.` | Settings could not get the Unsplash photo. Check the API key and the **Collection ID**. |
| `Could not save the wallpaper. <reason>` | The image was not stored. The link was unreachable, the file is not a JPEG, PNG, WebP, AVIF or GIF, or it is over 16 MB. |
| `Set a password before turning authentication on.` | Authentication needs a password to exist first. |
| `Some items in the folder <id> are not in the file.` | A folder in the imported config lists apps that are not in the same file. Usually a hand-edited or partly merged export. |
| `Stackyard cannot read the list of items in the folder <id>.` | A folder in the imported config lists its contents as something other than a list of item ids. Nothing was saved. |
| `Two items share the id <id>. Each item needs its own id.` | The imported config has two entries with the same id. Nothing was saved. |
| `The item <id> has a link that is not allowed. Links must use http or https.` | A link in the imported config uses a scheme such as `javascript:` or `data:`. Nothing was saved. |
| `That file is not a Stackyard export.` | The imported file is not JSON, or has no `items` list. |
| `<name> is already on the dashboard. Reload the page and import again.` | An item with the same id was added from another tab while the import preview was open. |
| `<file>: the importer cannot read the YAML on line <line>.` | The file uses YAML the importer does not support, such as tab indentation or more than one document. |
| `That file type is not supported.` | Icons must be SVG, PNG or ICO. Wallpapers must be JPEG, PNG, WebP, AVIF or GIF. |
| `Enter an address that starts with http:// or https://.` | The address is not an http or https URL. |
| `The socket proxy refused the request.` | The socket proxy answered with 401 or 403, with and without an API version in the path. For **Import from Docker Labels**, the proxy needs read access to containers. |
| `Something answered there, but it is not a Docker socket proxy.` | The address answered, but not with a Docker API version or a container list. |
| `Turn on Health Checks in General and enter the Docker Socket URL.` | **Import from Docker Labels** has no socket proxy address to read from. |
| `No container has both a homepage.name and a homepage.group label.` | **Import from Docker Labels** found no container it could turn into an app. |
| `Docker lists too many containers to import at once.` | The container list is larger than 16 MB, or holds more than 5,000 entries. |
| `Saving is turned off in the live demo.` | The public demo is read-only. |
| `Nothing to import. The file matches your current config.` | The imported file is identical to what is already stored. |
| `Settings restored. Reload the page before changing any settings.` | An import replaced settings. Settings still shows the values from before it until the page reloads. |
| `Icon catalogues could not be reached` | No catalog answered while searching. The field still takes a full URL or an upload. |
| `<file> is not a gethomepage or Dashy config.` | Only those two formats are recognized. See [Import](/docs/import-export/migrating/). |
| `<file> has too many entries to import.` | The file has more than 5,000 entries, or its merge keys expand too far. Nothing was imported. See [Import](/docs/import-export/migrating/#what-is-skipped). |
| `(may be out of date)` | A stale reading. The last poll failed and the previous value is shown. |
