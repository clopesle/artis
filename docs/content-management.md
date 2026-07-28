# Content Management

This workflow uses GitHub's web editor. It requires no local development tools and keeps
every publication recoverable through Git history.

## Before editing

1. Sign in to GitHub with an account that has access to `clopesle/artis`.
2. Open the repository and select the `main` branch.
3. Confirm that the latest **Deploy GitHub Pages** workflow is green.
4. Open the relevant file under `src/data/`.

## What each file controls

| File            | Content                                                                  |
| --------------- | ------------------------------------------------------------------------ |
| `site.json`     | Name, slogan, locale, service area, and public contact                   |
| `services.json` | Service names, prices, descriptions, included items, and process         |
| `products.json` | Joias, prices, images, availability, order, and publication state        |
| `projects.json` | Authorized portfolio projects, images, categories, and publication state |
| `faqs.json`     | Questions and answers                                                    |

## Safe editing rules

- Keep quotation marks and commas exactly as JSON requires.
- Use `published: false` to hide a product or project without deleting it.
- Use `featured: true` for the item that should receive primary emphasis.
- Use slugs with lowercase letters, numbers, and hyphens only.
- Never reuse an `id` or `slug`.
- Store prices as customer-facing Brazilian Portuguese labels.
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
5. Upload the source under `src/assets/`.
6. Add its filename to the relevant content entry only after a developer connects that
   content type to Astro's image pipeline.
7. Add a precise `imageAlt` in Brazilian Portuguese.

Do not upload client images directly into `public/`; that bypasses image optimization.

## Adding a product

`products.json` intentionally begins as an empty list. A valid entry follows this shape:

```json
{
  "id": "unique-stable-id",
  "slug": "nome-da-joia",
  "published": false,
  "featured": false,
  "name": "Nome confirmado",
  "shortDescription": "Descrição confirmada",
  "priceLabel": "R$ 000",
  "availability": "sob-consulta",
  "images": ["nome-do-arquivo.jpg"]
}
```

Keep new entries unpublished until image rendering and the product detail route have
been reviewed.

## Adding a portfolio project

`projects.json` also begins empty. A valid entry follows this shape:

```json
{
  "id": "unique-stable-id",
  "slug": "nome-do-projeto",
  "published": false,
  "featured": false,
  "title": "Título aprovado",
  "shortDescription": "Contexto aprovado",
  "image": "nome-do-arquivo.jpg",
  "imageAlt": "Descrição objetiva em português",
  "categories": ["minimalista"],
  "consentConfirmed": true
}
```

Never set `published` to `true` when `consentConfirmed` is not true.

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
