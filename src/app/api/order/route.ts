import { NextRequest, NextResponse } from "next/server";

const BOT_TOKEN = "8622561178:AAGlNSdTB7TWwrxfZlWeSa91tB3V18k5_iw";
const CHAT_ID = "570526308";

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { name, phone, city, warehouse, payment, comment, items, total, orderNumber, status } = data;

    if (!name || !phone || !city || !warehouse) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const itemsList = items.map((i: any, idx: number) =>
      `${idx + 1}. ${i.name} × ${i.quantity} = ${(i.price * i.quantity).toLocaleString("uk-UA")} ₴`
    ).join("\n");

    // Визначаємо текст оплати
    let paymentLabel = "📦 Накладений платіж";
    if (payment === "card") {
      paymentLabel = "💳 На картку";
    } else if (payment && payment.includes("Онлайн")) {
      paymentLabel = payment; // "💳 Онлайн оплата (очікує підтвердження)"
    }

    const text = [
      "🛒 <b>НОВЕ ЗАМОВЛЕННЯ — TALIRA</b>",
      "",
      orderNumber ? `📦 <b>Номер:</b> ${orderNumber}` : "",
      "👤 <b>Ім'я:</b> " + name,
      "📱 <b>Телефон:</b> " + phone,
      "🏙 <b>Місто:</b> " + city,
      "📦 <b>Відділення НП:</b> " + warehouse,
      "💰 <b>Оплата:</b> " + paymentLabel,
      status ? `⏳ <b>Статус:</b> ${status}` : "",
      comment ? "💬 <b>Коментар:</b> " + comment : "",
      "",
      "📋 <b>Товари:</b>",
      itemsList,
      "",
      "💵 <b>РАЗОМ: " + total.toLocaleString("uk-UA") + " ₴</b>",
    ].filter(Boolean).join("\n");

    await fetch("https://api.telegram.org/bot" + BOT_TOKEN + "/sendMessage", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: CHAT_ID, text, parse_mode: "HTML" }),
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
