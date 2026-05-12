"use client";

import { useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get("order");
  const status = searchParams.get("status");

  // Если статус не success - редирект на страницу ошибки
  useEffect(() => {
    if (status && status !== "success") {
      window.location.href = `/order-failed?order=${orderNumber}&status=${status}`;
    }
  }, [status, orderNumber]);

  useEffect(() => {
    // Очистка кошика після успішного замовлення
    if (typeof window !== "undefined") {
      localStorage.removeItem("cart");
    }
  }, []);

  return (
    <section style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 20px" }}>
      <div style={{ maxWidth: "600px", textAlign: "center" }}>
        {/* Success Icon */}
        <div style={{ marginBottom: "32px" }}>
          <div style={{ 
            width: "80px", 
            height: "80px", 
            borderRadius: "50%", 
            background: "#4ade80", 
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}>
            <svg width="40" height="40" fill="none" stroke="#fff" strokeWidth="3" viewBox="0 0 24 24">
              <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>

        {/* Title */}
        <h1 style={{ 
          fontFamily: "'Cormorant Garamond', serif", 
          fontSize: "42px", 
          fontWeight: 400, 
          marginBottom: "16px",
          color: "var(--ink)"
        }}>
          Дякуємо за замовлення!
        </h1>

        {/* Order Number */}
        {orderNumber && (
          <p style={{ fontSize: "18px", color: "var(--text)", marginBottom: "24px" }}>
            Номер замовлення: <strong style={{ color: "var(--gold-deep)" }}>#{orderNumber}</strong>
          </p>
        )}

        {/* Description */}
        <p style={{ fontSize: "16px", color: "var(--text)", lineHeight: 1.6, marginBottom: "32px" }}>
          Ваше замовлення успішно оплачено! Ми отримали оплату та зараз обробляємо замовлення. 
          Очікуйте SMS з трек-номером відправлення протягом 1-2 робочих днів.
        </p>

        {/* Payment Info */}
        <div style={{ 
          background: "var(--bg-soft)", 
          padding: "24px", 
          borderRadius: "12px", 
          marginBottom: "32px",
          textAlign: "left"
        }}>
          <p style={{ fontSize: "14px", color: "var(--text)", marginBottom: "12px", display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ color: "#4ade80", fontSize: "20px" }}>✓</span>
            Оплату підтверджено
          </p>
          <p style={{ fontSize: "14px", color: "var(--text)", marginBottom: "12px", display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ color: "#4ade80", fontSize: "20px" }}>✓</span>
            Повідомлення надіслано менеджеру
          </p>
          <p style={{ fontSize: "14px", color: "var(--text)", display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ color: "#4ade80", fontSize: "20px" }}>✓</span>
            SMS з трек-номером буде надіслано після відправки
          </p>
        </div>

        {/* Buttons */}
        <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
          <Link 
            href="/"
            style={{
              padding: "14px 32px",
              background: "var(--gold-deep)",
              color: "#fff",
              borderRadius: "8px",
              fontSize: "14px",
              fontWeight: 600,
              letterSpacing: "0.05em",
              textTransform: "uppercase",
              textDecoration: "none",
              transition: "all 0.2s"
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "#5a4d28"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "var(--gold-deep)"; }}
          >
            На головну
          </Link>
          
          <Link 
            href="/catalog"
            style={{
              padding: "14px 32px",
              background: "transparent",
              color: "var(--ink)",
              border: "2px solid var(--line)",
              borderRadius: "8px",
              fontSize: "14px",
              fontWeight: 600,
              letterSpacing: "0.05em",
              textTransform: "uppercase",
              textDecoration: "none",
              transition: "all 0.2s"
            }}
            onMouseEnter={(e) => { 
              e.currentTarget.style.borderColor = "var(--gold-deep)";
              e.currentTarget.style.color = "var(--gold-deep)";
            }}
            onMouseLeave={(e) => { 
              e.currentTarget.style.borderColor = "var(--line)";
              e.currentTarget.style.color = "var(--ink)";
            }}
          >
            Продовжити покупки
          </Link>
        </div>
      </div>
    </section>
  );
}

export default function OrderSuccessPage() {
  return (
    <>
      <Header />
      <Suspense fallback={<div style={{ minHeight: "60vh" }} />}>
        <OrderSuccessContent />
      </Suspense>
      <Footer />
    </>
  );
}
