---
name: ARTÍS
description: Onde anatomia encontra identidade.
colors:
  cotton-paper: "oklch(97.2% 0.012 77)"
  raised-paper: "oklch(99% 0.006 78)"
  champagne-paper: "oklch(93.2% 0.024 74)"
  mineral-linen: "oklch(86.4% 0.035 67)"
  satin-gold: "oklch(65% 0.075 72)"
  mineral-bronze: "oklch(46% 0.065 61)"
  warm-graphite: "oklch(25.5% 0.018 54)"
  muted-graphite: "oklch(47% 0.026 56)"
  focus-copper: "oklch(53% 0.12 58)"
typography:
  display:
    fontFamily: "Bodoni Moda Variable, Iowan Old Style, serif"
    fontSize: "clamp(3.45rem, 12vw, 9.5rem)"
    fontWeight: 430
    lineHeight: 0.84
    letterSpacing: "-0.045em"
  displayDesktop:
    fontSize: "clamp(4.5rem, 7vw, 7rem)"
  headline:
    fontFamily: "Bodoni Moda Variable, Iowan Old Style, serif"
    fontSize: "clamp(2.65rem, 7vw, 6rem)"
    fontWeight: 430
    lineHeight: 0.94
    letterSpacing: "-0.04em"
  headlineDesktop:
    fontSize: "clamp(3.15rem, 4.5vw, 4.75rem)"
  title:
    fontFamily: "Bodoni Moda Variable, Iowan Old Style, serif"
    fontSize: "clamp(1.9rem, 4vw, 3.4rem)"
    fontWeight: 460
    lineHeight: 1
    letterSpacing: "-0.025em"
  titleDesktop:
    fontSize: "clamp(2rem, 2.5vw, 2.5rem)"
  body:
    fontFamily: "Afacad Flux Variable, Helvetica Neue, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.55
  bodyDesktop:
    rootFontSize: "17px"
  label:
    fontFamily: "Afacad Flux Variable, Helvetica Neue, sans-serif"
    fontSize: "0.74rem"
    fontWeight: 680
    lineHeight: 1.1
    letterSpacing: "0.115em"
rounded:
  precise: "0.35rem"
  tactile: "0.9rem"
  pill: "999px"
spacing:
  touch-target: "3.25rem"
  section-mobile: "3.5rem"
  section-fluid: "clamp(3.5rem, 7vw, 6rem)"
components:
  button-primary:
    backgroundColor: "{colors.warm-graphite}"
    textColor: "{colors.cotton-paper}"
    rounded: "{rounded.pill}"
    padding: "0.8rem 1.15rem"
    height: "{spacing.touch-target}"
  button-secondary:
    backgroundColor: "{colors.cotton-paper}"
    textColor: "{colors.warm-graphite}"
    rounded: "{rounded.pill}"
    padding: "0.8rem 1.15rem"
    height: "{spacing.touch-target}"
  image-surface:
    backgroundColor: "{colors.mineral-linen}"
    rounded: "{rounded.tactile}"
---

# Design System: ARTÍS

## Overview

**Creative North Star: "O Atelier de Precisão"**

ARTÍS feels like a quiet digital consultation where anatomy, jewelry, and identity
receive equal attention. Tactile pale surfaces and real skin create warmth; measured
spacing, architectural lines, and concise language establish authority.

The system is premium without ostentation. It uses a strict asymmetrical grid, one
dominant idea per viewport, and a light editorial rhythm because that language is
already part of the approved identity. It rejects both the dark, hard-edged vocabulary
of generic piercing studios and predictable luxury made from beige panels, gold effects,
and ornamental excess.

**Key Characteristics:**

- Warm daylight, tactile paper, stone, and real skin texture
- Thin construction lines used as evidence of process
- Strong asymmetric typography balanced by quiet negative space
- Compact storefront density: shallow sections and three-column desktop object grids
- One decisive photograph instead of repeated decorative imagery
- Mobile-first pacing for an Instagram-to-WhatsApp journey
- Choreographed reveals with an immediate reduced-motion fallback

## Colors

The palette uses warm mineral neutrals as physical surfaces, not generic beige. Satin
gold marks precision, while graphite carries text and decisive actions.

### Primary

- **Satin Gold:** Used for drafting marks, investment surfaces, and rare emphasis. It is
  never used for paragraph text on pale backgrounds.

### Secondary

- **Mineral Bronze:** Used in emphasized display text and quiet secondary controls.
- **Focus Copper:** Reserved for keyboard focus because it remains visible across pale
  and dark surfaces.

### Neutral

- **Cotton Paper:** The principal daylight surface.
- **Raised Paper:** Used only where a pale surface must separate from Cotton Paper.
- **Champagne Paper:** A tonal narrative layer behind manifesto content.
- **Mineral Linen:** A deeper tactile ground for imagery and object studies.
- **Warm Graphite:** Primary text, dark sections, and primary actions.
- **Muted Graphite:** Supporting copy that still meets accessible contrast.

