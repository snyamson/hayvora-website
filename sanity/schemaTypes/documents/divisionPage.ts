import { defineField, defineType } from "sanity";

/**
 * Singleton with the section labels every division homepage shares. The division's own
 * words (tagline, overview, vision, services, values, clients) live on its Division
 * profile; this holds the headings and buttons around them, so the three divisions read
 * the same way.
 */
export const divisionPage = defineType({
  name: "divisionPage",
  title: "Division pages",
  description: 'Links here are inside the division: "/contact" opens that division\'s contact page.',
  type: "document",
  fields: [
    defineField({ name: "overviewCta", title: "Overview button", type: "linkItem" }),
    defineField({ name: "visionLabel", title: "Vision label", type: "string" }),
    defineField({ name: "missionLabel", title: "Mission label", type: "string" }),
    defineField({
      name: "servicesEyebrow",
      title: "Services label",
      description: "The heading and intro come from each Division profile.",
      type: "string",
    }),
    defineField({ name: "valuesIntro", title: "Values intro", type: "sectionIntro" }),
    defineField({ name: "clientsIntro", title: "Clients intro", type: "sectionIntro" }),
    defineField({ name: "zoneEyebrow", title: "Operational zone label", type: "string" }),
    defineField({
      name: "projects",
      title: "Projects",
      type: "object",
      fields: [
        defineField({ name: "heading", title: "Heading", type: "string" }),
        defineField({ name: "cta", title: "Button", type: "linkItem" }),
        defineField({ name: "emptyText", title: "Text when there are no projects", type: "string" }),
      ],
    }),
    defineField({
      name: "closing",
      title: "Closing card",
      type: "object",
      fields: [
        defineField({ name: "eyebrow", title: "Label", type: "string" }),
        defineField({ name: "heading", title: "Heading", type: "string" }),
        defineField({ name: "body", title: "Text", type: "text", rows: 2 }),
        defineField({ name: "primaryCta", title: "First button", type: "linkItem" }),
        defineField({ name: "secondaryCta", title: "Second button", type: "linkItem" }),
        defineField({ name: "image", title: "Photo", type: "image", options: { hotspot: true } }),
      ],
    }),
  ],
  preview: { prepare: () => ({ title: "Division pages" }) },
});
