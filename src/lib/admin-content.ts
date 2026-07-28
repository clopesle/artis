export type JsonPrimitive = string | number | boolean | null;
export type JsonValue = JsonPrimitive | JsonObject | JsonValue[];
export interface JsonObject {
  [key: string]: JsonValue;
}

export interface ProviderCandidate {
  providerId: string;
  name: string;
  description: string;
  imageUrl: string;
  imageAlt: string;
  sourceUrl: string;
  eligible: boolean;
  eligibilityReason: string;
  materialCategory: string | null;
  material: string | null;
  category: string;
}

export const FIELD_LABELS: Record<string, string> = {
  id: "Identificador",
  slug: "Endereço amigável",
  published: "Publicado",
  featured: "Destacado",
  order: "Ordem",
  name: "Nome",
  legalName: "Nome legal",
  tagline: "Assinatura",
  description: "Descrição",
  shortDescription: "Descrição curta",
  locale: "Idioma",
  currency: "Moeda",
  serviceArea: "Área de atendimento",
  instagramUrl: "URL do Instagram",
  whatsappNumber: "Número do WhatsApp",
  announcement: "Aviso",
  enabled: "Ativo",
  text: "Texto",
  linkLabel: "Texto do link",
  href: "Destino do link",
  eyebrow: "Chamada superior",
  price: "Preço",
  min: "Mínimo",
  max: "Máximo",
  label: "Texto exibido",
  note: "Observação",
  purchaseBenefit: "Benefício de compra",
  included: "Itens incluídos",
  steps: "Etapas",
  number: "Número",
  title: "Título",
  question: "Pergunta",
  answer: "Resposta",
  category: "Categoria",
  materialCategory: "Categoria do material",
  material: "Material",
  amount: "Valor",
  availability: "Disponibilidade",
  closure: "Fecho",
  stone: "Pedra",
  options: "Opções",
  suggestedPlacements: "Posições sugeridas",
  images: "Imagens",
  src: "Arquivo",
  alt: "Texto alternativo",
  image: "Imagem",
  imageAlt: "Texto alternativo da imagem",
  categories: "Categorias",
  productCategories: "Categorias de joias",
  projectCategories: "Categorias de portfólio",
  consentConfirmed: "Consentimento confirmado",
  type: "Tipo de integração",
  baseUrl: "URL do fornecedor",
};

export const LONG_TEXT_KEYS = new Set([
  "description",
  "shortDescription",
  "answer",
  "note",
  "purchaseBenefit",
  "text",
]);

export function slugify(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 72);
}

export function blankValue(value: JsonValue, key = ""): JsonValue {
  if (Array.isArray(value)) {
    return [];
  }
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([childKey, childValue]) => [
        childKey,
        blankValue(childValue, childKey),
      ]),
    );
  }
  if (typeof value === "boolean") return false;
  if (typeof value === "number") return 0;
  if (key === "currency") return "BRL";
  return "";
}

export function createRootItem(path: string, nextOrder = 10): JsonObject {
  const templates: Record<string, JsonObject> = {
    "src/data/products.json": {
      id: "",
      slug: "",
      published: false,
      featured: false,
      order: nextOrder,
      name: "",
      shortDescription: "",
      description: [""],
      category: "",
      materialCategory: "Titânio ASTM",
      material: "Titânio ASTM F136",
      price: { amount: null, currency: "BRL" },
      availability: "sob-consulta",
      closure: "",
      options: [],
      suggestedPlacements: [],
      images: [{ src: "", alt: "" }],
    },
    "src/data/services.json": {
      id: "",
      slug: "",
      published: false,
      featured: false,
      name: "",
      eyebrow: "",
      shortDescription: "",
      description: [""],
      price: { min: 0, max: 0, currency: "BRL", label: "", note: "" },
      purchaseBenefit: "",
      included: [],
      steps: [
        { number: "01", title: "", description: "" },
        { number: "02", title: "", description: "" },
        { number: "03", title: "", description: "" },
      ],
    },
    "src/data/projects.json": {
      id: "",
      slug: "",
      published: false,
      featured: false,
      order: nextOrder,
      title: "",
      shortDescription: "",
      description: [""],
      image: "",
      imageAlt: "",
      categories: [],
      consentConfirmed: false,
    },
    "src/data/faqs.json": { question: "", answer: "" },
    "admin/providers.json": {
      id: "",
      name: "",
      type: "woocommerce",
      baseUrl: "https://",
      enabled: true,
    },
  };

  return structuredClone(templates[path] ?? {});
}

export function createNestedItem(key: string, sample?: JsonValue): JsonValue {
  const templates: Record<string, JsonValue> = {
    images: { src: "", alt: "" },
    steps: { number: "", title: "", description: "" },
  };
  if (key in templates) return structuredClone(templates[key]);
  if (sample !== undefined) return blankValue(sample, key);
  return "";
}

export function candidateToProductDraft(
  candidate: ProviderCandidate,
  existingProducts: JsonObject[],
): { product: JsonObject; imageFilename: string } {
  if (!candidate.eligible || !candidate.materialCategory || !candidate.material) {
    throw new Error("Somente joias com material elegível podem ser importadas.");
  }

  const existingSlugs = new Set(existingProducts.map((item) => String(item.slug)));
  const baseSlug = slugify(candidate.name) || "joia-importada";
  let slug = baseSlug;
  let suffix = 2;
  while (existingSlugs.has(slug)) {
    slug = `${baseSlug}-${suffix}`;
    suffix += 1;
  }

  const order =
    Math.max(0, ...existingProducts.map((item) => Number(item.order) || 0)) + 10;
  const extension =
    new URL(candidate.imageUrl).pathname.match(/\.(avif|jpe?g|png|webp)$/i)?.[1] ??
    "jpg";
  const imageFilename = `${slug}.${extension.toLowerCase().replace("jpeg", "jpg")}`;

  return {
    imageFilename,
    product: {
      id: slug,
      slug,
      published: false,
      featured: false,
      order,
      name: candidate.name,
      shortDescription:
        candidate.description ||
        `${candidate.name} em ${candidate.material.toLocaleLowerCase("pt-BR")}.`,
      description: [
        candidate.description ||
          "Peça selecionada para revisão da curadoria antes da publicação.",
      ],
      category: candidate.category,
      materialCategory: candidate.materialCategory,
      material: candidate.material,
      price: { amount: null, currency: "BRL" },
      availability: "sob-consulta",
      closure: "Confirmar antes da publicação",
      options: ["Confirmar medidas antes da publicação"],
      suggestedPlacements: ["Confirmar após avaliação profissional"],
      images: [{ src: imageFilename, alt: candidate.imageAlt || candidate.name }],
    },
  };
}
