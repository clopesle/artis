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
  global: "Configurações globais",
  home: "Página inicial",
  jewelry: "Joalheria",
  projects: "Projetos",
  productDetail: "Detalhes de joia",
  serviceDetail: "Detalhes de serviço",
  cart: "Sacola",
  privacy: "Privacidade",
  notFound: "Página não encontrada",
  navigation: "Navegação",
  id: "Identificador",
  slug: "Endereço amigável",
  published: "Publicado",
  featured: "Destacado",
  order: "Ordem",
  name: "Nome",
  legalName: "Nome legal",
  tagline: "Assinatura",
  wordmarkDescriptor: "Descrição da marca",
  description: "Descrição",
  shortDescription: "Descrição curta",
  locale: "Idioma",
  currency: "Moeda",
  serviceArea: "Área de atendimento",
  onlineServiceLabel: "Nome do atendimento online",
  instagramUrl: "URL do Instagram",
  whatsappNumber: "Número do WhatsApp",
  messages: "Mensagens do WhatsApp",
  project: "Projeto",
  portfolio: "Portfólio",
  orderIntro: "Abertura do pedido",
  orderProducts: "Título das joias no pedido",
  orderServices: "Título dos serviços no pedido",
  orderProductClosing: "Fechamento do pedido com joias",
  orderServiceClosing: "Fechamento do pedido com serviço",
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
  category: "Tipo de joia",
  materialCategory: "Material do catálogo",
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
  materialCategories: "Materiais permitidos no catálogo",
  productCategories: "Tipos de joias",
  projectCategories: "Categorias de portfólio",
  consentConfirmed: "Consentimento confirmado",
  type: "Tipo de integração",
  baseUrl: "URL do fornecedor",
  metaTitle: "Título para buscadores",
  metaDescription: "Descrição para buscadores",
  cartLabel: "Nome da sacola",
  projectCta: "Botão de projeto",
  mobileCta: "Botão fixo no celular",
  navigationLabel: "Título da navegação no rodapé",
  informationLabel: "Título das informações no rodapé",
  privacyLabel: "Nome do link de privacidade",
  faqLabel: "Nome do link de perguntas frequentes",
  footerLegal: "Texto legal do rodapé",
  announcementLabel: "Rótulo acessível do aviso",
  brandHomeLabel: "Rótulo acessível da marca",
  primaryNavigationLabel: "Rótulo acessível da navegação principal",
  openMenuLabel: "Rótulo acessível para abrir o menu",
  mobileNavigationLabel: "Rótulo acessível da navegação móvel",
  mobileContactLabel: "Rótulo acessível do contato móvel",
  defaultCartCta: "Botão padrão da sacola",
  defaultWhatsAppCta: "Botão padrão do WhatsApp",
  availabilityLabels: "Textos de disponibilidade",
  disponivel: "Disponível",
  "sob-consulta": "Sob consulta",
  indisponivel: "Indisponível",
  cartInterface: "Textos de interação da sacola",
  productLabel: "Nome para joia",
  serviceLabel: "Nome para serviço",
  decreaseLabel: "Ação de diminuir quantidade",
  quantityLabel: "Nome da quantidade",
  increaseLabel: "Ação de aumentar quantidade",
  removeLabel: "Ação de remover",
  singleItemLabel: "Resumo de um item",
  multipleItemsLabel: "Resumo de vários itens",
  heroEyebrow: "Chamada superior do destaque",
  heroTitle: "Título do destaque",
  heroTitleAccent: "Trecho destacado do título",
  heroDescription: "Descrição do destaque",
  heroPrimaryCta: "Botão principal do destaque",
  heroSecondaryCta: "Botão secundário do destaque",
  heroNote: "Observação do destaque",
  heroImageFile: "Imagem do destaque",
  heroImageAlt: "Texto alternativo da imagem principal",
  heroVisualLabel: "Identificação visual do projeto",
  heroVisualNote: "Observação visual do projeto",
  promises: "Compromissos",
  problemEyebrow: "Chamada superior do problema",
  problemTitle: "Título do problema",
  problemParagraphs: "Parágrafos do problema",
  processImageAlt: "Texto alternativo da imagem do processo",
  processImageFile: "Imagem do processo",
  processCaption: "Legenda da imagem do processo",
  processEyebrow: "Chamada superior do processo",
  processTitle: "Título do processo",
  processDescription: "Descrição do processo",
  processCta: "Botão do processo",
  serviceLink: "Link para o serviço",
  investmentLabel: "Título do investimento",
  serviceCartCta: "Botão para adicionar serviço",
  curationEyebrow: "Chamada superior da curadoria",
  curationTitle: "Título da curadoria",
  curationDescription: "Descrição da curadoria",
  curationCta: "Botão da curadoria",
  manifestoEyebrow: "Chamada superior do manifesto",
  manifestoQuote: "Frase do manifesto",
  faqEyebrow: "Chamada superior das perguntas",
  faqTitle: "Título das perguntas",
  contactEyebrow: "Chamada superior do contato",
  contactTitle: "Título do contato",
  contactDescription: "Descrição do contato",
  contactCta: "Botão de contato",
  contactPending: "Aviso de contato indisponível",
  catalogEyebrow: "Chamada superior do catálogo",
  catalogTitle: "Título do catálogo",
  searchLabel: "Nome da busca",
  searchPlaceholder: "Exemplo da busca",
  filterLabel: "Nome do filtro",
  allCategoriesLabel: "Opção de todas as categorias",
  emptyTitle: "Título do estado vazio",
  emptyDescription: "Descrição do estado vazio",
  emptyCta: "Botão do estado vazio",
  pendingEyebrow: "Chamada superior do estado pendente",
  pendingTitle: "Título do estado pendente",
  pendingDescription: "Descrição do estado pendente",
  pendingCta: "Botão do estado pendente",
  principles: "Princípios",
  principle: "Princípio",
  backLabel: "Texto para voltar",
  detailCta: "Botão dos detalhes",
  materialLabel: "Nome do material",
  availabilityLabel: "Nome da disponibilidade",
  closureLabel: "Nome do fecho",
  stoneLabel: "Nome da pedra",
  optionsTitle: "Título das opções",
  placementsPrefix: "Introdução das posições",
  placementsNote: "Observação das posições",
  consultCta: "Botão de consulta",
  heroCta: "Botão do destaque",
  imageFile: "Imagem editorial",
  includedEyebrow: "Chamada superior dos itens incluídos",
  includedTitle: "Título dos itens incluídos",
  cartCta: "Botão da sacola",
  summaryTitle: "Título do resumo",
  clearLabel: "Ação de limpar",
  personalServiceLabel: "Título do atendimento",
  disclaimer: "Aviso da sacola",
  sendCta: "Botão de envio",
  noscript: "Aviso para JavaScript desativado",
  sections: "Seções",
  backCta: "Botão para voltar",
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
