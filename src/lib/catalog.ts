import type { Product, Project } from "./content";
import pages from "../data/pages.json";

export const availabilityLabels: Record<Product["availability"], string> = {
  disponivel: pages.global.availabilityLabels.disponivel,
  "sob-consulta": pages.global.availabilityLabels["sob-consulta"],
  indisponivel: pages.global.availabilityLabels.indisponivel,
};

export function byEditorialPriority<
  T extends Pick<Product | Project, "featured" | "order">,
>(left: T, right: T) {
  return Number(right.featured) - Number(left.featured) || left.order - right.order;
}
