import { NextRequest, NextResponse } from "next/server";

const BOT_TOKEN = "8622561178:AAGlNSdTB7TWwrxfZlWeSa91tB3V18k5_iw";
const CHAT_ID = "570526308";

export async function POST(request: NextRequest) {
  try {
    const { name, phone, message } = await request.json();

    if (!name || !phone) {
      return NextResponse.json({ error: "Name and phone required" }, { status: 400 });
    }

    const text = [
      "💬 *ПОВІДОМЛЕННЯ З САЙТУ — TALIRA*",
      "",
      "👤 *Ім'я:* " + name,
      "📱 *Телефон:* " + phone,
      message ? "📝 *Повідомлення:* " + message : "",
      "",
      "💡 Зателефонуйте або напишіть клієнту!",
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
