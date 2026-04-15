// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://mbcc.org.my",
  redirects: {
    "/organisations": "/member-organisations",
    "/organisations/[slug]": "/member-organisations/[slug]",
  },
  integrations: [
    sitemap({
      filter: (page) => !page.includes("/registered-organisations"),
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
