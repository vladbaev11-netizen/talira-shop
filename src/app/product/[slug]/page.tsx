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

async function getProduct(slug: string) {
  return client.fetch(
    `*[_type == "product" && slug.current == $slug][0] {
      name, sku, slug, price, oldPrice, badge, inStock, mainImage, externalImages, gallery,
      videoUrl, shortDescription, benefits, description, specs,
      "reviews": reviews[!defined(approved) || approved],
      seoTitle, seoDescription,
      "category": category->{ _id, name, slug },
      "relatedProducts": relatedProducts[]->{
        name, slug, price, oldPrice, badge, mainImage, externalImages,
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

async function getAllProducts(categoryId?: string) {
  if (categoryId) {
    return client.fetch(
      `*[_type == "product" && category._ref == $catRef] | order(_createdAt desc) [0...12] {
        name, slug, price, oldPrice, badge, mainImage, externalImages,
        "category": category->{ name }
      }`,
      { catRef: categoryId }
    );
  }
  return client.fetch(
    `*[_type == "product"] | order(_createdAt desc) [0...12] {
      name, slug, price, oldPrice, badge, mainImage, externalImages,
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

  // Images: Sanity images first, then external URLs as fallback
  const sanityImages = [product.mainImage, ...(product.gallery || [])].filter((img: any) => img && img.asset);
  const extImages = product.externalImages || [];
  const allImages = sanityImages;
  const mainImageUrl = sanityImages.length > 0
    ? urlFor(sanityImages[0]).width(800).height(800).url()
    : extImages.length > 0 ? extImages[0] : "";

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
            image: mainImageUrl || undefined,
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
        <Link href="/catalog" style={{ color: "var(--text)" }}>{"Каталог"}</Link>
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
          <ProductPageClient images={allImages} externalImages={extImages} productName={product.name} />

          {/* Info Panel */}
          <div>
            {product.category && (
              <div style={{ color: "var(--gold-deep)", fontSize: "11px", letterSpacing: ".25em", textTransform: "uppercase", marginBottom: "14px", fontWeight: 500 }}>
                {product.category.name}
              </div>
            )}

            <h1 className="product-name" style={{ fontFamily: "'Cormorant Garamond', serif", lineHeight: "1.05", fontWeight: 400, marginBottom: "12px", letterSpacing: "-.01em" }}>
              {product.name}
            </h1>

            {product.sku && (
              <div style={{ fontSize: "11px", color: "var(--text-dim)", letterSpacing: ".1em", marginBottom: "16px" }}>
                {"Артикул: "}<span style={{ fontWeight: 500, color: "var(--text)" }}>{product.sku}</span>
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

            {/* Price block */}
            <div style={{ background: "var(--paper)", border: "1px solid var(--line-soft)", padding: "24px 28px", marginBottom: "20px" }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: "16px", flexWrap: "wrap" }}>
                <div className="price-big" style={{ fontFamily: "'Cormorant Garamond', serif", color: "var(--ink)", lineHeight: 1, fontWeight: 600 }}>
                  {product.price.toLocaleString("uk-UA")}
                  <span style={{ fontSize: "24px", color: "var(--gold-deep)", marginLeft: "4px", fontWeight: 400 }}>{"₴"}</span>
                </div>
                {product.oldPrice && (
                  <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "24px", color: "var(--text-dim)", textDecoration: "line-through" }}>
                    {product.oldPrice.toLocaleString("uk-UA")} {"₴"}
                  </div>
                )}
                {discount && (
                  <div style={{ background: "#d4380d", color: "#fff", padding: "6px 16px", fontSize: "13px", fontWeight: 700, borderRadius: "4px" }}>
                    {"-"}{discount}{"%"}
                  </div>
                )}
              </div>
            </div>

            {/* Short description */}
            {product.shortDescription && (
              <p style={{ color: "var(--text)", fontSize: "14px", lineHeight: "1.75", marginBottom: "20px" }}>
                {product.shortDescription}
              </p>
            )}

            {/* Add to cart */}
            <div style={{ marginBottom: "20px" }}>
              <AddToCartButton slug={product.slug.current} name={product.name} price={product.price} oldPrice={product.oldPrice} image={mainImageUrl} style="full" />
            </div>

            {/* Trust cards */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px" }}>
              <TrustCard icon="🚚" title="Нова Пошта" desc="Доставка 1-3 дні" />
              <TrustCard icon="💳" title="Оплата" desc="При отриманні" />
              <TrustCard icon="🔄" title="Повернення" desc="14 днів гарантія" />
            </div>
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* SECTION 2: Why choose TALIRA — dark block */}
      {/* ============================================ */}
      <section style={{ background: "var(--ink)", color: "var(--bg)", padding: "60px 0" }}>
        <div className="container-pad" style={{ maxWidth: "1320px", margin: "0 auto", padding: "0 48px", textAlign: "center" }}>
          <h2 className="title-section" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 400, marginBottom: "40px", color: "var(--bg)" }}>
            {"Чому обирають "}<em style={{ color: "var(--gold-soft)", fontStyle: "italic" }}>{"TALIRA"}</em>
          </h2>
          <div className="grid-4">
            <WhyCard icon="🛡️" title="Перевірена якість" desc="Кожен товар проходить контроль перед відправкою" />
            <WhyCard icon="📦" title="Швидка відправка" desc="Відправляємо щодня до 17:00" />
            <WhyCard icon="💳" title="Без передоплати" desc="Оплата тільки після перевірки товару" />
            <WhyCard icon="⭐" title="12 000+ клієнтів" desc="Середній рейтинг 4.9 із 5" />
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* GALLERY — Товар зблизька */}
      {/* ============================================ */}
      {(allImages.length > 2 || extImages.length > 2) && (
        <section style={{ padding: "60px 0", background: "var(--bg-soft)" }}>
          <div className="container-pad" style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 48px" }}>
            <h2 className="title-section" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 400, textAlign: "center", marginBottom: "32px" }}>
              {"Товар "}<em style={{ color: "var(--gold-deep)", fontStyle: "italic" }}>{"зблизька"}</em>
            </h2>
            <div className="grid-n7-gallery" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px" }}>
              {(allImages.length > 0 ? allImages : extImages).slice(0, 4).map((img: any, i: number) => {
                const src = typeof img === "string" ? img : (img && img.asset ? urlFor(img).width(400).height(400).url() : "");
                if (!src) return null;
                return (
                  <div key={i} style={{ aspectRatio: "1", position: "relative", borderRadius: "8px", overflow: "hidden" }}>
                    <img src={src} alt={product.name + " " + (i + 1)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ============================================ */}
      {/* HOW TO ORDER */}
      {/* ============================================ */}
      <section style={{ padding: "80px 0", background: "var(--bg)" }}>
        <div className="container-pad" style={{ maxWidth: "900px", margin: "0 auto", padding: "0 48px" }}>
          <h2 className="title-section" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 400, textAlign: "center", marginBottom: "48px" }}>
            {"Як оформити "}<em style={{ color: "var(--gold-deep)", fontStyle: "italic" }}>{"замовлення?"}</em>
          </h2>
          <div className="grid-n7-cards" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "40px", textAlign: "center" }}>
            <div>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "48px", fontStyle: "italic", color: "var(--gold-deep)", fontWeight: 300, lineHeight: 1, marginBottom: "16px" }}>{"01"}</div>
              <h4 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "20px", fontWeight: 500, marginBottom: "8px" }}>{"Додайте в кошик"}</h4>
              <p style={{ fontSize: "14px", color: "var(--text)", lineHeight: "1.6" }}>{"Натисніть кнопку та перейдіть до оформлення"}</p>
            </div>
            <div>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "48px", fontStyle: "italic", color: "var(--gold-deep)", fontWeight: 300, lineHeight: 1, marginBottom: "16px" }}>{"02"}</div>
              <h4 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "20px", fontWeight: 500, marginBottom: "8px" }}>{"Вкажіть дані"}</h4>
              <p style={{ fontSize: "14px", color: "var(--text)", lineHeight: "1.6" }}>{"Ім\u0027я, телефон та відділення Нової Пошти"}</p>
            </div>
            <div>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "48px", fontStyle: "italic", color: "var(--gold-deep)", fontWeight: 300, lineHeight: 1, marginBottom: "16px" }}>{"03"}</div>
              <h4 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "20px", fontWeight: 500, marginBottom: "8px" }}>{"Оплата при отриманні"}</h4>
              <p style={{ fontSize: "14px", color: "var(--text)", lineHeight: "1.6" }}>{"Перевірте товар на пошті та оплатіть після огляду"}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* SECTION 3: Full description */}
      {/* ============================================ */}
      {product.description && (
        <section style={{ padding: "80px 0", background: "var(--bg)" }}>
          <div className="container-pad" style={{ maxWidth: "900px", margin: "0 auto", padding: "0 48px" }}>
            <h2 className="title-section" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 400, marginBottom: "32px" }}>
              {"Детальний "}<em style={{ color: "var(--gold-deep)", fontStyle: "italic" }}>{"опис"}</em>
            </h2>
            <div style={{ fontSize: "15px", color: "var(--text)", lineHeight: "1.85" }}>
              <PortableText value={product.description} />
            </div>
          </div>
        </section>
      )}

      {/* ============================================ */}
      {/* SECTION 4: Specs */}
      {/* ============================================ */}
      {product.specs && product.specs.length > 0 && (
        <section style={{ padding: "80px 0", borderTop: "1px solid var(--line)" }}>
          <div className="container-pad grid-specs" style={{ maxWidth: "1320px", margin: "0 auto", padding: "0 48px" }}>
            <div>
              <h2 className="title-section" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 400, marginBottom: "20px" }}>
                {"Характеристики"}
              </h2>
            </div>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <tbody>
                {product.specs.map((spec: { label: string; value: string }, i: number) => (
                  <tr key={i} style={{ borderBottom: "1px solid var(--line-soft)", background: i % 2 === 0 ? "var(--bg-card)" : "transparent" }}>
                    <td style={{ padding: "16px 20px", fontSize: "14px", color: "var(--text)", width: "45%" }}>{spec.label}</td>
                    <td style={{ padding: "16px 20px", fontSize: "14px", color: "var(--ink)", fontWeight: 500 }}>{spec.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* ============================================ */}
      {/* SECTION 5: Benefits */}
      {/* ============================================ */}
      {product.benefits && product.benefits.length > 0 && (
        <section style={{ padding: "60px 0", background: "var(--paper)", borderTop: "1px solid var(--line)" }}>
          <div className="container-pad" style={{ maxWidth: "900px", margin: "0 auto", padding: "0 48px" }}>
            <h2 className="title-section" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 400, textAlign: "center", marginBottom: "32px" }}>
              {"Переваги "}<em style={{ color: "var(--gold-deep)", fontStyle: "italic" }}>{"товару"}</em>
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              {product.benefits.map((benefit: string, i: number) => (
                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "12px", padding: "20px", background: "var(--bg-card)", border: "1px solid var(--line-soft)", borderRadius: "8px" }}>
                  <svg width="20" height="20" fill="none" stroke="var(--gold-deep)" strokeWidth="2" viewBox="0 0 24 24" style={{ flexShrink: 0, marginTop: "2px" }}><path d="M20 6 9 17l-5-5" /></svg>
                  <span style={{ fontSize: "14px", color: "var(--ink)", lineHeight: "1.5" }}>{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ============================================ */}
      {/* SECTION 6: Reviews */}
      {/* ============================================ */}
      {allReviews.length > 0 && (
        <section style={{ padding: "80px 0", background: "var(--bg-soft)" }}>
          <div className="container-pad" style={{ maxWidth: "1320px", margin: "0 auto", padding: "0 48px" }}>
            <h2 className="title-section" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 400, marginBottom: "40px" }}>
              {"Відгуки "}<em style={{ color: "var(--gold-deep)", fontStyle: "italic" }}>{"клієнтів"}</em>
              <span style={{ fontSize: "14px", color: "var(--text-dim)", marginLeft: "4px" }}>({allReviews.length} {"відгуків"})</span>
            </h2>
            <ReviewsCarousel reviews={allReviews} />
          </div>
        </section>
      )}

      {/* ============================================ */}
      {/* SECTION 7: CTA repeat */}
      {/* ============================================ */}
      <section style={{ padding: "60px 0", background: "var(--ink)", color: "var(--bg)", textAlign: "center" }}>
        <div className="container-pad" style={{ maxWidth: "700px", margin: "0 auto", padding: "0 48px" }}>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(28px, 4vw, 40px)", fontWeight: 400, marginBottom: "12px" }}>
            {"Замовте "}<em style={{ color: "var(--gold-soft)", fontStyle: "italic" }}>{"зараз"}</em>
          </h2>
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "center", gap: "14px", marginBottom: "20px", flexWrap: "wrap" }}>
            <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "36px", fontWeight: 600 }}>
              {product.price.toLocaleString("uk-UA")} {"₴"}
            </span>
            {product.oldPrice && (
              <span style={{ fontSize: "18px", color: "rgba(245,241,232,.4)", textDecoration: "line-through" }}>
                {product.oldPrice.toLocaleString("uk-UA")} {"₴"}
              </span>
            )}
          </div>
          <AddToCartButton slug={product.slug.current} name={product.name} price={product.price} oldPrice={product.oldPrice} image={mainImageUrl} style="gold" />
        </div>
      </section>

      {/* ============================================ */}
      {/* SECTION 8: Related products */}
      {/* ============================================ */}
      {related && related.length > 0 && (
        <section style={{ padding: "80px 0" }}>
          <div className="container-pad" style={{ maxWidth: "1320px", margin: "0 auto", padding: "0 48px" }}>
            <h2 className="title-section" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 400, marginBottom: "40px" }}>
              {"Вам також "}<em style={{ color: "var(--gold-deep)", fontStyle: "italic" }}>{"сподобається"}</em>
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

function TrustCard({ icon, title, desc }: { icon: string; title: string; desc: string }) {
  return (
    <div style={{ background: "var(--bg-soft)", border: "1px solid var(--line-soft)", padding: "20px 16px", textAlign: "center", borderRadius: "8px" }}>
      <div style={{ fontSize: "24px", marginBottom: "8px" }}>{icon}</div>
      <div style={{ fontSize: "12px", fontWeight: 600, color: "var(--ink)", marginBottom: "4px" }}>{title}</div>
      <div style={{ fontSize: "11px", color: "var(--text-dim)" }}>{desc}</div>
    </div>
  );
}

function WhyCard({ icon, title, desc }: { icon: string; title: string; desc: string }) {
  return (
    <div style={{ padding: "28px 20px" }}>
      <div style={{ fontSize: "28px", marginBottom: "14px" }}>{icon}</div>
      <h4 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "20px", fontWeight: 500, marginBottom: "8px", color: "var(--bg)" }}>{title}</h4>
      <p style={{ fontSize: "13px", color: "rgba(245,241,232,.65)", lineHeight: "1.5" }}>{desc}</p>
    </div>
  );
}
