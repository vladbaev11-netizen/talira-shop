"use client";

import { useState, useEffect } from "react";

const TAGS = [
  { value: "fast_delivery", label: "Швидка доставка" },
  { value: "quality_product", label: "Якісний товар" },
  { value: "good_communication", label: "Гарне спілкування" },
  { value: "recommend", label: "Рекомендую" },
  { value: "good_packaging", label: "Гарна упаковка" },
  { value: "matches_description", label: "Відповідає опису" },
];

interface Product {
  _id: string;
  name: string;
  slug: { current: string };
}

export default function ReviewForm({ onSuccess }: { onSuccess?: () => void }) {
  const [name, setName] = useState("");
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [text, setText] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [showProducts, setShowProducts] = useState(false);
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  useEffect(() => {
    fetch("/api/reviews/products").then(r => r.json()).then(d => setProducts(d.products || [])).catch(() => {});
  }, []);

  function toggleTag(tag: string) {
    setSelectedTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
  }

  async function handleSubmit() {
    if (!name.trim() || rating === 0) {
      alert("Вкажіть ім'я та оцінку");
      return;
    }
    setStatus("sending");
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          rating,
          tags: selectedTags,
          text: text.trim(),
          productId: selectedProduct?._id,
          productName: selectedProduct?.name,
        }),
      });
      if (res.ok) {
        setStatus("success");
        onSuccess?.();
      } else setStatus("error");
    } catch { setStatus("error"); }
  }

  if (status === "success") {
    return (
      <div style={{ padding: "48px 32px", background: "var(--paper)", border: "1px solid var(--line-soft)", borderRadius: "8px", textAlign: "center" }}>
        <div style={{ fontSize: "48px", marginBottom: "16px" }}>&#10003;</div>
        <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "28px", fontWeight: 400, marginBottom: "12px" }}>Дякуємо за відгук!</h3>
        <p style={{ color: "var(--text)", fontSize: "14px" }}>Ваш відгук буде опублікований після модерації.</p>
      </div>
    );
  }

  const displayRating = hoverRating || rating;

  return (
    <div style={{ background: "var(--paper)", border: "1px solid var(--line-soft)", borderRadius: "8px", padding: "36px" }}>
      <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "26px", fontWeight: 400, marginBottom: "24px" }}>
        Залишити відгук
      </h3>

      {/* Name */}
      <div style={{ marginBottom: "20px" }}>
        <label style={{ display: "block", fontSize: "10px", letterSpacing: ".22em", textTransform: "uppercase", color: "var(--text)", marginBottom: "8px", fontWeight: 500 }}>
          Ваше ім&apos;я *
        </label>
        <input type="text" placeholder="Введіть ім'я" value={name} onChange={e => setName(e.target.value)}
          style={{ width: "100%", background: "var(--bg-card)", border: "1px solid var(--line)", color: "var(--ink)", padding: "14px 16px", fontFamily: "'Inter', sans-serif", fontSize: "15px", outline: "none", borderRadius: "4px" }}
        />
      </div>

      {/* Rating stars */}
      <div style={{ marginBottom: "20px" }}>
        <label style={{ display: "block", fontSize: "10px", letterSpacing: ".22em", textTransform: "uppercase", color: "var(--text)", marginBottom: "10px", fontWeight: 500 }}>
          Оцінка *
        </label>
        <div style={{ display: "flex", gap: "6px" }}>
          {[1,2,3,4,5].map(s => (
            <button key={s} onClick={() => setRating(s)} onMouseEnter={() => setHoverRating(s)} onMouseLeave={() => setHoverRating(0)}
              style={{ background: "none", border: "none", cursor: "pointer", padding: "4px", fontSize: "0" }}
            >
              <svg width="32" height="32" viewBox="0 0 24 24" fill={s <= displayRating ? "var(--gold-deep)" : "var(--line)"} stroke="none">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
            </button>
          ))}
          {rating > 0 && <span style={{ fontSize: "14px", color: "var(--gold-deep)", fontWeight: 600, alignSelf: "center", marginLeft: "8px" }}>{rating}/5</span>}
        </div>
      </div>

      {/* Tags */}
      <div style={{ marginBottom: "20px" }}>
        <label style={{ display: "block", fontSize: "10px", letterSpacing: ".22em", textTransform: "uppercase", color: "var(--text)", marginBottom: "10px", fontWeight: 500 }}>
          Що сподобалось?
        </label>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
          {TAGS.map(tag => (
            <button key={tag.value} onClick={() => toggleTag(tag.value)}
              style={{
                padding: "8px 16px", fontSize: "13px", borderRadius: "20px", cursor: "pointer",
                border: selectedTags.includes(tag.value) ? "1px solid var(--gold-deep)" : "1px solid var(--line)",
                background: selectedTags.includes(tag.value) ? "var(--gold-deep)" : "transparent",
                color: selectedTags.includes(tag.value) ? "#fff" : "var(--text)",
                fontFamily: "'Inter', sans-serif", transition: "all .2s",
              }}
            >
              {tag.label}
            </button>
          ))}
        </div>
      </div>

      {/* Product selection */}
      <div style={{ marginBottom: "20px" }}>
        <label style={{ display: "block", fontSize: "10px", letterSpacing: ".22em", textTransform: "uppercase", color: "var(--text)", marginBottom: "8px", fontWeight: 500 }}>
          Товар (необов&apos;язково)
        </label>
        {selectedProduct ? (
          <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px 16px", background: "var(--bg-card)", border: "1px solid var(--gold-deep)", borderRadius: "4px" }}>
            <span style={{ fontSize: "14px", color: "var(--ink)", flex: 1 }}>{selectedProduct.name}</span>
            <button onClick={() => setSelectedProduct(null)} style={{ background: "none", border: "none", color: "var(--text-dim)", cursor: "pointer", fontSize: "16px" }}>x</button>
          </div>
        ) : (
          <button onClick={() => setShowProducts(!showProducts)}
            style={{ width: "100%", padding: "14px 16px", background: "var(--bg-card)", border: "1px solid var(--line)", borderRadius: "4px", textAlign: "left", cursor: "pointer", fontSize: "14px", color: "var(--text-dim)", fontFamily: "'Inter', sans-serif" }}
          >
            Обрати товар...
          </button>
        )}
        {showProducts && !selectedProduct && products.length > 0 && (
          <div style={{ background: "var(--bg-card)", border: "1px solid var(--line)", borderTop: "none", borderRadius: "0 0 4px 4px", maxHeight: "200px", overflowY: "auto" }}>
            {products.map(p => (
              <div key={p._id} onClick={() => { setSelectedProduct(p); setShowProducts(false); }}
                style={{ padding: "12px 16px", fontSize: "14px", color: "var(--ink)", cursor: "pointer", borderBottom: "1px solid var(--line-soft)" }}
              >
                {p.name}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Text */}
      <div style={{ marginBottom: "24px" }}>
        <label style={{ display: "block", fontSize: "10px", letterSpacing: ".22em", textTransform: "uppercase", color: "var(--text)", marginBottom: "8px", fontWeight: 500 }}>
          Ваш відгук
        </label>
        <textarea placeholder="Розкажіть про ваш досвід..." value={text} onChange={e => setText(e.target.value)}
          style={{ width: "100%", minHeight: "100px", background: "var(--bg-card)", border: "1px solid var(--line)", color: "var(--ink)", padding: "14px 16px", fontFamily: "'Inter', sans-serif", fontSize: "15px", outline: "none", borderRadius: "4px", resize: "vertical" }}
        />
      </div>

      {/* Submit */}
      <button onClick={handleSubmit} disabled={status === "sending"}
        style={{
          width: "100%", background: status === "sending" ? "var(--text-dim)" : "var(--gold-deep)",
          color: "#fff", border: "none", padding: "18px", fontFamily: "'Inter', sans-serif",
          fontSize: "13px", fontWeight: 600, letterSpacing: ".18em", textTransform: "uppercase",
          cursor: status === "sending" ? "wait" : "pointer", borderRadius: "4px",
        }}
      >
        {status === "sending" ? "Відправляємо..." : "Надіслати відгук"}
      </button>

      {status === "error" && (
        <p style={{ color: "#c0392b", fontSize: "13px", textAlign: "center", marginTop: "12px" }}>Помилка. Спробуйте ще раз.</p>
      )}
    </div>
  );
}
