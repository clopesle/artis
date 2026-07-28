const ELIGIBLE_MATERIALS = {
  gold: {
    materialCategory: "Ouro",
    material: "Ouro 18K",
  },
  pvd: {
    materialCategory: "PVD",
    material: "Titânio ASTM F136 com PVD Gold",
  },
  titanium: {
    materialCategory: "Titânio ASTM",
    material: "Titânio ASTM F136",
  },
  steel: {
    materialCategory: "Aço 316L",
    material: "Aço cirúrgico 316L",
  },
};

const ALLOWED_PROVIDER_HOSTS = {
  angel: new Set(["angelpiercings.com.br", "www.angelpiercings.com.br"]),
  woocommerce: new Set(["mypiercing.com.br", "www.mypiercing.com.br"]),
};

const ALLOWED_ASSET_HOSTS = {
  angel: new Set([
    "angelpiercings.com.br",
    "www.angelpiercings.com.br",
    "cdn.awsli.com.br",
  ]),
  woocommerce: new Set(["mypiercing.com.br", "www.mypiercing.com.br"]),
};

function decodeEntities(value) {
  return value
    .replaceAll("&amp;", "&")
    .replaceAll("&quot;", '"')
    .replaceAll("&#39;", "'")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)));
}

function stripTags(value = "") {
  return decodeEntities(
    value
      .replace(/<[^>]*>/g, " ")
      .replace(/\s+/g, " ")
      .trim(),
  );
}

export function slugify(value) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 72);
}

export function validateProviderUrl(provider, candidateUrl = provider.baseUrl) {
  const url = new URL(candidateUrl, provider.baseUrl);
  const allowedHosts = ALLOWED_PROVIDER_HOSTS[provider.type];

  if (
    url.protocol !== "https:" ||
    !allowedHosts ||
    !allowedHosts.has(url.hostname.toLowerCase())
  ) {
    throw new Error("Fornecedor ou URL não permitido.");
  }

  return url;
}

export function validateProviderAssetUrl(provider, candidateUrl) {
  const url = new URL(candidateUrl, provider.baseUrl);
  const allowedHosts = ALLOWED_ASSET_HOSTS[provider.type];

  if (
    url.protocol !== "https:" ||
    !allowedHosts ||
    !allowedHosts.has(url.hostname.toLowerCase())
  ) {
    throw new Error("Imagem do fornecedor não permitida.");
  }

  return url;
}
export function classifyMaterial(...values) {
  const text = values
    .flat(Infinity)
    .filter(Boolean)
    .join(" ")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

  if (/\bouro\s*(18\s*k|18k)\b/.test(text) || /\bcategoria[s]?:?\s*ouro\b/.test(text)) {
    return ELIGIBLE_MATERIALS.gold;
  }

  if (/\bpvd\b/.test(text)) {
    return ELIGIBLE_MATERIALS.pvd;
  }

  if (/\btitanio\b/.test(text) && /\bastm\b|\bf136\b|\bcategoria[s]?:/.test(text)) {
    return ELIGIBLE_MATERIALS.titanium;
  }

  if (/\baco\s*(cirurgico\s*)?316l\b/.test(text) || /\baco cirurgico\b/.test(text)) {
    return ELIGIBLE_MATERIALS.steel;
  }

  return null;
}

export function inferProductCategory(...values) {
  const text = values.flat(Infinity).filter(Boolean).join(" ").toLowerCase();
  const mappings = [
    ["Argolas", /\b(argola|clicker|segmento|daith)\b/],
    ["Labrets", /\blabret\b/],
    ["Nostrils", /\b(nostril|nariz)\b/],
    ["Correntes", /\bcorrente\b/],
    ["Hastes", /\b(haste|barbell|banana|transversal)\b/],
    ["Brincos", /\bbrinco\b/],
    ["Topos", /\b(topo|pin push|pin\.p)\b/],
  ];

  return mappings.find(([, pattern]) => pattern.test(text))?.[0] ?? "Topos";
}

function normalizeCandidate(candidate) {
  const material = classifyMaterial(
    candidate.name,
    candidate.description,
    candidate.categories,
    candidate.tags,
  );

  return {
    ...candidate,
    eligible: Boolean(material),
    eligibilityReason: material
      ? `Material elegível: ${material.materialCategory}.`
      : "Material não confirmado como Ouro, Titânio ASTM, Aço 316L ou PVD.",
    materialCategory: material?.materialCategory ?? null,
    material: material?.material ?? null,
    category: inferProductCategory(
      candidate.name,
      candidate.categories,
      candidate.tags,
    ),
  };
}

export function normalizeWooProducts(products, provider) {
  return products.map((product) =>
    normalizeCandidate({
      providerId: provider.id,
      externalId: String(product.id),
      name: stripTags(product.name),
      description: stripTags(product.short_description || product.description),
      sourceUrl: product.permalink,
      imageUrl: product.images?.[0]?.src ?? "",
      imageAlt: stripTags(product.images?.[0]?.alt || product.name),
      categories: (product.categories ?? []).map((category) => category.name),
      tags: (product.tags ?? []).map((tag) => tag.name),
    }),
  );
}

export function parseAngelSearch(html, provider) {
  const candidates = [];
  const itemPattern =
    /<div class="listagem-item[^"]*"[^>]*data-id="([^"]+)"[\s\S]*?<div class="imagem-produto[^"]*"[\s\S]*?<img[^>]+src="([^"]+)"[^>]+alt="([^"]*)"[^>]*>[\s\S]*?<a href="([^"]+)" class="nome-produto[^"]*">([\s\S]*?)<\/a>/g;

  for (const match of html.matchAll(itemPattern)) {
    candidates.push(
      normalizeCandidate({
        providerId: provider.id,
        externalId: match[1],
        name: stripTags(match[5]),
        description: "",
        sourceUrl: decodeEntities(match[4]),
        imageUrl: decodeEntities(match[2]),
        imageAlt: stripTags(match[3] || match[5]),
        categories: [],
        tags: [],
      }),
    );
  }

  return candidates;
}

function nextUniqueSlug(base, existingSlugs) {
  let slug = base || "joia-importada";
  let suffix = 2;

  while (existingSlugs.has(slug)) {
    slug = `${base}-${suffix}`;
    suffix += 1;
  }

  return slug;
}

export function candidateToProductDraft(candidate, existingProducts = []) {
  if (!candidate.eligible || !candidate.materialCategory || !candidate.material) {
    throw new Error("Somente joias com material elegível podem ser importadas.");
  }

  const existingSlugs = new Set(existingProducts.map((product) => product.slug));
  const slug = nextUniqueSlug(slugify(candidate.name), existingSlugs);
  const nextOrder =
    Math.max(0, ...existingProducts.map((product) => Number(product.order) || 0)) + 10;
  const extension =
    new URL(candidate.imageUrl).pathname.match(/\.(avif|jpe?g|png|webp)$/i)?.[1] ??
    "jpg";
  const imageFilename = `${slug}.${extension.toLowerCase().replace("jpeg", "jpg")}`;

  return {
    id: slug,
    slug,
    published: false,
    featured: false,
    order: nextOrder,
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
    price: {
      amount: null,
      currency: "BRL",
    },
    availability: "sob-consulta",
    closure: "Confirmar antes da publicação",
    options: ["Confirmar medidas antes da publicação"],
    suggestedPlacements: ["Confirmar após avaliação profissional"],
    images: [
      {
        src: imageFilename,
        alt: candidate.imageAlt || candidate.name,
      },
    ],
  };
}
