import { defineField, defineType } from "sanity";

export const testimonial = defineType({
  name: "testimonial",
  title: "Testimonial",
  type: "document",
  fields: [
    defineField({ name: "authorName", title: "Author name", type: "string", validation: (Rule) => Rule.required() }),
    defineField({ name: "authorRole", title: "Author role", type: "string" }),
    defineField({ name: "authorPhoto", title: "Author photo", type: "image" }),
    defineField({ name: "quote", title: "Quote", type: "text", rows: 3, validation: (Rule) => Rule.required() }),
    defineField({ name: "brand", title: "Brand", type: "reference", to: [{ type: "brand" }] }),
    defineField({ name: "relatedProject", title: "Related project", type: "reference", to: [{ type: "project" }] }),
    defineField({ name: "rating", title: "Rating (1-5)", type: "number", validation: (Rule) => Rule.min(1).max(5) }),
    defineField({ name: "featured", title: "Featured", type: "boolean", initialValue: false }),
  ],
  preview: {
    select: { title: "authorName", subtitle: "quote" },
  },
});
