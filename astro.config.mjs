import sitemap from "@astrojs/sitemap";
import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://artispiercing.com.br",
  output: "static",
  trailingSlash: "always",
  integrations: [sitemap()],
  image: {
    responsiveStyles: true,
  },
  vite: {
    build: {
      sourcemap: false,
    },
  },
});
