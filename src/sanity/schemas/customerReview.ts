import { defineField, defineType } from "sanity";

export const customerReview = defineType({
  name: "customerReview",
  title: "Відгуки клієнтів",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Ім'я клієнта",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "rating",
      title: "Оцінка (1-5)",
      type: "number",
      validation: (Rule) => Rule.required().min(1).max(5),
    }),
    defineField({
      name: "tags",
      title: "Швидкі теги",
      type: "array",
      of: [{ type: "string" }],
      options: {
        list: [
          { title: "Швидка доставка", value: "fast_delivery" },
          { title: "Якісний товар", value: "quality_product" },
          { title: "Гарне спілкування", value: "good_communication" },
          { title: "Рекомендую", value: "recommend" },
          { title: "Гарна упаковка", value: "good_packaging" },
          { title: "Відповідає опису", value: "matches_description" },
        ],
      },
    }),
    defineField({
      name: "text",
      title: "Текст відгуку",
      type: "text",
      rows: 4,
    }),
    defineField({
      name: "product",
      title: "Товар (необов'язково)",
      type: "reference",
      to: [{ type: "product" }],
      description: "Якщо клієнт обрав конкретний товар",
    }),
    defineField({
      name: "approved",
      title: "Опублікований",
      type: "boolean",
      initialValue: false,
      description: "Увімкніть щоб показати на сайті",
    }),
    defineField({
      name: "reply",
      title: "Ваша відповідь",
      type: "text",
      rows: 3,
      description: "Ваша відповідь клієнту (буде видна на сайті)",
    }),
    defineField({
      name: "createdAt",
      title: "Дата",
      type: "datetime",
    }),
  ],
  orderings: [
    {
      title: "Найновіші",
      name: "dateDesc",
      by: [{ field: "createdAt", direction: "desc" }],
    },
  ],
  preview: {
    select: {
      title: "name",
      rating: "rating",
      approved: "approved",
      product: "product.name",
    },
    prepare(selection: Record<string, any>) {
      const { title, rating, approved, product } = selection;
      return {
        title: (approved ? "✅ " : "⏳ ") + (title || ""),
        subtitle: (product ? product + " · " : "") + (rating || 0) + "/5",
      };
    },
  },
});
