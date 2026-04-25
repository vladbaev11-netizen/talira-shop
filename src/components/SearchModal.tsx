"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import imageUrlBuilder from "@sanity/image-url";

const builder = imageUrlBuilder({ projectId: "777maat6", dataset: "production" });
function imgUrl(source: any) { return builder.image(source); }

interface SearchResult {
  name: string;
  slug: { current: string };
  price: number;
  oldPrice?: number;
  mainImage: any;
  category?: { name: string };
}

export default function SearchModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<NodeJS.Timeout>(undefined);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (!query || query.length < 2) {
      setResults([]);
      return;
    }

    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/search?q=" + encodeURIComponent(query));
        const data = await res.json();
        setResults(data.products || []);
      } catch {
        setResults([]);
      }
      setLoading(false);
    }, 300);
  }, [query]);

  function handleClose() {
    setQuery("");
    setResults([]);
    onClose();
  }

  if (!isOpen) return null;

  return (
    <div
      onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}
      style={{
        position: "fixed", inset: 0, background: "rgba(26,22,18,.5)",
        backdropFilter: "blur(4px)", zIndex: 1000, padding: "20px",
      }}
    >
      <div style={{
        maxWidth: "640px", margin: "80px auto 0", background: "var(--bg)",
        borderRadius: "12px", boxShadow: "0 24px 60px -12px rgba(26,22,18,.4)",
        overflow: "hidden",
      }}>
        {/* Search input */}
        <div style={{ display: "flex", alignItems: "center", padding: "16px 20px", borderBottom: "1px solid var(--line-soft)", gap: "12px" }}>
          <svg width="20" height="20" fill="none" stroke="var(--text-dim)" strokeWidth="1.5" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="7" /><path d="m21 21-4.35-4.35" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Пошук товарів..."
            style={{
              flex: 1, border: "none", outline: "none", background: "transparent",
              fontSize: "16px", fontFamily: "'Inter', sans-serif", color: "var(--ink)",
            }}
          />
          <button onClick={handleClose} style={{ background: "none", border: "none", color: "var(--text-dim)", fontSize: "14px", cursor: "pointer", padding: "4px 8px" }}>
            ESC
          </button>
        </div>

        {/* Results */}
        <div style={{ maxHeight: "400px", overflowY: "auto" }}>
          {loading && (
            <div style={{ padding: "24px", textAlign: "center", color: "var(--text-dim)", fontSize: "14px" }}>
              {"Шукаємо..."}
            </div>
          )}

          {!loading && query.length >= 2 && results.length === 0 && (
            <div style={{ padding: "32px", textAlign: "center" }}>
              <div style={{ fontSize: "32px", marginBottom: "12px" }}>🔍</div>
              <p style={{ color: "var(--text-dim)", fontSize: "14px" }}>
                {"Нічого не знайдено за запитом"} &laquo;{query}&raquo;
              </p>
            </div>
          )}

          {results.map((product) => (
            <Link
              key={product.slug.current}
              href={"/product/" + product.slug.current}
              onClick={handleClose}
              style={{
                display: "flex", gap: "14px", padding: "14px 20px",
                borderBottom: "1px solid var(--line-soft)", alignItems: "center",
                textDecoration: "none", color: "var(--ink)",
              }}
            >
              {product.mainImage && (
                <div style={{ width: "56px", height: "56px", borderRadius: "4px", overflow: "hidden", flexShrink: 0, position: "relative", background: "var(--bg-card)" }}>
                  <Image
                    src={imgUrl(product.mainImage).width(112).height(112).url()}
                    alt={product.name} fill style={{ objectFit: "cover" }} sizes="56px"
                  />
                </div>
              )}
              <div style={{ flex: 1, minWidth: 0 }}>
                {product.category && (
                  <div style={{ fontSize: "10px", letterSpacing: ".15em", textTransform: "uppercase", color: "var(--gold-deep)", marginBottom: "2px" }}>
                    {product.category.name}
                  </div>
                )}
                <div style={{ fontSize: "14px", fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {product.name}
                </div>
              </div>
              <div style={{ textAlign: "right", flexShrink: 0 }}>
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "17px", fontWeight: 500 }}>
                  {product.price.toLocaleString("uk-UA")} ₴
                </div>
                {product.oldPrice && (
                  <div style={{ fontSize: "12px", color: "var(--text-dim)", textDecoration: "line-through" }}>
                    {product.oldPrice.toLocaleString("uk-UA")} ₴
                  </div>
                )}
              </div>
            </Link>
          ))}

          {results.length > 0 && (
            <Link
              href={"/catalog?q=" + encodeURIComponent(query)}
              onClick={handleClose}
              style={{
                display: "block", padding: "16px 20px", textAlign: "center",
                fontSize: "13px", color: "var(--gold-deep)", fontWeight: 500,
                textDecoration: "none",
              }}
            >
              {"Показати всі результати"} →
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
