import { defineField, defineType } from "sanity";

export const propertySpecs = defineType({
  name: "propertySpecs",
  title: "Specs",
  type: "object",
  fields: [
    defineField({
      name: "propertyType",
      title: "Property type",
      type: "string",
      options: { list: ["land", "house", "apartment", "commercial"] },
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: "bedrooms", title: "Bedrooms", type: "number" }),
    defineField({ name: "bathrooms", title: "Bathrooms", type: "number" }),
    defineField({ name: "sizeSqm", title: "Size (sqm)", type: "number" }),
    defineField({ name: "landSizeAcres", title: "Land size (acres)", type: "number" }),
  ],
});
