import { defineField, defineType } from "sanity";

export const product = defineType({
  name: "product",
  title: "Товар",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Назва товару",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "sku",
      title: "Артикул (код товару)",
      type: "string",
      description: "Унікальний код товару для пошуку та роботи з клієнтами",
    }),
    defineField({
      name: "slug",
      title: "URL (slug)",
      type: "slug",
      options: { source: "name", maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "category",
      title: "Категорія",
      type: "reference",
      to: [{ type: "category" }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "subcategory",
      title: "Підкатегорія",
      type: "reference",
      to: [{ type: "subcategory" }],
    }),
    defineField({
      name: "price",
      title: "Ціна (₴)",
      type: "number",
      validation: (Rule) => Rule.required().positive(),
    }),
    defineField({
      name: "oldPrice",
      title: "Стара ціна (₴)",
      type: "number",
      description: "Для відображення знижки (необов'язково)",
    }),
    defineField({
      name: "inStock",
      title: "В наявності",
      type: "boolean",
      initialValue: true,
    }),
    defineField({
      name: "badge",
      title: "Бейдж",
      type: "string",
      options: {
        list: [
          { title: "Хіт", value: "hit" },
          { title: "Новинка", value: "new" },
          { title: "Акція", value: "sale" },
        ],
      },
    }),
    defineField({
      name: "mainImage",
      title: "Головне фото",
      type: "image",
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "gallery",
      title: "Галерея (до 8 фото)",
      type: "array",
      of: [{ type: "image", options: { hotspot: true } }],
      validation: (Rule) => Rule.max(8),
    }),
    defineField({
      name: "videoUrl",
      title: "Відео (YouTube URL)",
      type: "url",
    }),
    defineField({
      name: "shortDescription",
      title: "Короткий опис",
      type: "text",
      rows: 3,
      description: "Для картки товару та hero-блоку",
    }),
    defineField({
      name: "benefits",
      title: "Переваги",
      type: "array",
      of: [{ type: "string" }],
      description: "3-4 коротких переваги з галочками",
    }),
    defineField({
      name: "description",
      title: "Повний опис",
      type: "array",
      of: [{ type: "block" }],
    }),
    defineField({
      name: "specs",
      title: "Характеристики",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "label", title: "Параметр", type: "string" },
            { name: "value", title: "Значення", type: "string" },
          ],
          preview: {
            select: { title: "label", subtitle: "value" },
          },
        },
      ],
    }),
    defineField({
      name: "reviews",
      title: "Відгуки",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "name", title: "Ім'я", type: "string" },
            { name: "city", title: "Місто", type: "string" },
            { name: "rating", title: "Рейтинг (1-5)", type: "number" },
            { name: "text", title: "Текст відгуку", type: "text" },
            {
              name: "approved",
              title: "Опублікований",
              type: "boolean",
              initialValue: true,
              description: "Зніміть галочку щоб приховати відгук",
            },
          ],
          preview: {
            select: { title: "name", subtitle: "text", approved: "approved" },
            prepare({ title, subtitle, approved }: { title: string; subtitle: string; approved: boolean }) {
              return {
                title: (approved ? "✅ " : "❌ ") + title,
                subtitle,
              };
            },
          },
        },
      ],
    }),
    defineField({
      name: "relatedProducts",
      title: "Схожі товари",
      type: "array",
      of: [{ type: "reference", to: [{ type: "product" }] }],
    }),
    defineField({
      name: "seoTitle",
      title: "SEO Title",
      type: "string",
    }),
    defineField({
      name: "seoDescription",
      title: "SEO Description",
      type: "text",
      rows: 3,
    }),
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "sku",
      price: "price",
      media: "mainImage",
    },
    prepare(selection: Record<string, any>) {
      const { title, subtitle, price, media } = selection;
      return {
        title,
        subtitle: [subtitle, price ? price + " ₴" : ""].filter(Boolean).join(" · "),
        media,
      };
    },
  },
});
