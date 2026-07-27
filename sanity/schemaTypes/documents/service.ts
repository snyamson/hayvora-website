import { defineField, defineType } from "sanity";

export const service = defineType({
  name: "service",
  title: "Service",
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
    defineField({ name: "icon", title: "Icon", type: "image" }),
    defineField({ name: "shortDescription", title: "Short description", type: "text", rows: 2 }),
    defineField({ name: "description", title: "Description", type: "array", of: [{ type: "block" }, { type: "image" }] }),
    defineField({
      name: "relatedProjects",
      title: "Related projects",
      type: "array",
      of: [{ type: "reference", to: [{ type: "project" }] }],
    }),
    defineField({ name: "orderRank", title: "Display order", type: "number" }),
  ],
  preview: {
    select: { title: "title", subtitle: "brand.name" },
  },
});
