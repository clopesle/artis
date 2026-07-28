# ARTÍS Reference Research

Status: Preliminary Phase 1 research  
Last updated: 2026-07-28

This document will grow during Phase 3. The initial pass is intentionally limited to
establishing feasible GitHub Pages architectures and secure Git-native editing options.
It is not a final recommendation or an architecture decision record.

## Research Method

- Prefer official documentation and primary project repositories for technical claims.
- Check recent releases, licensing, GitHub Pages compatibility, authentication, and
  credential implications before recommending a tool.
- Treat hosted editing convenience and GitHub-only infrastructure as separate concerns;
  a static public site does not make a remote editor static or secure by default.
- Re-check version and security status immediately before adoption.

## Hosting Baseline

### GitHub Pages

URL:
<https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages>

Relevant findings:

- GitHub Pages publishes static HTML, CSS, and JavaScript from a repository and can use
  a build process.
- A project site defaults to `https://<owner>.github.io/<repository-name>/`, so routing,
  canonical URLs, images, and internal links must work under a repository base path.
- A custom domain is possible, but the domain decision should not be assumed during
  initial implementation.

Implication for ARTÍS:

- Static generation is compatible with the hosting constraint.
- Base-path behavior and direct-page loading must be explicit acceptance tests.
- Deployment can remain inside GitHub Actions without introducing a runtime backend.

## Candidate Site Architectures

### Astro with static output

Official sources:

- <https://docs.astro.build/en/guides/deploy/github/>
- <https://github.com/withastro/astro>

Current status observed on 2026-07-28:

- Active project with 2026 releases and commits.
- MIT-licensed.
- Official GitHub Pages deployment guidance and an official deployment action are
  available.

Strengths for ARTÍS:

- Designed for content-driven sites and produces static, prerendered output.
- Built-in content collections can support schema-validated repository content.
- Built-in image tooling and generated routes fit a visual product and portfolio
  catalog.
- Interactive behavior can remain limited to specific client-side features.
- Official guidance covers GitHub Pages `site` and `base` configuration.

Costs and cautions:

- More framework concepts and dependencies than plain HTML or a minimal template
  generator.
- Repository-base links still require deliberate implementation.
- Framework image processing must be verified against repository-managed source images
  and the chosen editing workflow.
- Current major-version support and upgrade policy must be checked when the stack is
  selected.

Preliminary fit:

- Strong candidate if the approved catalog needs validated content collections, many
  generated detail pages, and image optimization.
- Not yet selected.

### Eleventy

Official sources:

- <https://www.11ty.dev/docs/deployment/>
- <https://github.com/11ty/eleventy>

Current status observed on 2026-07-28:

- Active project with a March 2026 release and ongoing 2026 activity.
- MIT-licensed.
- Official documentation provides a GitHub Actions/GitHub Pages deployment path.

Strengths for ARTÍS:

- Small, template-oriented static generator with low client-side JavaScript by default.
- Accepts several human-readable content and template formats.
- Generates plain static output and has a documented GitHub Pages path-prefix workflow.
- Potentially easier for a future developer who prefers conventional templates.

Costs and cautions:

- Content schema validation is less integrated and would need a deliberate, separately
  maintained validation layer.
- Image optimization and type-safe content relationships require more assembly than
  Astro.
- Template-format flexibility can become inconsistency unless the project chooses and
  documents one narrow convention.

Preliminary fit:

- Strong candidate if the final catalog is modest and the team values the smallest
  framework surface over integrated content and image tooling.
- Not yet selected.

### Plain HTML, CSS, and JavaScript

Primary compatibility source:

- <https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages>

Strengths for ARTÍS:

- Minimal dependency and framework footprint.
- Direct compatibility with GitHub Pages.
- Maximum control over markup, accessibility, CSS, and runtime JavaScript.

Costs and cautions:

- Repeated product, service, and portfolio detail pages would require custom build
  scripting or manual duplication.
- Structured-content validation, image pipelines, sitemap generation, and cross-content
  relationships would become bespoke infrastructure.
