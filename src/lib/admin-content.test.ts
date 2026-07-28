import { describe, expect, it } from "vitest";
import categories from "../data/categories.json";
import { candidateToProductDraft, createRootItem, slugify } from "./admin-content";

describe("admin content helpers", () => {
  it("creates stable Portuguese slugs", () => {
    expect(slugify("Argola Coração em Titânio")).toBe("argola-coracao-em-titanio");
  });

  it("creates unpublished product records with configurable price", () => {
    const product = createRootItem("src/data/products.json", 80);
    expect(product.published).toBe(false);
    expect(product.order).toBe(80);
    expect(product.price).toEqual({ amount: null, currency: "BRL" });
  });

  it("imports an eligible candidate without supplier identity, URL, or price", () => {
    const { product, imageFilename } = candidateToProductDraft(
      {
        providerId: "supplier-secret",
        name: "Labret Estrela",
        description: "",
        sourceUrl: "https://supplier.example/produto",
        imageUrl: "https://supplier.example/estrela.png",
        imageAlt: "",
        eligible: true,
        eligibilityReason: "Material elegível",
        materialCategory: "Titânio ASTM",
        material: "Titânio ASTM F136",
        category: "Labrets",
      },
      [],
    );

    expect(product.published).toBe(false);
    expect(product.price).toEqual({ amount: null, currency: "BRL" });
    expect(product).not.toHaveProperty("providerId");
    expect(product).not.toHaveProperty("sourceUrl");
    expect(imageFilename).toBe("labret-estrela.png");
  });

  it("keeps the material categories managed in admin aligned with the public catalog", () => {
    expect(categories.materialCategories).toEqual([
      "Ouro",
      "Titânio ASTM",
      "Aço 316L",
      "PVD",
    ]);
  });
});
