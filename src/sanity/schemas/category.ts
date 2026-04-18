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
      name: "description",
      title: "Опис категорії",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "image",
      title: "Обкладинка категорії",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "order",
      title: "Порядок відображення",
      type: "number",
      initialValue: 0,
    }),
  ],
  preview: {
    select: {
      title: "name",
      media: "image",
    },
  },
});
