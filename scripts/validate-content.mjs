import { access, readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const projectRoot = fileURLToPath(new URL("../", import.meta.url));

async function readJson(relativePath) {
  const source = await readFile(new URL(relativePath, import.meta.url), "utf8");

  try {
    return JSON.parse(source);
  } catch (error) {
    throw new Error(`${relativePath} contém JSON inválido: ${error.message}`);
  }
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function validateSlug(slug, path) {
  assert(
    typeof slug === "string" && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug),
    `${path}.slug deve usar apenas letras minúsculas, números e hífens.`,
  );
}

function validateUnique(items, key, path) {
  const values = items.map((item) => item[key]);
  const duplicates = values.filter((value, index) => values.indexOf(value) !== index);

  assert(
    duplicates.length === 0,
    `${path} contém ${key} duplicado: ${[...new Set(duplicates)].join(", ")}`,
  );
}

const [site, pages, services, faqs, products, projects, categories, providers] =
  await Promise.all([
    readJson("../src/data/site.json"),
    readJson("../src/data/pages.json"),
    readJson("../src/data/services.json"),
    readJson("../src/data/faqs.json"),
    readJson("../src/data/products.json"),
    readJson("../src/data/projects.json"),
    readJson("../src/data/categories.json"),
    readJson("../admin/providers.json"),
  ]);

assert(site.locale === "pt-BR", "src/data/site.json deve usar locale pt-BR.");
assert(
  pages.global?.navigation?.length > 0,
  "src/data/pages.json deve conter a navegação global.",
);
assert(
  pages.home?.heroTitle,
  "src/data/pages.json deve conter os textos da página inicial.",
);
assert(
  pages.jewelry?.catalogTitle,
  "src/data/pages.json deve conter os textos da joalheria.",
);
assert(
  pages.projects?.title,
  "src/data/pages.json deve conter os textos do portfólio.",
);
assert(site.currency === "BRL", "src/data/site.json deve usar moeda BRL.");
assert(
  site.tagline === "Onde anatomia encontra identidade.",
  "A assinatura institucional da ARTÍS foi alterada sem registro.",
);
assert(
  typeof site.announcement?.enabled === "boolean",
  "site.announcement.enabled deve ser true ou false.",
);
if (site.announcement.enabled) {
  assert(site.announcement.text, "site.announcement.text é obrigatório quando ativo.");
  assert(
    !site.announcement.href || site.announcement.href.startsWith("/"),
    "site.announcement.href deve ser um caminho interno iniciado por /.",
  );
  assert(
    !site.announcement.href || site.announcement.linkLabel,
    "site.announcement.linkLabel é obrigatório quando href estiver preenchido.",
  );
}
assert(Array.isArray(services), "src/data/services.json deve conter uma lista.");
assert(Array.isArray(faqs), "src/data/faqs.json deve conter uma lista.");
assert(Array.isArray(products), "src/data/products.json deve conter uma lista.");
assert(Array.isArray(projects), "src/data/projects.json deve conter uma lista.");
assert(
  Array.isArray(categories.productCategories),
  "src/data/categories.json deve conter productCategories.",
);
assert(
  Array.isArray(categories.projectCategories),
  "src/data/categories.json deve conter projectCategories.",
);
assert(Array.isArray(providers), "admin/providers.json deve conter uma lista.");

validateUnique(
  categories.productCategories.map((name) => ({ name })),
  "name",
  "src/data/categories.json productCategories",
);
validateUnique(
  categories.projectCategories.map((name) => ({ name })),
  "name",
  "src/data/categories.json projectCategories",
);
validateUnique(providers, "id", "admin/providers.json");

for (const [index, provider] of providers.entries()) {
  const path = `admin/providers.json[${index}]`;
  assert(provider.id, `${path}.id é obrigatório.`);
  assert(provider.name, `${path}.name é obrigatório.`);
  assert(
    ["angel", "woocommerce"].includes(provider.type),
    `${path}.type deve ser angel ou woocommerce.`,
  );
  assert(
    /^https:\/\/[^/]+(?:\/.*)?$/.test(provider.baseUrl),
    `${path}.baseUrl deve usar HTTPS.`,
  );
  assert(typeof provider.enabled === "boolean", `${path}.enabled deve ser booleano.`);
}

for (const [index, product] of products.entries()) {
  assert(
    categories.productCategories.includes(product.category),
    `src/data/products.json[${index}].category não está cadastrada em categories.json.`,
  );
}

for (const [index, project] of projects.entries()) {
  for (const category of project.categories ?? []) {
    assert(
      categories.projectCategories.includes(category),
      `src/data/projects.json[${index}] usa a categoria não cadastrada "${category}".`,
    );
  }
}

validateUnique(services, "id", "src/data/services.json");
validateUnique(services, "slug", "src/data/services.json");
validateUnique(products, "id", "src/data/products.json");
validateUnique(products, "slug", "src/data/products.json");
validateUnique(products, "order", "src/data/products.json");
validateUnique(projects, "id", "src/data/projects.json");
validateUnique(projects, "slug", "src/data/projects.json");
validateUnique(projects, "order", "src/data/projects.json");

for (const [index, service] of services.entries()) {
  const path = `src/data/services.json[${index}]`;
  assert(service.id, `${path}.id é obrigatório.`);
  validateSlug(service.slug, path);
  assert(
    typeof service.published === "boolean",
    `${path}.published deve ser true ou false.`,
  );
  assert(
    typeof service.featured === "boolean",
    `${path}.featured deve ser true ou false.`,
  );
  assert(service.name, `${path}.name é obrigatório.`);
  assert(service.eyebrow, `${path}.eyebrow é obrigatório.`);
  assert(service.shortDescription, `${path}.shortDescription é obrigatório.`);
  assert(
    Array.isArray(service.description) &&
      service.description.length > 0 &&
      service.description.every(Boolean),
    `${path}.description deve conter pelo menos um parágrafo.`,
  );
  assert(service.purchaseBenefit, `${path}.purchaseBenefit é obrigatório.`);
  assert(
    Array.isArray(service.included) &&
      service.included.length > 0 &&
      service.included.every(Boolean),
    `${path}.included deve conter pelo menos um item.`,
  );
  assert(
    Array.isArray(service.steps) && service.steps.length === 3,
    `${path}.steps deve conter exatamente três etapas.`,
  );
  assert(service.price?.currency === "BRL", `${path}.price.currency deve ser BRL.`);
  assert(
    Number.isFinite(service.price?.min) &&
      Number.isFinite(service.price?.max) &&
      service.price.min > 0 &&
      service.price.max >= service.price.min,
    `${path}.price deve conter min e max válidos.`,
  );
  assert(service.price.label, `${path}.price.label é obrigatório.`);
  assert(service.price.note, `${path}.price.note é obrigatório.`);
  for (const [stepIndex, step] of service.steps.entries()) {
    assert(step.number, `${path}.steps[${stepIndex}].number é obrigatório.`);
    assert(step.title, `${path}.steps[${stepIndex}].title é obrigatório.`);
    assert(step.description, `${path}.steps[${stepIndex}].description é obrigatória.`);
  }
}

assert(
  services.some((service) => service.published && service.featured),
  "services.json deve conter pelo menos um serviço publicado e destacado.",
);

for (const [index, faq] of faqs.entries()) {
  assert(faq.question, `src/data/faqs.json[${index}].question é obrigatória.`);
  assert(faq.answer, `src/data/faqs.json[${index}].answer é obrigatória.`);
}

for (const [collectionName, items] of [
  ["products", products],
  ["projects", projects],
]) {
  for (const [index, item] of items.entries()) {
    const path = `src/data/${collectionName}.json[${index}]`;
    assert(item.id, `${path}.id é obrigatório.`);
    validateSlug(item.slug, path);
    assert(item.title || item.name, `${path} precisa de title ou name.`);
    assert(
      typeof item.published === "boolean",
      `${path}.published deve ser true ou false.`,
    );
    assert(
      typeof item.featured === "boolean",
      `${path}.featured deve ser true ou false.`,
    );
    assert(
      Number.isInteger(item.order) && item.order >= 0,
      `${path}.order deve ser um número inteiro igual ou maior que zero.`,
    );

    if (item.published && collectionName === "products") {
      assert(item.shortDescription, `${path}.shortDescription é obrigatória.`);
      assert(
        Array.isArray(item.description) && item.description.length > 0,
        `${path}.description deve conter pelo menos um parágrafo.`,
      );
      assert(item.category, `${path}.category é obrigatória.`);
      assert(
        ["Ouro", "Titânio ASTM", "Aço 316L", "PVD"].includes(item.materialCategory),
        `${path}.materialCategory deve ser Ouro, Titânio ASTM, Aço 316L ou PVD.`,
      );
      assert(item.material, `${path}.material é obrigatório.`);
      assert(
        [
          "Ouro 18K",
          "Titânio ASTM F136",
          "Titânio ASTM F136 ou PVD Gold",
          "Titânio ASTM F136 com PVD Gold",
          "Aço cirúrgico 316L",
          "Aço cirúrgico 316L ou PVD Gold",
          "Aço cirúrgico 316L com PVD Gold",
          "Ouro 18K e titânio com PVD Gold",
        ].includes(item.material),
        `${path}.material deve usar apenas ouro, titânio, aço 316L ou PVD.`,
      );
      assert(item.price?.currency === "BRL", `${path}.price.currency deve ser BRL.`);
      assert(
        item.price.amount === null ||
          (Number.isFinite(item.price.amount) && item.price.amount > 0),
        `${path}.price.amount deve ser null ou um valor positivo.`,
      );
      assert(
        ["disponivel", "sob-consulta", "indisponivel"].includes(item.availability),
        `${path}.availability é inválida.`,
      );
      assert(item.closure, `${path}.closure é obrigatório.`);
      assert(
        Array.isArray(item.options) && item.options.length > 0,
        `${path}.options deve conter pelo menos uma opção.`,
      );
      assert(
        Array.isArray(item.suggestedPlacements) && item.suggestedPlacements.length > 0,
        `${path}.suggestedPlacements deve conter pelo menos uma posição.`,
      );
      assert(
        Array.isArray(item.images) && item.images.length > 0,
        `${path}.images deve conter pelo menos uma imagem.`,
      );
      assert(
        !/(angel\s*piercings?|mypiercing|my\s*piercing|https?:\/\/)/i.test(
          JSON.stringify(item),
        ),
        `${path} expõe fornecedor ou URL no conteúdo público.`,
      );

      for (const [imageIndex, image] of item.images.entries()) {
        assert(image?.src, `${path}.images[${imageIndex}].src é obrigatório.`);
        assert(
          image?.alt,
          `${path}.images[${imageIndex}].alt é obrigatório em português brasileiro.`,
        );
        try {
          await access(new URL(`../src/assets/catalog/${image.src}`, import.meta.url));
        } catch {
          throw new Error(
            `${path} referencia a imagem ausente src/assets/catalog/${image.src}.`,
          );
        }
      }
    }

    if (item.published && collectionName === "projects") {
      assert(
        item.consentConfirmed === true,
        `${path} não pode ser publicado sem consentConfirmed: true.`,
      );
      assert(item.shortDescription, `${path}.shortDescription é obrigatória.`);
      assert(
        Array.isArray(item.description) && item.description.length > 0,
        `${path}.description deve conter pelo menos um parágrafo.`,
      );
      assert(item.image, `${path}.image é obrigatória.`);
      assert(item.imageAlt, `${path}.imageAlt é obrigatória.`);
      assert(
        Array.isArray(item.categories) && item.categories.length > 0,
        `${path}.categories deve conter pelo menos uma categoria.`,
      );

      try {
        await access(new URL(`../src/assets/catalog/${item.image}`, import.meta.url));
      } catch {
        throw new Error(
          `${path} referencia a imagem ausente src/assets/catalog/${item.image}.`,
        );
      }
    }
  }
}

if (site.whatsappNumber) {
  assert(
    /^\d{12,13}$/.test(site.whatsappNumber),
    "site.whatsappNumber deve conter apenas dígitos, incluindo 55 e DDD.",
  );
}

console.log(
  `Conteúdo validado em ${projectRoot}: ${services.length} serviço(s), ${products.length} produto(s), ${projects.length} projeto(s) e ${faqs.length} FAQ(s).`,
);
