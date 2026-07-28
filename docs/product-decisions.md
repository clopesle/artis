# ARTÍS Product Decisions

- Status: Public beta deployed; owner launch inputs pending
- Last updated: 2026-07-28

This is the living record of confirmed requirements, assumptions, open questions,
decisions, and rejected options for the ARTÍS web store. Suggestions from the project
brief are not treated as approved decisions until the owner confirms them.

## Current Phase

Phase 6: public beta and owner content handoff.

The static site, content model, validation, responsive UI, and GitHub Pages workflow are
implemented and deployed. Full commercial launch is gated on owner approval of final
commercial content.

## Repository Assessment

- Repository: `clopesle/artis`
- Local default branch: `main`
- Remote: `git@github.com:clopesle/artis.git`
- Current state: Astro 7 static site with automated checks and a Pages workflow
- Existing application code: mobile-first multi-page public site in `src/`
- Existing structured content: JSON content files in `src/data/`
- Existing images: two generated editorial assets in `src/assets/`
- Existing brand context: `PRODUCT.md`, `DESIGN.md`, and `.impeccable/design.json`
- Existing service information: one published Design Auricular Digital service
- Existing product information: none; the public catalog intentionally remains empty
- Existing portfolio information: none; the public portfolio intentionally remains empty
  until real work and consent are supplied
- Repository-specific agent guidance: none found

The approved logo appears in the shared brand conversation but no production-ready
vector or transparent source file has been supplied to the repository. The current
header therefore uses a carefully typeset ARTÍS wordmark rather than tracing or
fabricating the approved mark.

## Confirmed Requirements

### Product and conversion

- Build a polished, mobile-first public web store for ARTÍS.
- ARTÍS focuses on auricular styling, curated piercing jewelry, digital ear projects,
  and related products and services. The exact active catalog and service offering
  remain to be confirmed.
- The primary slogan is "Onde anatomia encontra identidade." unless the owner changes
  it.
- The site must present products, services, prices, images, descriptions, and
  availability.
- The site must showcase completed work through a maintainable portfolio.
- Customer purchases, negotiation, and appointment conversations conclude through
  WhatsApp.
- There is no payment gateway, automated checkout, mandatory customer account, or
  inventory quantity management.
- WhatsApp links must use centrally configured contact information and properly encoded,
  context-rich messages.

### Hosting and data

- The public site must be compatible with GitHub Pages and static hosting.
- GitHub is the only persistent content data source.
- Source content must live in human-readable, structured repository files, separated
  from presentation code.
- Content publications and updates must be represented by Git commits.
- No conventional backend, paid database, paid CMS subscription, or
  GitHub-Pages-incompatible server-side rendering may be required.
- Dependencies and infrastructure must remain minimal, understandable, and replaceable.

### Content management and security

- The owner needs a documented, non-developer-friendly workflow to create, edit,
  publish, hide, feature, reorder, and revert products, services, portfolio items,
  images, prices, availability, categories, descriptions, and approved site
  announcements.
- The publishing workflow must validate content before deployment and explain preview,
  commit, deployment, rollback, conflicts, and invalid-data handling.
- No personal access token, reusable write credential, or administrative secret may
  appear in the public repository or browser bundle.
- An unlinked public `/admin` route is not an authentication mechanism.
- The administration model must be agreed before an administration interface is
  implemented.

### Experience and quality

- The design must feel premium, sophisticated, feminine, editorial, intentional, and
  specific to the existing ARTÍS identity.
- All public-facing site content must be written in Brazilian Portuguese (`pt-BR`),
  including navigation, calls to action, product and service content, portfolio content,
  metadata, accessibility labels, validation messages, and customer-facing WhatsApp
  message templates.
- The site must prioritize the mobile Instagram-to-site-to-WhatsApp journey while
  remaining usable on tablets and desktop.
- Accessibility target: WCAG 2.2 AA where practical.
- Performance priorities include minimal JavaScript, responsive images, stable layout,
  efficient fonts and CSS, and fast initial rendering on mobile networks.
- Every page must provide an intentional next action.
- SEO and social sharing must include page-specific metadata, canonical URLs, Open Graph
  data, a sitemap, robots configuration, and valid structured data where applicable.
- The site should collect as little personal data as possible; analytics requires
  explicit owner approval.
- Legal guarantees and client content must not be fabricated. Draft policy language must
  be clearly marked for professional review where appropriate.

### Delivery and quality assurance

- Work proceeds in owner-reviewed phases, beginning with discovery rather than a generic
  homepage.
- Major decisions must include the owner's preference, plain-language trade-offs, a
  recommendation, a recorded outcome, and its implementation effect.
- Content must be validated during builds; broken or unpublished entries must not be
  silently published.
- Automated checks must cover valuable failure modes without adding excessive test
  infrastructure.
- GitHub Actions must eventually validate, check formatting and linting, test, build,
  and deploy only successful builds to GitHub Pages.
- The final repository must include the documentation named in the project brief,
  including architecture decisions, content management, administration security,
  deployment, troubleshooting, and release checks.
- Production must contain no accidental placeholder products, prices, testimonials,
  policies, or portfolio projects.

## Confirmed Business Context

- The primary audience is sophisticated adult women.
- The principal service is Design Auricular Digital Personalizado.
- The service is delivered online throughout Brazil.
- A consultation gathers the client's style, preferences, dislikes, and goals.
- The client receives a personalized PDF and may execute the project with a qualified
  professional of her choice.
