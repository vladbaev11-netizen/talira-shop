"use client";

import { useState, useMemo } from "react";
import ProductCard from "@/components/ProductCard";

interface Product {
  name: string;
  slug: { current: string };
  price: number;
  oldPrice?: number;
  badge?: string;
  inStock?: boolean;
  mainImage: any;
  category?: { name: string; slug: { current: string } };
}

interface Category {
  name: string;
  slug: { current: string };
}

type SortOption = "newest" | "price-asc" | "price-desc" | "name";

const PAGE_SIZE = 24;

export default function CatalogFilters({ products, categories }: { products: Product[]; categories: Category[] }) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [sort, setSort] = useState<SortOption>("newest");
  const [onlyInStock, setOnlyInStock] = useState(false);
  const [onlySale, setOnlySale] = useState(false);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const filtered = useMemo(() => {
    let result = [...products];
    if (activeCategory) result = result.filter((p) => p.category?.slug?.current === activeCategory);
    if (onlyInStock) result = result.filter((p) => p.inStock !== false);
    if (onlySale) result = result.filter((p) => p.oldPrice && p.oldPrice > p.price);
    switch (sort) {
      case "price-asc": result.sort((a, b) => a.price - b.price); break;
      case "price-desc": result.sort((a, b) => b.price - a.price); break;
      case "name": result.sort((a, b) => a.name.localeCompare(b.name, "uk")); break;
    }
    return result;
  }, [products, activeCategory, sort, onlyInStock, onlySale]);

  // Reset visible count when filters change
  const visible = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  const categoryCount = (slug: string) => products.filter((p) => p.category?.slug?.current === slug).length;

  function handleCategoryChange(slug: string | null) {
    setActiveCategory(slug);
    setVisibleCount(PAGE_SIZE);
  }

  function handleFilterChange() {
    setVisibleCount(PAGE_SIZE);
  }

  const tabStyle = (isActive: boolean): React.CSSProperties => ({
    padding: "10px 20px",
    background: isActive ? "var(--ink)" : "transparent",
    color: isActive ? "var(--bg)" : "var(--ink)",
    border: isActive ? "1px solid var(--ink)" : "1px solid var(--line)",
    fontSize: "11px",
    letterSpacing: ".18em",
    textTransform: "uppercase",
    fontWeight: 500,
    cursor: "pointer",
    transition: "all .2s",
    fontFamily: "'Inter', sans-serif",
    whiteSpace: "nowrap",
  });

  return (
    <div>
      <div className="filter-tabs" style={{ marginBottom: "24px" }}>
        <button onClick={() => handleCategoryChange(null)} style={tabStyle(activeCategory === null)}>{"Все"} ({products.length})</button>
        {categories.map((cat) => (
          <button key={cat.slug.current} onClick={() => handleCategoryChange(activeCategory === cat.slug.current ? null : cat.slug.current)} style={tabStyle(activeCategory === cat.slug.current)}>
            {cat.name} ({categoryCount(cat.slug.current)})
          </button>
        ))}
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px", paddingBottom: "20px", borderBottom: "1px solid var(--line-soft)", flexWrap: "wrap", gap: "16px" }}>
        <div style={{ display: "flex", gap: "16px", alignItems: "center", flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontSize: "12px", color: "var(--text)" }}>{"Сортувати:"}</span>
            <select value={sort} onChange={(e) => { setSort(e.target.value as SortOption); handleFilterChange(); }} style={{ background: "transparent", border: "none", borderBottom: "1px solid var(--line)", color: "var(--ink)", fontFamily: "'Inter', sans-serif", fontSize: "13px", fontWeight: 500, cursor: "pointer", padding: "6px 24px 6px 4px", outline: "none" }}>
              <option value="newest">{"Новинки"}</option>
              <option value="price-asc">{"Від дешевих"}</option>
              <option value="price-desc">{"Від дорогих"}</option>
              <option value="name">{"За назвою"}</option>
            </select>
          </div>
          <label style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", color: "var(--text)", cursor: "pointer" }}>
            <input type="checkbox" checked={onlyInStock} onChange={(e) => { setOnlyInStock(e.target.checked); handleFilterChange(); }} style={{ accentColor: "var(--gold-deep)" }} /> {"В наявності"}
          </label>
          <label style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", color: "var(--text)", cursor: "pointer" }}>
            <input type="checkbox" checked={onlySale} onChange={(e) => { setOnlySale(e.target.checked); handleFilterChange(); }} style={{ accentColor: "var(--gold-deep)" }} /> {"Зі знижкою"}
          </label>
        </div>
        <span style={{ fontSize: "12px", color: "var(--text-dim)" }}>{filtered.length} {"товарів"}</span>
      </div>

      {visible.length > 0 ? (
        <>
          <div className="grid-4">{visible.map((product) => (<ProductCard key={product.slug.current} product={product} />))}</div>
          
          {hasMore && (
            <div style={{ textAlign: "center", marginTop: "48px" }}>
              <button
                onClick={() => setVisibleCount((prev) => prev + PAGE_SIZE)}
                style={{
                  padding: "16px 48px", border: "1px solid var(--ink)", background: "transparent",
                  color: "var(--ink)", fontSize: "12px", fontWeight: 500, letterSpacing: ".2em",
                  textTransform: "uppercase", cursor: "pointer", borderRadius: "4px",
                  fontFamily: "'Inter', sans-serif", display: "inline-flex", alignItems: "center", gap: "10px",
                }}
              >
                {"Завантажити ще"}
                <span style={{ fontSize: "11px", color: "var(--text-dim)" }}>
                  ({Math.min(PAGE_SIZE, filtered.length - visibleCount)} {"з"} {filtered.length - visibleCount})
                </span>
              </button>
            </div>
          )}
        </>
      ) : (
        <div style={{ textAlign: "center", padding: "80px 0", color: "var(--text-dim)" }}>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "28px", marginBottom: "12px", color: "var(--ink)" }}>{"Товарів не знайдено"}</div>
          <p style={{ fontSize: "14px" }}>
            {"Спробуйте змінити фільтри або "}
            <button onClick={() => { setActiveCategory(null); setOnlyInStock(false); setOnlySale(false); setVisibleCount(PAGE_SIZE); }} style={{ background: "none", border: "none", borderBottom: "1px solid var(--gold-deep)", color: "var(--gold-deep)", cursor: "pointer", fontSize: "14px", fontFamily: "inherit", padding: 0 }}>
              {"скинути всі фільтри"}
            </button>
          </p>
        </div>
      )}
    </div>
  );
}
