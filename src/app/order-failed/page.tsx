"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

function OrderFailedContent() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get("order");

  return (
    <section style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 20px" }}>
      <div style={{ maxWidth: "600px", textAlign: "center" }}>
        {/* Error Icon */}
        <div style={{ marginBottom: "32px" }}>
          <div style={{ 
            width: "80px", 
            height: "80px", 
            borderRadius: "50%", 
            background: "#dc2626", 
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}>
            <svg width="40" height="40" fill="none" stroke="#fff" strokeWidth="3" viewBox="0 0 24 24">
              <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round"/>
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
          Оплата не пройшла
        </h1>

        {/* Order Number */}
        {orderNumber && (
          <p style={{ fontSize: "18px", color: "var(--text)", marginBottom: "24px" }}>
            Замовлення: <strong style={{ color: "var(--text-dim)" }}>#{orderNumber}</strong>
          </p>
        )}

        {/* Description */}
        <p style={{ fontSize: "16px", color: "var(--text)", lineHeight: 1.6, marginBottom: "32px" }}>
          На жаль, платіж не було завершено. Це могло статися з наступних причин:
        </p>

        {/* Reasons */}
        <div style={{ 
          background: "var(--bg-soft)", 
          padding: "24px", 
          borderRadius: "12px", 
          marginBottom: "32px",
          textAlign: "left"
        }}>
          <p style={{ fontSize: "14px", color: "var(--text)", marginBottom: "12px", display: "flex", alignItems: "start", gap: "8px" }}>
            <span style={{ color: "#dc2626", fontSize: "20px", lineHeight: 1 }}>•</span>
            <span>Недостатньо коштів на картці</span>
          </p>
          <p style={{ fontSize: "14px", color: "var(--text)", marginBottom: "12px", display: "flex", alignItems: "start", gap: "8px" }}>
            <span style={{ color: "#dc2626", fontSize: "20px", lineHeight: 1 }}>•</span>
            <span>Картка заблокована або закінчився термін дії</span>
          </p>
          <p style={{ fontSize: "14px", color: "var(--text)", marginBottom: "12px", display: "flex", alignItems: "start", gap: "8px" }}>
            <span style={{ color: "#dc2626", fontSize: "20px", lineHeight: 1 }}>•</span>
            <span>Технічна помилка банку або платіжної системи</span>
          </p>
          <p style={{ fontSize: "14px", color: "var(--text)", display: "flex", alignItems: "start", gap: "8px" }}>
            <span style={{ color: "#dc2626", fontSize: "20px", lineHeight: 1 }}>•</span>
            <span>Оплата була скасована</span>
          </p>
        </div>

        {/* Info */}
        <p style={{ fontSize: "15px", color: "var(--text-dim)", marginBottom: "32px", fontStyle: "italic" }}>
          💡 Ви можете спробувати оплатити ще раз або обрати інший спосіб оплати
        </p>

        {/* Buttons */}
        <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
          <Link 
            href="/cart"
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
            Повернутись до кошика
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

        {/* Contact */}
        <p style={{ fontSize: "13px", color: "var(--text-dim)", marginTop: "32px" }}>
          Якщо у вас виникли питання, зв'яжіться з нами:<br />
          📞 Телефон або 📧 Email
        </p>
      </div>
    </section>
  );
}

export default function OrderFailedPage() {
  return (
    <>
      <Header />
      <Suspense fallback={<div style={{ minHeight: "60vh" }} />}>
        <OrderFailedContent />
      </Suspense>
      <Footer />
    </>
  );
}
