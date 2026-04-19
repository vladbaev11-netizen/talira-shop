"use client";

import { useState } from "react";
import OrderForm from "@/components/OrderForm";

interface OrderButtonProps {
  productName: string;
  productPrice: number;
  style?: "primary" | "gold";
}

export default function OrderButton({ productName, productPrice, style = "primary" }: OrderButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  const buttonStyles: React.CSSProperties = style === "gold"
    ? {
        background: "var(--gold-deep)",
        color: "#fff",
        padding: "18px 48px",
        fontSize: "13px",
        fontWeight: 600,
        letterSpacing: ".18em",
        textTransform: "uppercase",
        border: "none",
        borderRadius: "4px",
        cursor: "pointer",
        display: "inline-flex",
        alignItems: "center",
        gap: "12px",
        transition: "all .3s",
        fontFamily: "'Inter', sans-serif",
      }
    : {
        width: "100%",
        background: "var(--ink)",
        color: "var(--bg)",
        border: "none",
        padding: "20px",
        fontFamily: "'Inter', sans-serif",
        fontSize: "14px",
        fontWeight: 600,
        letterSpacing: ".2em",
        textTransform: "uppercase",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "14px",
        borderRadius: "4px",
        transition: "all .3s",
      };

  return (
    <>
      <button onClick={() => setIsOpen(true)} style={buttonStyles}>
        Оформити замовлення
        <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
      </button>

      {/* Modal overlay */}
      {isOpen && (
        <div
          onClick={(e) => { if (e.target === e.currentTarget) setIsOpen(false); }}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(26,22,18,.6)",
            backdropFilter: "blur(4px)",
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
          }}
        >
          <div
            style={{
              background: "var(--bg)",
              maxWidth: "520px",
              width: "100%",
              maxHeight: "90vh",
              overflowY: "auto",
              padding: "40px",
              position: "relative",
              borderRadius: "8px",
              boxShadow: "0 24px 60px -12px rgba(26,22,18,.4)",
            }}
          >
            {/* Close button */}
            <button
              onClick={() => setIsOpen(false)}
              style={{
                position: "absolute",
                top: "16px",
                right: "16px",
                background: "transparent",
                border: "none",
                color: "var(--ink)",
                fontSize: "24px",
                cursor: "pointer",
                width: "40px",
                height: "40px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              ✕
            </button>

            {/* Header */}
            <div style={{ marginBottom: "24px", paddingRight: "40px" }}>
              <h3
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: "28px",
                  fontWeight: 400,
                  marginBottom: "8px",
                }}
              >
                Оформлення замовлення
              </h3>
              <p style={{ fontSize: "13px", color: "var(--text-dim)" }}>
                {productName}
              </p>
            </div>

            <OrderForm productName={productName} productPrice={productPrice} />
          </div>
        </div>
      )}
    </>
  );
}
