import { describe, expect, it } from "vitest";

import {
  addCartItem,
  buildOrderMessage,
  deserializeCart,
  reconcileCartItems,
  removeCartItem,
  updateCartQuantity,
  type CartItem,
} from "./cart";

const jewelry: CartItem = {
  key: "product:argola-clicker",
  type: "product",
  id: "argola-clicker",
  name: "Argola Clicker Cravejada",
  detail: "Ouro 18K",
  quantity: 1,
};

const service: CartItem = {
  key: "service:design-auricular",
  type: "service",
  id: "design-auricular",
  name: "Design Auricular Digital Personalizado",
  detail: "Atendimento online",
  quantity: 1,
};

describe("cart state", () => {
  it("increments an existing item instead of duplicating it", () => {
    expect(addCartItem(addCartItem([], jewelry), jewelry)).toEqual([
      { ...jewelry, quantity: 2 },
    ]);
  });

  it("updates quantities within limits and removes zero-quantity items", () => {
    expect(updateCartQuantity([jewelry], jewelry.key, 3)[0].quantity).toBe(3);
    expect(updateCartQuantity([jewelry], jewelry.key, 0)).toEqual([]);
    expect(removeCartItem([jewelry, service], jewelry.key)).toEqual([service]);
  });

  it("recovers safely from invalid or stale storage", () => {
    expect(deserializeCart("not json")).toEqual([]);
    expect(deserializeCart(JSON.stringify({ version: 99, items: [jewelry] }))).toEqual(
      [],
    );
  });

  it("reconciles saved quantities with current catalog content", () => {
    const stale = {
      ...jewelry,
      name: "Nome antigo",
      detail: "Material antigo",
      quantity: 3,
    };
    const unknown = { ...jewelry, key: "product:unknown", id: "unknown" };

    expect(reconcileCartItems([stale, unknown], [jewelry])).toEqual([
      { ...jewelry, quantity: 3 },
    ]);
  });
});

describe("buildOrderMessage", () => {
  it("groups jewelry and services without exposing prices", () => {
    const message = buildOrderMessage([
      { ...jewelry, quantity: 2 },
      { ...service, quantity: 1 },
    ]);

    expect(message).toContain("Joias:");
    expect(message).toContain("2× Argola Clicker Cravejada");
    expect(message).toContain("Serviços:");
    expect(message).toContain(
      "1× Design Auricular Digital Personalizado, Atendimento online",
    );
    expect(message).not.toContain("R$");
    expect(message).not.toContain("Fornecedor");
    expect(message).toContain("confirmar medidas, disponibilidade e valores das joias");
  });

  it("uses a service-only closing when there are no jewels", () => {
    const message = buildOrderMessage([service]);

    expect(message).toContain("confirmar os próximos passos para o serviço");
    expect(message).not.toContain("valores das joias");
  });
});
