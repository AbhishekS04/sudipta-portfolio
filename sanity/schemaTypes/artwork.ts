import { defineField, defineType } from "sanity";

export const artworkType = defineType({
  name: "artwork",
  title: "Artwork",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Artwork Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "client",
      title: "Client / Publisher Name",
      type: "string",
      description: "e.g. Moderne Magazine, wired, Apple",
    }),
    defineField({
      name: "description",
      title: "Artwork Description",
      type: "text",
    }),
    defineField({
      name: "tags",
      title: "Tags / Categories",
      type: "array",
      of: [{ type: "string" }],
      options: {
        layout: "tags",
      },
    }),
    defineField({
      name: "mainImage",
      title: "Main Featured Image",
      type: "image",
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: "videoUrl",
      title: "Video URL (optional)",
      type: "url",
      description: "Paste a direct .mp4 URL. If provided, the card plays this video instead of the main image.",
    }),
    defineField({
      name: "images",
      title: "Additional Gallery Images",
      type: "array",
      of: [
        {
          type: "image",
          options: {
            hotspot: true,
          },
        },
      ],
      description: "Upload 2 or more images to show the side-by-side thumbnail layout inside the detail panel.",
    }),
  ],
});

