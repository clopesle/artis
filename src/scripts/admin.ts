import {
  FIELD_LABELS,
  LONG_TEXT_KEYS,
  candidateToProductDraft,
  createNestedItem,
  createRootItem,
  type JsonObject,
  type JsonValue,
  type ProviderCandidate,
  slugify,
} from "../lib/admin-content";

interface ContentRecord {
  data: JsonValue;
  sha: string;
  dirty: boolean;
}

interface Section {
  id: string;
  label: string;
  description: string;
  path?: string;
  mode: "object" | "collection" | "images" | "import";
}

interface SessionData {
  user: { login: string; name?: string; avatarUrl?: string };
  repository: string;
  expiresAt: number;
}

interface RepositoryFile {
  name: string;
  path: string;
  sha: string;
  download_url: string;
  type: string;
}

const sections: Section[] = [
  {
    id: "identity",
    label: "Identidade e contato",
    description: "Nome, assinatura, contato, atendimento e aviso do site.",
    path: "src/data/site.json",
    mode: "object",
  },
  {
    id: "pages",
    label: "Textos das páginas",
    description:
      "Títulos, parágrafos, chamadas, navegação e textos institucionais do site.",
    path: "src/data/pages.json",
    mode: "object",
  },
  {
    id: "products",
    label: "Joias",
    description: "Catálogo, materiais, disponibilidade, imagens e publicação.",
    path: "src/data/products.json",
    mode: "collection",
  },
  {
    id: "services",
    label: "Serviços",
    description: "Serviços, preços, benefícios, etapas e itens incluídos.",
    path: "src/data/services.json",
    mode: "collection",
  },
  {
    id: "portfolio",
    label: "Portfólio",
    description: "Projetos publicados e suas autorizações de uso.",
    path: "src/data/projects.json",
    mode: "collection",
  },
  {
    id: "faqs",
    label: "Perguntas frequentes",
    description: "Perguntas e respostas exibidas no site.",
    path: "src/data/faqs.json",
    mode: "collection",
  },
  {
    id: "categories",
    label: "Categorias",
    description: "Categorias disponíveis para joias e projetos.",
    path: "src/data/categories.json",
    mode: "object",
  },
  {
    id: "images",
    label: "Imagens",
    description:
      "Imagens principais do site e arquivos de catálogo usados por joias e projetos.",
    mode: "images",
  },
  {
    id: "providers",
    label: "Fornecedores",
    description: "Endereços privados usados somente para pesquisa administrativa.",
    path: "admin/providers.json",
    mode: "collection",
  },
  {
    id: "import",
    label: "Importar joias",
    description: "Pesquise fornecedores e importe peças elegíveis como rascunho.",
    mode: "import",
  },
];

const root = document.querySelector<HTMLElement>("#admin-root")!;
const bridgeUrl = root.dataset.bridgeUrl?.replace(/\/$/, "") ?? "";
const authScreen = document.querySelector<HTMLElement>("#auth-screen")!;
const authMessage = document.querySelector<HTMLElement>("#auth-message")!;
const loginButton = document.querySelector<HTMLAnchorElement>("#login-button")!;
const app = document.querySelector<HTMLElement>("#admin-app")!;
const workspace = document.querySelector<HTMLElement>("#workspace")!;
const desktopNav = document.querySelector<HTMLElement>("#desktop-nav")!;
const mobileNav = document.querySelector<HTMLSelectElement>("#mobile-nav")!;
const pageTitle = document.querySelector<HTMLElement>("#page-title")!;
const saveButton = document.querySelector<HTMLButtonElement>("#save-button")!;
const saveState = document.querySelector<HTMLElement>("#save-state")!;
const logoutButton = document.querySelector<HTMLButtonElement>("#logout-button")!;
const userName = document.querySelector<HTMLElement>("#user-name")!;
const repositoryName = document.querySelector<HTMLElement>("#repository-name")!;

const cache = new Map<string, ContentRecord>();
let activeSection = sections[0];
let activeItemIndex = 0;
let sessionId = sessionStorage.getItem("artis-admin-session") ?? "";
let session: SessionData | null = null;