- The working public price range is R$ 150 to R$ 200.
- Buying jewelry through ARTÍS gives a 50% discount on the project value.
- Public promotional imagery should remain clean; detail belongs in supporting copy.
- "Onde anatomia encontra identidade." is the approved institutional signature.
- "Método ARTÍS®" is not used publicly because registration status is unconfirmed.

## Open Questions

### Required before launch

- Final confirmation of the R$ 150 to R$ 200 range and 50% project discount
- Production-ready official logo asset, preferably SVG, PDF, or transparent PNG
- Professional review of the draft privacy language

### Required before publishing products or portfolio

- Confirmed jewelry names, prices, materials, availability, and owned/licensed images
- Shipping area, shipping method, fulfillment expectations, and unavailable-item policy
- Real project images, descriptions, categories, anonymity choices, and explicit consent
- Decision on whether client before-and-after imagery is appropriate

## Decisions

### Technical

- Astro 7 with static output is the selected site generator.
- JSON files in `src/data/` are the source of business content.
- Astro image processing creates responsive AVIF assets at build time.
- The production project-site base path is `/artis/`.
- GitHub Actions validates, type-checks, tests, builds, and deploys successful changes.
- Native GitHub editing is the selected administration baseline.
- No public `/admin` route or browser write credential is implemented.
- No analytics solution is installed.

### Brand

- "Onde anatomia encontra identidade." is the approved primary slogan.
- The implemented direction is "O Atelier de Precisão": warm paper, mineral neutrals,
  muted satin gold, warm graphite, architectural lines, natural skin, and restrained
  editorial photography.
- Bodoni Moda Variable and Afacad Flux Variable are self-hosted from build dependencies.
- The official logo source remains pending; the site uses a text wordmark meanwhile.

### Content

- Products, services, and portfolio are distinct maintainable content types.
- Brazilian Portuguese (`pt-BR`) is the required language for all site content.
- Required fields are enforced by `scripts/validate-content.mjs` and TypeScript content
  contracts.
- Empty products and projects are valid and produce intentional public states.
- Production contains no fabricated products, projects, testimonials, or availability.
- The implemented service and FAQ content comes from the owner's shared brand
  conversation.

## Rejected Options

These are rejected by the confirmed constraints:

- A conventional always-on backend or paid database
- A payment gateway or automated checkout
- Customer accounts as a requirement
- Inventory quantity tracking
- A CMS subscription
- Client-side storage of reusable GitHub write credentials
- Security through an obscure or unlinked administration URL
- A fake remote admin experience that cannot securely publish
- GitHub-Pages-incompatible server-side rendering
- Fabricated products, prices, testimonials, policies, or portfolio content

Other alternatives remain under evaluation and must not be described as rejected until
discovery and research establish the reason.

## Draft Definition of Done

The project is complete only when:

- The owner approves the primary customer journey and visual direction.
- Confirmed products, services, availability, prices, descriptions, and imagery are
  accurate.
- Portfolio content can be created and maintained with appropriate permissions.
- All approved pages and direct URLs work under the final GitHub Pages base path.
- WhatsApp calls to action open valid, contextual, correctly encoded messages.
- GitHub remains the sole persistent content source, and every publication creates a
  commit.
- The owner can perform a supervised content update using the documented workflow.
- Content validation prevents broken entries from deploying.
- No administrative secret is exposed.
- Responsive, accessibility, performance, SEO, social-sharing, and privacy requirements
  pass the agreed release checks.
- Deployment and rollback are documented and verified.
- Production contains no accidental placeholder content.
- The release checklist is complete and the owner approves launch.

This definition will be refined with measurable acceptance criteria during discovery.

## Risks

- The official logo source is missing, so the current wordmark is provisional.
- The official WhatsApp number is configured centrally and used by contextual actions.
- GitHub Pages is enabled with GitHub Actions as its source and the public beta is live
  at `https://clopesle.github.io/artis/`.
- Product and portfolio imagery will dominate perceived quality and mobile performance;
  source-image standards are not yet known.
- Client-image permissions and legal policies are unresolved.
- Catalog scale is unknown, so search, filters, sorting, and a multi-item inquiry list
  remain intentionally unimplemented.

## Change History

### 2026-07-28

- Inspected the owner's public shared brand-development conversation.
- Confirmed the business model, audience, online service area, primary service, working
  price range, project ownership, purchase benefit, slogan, and visual direction.
- Selected Astro static output with repository-managed JSON content.
- Implemented the responsive public site, service page, catalog and portfolio empty
  states, privacy page, 404 page, SEO, structured data, sitemap, and robots file.
- Added automated content validation, type checks, tests, formatting, image
  optimization, and GitHub Pages deployment workflow.
- Recorded the remaining official-logo, legal-review, and commercial-approval launch
  gates.
- Enabled GitHub Pages through the repository setting supplied by the owner and verified
  successful production deployments.
- Created the initial living decision log.
- Recorded the repository as empty and inventoried missing project assets.
- Transcribed confirmed constraints from the project brief.
- Separated confirmed requirements from suggested features.
- Added Round 1 and later-round discovery questions.
- Deferred architecture, administration, data-model, and visual decisions pending owner
  input and current-source research.
- Confirmed Brazilian Portuguese (`pt-BR`) as the required language for all
  public-facing site content.
- The initial private `/c/` URL was inaccessible; the replacement public `/share/` URL
  was successfully inspected.
