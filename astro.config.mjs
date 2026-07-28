import sitemap from "@astrojs/sitemap";
import { defineConfig } from "astro/config";

const repositoryName =
  process.env.GITHUB_REPOSITORY?.split("/").at(-1) ?? "artis";
const hasCustomDomain = Boolean(process.env.CUSTOM_DOMAIN);
const base = hasCustomDomain
  ? "/"
  : (process.env.BASE_PATH ?? `/${repositoryName}`);
const site =
  process.env.SITE_URL ??
  (hasCustomDomain ? "https://example.com" : "https://clopesle.github.io");

export default defineConfig({
  site,
  base,
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
