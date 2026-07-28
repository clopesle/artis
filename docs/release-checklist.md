# Release Checklist

## Business content

- [x] Official WhatsApp number is configured and tested
- [ ] R$ 150 to R$ 200 range is approved for public display
- [ ] 50% project discount with jewelry purchase is approved
- [ ] Official production logo replaces the provisional text wordmark if supplied
- [ ] Service wording and FAQ answers are owner-approved
- [ ] No invented testimonial, product, project, price, or availability is present

## Products and portfolio

- [ ] Every published product has confirmed name, material, price, availability, and
      owned or licensed images
- [ ] Every published project has explicit image and story consent
- [ ] Client identity and anatomy are represented accurately
- [ ] No location or other unnecessary metadata remains in client images
- [ ] Empty catalog and portfolio states remain in place if real content is unavailable

## Contact and customer journey

- [ ] Every primary action opens the official WhatsApp number
- [ ] Messages are correctly encoded and describe the originating context
- [ ] Mobile sticky action does not cover important content
- [ ] Every page has a clear next action
- [ ] Instagram profile links to the final HTTPS URL

## GitHub Pages

- [x] Repository administrator enabled Pages with GitHub Actions as source
- [x] Latest **Deploy GitHub Pages** workflow is green
- [x] Production opens at `/artis/`
- [x] Direct service, jewelry, project, privacy, and 404 routes work
- [x] CSS, fonts, images, favicon, sitemap, and robots file load under the base path
- [ ] Rollback through a revert commit has been understood by the owner

## Quality

- [ ] `npm run verify` passes from a clean install
- [ ] Content validation reports the expected item counts
- [ ] No root-relative link escapes the `/artis/` base
- [ ] Keyboard navigation and focus states have been checked
- [ ] Mobile menu and FAQ disclosures work without pointer precision
- [ ] Reduced-motion behavior has been checked
- [ ] Desktop and mobile hero crops have been reviewed
- [ ] Meaningful images have Brazilian Portuguese alternative text
- [ ] Heading order and landmarks are logical
- [ ] There is no horizontal scrolling from 320px upward

## SEO, privacy, and legal

- [ ] Page titles and descriptions are approved
- [ ] Canonical URLs use the final production origin
- [ ] Open Graph image and description are reviewed in a sharing debugger
- [ ] Sitemap and robots URLs use the production base path
- [ ] Structured service price range matches approved commercial terms
- [ ] Draft privacy page received professional review
- [ ] No analytics or tracking was added without explicit approval

## Owner sign-off

- [ ] Owner completed one supervised content edit
- [ ] Owner can find failed workflow details
- [ ] Owner can revert a content commit
- [ ] Owner approved visual direction and customer-facing Brazilian Portuguese copy
- [ ] Owner approved launch
