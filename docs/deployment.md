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

## Protected administration

The `/admin/` page is static, but authentication and GitHub API writes pass through the
Cloudflare Worker in `admin-worker/`. This separation is required because GitHub Pages
cannot keep a client secret or access token private.

### 1. Create the GitHub App

Create a GitHub App under the GitHub account that owns the integration:

- Homepage URL: `https://clopesle.github.io/artis/`
- Callback URL:
  `https://artis-admin-bridge.<cloudflare-subdomain>.workers.dev/auth/callback`
- Expire user authorization tokens: enabled
- Repository permission **Contents**: read and write
- Repository permission **Metadata**: read-only
- Installation: only `clopesle/artis`

Generate one client secret. Keep the secret outside the repository. The Client ID is
public configuration and belongs in `admin-worker/wrangler.toml`.

### 2. Create the Worker resources

Authenticate Wrangler and create the short-lived session store:

```bash
npx wrangler login
npx wrangler kv namespace create SESSIONS --config admin-worker/wrangler.toml
```

Copy the returned namespace ID into `admin-worker/wrangler.toml`. Replace:

- `BRIDGE_URL` with the final `workers.dev` HTTPS origin
- `GITHUB_CLIENT_ID` with the GitHub App Client ID
- the `SESSIONS` namespace `id`

Set the two encrypted Worker secrets. Wrangler prompts for each value and does not write
it to the repository:

```bash
npx wrangler secret put GITHUB_CLIENT_SECRET --config admin-worker/wrangler.toml
npx wrangler secret put STATE_SECRET --config admin-worker/wrangler.toml
```

Use the GitHub App client secret for the first value and a cryptographically random
value of at least 32 bytes for the second.

Deploy the bridge:

```bash
npm run admin:deploy
```

### 3. Connect GitHub Pages

Add this repository Actions variable:

```text
PUBLIC_ADMIN_BRIDGE_URL=https://artis-admin-bridge.<cloudflare-subdomain>.workers.dev
```

Then run **Deploy GitHub Pages** or push to `main`. The public admin bundle receives
only this non-secret URL.

### 4. Enable bridge automation

For `.github/workflows/deploy-admin-worker.yml`, add:

- Actions secret `CLOUDFLARE_API_TOKEN`
- Actions secret `CLOUDFLARE_ACCOUNT_ID`
- Actions variable `ADMIN_BRIDGE_CONFIGURED=true`

The API token should be restricted to the account and permissions needed to edit Workers
scripts and bindings. Worker secrets remain encrypted in Cloudflare and are not copied
into the GitHub Actions workflow.

### 5. Acceptance check

1. Open `https://clopesle.github.io/artis/admin/`.
2. Sign in with GitHub.
3. Confirm that an account without repository write permission is refused.
4. Edit a harmless text field and save.
5. Confirm the new commit on `main` and the subsequent Pages deployment.
6. Search a provider, import a reviewed item, and confirm it arrives unpublished,
   without provider identity or price.

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
