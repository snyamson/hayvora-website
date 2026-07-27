import { defineField, defineType } from "sanity";

export const property = defineType({
  name: "property",
  title: "Property",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Title", type: "string", validation: (Rule) => Rule.required() }),
    defineField({ name: "slug", title: "Slug", type: "slug", options: { source: "title" }, validation: (Rule) => Rule.required() }),
    defineField({
      name: "brand",
      title: "Category (business unit)",
      type: "reference",
      to: [{ type: "brand" }],
      description: "Shown as a badge/filter on the Holdings /properties hub, e.g. \"Infrastructure\", \"Greenhouse\".",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "images",
      title: "Images",
      type: "array",
      of: [{ type: "image", options: { hotspot: true } }],
      description: "First image is used as the cover photo.",
      validation: (Rule) => Rule.min(1),
    }),
    defineField({ name: "price", title: "Price (GHS)", type: "number" }),
    defineField({ name: "priceOnRequest", title: "Price on request", type: "boolean", initialValue: false }),
    defineField({ name: "location", title: "Location", type: "address" }),
    defineField({ name: "specs", title: "Specs", type: "propertySpecs" }),
    defineField({ name: "description", title: "Description", type: "array", of: [{ type: "block" }] }),
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      options: {
        list: [
          { title: "Available", value: "available" },
          { title: "Reserved", value: "reserved" },
          { title: "Sold", value: "sold" },
        ],
      },
      initialValue: "available",
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: "featured", title: "Featured", type: "boolean", initialValue: false }),
    defineField({ name: "listedDate", title: "Listed date", type: "datetime" }),
    defineField({ name: "seo", title: "SEO", type: "seoMeta" }),
  ],
  preview: {
    select: { title: "title", subtitle: "status", media: "images.0" },
  },
});
