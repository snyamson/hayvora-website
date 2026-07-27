import { defineField, defineType } from "sanity";

export const seoMeta = defineType({
  name: "seoMeta",
  title: "SEO",
  type: "object",
  fields: [
    defineField({ name: "metaTitle", title: "Meta title", type: "string" }),
    defineField({ name: "metaDescription", title: "Meta description", type: "text", rows: 2 }),
    defineField({ name: "ogImage", title: "Social share image", type: "image" }),
  ],
  options: { collapsible: true, collapsed: true },
});
