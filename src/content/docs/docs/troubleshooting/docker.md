---
title: Docker and network problems
description: Fix Stackyard problems with Docker host access, socket proxies, Proxmox checks and container permissions.
---

### Stackyard cannot reach services on the Docker host

On Linux a container cannot reach the host's LAN IP without help:

```yaml
extra_hosts:
  - "host.docker.internal:host-gateway"
```

Setting **Host IP** in **General** also allows that address through the SSRF guard.

### The health check badge shows nothing for a container

Turn on **Health Checks** in **General**. Every check type needs it.

Container checks read the Docker daemon through a socket proxy. Enter the proxy's address in **Docker Socket URL**, or set `SOCKET_PROXY_URL`.

A ping check needs no proxy. Switch the check type to Ping and give it a URL.

### Every Proxmox tile says Guest not found

The token sees no guests. Press <span class="sy-btn sy-btn--ghost">Test</span> under **Health Checks**. `Connected · 0 guests` means the token has no role. If **Privilege Separation** is on for the token, give PVEAuditor to the token itself, not only to its user.

### Every app with a container shows as unhealthy at once

The container list comes from a socket proxy, which is a separate container you run yourself. Stackyard only stores its address. When that address cannot be reached, no container is found, and a container that cannot be found counts as not running. When the proxy stops answering, the last container list it sent is used for up to 2 minutes.

Two addresses that look interchangeable are not, and they fail for opposite reasons.

**A service name** such as `http://socket-proxy:2375` is resolved by Docker's own DNS, which answers only for containers that share a network. Add the proxy's network to the Stackyard service:

```yaml
services:
  stackyard:
    networks:
      - socket_proxy_network

networks:
  socket_proxy_network:
    external: true
    name: socket_proxy_network
```

A service on `network_mode: bridge` is on Docker's default bridge, which has no name resolution at all. No service name works from there.

**An IP address** reaches only what the proxy published. The usual socket proxy compose publishes on the host's loopback:

```yaml
    ports:
      - "127.0.0.1:2375:2375"
```

That port exists on the host and nowhere else. A container's own `127.0.0.1` is not the host's. Packets are dropped rather than refused, so this appears as a timeout, not a connection error.

To use an IP, republish the proxy's port where containers can reach it. The Docker bridge address, usually `172.17.0.1`, reaches containers on that host without exposing anything to the network:

```yaml
    ports:
      - "172.17.0.1:2375:2375"
```

Publishing on `0.0.0.0` also works and is worth avoiding. Even with `POST=0` and `EXEC=0`, it offers an unauthenticated read of every container, image, network and log on that host to anyone who can reach the port.

### A disk slot shows the wrong filesystem

A Glances instance running in Docker reports its own filesystems, not the host's. Mount the host paths into the Glances container.
