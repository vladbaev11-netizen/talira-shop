import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { amount, orderReference, customerName, customerPhone } = body;

    // Преобразуем сумму в копейки (целое число)
    const amountInKopiyky = Math.round(Number(amount) * 100);
    
    if (isNaN(amountInKopiyky) || amountInKopiyky <= 0) {
      console.error("Invalid amount:", amount);
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }

    // Создаём инвойс в MonoPay
    const response = await fetch("https://api.monobank.ua/api/merchant/invoice/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Token": process.env.MONOPAY_TOKEN!,
      },
      body: JSON.stringify({
        amount: amountInKopiyky, // Сумма в копійках (целое число)
        ccy: 980, // UAH
        merchantPaymInfo: {
          reference: orderReference,
          destination: `Замовлення ${orderReference}`,
          comment: `Клієнт: ${customerName}, ${customerPhone}`,
        },
        redirectUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/order-success?order=${orderReference}&status=success`,
        webHookUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/api/monopay/webhook`,
        validity: 3600, // Інвойс дійсний 1 годину
        saveCardData: {
          saveCard: false,
        },
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("MonoPay error:", error);
      return NextResponse.json({ error: "Failed to create invoice" }, { status: 500 });
    }

    const data = await response.json();
    
    // Повертаємо URL для редиректу на оплату
    return NextResponse.json({ 
      pageUrl: data.pageUrl,
      invoiceId: data.invoiceId 
    });

  } catch (error) {
    console.error("MonoPay create invoice error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
