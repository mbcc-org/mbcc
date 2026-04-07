import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const organisations = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/organisations" }),
  schema: z.object({
    name: z.string(),
    abbreviation: z.string().optional(),
    tradition: z.enum(["mahayana", "theravada", "vajrayana"]).optional(),
    role: z.enum(["national-org"]).optional(),
    foundingYear: z.number().optional(),
    website: z.string().optional(),
    contact: z
      .object({
        email: z.string().optional(),
        phone: z.string().optional(),
        address: z.string().optional(),
      })
      .optional(),
    logo: z.string().optional(),
    description: z.string().optional(),
  }),
});

const events = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/events" }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    endDate: z.coerce.date().optional(),
    location: z.string().optional(),
    description: z.string().optional(),
    thumbnail: z.string().optional(),
    photos: z
      .array(
        z.object({
          path: z.string(),
          caption: z.string().optional(),
        }),
      )
      .optional(),
  }),
});

export const collections = { organisations, events };
