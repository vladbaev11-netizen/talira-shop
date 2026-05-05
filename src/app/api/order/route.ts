import { NextRequest, NextResponse } from "next/server";

const BOT_TOKEN = "8622561178:AAGlNSdTB7TWwrxfZlWeSa91tB3V18k5_iw";
const CHAT_ID = "570526308";

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { name, phone, city, warehouse, payment, comment, items, total } = data;

    if (!name || !phone || !city || !warehouse) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const itemsList = items.map((i: any, idx: number) =>
      `${idx + 1}. ${i.name} × ${i.quantity} = ${(i.price * i.quantity).toLocaleString("uk-UA")} ₴`
    ).join("\n");

    const paymentLabel = payment === "card" ? "💳 На картку" : "📦 Накладений платіж";

    const text = [
      "🛒 *НОВЕ ЗАМОВЛЕННЯ — TALIRA*",
      "",
      "👤 *Ім'я:* " + name,
      "📱 *Телефон:* " + phone,
      "🏙 *Місто:* " + city,
      "📦 *Відділення НП:* " + warehouse,
      "💰 *Оплата:* " + paymentLabel,
      comment ? "💬 *Коментар:* " + comment : "",
      "",
      "📋 *Товари:*",
      itemsList,
      "",
      "💵 *РАЗОМ: " + total.toLocaleString("uk-UA") + " ₴*",
    ].filter(Boolean).join("\n");

    await fetch("https://api.telegram.org/bot" + BOT_TOKEN + "/sendMessage", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: CHAT_ID, text, parse_mode: "Markdown" }),
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
