import { defineArrayMember, defineField, defineType } from "sanity";

/**
 * Long-form profile copy for one division: overview, vision, mission, core values,
 * the service catalogue, target clients and operating region.
 *
 * Kept as its own document rather than more fields on `brand` because it's a large,
 * separately-owned block of copy — the brand document is already long, and this lets
 * an editor open "Division profile" and see only this. One document per brand.
 *
 * The site falls back to the copy in `src/lib/divisionContent.ts` when no profile
 * exists for a division, so an unpublished or missing profile degrades to the previous
 * content rather than blanking the page.
 */
export const divisionProfile = defineType({
  name: "divisionProfile",
  title: "Division profile",
  type: "document",
  fields: [
    defineField({
      name: "brand",
      title: "Division",
      type: "reference",
      to: [{ type: "brand" }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "legalName",
      title: "Registered company name",
      description: 'Shown as the Overview heading, e.g. "Hayvora Infrastructure Ltd".',
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "tagline",
      title: "Tagline",
      description: "Rendered as the pull-quote under the overview copy.",
      type: "string",
    }),
    defineField({
      name: "overview",
      title: "Overview paragraphs",
      description: "One entry per paragraph. Rendered in order.",
      type: "array",
      of: [defineArrayMember({ type: "text", rows: 4 })],
    }),
    defineField({ name: "vision", title: "Vision", type: "text", rows: 3 }),
    defineField({ name: "mission", title: "Mission", type: "text", rows: 3 }),
    defineField({
      name: "values",
      title: "Core values",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "divisionValue",
          fields: [
            defineField({ name: "title", title: "Title", type: "string", validation: (Rule) => Rule.required() }),
            defineField({ name: "description", title: "Description", type: "text", rows: 3 }),
          ],
          preview: { select: { title: "title", subtitle: "description" } },
        }),
      ],
    }),
    defineField({
      name: "servicesHeading",
      title: "Services section heading",
      description: 'e.g. "Tailored infrastructure solutions".',
      type: "string",
    }),
    defineField({
      name: "servicesIntro",
      title: "Services section intro",
      description: "The line under the heading — usually who this division serves.",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "services",
      title: "Service catalogue",
      description:
        "The editorial service groups shown in the explorer on the division page. Separate from the `service` documents, which are the individual deep-dive pages.",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "serviceGroup",
          fields: [
            defineField({ name: "title", title: "Title", type: "string", validation: (Rule) => Rule.required() }),
            defineField({ name: "description", title: "Description", type: "text", rows: 2 }),
            defineField({
              name: "items",
              title: "What it covers",
              type: "array",
              of: [defineArrayMember({ type: "string" })],
            }),
            defineField({
              name: "image",
              title: "Photo",
              description:
                "Shown beside this group in the services explorer. Without it the page falls back to the division's other photography, which means every group shows the same picture.",
              type: "image",
              options: { hotspot: true },
            }),
          ],
          preview: { select: { title: "title", subtitle: "description", media: "image" } },
        }),
      ],
    }),
    defineField({
      name: "clients",
      title: "Target clients",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
    }),
    defineField({
      name: "operationalZone",
      title: "Operational zone",
      description: 'e.g. "Ghana and West Africa".',
      type: "string",
    }),
    defineField({
      name: "operationalNote",
      title: "Operational note",
      description: "Short supporting line under the operational zone.",
      type: "text",
      rows: 3,
    }),
  ],
  preview: {
    select: { title: "legalName", subtitle: "brand.name" },
  },
});
