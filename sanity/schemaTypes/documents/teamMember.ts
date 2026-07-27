import { defineField, defineType } from "sanity";

export const teamMember = defineType({
  name: "teamMember",
  title: "Team Member",
  type: "document",
  fields: [
    defineField({ name: "name", title: "Name", type: "string", validation: (Rule) => Rule.required() }),
    defineField({ name: "role", title: "Role", type: "string", validation: (Rule) => Rule.required() }),
    defineField({ name: "photo", title: "Photo", type: "image", options: { hotspot: true } }),
    defineField({ name: "bio", title: "Bio", type: "array", of: [{ type: "block" }] }),
    defineField({
      name: "brand",
      title: "Brand",
      type: "reference",
      to: [{ type: "brand" }],
      description: "Leave empty for Holdings-level executive team",
    }),
    defineField({ name: "orderRank", title: "Display order", type: "number" }),
    defineField({ name: "socialLinks", title: "Social links", type: "array", of: [{ type: "socialLink" }] }),
  ],
  preview: {
    select: { title: "name", subtitle: "role", media: "photo" },
  },
});
