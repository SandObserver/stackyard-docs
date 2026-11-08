---
title: Error messages
description: What each Stackyard widget and Settings message means, and where to look next.
tableOfContents: false
---

Find the exact text of the message. For problems without a message, see [Troubleshooting](/docs/troubleshooting/).

A widget message is one line, in place of the widget's data. Each names a kind of failure rather than repeating what the service said, because a service's own message names hosts, ports and status codes.

| Message | Area | Meaning |
| --- | --- | --- |
| `Out of reach` | On a widget | Nothing answered at the address. The URL, the network, the port. |
| `Took too long` | On a widget | The service answered too slowly. The service's own load, or a link that drops packets. |
| `Key rejected` | On a widget | The credential was refused. The API key or token, and its scopes. |
| `Request blocked` | On a widget | Stackyard refused to make the request. A private address with `ALLOW_PRIVATE_IPS` unset. See [Security](/docs/security/). |
| `Not set up yet` | On a widget | The widget has no address or credential yet. The widget's own settings. |
| `Service error` | On a widget | The service answered with an error, or with a reply the widget cannot read. The service's logs, and that the URL points at the service's API. |
| `Something went wrong` | On a widget | Anything else, including a widget that fails to draw the data it received. The container logs, then the browser console. |
| `No data` | On a widget | The service answered, and had nothing to report. Nothing. This is not a failure. |
| `Not reporting` | On a widget | The Disk health widget marks a single bay this way when the drive it names is no longer in the monitoring service's list. The other bays are unaffected. |
| `Stackyard Isn't Responding` | App status | The UI loaded but the API did not answer. See [Troubleshooting](/docs/troubleshooting/#stackyard-isnt-responding). |
| `The dashboard was changed elsewhere. Reload the page and try again.` | App status | Another tab or device changed the dashboard after this page loaded it. Nothing was saved. |
| `Stackyard cannot use its settings file` | App status | The config file is damaged or cannot be read. Sign-in and saving are off until it is fixed. See [Troubleshooting](/docs/troubleshooting/#stackyard-cannot-read-its-settings-file). |
| `Enter the credential again for: ...` | App status | The request a secret belonged to changed, so the secret was cleared. Re-enter and save. |
| `Settings unavailable` | App status | The widget's definition could not be loaded. The stored config is kept. |
| `N widgets could not be loaded, so they are not listed below.` | App status | Those definitions were refused at startup. The reason is in the container log. |
| `The token cannot read this. Give it the PVEAuditor role.` | App status | The token is valid but lacks a permission. |
| `No container has both a homepage.name and a homepage.group label.` | App status | **Import from Docker Labels** found no container it could turn into an app. |
| `Saving is turned off in the live demo.` | App status | The public demo is read-only. |
| `(may be out of date)` | App status | A stale reading. The last poll failed and the previous value is shown. |
| `Enter the same password twice.` | Passwords and sign-in | **Password** and **Confirm Password** differ. Nothing was saved. |
| `This password is too common. Choose another one.` | Passwords and sign-in | The password is on the list of common passwords. Choose another. |
| `Too easy to guess. Avoid the name or address of this dashboard.` | Passwords and sign-in | The password is built from this install's name or host name. |
| `The setup code is incorrect. Copy it again from the container log.` | Passwords and sign-in | The code does not match. A restart makes a new code. See [Troubleshooting](/docs/troubleshooting/#stackyard-does-not-answer-on-this-address). |
| `No password works` | Passwords and sign-in | The saved password is damaged. See [Troubleshooting](/docs/troubleshooting/#no-password-works). |
| `The current password is incorrect.` | Passwords and sign-in | The current password typed to change or remove the password did not match. Nothing was saved. |
| `The password was changed elsewhere. Reload the page and try again.` | Passwords and sign-in | The password changed on another device while this save ran. Nothing was saved. |
| `Too many attempts. Try again in <n> minutes.` | Passwords and sign-in | 5 wrong passwords from this IP in 15 minutes. Wait that long, then try again. See [Troubleshooting](/docs/troubleshooting/#one-persons-failed-logins-lock-everyone-out). |
| `Enter the username and password under Sign In. A login in the URL is not sent.` | Passwords and sign-in | The **Live Activity** URL holds a username or password before the host. Stackyard does not send it. Enter them under **Authentication**, **Sign In**. |
| `Set a password before turning authentication on.` | Passwords and sign-in | Authentication needs a password to exist first. |
| `Nothing at that address answered.` | Docker and Proxmox | The socket proxy address is unreachable from inside the container. Usually a proxy published on the host's loopback. |
| `That name is resolved by Docker, which answers only for containers on a shared network.` | Docker and Proxmox | The socket proxy service name is not on a network Stackyard shares. |
| `Saved, but the socket proxy did not answer` | Docker and Proxmox | The address was stored, but nothing responded. Docker health checks will not work until it does. |
| `Container not found` | Docker and Proxmox | The socket proxy answered, but no container matched that name. |
| `Guest not found` | Docker and Proxmox | Proxmox answered, but lists no guest with that number. Templates are never listed. See [Troubleshooting](/docs/troubleshooting/docker/#every-proxmox-tile-says-guest-not-found). |
| `Guest stopped` | Docker and Proxmox | The Proxmox virtual machine or container is not running. |
| `No data from Proxmox` | Docker and Proxmox | Proxmox lists the guest but has no current status for it. Its node is usually offline or has just started. |
| `Proxmox refused the token. Check the token ID and secret.` | Docker and Proxmox | The token ID or secret is wrong. |
| `Enter the Proxmox address, token ID and secret under Health Checks in General.` | Docker and Proxmox | An app has a Proxmox check, but no Proxmox connection is set. |
| `The socket proxy refused the request.` | Docker and Proxmox | The socket proxy answered with 401 or 403, with and without an API version in the path. For **Import from Docker Labels**, the proxy needs read access to containers. |
| `Something answered there, but it is not a Docker socket proxy.` | Docker and Proxmox | The address answered, but not with a Docker API version or a container list. |
| `Turn on Health Checks in General and enter the Docker Socket URL.` | Docker and Proxmox | **Import from Docker Labels** has no socket proxy address to read from. |
| `Docker lists too many containers to import at once.` | Docker and Proxmox | The container list is larger than 16 MB, or holds more than 5,000 entries. |
| `Some items in the folder <id> are not in the file.` | Import and export | A folder in the imported config lists apps that are not in the same file. Usually a hand-edited or partly merged export. |
| `Stackyard cannot read the list of items in the folder <id>.` | Import and export | A folder in the imported config lists its contents as something other than a list of item ids. Nothing was saved. |
| `Two items share the id <id>. Each item needs its own id.` | Import and export | The imported config has two entries with the same id. Nothing was saved. |
| `The item <id> has a link that is not allowed. Links must use http or https.` | Import and export | A link in the imported config uses a scheme such as `javascript:` or `data:`. Nothing was saved. |
| `That file is not a Stackyard export.` | Import and export | The imported file is not JSON, or has no `items` list. |
| `<name> is already on the dashboard. Reload the page and import again.` | Import and export | An item with the same id was added from another tab while the import preview was open. |
| `<file>: the importer cannot read the YAML on line <line>.` | Import and export | The file uses YAML the importer does not support, such as tab indentation or more than one document. |
| `Nothing to import. The file matches your current config.` | Import and export | The imported file is identical to what is already stored. |
| `Settings restored. Reload the page before changing any settings.` | Import and export | An import replaced settings. Settings still shows the values from before it until the page reloads. |
| `<file> is not a gethomepage or Dashy config.` | Import and export | Only those two formats are recognized. See [Import](/docs/import-export/migrating/). |
| `<file> has too many entries to import.` | Import and export | The file has more than 5,000 entries, or its merge keys expand too far. Nothing was imported. See [Import](/docs/import-export/migrating/#what-is-skipped). |
| `That image is too large for the server to accept.` | Images and icons | Over the 2 MB upload limit. |
| `Enter a color as #rrggbb or as a CSS color name, such as teal.` | Images and icons | The wallpaper color field rejects anything else. |
| `The wallpaper could not be loaded.` | Images and icons | Settings could not get the Unsplash photo. Check the API key and the **Collection ID**. |
| `Could not save the wallpaper. <reason>` | Images and icons | The image was not stored. The link was unreachable, the file is not a JPEG, PNG, WebP, AVIF or GIF, or it is over 16 MB. |
| `That file type is not supported.` | Images and icons | Icons must be SVG, PNG or ICO. Wallpapers must be JPEG, PNG, WebP, AVIF or GIF. |
| `Icon catalogues could not be reached` | Images and icons | No catalog answered while searching. The field still takes a full URL or an upload. |
| `The service uses a self-signed certificate. Turn on “Allow self-signed certificate” to accept it.` | Certificates | The certificate is self-signed. Turn on the switch for a service on your own network. |
| `The service uses a self-signed certificate. Allowing a self-signed certificate only applies to addresses on your own network.` | Certificates | The address is public, so the switch does not apply. |
| `The service's certificate has expired.` | Certificates | Renew the certificate on the service. |
| `Stackyard does not answer on this address` | Addresses and connections | No password is set and this address is not allowed. See [Troubleshooting](/docs/troubleshooting/#stackyard-does-not-answer-on-this-address). |
| `Keep ... in Allowed Addresses, or this page stops working.` | Addresses and connections | The save would drop the address this page is open on while no password is set. Remove it from another address. |
| `This address has no API path. Enter the service's full API URL.` | Addresses and connections | The **Live Activity** address names a host only. Badges read a value from an API response, so the address needs the service's API path. |
| `Connected, but this address has no API path. Enter the service's full API URL.` | Addresses and connections | The address answered, but nothing numeric was found in the response. Same cause as above. |
| `The address answered with a redirect (HTTP <status>). Enter the address it points to.` | Addresses and connections | Redirects are not followed. Use the final address, which is often a login page when the API path is missing. |
| `The service's answer is too large to read in full. Use an API path that returns less.` | Addresses and connections | The **Live Activity** response is over 4 MB, or is XML with more than 5,000 elements. Stackyard does not count a partial response. |
| `The service answered, but nothing is at that address (HTTP <status>).` | Addresses and connections | The host answered with 404. The API path is wrong. |
| `The service answered with an error (HTTP <status>).` | Addresses and connections | The service returned an error status. 404, 405, 407 and 5xx errors have their own messages. |
| `The host refused the connection. Check the port.` | Addresses and connections | The host answered, but nothing listens on that port. |
| `The host name could not be found.` | Addresses and connections | DNS has no record for the name. Check the spelling, or use the container name or IP address. |
| `The host could not be reached on the network.` | Addresses and connections | No route to the host. Check the IP address and that the host is on. |
| `The service closed the connection before it answered.` | Addresses and connections | The service hung up mid-reply. Check its logs. |
| `The service did not answer in HTTP. Check http or https and the port.` | Addresses and connections | Something answered on that port, but not a web server. Often `http` used for an `https` port, or the reverse. |
| `The service did not answer in time.` | Addresses and connections | The service is slow or the network drops packets. |
| `Ping failed` / `Ping returned <status>` | Addresses and connections | The URL was reached but did not answer as expected. |
| `Enter an address that starts with http:// or https://.` | Addresses and connections | The address is not an http or https URL. |
