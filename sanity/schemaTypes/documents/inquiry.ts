import { defineField, defineType } from "sanity";

export const inquiry = defineType({
  name: "inquiry",
  title: "Inquiry",
  type: "document",
  fields: [
    defineField({
      name: "kind",
      title: "Kind",
      type: "string",
      options: { list: ["property_viewing", "general_contact", "service_inquiry"] },
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: "property", title: "Property", type: "reference", to: [{ type: "property" }] }),
    defineField({ name: "brand", title: "Brand", type: "reference", to: [{ type: "brand" }] }),
    defineField({ name: "name", title: "Name", type: "string", validation: (Rule) => Rule.required() }),
    defineField({ name: "email", title: "Email", type: "string", validation: (Rule) => Rule.required().email() }),
    defineField({ name: "phone", title: "Phone", type: "string" }),
    defineField({ name: "message", title: "Message", type: "text", rows: 4 }),
    defineField({
      name: "preferredContactMethod",
      title: "Preferred contact method",
      type: "string",
      options: { list: ["email", "phone", "whatsapp"] },
    }),
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      options: { list: ["new", "contacted", "closed"] },
      initialValue: "new",
    }),
    defineField({ name: "source", title: "Source page", type: "string", readOnly: true }),
  ],
  orderings: [
    { title: "Newest first", name: "createdDesc", by: [{ field: "_createdAt", direction: "desc" }] },
  ],
  preview: {
    select: { title: "name", subtitle: "status", description: "message" },
  },
});