function element<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  options: {
    className?: string;
    text?: string;
    type?: "button" | "submit" | "reset";
    ariaLabel?: string;
  } = {},
): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag);
  if (options.className) node.className = options.className;
  if (options.text !== undefined) node.textContent = options.text;
  if (options.type && node instanceof HTMLButtonElement) node.type = options.type;
  if (options.ariaLabel) node.setAttribute("aria-label", options.ariaLabel);
  return node;
}

function notice(message: string, kind: "error" | "success" | "info" = "info") {
  const node = element("div", {
    className: `notice${kind === "info" ? "" : ` ${kind}`}`,
    text: message,
  });
  node.setAttribute("role", kind === "error" ? "alert" : "status");
  return node;
}

function showError(error: unknown) {
  const message =
    error instanceof Error ? error.message : "Ocorreu um erro inesperado.";
  workspace.replaceChildren(notice(message, "error"));
}

function getSessionHeaders(): Record<string, string> {
  return sessionId ? { Authorization: `Bearer ${sessionId}` } : {};
}

async function api<T>(
  path: string,
  init: RequestInit = {},
  responseType: "json" | "blob" = "json",
): Promise<T> {
  const headers = new Headers(init.headers);
  for (const [name, value] of Object.entries(getSessionHeaders())) {
    headers.set(name, value);
  }
  if (init.body) headers.set("Content-Type", "application/json");

  const response = await fetch(`${bridgeUrl}${path}`, {
    ...init,
    headers,
  });
  if (response.status === 401) {
    clearSession();
    showAuth("Sua sessão expirou. Entre novamente com o GitHub.");
    throw new Error("Sessão expirada.");
  }
  if (!response.ok) {
    const payload = (await response.json().catch(() => ({}))) as { message?: string };
    throw new Error(payload.message ?? "Não foi possível concluir a operação.");
  }
  return (responseType === "blob" ? response.blob() : response.json()) as Promise<T>;
}

function decodeBase64(value: string) {
  const bytes = Uint8Array.from(atob(value.replace(/\s/g, "")), (character) =>
    character.charCodeAt(0),
  );
  return new TextDecoder().decode(bytes);
}

function bytesToBase64(bytes: Uint8Array) {
  let binary = "";
  const chunkSize = 0x8000;
  for (let offset = 0; offset < bytes.length; offset += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(offset, offset + chunkSize));
  }
  return btoa(binary);
}

async function blobToBase64(blob: Blob) {
  return bytesToBase64(new Uint8Array(await blob.arrayBuffer()));
}

async function loadFile(path: string, force = false): Promise<ContentRecord> {
  if (!force && cache.has(path)) return cache.get(path)!;
  const file = await api<{ content: string; sha: string }>(
    `/api/content?path=${encodeURIComponent(path)}`,
  );
  const record = {
    data: JSON.parse(decodeBase64(file.content)) as JsonValue,
    sha: file.sha,
    dirty: false,
  };
  cache.set(path, record);
  return record;
}

function markDirty(record: ContentRecord) {
  record.dirty = true;
  saveButton.hidden = false;
  saveState.textContent = "Alterações não salvas";
}

function sectionTitle(section: Section) {
  pageTitle.textContent = section.label;
}

function renderNavigation() {
  desktopNav.replaceChildren();
  mobileNav.replaceChildren();
  for (const section of sections) {
    const button = element("button", {
      className: "nav-button",
      text: section.label,
      type: "button",
    });
    button.dataset.section = section.id;
    if (section.id === activeSection.id) button.setAttribute("aria-current", "page");
    button.addEventListener("click", () => activateSection(section.id));
    desktopNav.append(button);

    const option = element("option", { text: section.label });
    option.value = section.id;
    option.selected = section.id === activeSection.id;
    mobileNav.append(option);
  }
}

mobileNav.addEventListener("change", () => activateSection(mobileNav.value));

function editorIntro(section: Section) {
  const intro = element("div", { className: "section-intro" });
  intro.append(
    element("h2", { text: section.label }),
    element("p", { text: section.description }),
  );
  return intro;
}

