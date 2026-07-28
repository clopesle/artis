# Administration Security

## Current model

There is no public administration application. Authorized owners edit repository files
through GitHub using their own accounts and repository permissions.

This is intentional.

## Why there is no `/admin`

GitHub Pages serves public static files. An unlinked page is still public, and browser
JavaScript cannot safely contain a reusable GitHub write token. A client-only admin page
would either be unable to publish or would expose repository credentials.

ARTÍS therefore does not implement:

- a hidden admin URL
- a password stored in JavaScript
- a personal access token in the repository
- a GitHub token in browser storage
- a fake editor that implies secure publishing

## Authentication and authorization

GitHub owns authentication. Each editor should:

- use an individual GitHub account
- enable two-factor authentication
- receive only the repository role they need
- avoid sharing accounts or tokens
- remove access promptly when responsibilities change

Branch protection and required pull-request review are recommended when more than one
person publishes content.

## Secrets

The WhatsApp number is business contact data, not an authentication secret. It should be
stored as the GitHub Actions repository variable `PUBLIC_WHATSAPP_NUMBER`.

No write credential is needed at build or runtime. GitHub's deployment token is created
for each Actions run and never enters the browser bundle.

The customer sacola uses browser `localStorage` only for public item labels and
quantities. It contains no supplier mapping, product cost, personal data, or write
credential. Checkout is a prefilled `wa.me` link; the website does not transmit or
retain the message.

## Future friendly editor

If repository editing becomes too difficult, evaluate a GitHub App based CMS or a local
form utility. Do not introduce one until its permissions, authentication service, commit
behavior, provider dependency, and rollback workflow are reviewed.

Any future editor must preserve GitHub as the source of truth and create auditable
commits.