**The Measured Gold Rule.** Gold is a drafting instrument, not a coating. Gold
gradients, metallic text effects, and broad decorative fills are forbidden.

**The Warm Neutral Rule.** Pure black and pure white are not part of the system. Every
neutral carries a warm mineral hue.

## Typography

**Display Font:** Bodoni Moda Variable, with Iowan Old Style fallback

**Body Font:** Afacad Flux Variable, with Helvetica Neue fallback

**Character:** Bodoni Moda gives the wordmark and promises the poise of a finely printed
jewelry certificate. Afacad Flux remains warm, contemporary, and effortless on small
mobile screens.

### Hierarchy

- **Display:** Medium-light variable weight, fluid from 3.45rem to 9.5rem, used only for
  the central promise and major page identity.
- **Headline:** Medium-light variable weight, fluid from 2.65rem to 6rem, used for
  narrative section turns.
- **Title:** Medium variable weight, fluid from 1.9rem to 3.4rem, used for item and
  supporting page titles.
- **Body:** Regular weight at 1rem with 1.55 line height and a maximum measure of 68
  characters.
- **Label:** 0.74rem, weight 680, and 0.115em tracking. Uppercase is reserved for short
  navigation and drafting labels.

**The Quiet Contrast Rule.** Hierarchy comes from scale, proportion, and space, never
from decorative italics or a collection of unrelated type treatments.

**The Four-Line Test.** Mobile display headings may occupy four short lines. If they
require a fifth line, revise the copy or reduce the measure before reducing the type
below its role.

## Elevation

The system is flat by default. Depth comes from tonal paper layers, photographic
overlap, fine complete borders, and two object studies with diffuse ambient shadow.
Cards do not float merely to imitate application UI.

### Shadow Vocabulary

- **Jewelry Ambient:** A broad, low-opacity bronze shadow used only beneath physical
  jewelry studies.
- **No Resting Shadow:** Navigation, FAQ rows, sections, and buttons remain flat at
  rest.

**The Surface Rule.** If a shadow makes a section look like a dashboard card, remove it
and restore hierarchy through composition.

## Components

### Buttons

- **Shape:** Full pill with a minimum 52px mobile touch target.
- **Primary:** Warm Graphite on Cotton Paper, with compact 0.88rem action text and a
  contextual WhatsApp icon.
- **Hover / Focus:** Satin Gold color inversion with a two-pixel visual lift. Keyboard
  focus uses a two-pixel Focus Copper outline with four-pixel offset.
- **Secondary:** Transparent or Cotton Paper surface with a complete low-contrast
  border. It inverts to Warm Graphite.
- **Text:** No container; the label and arrow translate together by four pixels.

### Cards / Containers

- **Corner Style:** Tactile image corners at 0.9rem or fluid up to 1.8rem.
- **Background:** Tonal paper layers only.
- **Shadow Strategy:** Flat unless the content represents a physical jewelry object.
- **Border:** Complete one-pixel borders, never colored side stripes.
- **Internal Padding:** Varies by narrative importance instead of using one card padding
  everywhere.

### Navigation

Desktop navigation stays centered between the wordmark and consultation action. Active
links use a one-pixel bronze underline that grows from the selected edge. Mobile
navigation becomes a full-height Champagne Paper field with large display-type links and
no floating modal container.

### FAQ Rows

Rows use complete horizontal rules, a numbered drafting index, and a custom plus that
rotates to a minus. Native `details` and `summary` preserve keyboard and screen-reader
behavior without application JavaScript.

### Technical Ear Mark

The line-drawn ear, circles, axes, and measurement marks are a signature component. They
explain planning and may overlap imagery at low opacity, but they must never claim
anatomical precision for an actual client project.

## Do's and Don'ts

### Do:

- **Do** make personalized visualization the first idea visitors understand.
- **Do** use anatomically credible imagery with natural skin texture.
- **Do** use the actual Satin Gold and Mineral Bronze roles rather than generic
  yellow-gold.
- **Do** reserve technical lines and circles for explaining the design process.
- **Do** preserve 52px primary mobile targets and visible keyboard focus.
- **Do** keep every customer-facing word in Brazilian Portuguese.
- **Do** test every route under the `/artis/` GitHub Pages base path.

### Don't:

- **Don't** build a generic piercing-studio site with black backgrounds, neon accents,
  tattoo imagery, or aggressive visual language.
- **Don't** build template luxury from beige surfaces, generic serif headlines, gold
  gradients, and ornamental excess.
- **Don't** use generic AI imagery with implausible ears, invented jewelry, plastic
  skin, or anatomically incorrect piercing positions.
- **Don't** use a marketplace or conventional ecommerce layout that reduces ARTÍS to a
  product grid.
- **Don't** use dense institutional pages that explain everything before showing the
  central promise.
- **Don't** publish unsupported claims, fabricated testimonials, placeholder prices, or
  invented portfolio projects.
- **Don't** use colored side-stripe borders, gradient text, glassmorphism, or repeated
  icon-card grids.
