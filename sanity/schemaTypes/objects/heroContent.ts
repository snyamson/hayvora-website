import { defineField, defineType } from "sanity";

export const heroContent = defineType({
  name: "heroContent",
  title: "Hero",
  type: "object",
  fields: [
    defineField({ name: "headline", title: "Headline", type: "string", validation: (Rule) => Rule.required() }),
    defineField({ name: "subheadline", title: "Subheadline", type: "text", rows: 2 }),
    defineField({
      name: "media",
      title: "Media (slides)",
      type: "array",
      of: [
        {
          type: "object",
          name: "heroSlide",
          fields: [
            defineField({
              name: "type",
              title: "Type",
              type: "string",
              options: { list: ["image", "video"] },
              initialValue: "image",
            }),
            defineField({ name: "image", title: "Image", type: "image", options: { hotspot: true } }),
            defineField({ name: "video", title: "Video file", type: "file", options: { accept: "video/*" } }),
            defineField({ name: "caption", title: "Caption", type: "string" }),
          ],
        },
      ],
      validation: (Rule) => Rule.min(1),
    }),
    defineField({ name: "ctaLabel", title: "CTA label", type: "string" }),
    defineField({ name: "ctaHref", title: "CTA link", type: "string" }),
  ],
});
