import { describe, expect, it } from "vitest";
import {
  classifyMaterial,
  normalizeWooProducts,
  parseAngelSearch,
  validateProviderUrl,
} from "./provider-catalog.mjs";

const angel = {
  id: "angel-piercings",
  type: "angel",
  baseUrl: "https://www.angelpiercings.com.br",
};
const myPiercing = {
  id: "my-piercing",
  type: "woocommerce",
  baseUrl: "https://mypiercing.com.br",
};

describe("provider catalog normalization", () => {
  it("classifies only eligible material vocabulary", () => {
    expect(classifyMaterial("Ouro 18K")).toMatchObject({ materialCategory: "Ouro" });
    expect(classifyMaterial("Titânio ASTM F136")).toMatchObject({
      materialCategory: "Titânio ASTM",
    });
    expect(classifyMaterial("Aço cirúrgico 316L")).toMatchObject({
      materialCategory: "Aço 316L",
    });
    expect(classifyMaterial("Titânio ASTM F136 PVD Gold")).toMatchObject({
      materialCategory: "PVD",
    });
    expect(classifyMaterial("Aço cirúrgico")).toBeNull();
    expect(classifyMaterial("Categoria: Titânio")).toBeNull();
    expect(classifyMaterial("Banho de ródio")).toBeNull();
  });

  it("normalizes WooCommerce results and rejects ineligible materials", () => {
    const results = normalizeWooProducts(
      [
        {
          id: 1,
          name: "Argola Clicker",
          permalink: "https://mypiercing.com.br/produto/argola",
          short_description: "<p>Titânio ASTM F136</p>",
          images: [{ src: "https://mypiercing.com.br/a.jpg", alt: "Argola" }],
          categories: [{ name: "Titânio" }],
          tags: [],
        },
        {
          id: 2,
          name: "Argola de ródio",
          permalink: "https://mypiercing.com.br/produto/rodio",
          images: [],
          categories: [{ name: "Banho de ródio" }],
          tags: [],
        },
      ],
      myPiercing,
    );

    expect(results[0]).toMatchObject({
      eligible: true,
      category: "Argolas",
      materialCategory: "Titânio ASTM",
    });
    expect(results[1].eligible).toBe(false);
  });

  it("parses Angel search cards", () => {
    const html = `
      <div class="listagem-item prod-id-367921585 prod-cat-1" data-id="367921585">
        <div class="imagem-produto has-zoom">
          <img src="https://cdn.awsli.com.br/300x300/item.png" alt="Argola Ouro" class="imagem-principal" />
        </div>
        <div class="info-produto">
          <a href="https://www.angelpiercings.com.br/argola-ouro-18k" class="nome-produto cor-secundaria">Argola Ouro 18K</a>
        </div>
      </div>`;
    const [candidate] = parseAngelSearch(html, angel);

    expect(candidate).toMatchObject({
      externalId: "367921585",
      eligible: true,
      materialCategory: "Ouro",
      category: "Argolas",
    });
  });

  it("restricts provider requests to supported HTTPS hosts", () => {
    expect(validateProviderUrl(angel).hostname).toBe("www.angelpiercings.com.br");
    expect(() => validateProviderUrl(angel, "http://angelpiercings.com.br")).toThrow();
    expect(() => validateProviderUrl(angel, "https://example.com")).toThrow();
  });
});
