import { defineArrayMember, defineField, defineType } from "sanity";

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  groups: [
    { name: "general", title: "General", default: true },
    { name: "header", title: "Header and menu" },
    { name: "closing", title: "Closing card" },
    { name: "footer", title: "Footer" },
    { name: "labels", title: "Labels" },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    defineField({ name: "title", title: "Site title", type: "string", initialValue: "Hayvora Limited", group: "general" }),
    defineField({
      name: "companyName",
      title: "Company name",
      description: "Used for the copyright line and the logo's name for screen readers.",
      type: "string",
      initialValue: "Hayvora Limited",
      group: "general",
    }),
    defineField({
      name: "contactInfo",
      title: "Contact info",
      type: "object",
      group: "general",
      fields: [
        defineField({ name: "email", title: "Email", type: "string" }),
        defineField({ name: "phone", title: "Phone", type: "string" }),
        defineField({ name: "whatsapp", title: "WhatsApp number", type: "string" }),
        defineField({ name: "address", title: "Address", type: "address" }),
      ],
    }),
    defineField({
      name: "leadNotificationEmail",
      title: "Lead notification email",
      description: "Staff inbox that receives new property/contact inquiries",
      type: "string",
      group: "general",
    }),
    defineField({ name: "socialLinks", title: "Social links", type: "array", of: [{ type: "socialLink" }], group: "general" }),
    defineField({ name: "footerText", title: "Footer text", type: "text", rows: 2, group: "footer" }),
    defineField({
      name: "legalLinks",
      title: "Legal links",
      type: "array",
      group: "footer",
      of: [
        {
          type: "object",
          name: "legalLink",
          fields: [
            defineField({ name: "label", title: "Label", type: "string" }),
            defineField({ name: "url", title: "URL", type: "url" }),
          ],
        },
      ],
    }),

    defineField({
      name: "header",
      title: "Header",
      type: "object",
      group: "header",
      fields: [
        defineField({
          name: "navItems",
          title: "Menu items",
          type: "array",
          of: [
            defineArrayMember({
              type: "object",
              name: "navItem",
              fields: [
                defineField({ name: "label", title: "Label", type: "string" }),
                defineField({ name: "href", title: "Link", type: "string" }),
                defineField({
                  name: "opensDivisionsMenu",
                  title: "Opens the Divisions menu",
                  description: "On hover, show the Divisions panel under the header.",
                  type: "boolean",
                  initialValue: false,
                }),
              ],
              preview: { select: { title: "label", subtitle: "href" } },
            }),
          ],
        }),
        defineField({ name: "cta", title: "Button", type: "linkItem" }),
        defineField({ name: "openMenuLabel", title: "Open menu (screen readers)", type: "string" }),
        defineField({ name: "closeMenuLabel", title: "Close menu (screen readers)", type: "string" }),
      ],
    }),
    defineField({
      name: "divisionsMenu",
      title: "Divisions menu",
      description: "The panel under the header. Division cards and projects fill in by themselves.",
      type: "object",
      group: "header",
      fields: [
        defineField({ name: "eyebrow", title: "Label", type: "string" }),
        defineField({ name: "heading", title: "Heading", type: "string" }),
        defineField({ name: "body", title: "Text", type: "text", rows: 3 }),
        defineField({ name: "cta", title: "Button", type: "linkItem" }),
        defineField({ name: "featuredHeading", title: "Projects row heading", type: "string" }),
        defineField({ name: "featuredLink", title: "Projects row link", type: "linkItem" }),
      ],
    }),

    defineField({
      name: "closingCta",
      title: "Closing card",
      description: "The photo card above the footer on group pages.",
      type: "object",
      group: "closing",
      fields: [
        defineField({ name: "eyebrow", title: "Label", type: "string" }),
        defineField({ name: "heading", title: "Heading", type: "string" }),
        defineField({ name: "body", title: "Text", type: "text", rows: 3 }),
        defineField({ name: "primaryCta", title: "First button", type: "linkItem" }),
        defineField({ name: "secondaryCta", title: "Second button", type: "linkItem" }),
        defineField({ name: "image", title: "Photo", type: "image", options: { hotspot: true } }),
      ],
    }),

    defineField({
      name: "footer",
      title: "Footer",
      type: "object",
      group: "footer",
      fields: [
        defineField({ name: "headquartersLabel", title: "Headquarters label", type: "string" }),
        defineField({ name: "exploreHeading", title: "Explore column heading", type: "string" }),
        defineField({ name: "exploreLinks", title: "Explore links", type: "array", of: [{ type: "linkItem" }] }),
        defineField({
          name: "divisionsHeading",
          title: "Divisions column heading",
          description: "The division links fill in by themselves.",
          type: "string",
        }),
        defineField({ name: "contactHeading", title: "Contact column heading", type: "string" }),
        defineField({ name: "whatsappLabel", title: "WhatsApp label", type: "string" }),
        defineField({ name: "enquiryLink", title: "Enquiry link", type: "linkItem" }),
        defineField({
          name: "rightsText",
          title: "Copyright text",
          description: 'Shown after "© year company name".',
          type: "string",
        }),
        defineField({ name: "locationText", title: "Location line", type: "string" }),
        defineField({ name: "backToTopLabel", title: "Back to top label", type: "string" }),
      ],
    }),

    defineField({
      name: "labels",
      title: "Shared labels",
      description: "Small words used across the site.",
      type: "object",
      group: "labels",
      fields: [
        defineField({ name: "home", title: "Home (breadcrumbs)", type: "string" }),
        defineField({ name: "breadcrumb", title: "Breadcrumb (screen readers)", type: "string" }),
        defineField({ name: "previous", title: "Previous", type: "string" }),
        defineField({ name: "next", title: "Next", type: "string" }),
        defineField({
          name: "counter",
          title: "Slide counter",
          description: "{from}, {to} and {total} are filled in, e.g. \"1 – 3 of 4\".",
          type: "string",
        }),
        defineField({ name: "goToSlide", title: "Go to slide (screen readers)", description: "{n} is the slide number.", type: "string" }),
        defineField({ name: "close", title: "Close", type: "string" }),
        defineField({ name: "scroll", title: "Scroll hint", type: "string" }),
      ],
    }),

    defineField({ name: "defaultSeo", title: "Default SEO", type: "seoMeta", group: "seo" }),
    defineField({
      name: "titleSuffix",
      title: "Title for the home page tab",
      description: "Shown after the site title on the home page.",
      type: "string",
      group: "seo",
    }),
    defineField({ name: "keywords", title: "Search keywords", type: "array", of: [{ type: "string" }], group: "seo" }),
  ],
  preview: {
    prepare: () => ({ title: "Site Settings" }),
  },
});
