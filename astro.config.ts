import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import { SITE_URL } from "./src/config";

// USER root page (givepro91.github.io) → no `base` needed.
export default defineConfig({
  site: SITE_URL,
  integrations: [mdx(), sitemap()],
  build: { format: "directory" },
});
