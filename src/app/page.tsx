import { client } from "@/sanity/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import HeroSlider from "@/components/HeroSlider";
import Link from "next/link";
import Image from "next/image";
import { urlFor } from "@/sanity/image";

async function getProducts() {
  return client.fetch(`
    *[_type == "product"] | order(_createdAt desc) [0...12] {
      name, slug, price, oldPrice, badge, mainImage,
      "category": category->{ name }
    }
  `);
}

async function getCategories() {
  return client.fetch(`
    *[_type == "category"] | order(order asc) {
      name, slug, description, image
    }
  `);
}

export const revalidate = 60;

export default async function HomePage() {
  const [products, categories] = await Promise.all([getProducts(), getCategories()]);

  return (
    <>
      <Header />

      {/* HERO */}
      <section style={{ padding: "72px 0", borderBottom: "1px solid var(--line)" }}>
        <div className="container-pad grid-hero" style={{ maxWidth: "1320px", margin: "0 auto", padding: "0 48px" }}>
          <div style={{ padding: "32px 0", display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <div style={{ fontSize: "10px", letterSpacing: ".25em", textTransform: "uppercase", color: "var(--gold-deep)", fontWeight: 500, marginBottom: "16px" }}>
              Нова колекція · 2026
            </div>
            <h1 className="title-hero" style={{ fontFamily: "'Cormorant Garamond', serif", lineHeight: "1", fontWeight: 400, letterSpacing: "-.01em", marginBottom: "24px" }}>
              Преміум-товари для дому,{" "}
              <em style={{ color: "var(--gold-deep)", fontStyle: "italic", fontWeight: 300 }}>краси та здоров&apos;я</em>
            </h1>
            <div style={{ display: "flex", gap: "14px", alignItems: "center", marginBottom: "24px" }}>
              <Link href="/catalog" style={{ background: "var(--ink)", color: "var(--bg)", padding: "14px 28px", fontSize: "10px", fontWeight: 500, letterSpacing: ".22em", textTransform: "uppercase", display: "inline-flex", alignItems: "center", gap: "8px", borderRadius: "4px" }}>
                Каталог
                <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
              </Link>
              <span style={{ fontSize: "12px", color: "var(--text-dim)" }}>{products.length} товарів</span>
            </div>

            {/* Trust checkmarks */}
            <div style={{ paddingTop: "16px", borderTop: "1px solid var(--line-soft)" }}>
              <div style={{ display: "flex", gap: "20px", flexWrap: "wrap", marginBottom: "10px" }}>
                <MiniTrust text="Оплата при отриманні" />
                <MiniTrust text="Доставка 1–3 дні" />
                <MiniTrust text="Гарантія 14 днів" />
              </div>
              <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
                <MiniTrust text="Меблі з підсвіткою" />
                <MiniTrust text="Б'юті та догляд" />
                <MiniTrust text="Електроніка для дому" />
              </div>
            </div>
          </div>

          <HeroSlider products={products.slice(0, 5)} />
        </div>
      </section>

      {/* CATEGORIES */}
      {categories.length > 0 && (
        <section style={{ padding: "40px 0", borderBottom: "1px solid var(--line)" }}>
          <div className="container-pad" style={{ maxWidth: "1320px", margin: "0 auto", padding: "0 48px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "26px", fontWeight: 400 }}>Категорії</h2>
              <span style={{ fontSize: "11px", letterSpacing: ".18em", textTransform: "uppercase", color: "var(--text-dim)" }}>{categories.length} колекції</span>
            </div>
            <div className="grid-cats" style={{ display: "grid", gridTemplateColumns: "repeat(" + categories.length + ", 1fr)", gap: "12px" }}>
              {categories.map((cat: any, i: number) => (
                <Link key={cat.slug?.current || i} href={"/catalog?category=" + (cat.slug?.current || "")}
                  style={{ position: "relative", aspectRatio: "16/9", overflow: "hidden", background: "linear-gradient(135deg, #e8dcc0 0%, #cdb88e 100%)", display: "block", borderRadius: "4px" }}
                >
                  {cat.image && cat.image.asset && (
                    <Image src={urlFor(cat.image).width(400).height(225).url()} alt={cat.name} fill style={{ objectFit: "cover" }} sizes="25vw" />
                  )}
                  <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "16px", background: "linear-gradient(180deg, transparent 0%, rgba(26,22,18,.75) 100%)", color: "var(--bg)" }}>
                    <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "18px", fontWeight: 400, lineHeight: "1.2" }}>{cat.name}</h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* PRODUCTS */}
      {products.length > 0 && (
        <section style={{ padding: "48px 0 72px" }}>
          <div className="container-pad" style={{ maxWidth: "1320px", margin: "0 auto", padding: "0 48px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "28px", paddingBottom: "16px", borderBottom: "1px solid var(--line-soft)" }}>
              <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "26px", fontWeight: 400 }}>Популярні товари</h2>
              <span style={{ fontSize: "12px", color: "var(--text-dim)" }}>{products.length} товарів</span>
            </div>
            <div className="grid-4">
              {products.map((product: any) => (
                <ProductCard key={product.slug.current} product={product} />
              ))}
            </div>
            <div style={{ textAlign: "center", marginTop: "40px" }}>
              <Link href="/catalog" style={{ display: "inline-flex", alignItems: "center", gap: "10px", padding: "14px 36px", border: "1px solid var(--ink)", color: "var(--ink)", fontSize: "11px", fontWeight: 500, letterSpacing: ".22em", textTransform: "uppercase", borderRadius: "4px" }}>
                Весь каталог
                <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* TRUST */}
      <section style={{ background: "var(--ink)", color: "var(--bg)", padding: "48px 0" }}>
        <div className="container-pad grid-trust" style={{ maxWidth: "1320px", margin: "0 auto", padding: "0 48px" }}>
          <TrustBlock num="12K+" label="Задоволених клієнтів" />
          <TrustBlock num="4.9" label="Середній рейтинг" />
          <TrustBlock num="1–3 дні" label="Доставка по Україні" />
          <TrustBlock num="14 днів" label="Повернення товару" />
        </div>
      </section>

      {/* FEATURES */}
      <section style={{ background: "var(--bg-soft)", padding: "60px 0" }}>
        <div className="container-pad grid-features" style={{ maxWidth: "1320px", margin: "0 auto", padding: "0 48px" }}>
          <Feature icon="📦" title="Оплата при отриманні" desc="Після перевірки товару" border />
          <Feature icon="🚚" title="Нова Пошта" desc="По всій Україні 1–3 дні" border />
          <Feature icon="✅" title="Гарантія якості" desc="Перевіряємо перед відправкою" border />
          <Feature icon="💬" title="Підтримка 24/7" desc="Telegram та Instagram" />
        </div>
      </section>

      <Footer />
    </>
  );
}

function MiniTrust({ text }: { text: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "11px", color: "var(--text)" }}>
      <svg width="12" height="12" fill="none" stroke="var(--gold-deep)" strokeWidth="2" viewBox="0 0 24 24"><path d="M20 6 9 17l-5-5" /></svg>
      {text}
    </div>
  );
}

function TrustBlock({ num, label }: { num: string; label: string }) {
  return (
    <div>
      <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "40px", fontWeight: 300, fontStyle: "italic", color: "var(--gold-soft)", lineHeight: 1, marginBottom: "8px" }}>{num}</div>
      <div style={{ fontSize: "10px", letterSpacing: ".2em", textTransform: "uppercase", color: "rgba(245,241,232,.7)" }}>{label}</div>
    </div>
  );
}

function Feature({ icon, title, desc, border }: { icon: string; title: string; desc: string; border?: boolean }) {
  return (
    <div className={border ? "feature-item" : ""} style={!border ? { textAlign: "center", padding: "0 24px" } : undefined}>
      <div style={{ fontSize: "24px", marginBottom: "12px", textAlign: "center" }}>{icon}</div>
      <h4 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "18px", fontWeight: 500, marginBottom: "6px", textAlign: "center" }}>{title}</h4>
      <p style={{ fontSize: "12px", color: "var(--text)", lineHeight: "1.5", textAlign: "center" }}>{desc}</p>
    </div>
  );
}
