---
title: Build from source
description: Clone the repository and build the Stackyard container image yourself.
next:
  link: /docs/first-setup/
  label: First setup
---

```sh
git clone https://github.com/SandObserver/stackyard.git
cd stackyard
docker build -t stackyard:local .
```

Then run `stackyard:local` the same way as the published image. See [Docker](/docs/installation/docker/), replacing the image name.

## Working on the code

To run Stackyard without Docker while developing, see [CONTRIBUTING.md](https://github.com/SandObserver/stackyard/blob/main/CONTRIBUTING.md) and [Development](/docs/development/).
