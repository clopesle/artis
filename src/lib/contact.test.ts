import { describe, expect, it } from "vitest";

import { createWhatsAppUrl } from "./contact";

describe("createWhatsAppUrl", () => {
  it("encodes a contextual Brazilian Portuguese message", () => {
    expect(
      createWhatsAppUrl("Olá, ARTÍS! Quero conhecer meu projeto.", "5511999999999"),
    ).toBe(
      "https://wa.me/5511999999999?text=Ol%C3%A1%2C%20ART%C3%8DS!%20Quero%20conhecer%20meu%20projeto.",
    );
  });

  it("does not create a link for an invalid number", () => {
    expect(createWhatsAppUrl("Olá", "")).toBeNull();
    expect(createWhatsAppUrl("Olá", "5511-9999")).toBeNull();
  });
});
