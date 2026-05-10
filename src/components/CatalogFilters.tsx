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
  externalImages?: string[];
  category?: { name: string; slug: { current: string } };
  subcategory?: { name: string; slug: { current: string }; parentCategory?: { slug: { current: string } } };
}

interface Category { name: string; slug: { current: string }; }
interface Subcategory { name: string; slug: { current: string }; parentCategory: { slug: { current: string } }; }

type SortOption = "newest" | "price-asc" | "price-desc" | "name";
const PAGE_SIZE = 24;

export default function CatalogFilters({ products, categories, subcategories }: { products: Product[]; categories: Category[]; subcategories: Subcategory[] }) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [activeSubcategory, setActiveSubcategory] = useState<string | null>(null);
  const [sort, setSort] = useState<SortOption>("newest");
  const [onlyInStock, setOnlyInStock] = useState(false);
  const [onlySale, setOnlySale] = useState(false);
  const [onlyHit, setOnlyHit] = useState(false);
  const [onlyNew, setOnlyNew] = useState(false);
  const [priceFrom, setPriceFrom] = useState("");
  const [priceTo, setPriceTo] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const minPrice = Math.min(...products.map(p => p.price));
  const maxPrice = Math.max(...products.map(p => p.price));

  const filtered = useMemo(() => {
    let result = [...products];
    if (activeSubcategory) result = result.filter((p) => p.subcategory?.slug?.current === activeSubcategory);
    else if (activeCategory) result = result.filter((p) => p.category?.slug?.current === activeCategory);
    if (onlyInStock) result = result.filter((p) => p.inStock !== false);
    if (onlySale) result = result.filter((p) => p.oldPrice && p.oldPrice > p.price);
    if (onlyHit) result = result.filter((p) => p.badge === "hit");
    if (onlyNew) result = result.filter((p) => p.badge === "new");
    
    const minP = priceFrom ? parseInt(priceFrom) : 0;
    const maxP = priceTo ? parseInt(priceTo) : Infinity;
    if (minP > 0 || maxP < Infinity) {
      result = result.filter((p) => p.price >= minP && p.price <= maxP);
    }
    
    switch (sort) {
      case "price-asc": result.sort((a, b) => a.price - b.price); break;
      case "price-desc": result.sort((a, b) => b.price - a.price); break;
      case "name": result.sort((a, b) => a.name.localeCompare(b.name, "uk")); break;
    }
    return result;
  }, [products, activeCategory, activeSubcategory, sort, onlyInStock, onlySale, onlyHit, onlyNew, priceFrom, priceTo]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const visible = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const categoryCount = (slug: string) => products.filter((p) => p.category?.slug?.current === slug).length;
  const subcategoryCount = (slug: string) => products.filter((p) => p.subcategory?.slug?.current === slug).length;

  function toggleCategory(slug: string) {
    const newSet = new Set(expandedCategories);
    if (newSet.has(slug)) newSet.delete(slug);
    else newSet.add(slug);
    setExpandedCategories(newSet);
  }

  function selectCategory(slug: string | null) {
    setActiveCategory(slug);
    setActiveSubcategory(null);
    setCurrentPage(1);
    if (slug) setExpandedCategories(new Set([slug]));
  }

  function selectSubcategory(slug: string, parentSlug: string) {
    setActiveCategory(parentSlug);
    setActiveSubcategory(slug);
    setCurrentPage(1);
    setExpandedCategories(new Set([parentSlug]));
  }

  function resetFilters() {
    setActiveCategory(null);
    setActiveSubcategory(null);
    setOnlyInStock(false);
    setOnlySale(false);
    setOnlyHit(false);
    setOnlyNew(false);
    setPriceFrom("");
    setPriceTo("");
    setCurrentPage(1);
  }

  const activeFiltersCount = [onlyInStock, onlySale, onlyHit, onlyNew, priceFrom, priceTo, activeCategory].filter(Boolean).length;

  function renderPageButtons() {
    const pages = [];
    const maxVisible = 7;
    let start = Math.max(1, currentPage - 3);
    let end = Math.min(totalPages, start + maxVisible - 1);
    if (end - start < maxVisible - 1) start = Math.max(1, end - maxVisible + 1);

    if (start > 1) { pages.push(1); if (start > 2) pages.push(-1); }
    for (let i = start; i <= end; i++) pages.push(i);
    if (end < totalPages) { if (end < totalPages - 1) pages.push(-1); pages.push(totalPages); }

    return pages.map((p, i) => p === -1 ? (
      <span key={"dot" + i} style={{ padding: "8px 4px", color: "var(--text-dim)" }}>...</span>
    ) : (
      <button key={p} onClick={() => { setCurrentPage(p); window.scrollTo({ top: 0, behavior: "smooth" }); }}
        style={{
          width: "40px", height: "40px", borderRadius: "4px",
          border: "1px solid " + (p === currentPage ? "var(--ink)" : "var(--line)"),
          background: p === currentPage ? "var(--ink)" : "transparent",
          color: p === currentPage ? "var(--bg)" : "var(--ink)",
          fontSize: "13px", fontWeight: p === currentPage ? 600 : 400, cursor: "pointer",
        }}
      >{p}</button>
    ));
  }

  const sidebarContent = (
    <div>
      {/* Reset button */}
      {activeFiltersCount > 0 && (
        <button onClick={resetFilters} style={{ width: "100%", padding: "12px", background: "var(--paper)", border: "1px solid var(--line)", borderRadius: "6px", color: "var(--ink)", fontSize: "13px", fontWeight: 500, cursor: "pointer", marginBottom: "20px", fontFamily: "'Inter', sans-serif" }}>
          ✕ Скинути всі фільтри ({activeFiltersCount})
        </button>
      )}

      {/* Categories */}
      <div style={{ marginBottom: "24px" }}>
        <h3 style={{ fontSize: "12px", letterSpacing: ".2em", textTransform: "uppercase", color: "var(--gold-deep)", marginBottom: "12px", fontWeight: 600 }}>Категорії</h3>
        <div>
          <button onClick={() => selectCategory(null)} style={{ width: "100%", padding: "10px 12px", background: activeCategory === null ? "var(--paper)" : "transparent", border: "none", borderBottom: "1px solid var(--line-soft)", textAlign: "left", cursor: "pointer", fontSize: "14px", fontWeight: activeCategory === null ? 600 : 400, color: activeCategory === null ? "var(--gold-deep)" : "var(--ink)", fontFamily: "'Inter', sans-serif", display: "flex", justifyContent: "space-between" }}>
            <span>Всі товари</span><span style={{ fontSize: "12px", color: "var(--text-dim)" }}>{products.length}</span>
          </button>
          {categories.map((cat) => {
            const subs = subcategories.filter(s => s.parentCategory?.slug?.current === cat.slug.current && subcategoryCount(s.slug.current) > 0);
            const isExpanded = expandedCategories.has(cat.slug.current);
            const isActive = activeCategory === cat.slug.current && !activeSubcategory;
            return (
              <div key={cat.slug.current}>
                <div style={{ display: "flex", alignItems: "center", borderBottom: "1px solid var(--line-soft)", background: isActive ? "var(--paper)" : "transparent" }}>
                  <button onClick={() => selectCategory(cat.slug.current)} style={{ flex: 1, padding: "10px 12px", background: "none", border: "none", textAlign: "left", cursor: "pointer", fontSize: "14px", fontWeight: isActive ? 600 : 400, color: isActive ? "var(--gold-deep)" : "var(--ink)", fontFamily: "'Inter', sans-serif", display: "flex", justifyContent: "space-between", alignItems: "center", wordBreak: "break-word", overflowWrap: "break-word" }}>
                    <span style={{ flex: 1, minWidth: 0 }}>{cat.name}</span><span style={{ fontSize: "12px", color: "var(--text-dim)", flexShrink: 0, marginLeft: "8px" }}>{categoryCount(cat.slug.current)}</span>
                  </button>
                  {subs.length > 0 && (
                    <button onClick={() => toggleCategory(cat.slug.current)} style={{ padding: "10px 12px", background: "none", border: "none", cursor: "pointer", color: "var(--text-dim)" }}>
                      <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={{ transform: isExpanded ? "rotate(180deg)" : "none", transition: "transform .2s" }}><path d="M6 9l6 6 6-6"/></svg>
                    </button>
                  )}
                </div>
                {isExpanded && subs.length > 0 && (
                  <div style={{ background: "var(--bg-soft)", borderBottom: "1px solid var(--line-soft)" }}>
                    {subs.map((sub) => {
                      const isSubActive = activeSubcategory === sub.slug.current;
                      return (
                        <button key={sub.slug.current} onClick={() => selectSubcategory(sub.slug.current, cat.slug.current)} style={{ width: "100%", padding: "8px 12px 8px 28px", background: isSubActive ? "var(--bg-card)" : "transparent", border: "none", textAlign: "left", cursor: "pointer", fontSize: "13px", fontWeight: isSubActive ? 600 : 400, color: isSubActive ? "var(--gold-deep)" : "var(--ink)", fontFamily: "'Inter', sans-serif", display: "flex", justifyContent: "space-between" }}>
                          <span>{sub.name}</span><span style={{ fontSize: "11px", color: "var(--text-dim)" }}>{subcategoryCount(sub.slug.current)}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Price filter */}
      <div style={{ marginBottom: "24px", paddingBottom: "24px", borderBottom: "1px solid var(--line-soft)" }}>
        <h3 style={{ fontSize: "12px", letterSpacing: ".2em", textTransform: "uppercase", color: "var(--gold-deep)", marginBottom: "12px", fontWeight: 600 }}>Ціна, ₴</h3>
        <div style={{ display: "flex", gap: "8px", marginBottom: "8px" }}>
          <input type="number" placeholder={"від " + minPrice} value={priceFrom} onChange={(e) => { setPriceFrom(e.target.value); setCurrentPage(1); }} style={{ flex: 1, padding: "10px 12px", border: "1px solid var(--line)", borderRadius: "6px", fontSize: "13px", fontFamily: "'Inter', sans-serif", outline: "none" }} />
          <input type="number" placeholder={"до " + maxPrice} value={priceTo} onChange={(e) => { setPriceTo(e.target.value); setCurrentPage(1); }} style={{ flex: 1, padding: "10px 12px", border: "1px solid var(--line)", borderRadius: "6px", fontSize: "13px", fontFamily: "'Inter', sans-serif", outline: "none" }} />
        </div>
      </div>

      {/* Checkboxes */}
      <div style={{ marginBottom: "24px" }}>
        <h3 style={{ fontSize: "12px", letterSpacing: ".2em", textTransform: "uppercase", color: "var(--gold-deep)", marginBottom: "12px", fontWeight: 600 }}>Фільтри</h3>
        <label style={{ display: "flex", alignItems: "center", gap: "10px", padding: "8px 0", cursor: "pointer", fontSize: "14px" }}>
          <input type="checkbox" checked={onlyInStock} onChange={(e) => { setOnlyInStock(e.target.checked); setCurrentPage(1); }} style={{ accentColor: "var(--gold-deep)", width: "18px", height: "18px" }} />
          <span>В наявності</span>
        </label>
        <label style={{ display: "flex", alignItems: "center", gap: "10px", padding: "8px 0", cursor: "pointer", fontSize: "14px" }}>
          <input type="checkbox" checked={onlySale} onChange={(e) => { setOnlySale(e.target.checked); setCurrentPage(1); }} style={{ accentColor: "var(--gold-deep)", width: "18px", height: "18px" }} />
          <span>Зі знижкою</span>
        </label>
        <label style={{ display: "flex", alignItems: "center", gap: "10px", padding: "8px 0", cursor: "pointer", fontSize: "14px" }}>
          <input type="checkbox" checked={onlyHit} onChange={(e) => { setOnlyHit(e.target.checked); setCurrentPage(1); }} style={{ accentColor: "var(--gold-deep)", width: "18px", height: "18px" }} />
          <span>Хіт</span>
        </label>
        <label style={{ display: "flex", alignItems: "center", gap: "10px", padding: "8px 0", cursor: "pointer", fontSize: "14px" }}>
          <input type="checkbox" checked={onlyNew} onChange={(e) => { setOnlyNew(e.target.checked); setCurrentPage(1); }} style={{ accentColor: "var(--gold-deep)", width: "18px", height: "18px" }} />
          <span>Новинка</span>
        </label>
      </div>
    </div>
  );

  return (
    <>
      <style>{`
        .catalog-grid { display: grid; grid-template-columns: 280px 1fr; gap: 40px; }
        @media (max-width: 968px) { .catalog-grid { grid-template-columns: 1fr; } .sidebar-desktop { display: none !important; } }
        @media (min-width: 969px) { .mobile-filters-btn { display: none !important; } }
      `}</style>

      {/* Mobile filters button */}
      <button className="mobile-filters-btn" onClick={() => setMobileFiltersOpen(true)} style={{ width: "100%", padding: "14px", background: "var(--ink)", color: "var(--bg)", border: "none", borderRadius: "6px", fontSize: "13px", fontWeight: 600, letterSpacing: ".1em", textTransform: "uppercase", cursor: "pointer", marginBottom: "20px", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
        <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 6h18M7 12h10M10 18h4"/></svg>
        Фільтри {activeFiltersCount > 0 && `(${activeFiltersCount})`}
      </button>

      <div className="catalog-grid">
        {/* Desktop sidebar */}
        <div className="sidebar-desktop" style={{ position: "sticky", top: "100px", alignSelf: "start", maxHeight: "calc(100vh - 120px)", overflowY: "auto", overflowX: "hidden" }}>
          {sidebarContent}
        </div>

        {/* Mobile sidebar */}
        {mobileFiltersOpen && (
          <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,.5)", zIndex: 1000 }} onClick={() => setMobileFiltersOpen(false)}>
            <div onClick={(e) => e.stopPropagation()} style={{ position: "absolute", top: 0, left: 0, bottom: 0, width: "85%", maxWidth: "320px", background: "var(--bg)", padding: "20px", overflowY: "auto", boxShadow: "4px 0 24px rgba(0,0,0,.2)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                <h2 style={{ fontSize: "18px", fontWeight: 600 }}>Фільтри</h2>
                <button onClick={() => setMobileFiltersOpen(false)} style={{ background: "none", border: "none", fontSize: "24px", cursor: "pointer" }}>✕</button>
              </div>
              {sidebarContent}
              <button onClick={() => setMobileFiltersOpen(false)} style={{ width: "100%", padding: "14px", background: "var(--ink)", color: "var(--bg)", border: "none", borderRadius: "6px", fontSize: "13px", fontWeight: 600, cursor: "pointer", marginTop: "20px" }}>
                Показати {filtered.length} товарів
              </button>
            </div>
          </div>
        )}

        {/* Products area */}
        <div>
          {/* Sort bar */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px", paddingBottom: "16px", borderBottom: "1px solid var(--line-soft)", flexWrap: "wrap", gap: "12px" }}>
            <span style={{ fontSize: "14px", color: "var(--text)" }}>
              Знайдено <strong style={{ color: "var(--gold-deep)" }}>{filtered.length}</strong> товарів
            </span>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ fontSize: "13px", color: "var(--text)" }}>Сортування:</span>
              <select value={sort} onChange={(e) => { setSort(e.target.value as SortOption); setCurrentPage(1); }} style={{ padding: "8px 32px 8px 12px", border: "1px solid var(--line)", borderRadius: "6px", background: "var(--bg-card)", fontSize: "13px", fontWeight: 500, cursor: "pointer", outline: "none", fontFamily: "'Inter', sans-serif" }}>
                <option value="newest">Новинки</option>
                <option value="price-asc">Від дешевих</option>
                <option value="price-desc">Від дорогих</option>
                <option value="name">За назвою</option>
              </select>
            </div>
          </div>

          {/* Products */}
          {visible.length > 0 ? (
            <>
              <div className="grid-4">{visible.map((p) => <ProductCard key={p.slug.current} product={p} />)}</div>
              
              {/* Pagination */}
              {totalPages > 1 && (
                <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "8px", marginTop: "48px" }}>
                  <button onClick={() => { setCurrentPage(p => Math.max(1, p - 1)); window.scrollTo({ top: 0, behavior: "smooth" }); }} disabled={currentPage === 1} style={{ width: "40px", height: "40px", borderRadius: "4px", border: "1px solid var(--line)", background: "transparent", color: currentPage === 1 ? "var(--line)" : "var(--ink)", cursor: currentPage === 1 ? "default" : "pointer", fontSize: "16px" }}>‹</button>
                  {renderPageButtons()}
                  <button onClick={() => { setCurrentPage(p => Math.min(totalPages, p + 1)); window.scrollTo({ top: 0, behavior: "smooth" }); }} disabled={currentPage === totalPages} style={{ width: "40px", height: "40px", borderRadius: "4px", border: "1px solid var(--line)", background: "transparent", color: currentPage === totalPages ? "var(--line)" : "var(--ink)", cursor: currentPage === totalPages ? "default" : "pointer", fontSize: "16px" }}>›</button>
                </div>
              )}
            </>
          ) : (
            <div style={{ textAlign: "center", padding: "80px 20px", color: "var(--text-dim)" }}>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "28px", marginBottom: "12px", color: "var(--ink)" }}>Товарів не знайдено</div>
              <p style={{ fontSize: "14px", marginBottom: "16px" }}>Спробуйте змінити фільтри або скинути їх</p>
              <button onClick={resetFilters} style={{ padding: "12px 24px", background: "var(--gold-deep)", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "13px", fontWeight: 600 }}>Скинути фільтри</button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
