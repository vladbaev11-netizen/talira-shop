import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Верифікація підпису від MonoPay (опціонально, але рекомендовано)
    const xSign = req.headers.get("X-Sign");
    if (xSign) {
      // Тут можна додати перевірку підпису якщо MonoPay надає публічний ключ
    }

    const { invoiceId, status, amount, reference } = body;

    // Статуси MonoPay:
    // success - оплачено
    // failure - помилка
    // processing - в обробці

    if (status === "success") {
      console.log(`✅ Payment successful: Order ${reference}, Amount: ${amount / 100} грн`);

      // Відправка в Telegram
      const telegramMessage = `
🎉 <b>ЗАМОВЛЕННЯ ОПЛАЧЕНО ОНЛАЙН!</b>

📦 Номер: <b>${reference}</b>
💳 Сума: <b>${(amount / 100).toFixed(2)} ₴</b>
✅ Статус: ОПЛАЧЕНО
🔗 Invoice ID: ${invoiceId}

Клієнт оплатив онлайн через MonoPay.
      `.trim();

      await fetch(
        `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: process.env.TELEGRAM_CHAT_ID,
            text: telegramMessage,
            parse_mode: "HTML",
          }),
        }
      );

      // Тут можна оновити статус замовлення в базі даних
      // await updateOrderStatus(reference, "paid");
    }

    return NextResponse.json({ status: "ok" });

  } catch (error) {
    console.error("MonoPay webhook error:", error);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}
