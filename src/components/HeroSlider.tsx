"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import imageUrlBuilder from "@sanity/image-url";

const builder = imageUrlBuilder({
  projectId: "777maat6",
  dataset: "production",
});

function urlForSlider(source: any) {
  return builder.image(source);
}

interface HeroProduct {
  name: string;
  slug: { current: string };
  price: number;
  oldPrice?: number;
  mainImage: any;
  category?: { name: string };
}

export default function HeroSlider({ products }: { products: HeroProduct[] }) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (products.length <= 1) return;
    const interval = setInterval(() => {
      setActive((prev) => (prev === products.length - 1 ? 0 : prev + 1));
    }, 4000);
    return () => clearInterval(interval);
  }, [products.length]);

  if (!products.length) return null;

  const product = products[active];

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        aspectRatio: "16/10",
        background: "var(--bg-card)",
        overflow: "hidden",
        borderRadius: "8px",
        border: "1px solid var(--line-soft)",
        boxShadow: "0 8px 30px -10px rgba(26,22,18,.12)",
      }}
    >
      <Link href={"/product/" + product.slug.current} style={{ display: "block", height: "100%" }}>
        {product.mainImage && (
          <Image
            src={urlForSlider(product.mainImage).width(900).height(560).url()}
            alt={product.name}
            fill
            style={{ objectFit: "cover", transition: "opacity .5s" }}
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
        )}
      </Link>

      <Link
        href={"/product/" + product.slug.current}
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          padding: "24px 24px",
          background: "linear-gradient(180deg, transparent 0%, rgba(26,22,18,.8) 100%)",
          color: "var(--bg)",
          zIndex: 2,
          display: "block",
        }}
      >
        {product.category && (
          <div style={{ fontSize: "9px", letterSpacing: ".22em", textTransform: "uppercase", color: "var(--gold-soft)", marginBottom: "6px" }}>
            {product.category.name}
          </div>
        )}
        <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "20px", fontWeight: 400, lineHeight: "1.2", marginBottom: "6px" }}>
          {product.name}
        </h3>
        <div style={{ display: "flex", alignItems: "baseline", gap: "10px" }}>
          <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "20px", fontWeight: 500 }}>
            {product.price.toLocaleString("uk-UA")} ₴
          </span>
          {product.oldPrice && (
            <span style={{ fontSize: "13px", textDecoration: "line-through", opacity: 0.7 }}>
              {product.oldPrice.toLocaleString("uk-UA")} ₴
            </span>
          )}
        </div>
      </Link>

      {products.length > 1 && (
        <div style={{ position: "absolute", top: "14px", right: "14px", display: "flex", gap: "5px", zIndex: 3 }}>
          {products.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              style={{
                width: i === active ? "20px" : "7px",
                height: "7px",
                borderRadius: "4px",
                background: i === active ? "#fff" : "rgba(255,255,255,.4)",
                border: "none",
                cursor: "pointer",
                transition: "all .3s",
                padding: 0,
              }}
            />
          ))}
        </div>
      )}

      {products.length > 1 && (
        <>
          <button
            onClick={() => setActive((p) => (p === 0 ? products.length - 1 : p - 1))}
            style={{
              position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)",
              width: "36px", height: "36px", background: "rgba(255,255,255,.85)",
              border: "none", borderRadius: "50%", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "16px", color: "var(--ink)", zIndex: 3,
            }}
          >
            ‹
          </button>
          <button
            onClick={() => setActive((p) => (p === products.length - 1 ? 0 : p + 1))}
            style={{
              position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)",
              width: "36px", height: "36px", background: "rgba(255,255,255,.85)",
              border: "none", borderRadius: "50%", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "16px", color: "var(--ink)", zIndex: 3,
            }}
          >
            ›
          </button>
        </>
      )}
    </div>
  );
}
