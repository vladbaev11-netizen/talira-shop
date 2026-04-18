import { NextRequest, NextResponse } from "next/server";

const BOT_TOKEN = "8622561178:AAGlNSdTB7TWwrxfZlWeSa91tB3V18k5_iw";
const CHAT_ID = "570526308";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, phone, city, product, price, quantity } = body;

    if (!name || !phone || !product) {
      return NextResponse.json(
        { error: "Заповніть всі обов'язкові поля" },
        { status: 400 }
      );
    }

    const qty = quantity || 1;
    const total = price ? price * qty : 0;

    const message = [
      "🛍 *НОВЕ ЗАМОВЛЕННЯ — TALIRA*",
      "",
      `👤 *Ім'я:* ${name}`,
      `📱 *Телефон:* ${phone}`,
      `🏙 *Місто / НП:* ${city || "Не вказано"}`,
      "",
      `📦 *Товар:* ${product}`,
      `🔢 *Кількість:* ${qty} шт.`,
      total ? `💰 *Сума:* ${total.toLocaleString("uk-UA")} ₴` : "",
      "",
      `💳 *Оплата:* Наложений платіж`,
      `🌐 *Джерело:* talira.com.ua`,
      "",
      `⏰ *Час:* ${new Date().toLocaleString("uk-UA", { timeZone: "Europe/Kyiv" })}`,
    ]
      .filter(Boolean)
      .join("\n");

    const telegramUrl = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;

    const response = await fetch(telegramUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: message,
        parse_mode: "Markdown",
      }),
    });

    if (!response.ok) {
      console.error("Telegram API error:", await response.text());
      return NextResponse.json(
        { error: "Помилка відправки" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Order API error:", error);
    return NextResponse.json(
      { error: "Серверна помилка" },
      { status: 500 }
    );
  }
}
