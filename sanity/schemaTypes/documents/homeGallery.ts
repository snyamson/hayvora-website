import { defineArrayMember, defineField, defineType } from "sanity";

/**
 * Singleton holding the loose photos for the homepage gallery — site photography that
 * isn't tied to a specific project. Project galleries are pooled in alongside these at
 * render time (see getGalleryItems in lib/brandHelpers.ts), so this only needs to carry
 * the extras. An array field rather than one document per image, so a batch of photos
 * can be dropped in at once.
 */
export const homeGallery = defineType({
  name: "homeGallery",
  title: "Home Gallery",
  type: "document",
  fields: [
    defineField({
      name: "heading",
      title: "Section heading",
      type: "string",
      initialValue: "Our work in pictures",
    }),
    defineField({
      name: "eyebrow",
      title: "Section eyebrow",
      type: "string",
      initialValue: "Project Gallery",
    }),
    defineField({
      name: "images",
      title: "Images",
      description:
        "Drag several files in at once. They render in a masonry grid at their natural shape — tall and wide photos both work.",
      type: "array",
      of: [
        defineArrayMember({
          type: "image",
          options: { hotspot: true },
          fields: [
            defineField({ name: "alt", title: "Alt text", type: "string" }),
            defineField({ name: "caption", title: "Caption", type: "string" }),
          ],
        }),
      ],
    }),
  ],
  preview: {
    select: { title: "heading", media: "images.0" },
  },
});
