"use client";

import { useState } from "react";
import { useCart } from "./CartContext";

interface AddToCartButtonProps {
  slug: string;
  name: string;
  price: number;
  oldPrice?: number;
  image?: string;
  style?: "full" | "compact" | "gold";
  showQuantity?: boolean;
}

export default function AddToCartButton({ slug, name, price, oldPrice, image, style = "full", showQuantity = true }: AddToCartButtonProps) {
  const { addItem } = useCart();
  const [qty, setQty] = useState(1);

  function handleAdd() {
    addItem({ slug, name, price, oldPrice, image }, qty);
  }

  if (style === "compact") {
    return (
      <button
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); addItem({ slug, name, price, oldPrice, image }, 1); }}
        style={{
          background: "var(--ink)",
          color: "var(--bg)",
          border: "none",
          padding: "10px 16px",
          fontSize: "11px",
          fontWeight: 500,
          letterSpacing: ".15em",
          textTransform: "uppercase",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          borderRadius: "4px",
          transition: "background .2s",
          fontFamily: "'Inter', sans-serif",
          width: "100%",
          justifyContent: "center",
        }}
      >
        <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
          <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4zM3 6h18M16 10a4 4 0 0 1-8 0" />
        </svg>
        В кошик
      </button>
    );
  }

  if (style === "gold") {
    return (
      <button
        onClick={handleAdd}
        style={{
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
        }}
      >
        <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
          <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4zM3 6h18M16 10a4 4 0 0 1-8 0" />
        </svg>
        Додати в кошик
      </button>
    );
  }

  // Full style — with quantity selector
  return (
    <div>
      {showQuantity && (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px", padding: "16px 20px", background: "var(--paper)", border: "1px solid var(--line-soft)", borderRadius: "4px" }}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <button onClick={() => setQty((q) => Math.max(1, q - 1))} style={{ width: "40px", height: "40px", background: "transparent", border: "1px solid var(--line)", color: "var(--ink)", fontSize: "18px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "4px 0 0 4px" }}>−</button>
            <div style={{ width: "48px", height: "40px", display: "flex", alignItems: "center", justifyContent: "center", borderTop: "1px solid var(--line)", borderBottom: "1px solid var(--line)", fontFamily: "'Cormorant Garamond', serif", fontSize: "18px" }}>{qty}</div>
            <button onClick={() => setQty((q) => q + 1)} style={{ width: "40px", height: "40px", background: "transparent", border: "1px solid var(--line)", color: "var(--ink)", fontSize: "18px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "0 4px 4px 0" }}>+</button>
          </div>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "24px", fontWeight: 500, color: "var(--ink)" }}>
            {(price * qty).toLocaleString("uk-UA")} ₴
          </div>
        </div>
      )}
      <button
        onClick={handleAdd}
        style={{
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
        }}
      >
        <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
          <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4zM3 6h18M16 10a4 4 0 0 1-8 0" />
        </svg>
        Додати в кошик
      </button>
    </div>
  );
}
