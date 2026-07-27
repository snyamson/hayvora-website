import { defineField, defineType } from "sanity";

export const address = defineType({
  name: "address",
  title: "Address",
  type: "object",
  fields: [
    defineField({ name: "line1", title: "Address line", type: "string" }),
    defineField({ name: "city", title: "City", type: "string" }),
    defineField({ name: "region", title: "Region", type: "string" }),
    defineField({ name: "country", title: "Country", type: "string", initialValue: "Ghana" }),
    defineField({ name: "mapLink", title: "Map link (Google Maps URL)", type: "url" }),
  ],
});
