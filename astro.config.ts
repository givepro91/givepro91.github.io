import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import { SITE_URL } from "./src/config";

// USER root page (givepro91.github.io) → no `base` needed.
export default defineConfig({
  site: SITE_URL,
  // /interview 는 비공개 문서라 사이트맵에서 뺀다 (페이지 자체에도 noindex).
  integrations: [mdx(), sitemap({ filter: (page) => !page.includes("/interview") })],
  build: { format: "directory" },
});
