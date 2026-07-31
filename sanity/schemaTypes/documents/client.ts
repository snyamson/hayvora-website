import { defineField, defineType } from "sanity";

export const client = defineType({
  name: "client",
  title: "Client",
  type: "document",
  description: "Companies shown in the logo marquee on the Holdings homepage.",
  fields: [
    defineField({ name: "name", title: "Name", type: "string", validation: (Rule) => Rule.required() }),
    defineField({
      name: "logo",
      title: "Logo",
      type: "image",
      description: "Transparent PNG or SVG works best — logos sit on a white card.",
      options: { accept: ".svg,.png" },
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: "website", title: "Website", type: "url" }),
    defineField({ name: "orderRank", title: "Display order", type: "number" }),
  ],
  preview: {
    select: { title: "name", media: "logo" },
  },
});
