import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

// Кешируем публичный ключ чтобы не запрашивать каждый раз
let cachedPublicKey: string | null = null;

async function getPublicKey(): Promise<string> {
  if (cachedPublicKey) {
    return cachedPublicKey;
  }

  try {
    const response = await fetch("https://api.monobank.ua/api/merchant/pubkey", {
      headers: {
        "X-Token": process.env.MONOPAY_TOKEN!,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch public key");
    }

    const data = await response.json();
    cachedPublicKey = data.key;
    return data.key;
  } catch (error) {
    console.error("Error fetching MonoPay public key:", error);
    throw error;
  }
}

function verifySignature(publicKey: string, xSign: string, body: string): boolean {
  try {
    const verify = crypto.createVerify("SHA256");
    verify.update(body);
    verify.end();
    
    // Публичный ключ должен быть в формате PEM
    const pemKey = `-----BEGIN PUBLIC KEY-----\n${publicKey}\n-----END PUBLIC KEY-----`;
    
    return verify.verify(pemKey, xSign, "base64");
  } catch (error) {
    console.error("Signature verification error:", error);
    return false;
  }
}

export async function POST(req: NextRequest) {
  try {
    const xSign = req.headers.get("X-Sign");
    const bodyText = await req.text();
    const body = JSON.parse(bodyText);
    
    // ЛОГИРУЕМ ВСЁ ЧТО ПРИХОДИТ
    console.log("=== MonoPay Webhook Received ===");
    console.log("Body:", JSON.stringify(body, null, 2));
    console.log("Status:", body.status);
    console.log("Reference:", body.reference);
    console.log("Amount:", body.amount);
    console.log("================================");
    
    // Верифікація підпису
    if (xSign) {
      try {
        const publicKey = await getPublicKey();
        const isValid = verifySignature(publicKey, xSign, bodyText);
        
        if (!isValid) {
          console.error("Invalid signature from MonoPay");
          return NextResponse.json({ error: "Invalid signature" }, { status: 403 });
        }
        
        console.log("✅ Signature verified successfully");
      } catch (error) {
        console.error("Error verifying signature:", error);
        // Продовжуємо обробку навіть якщо верифікація не вдалася (на початку)
      }
    } else {
      console.warn("⚠️ No X-Sign header received from MonoPay");
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
