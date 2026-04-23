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
    if (style === "compact") setQty(1);
  }

  if (style === "compact") {
    return (
      <div style={{ display: "flex", gap: "8px", alignItems: "center" }} onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <button onClick={() => setQty((q) => Math.max(1, q - 1))} style={{ width: "32px", height: "36px", background: "transparent", border: "1px solid var(--line)", color: "var(--ink)", fontSize: "16px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "4px 0 0 4px" }}>-</button>
          <div style={{ width: "32px", height: "36px", display: "flex", alignItems: "center", justifyContent: "center", borderTop: "1px solid var(--line)", borderBottom: "1px solid var(--line)", fontSize: "13px", fontWeight: 500 }}>{qty}</div>
          <button onClick={() => setQty((q) => q + 1)} style={{ width: "32px", height: "36px", background: "transparent", border: "1px solid var(--line)", color: "var(--ink)", fontSize: "16px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "0 4px 4px 0" }}>+</button>
        </div>
        <button onClick={handleAdd} style={{ flex: 1, background: "var(--ink)", color: "var(--bg)", border: "none", padding: "10px 12px", fontSize: "11px", fontWeight: 500, letterSpacing: ".15em", textTransform: "uppercase", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px", borderRadius: "4px", fontFamily: "'Inter', sans-serif", justifyContent: "center" }}>
Додати в кошик
        </button>
      </div>
    );
  }

  if (style === "gold") {
    return (
      <button onClick={handleAdd} style={{ background: "var(--gold-deep)", color: "#fff", padding: "18px 48px", fontSize: "13px", fontWeight: 600, letterSpacing: ".18em", textTransform: "uppercase", border: "none", borderRadius: "4px", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "12px", fontFamily: "'Inter', sans-serif" }}>
        Додати в кошик
      </button>
    );
  }

  return (
    <div>
      {showQuantity && (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px", padding: "16px 20px", background: "var(--paper)", border: "1px solid var(--line-soft)", borderRadius: "4px" }}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <button onClick={() => setQty((q) => Math.max(1, q - 1))} style={{ width: "40px", height: "40px", background: "transparent", border: "1px solid var(--line)", color: "var(--ink)", fontSize: "18px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "4px 0 0 4px" }}>-</button>
            <div style={{ width: "48px", height: "40px", display: "flex", alignItems: "center", justifyContent: "center", borderTop: "1px solid var(--line)", borderBottom: "1px solid var(--line)", fontFamily: "'Cormorant Garamond', serif", fontSize: "18px" }}>{qty}</div>
            <button onClick={() => setQty((q) => q + 1)} style={{ width: "40px", height: "40px", background: "transparent", border: "1px solid var(--line)", color: "var(--ink)", fontSize: "18px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "0 4px 4px 0" }}>+</button>
          </div>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "24px", fontWeight: 500, color: "var(--ink)" }}>{(price * qty).toLocaleString("uk-UA")} ₴</div>
        </div>
      )}
      <button onClick={handleAdd} style={{ width: "100%", background: "var(--ink)", color: "var(--bg)", border: "none", padding: "20px", fontFamily: "'Inter', sans-serif", fontSize: "14px", fontWeight: 600, letterSpacing: ".2em", textTransform: "uppercase", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "14px", borderRadius: "4px" }}>
        Додати в кошик
      </button>
    </div>
  );
}