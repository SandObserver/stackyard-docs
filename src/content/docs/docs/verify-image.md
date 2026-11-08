---
title: Verify a release image
description: Check the signature and the SBOM attestation of a Stackyard image with cosign.
---

Every released image is signed with [cosign](https://docs.sigstore.dev/) using keyless signing, bound to the GitHub Actions workflow that built it and recorded in Sigstore's transparency log.

```sh
cosign verify ghcr.io/sandobserver/stackyard:1.5.0 \
  --certificate-identity-regexp '^https://github.com/SandObserver/Stackyard/' \
  --certificate-oidc-issuer https://token.actions.githubusercontent.com
```

Both flags matter. Without them cosign accepts a signature from any identity, which proves only that something signed the image.

Each release build also scans the image with Trivy and fails on a HIGH or CRITICAL finding that has a fix, so a flagged image never reaches a registry. A scheduled job rescans the published `latest` image every week, on both platforms, which covers a vulnerability disclosed after a release.

The build produces an SPDX SBOM listing what is inside the image. It is attached to the run as an artifact, and attested to the registry beside the signature, so it stays available after the artifact expires:

```sh
cosign verify-attestation ghcr.io/sandobserver/stackyard:1.5.0 \
  --type spdxjson \
  --certificate-identity-regexp '^https://github.com/SandObserver/Stackyard/' \
  --certificate-oidc-issuer https://token.actions.githubusercontent.com
```
