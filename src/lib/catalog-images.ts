import type { ImageMetadata } from "astro";

const imageModules = import.meta.glob<{ default: ImageMetadata }>(
  "../assets/catalog/*.{avif,jpeg,jpg,png,webp}",
  { eager: true },
);

export function getCatalogImage(filename: string) {
  const module = imageModules[`../assets/catalog/${filename}`];

  if (!module) {
    throw new Error(`Imagem "${filename}" não encontrada em src/assets/catalog/.`);
  }

  return module.default;
}
