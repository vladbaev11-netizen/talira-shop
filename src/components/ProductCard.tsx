import Link from "next/link";
import Image from "next/image";
import { urlFor } from "@/sanity/image";

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

const badgeLabels: Record<string, string> = {
  hit: "Хіт",
  new: "Новинка",
  sale: "Акція",
};

export default function ProductCard({ product }: ProductCardProps) {
  const discount = product.oldPrice
    ? Math.round((1 - product.price / product.oldPrice) * 100)
    : null;

  return (
    <Link
      href={`/product/${product.slug.current}`}
      style={{
        cursor: "pointer",
        transition: "transform .4s",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Image */}
      <div
        style={{
          aspectRatio: "1",
          background: "var(--bg-card)",
          position: "relative",
          overflow: "hidden",
          marginBottom: "20px",
          border: "1px solid var(--line-soft)",
        }}
      >
        {product.mainImage && (
          <Image
            src={urlFor(product.mainImage).width(600).height(600).url()}
            alt={product.name}
            fill
            style={{ objectFit: "cover" }}
            sizes="(max-width: 768px) 100vw, 25vw"
          />
        )}

        {/* Badge */}
        {product.badge && (
          <span
            style={{
              position: "absolute",
              top: "14px",
              left: "14px",
              background:
                product.badge === "hit" ? "var(--gold-deep)" : "var(--ink)",
              color: "var(--bg)",
              padding: "6px 14px",
              fontSize: "10px",
              letterSpacing: ".18em",
              textTransform: "uppercase",
              fontWeight: 500,
              zIndex: 2,
            }}
          >
            {discount && product.badge === "sale"
              ? `−${discount}%`
              : badgeLabels[product.badge] || product.badge}
          </span>
        )}
      </div>

      {/* Category */}
      {product.category && (
        <div
          style={{
            fontSize: "10px",
            letterSpacing: ".22em",
            textTransform: "uppercase",
            color: "var(--gold-deep)",
            marginBottom: "8px",
          }}
        >
          {product.category.name}
        </div>
      )}

      {/* Name */}
      <h4
        style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: "22px",
          fontWeight: 500,
          lineHeight: "1.2",
          marginBottom: "14px",
          color: "var(--ink)",
        }}
      >
        {product.name}
      </h4>

      {/* Price */}
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          gap: "12px",
          fontFamily: "'Cormorant Garamond', serif",
          marginTop: "auto",
        }}
      >
        <span style={{ fontSize: "22px", color: "var(--ink)", fontWeight: 500 }}>
          {product.price.toLocaleString("uk-UA")} ₴
        </span>
        {product.oldPrice && (
          <span
            style={{
              fontSize: "15px",
              color: "var(--text-dim)",
              textDecoration: "line-through",
              fontWeight: 400,
            }}
          >
            {product.oldPrice.toLocaleString("uk-UA")} ₴
          </span>
        )}
      </div>
    </Link>
  );
}
