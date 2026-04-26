import { defineField, defineType } from "sanity";

export const subcategory = defineType({
  name: "subcategory",
  title: "Підкатегорія",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Назва підкатегорії",
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
      name: "parentCategory",
      title: "Батьківська категорія",
      type: "reference",
      to: [{ type: "category" }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "image",
      title: "Фото",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "order",
      title: "Порядок",
      type: "number",
    }),
  ],
  preview: {
    select: {
      title: "name",
      parent: "parentCategory.name",
      media: "image",
    },
    prepare(selection: Record<string, any>) {
      const { title, parent, media } = selection;
      return {
        title,
        subtitle: parent || "",
        media,
      };
    },
  },
});
