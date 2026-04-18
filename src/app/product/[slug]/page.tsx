import { client } from "@/sanity/client";
import { urlFor } from "@/sanity/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import ProductPageClient from "./ProductPageClient";
import OrderForm from "@/components/OrderForm";

async function getProduct(slug: string) {
  return client.fetch(
    `
    *[_type == "product" && slug.current == $slug][0] {
      name,
      slug,
      price,
      oldPrice,
      badge,
      inStock,
      mainImage,
      gallery,
      videoUrl,
      shortDescription,
      benefits,
      description,
      specs,
      reviews,
      seoTitle,
      seoDescription,
      "category": category->{ name, slug },
      "relatedProducts": relatedProducts[]->{ 
        name, slug, price, oldPrice, badge, mainImage,
        "category": category->{ name }
      }
    }
  `,
    { slug }
  );
}

async function getAllProducts() {
  return client.fetch(
    `*[_type == "product"] | order(_createdAt desc) [0...4] {
      name, slug, price, oldPrice, badge, mainImage,
      "category": category->{ name }
    }`
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) return {};
  return {
    title: product.seoTitle || `${product.name} — TALIRA`,
    description:
      product.seoDescription || product.shortDescription || "",
  };
}

export const revalidate = 60;

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) notFound();

  const related =
    product.relatedProducts?.length > 0
      ? product.relatedProducts
      : await getAllProducts();

  const allImages = [
    product.mainImage,
    ...(product.gallery || []),
  ].filter((img) => img && img.asset);

  const discount = product.oldPrice
    ? Math.round((1 - product.price / product.oldPrice) * 100)
    : null;

  return (
    <>
      <Header />

      {/* Breadcrumbs */}
      <div
        style={{
          maxWidth: "1320px",
          margin: "0 auto",
          padding: "20px 48px",
          fontSize: "11px",
          letterSpacing: ".18em",
          textTransform: "uppercase",
          color: "var(--text-dim)",
        }}
      >
        <a href="/" style={{ color: "var(--text)" }}>
          Головна
        </a>
        <span style={{ margin: "0 12px" }}>/</span>
        {product.category && (
          <>
            <a href="/catalog" style={{ color: "var(--text)" }}>
              {product.category.name}
            </a>
            <span style={{ margin: "0 12px" }}>/</span>
          </>
        )}
        <span style={{ color: "var(--ink)" }}>{product.name}</span>
      </div>

      {/* Product section */}
      <section style={{ padding: "20px 0 80px" }}>
        <div
          style={{
            maxWidth: "1320px",
            margin: "0 auto",
            padding: "0 48px",
            display: "grid",
            gridTemplateColumns: "1.2fr 1fr",
            gap: "80px",
            alignItems: "start",
          }}
        >
          {/* Gallery */}
          <ProductPageClient images={allImages} productName={product.name} />

          {/* Info panel */}
          <div style={{ paddingTop: "8px" }}>
            {/* Category */}
            {product.category && (
              <div
                style={{
                  color: "var(--gold-deep)",
                  fontSize: "11px",
                  letterSpacing: ".25em",
                  textTransform: "uppercase",
                  marginBottom: "18px",
                  fontWeight: 500,
                }}
              >
                {product.category.name}
              </div>
            )}

            {/* Name */}
            <h1
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "48px",
                lineHeight: "1.05",
                fontWeight: 400,
                marginBottom: "24px",
                letterSpacing: "-.01em",
              }}
            >
              {product.name}
            </h1>

            {/* Rating */}
            {product.reviews && product.reviews.length > 0 && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "18px",
                  marginBottom: "28px",
                  paddingBottom: "28px",
                  borderBottom: "1px solid var(--line)",
                }}
              >
                <span
                  style={{
                    color: "var(--gold-deep)",
                    fontSize: "14px",
                    letterSpacing: "3px",
                  }}
                >
                  ★★★★★
                </span>
                <span style={{ color: "var(--text)", fontSize: "13px" }}>
                  {product.reviews.length} відгуків
                </span>
              </div>
            )}

            {/* Price */}
            <div
              style={{
                display: "flex",
                alignItems: "baseline",
                gap: "18px",
                marginBottom: "36px",
                flexWrap: "wrap",
              }}
            >
              <div
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: "48px",
                  color: "var(--ink)",
                  lineHeight: 1,
                  fontWeight: 500,
                }}
              >
                {product.price.toLocaleString("uk-UA")}
                <span
                  style={{
                    fontSize: "22px",
                    color: "var(--gold-deep)",
                    marginLeft: "4px",
                    fontWeight: 400,
                  }}
                >
                  ₴
                </span>
              </div>
              {product.oldPrice && (
                <div
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: "22px",
                    color: "var(--text-dim)",
                    textDecoration: "line-through",
                  }}
                >
                  {product.oldPrice.toLocaleString("uk-UA")} ₴
                </div>
              )}
              {discount && (
                <div
                  style={{
                    background: "var(--ink)",
                    color: "var(--bg)",
                    padding: "6px 14px",
                    fontSize: "11px",
                    letterSpacing: ".18em",
                    textTransform: "uppercase",
                    fontWeight: 500,
                  }}
                >
                  Економія {discount}%
                </div>
              )}
            </div>

            {/* Short description */}
            {product.shortDescription && (
              <p
                style={{
                  color: "var(--text)",
                  fontSize: "15px",
                  lineHeight: "1.75",
                  marginBottom: "28px",
                }}
              >
                {product.shortDescription}
              </p>
            )}

            {/* Benefits */}
            {product.benefits && product.benefits.length > 0 && (
              <div
                style={{
                  marginBottom: "36px",
                  padding: "32px",
                  background: "var(--paper)",
                  border: "1px solid var(--line-soft)",
                }}
              >
                <h4
                  style={{
                    fontSize: "11px",
                    letterSpacing: ".25em",
                    textTransform: "uppercase",
                    color: "var(--gold-deep)",
                    marginBottom: "20px",
                    fontWeight: 600,
                    fontFamily: "'Inter', sans-serif",
                  }}
                >
                  Що ви отримаєте
                </h4>
                {product.benefits.map((benefit: string, i: number) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "14px",
                      padding: "12px 0",
                      fontSize: "14px",
                      color: "var(--ink-soft)",
                      lineHeight: "1.55",
                      borderBottom:
                        i < product.benefits.length - 1
                          ? "1px solid var(--line-soft)"
                          : "none",
                    }}
                  >
                    <svg
                      width="16"
                      height="16"
                      fill="none"
                      stroke="var(--gold-deep)"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      style={{ flexShrink: 0, marginTop: "3px" }}
                    >
                      <path d="M20 6 9 17l-5-5" />
                    </svg>
                    {benefit}
                  </div>
                ))}
              </div>
            )}

            {/* Order form */}
            <OrderForm productName={product.name} productPrice={product.price} />
          </div>
        </div>
      </section>

      {/* Specs */}
      {product.specs && product.specs.length > 0 && (
        <section
          style={{
            padding: "80px 0",
            borderTop: "1px solid var(--line)",
          }}
        >
          <div
            style={{
              maxWidth: "1320px",
              margin: "0 auto",
              padding: "0 48px",
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "80px",
            }}
          >
            <div>
              <h3
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: "38px",
                  marginBottom: "24px",
                  fontWeight: 400,
                  lineHeight: "1.1",
                }}
              >
                Характеристики
              </h3>
              {product.shortDescription && (
                <p
                  style={{
                    color: "var(--text)",
                    fontSize: "15px",
                    lineHeight: "1.85",
                  }}
                >
                  {product.shortDescription}
                </p>
              )}
            </div>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
              }}
            >
              <tbody>
                {product.specs.map(
                  (spec: { label: string; value: string }, i: number) => (
                    <tr
                      key={i}
                      style={{
                        borderBottom: "1px solid var(--line-soft)",
                      }}
                    >
                      <td
                        style={{
                          padding: "18px 0",
                          fontSize: "14px",
                          color: "var(--text)",
                          width: "50%",
                        }}
                      >
                        {spec.label}
                      </td>
                      <td
                        style={{
                          padding: "18px 0",
                          fontSize: "14px",
                          color: "var(--ink)",
                          fontWeight: 500,
                        }}
                      >
                        {spec.value}
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Reviews */}
      {product.reviews && product.reviews.length > 0 && (
        <section
          style={{
            padding: "80px 0",
            background: "var(--bg-soft)",
          }}
        >
          <div
            style={{
              maxWidth: "1320px",
              margin: "0 auto",
              padding: "0 48px",
            }}
          >
            <h2
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "clamp(36px, 4vw, 56px)",
                fontWeight: 400,
                marginBottom: "48px",
              }}
            >
              Відгуки{" "}
              <em
                style={{
                  color: "var(--gold-deep)",
                  fontStyle: "italic",
                  fontWeight: 300,
                }}
              >
                клієнтів
              </em>
            </h2>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: "28px",
              }}
            >
              {product.reviews.map(
                (
                  review: {
                    name: string;
                    city?: string;
                    rating?: number;
                    text: string;
                  },
                  i: number
                ) => (
                  <div
                    key={i}
                    style={{
                      background: "var(--bg)",
                      border: "1px solid var(--line-soft)",
                      padding: "36px",
                    }}
                  >
                    <div
                      style={{
                        color: "var(--gold-deep)",
                        marginBottom: "20px",
                        letterSpacing: "3px",
                        fontSize: "14px",
                      }}
                    >
                      {"★".repeat(review.rating || 5)}
                    </div>
                    <p
                      style={{
                        fontFamily: "'Cormorant Garamond', serif",
                        fontStyle: "italic",
                        fontSize: "19px",
                        lineHeight: "1.5",
                        marginBottom: "28px",
                      }}
                    >
                      &ldquo;{review.text}&rdquo;
                    </p>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "14px",
                        paddingTop: "22px",
                        borderTop: "1px solid var(--line-soft)",
                      }}
                    >
                      <div
                        style={{
                          width: "46px",
                          height: "46px",
                          borderRadius: "50%",
                          background: "var(--ink)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "var(--gold-soft)",
                          fontFamily: "'Cormorant Garamond', serif",
                          fontSize: "20px",
                          fontStyle: "italic",
                        }}
                      >
                        {review.name.charAt(0)}
                      </div>
                      <div>
                        <div
                          style={{
                            fontSize: "14px",
                            fontWeight: 500,
                          }}
                        >
                          {review.name}
                        </div>
                        {review.city && (
                          <div
                            style={{
                              fontSize: "10px",
                              color: "var(--text)",
                              letterSpacing: ".18em",
                              textTransform: "uppercase",
                              marginTop: "3px",
                            }}
                          >
                            {review.city} · Verified
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        </section>
      )}

      {/* Related */}
      {related && related.length > 0 && (
        <section style={{ padding: "100px 0" }}>
          <div
            style={{
              maxWidth: "1320px",
              margin: "0 auto",
              padding: "0 48px",
            }}
          >
            <h2
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "clamp(36px, 4vw, 56px)",
                fontWeight: 400,
                marginBottom: "48px",
              }}
            >
              Можливо, вам також{" "}
              <em
                style={{
                  color: "var(--gold-deep)",
                  fontStyle: "italic",
                  fontWeight: 300,
                }}
              >
                сподобається
              </em>
            </h2>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                gap: "28px",
              }}
            >
              {related
                .filter(
                  (p: any) => p.slug.current !== product.slug.current
                )
                .slice(0, 4)
                .map((p: any) => (
                  <ProductCard key={p.slug.current} product={p} />
                ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </>
  );
}
