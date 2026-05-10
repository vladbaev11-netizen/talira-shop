"use client";

import Link from "next/link";
import { useState } from "react";

interface Product {
  name: string;
  slug: { current: string };
  price: number;
  oldPrice?: number;
  badge?: string;
  inStock?: boolean;
  mainImage?: any;
  externalImages?: string[];
}

export default function ProductCard({ product }: { product: Product }) {
  const [imgError, setImgError] = useState(false);
  const imageUrl = product.externalImages?.[0] || product.mainImage?.asset?.url;
  const discount = product.oldPrice ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100) : 0;

  // Обрізання назви до 60 символів
  const displayName = product.name.length > 60 ? product.name.slice(0, 60) + "..." : product.name;

  return (
    <Link 
      href={`/products/${product.slug.current}`}
      className="product-card"
      style={{
        display: "block",
        background: "#fff",
        borderRadius: "12px",
        overflow: "hidden",
        boxShadow: "0 2px 8px rgba(26,22,18,0.08)",
        transition: "all 0.3s ease",
        position: "relative",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-4px)";
        e.currentTarget.style.boxShadow = "0 8px 20px rgba(26,22,18,0.15)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 2px 8px rgba(26,22,18,0.08)";
      }}
    >
      {/* Badge */}
      {(product.badge || discount > 0) && (
        <div style={{ position: "absolute", top: "12px", left: "12px", zIndex: 10, display: "flex", gap: "6px", flexDirection: "column" }}>
          {discount > 0 && (
            <span style={{
              background: "#ff6b35",
              color: "#fff",
              padding: "6px 12px",
              borderRadius: "6px",
              fontSize: "13px",
              fontWeight: 700,
              letterSpacing: "0.03em",
              boxShadow: "0 2px 8px rgba(255,107,53,0.3)"
            }}>
              −{discount}%
            </span>
          )}
          {product.badge === "hit" && (
            <span style={{
              background: "#ffd700",
              color: "#1a1612",
              padding: "6px 12px",
              borderRadius: "6px",
              fontSize: "11px",
              fontWeight: 700,
              letterSpacing: "0.1em",
              textTransform: "uppercase"
            }}>
              ХІТ
            </span>
          )}
          {product.badge === "new" && (
            <span style={{
              background: "#4ade80",
              color: "#fff",
              padding: "6px 12px",
              borderRadius: "6px",
              fontSize: "11px",
              fontWeight: 700,
              letterSpacing: "0.1em",
              textTransform: "uppercase"
            }}>
              NEW
            </span>
          )}
        </div>
      )}

      {/* Image */}
      <div style={{ position: "relative", paddingTop: "100%", background: "#f5f1e8", overflow: "hidden" }}>
        {imageUrl && !imgError ? (
          <img
            src={imageUrl}
            alt={product.name}
            onError={() => setImgError(true)}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transition: "transform 0.3s ease"
            }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(1.05)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; }}
          />
        ) : (
          <div style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#8a7a64",
            fontSize: "14px"
          }}>
            Фото відсутнє
          </div>
        )}
      </div>

      {/* Content */}
      <div style={{ padding: "16px" }}>
        {/* Name */}
        <h3 style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: "14px",
          fontWeight: 500,
          color: "#1a1612",
          marginBottom: "12px",
          lineHeight: "1.4",
          minHeight: "40px",
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          overflow: "hidden"
        }}>
          {displayName}
        </h3>

        {/* Price */}
        <div style={{ marginBottom: "12px" }}>
          {product.oldPrice ? (
            <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
              <span style={{
                fontSize: "22px",
                fontWeight: 700,
                color: "#ff6b35",
                fontFamily: "'Inter', sans-serif"
              }}>
                {product.price.toLocaleString("uk-UA")} ₴
              </span>
              <span style={{
                fontSize: "15px",
                color: "#8a7a64",
                textDecoration: "line-through",
                fontFamily: "'Inter', sans-serif"
              }}>
                {product.oldPrice.toLocaleString("uk-UA")} ₴
              </span>
            </div>
          ) : (
            <span style={{
              fontSize: "22px",
              fontWeight: 700,
              color: "#1a1612",
              fontFamily: "'Inter', sans-serif"
            }}>
              {product.price.toLocaleString("uk-UA")} ₴
            </span>
          )}
        </div>

        {/* Stock status */}
        {product.inStock === false ? (
          <div style={{
            padding: "10px 16px",
            background: "#f5f1e8",
            borderRadius: "8px",
            fontSize: "12px",
            fontWeight: 500,
            color: "#8a7a64",
            textAlign: "center",
            letterSpacing: "0.05em"
          }}>
            Немає в наявності
          </div>
        ) : (
          <div style={{ display: "flex", gap: "8px", alignItems: "stretch" }}>
            {/* Quantity selector */}
            <select
              onClick={(e) => e.preventDefault()}
              onChange={(e) => e.stopPropagation()}
              style={{
                padding: "12px 8px",
                border: "1px solid #d4c8b0",
                borderRadius: "8px",
                fontSize: "14px",
                fontWeight: 500,
                color: "#1a1612",
                cursor: "pointer",
                background: "#fff",
                fontFamily: "'Inter', sans-serif",
                minWidth: "60px"
              }}
            >
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                <option key={num} value={num}>{num}</option>
              ))}
            </select>

            {/* Add to cart button */}
            <button
              onClick={(e) => {
                e.preventDefault();
                // Тут буде логіка додавання в кошик
              }}
              style={{
                flex: 1,
                padding: "12px 16px",
                background: "#a07d3d",
                color: "#fff",
                border: "none",
                borderRadius: "8px",
                fontSize: "13px",
                fontWeight: 600,
                letterSpacing: "0.05em",
                cursor: "pointer",
                transition: "all 0.2s ease",
                textTransform: "uppercase"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#7a5d28";
                e.currentTarget.style.transform = "translateY(-1px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "#a07d3d";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              В кошик
            </button>
          </div>
        )}
      </div>
    </Link>
  );
}