function displayName(item: JsonObject, index: number) {
  return String(item.name || item.title || item.question || `Item ${index + 1}`);
}

function displayMeta(item: JsonObject) {
  if ("published" in item) return item.published ? "Publicado" : "Rascunho";
  if ("enabled" in item) return item.enabled ? "Ativo" : "Inativo";
  return "";
}

function labelFor(key: string) {
  return FIELD_LABELS[key] ?? key.replace(/([A-Z])/g, " $1");
}

function selectOptions(key: string, currentValue: string): string[] | null {
  const fixed: Record<string, string[]> = {
    locale: ["pt-BR"],
    currency: ["BRL"],
    availability: ["disponivel", "sob-consulta", "indisponivel"],
    materialCategory: ["Ouro", "Titânio ASTM", "Aço 316L", "PVD"],
    type: ["angel", "woocommerce"],
  };
  let options = fixed[key];

  const categories = cache.get("src/data/categories.json")?.data as
    JsonObject | undefined;
  if (key === "category" && categories) {
    options = (categories.productCategories as JsonValue[]).map(String);
  }
  if (!options) return null;
  return options.includes(currentValue) ? options : [currentValue, ...options];
}

function renderPrimitiveField(
  parent: HTMLElement,
  key: string,
  value: JsonValue,
  update: (value: JsonValue) => void,
) {
  const field = element("div", { className: "field" });

  if (typeof value === "boolean") {
    const label = element("label", { className: "checkbox" });
    const input = element("input");
    input.type = "checkbox";
    input.checked = value;
    input.addEventListener("change", () => update(input.checked));
    label.append(input, document.createTextNode(labelFor(key)));
    field.append(label);
    parent.append(field);
    return;
  }

  const label = element("label", { text: labelFor(key) });
  const stringValue = value === null ? "" : String(value);
  const options = selectOptions(key, stringValue);
  let input: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;

  if (options) {
    input = element("select");
    for (const optionValue of options) {
      const option = element("option", { text: optionValue });
      option.value = optionValue;
      input.append(option);
    }
    input.value = stringValue;
  } else if (LONG_TEXT_KEYS.has(key) || stringValue.length > 110) {
    input = element("textarea");
    input.value = stringValue;
  } else {
    input = element("input");
    input.type = typeof value === "number" || value === null ? "number" : "text";
    input.value = stringValue;
    if (key.toLowerCase().includes("url") || key === "href") input.type = "url";
  }

  input.addEventListener("input", () => {
    if (typeof value === "number" || value === null) {
      update(input.value === "" ? null : Number(input.value));
    } else {
      update(input.value);
    }
  });
  field.append(label, input);
  if (key === "slug" || key === "id") {
    field.append(
      element("small", {
        className: "field-help",
        text: "Use letras minúsculas, números e hífens. Evite alterar depois de publicar.",
      }),
    );
  }
  parent.append(field);
}

function renderArrayField(
  parent: HTMLElement,
  key: string,
  values: JsonValue[],
  update: (value: JsonValue[]) => void,
) {
  const fieldset = element("fieldset");
  fieldset.append(element("legend", { text: labelFor(key) }));

  const containsObjects = values.some(
    (item) => item !== null && typeof item === "object" && !Array.isArray(item),
  );
  if (!containsObjects) {
    const textarea = element("textarea");
    textarea.value = values.map(String).join("\n");
    textarea.placeholder = "Um item por linha";
    textarea.addEventListener("input", () =>
      update(
        textarea.value
          .split("\n")
          .map((item) => item.trim())
          .filter(Boolean),
      ),
    );
    fieldset.append(textarea);
    parent.append(fieldset);
    return;
  }

  const list = element("div", { className: "nested-list" });
  values.forEach((item, index) => {
    const card = element("div", { className: "nested-card" });
    const fields = element("div", { className: "fields" });
    renderObjectFields(fields, item as JsonObject, () => update(values));
    const remove = element("button", {
      className: "remove-nested",
      text: "×",
      type: "button",
      ariaLabel: `Remover item ${index + 1}`,
    });
    remove.addEventListener("click", () => {
      values.splice(index, 1);
      update(values);
      renderActiveSection();
    });
    card.append(fields, remove);
    list.append(card);
  });
  fieldset.append(list);

  const add = element("button", {
    className: "button secondary small",
    text: `Adicionar em ${labelFor(key).toLocaleLowerCase("pt-BR")}`,
    type: "button",
  });
  add.style.marginTop = "10px";
  add.addEventListener("click", () => {
    values.push(createNestedItem(key, values[0]));
    update(values);
    renderActiveSection();
  });
  fieldset.append(add);
  parent.append(fieldset);
}

