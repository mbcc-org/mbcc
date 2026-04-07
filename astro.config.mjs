// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://mbcc.org.my",
  integrations: [sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
});
