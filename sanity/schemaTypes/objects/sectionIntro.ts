import { defineField, defineType } from "sanity";

/**
 * The label, heading and intro line at the top of a page section. The bold part is
 * printed straight after the heading, so "Three specialist divisions," + "one standard
 * of excellence" reads as one sentence with the second half in bold.
 */
export const sectionIntro = defineType({
  name: "sectionIntro",
  title: "Section intro",
  type: "object",
  fields: [
    defineField({ name: "eyebrow", title: "Label", description: "Small text above the heading.", type: "string" }),
    defineField({ name: "heading", title: "Heading", type: "string" }),
    defineField({
      name: "headingEmphasis",
      title: "Heading, bold part",
      description: "Optional. Shown in bold right after the heading.",
      type: "string",
    }),
    defineField({ name: "description", title: "Intro text", type: "text", rows: 3 }),
  ],
  preview: { select: { title: "heading", subtitle: "eyebrow" } },
});
