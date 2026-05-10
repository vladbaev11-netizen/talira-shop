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
    mainImage?: any;
    externalImages?: string[];
    category?: { name: string };
  };
}

const badgeLabels: Record<string, string> = { hit: "Хіт", new: "Новинка", sale: "Акція" };

export default function ProductCard({ product }: ProductCardProps) {
  const discount = product.oldPrice ? Math.round((1 - product.price / product.oldPrice) * 100) : null;
  const imageUrl = product.mainImage
    ? urlForCard(product.mainImage).width(600).height(600).url()
    : product.externalImages && product.externalImages.length > 0
      ? product.externalImages[0]
      : "";

  const hasImage = !!imageUrl;

  return (
    <div 
      style={{ 
        display: "flex", 
        flexDirection: "column",
        boxShadow: "0 2px 8px rgba(26,22,18,0.08)",
        borderRadius: "8px",
        overflow: "hidden",
        background: "#fff",
        transition: "all 0.3s ease"
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
      <Link href={"/product/" + product.slug.current} style={{ cursor: "pointer", display: "block" }}>
        <div style={{ aspectRatio: "1", background: "var(--bg-card)", position: "relative", overflow: "hidden" }}>
          {hasImage && (
            <Image src={imageUrl} alt={product.name} fill style={{ objectFit: "cover" }} sizes="(max-width: 768px) 50vw, 25vw" />
          )}
          {/* СКИДКА - КРАСНАЯ */}
          {discount && discount > 0 && (
            <span style={{ 
              position: "absolute", 
              top: "12px", 
              left: "12px", 
              background: "#dc2626", 
              color: "#fff", 
              padding: "6px 12px", 
              fontSize: "13px", 
              letterSpacing: ".03em", 
              fontWeight: 700, 
              zIndex: 2, 
              borderRadius: "6px",
              boxShadow: "0 2px 8px rgba(220,38,38,0.3)"
            }}>
              −{discount}%
            </span>
          )}
          {/* ДРУГИЕ BADGES */}
          {product.badge && product.badge !== "sale" && (
            <span style={{ 
              position: "absolute", 
              top: discount ? "56px" : "12px", 
              left: "12px", 
              background: product.badge === "hit" ? "#ffd700" : product.badge === "new" ? "#4ade80" : "var(--ink)", 
              color: product.badge === "hit" ? "#1a1612" : "#fff", 
              padding: "6px 12px", 
              fontSize: "11px", 
              letterSpacing: ".1em", 
              textTransform: "uppercase", 
              fontWeight: 700, 
              zIndex: 2, 
              borderRadius: "6px" 
            }}>
              {badgeLabels[product.badge] || product.badge}
            </span>
          )}
        </div>

        <div style={{ padding: "16px" }}>
          {product.category && (
            <div style={{ fontSize: "10px", letterSpacing: ".22em", textTransform: "uppercase", color: "var(--gold-deep)", marginBottom: "6px" }}>
              {product.category.name}
            </div>
          )}

          <h4 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "18px", fontWeight: 500, lineHeight: "1.2", marginBottom: "10px", color: "var(--ink)", minHeight: "44px" }}>
            {product.name.length > 60 ? product.name.slice(0, 60) + "..." : product.name}
          </h4>

          {/* ЦЕНА - ЯРЧЕ И БОЛЬШЕ */}
          <div style={{ display: "flex", alignItems: "baseline", gap: "10px", fontFamily: "'Inter', sans-serif", marginBottom: "12px" }}>
            <span style={{ 
              fontSize: "24px", 
              color: "#1a1612", 
              fontWeight: 700 
            }}>
              {product.price.toLocaleString("uk-UA")} ₴
            </span>
            {product.oldPrice && (
              <span style={{ fontSize: "15px", color: "#8a7a64", textDecoration: "line-through", fontWeight: 400 }}>
                {product.oldPrice.toLocaleString("uk-UA")} ₴
              </span>
            )}
          </div>
        </div>
      </Link>

      <div style={{ padding: "0 16px 16px" }}>
        <AddToCartButton 
          slug={product.slug.current} 
          name={product.name} 
          price={product.price} 
          oldPrice={product.oldPrice} 
          image={imageUrl} 
          style="compact" 
          showQuantity={false}
          buttonText="Купити"
        />
      </div>
    </div>
  );
}