- The apparent simplicity can shift complexity into undocumented custom code.

Preliminary fit:

- Remains a comparison baseline.
- Likely appropriate only if discovery reduces the site to a very small catalog without
  many generated detail pages.

## Candidate Content-Management Workflows

### Native GitHub repository editing

Primary source:

- <https://docs.github.com/en/repositories/working-with-files/managing-files/editing-files>

Security and data model:

- Editors authenticate with their own GitHub accounts and repository permissions.
- Content and media stay in the repository.
- Saves create commits through GitHub's normal interface.
- No site-specific OAuth service or browser-embedded write token is needed.

Strengths for ARTÍS:

- Lowest infrastructure and maintenance burden.
- Direct Git history, branch, review, and rollback behavior.
- Best match for the strictest interpretation of GitHub as the only persistent data
  source.

Costs and cautions:

- The least friendly option for a nontechnical owner.
- Structured YAML, JSON, or frontmatter errors remain possible unless the workflow uses
  careful templates and CI validation.
- Uploading, naming, sizing, and referencing images require clear instructions.

Preliminary fit:

- Security and architecture baseline.
- Recommended default if the owner is comfortable with GitHub's web interface and
  content changes are infrequent.

### Local form utility that exports repository files

Security and data model:

- Runs locally and needs no remote authentication.
- Produces validated content and image files for the repository.
- Publishing still happens through GitHub Desktop, GitHub's web interface, or Git.

Strengths for ARTÍS:

- Can provide purpose-built forms and validation without exposing credentials.
- Git remains the persistent source of truth.
- No hosted CMS dependency or remote authentication service is required.

Costs and cautions:

- Export, upload/commit, preview, and publish are separate owner steps.
- Local installation and updates must be documented.
- It is not a remote web admin and must not be presented as one.

Preliminary fit:

- Strong candidate if the owner needs friendly forms but can tolerate a local publishing
  step.

### Pages CMS

Official sources:

- <https://pagescms.org/docs/>
- <https://pagescms.org/docs/development/authentication/>
- <https://pagescms.org/docs/guides/installing/github-app/>
- <https://github.com/pages-cms/pagescms>

Current status observed on 2026-07-28:

- Active project with an April 2026 release.
- MIT-licensed.
- Hosted and self-hosted modes are documented.

Security and data model:

- Edits content and media files directly in a GitHub repository; it does not introduce a
  separate content database.
- Uses GitHub user tokens or GitHub App installation tokens for repository reads and
  writes.
- Self-hosting requires a GitHub App, callback and webhook endpoints, environment
  secrets, and broad enough repository permissions to write content.

Strengths for ARTÍS:

- Form-based editing and media management without moving content out of Git.
- Saves flow back to GitHub, preserving commit-based publication.
- Configuration lives in the repository.

Costs and cautions:

- The hosted service is an additional operational dependency even though GitHub remains
  the content store.
- Self-hosting introduces an authenticated application, secrets, webhooks, and
  infrastructure that conflict with the project's simplicity goal.
- GitHub App permission scope, commit behavior, provider trust, owner access, and
  rollback must receive a full security review before selection.

Preliminary fit:

- Feasible form-based option if the owner strongly prefers browser forms and accepts a
  hosted editing dependency.
- Not yet approved or recommended.

### Decap CMS

Official sources:

- <https://decapcms.org/docs/intro/>
- <https://decapcms.org/docs/github-backend/>
- <https://github.com/decaporg/decap-cms>
- <https://github.com/decaporg/decap-cms/security>

Current status observed on 2026-07-28:

- Version 3.x is actively supported; versions 1.x and 2.x are unsupported.
- Recent April 2026 3.x release and ongoing project activity.
- MIT-licensed and community-maintained.

Security and data model:

- Provides an editor application over Git-stored content.
- Direct GitHub backend users need repository push access.
- GitHub authentication requires a server-side OAuth flow; the official documentation
  describes Netlify-facilitated authentication.
- Decap delegates authentication to providers and documents community-maintained
  security limitations and legacy dependency risk.

Strengths for ARTÍS:

