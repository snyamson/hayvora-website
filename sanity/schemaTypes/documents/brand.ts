import { defineField, defineType } from "sanity";

const KNOWN_SLUGS = ["holdings", "infrastructure", "jhm-geo-consult", "agrisystem-analytics"];

export const brand = defineType({
  name: "brand",
  title: "Brand",
  type: "document",
  fields: [
    defineField({ name: "name", title: "Name", type: "string", validation: (Rule) => Rule.required() }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "name" },
      description: `Must be one of: ${KNOWN_SLUGS.join(", ")}`,
      validation: (Rule) =>
        Rule.required().custom((slug) => {
          if (!slug?.current) return "Slug is required";
          return KNOWN_SLUGS.includes(slug.current)
            ? true
            : `Slug must be one of: ${KNOWN_SLUGS.join(", ")}`;
        }),
    }),
    defineField({
      name: "isParent",
      title: "Is this the Holdings parent brand?",
      type: "boolean",
      initialValue: false,
    }),
    defineField({ name: "tagline", title: "Tagline", type: "string" }),
    defineField({ name: "shortDescription", title: "Short description", type: "text", rows: 3 }),
    defineField({
      name: "logos",
      title: "Logos",
      type: "array",
      of: [{ type: "logoAsset" }],
    }),
    defineField({
      name: "colors",
      title: "Brand colors",
      type: "object",
      fields: [
        defineField({ name: "primary", title: "Primary", type: "colorToken" }),
        defineField({ name: "secondary", title: "Secondary", type: "colorToken" }),
        defineField({ name: "accent", title: "Accent", type: "colorToken" }),
        defineField({ name: "surface", title: "Surface (background tint)", type: "colorToken" }),
        defineField({ name: "ink", title: "Ink (default text)", type: "colorToken" }),
        defineField({ name: "textOnPrimary", title: "Text on primary", type: "colorToken" }),
      ],
    }),
    defineField({ name: "hero", title: "Homepage hero", type: "heroContent" }),
    defineField({
      name: "narrativeImage",
      title: "Narrative statement background photo",
      description: "Full-bleed photo behind the \"One holding company...\" statement band on the homepage.",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({ name: "about", title: "About", type: "array", of: [{ type: "block" }, { type: "image" }] }),
    defineField({
      name: "stats",
      title: "Stats",
      description: "e.g. \"232\" / \"Projects Completed\"",
      type: "array",
      of: [
        {
          type: "object",
          name: "stat",
          fields: [
            defineField({ name: "value", title: "Value", type: "string", validation: (Rule) => Rule.required() }),
            defineField({ name: "label", title: "Label", type: "string", validation: (Rule) => Rule.required() }),
          ],
          preview: { select: { title: "value", subtitle: "label" } },
        },
      ],
    }),
    defineField({
      name: "process",
      title: "Process steps",
      type: "array",
      of: [
        {
          type: "object",
          name: "processStep",
          fields: [
            defineField({ name: "title", title: "Title", type: "string", validation: (Rule) => Rule.required() }),
            defineField({ name: "description", title: "Description", type: "text", rows: 2 }),
          ],
          preview: { select: { title: "title", subtitle: "description" } },
        },
      ],
    }),
    defineField({
      name: "services",
      title: "Services",
      type: "array",
      of: [{ type: "reference", to: [{ type: "service" }] }],
    }),
    defineField({
      name: "enabledModules",
      title: "Enabled modules",
      type: "array",
      of: [{ type: "string" }],
      options: {
        list: ["projects", "gallery", "team", "testimonials", "services"],
      },
      description: "Note: property listings are managed on the Holdings site's /properties hub, not per-brand.",
    }),
    defineField({ name: "orderRank", title: "Display order", type: "number" }),
    defineField({ name: "seo", title: "SEO", type: "seoMeta" }),
  ],
  preview: {
    select: { title: "name", subtitle: "slug.current" },
  },
});