function renderObjectFields(
  parent: HTMLElement,
  object: JsonObject,
  onChange: () => void,
) {
  for (const [key, value] of Object.entries(object)) {
    if (Array.isArray(value)) {
      renderArrayField(parent, key, value, (next) => {
        object[key] = next;
        onChange();
      });
    } else if (value !== null && typeof value === "object") {
      const fieldset = element("fieldset");
      fieldset.append(element("legend", { text: labelFor(key) }));
      const fields = element("div", { className: "fields" });
      renderObjectFields(fields, value as JsonObject, onChange);
      fieldset.append(fields);
      parent.append(fieldset);
    } else {
      renderPrimitiveField(parent, key, value, (next) => {
        object[key] = next;
        if ((key === "name" || key === "title") && !String(object.slug || "")) {
          object.slug = slugify(String(next));
          if ("id" in object && !String(object.id || "")) object.id = object.slug;
        }
        onChange();
      });
    }
  }
}

async function renderStructuredSection(section: Section) {
  const record = await loadFile(section.path!);
  if (section.id === "products" || section.id === "portfolio") {
    await loadFile("src/data/categories.json");
  }

  workspace.replaceChildren(editorIntro(section));
  if (section.mode === "object") {
    const panel = element("div", { className: "editor-panel" });
    const fields = element("div", { className: "fields" });
    renderObjectFields(fields, record.data as JsonObject, () => markDirty(record));
    panel.append(fields);
    workspace.append(panel);
    return;
  }

  const items = record.data as JsonObject[];
  if (activeItemIndex >= items.length) activeItemIndex = Math.max(0, items.length - 1);
  const layout = element("div", { className: "editor-layout" });
  const collection = element("div", { className: "collection-panel" });

  items.forEach((item, index) => {
    const button = element("button", {
      className: "collection-item",
      type: "button",
    });
    if (index === activeItemIndex) button.setAttribute("aria-current", "true");
    button.append(
      element("strong", { text: displayName(item, index) }),
      element("span", { text: displayMeta(item) }),
    );
    button.addEventListener("click", () => {
      activeItemIndex = index;
      renderActiveSection();
    });
    collection.append(button);
  });

  const actions = element("div", { className: "collection-actions" });
  const add = element("button", {
    className: "button secondary small",
    text: "Adicionar",
    type: "button",
  });
  add.addEventListener("click", () => {
    const nextOrder = Math.max(0, ...items.map((item) => Number(item.order) || 0)) + 10;
    items.push(createRootItem(section.path!, nextOrder));
    activeItemIndex = items.length - 1;
    markDirty(record);
    renderActiveSection();
  });
  const remove = element("button", {
    className: "button danger small",
    text: "Excluir",
    type: "button",
  });
  remove.disabled = items.length === 0;
  remove.addEventListener("click", () => {
    if (
      !confirm(`Excluir “${displayName(items[activeItemIndex], activeItemIndex)}”?`)
    ) {
      return;
    }
    items.splice(activeItemIndex, 1);
    activeItemIndex = Math.max(0, activeItemIndex - 1);
    markDirty(record);
    renderActiveSection();
  });
  actions.append(add, remove);
  collection.append(actions);

  const editor = element("div", { className: "editor-panel" });
  if (!items.length) {
    editor.append(
      element("div", {
        className: "empty",
        text: "Nenhum item cadastrado. Use “Adicionar” para começar.",
      }),
    );
  } else {
    const fields = element("div", { className: "fields" });
    renderObjectFields(fields, items[activeItemIndex], () => {
      markDirty(record);
      const selectedButton =
        collection.querySelectorAll(".collection-item")[activeItemIndex];
      if (selectedButton) {
        selectedButton.querySelector("strong")!.textContent = displayName(
          items[activeItemIndex],
          activeItemIndex,
        );
        selectedButton.querySelector("span")!.textContent = displayMeta(
          items[activeItemIndex],
        );
      }
    });
    editor.append(fields);
  }
  layout.append(collection, editor);
  workspace.append(layout);
}

