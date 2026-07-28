import type { ImageMetadata } from "astro";

const rootImageModules = import.meta.glob<{ default: ImageMetadata }>(
  "../assets/*.{avif,jpeg,jpg,png,webp}",
  { eager: true },
);
const catalogImageModules = import.meta.glob<{ default: ImageMetadata }>(
  "../assets/catalog/*.{avif,jpeg,jpg,png,webp}",
  { eager: true },
);

export function getSiteImage(filename: string) {
  const catalogFilename = filename.replace(/^catalog\//, "");
  const module =
    rootImageModules[`../assets/${filename}`] ??
    catalogImageModules[`../assets/catalog/${catalogFilename}`];

  if (!module) {
    throw new Error(`Imagem editorial "${filename}" não encontrada em src/assets/.`);
  }

  return module.default;
}
