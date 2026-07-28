# Architecture

## Decision

ARTÍS is a statically generated Astro site hosted from the same GitHub repository
through GitHub Pages.

## Why Astro

The site needs reusable layouts, responsive image generation, structured content,
generated detail routes, SEO files, and base-path-safe links. Plain HTML would make
those features manual, while a runtime framework would add a server that the project
neither needs nor permits.

Astro produces only static HTML, CSS, JavaScript, fonts, and images in `dist/`.

## Main boundaries

```text
src/data/          Business content owned by ARTÍS
src/assets/        Source imagery committed to Git
src/components/    Reusable interface and brand patterns
src/layouts/       Page metadata, navigation, footer, and global behavior
src/pages/         Public routes generated at build time
src/lib/           Contact links, path helpers, and content contracts
scripts/           Build-time validation
```

Presentation files may read content files. Content files never import presentation code.

## Data and persistence

GitHub is the only persistent business-content source. There is no database, customer
account, payment checkout, or browser-based write credential. Every content publication
is a Git commit.

The customer sacola is temporary browser state stored under `artis-cart-v1` in
`localStorage`. It contains only selected item identifiers, public labels, and
quantities. It never stores personal data, supplier information, credentials, or prices.

The main structured files are:

- `src/data/site.json`
- `src/data/services.json`
- `src/data/products.json`
- `src/data/projects.json`
- `src/data/faqs.json`

The build fails when JSON is invalid, required service data is missing, identifiers or
slugs are duplicated, or contact formatting is invalid.

## Routing

Astro generates trailing-slash routes. The production repository base path is `/artis/`.
All internal links pass through `src/lib/paths.ts`; imported styles, fonts, and images
are rewritten by Astro.

The build also generates:

- `404.html`
- `robots.txt`
- `sitemap-index.xml`
- canonical URLs
- Open Graph and Twitter metadata
- JSON-LD `ProfessionalService` data

## Client-side JavaScript

The site ships small scripts for reveal transitions, mobile-menu behavior, catalog
search, category filtering, and the local sacola. Navigation, FAQ disclosures, and all
catalog content remain readable without application JavaScript. Search and the sacola
require JavaScript and provide explicit fallback copy.

## Images

Original raster images are committed under `src/assets/`. Astro and Sharp generate
responsive AVIF variants. Meaningful images require Brazilian Portuguese alternative
text. Portfolio imagery must not be committed without documented publication consent.

## Alternatives not selected

- Eleventy remains a viable lightweight alternative, but would require more custom image
  and schema infrastructure.
- Plain HTML would shift route, sitemap, validation, and image work into custom scripts.
- A runtime backend would violate the GitHub Pages and minimal-infrastructure
  constraints.