async function saveActiveSection() {
  if (!activeSection.path) return;
  const record = cache.get(activeSection.path);
  if (!record?.dirty) return;

  saveButton.disabled = true;
  saveState.textContent = "Salvando…";
  try {
    const result = await api<{ content: { sha: string } }>("/api/content", {
      method: "PUT",
      body: JSON.stringify({
        path: activeSection.path,
        sha: record.sha,
        message: `admin: atualizar ${activeSection.label.toLocaleLowerCase("pt-BR")}`,
        content: `${JSON.stringify(record.data, null, 2)}\n`,
      }),
    });
    record.sha = result.content.sha;
    record.dirty = false;
    saveButton.hidden = true;
    saveState.textContent = "Alterações publicadas";
    window.setTimeout(() => {
      if (!record.dirty) saveState.textContent = "";
    }, 4000);
  } catch (error) {
    saveState.textContent =
      error instanceof Error ? error.message : "Não foi possível salvar.";
  } finally {
    saveButton.disabled = false;
  }
}

saveButton.addEventListener("click", saveActiveSection);

async function renderImages() {
  workspace.replaceChildren(editorIntro(activeSection));
  const panel = element("div", { className: "panel" });
  const toolbar = element("div", { className: "toolbar" });
  const fileInput = element("input");
  fileInput.type = "file";
  fileInput.accept = ".avif,.jpg,.jpeg,.png,.webp";
  const upload = element("button", {
    className: "button",
    text: "Enviar imagem",
    type: "button",
  });
  upload.addEventListener("click", () => fileInput.click());
  fileInput.addEventListener("change", async () => {
    const file = fileInput.files?.[0];
    if (!file) return;
    const safeName = slugify(file.name.replace(/\.[^.]+$/, ""));
    const extension = file.name.split(".").at(-1)?.toLowerCase();
    if (
      !safeName ||
      !extension ||
      !["avif", "jpg", "jpeg", "png", "webp"].includes(extension)
    ) {
      panel.prepend(notice("Use uma imagem AVIF, JPG, PNG ou WebP.", "error"));
      return;
    }
    const filename = `${safeName}.${extension}`;
    upload.disabled = true;
    upload.textContent = "Enviando…";
    try {
      await api("/api/content", {
        method: "PUT",
        body: JSON.stringify({
          path: `src/assets/catalog/${filename}`,
          message: `admin: adicionar imagem ${filename}`,
          encoding: "base64",
          content: await blobToBase64(file),
        }),
      });
      await renderImages();
    } catch (error) {
      panel.prepend(
        notice(
          error instanceof Error ? error.message : "Falha ao enviar imagem.",
          "error",
        ),
      );
    } finally {
      upload.disabled = false;
      upload.textContent = "Enviar imagem";
      fileInput.value = "";
    }
  });
  toolbar.append(upload, fileInput);
  fileInput.hidden = true;
  panel.append(toolbar);

  const files = await api<RepositoryFile[]>("/api/content?path=src%2Fassets%2Fcatalog");
  const siteImagePaths = ["src/assets/hero-artis.png", "src/assets/processo-artis.png"];
  const siteImages = await Promise.all(
    siteImagePaths.map((path) =>
      api<RepositoryFile>(`/api/content?path=${encodeURIComponent(path)}`),
    ),
  );
  const images = [
    ...siteImages,
    ...files.filter((file) => file.type === "file" && file.name !== ".gitkeep"),
  ];
  const grid = element("div", { className: "image-grid" });
  images.forEach((file) => {
    const card = element("article", { className: "image-card" });
    const image = element("img");
    image.src = file.download_url;
    image.alt = "";
    image.loading = "lazy";
    const body = element("div", { className: "image-card-body" });
    body.append(
      element("strong", { text: file.name }),
      element("small", { text: file.path }),
    );

    const replaceInput = element("input");
    replaceInput.type = "file";
    const extension = file.name.split(".").at(-1)?.toLowerCase() ?? "";
    replaceInput.accept = `.${extension}`;
    replaceInput.hidden = true;
    const replace = element("button", {
      className: "button secondary small",
      text: "Substituir arquivo",
      type: "button",
    });
    replace.addEventListener("click", () => replaceInput.click());
    replaceInput.addEventListener("change", async () => {
      const replacement = replaceInput.files?.[0];
      if (!replacement) return;
      const replacementExtension = replacement.name.split(".").at(-1)?.toLowerCase();
      if (replacementExtension !== extension) {
        panel.prepend(
          notice(
            `Envie um arquivo .${extension} para substituir esta imagem.`,
            "error",
          ),
        );
        replaceInput.value = "";
        return;
      }
      replace.disabled = true;
      replace.textContent = "Substituindo…";
      try {
        await api("/api/content", {
          method: "PUT",
          body: JSON.stringify({
            path: file.path,
            sha: file.sha,
            message: `admin: substituir imagem ${file.name}`,
            encoding: "base64",
            content: await blobToBase64(replacement),
          }),
        });
        await renderImages();
      } catch (error) {
        panel.prepend(
          notice(
            error instanceof Error ? error.message : "Falha ao substituir imagem.",
            "error",
          ),
        );
      } finally {
        replace.disabled = false;
        replace.textContent = "Substituir arquivo";
        replaceInput.value = "";
      }
    });
    body.append(replace, replaceInput);

    const isSiteImage = siteImagePaths.includes(file.path);
    const remove = element("button", {
      className: "button danger small",
      text: "Excluir arquivo",
      type: "button",
    });
    remove.hidden = isSiteImage;
    remove.addEventListener("click", async () => {
      if (
        !confirm(
          `Excluir “${file.name}”? Verifique antes se nenhuma joia ou projeto usa este arquivo.`,
        )
      ) {
        return;
      }
      remove.disabled = true;
      try {
        await api("/api/content", {
          method: "DELETE",
          body: JSON.stringify({
            path: file.path,
            sha: file.sha,
            message: `admin: excluir imagem ${file.name}`,
          }),
        });
        await renderImages();
      } catch (error) {
        panel.prepend(
          notice(
            error instanceof Error ? error.message : "Falha ao excluir imagem.",
            "error",
          ),
        );
      }
    });
    if (!isSiteImage) body.append(remove);
    card.append(image, body);
    grid.append(card);
  });
  if (!images.length) {
    grid.append(
      element("div", { className: "empty", text: "Nenhuma imagem enviada." }),
    );
  }
  panel.append(grid);
  workspace.append(panel);
}

