import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@sanity/client";

const sanityClient = createClient({
  projectId: "777maat6",
  dataset: "production",
  apiVersion: "2024-01-01",
  token: process.env.SANITY_WRITE_TOKEN,
  useCdn: false,
});

const BOT_TOKEN = "8622561178:AAGlNSdTB7TWwrxfZlWeSa91tB3V18k5_iw";
const CHAT_ID = "570526308";

const TAG_LABELS: Record<string, string> = {
  fast_delivery: "Швидка доставка",
  quality_product: "Якісний товар",
  good_communication: "Гарне спілкування",
  recommend: "Рекомендую",
  good_packaging: "Гарна упаковка",
  matches_description: "Відповідає опису",
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, rating, tags, text, productId, productName } = body;

    if (!name || !rating) {
      return NextResponse.json({ error: "Name and rating required" }, { status: 400 });
    }

    // Create document in Sanity
    const doc: any = {
      _type: "customerReview",
      name,
      rating: Number(rating),
      tags: tags || [],
      text: text || "",
      approved: false,
      createdAt: new Date().toISOString(),
    };

    if (productId) {
      doc.product = { _type: "reference", _ref: productId };
    }

    await sanityClient.create(doc);

    // Send to Telegram
    const stars = "★".repeat(rating) + "☆".repeat(5 - rating);
    const tagLabels = (tags || []).map((t: string) => TAG_LABELS[t] || t).join(", ");

    const message = [
      "💬 *НОВИЙ ВІДГУК — TALIRA*",
      "",
      "👤 *Ім'я:* " + name,
      "⭐ *Оцінка:* " + stars,
      tagLabels ? "🏷 *Теги:* " + tagLabels : "",
      text ? "📝 *Текст:* " + text : "",
      productName ? "📦 *Товар:* " + productName : "📦 *Товар:* Загальний відгук",
      "",
      "⏳ Статус: очікує модерації",
      "🔗 Модерація: talira-shop.vercel.app/studio",
    ].filter(Boolean).join("\n");

    await fetch("https://api.telegram.org/bot" + BOT_TOKEN + "/sendMessage", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: CHAT_ID, text: message, parse_mode: "Markdown" }),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Review API error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
