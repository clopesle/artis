export interface CatalogImage {
  src: string;
  alt: string;
}

export interface Product {
  id: string;
  slug: string;
  published: boolean;
  featured: boolean;
  order: number;
  name: string;
  shortDescription: string;
  description: string[];
  category: string;
  materialCategory: "Ouro" | "Titânio ASTM" | "Aço 316L" | "PVD";
  material: string;
  price: {
    amount: number | null;
    currency: "BRL";
  };
  availability: "disponivel" | "sob-consulta" | "indisponivel";
  closure: string;
  stone?: string;
  options: string[];
  suggestedPlacements: string[];
  images: CatalogImage[];
}

export interface Project {
  id: string;
  slug: string;
  published: boolean;
  featured: boolean;
  order: number;
  title: string;
  shortDescription: string;
  description: string[];
  image: string;
  imageAlt: string;
  categories: string[];
  consentConfirmed: boolean;
}
