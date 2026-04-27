import { client } from "@/sanity/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import ProductPageClient from "./ProductPageClient";
import AddToCartButton from "@/components/AddToCartButton";
import { urlFor } from "@/sanity/image";
import SaleTimer from "@/components/SaleTimer";
import Link from "next/link";
import { PortableText } from "next-sanity";
import ReviewsCarousel from "@/components/ReviewsCarousel";
import PromoBlocks from "@/components/PromoBlocks";

async function getProduct(slug: string) {
  return client.fetch(
    `*[_type == "product" && slug.current == $slug][0] {
      name, sku, slug, price, oldPrice, badge, inStock, mainImage, gallery,
      videoUrl, shortDescription, benefits, description, specs,
      "reviews": reviews[!defined(approved) || approved],
      seoTitle, seoDescription,
      "category": category->{ _id, name, slug },
      "relatedProducts": relatedProducts[]->{ 
        name, slug, price, oldPrice, badge, mainImage,
        "category": category->{ name }
      }
    }`,
    { slug }
  );
}

async function getCustomerReviews(slug: string) {
  return client.fetch(
    `*[_type == "customerReview" && approved == true && product->slug.current == $slug] | order(createdAt desc) {
      _id, name, rating, tags, text, reply, createdAt
    }`,
    { slug }
  );
}

async function getAllProducts(categoryRef?: string) {
  if (categoryRef) {
    return client.fetch(
      `*[_type == "product" && category._ref == $catRef] | order(_createdAt desc) [0...12] {
        name, slug, price, oldPrice, badge, mainImage,
        "category": category->{ name }
      }`,
      { catRef: categoryRef }
    );
  }
  return client.fetch(
    `*[_type == "product"] | order(_createdAt desc) [0...12] {
      name, slug, price, oldPrice, badge, mainImage,
      "category": category->{ name }
    }`
  );
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) return {};
  return {
    title: product.seoTitle || product.name + " — TALIRA",
    description: product.seoDescription || product.shortDescription || "",
  };
}

