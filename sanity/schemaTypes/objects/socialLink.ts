import { defineField, defineType } from "sanity";

export const socialLink = defineType({
  name: "socialLink",
  title: "Social link",
  type: "object",
  fields: [
    defineField({
      name: "platform",
      title: "Platform",
      type: "string",
      options: { list: ["facebook", "instagram", "linkedin", "x", "youtube", "tiktok", "whatsapp"] },
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: "url", title: "URL", type: "url", validation: (Rule) => Rule.required() }),
  ],
  preview: {
    select: { title: "platform", subtitle: "url" },
  },
});
