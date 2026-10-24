import { defineField, defineType } from "sanity";

/** A button or text link: what it says and where it goes. */
export const linkItem = defineType({
  name: "linkItem",
  title: "Link",
  type: "object",
  fields: [
    defineField({ name: "label", title: "Label", type: "string" }),
    defineField({
      name: "href",
      title: "Link",
      description: 'A page path like "/contact", or a full URL.',
      type: "string",
    }),
  ],
  preview: { select: { title: "label", subtitle: "href" } },
});
