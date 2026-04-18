import { defineField, defineType } from "sanity";

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Налаштування сайту",
  type: "document",
  fields: [
    defineField({
      name: "siteName",
      title: "Назва сайту",
      type: "string",
      initialValue: "TALIRA",
    }),
    defineField({
      name: "phone",
      title: "Телефон",
      type: "string",
    }),
    defineField({
      name: "email",
      title: "Email",
      type: "string",
    }),
    defineField({
      name: "instagram",
      title: "Instagram URL",
      type: "url",
    }),
    defineField({
      name: "facebook",
      title: "Facebook URL",
      type: "url",
    }),
    defineField({
      name: "telegram",
      title: "Telegram URL",
      type: "url",
    }),
    defineField({
      name: "telegramBotChatId",
      title: "Telegram Bot Chat ID (для замовлень)",
      type: "string",
    }),
    defineField({
      name: "telegramBotToken",
      title: "Telegram Bot Token (для замовлень)",
      type: "string",
    }),
    defineField({
      name: "facebookPixelId",
      title: "Facebook Pixel ID",
      type: "string",
    }),
  ],
  preview: {
    prepare() {
      return { title: "Налаштування сайту" };
    },
  },
});
