"use client";

import { useState } from "react";
import { trackEvent } from "@/components/FacebookPixel";

interface OrderFormProps {
  productName: string;
  productPrice: number;
}

export default function OrderForm({ productName, productPrice }: OrderFormProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  const total = productPrice * quantity;

  async function handleSubmit() {
    if (!name.trim() || !phone.trim()) {
      alert("Будь ласка, заповніть ім'я та телефон");
      return;
    }

    setStatus("sending");

    try {
      const res = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
          city: city.trim(),
          product: productName,
          price: productPrice,
          quantity,
        }),
      });

      if (res.ok) {
        setStatus("success");
        trackEvent("Lead", {
          content_name: productName,
          value: productPrice * quantity,
          currency: "UAH",
        });
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div
        style={{
          padding: "40px 32px",
          background: "var(--paper)",
          border: "1px solid var(--line-soft)",
          textAlign: "center",
        }}
      >
        <div style={{ fontSize: "48px", marginBottom: "16px" }}>✓</div>
        <h3
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "28px",
            fontWeight: 400,
            marginBottom: "12px",
          }}
        >
          Дякуємо за замовлення!
        </h3>
        <p style={{ color: "var(--text)", fontSize: "14px", lineHeight: "1.7", marginBottom: "8px" }}>
          Ми зв&apos;яжемося з вами протягом 15–30 хвилин для підтвердження.
        </p>
        <p style={{ color: "var(--text-dim)", fontSize: "13px" }}>
          {productName} · {quantity} шт. · {total.toLocaleString("uk-UA")} ₴
        </p>
      </div>
    );
  }

  const inputStyle: React.CSSProperties = {
    width: "100%",
    background: "var(--bg-card)",
    border: "1px solid var(--line)",
    color: "var(--ink)",
    padding: "16px 18px",
    fontFamily: "'Inter', sans-serif",
    fontSize: "15px",
    outline: "none",
  };

  const labelStyle: React.CSSProperties = {
    display: "block",
    fontSize: "10px",
    letterSpacing: ".22em",
    textTransform: "uppercase" as const,
    color: "var(--text)",
    marginBottom: "8px",
    fontWeight: 500,
  };

  return (
    <div>
      {/* Quantity + Total */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "24px",
          padding: "16px 20px",
          background: "var(--paper)",
          border: "1px solid var(--line-soft)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0" }}>
          <button
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            style={{
              width: "40px",
              height: "40px",
              background: "transparent",
              border: "1px solid var(--line)",
              color: "var(--ink)",
              fontSize: "18px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            −
          </button>
          <div
            style={{
              width: "48px",
              height: "40px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderTop: "1px solid var(--line)",
              borderBottom: "1px solid var(--line)",
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "18px",
            }}
          >
            {quantity}
          </div>
          <button
            onClick={() => setQuantity((q) => q + 1)}
            style={{
              width: "40px",
              height: "40px",
              background: "transparent",
              border: "1px solid var(--line)",
              color: "var(--ink)",
              fontSize: "18px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            +
          </button>
        </div>
        <div
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "24px",
            fontWeight: 500,
            color: "var(--ink)",
          }}
        >
          {total.toLocaleString("uk-UA")} ₴
        </div>
      </div>

      {/* Form fields */}
      <div style={{ marginBottom: "16px" }}>
        <label style={labelStyle}>Ваше ім&apos;я *</label>
        <input
          type="text"
          placeholder="Введіть ім'я"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={inputStyle}
        />
      </div>
      <div style={{ marginBottom: "16px" }}>
        <label style={labelStyle}>Телефон *</label>
        <input
          type="tel"
          placeholder="+380 ___ ___ __ __"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          style={inputStyle}
        />
      </div>
      <div style={{ marginBottom: "24px" }}>
        <label style={labelStyle}>Місто та відділення Нової Пошти</label>
        <input
          type="text"
          placeholder="Місто, № відділення"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          style={inputStyle}
        />
      </div>

      {/* Submit */}
      <button
        onClick={handleSubmit}
        disabled={status === "sending"}
        style={{
          width: "100%",
          background: status === "sending" ? "var(--text-dim)" : "var(--ink)",
          color: "var(--bg)",
          border: "none",
          padding: "20px",
          fontFamily: "'Inter', sans-serif",
          fontSize: "13px",
          fontWeight: 500,
          letterSpacing: ".22em",
          textTransform: "uppercase",
          cursor: status === "sending" ? "wait" : "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "14px",
          marginBottom: "24px",
        }}
      >
        {status === "sending" ? "Відправляємо..." : "Оформити замовлення"}
        {status !== "sending" && (
          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        )}
      </button>

      {status === "error" && (
        <p style={{ color: "#c0392b", fontSize: "13px", textAlign: "center", marginBottom: "16px" }}>
          Помилка при відправці. Спробуйте ще раз або зателефонуйте нам.
        </p>
      )}

      {/* Trust */}
      <div
        style={{
          display: "flex",
          gap: "24px",
          padding: "24px",
          background: "var(--bg-soft)",
          border: "1px solid var(--line-soft)",
          flexWrap: "wrap",
        }}
      >
        <TrustItem text="Гарантія 12 міс." />
        <TrustItem text="Оплата при отриманні" />
        <TrustItem text="Відправка сьогодні" />
      </div>
    </div>
  );
}

function TrustItem({ text }: { text: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "12px", color: "var(--text)" }}>
      <svg width="16" height="16" fill="none" stroke="var(--gold-deep)" strokeWidth="1.5" viewBox="0 0 24 24">
        <path d="M20 6 9 17l-5-5" />
      </svg>
      {text}
    </div>
  );
}
