"use client";

import { useCart } from "./CartContext";
import Link from "next/link";

export default function FloatingCart() {
  const { totalItems, totalPrice, showNotification, notificationText } = useCart();

  return (
    <>
      {/* Notification toast */}
      {showNotification && (
        <div
          style={{
            position: "fixed",
            top: "100px",
            right: "20px",
            background: "var(--ink)",
            color: "var(--bg)",
            padding: "16px 24px",
            borderRadius: "8px",
            boxShadow: "0 8px 30px -8px rgba(26,22,18,.4)",
            zIndex: 1001,
            display: "flex",
            alignItems: "center",
            gap: "12px",
            maxWidth: "360px",
            animation: "slideIn .3s ease",
          }}
        >
          <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: "var(--gold-deep)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <svg width="14" height="14" fill="none" stroke="#fff" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M20 6 9 17l-5-5" /></svg>
          </div>
          <div>
            <div style={{ fontSize: "13px", fontWeight: 600, marginBottom: "2px" }}>Додано в кошик</div>
            <div style={{ fontSize: "11px", color: "rgba(245,241,232,.7)" }}>{notificationText}</div>
          </div>
        </div>
      )}

      {/* Floating cart button */}
      {(
        <Link
          href="/cart"
          style={{
            position: "fixed",
            bottom: "24px",
            right: "24px",
            zIndex: 999,
            background: "var(--ink)",
            color: "var(--bg)",
            borderRadius: "60px",
            padding: "14px 24px",
            display: "flex",
            alignItems: "center",
            gap: "12px",
            boxShadow: "0 8px 30px -6px rgba(26,22,18,.5)",
            textDecoration: "none",
            transition: "transform .2s",
          }}
        >
          <div style={{ position: "relative" }}>
            <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4zM3 6h18M16 10a4 4 0 0 1-8 0" />
            </svg>
            <div style={{
              position: "absolute", top: "-8px", right: "-8px",
              background: "var(--gold-deep)", color: "#fff",
              width: "20px", height: "20px", borderRadius: "50%",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "11px", fontWeight: 700,
            }}>
              {totalItems}
            </div>
          </div>
          <div>
            <div style={{ fontSize: "12px", fontWeight: 600, letterSpacing: ".1em", textTransform: "uppercase" }}>Кошик</div>
            <div style={{ fontSize: "14px", fontFamily: "'Cormorant Garamond', serif", fontWeight: 500 }}>
              {totalPrice.toLocaleString("uk-UA")} ₴
            </div>
          </div>
        </Link>
      )}

      <style>{`
        @keyframes slideIn {
          from { transform: translateX(100px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>
    </>
  );
}
