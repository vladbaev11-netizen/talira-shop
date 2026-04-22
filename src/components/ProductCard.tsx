"use client";

import Link from "next/link";
import Image from "next/image";
import AddToCartButton from "@/components/AddToCartButton";
import imageUrlBuilder from "@sanity/image-url";

const builder = imageUrlBuilder({ projectId: "777maat6", dataset: "production" });
function urlForCard(source: any) { return builder.image(source); }

interface ProductCardProps {
  product: {
    name: string;
    slug: { current: string };
    price: number;
    oldPrice?: number;
    badge?: string;
    mainImage: any;
    category?: { name: string };
  };
}

const badgeLabels: Record<string, string> = { hit: "Хіт", new: "Новинка", sale: "Акція" };

export default function ProductCard({ product }: ProductCardProps) {
  const discount = product.oldPrice ? Math.round((1 - product.price / product.oldPrice) * 100) : null;
  const imageUrl = product.mainImage ? urlForCard(product.mainImage).width(600).height(600).url() : "";

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <Link href={"/product/" + product.slug.current} style={{ cursor: "pointer", transition: "transform .4s", display: "block" }}>
        <div style={{ aspectRatio: "1", background: "var(--bg-card)", position: "relative", overflow: "hidden", marginBottom: "16px", border: "1px solid var(--line-soft)", borderRadius: "4px" }}>
          {product.mainImage && (
            <Image src={imageUrl} alt={product.name} fill style={{ objectFit: "cover" }} sizes="(max-width: 768px) 50vw, 25vw" />
          )}
          {product.badge && (
            <span style={{ position: "absolute", top: "12px", left: "12px", background: product.badge === "hit" ? "var(--gold-deep)" : product.badge === "sale" ? "#d4380d" : "var(--ink)", color: "#fff", padding: "5px 12px", fontSize: "10px", letterSpacing: ".15em", textTransform: "uppercase", fontWeight: 600, zIndex: 2, borderRadius: "3px" }}>
              {discount && product.badge === "sale" ? "-" + discount + "%" : badgeLabels[product.badge] || product.badge}
            </span>
          )}
        </div>

        {product.category && (
          <div style={{ fontSize: "10px", letterSpacing: ".22em", textTransform: "uppercase", color: "var(--gold-deep)", marginBottom: "6px" }}>
            {product.category.name}
          </div>
        )}

        <h4 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "18px", fontWeight: 500, lineHeight: "1.2", marginBottom: "10px", color: "var(--ink)" }}>
          {product.name}
        </h4>

        <div style={{ display: "flex", alignItems: "baseline", gap: "10px", fontFamily: "'Cormorant Garamond', serif", marginBottom: "12px" }}>
          <span style={{ fontSize: "20px", color: "var(--ink)", fontWeight: 500 }}>{product.price.toLocaleString("uk-UA")} ₴</span>
          {product.oldPrice && (
            <span style={{ fontSize: "14px", color: "var(--text-dim)", textDecoration: "line-through" }}>{product.oldPrice.toLocaleString("uk-UA")} ₴</span>
          )}
        </div>
      </Link>

      <div style={{ marginTop: "auto" }}>
        <AddToCartButton slug={product.slug.current} name={product.name} price={product.price} oldPrice={product.oldPrice} image={imageUrl} style="compact" showQuantity={false} />
      </div>
    </div>
  );
}
