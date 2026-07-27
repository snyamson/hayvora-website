import { defineField, defineType } from "sanity";

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Site title", type: "string", initialValue: "Hayvora Holdings Limited" }),
    defineField({
      name: "contactInfo",
      title: "Contact info",
      type: "object",
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
    }),
    defineField({ name: "socialLinks", title: "Social links", type: "array", of: [{ type: "socialLink" }] }),
    defineField({ name: "footerText", title: "Footer text", type: "text", rows: 2 }),
    defineField({
      name: "legalLinks",
      title: "Legal links",
      type: "array",
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
    defineField({ name: "defaultSeo", title: "Default SEO", type: "seoMeta" }),
  ],
  preview: {
    prepare: () => ({ title: "Site Settings" }),
  },
});