export const revalidate = 60;

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) notFound();

  const related = product.relatedProducts?.length > 0 ? product.relatedProducts : await getAllProducts(product.category?._id);
  const customerReviews = await getCustomerReviews(slug);
  const allImages = [product.mainImage, ...(product.gallery || [])].filter((img) => img && img.asset);
  const allReviews = [...(product.reviews || []), ...customerReviews];
  const discount = product.oldPrice ? Math.round((1 - product.price / product.oldPrice) * 100) : null;
  const soldCount = 847 + Math.floor(product.price % 500);

  return (
    <>
      {/* Schema.org Product */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            name: product.name,
            description: product.shortDescription || "",
            sku: product.sku || product.slug.current,
            image: allImages[0] ? urlFor(allImages[0]).width(800).height(800).url() : undefined,
            offers: {
              "@type": "Offer",
              price: product.price,
              priceCurrency: "UAH",
              availability: product.inStock !== false ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
              seller: { "@type": "Organization", name: "TALIRA" },
            },
            aggregateRating: allReviews.length > 0 ? {
              "@type": "AggregateRating",
              ratingValue: (allReviews.reduce((sum: number, r: any) => sum + (r.rating || 5), 0) / allReviews.length).toFixed(1),
              reviewCount: allReviews.length,
            } : undefined,
          }),
        }}
      />

      <Header />

      {/* Breadcrumbs */}
      <div className="container-pad" style={{ maxWidth: "1320px", margin: "0 auto", padding: "16px 48px", fontSize: "11px", letterSpacing: ".15em", textTransform: "uppercase", color: "var(--text-dim)" }}>
        <Link href="/catalog" style={{ color: "var(--text)" }}>Каталог</Link>
        <span style={{ margin: "0 10px" }}>/</span>
        {product.category && (
          <>
            <Link href="/catalog" style={{ color: "var(--text)" }}>{product.category.name}</Link>
            <span style={{ margin: "0 10px" }}>/</span>
          </>
        )}
        <span style={{ color: "var(--ink)" }}>{product.name}</span>
      </div>

      {/* ============================================ */}
      {/* SECTION 1: Product Hero */}
      {/* ============================================ */}
      <section style={{ padding: "16px 0 60px" }}>
        <div className="container-pad grid-product" style={{ maxWidth: "1320px", margin: "0 auto", padding: "0 48px" }}>

          {/* Gallery */}
          <ProductPageClient images={allImages} productName={product.name} />

          {/* Info Panel */}
          <div>
            {/* Category badge */}
            {product.category && (
              <div style={{ color: "var(--gold-deep)", fontSize: "11px", letterSpacing: ".25em", textTransform: "uppercase", marginBottom: "14px", fontWeight: 500 }}>
                {product.category.name}
              </div>
            )}

            {/* Product name */}
            <h1 className="product-name" style={{ fontFamily: "'Cormorant Garamond', serif", lineHeight: "1.05", fontWeight: 400, marginBottom: "12px", letterSpacing: "-.01em" }}>
              {product.name}
            </h1>

            {product.sku && (
              <div style={{ fontSize: "11px", color: "var(--text-dim)", letterSpacing: ".1em", marginBottom: "16px" }}>
                Артикул: <span style={{ fontWeight: 500, color: "var(--text)" }}>{product.sku}</span>
              </div>
            )}

            {/* Rating + sold */}
            <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "24px", flexWrap: "wrap" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                {[1,2,3,4,5].map(s => (
                  <svg key={s} width="18" height="18" viewBox="0 0 24 24" fill="var(--gold-deep)" stroke="none">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                ))}
                <span style={{ fontSize: "14px", fontWeight: 600, color: "var(--ink)", marginLeft: "4px" }}>4.9</span>
              </div>
              <span style={{ fontSize: "12px", color: "var(--text-dim)" }}>
                {allReviews?.length || 0} {"відгуків"}
              </span>
              <span style={{ fontSize: "12px", color: "var(--text-dim)" }}>
                {soldCount}+ {"продано"}
              </span>
            </div>

            {/* Price block — ACCENT */}
            <div style={{ background: "var(--paper)", border: "1px solid var(--line-soft)", padding: "24px 28px", marginBottom: "20px" }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: "16px", flexWrap: "wrap", marginBottom: discount ? "12px" : "0" }}>
                <div className="price-big" style={{ fontFamily: "'Cormorant Garamond', serif", color: "var(--ink)", lineHeight: 1, fontWeight: 600 }}>
                  {product.price.toLocaleString("uk-UA")}
                  <span style={{ fontSize: "24px", color: "var(--gold-deep)", marginLeft: "4px", fontWeight: 400 }}>₴</span>
                </div>
                {product.oldPrice && (
                  <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "24px", color: "var(--text-dim)", textDecoration: "line-through" }}>
                    {product.oldPrice.toLocaleString("uk-UA")} ₴
                  </div>
                )}
                {discount && (
                  <div style={{ background: "#d4380d", color: "#fff", padding: "6px 16px", fontSize: "13px", fontWeight: 700, borderRadius: "4px" }}>
                    -{discount}%
                  </div>
                )}
              </div>
              {discount && (
                <div style={{ fontSize: "13px", color: "#d4380d", fontWeight: 500 }}>
                  Ви економите: {(product.oldPrice - product.price).toLocaleString("uk-UA")} ₴
                </div>
              )}
            </div>

            {/* Sale timer */}
            {product.oldPrice && product.oldPrice > product.price && <SaleTimer />}

            {/* Short description */}
            {product.shortDescription && (
              <p style={{ color: "var(--text)", fontSize: "15px", lineHeight: "1.75", marginBottom: "24px" }}>
                {product.shortDescription}
              </p>
            )}

            {/* Benefits — with icons */}
            {product.benefits && product.benefits.length > 0 && (
              <div style={{ marginBottom: "32px", padding: "28px", background: "linear-gradient(135deg, #f8f4e8 0%, #f0e8d0 100%)", border: "1px solid var(--gold)", borderRadius: "8px" }}>
                <h4 style={{ fontSize: "14px", letterSpacing: ".1em", textTransform: "uppercase", color: "var(--gold-deep)", marginBottom: "18px", fontWeight: 700, fontFamily: "'Inter', sans-serif", display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ fontSize: "20px" }}>✨</span> Що ви отримаєте
                </h4>
                {product.benefits.map((benefit: string, i: number) => (
                  <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "12px", padding: "10px 0", fontSize: "14px", color: "var(--ink)", lineHeight: "1.5", borderBottom: i < product.benefits.length - 1 ? "1px solid rgba(160,125,61,.2)" : "none" }}>
                    <div style={{ width: "22px", height: "22px", borderRadius: "50%", background: "var(--gold-deep)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: "1px" }}>
                      <svg width="12" height="12" fill="none" stroke="#fff" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M20 6 9 17l-5-5" /></svg>
                    </div>
                    <span style={{ fontWeight: 500 }}>{benefit}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Trust icons row */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px", marginBottom: "28px" }}>
              <TrustCard icon="🚚" title="Нова Пошта" sub="1–3 дні по Україні" />
              <TrustCard icon="💰" title="Оплата" sub="При отриманні" />
              <TrustCard icon="🔄" title="Повернення" sub="14 днів гарантія" />
            </div>

            {/* Add to cart */}
            <AddToCartButton
              slug={product.slug.current}
              name={product.name}
              price={product.price}
              oldPrice={product.oldPrice}
              image={allImages[0] ? urlFor(allImages[0]).width(200).height(200).url() : undefined}
              style="full"
              showQuantity={true}
            />
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* SECTION 2: Why choose us — dark block */}
      {/* ============================================ */}
      <section style={{ background: "var(--ink)", color: "var(--bg)", padding: "64px 0" }}>
        <div className="container-pad" style={{ maxWidth: "1320px", margin: "0 auto", padding: "0 48px" }}>
          <h2 className="title-section" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 400, marginBottom: "40px", textAlign: "center" }}>
            Чому обирають <em style={{ color: "var(--gold-soft)", fontStyle: "italic" }}>TALIRA</em>
          </h2>
          <div className="grid-4" style={{ gap: "24px" }}>
            <WhyCard icon="✅" title="Перевірена якість" desc="Кожен товар проходить контроль перед відправкою" />
            <WhyCard icon="📦" title="Швидка відправка" desc="Відправляємо щодня до 17:00" />
            <WhyCard icon="💳" title="Без передоплати" desc="Оплата тільки після перевірки товару" />
            <WhyCard icon="⭐" title="12 000+ клієнтів" desc="Середній рейтинг 4.9 із 5" />
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* PROMO BLOCKS — individual per product */}
      {/* ============================================ */}
      <PromoBlocks sku={product.sku || ""} images={allImages} productName={product.name} />

      {/* ============================================ */}
      {/* SECTION 3: Full description */}
      {/* ============================================ */}
      {product.description && (
        <section style={{ padding: "80px 0", background: "var(--bg)" }}>
          <div className="container-pad" style={{ maxWidth: "900px", margin: "0 auto", padding: "0 48px" }}>
            <h2 className="title-section" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 400, marginBottom: "32px", textAlign: "center" }}>
              Детальний <em style={{ color: "var(--gold-deep)", fontStyle: "italic" }}>опис</em>
            </h2>
            <div style={{ fontSize: "15px", color: "var(--text)", lineHeight: "1.85" }} className="rich-text">
              <PortableText value={product.description} />
            </div>
          </div>
        </section>
      )}

      {/* ============================================ */}
      {/* SECTION 4: Specs */}
      {/* ============================================ */}
      {product.specs && product.specs.length > 0 && (
        <section style={{ padding: "72px 0", background: "var(--paper)", borderTop: "1px solid var(--line)", borderBottom: "1px solid var(--line)" }}>
          <div className="container-pad" style={{ maxWidth: "900px", margin: "0 auto", padding: "0 48px" }}>
            <h2 className="title-section" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 400, marginBottom: "36px", textAlign: "center" }}>
              Характеристики
            </h2>
            <div style={{ background: "var(--bg-card)", border: "1px solid var(--line-soft)", borderRadius: "8px", overflow: "hidden" }}>
              {product.specs.map((spec: { label: string; value: string }, i: number) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "16px 24px", fontSize: "14px", background: i % 2 === 0 ? "var(--bg-card)" : "var(--paper)", borderBottom: i < product.specs.length - 1 ? "1px solid var(--line-soft)" : "none" }}>
                  <span style={{ color: "var(--text)" }}>{spec.label}</span>
                  <span style={{ color: "var(--ink)", fontWeight: 600 }}>{spec.value}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ============================================ */}
      {/* SECTION 5: Reviews */}
      {/* ============================================ */}
      {allReviews && allReviews.length > 0 && (
        <section style={{ padding: "80px 0", background: "var(--bg)" }}>
          <div className="container-pad" style={{ maxWidth: "1320px", margin: "0 auto", padding: "0 48px" }}>
            <div style={{ textAlign: "center", marginBottom: "48px" }}>
              <h2 className="title-section" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 400, marginBottom: "12px" }}>
                Відгуки наших <em style={{ color: "var(--gold-deep)", fontStyle: "italic" }}>клієнтів</em>
              </h2>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                {[1,2,3,4,5].map(s => (
                  <svg key={s} width="24" height="24" viewBox="0 0 24 24" fill="var(--gold-deep)" stroke="none">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                ))}
                <span style={{ fontSize: "18px", fontWeight: 700, color: "var(--ink)", marginLeft: "8px" }}>4.9</span>
                <span style={{ fontSize: "14px", color: "var(--text-dim)", marginLeft: "4px" }}>({allReviews.length} {"відгуків"})</span>
              </div>
            </div>
            <ReviewsCarousel reviews={allReviews} />
          </div>
        </section>
      )}

      {/* ============================================ */}
      {/* SECTION 6: CTA repeat */}
      {/* ============================================ */}
      <section style={{ padding: "64px 0", background: "linear-gradient(135deg, #f8f4e8 0%, #ede4cc 100%)", borderTop: "1px solid var(--line)", borderBottom: "1px solid var(--line)" }}>
        <div className="container-pad" style={{ maxWidth: "700px", margin: "0 auto", padding: "0 48px", textAlign: "center" }}>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(28px, 4vw, 40px)", fontWeight: 400, marginBottom: "16px" }}>
            Замовте <em style={{ color: "var(--gold-deep)", fontStyle: "italic" }}>{product.name}</em> зараз
          </h2>
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "center", gap: "16px", marginBottom: "20px", flexWrap: "wrap" }}>
            <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "40px", fontWeight: 600, color: "var(--ink)" }}>
              {product.price.toLocaleString("uk-UA")} ₴
            </span>
            {product.oldPrice && (
              <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "22px", color: "var(--text-dim)", textDecoration: "line-through" }}>
                {product.oldPrice.toLocaleString("uk-UA")} ₴
              </span>
            )}
          </div>
          {product.oldPrice && product.oldPrice > product.price && (
            <div style={{ display: "flex", justifyContent: "center", marginBottom: "20px" }}>
              <SaleTimer />
            </div>
          )}
          <p style={{ color: "var(--text)", fontSize: "14px", marginBottom: "24px" }}>
            Доставка Новою Поштою · Оплата при отриманні · Гарантія 14 днів
          </p>
          <AddToCartButton
            slug={product.slug.current}
            name={product.name}
            price={product.price}
            oldPrice={product.oldPrice}
            image={allImages[0] ? urlFor(allImages[0]).width(200).height(200).url() : undefined}
            style="gold"
            showQuantity={false}
          />
        </div>
      </section>

      {/* ============================================ */}
      {/* SECTION 7: Related products */}
      {/* ============================================ */}
      {related && related.length > 0 && (
        <section style={{ padding: "80px 0" }}>
          <div className="container-pad" style={{ maxWidth: "1320px", margin: "0 auto", padding: "0 48px" }}>
            <h2 className="title-section" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 400, marginBottom: "40px" }}>
              {"Вам також"} <em style={{ color: "var(--gold-deep)", fontStyle: "italic" }}>{"сподобається"}</em>
            </h2>
            <div style={{ display: "flex", gap: "20px", overflowX: "auto", scrollSnapType: "x mandatory", WebkitOverflowScrolling: "touch", paddingBottom: "8px", scrollbarWidth: "none" }}>
              {related.filter((p: any) => p.slug.current !== product.slug.current).slice(0, 12).map((p: any) => (
                <div key={p.slug.current} style={{ flex: "0 0 calc(25% - 15px)", minWidth: "240px", scrollSnapAlign: "start" }}>
                  <ProductCard product={p} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </>
  );
}

function TrustCard({ icon, title, sub }: { icon: string; title: string; sub: string }) {
  return (
    <div style={{ background: "var(--bg-card)", border: "1px solid var(--line-soft)", borderRadius: "8px", padding: "16px", textAlign: "center" }}>
      <div style={{ fontSize: "24px", marginBottom: "8px" }}>{icon}</div>
      <div style={{ fontSize: "13px", fontWeight: 600, color: "var(--ink)", marginBottom: "2px" }}>{title}</div>
      <div style={{ fontSize: "11px", color: "var(--text-dim)" }}>{sub}</div>
    </div>
  );
}

function WhyCard({ icon, title, desc }: { icon: string; title: string; desc: string }) {
  return (
    <div style={{ textAlign: "center", padding: "28px 16px" }}>
      <div style={{ fontSize: "32px", marginBottom: "14px" }}>{icon}</div>
      <h4 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "20px", fontWeight: 500, marginBottom: "8px", color: "var(--bg)" }}>{title}</h4>
      <p style={{ fontSize: "13px", color: "rgba(245,241,232,.7)", lineHeight: "1.5" }}>{desc}</p>
    </div>
  );
}
