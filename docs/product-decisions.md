# ARTÍS Product Decisions

Status: Discovery in progress  
Last updated: 2026-07-28

This is the living record of confirmed requirements, assumptions, open questions,
decisions, and rejected options for the ARTÍS web store. Suggestions from the project
brief are not treated as approved decisions until the owner confirms them.

## Current Phase

Phase 1: repository and context assessment.

Major architecture, visual design, data-model, and administration decisions are gated on
owner discovery.

## Repository Assessment

- Repository: `clopesle/artis`
- Local default branch: `main`
- Remote: `git@github.com:clopesle/artis.git`
- Current state: empty repository with no commits or tracked files
- Existing application code: none found
- Existing structured content or catalog data: none found
- Existing images: none found
- Existing brand assets or brand manual: none found
- Existing product information: none found
- Existing service information: none found
- Existing portfolio information: none found
- Repository-specific agent guidance: none found

This inventory describes only the files currently available in the repository. It does
not imply that ARTÍS has no assets or content elsewhere.

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

## Assumptions Pending Confirmation

- Prices are likely denominated in Brazilian real.
- Most initial visits will originate from the ARTÍS Instagram profile on mobile devices.
- The owner may have brand and catalog assets outside this repository.
- A static-site generator is likely useful because the catalog needs validated
  structured content and generated detail pages, but no framework has been chosen.

## Open Questions

### Round 1: highest-impact discovery

- What products does ARTÍS currently sell, and which product categories are active?
- What services does ARTÍS currently offer? Which are digital and which are in person?
- What geographic area is served, and can products be shipped?
- Which offering is strategically most important to feature first?
- What single action should most visitors take first: inquire about a product, request
  an auricular project, book a consultation, or another action?
- Should visitors contact WhatsApp directly from each item, or first build a client-side
  selection of multiple items?
- How comfortable is the owner with GitHub, repository files, forms, image uploads,
  commits, pull requests, previews, and GitHub Actions?
- Does the owner prefer the simplest GitHub web editing workflow, a secure Git-based
  form interface, or a local form utility that exports repository files?
- What official logos, logo variants, colors, fonts, brand guidelines, photography,
  Instagram layouts, catalog files, price lists, service descriptions, and portfolio
  images already exist, and how will they be supplied?

### Later discovery rounds

- Brand positioning, audience, differentiators, desired and prohibited brand attributes,
  visual references, and tone of voice
- Full product taxonomy, attributes, variants, pricing labels, availability states,
  search/filter needs, unavailable-item behavior, and related content
- Full service model, delivery formats, duration, pricing, requirements, process,
  preparation, aftercare, deposits, disclaimers, and detail-page needs
- Homepage priority and complete Instagram-to-WhatsApp customer journey
- Portfolio permissions, anonymity, metadata, categories, before-and-after use,
  watermarks, cropping, filtering, and featured behavior
- WhatsApp number, message wording, inquiry-flow variants, and interest-list terminology
- Site map, content depth, FAQs, testimonials, educational content, business hours,
  shipping, appointment, and legal-policy requirements
- Primary and secondary languages, currency, brand grammatical voice, and preferred
  terminology. Brazilian Portuguese is confirmed for all site content; the need for any
  additional language remains unresolved.
- Domain, GitHub Pages repository path, preview expectations, publishing roles, branch
  protection, and rollback responsibilities

## Decisions

### Technical

- No final framework or content format has been selected.
- No administration or authentication approach has been selected.
- No analytics solution has been selected.
- The initial technical comparison must include at least two lightweight static
  architectures and must use current primary-source evidence.

### Brand

- "Onde anatomia encontra identidade." is the working primary slogan.
- No palette, type system, photography direction, or final visual direction has been
  approved.

### Content

- Products, services, and portfolio are distinct maintainable content types.
- Brazilian Portuguese (`pt-BR`) is the required language for all site content.
- Exact fields and required attributes remain subject to owner approval.
- Sample data, if later needed for development, must be explicitly labelled and must not
  be mistaken for production content.

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

- No real brand, catalog, service, portfolio, or policy content is currently available
  in the repository.
- A friendly remote editor and a strict GitHub-only security model can conflict; the
  owner workflow must determine whether repository editing, a Git-based CMS, or a local
  utility is appropriate.
- GitHub Pages project-site base paths can break routes and assets unless tested
  explicitly.
- Product and portfolio imagery will dominate perceived quality and mobile performance;
  source-image standards are not yet known.
- Client-image permissions and legal policies are unresolved.
- Catalog scale is unknown, so search, filters, sorting, and a multi-item inquiry list
  cannot yet be justified.

## Change History

### 2026-07-28

- Created the initial living decision log.
- Recorded the repository as empty and inventoried missing project assets.
- Transcribed confirmed constraints from the project brief.
- Separated confirmed requirements from suggested features.
- Added Round 1 and later-round discovery questions.
- Deferred architecture, administration, data-model, and visual decisions pending owner
  input and current-source research.
- Confirmed Brazilian Portuguese (`pt-BR`) as the required language for all
  public-facing site content.
- Attempted to inspect the owner's referenced private ChatGPT conversation, but its
  `/c/` URL was not accessible outside the owner's authenticated session.
