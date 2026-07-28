# Troubleshooting

## The workflow says Pages is not enabled

Symptom:

```text
Get Pages site failed: Not Found
```

or:

```text
Create Pages site failed: Resource not accessible by integration
```

Resolution: a repository administrator must set **Settings → Pages → Source** to
**GitHub Actions**.

## WhatsApp buttons return to the contact section

The business number is not configured.

Create the repository Actions variable `PUBLIC_WHATSAPP_NUMBER` using digits only:

```text
55 + DDD + número
```

Re-run the workflow or push a new commit.

## JSON validation fails

Read the first error from `npm run validate:content`. Common causes:

- missing comma
- duplicated `id` or `slug`
- uppercase or spaces in a slug
- missing required service field
- phone number containing punctuation

Use a JSON-aware editor and keep the content unpublished until the build passes.

## A route or image works locally but not on Pages

Check for root-relative paths that omit `/artis/`. Internal links must use
`src/lib/paths.ts`, and images should be imported through Astro rather than written as
manual `/_astro/...` paths.

Run:

```bash
npm run build
rg 'href="/(?!artis)|src="/(?!artis)' dist -g '*.html' --pcre2
```

The search should return nothing.

## A client image looks soft or crops badly

- confirm the source is at least 1600px on the long edge
- preserve the original image in `src/assets/`
- provide a meaningful `sizes` attribute
- inspect both mobile and desktop crops
- never upscale a small image merely to satisfy dimensions

## The page flashes without reveal content

Content is present in HTML and reveals when it enters the viewport. Reduced-motion users
receive content immediately. If a hero visual is affected, remove `data-reveal` from the
above-the-fold image; critical imagery must never depend on observation timing.

## Astro tries to write outside the repository

All project scripts set `ASTRO_TELEMETRY_DISABLED=1`. Run the npm scripts rather than
calling the Astro binary directly.

## Dependency installation fails

Use Node.js 24 and the committed lockfile:

```bash
node --version
npm ci
```

Do not use `--force` or `--legacy-peer-deps`; fix the incompatible version instead.
