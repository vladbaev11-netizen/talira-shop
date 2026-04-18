import { client } from "@/sanity/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import Link from "next/link";
import CatalogFilters from "@/components/CatalogFilters";

async function getProducts() {
  return client.fetch(`
    *[_type == "product"] | order(_createdAt desc) {
      name,
      slug,
      price,
      oldPrice,
      badge,
      inStock,
      mainImage,
      "category": category->{ name, slug }
    }
  `);
}

async function getCategories() {
  return client.fetch(`
    *[_type == "category"] | order(order asc) {
      name,
      slug
    }
  `);
}

export const revalidate = 60;

export const metadata = {
  title: "Каталог — TALIRA",
  description: "Повний каталог преміум-товарів для дому, краси та здоров'я",
};

export default async function CatalogPage() {
  const [products, categories] = await Promise.all([
    getProducts(),
    getCategories(),
  ]);

  return (
    <>
      <Header />

      {/* Hero */}
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
        <Link href="/" style={{ color: "var(--text)" }}>Головна</Link>
        <span style={{ margin: "0 12px" }}>/</span>
        <span style={{ color: "var(--ink)" }}>Каталог</span>
      </div>

      <section
        style={{
          padding: "20px 0 40px",
          borderBottom: "1px solid var(--line)",
        }}
      >
        <div style={{ maxWidth: "1320px", margin: "0 auto", padding: "0 48px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "end",
              gap: "40px",
              flexWrap: "wrap",
            }}
          >
            <div>
              <span
                style={{
                  color: "var(--gold-deep)",
                  fontSize: "11px",
                  letterSpacing: ".3em",
                  textTransform: "uppercase",
                  fontWeight: 500,
                  display: "block",
                  marginBottom: "12px",
                }}
              >
                — Весь каталог —
              </span>
              <h1
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: "clamp(40px, 5vw, 64px)",
                  lineHeight: 1,
                  fontWeight: 400,
                  letterSpacing: "-.01em",
                }}
              >
                Каталог{" "}
                <em
                  style={{
                    color: "var(--gold-deep)",
                    fontStyle: "italic",
                    fontWeight: 300,
                  }}
                >
                  колекції
                </em>
              </h1>
            </div>
            <div
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "14px",
                color: "var(--text)",
                fontStyle: "italic",
              }}
            >
              <strong
                style={{
                  fontStyle: "normal",
                  fontWeight: 500,
                  color: "var(--gold-deep)",
                  fontSize: "16px",
                }}
              >
                {products.length}
              </strong>{" "}
              товарів у каталозі
            </div>
          </div>
        </div>
      </section>

      {/* Catalog with filters */}
      <section style={{ padding: "40px 0 80px" }}>
        <div style={{ maxWidth: "1320px", margin: "0 auto", padding: "0 48px" }}>
          <CatalogFilters
            products={JSON.parse(JSON.stringify(products))}
            categories={JSON.parse(JSON.stringify(categories))}
          />
        </div>
      </section>

      <Footer />
    </>
  );
}
