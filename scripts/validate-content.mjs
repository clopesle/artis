import { readFile } from "node:fs/promises";
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
  const duplicates = values.filter(
    (value, index) => values.indexOf(value) !== index,
  );

  assert(
    duplicates.length === 0,
    `${path} contém ${key} duplicado: ${[...new Set(duplicates)].join(", ")}`,
  );
}

const [site, services, faqs, products, projects] = await Promise.all([
  readJson("../src/data/site.json"),
  readJson("../src/data/services.json"),
  readJson("../src/data/faqs.json"),
  readJson("../src/data/products.json"),
  readJson("../src/data/projects.json"),
]);

assert(site.locale === "pt-BR", "src/data/site.json deve usar locale pt-BR.");
assert(site.currency === "BRL", "src/data/site.json deve usar moeda BRL.");
assert(
  site.tagline === "Onde anatomia encontra identidade.",
  "A assinatura institucional da ARTÍS foi alterada sem registro.",
);
assert(Array.isArray(services), "src/data/services.json deve conter uma lista.");
assert(Array.isArray(faqs), "src/data/faqs.json deve conter uma lista.");
assert(Array.isArray(products), "src/data/products.json deve conter uma lista.");
assert(Array.isArray(projects), "src/data/projects.json deve conter uma lista.");

validateUnique(services, "id", "src/data/services.json");
validateUnique(services, "slug", "src/data/services.json");
validateUnique(products, "id", "src/data/products.json");
validateUnique(products, "slug", "src/data/products.json");
validateUnique(projects, "id", "src/data/projects.json");
validateUnique(projects, "slug", "src/data/projects.json");

for (const [index, service] of services.entries()) {
  const path = `src/data/services.json[${index}]`;
  assert(service.id, `${path}.id é obrigatório.`);
  validateSlug(service.slug, path);
  assert(service.name, `${path}.name é obrigatório.`);
  assert(service.shortDescription, `${path}.shortDescription é obrigatório.`);
  assert(
    Array.isArray(service.included) && service.included.length > 0,
    `${path}.included deve conter pelo menos um item.`,
  );
  assert(
    Array.isArray(service.steps) && service.steps.length === 3,
    `${path}.steps deve conter exatamente três etapas.`,
  );
  assert(
    service.price?.currency === "BRL",
    `${path}.price.currency deve ser BRL.`,
  );
}

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
