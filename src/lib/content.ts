export interface Product {
  id: string;
  slug: string;
  published: boolean;
  featured?: boolean;
  name: string;
  shortDescription: string;
  description: string[];
  category: string;
  material: string;
  priceLabel: string;
  availability: "disponivel" | "sob-consulta" | "indisponivel";
  images: string[];
}

export interface Project {
  id: string;
  slug: string;
  published: boolean;
  featured?: boolean;
  title: string;
  shortDescription: string;
  description: string[];
  image: string;
  imageAlt: string;
  categories: string[];
  consentConfirmed: boolean;
}