async function importCandidate(
  candidate: ProviderCandidate,
  button: HTMLButtonElement,
) {
  button.disabled = true;
  button.textContent = "Importando…";
  try {
    const productsRecord = await loadFile("src/data/products.json", true);
    const products = productsRecord.data as JsonObject[];
    const categoriesRecord = await loadFile("src/data/categories.json", true);
    const productCategories = (categoriesRecord.data as JsonObject)
      .productCategories as JsonValue[];
    if (!productCategories.map(String).includes(candidate.category)) {
      throw new Error(
        `Cadastre primeiro a categoria “${candidate.category}” na área Categorias.`,
      );
    }

    const { product, imageFilename } = candidateToProductDraft(candidate, products);
    const imageBlob = await api<Blob>(
      "/api/providers/image",
      {
        method: "POST",
        body: JSON.stringify({
          providerId: candidate.providerId,
          url: candidate.imageUrl,
        }),
      },
      "blob",
    );

    await api("/api/content", {
      method: "PUT",
      body: JSON.stringify({
        path: `src/assets/catalog/${imageFilename}`,
        message: `admin: importar imagem ${imageFilename}`,
        encoding: "base64",
        content: await blobToBase64(imageBlob),
      }),
    });

    products.push(product);
    const result = await api<{ content: { sha: string } }>("/api/content", {
      method: "PUT",
      body: JSON.stringify({
        path: "src/data/products.json",
        sha: productsRecord.sha,
        message: `admin: importar rascunho ${String(product.name)}`,
        content: `${JSON.stringify(products, null, 2)}\n`,
      }),
    });
    productsRecord.sha = result.content.sha;
    productsRecord.dirty = false;
    button.textContent = "Importada como rascunho";
    workspace.prepend(
      notice(
        `“${String(product.name)}” foi importada como rascunho. Revise em Joias antes de publicar.`,
        "success",
      ),
    );
  } catch (error) {
    button.disabled = false;
    button.textContent = "Importar como rascunho";
    workspace.prepend(
      notice(error instanceof Error ? error.message : "Falha na importação.", "error"),
    );
  }
}

