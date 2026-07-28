# Content Management

This workflow uses GitHub's web editor. It requires no local development tools and keeps
every publication recoverable through Git history.

## Before editing

1. Sign in to GitHub with an account that has access to `clopesle/artis`.
2. Open the repository and select the `main` branch.
3. Confirm that the latest **Deploy GitHub Pages** workflow is green.
4. Open the relevant file under `src/data/`.

## What each file controls

| File              | Content                                                                  |
| ----------------- | ------------------------------------------------------------------------ |
| `site.json`       | Name, slogan, service area, public contact, and announcement             |
| `pages.json`      | Navigation, page titles, paragraphs, calls to action, and interface copy |
| `services.json`   | Service names, prices, descriptions, included items, and process         |
| `products.json`   | Joias, prices, images, availability, order, and publication state        |
| `projects.json`   | Authorized portfolio projects, images, categories, and publication state |
| `faqs.json`       | Questions and answers                                                    |
| `categories.json` | Jewelry and portfolio categories                                         |

The protected `/admin/` panel uses these same files. Direct editing on GitHub remains
available as a contingency and audit workflow.

## Safe editing rules

- Keep quotation marks and commas exactly as JSON requires.
- Use `published: false` to hide a product or project without deleting it.
- Use `featured: true` for the item that should receive primary emphasis.
- Use `order` to control the remaining order; lower numbers appear first.
- Use slugs with lowercase letters, numbers, and hyphens only.
- Never reuse an `id` or `slug`.
- Store service prices as customer-facing Brazilian Portuguese labels.
- Product `price.amount` is configurable for internal planning, but the public site and
  WhatsApp order intentionally omit jewelry prices.
- Do not add a product until its material, price, availability, and images are
  confirmed.
- Do not add a portfolio project until publication consent is recorded.

## Publishing a small text change

1. Open the JSON file.
2. Select the pencil icon.
3. Make one focused change.
4. Select **Commit changes**.
5. Write a concrete message, for example:

   ```text
   content: update project price
   ```

6. Commit directly to `main` only when the change is low risk and repository policy
   allows it. Otherwise create a branch and pull request.
7. Open **Actions** and watch **Deploy GitHub Pages**.
8. The change becomes public only after every check and deployment step succeeds.

## Adding an image

1. Prepare a JPG, PNG, or WebP with the correct rights and consent.
2. Remove location metadata when it is unnecessary.
3. Use a short lowercase filename with hyphens.
4. Keep original images reasonably sized; use at least 1600px on the long edge for
   editorial photography.
5. Upload catalog and portfolio sources under `src/assets/catalog/`. Replace the
   homepage and process images in place through the **Imagens** area of `/admin/`.
6. Add its filename to the relevant content entry.
7. Add a precise `alt` (or project `imageAlt`) in Brazilian Portuguese.

Do not upload client images directly into `public/`; that bypasses image optimization.

## Adding a product

`products.json` contains the approved curatorial catalog. A valid entry follows this
shape:

```json
{
  "id": "unique-stable-id",
  "slug": "nome-da-joia",
  "published": false,
  "featured": false,
  "order": 10,
  "name": "Nome confirmado",
  "shortDescription": "Descrição confirmada",
  "description": ["Primeiro parágrafo aprovado.", "Segundo parágrafo opcional."],
  "category": "Argolas",
  "materialCategory": "Ouro",
  "material": "Ouro 18K",
  "price": {
    "amount": null,
    "currency": "BRL"
  },
  "availability": "sob-consulta",
  "closure": "Clicker",
  "stone": "Zircônia",
  "options": ["1,2 × 8 mm"],
  "suggestedPlacements": ["Hélix", "Lóbulo"],
  "images": [
    {
      "src": "nome-do-arquivo.jpg",
      "alt": "Descrição objetiva da joia em português"
    }
  ]
}
```

Keep new entries unpublished until image rendering and the product detail route have
been reviewed.

`materialCategory` is the public catalog grouping and must be exactly `Ouro`,
`Titânio ASTM`, `Aço 316L`, or `PVD`. `category` describes the jewelry type and remains
searchable.

The repository is public. A configured `price.amount` can be read in the JSON source
even though the website does not render it. Never place confidential supplier cost
prices in this repository.

## Adding a portfolio project

`projects.json` also begins empty. A valid entry follows this shape:

```json
{
  "id": "unique-stable-id",
  "slug": "nome-do-projeto",
  "published": false,
  "featured": false,
  "order": 10,
  "title": "Título aprovado",
  "shortDescription": "Contexto aprovado",
  "description": ["História aprovada do projeto."],
  "image": "nome-do-arquivo.jpg",
  "imageAlt": "Descrição objetiva em português",
  "categories": ["minimalista"],
  "consentConfirmed": true
}
```

Never set `published` to `true` when `consentConfirmed` is not true.

## Publishing an announcement

Use the `announcement` object in `site.json`. Keep it disabled while drafting:

```json
{
  "enabled": false,
  "text": "Agenda de agosto aberta.",
  "linkLabel": "Conhecer o processo",
  "href": "/servicos/design-auricular-digital-personalizado/"
}
```

Set `enabled` to `true` only after the message is approved. Leave `href` and `linkLabel`
empty for a text-only announcement. Links must be internal paths beginning with `/`.

## Invalid content

If a workflow fails:

1. Open the failed run in **Actions**.
2. Expand **Verify site**.
3. Read the first validation or type error.
4. Correct the referenced file and commit the fix.

The previous production site remains online because failed builds are never deployed.

## Conflicts

If GitHub reports a conflict, do not guess which version to keep. Compare both edits,
preserve every confirmed content change, validate the final JSON, and use a pull request
for review.

## Reverting

The safest rollback is a new commit that reverts the problematic commit:

1. Open the commit in GitHub.
2. Select **Revert** when available.
3. Review and merge the generated pull request.
4. Watch the deployment workflow.

This keeps the complete history and avoids rewriting `main`.
