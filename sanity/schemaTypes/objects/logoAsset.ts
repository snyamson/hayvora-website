import { defineField, defineType } from "sanity";

export const logoAsset = defineType({
  name: "logoAsset",
  title: "Logo",
  type: "object",
  fields: [
    defineField({
      name: "variant",
      title: "Variant",
      type: "string",
      options: {
        list: [
          { title: "Primary (full color, light background)", value: "primary" },
          { title: "Reversed (white, dark background)", value: "reversed" },
          { title: "Mark / icon only", value: "mark" },
          { title: "Wordmark (sits beside the mark in the header)", value: "wordmark" },
          { title: "Stacked, cropped (footer)", value: "stacked" },
          { title: "Favicon", value: "favicon" },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "image",
      title: "File",
      type: "image",
      options: { accept: ".svg,.png" },
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: { title: "variant", media: "image" },
  },
});