async function renderImporter() {
  workspace.replaceChildren(editorIntro(activeSection));
  const panel = element("div", { className: "panel" });
  panel.append(
    notice(
      "Somente Ouro, Titânio ASTM, Aço 316L e PVD podem ser importados. Preços e identidade do fornecedor não entram no catálogo público.",
    ),
  );
  const providersRecord = await loadFile("admin/providers.json");
  const providers = (providersRecord.data as JsonObject[]).filter(
    (provider) => provider.enabled,
  );
  const form = element("form", { className: "search-form" });
  const providerSelect = element("select");
  providerSelect.setAttribute("aria-label", "Fornecedor");
  providers.forEach((provider) => {
    const option = element("option", { text: String(provider.name) });
    option.value = String(provider.id);
    providerSelect.append(option);
  });
  const query = element("input");
  query.type = "search";
  query.placeholder = "Ex.: argola, labret, estrela";
  query.required = true;
  query.minLength = 2;
  query.setAttribute("aria-label", "Termo de pesquisa");
  const submit = element("button", {
    className: "button",
    text: "Pesquisar catálogo",
    type: "submit",
  });
  form.append(providerSelect, query, submit);
  const results = element("div");
  panel.append(form, results);
  workspace.append(panel);

  if (!providers.length) {
    submit.disabled = true;
    results.append(
      notice("Ative pelo menos um fornecedor antes de pesquisar.", "error"),
    );
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    submit.disabled = true;
    submit.textContent = "Pesquisando…";
    results.replaceChildren(
      element("div", { className: "loading", text: "Consultando…" }),
    );
    try {
      const payload = await api<{
        candidates: ProviderCandidate[];
        eligibleCount: number;
      }>("/api/providers/search", {
        method: "POST",
        body: JSON.stringify({
          providerId: providerSelect.value,
          query: query.value,
        }),
      });
      results.replaceChildren();
      results.append(
        notice(
          `${payload.candidates.length} peça(s) encontrada(s); ${payload.eligibleCount} com material elegível.`,
          payload.eligibleCount ? "success" : "info",
        ),
      );
      const grid = element("div", { className: "candidate-grid" });
      payload.candidates.forEach((candidate) => {
        const card = element("article", { className: "candidate" });
        const image = element("img");
        image.src = candidate.imageUrl;
        image.alt = candidate.imageAlt || candidate.name;
        image.loading = "lazy";
        const body = element("div", { className: "candidate-body" });
        body.append(
          element("span", {
            className: `badge${candidate.eligible ? "" : " ineligible"}`,
            text: candidate.materialCategory ?? "Material não confirmado",
          }),
          element("h3", { text: candidate.name }),
          element("p", { text: candidate.eligibilityReason }),
        );
        const importButton = element("button", {
          className: "button small",
          text: candidate.eligible
            ? "Importar como rascunho"
            : "Não disponível para importação",
          type: "button",
        });
        importButton.disabled = !candidate.eligible;
        importButton.addEventListener("click", () =>
          importCandidate(candidate, importButton),
        );
        body.append(importButton);
        card.append(image, body);
        grid.append(card);
      });
      if (!payload.candidates.length) {
        grid.append(
          element("div", {
            className: "empty",
            text: "Nenhuma peça encontrada. Tente outro termo.",
          }),
        );
      }
      results.append(grid);
    } catch (error) {
      results.replaceChildren(
        notice(error instanceof Error ? error.message : "Falha na pesquisa.", "error"),
      );
    } finally {
      submit.disabled = false;
      submit.textContent = "Pesquisar catálogo";
    }
  });
}

