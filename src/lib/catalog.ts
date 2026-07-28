import type { Product, Project } from "./content";

export const availabilityLabels: Record<Product["availability"], string> = {
  disponivel: "Disponível",
  "sob-consulta": "Disponibilidade sob consulta",
  indisponivel: "Indisponível",
};

export function byEditorialPriority<
  T extends Pick<Product | Project, "featured" | "order">,
>(left: T, right: T) {
  return Number(right.featured) - Number(left.featured) || left.order - right.order;
}
