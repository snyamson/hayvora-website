import { defineField, defineType } from "sanity";

export const project = defineType({
  name: "project",
  title: "Project",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Title", type: "string", validation: (Rule) => Rule.required() }),
    defineField({ name: "slug", title: "Slug", type: "slug", options: { source: "title" }, validation: (Rule) => Rule.required() }),
    defineField({
      name: "brand",
      title: "Brand",
      type: "reference",
      to: [{ type: "brand" }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: "summary", title: "Summary", type: "text", rows: 3 }),
    defineField({ name: "description", title: "Description", type: "array", of: [{ type: "block" }, { type: "image" }] }),
    defineField({ name: "coverImage", title: "Cover image", type: "image", options: { hotspot: true } }),
    defineField({
      name: "gallery",
      title: "Gallery",
      type: "array",
      of: [
        {
          type: "image",
          options: { hotspot: true },
          fields: [
            defineField({ name: "alt", title: "Alt text", type: "string" }),
            defineField({ name: "caption", title: "Caption", type: "string" }),
          ],
        },
      ],
    }),
    defineField({ name: "location", title: "Location", type: "string" }),
    defineField({ name: "year", title: "Year", type: "number" }),
    defineField({
      name: "duration",
      title: "Duration",
      description: "Free text, e.g. \"Oct 2025–Present\" or \"8 Months\"",
      type: "string",
    }),
    defineField({ name: "category", title: "Category tags", type: "array", of: [{ type: "string" }] }),
    defineField({ name: "client", title: "Client (if disclosable)", type: "string" }),
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      options: { list: ["completed", "ongoing", "planned"] },
      initialValue: "completed",
    }),
    defineField({ name: "featured", title: "Featured", type: "boolean", initialValue: false }),
    defineField({ name: "orderRank", title: "Display order", type: "number" }),
    defineField({ name: "seo", title: "SEO", type: "seoMeta" }),
  ],
  preview: {
    select: { title: "title", subtitle: "brand.name", media: "coverImage" },
  },
});