async function renderActiveSection() {
  sectionTitle(activeSection);
  renderNavigation();
  saveButton.hidden = true;
  saveState.textContent = "";
  workspace.replaceChildren(
    element("div", { className: "loading", text: "Carregando conteúdo…" }),
  );
  try {
    if (activeSection.mode === "images") await renderImages();
    else if (activeSection.mode === "import") await renderImporter();
    else await renderStructuredSection(activeSection);

    const record = activeSection.path ? cache.get(activeSection.path) : null;
    if (record?.dirty) {
      saveButton.hidden = false;
      saveState.textContent = "Alterações não salvas";
    }
  } catch (error) {
    showError(error);
  }
}

async function activateSection(id: string) {
  const next = sections.find((section) => section.id === id);
  if (!next || next.id === activeSection.id) return;
  const currentRecord = activeSection.path ? cache.get(activeSection.path) : null;
  if (
    currentRecord?.dirty &&
    !confirm("Há alterações não salvas nesta área. Deseja trocar de área mesmo assim?")
  ) {
    mobileNav.value = activeSection.id;
    return;
  }
  activeSection = next;
  activeItemIndex = 0;
  history.replaceState(null, "", `#${next.id}`);
  await renderActiveSection();
}

function clearSession() {
  sessionStorage.removeItem("artis-admin-session");
  sessionId = "";
  session = null;
  cache.clear();
}

function showAuth(message?: string) {
  app.hidden = true;
  authScreen.hidden = false;
  if (message) authMessage.textContent = message;
}

async function logout() {
  try {
    if (sessionId) await api("/api/session", { method: "DELETE" });
  } finally {
    clearSession();
    showAuth("Sessão encerrada. Entre novamente quando precisar editar o site.");
  }
}

logoutButton.addEventListener("click", logout);

function readSessionFromHash() {
  const hash = location.hash.slice(1);
  if (!hash.startsWith("session=")) return;
  const candidate = new URLSearchParams(hash).get("session") ?? "";
  if (/^[A-Za-z0-9_-]{32,}$/.test(candidate)) {
    sessionId = candidate;
    sessionStorage.setItem("artis-admin-session", candidate);
    history.replaceState(null, "", location.pathname);
  }
}

async function start() {
  if (!bridgeUrl) {
    loginButton.hidden = true;
    authMessage.textContent =
      "A ponte segura de administração ainda não foi configurada. Consulte a documentação de implantação do repositório.";
    return;
  }

  loginButton.href = `${bridgeUrl}/auth/login`;
  const authFailure = new URLSearchParams(location.search).get("auth");
  const failures: Record<string, string> = {
    invalid: "A autorização expirou ou não pôde ser validada. Tente novamente.",
    failed: "O GitHub não concluiu a autorização. Tente novamente.",
    forbidden: "Esta conta não tem permissão para editar o repositório da ARTÍS.",
  };
  if (authFailure) authMessage.textContent = failures[authFailure] ?? failures.failed;

  readSessionFromHash();
  if (!sessionId) return;

  try {
    session = await api<SessionData>("/api/session");
    authScreen.hidden = true;
    app.hidden = false;
    userName.textContent = session.user.name || session.user.login;
    repositoryName.textContent = session.repository;
    const requestedSection = sections.find(
      (section) => section.id === location.hash.slice(1),
    );
    if (requestedSection) activeSection = requestedSection;
    await renderActiveSection();
  } catch {
    showAuth("Não foi possível validar sua sessão. Entre novamente com o GitHub.");
  }
}

window.addEventListener("beforeunload", (event) => {
  if ([...cache.values()].some((record) => record.dirty)) {
    event.preventDefault();
  }
});

start();
