import { defineField, defineType } from "sanity";

export const category = defineType({
  name: "category",
  title: "Категорія",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Назва категорії",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "URL (slug)",
      type: "slug",
      options: { source: "name", maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "image",
      title: "Фото категорії",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "description",
      title: "Опис",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "order",
      title: "Порядок сортування",
      type: "number",
    }),
  ],
  preview: {
    select: {
      title: "name",
      media: "image",
    },
  },
});
