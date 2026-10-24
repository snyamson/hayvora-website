import { defineField, defineType } from "sanity";

/**
 * Singleton for the group homepage text. The hero, stats, Why Choose block and process
 * steps stay on the Hayvora Limited brand document; everything else on the page is here,
 * one group per section, top to bottom.
 */
export const homePage = defineType({
  name: "homePage",
  title: "Home page",
  type: "document",
  groups: [
    { name: "statement", title: "Statement", default: true },
    { name: "metrics", title: "Key metrics" },
    { name: "divisions", title: "Divisions" },
    { name: "narrative", title: "Photo band" },
    { name: "process", title: "Process" },
    { name: "projects", title: "Projects" },
    { name: "properties", title: "Properties" },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    defineField({
      name: "statement",
      title: "Statement panel",
      description: "The blue panel under the hero.",
      type: "object",
      group: "statement",
      fields: [
        defineField({ name: "text", title: "Text", type: "text", rows: 4 }),
        defineField({ name: "cta", title: "Button", type: "linkItem" }),
      ],
    }),
    defineField({
      name: "metrics",
      title: "Key metrics intro",
      description: "The figures themselves are the Stats on the Hayvora Limited brand.",
      type: "sectionIntro",
      group: "metrics",
    }),
    defineField({ name: "divisions", title: "Divisions intro", type: "sectionIntro", group: "divisions" }),
    defineField({
      name: "divisionCardLabel",
      title: "Division card link label",
      type: "string",
      group: "divisions",
    }),
    defineField({
      name: "narrative",
      title: "Photo band",
      description: "The photo comes from the brand's narrative photo.",
      type: "object",
      group: "narrative",
      fields: [
        defineField({ name: "heading", title: "Heading", type: "string" }),
        defineField({ name: "body", title: "Text", type: "text", rows: 3 }),
        defineField({ name: "cta", title: "Button", type: "linkItem" }),
      ],
    }),
    defineField({
      name: "process",
      title: "Process",
      description: "The steps are on the Hayvora Limited brand.",
      type: "object",
      group: "process",
      fields: [
        defineField({ name: "intro", title: "Intro", type: "sectionIntro" }),
        defineField({ name: "cta", title: "Button inside an open step", type: "linkItem" }),
      ],
    }),
    defineField({
      name: "featuredProjects",
      title: "Featured projects",
      type: "object",
      group: "projects",
      fields: [
        defineField({ name: "heading", title: "Heading", type: "string" }),
        defineField({ name: "cta", title: "Button", type: "linkItem" }),
        defineField({ name: "emptyText", title: "Text when there are no featured projects", type: "string" }),
      ],
    }),
    defineField({
      name: "properties",
      title: "Properties",
      type: "object",
      group: "properties",
      fields: [
        defineField({ name: "intro", title: "Intro", type: "sectionIntro" }),
        defineField({ name: "cardLinkLabel", title: "Card link label", type: "string" }),
        defineField({ name: "cta", title: "Button", type: "linkItem" }),
        defineField({ name: "emptyText", title: "Text when there are no listings", type: "string" }),
      ],
    }),
    defineField({ name: "seo", title: "SEO", type: "seoMeta", group: "seo" }),
  ],
  preview: { prepare: () => ({ title: "Home page" }) },
});
