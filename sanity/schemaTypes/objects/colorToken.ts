import { defineField, defineType } from "sanity";

export const colorToken = defineType({
  name: "colorToken",
  title: "Color",
  type: "object",
  fields: [
    defineField({
      name: "label",
      title: "Label",
      type: "string",
      description: "Internal name, e.g. \"Primary Green\"",
    }),
    defineField({
      name: "hex",
      title: "Hex value",
      type: "string",
      validation: (Rule) =>
        Rule.required().regex(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/, {
          name: "hex color",
        }),
    }),
  ],
  preview: {
    select: { title: "label", subtitle: "hex" },
  },
});
