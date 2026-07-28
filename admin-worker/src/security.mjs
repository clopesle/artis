export const CONTENT_FILES = new Set([
  "src/data/site.json",
  "src/data/services.json",
  "src/data/products.json",
  "src/data/categories.json",
  "src/data/projects.json",
  "src/data/faqs.json",
  "src/data/pages.json",
  "admin/providers.json",
]);

const IMAGE_PATH = /^src\/assets\/catalog\/[a-z0-9][a-z0-9-]*\.(avif|jpe?g|png|webp)$/i;
const SITE_IMAGES = new Set([
  "src/assets/hero-artis.png",
  "src/assets/processo-artis.png",
]);

export function isAllowedRepositoryPath(path) {
  return (
    CONTENT_FILES.has(path) ||
    path === "src/assets/catalog" ||
    SITE_IMAGES.has(path) ||
    IMAGE_PATH.test(path)
  );
}

export function isAllowedRepositoryWritePath(path) {
  return CONTENT_FILES.has(path) || SITE_IMAGES.has(path) || IMAGE_PATH.test(path);
}

export function assertAllowedRepositoryPath(path) {
  if (!isAllowedRepositoryPath(path)) {
    throw new Error("Caminho do repositório não permitido.");
  }

  return path;
}

export function assertAllowedRepositoryWritePath(path) {
  if (!isAllowedRepositoryWritePath(path)) {
    throw new Error("Caminho de gravação do repositório não permitido.");
  }

  return path;
}

export function parseBearerToken(request) {
  const authorization = request.headers.get("Authorization") ?? "";
  const match = authorization.match(/^Bearer ([A-Za-z0-9_-]{32,})$/);
  return match?.[1] ?? null;
}

export function hasWritePermission(repository) {
  return Boolean(repository?.permissions?.push || repository?.permissions?.admin);
}