- Mature form-based editing model for Git-backed static sites.
- Supports configurable content collections, media, and editorial workflows.

Costs and cautions:

- A static `/admin` page alone is not sufficient; secure GitHub authentication adds an
  external OAuth service or separately hosted function.
- The common Netlify authentication path conflicts with a strict GitHub-only
  infrastructure interpretation.
- Editor access requires repository write permissions and careful provider
  configuration.
- Only current 3.x releases should be considered.

Preliminary fit:

- Technically feasible, but not the simplest default under the confirmed constraints.
- Keep as a comparison option only if the owner needs its editing experience and accepts
  the authentication dependency.

### Custom browser-based GitHub API publisher

Primary security constraint:

- A reusable privileged token cannot be safely embedded in a public GitHub Pages bundle.

Implication for ARTÍS:

- A secure remote publisher needs an OAuth/GitHub App server-side component or
  private/local execution.
- Building a custom hosted authentication layer would duplicate mature tools and violate
  the "least infrastructure" principle.

Preliminary fit:

- Reject a public client-only publisher.
- Consider only a local utility or an established, reviewed GitHub App if discovery
  proves the simpler workflows unusable.

## Preliminary Comparison

| Option       | GitHub Pages  | Content validation         | Image support       | Complexity                   | Status    |
| ------------ | ------------- | -------------------------- | ------------------- | ---------------------------- | --------- |
| Astro static | Official path | Integrated content schemas | Integrated tooling  | Moderate                     | Candidate |
| Eleventy     | Official path | Add separately             | Plugin/custom setup | Low to moderate              | Candidate |
| Plain static | Native        | Custom                     | Custom/manual       | Low initially, bespoke later | Baseline  |

| Editing workflow        | Browser forms | Extra authentication service   | Git commits           | Preliminary status        |
| ----------------------- | ------------- | ------------------------------ | --------------------- | ------------------------- |
| GitHub web editor       | No            | No                             | Yes                   | Security default          |
| Local export utility    | Yes, local    | No                             | Separate publish step | Candidate                 |
| Pages CMS hosted        | Yes           | Yes, hosted GitHub integration | Yes                   | Candidate with review     |
| Decap GitHub backend    | Yes           | Yes, OAuth path                | Yes                   | Higher-friction candidate |
| Custom public API admin | Yes           | Required to be secure          | Possible              | Reject client-only form   |

## Preliminary Recommendation to Test in Discovery

Do not choose a framework or CMS yet.

1. Ask the owner to describe their actual editing frequency, devices, GitHub comfort,
   and tolerance for preview/publish steps.
2. Use native GitHub editing as the security and maintenance baseline.
3. Consider a local form utility if browser forms are important but external
   authentication is unacceptable.
4. Evaluate Pages CMS only if fully remote form editing is important enough to justify a
   hosted GitHub integration.
5. Keep Decap CMS as a mature comparison, not the default, because GitHub authentication
   adds infrastructure outside a static Pages deployment.
6. Compare Astro and Eleventy after catalog scale, image volume, content relationships,
   and owner workflow are known.

## Research Still Required in Phase 3

- Brazilian and international boutique jewelry and piercing references
- Auricular styling and ear-curation service references
- Beauty-service portfolios and consent patterns
- Instagram-first mobile catalogs and WhatsApp conversion patterns
- Accessible product filtering and catalog patterns
- Mobile performance and image-treatment observations
- Product-card, navigation, detail-page, and portfolio behaviors
- High-converting but non-aggressive WhatsApp calls to action
- License, maintenance, and security re-check for the shortlisted stack
- Preview, validation, and branch workflow options after the owner identifies the
  publishing model

## Change History

### 2026-07-28

- Added the Phase 1 hosting, architecture, and content-management feasibility pass.
- Confirmed Astro, Eleventy, and plain static output as comparison candidates.
- Recorded native GitHub editing and a local export utility as low-infrastructure
  baselines.
- Recorded authentication and infrastructure implications for Pages CMS and Decap CMS.
- Deferred visual and conversion reference research to Phase 3.
