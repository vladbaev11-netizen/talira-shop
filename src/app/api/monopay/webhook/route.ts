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

      // Відправка в Telegram про УСПІШНУ оплату
      const telegramMessage = `
🎉 <b>ЗАМОВЛЕННЯ ОПЛАЧЕНО!</b>

📦 Номер: <b>${reference}</b>
💰 Сума: <b>${(amount / 100).toFixed(2)} ₴</b>
✅ Статус: <b>ОПЛАЧЕНО ОНЛАЙН</b>
💳 Спосіб: Visa/Mastercard/Apple Pay/Google Pay
🔗 Invoice ID: <code>${invoiceId}</code>

⚡️ Клієнт успішно оплатив замовлення через MonoPay.
📦 Можна відправляти товар!
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
    } else if (status === "failure") {
      console.log(`❌ Payment failed: Order ${reference}`);

      // Відправка в Telegram про НЕВДАЛУ оплату
      const telegramMessage = `
⚠️ <b>ОПЛАТА НЕ ПРОЙШЛА</b>

📦 Номер: <b>${reference}</b>
💰 Сума: <b>${(amount / 100).toFixed(2)} ₴</b>
❌ Статус: <b>ПОМИЛКА ОПЛАТИ</b>
🔗 Invoice ID: <code>${invoiceId}</code>

⚠️ Клієнт намагався оплатити, але платіж не пройшов.
📞 Можливо, варто зв'язатися з клієнтом.
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
    }

    return NextResponse.json({ status: "ok" });

  } catch (error) {
    console.error("MonoPay webhook error:", error);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}
