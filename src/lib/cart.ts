export const CART_STORAGE_KEY = "artis-cart-v1";
const CART_VERSION = 1;
const MAX_QUANTITY = 99;

export type CartItemType = "product" | "service";

export interface CartItem {
  key: string;
  type: CartItemType;
  id: string;
  name: string;
  detail?: string;
  priceLabel?: string;
  quantity: number;
}

function clampQuantity(quantity: number) {
  return Math.max(0, Math.min(MAX_QUANTITY, Math.trunc(quantity)));
}

function isCartItem(value: unknown): value is CartItem {
  if (!value || typeof value !== "object") return false;

  const item = value as Partial<CartItem>;

  return (
    typeof item.key === "string" &&
    (item.type === "product" || item.type === "service") &&
    typeof item.id === "string" &&
    typeof item.name === "string" &&
    Number.isInteger(item.quantity) &&
    Number(item.quantity) > 0
  );
}

export function addCartItem(items: CartItem[], draft: CartItem) {
  const quantity = clampQuantity(draft.quantity || 1);
  const existing = items.find((item) => item.key === draft.key);

  if (!existing) {
    return [...items, { ...draft, quantity }];
  }

  return items.map((item) =>
    item.key === draft.key
      ? { ...item, quantity: clampQuantity(item.quantity + quantity) }
      : item,
  );
}

export function updateCartQuantity(items: CartItem[], key: string, quantity: number) {
  const nextQuantity = clampQuantity(quantity);

  if (nextQuantity === 0) {
    return removeCartItem(items, key);
  }

  return items.map((item) =>
    item.key === key ? { ...item, quantity: nextQuantity } : item,
  );
}

export function removeCartItem(items: CartItem[], key: string) {
  return items.filter((item) => item.key !== key);
}

export function cartItemCount(items: CartItem[]) {
  return items.reduce((total, item) => total + item.quantity, 0);
}

export function serializeCart(items: CartItem[]) {
  return JSON.stringify({ version: CART_VERSION, items });
}

export function deserializeCart(value: string | null): CartItem[] {
  if (!value) return [];

  try {
    const parsed = JSON.parse(value) as { version?: number; items?: unknown[] };

    if (parsed.version !== CART_VERSION || !Array.isArray(parsed.items)) {
      return [];
    }

    return parsed.items.filter(isCartItem).map((item) => ({
      ...item,
      quantity: clampQuantity(item.quantity),
    }));
  } catch {
    return [];
  }
}

function messageLine(item: CartItem) {
  const detail = item.detail ? `, ${item.detail}` : "";
  const price =
    item.type === "service" && item.priceLabel ? ` (${item.priceLabel})` : "";

  return `• ${item.quantity}× ${item.name}${detail}${price}`;
}

export function buildOrderMessage(items: CartItem[]) {
  const products = items.filter((item) => item.type === "product");
  const services = items.filter((item) => item.type === "service");
  const sections = [
    "Olá, ARTÍS! Montei este pedido pelo site:",
    products.length > 0 ? `Joias:\n${products.map(messageLine).join("\n")}` : undefined,
    services.length > 0
      ? `Serviços:\n${services.map(messageLine).join("\n")}`
      : undefined,
    products.length > 0
      ? "Gostaria de confirmar medidas, disponibilidade e valores das joias antes de finalizar."
      : "Gostaria de confirmar os próximos passos para o serviço.",
  ];

  return sections.filter(Boolean).join("\n\n");
}
