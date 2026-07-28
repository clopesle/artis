# Administration Security

## Current model

The static `/admin/` application authenticates through a minimal OAuth bridge. GitHub
owns the user identity, and the bridge verifies write access to `clopesle/artis` before
creating an administrative session.

GitHub Pages serves the interface, but never receives an OAuth client secret or a GitHub
access token. The bridge stores the GitHub token server-side and gives the browser only
a short-lived opaque session identifier in `sessionStorage`.

ARTÍS does not implement:

- a hidden URL as an access-control mechanism
- a password stored in JavaScript
- a personal access token in the repository
- a GitHub access token in browser storage
- unrestricted proxy access to GitHub or arbitrary external URLs

## Authentication and authorization

GitHub owns authentication. Each editor must:

- use an individual GitHub account
- enable two-factor authentication
- have `push` or `admin` permission on `clopesle/artis`
- avoid sharing accounts or tokens
- remove access promptly when responsibilities change

Branch protection and required pull-request review are recommended when more than one
person publishes content.

## Secrets

The WhatsApp number is business contact data, not an authentication secret. It should be
stored as the GitHub Actions repository variable `PUBLIC_WHATSAPP_NUMBER`.

The OAuth client secret, session signing secret, and GitHub access tokens exist only in
the bridge environment. They must never be configured as `PUBLIC_*` variables or GitHub
Pages build variables.

The customer sacola uses browser `localStorage` only for public item labels and
quantities. It contains no supplier mapping, product cost, personal data, or write
credential. Checkout is a prefilled `wa.me` link; the website does not transmit or
retain the message.

## Repository and provider boundaries

The bridge accepts writes only for the structured content files, the provider
configuration, and `src/assets/catalog/`. Every write creates an auditable commit and
uses the current file SHA to prevent silent overwrites.

Provider catalog requests are restricted to supported HTTPS hosts. Search results are
filtered for the permitted jewelry materials and imported as unpublished drafts.
