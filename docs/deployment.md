# Deployment

## Production target

The repository is `clopesle/artis`. Without a custom domain, the expected project-site
URL is:

```text
https://clopesle.github.io/artis/
```

The build uses `/artis/` as its base path.

## One-time repository configuration

A repository administrator has completed the Pages source setting. For a new repository
or a reset configuration:

1. Open **Settings → Pages**.
2. Under **Build and deployment**, set **Source** to **GitHub Actions**.
3. Open **Settings → Secrets and variables → Actions → Variables**.
4. Create `PUBLIC_WHATSAPP_NUMBER`.
5. Enter only digits, including `55`, DDD, and the phone number.

GitHub Pages was enabled on 2026-07-28 with **GitHub Actions** as the source. The
authenticated implementation account has `WRITE`, not `ADMIN`, permission, so only an
administrator can change this setting later.

## Automatic deployment

Every push to `main` starts `.github/workflows/deploy-pages.yml`.

The workflow:

1. checks out the exact commit
2. configures the Pages origin and base path
3. installs pinned dependencies with `npm ci`
4. runs formatting, content validation, type checks, tests, and the static build
5. uploads `dist/` as the Pages artifact
6. deploys the saved artifact

Only a successful build reaches production.

## Local production verification

```bash
npm ci
npm run verify
npm run preview
```

The local preview appears under:

```text
http://localhost:4321/artis/
```

## Custom domain

When a domain is approved:

1. configure the domain in GitHub Pages
2. set `CUSTOM_DOMAIN=1`
3. set `SITE_URL` to the final HTTPS origin
4. set `BASE_PATH=/`
5. rebuild and verify canonical, sitemap, asset, and internal-link URLs

Do not add a `CNAME` file before the owner controls the DNS.

## Rollback

Use a normal revert commit on `main`. The workflow deploys the reverted source as a new
auditable version. Do not force-push or rewrite public history.
