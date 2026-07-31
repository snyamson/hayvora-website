import { defineField, defineType } from "sanity";

export const whyChooseContent = defineType({
  name: "whyChooseContent",
  title: "Why Choose",
  type: "object",
  fields: [
    defineField({
      name: "eyebrow",
      title: "Eyebrow (pill label)",
      type: "string",
      initialValue: "Why Choose Hayvora",
    }),
    defineField({
      name: "heading",
      title: "Heading",
      type: "text",
      rows: 3,
      validation: (Rule) => Rule.required(),
    }),

    // The two figures shown here are NOT authored on this object — they come from the
    // brand's `stats` array (1st stat -> photo card, 2nd stat -> video card) so every
    // number on the site has a single source of truth. Edit them under Stats above.
    defineField({ name: "statDescription", title: "Stat description", type: "text", rows: 3 }),
    defineField({ name: "statImage", title: "Stat card photo", type: "image", options: { hotspot: true } }),

    defineField({ name: "ctaLabel", title: "CTA label", type: "string", initialValue: "Get in touch" }),
    defineField({ name: "ctaHref", title: "CTA link", type: "string", initialValue: "/contact" }),

    defineField({
      name: "highlightVideo",
      title: "Highlight background video",
      description: "Plays muted on loop behind the highlight figure. Falls back to the poster image when empty.",
      type: "file",
      options: { accept: "video/*" },
    }),
    defineField({
      name: "highlightPoster",
      title: "Highlight poster image",
      description: "Shown while the video loads, and instead of it when no video is uploaded.",
      type: "image",
      options: { hotspot: true },
    }),
  ],
});
