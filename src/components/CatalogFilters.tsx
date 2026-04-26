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
  subcategory?: { name: string; slug: { current: string }; parentCategory?: { slug: { current: string } } };
}

interface Category { name: string; slug: { current: string }; }
interface Subcategory { name: string; slug: { current: string }; parentCategory: { slug: { current: string } }; }

type SortOption = "newest" | "price-asc" | "price-desc" | "name";
const PAGE_SIZE = 24;

export default function CatalogFilters({ products, categories, subcategories }: { products: Product[]; categories: Category[]; subcategories: Subcategory[] }) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [activeSubcategory, setActiveSubcategory] = useState<string | null>(null);
  const [activeCategoryName, setActiveCategoryName] = useState("");
  const [activeSubcategoryName, setActiveSubcategoryName] = useState("");
  const [sort, setSort] = useState<SortOption>("newest");
  const [onlyInStock, setOnlyInStock] = useState(false);
  const [onlySale, setOnlySale] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const filtered = useMemo(() => {
    let result = [...products];
    if (activeSubcategory) result = result.filter((p) => p.subcategory?.slug?.current === activeSubcategory);
    else if (activeCategory) result = result.filter((p) => p.category?.slug?.current === activeCategory);
    if (onlyInStock) result = result.filter((p) => p.inStock !== false);
    if (onlySale) result = result.filter((p) => p.oldPrice && p.oldPrice > p.price);
    switch (sort) {
      case "price-asc": result.sort((a, b) => a.price - b.price); break;
      case "price-desc": result.sort((a, b) => b.price - a.price); break;
      case "name": result.sort((a, b) => a.name.localeCompare(b.name, "uk")); break;
    }
    return result;
  }, [products, activeCategory, activeSubcategory, sort, onlyInStock, onlySale]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const visible = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const categoryCount = (slug: string) => products.filter((p) => p.category?.slug?.current === slug).length;
  const subcategoryCount = (slug: string) => products.filter((p) => p.subcategory?.slug?.current === slug).length;

  function selectCategory(slug: string | null, name: string) {
    setActiveCategory(slug); setActiveSubcategory(null);
    setActiveCategoryName(name); setActiveSubcategoryName("");
    setCurrentPage(1);
  }
  function selectSubcategory(slug: string, name: string, parentSlug: string, parentName: string) {
    setActiveCategory(parentSlug); setActiveSubcategory(slug);
    setActiveCategoryName(parentName); setActiveSubcategoryName(name);
    setCurrentPage(1);
  }

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
          width: "40px", height: "40px", borderRadius: "4px", border: "1px solid " + (p === currentPage ? "var(--ink)" : "var(--line)"),
          background: p === currentPage ? "var(--ink)" : "transparent",
          color: p === currentPage ? "var(--bg)" : "var(--ink)",
          fontSize: "13px", fontWeight: p === currentPage ? 600 : 400, cursor: "pointer",
          fontFamily: "'Inter', sans-serif",
        }}
      >{p}</button>
    ));
  }

  return (
    <div>
      {/* Categories with dropdowns */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0", marginBottom: "20px", borderBottom: "2px solid var(--ink)" }}>
        <CatTab label="Все" count={products.length} isActive={activeCategory === null}
          onClick={() => selectCategory(null, "")} subcategories={[]} onSubClick={() => {}} />
        {categories.map((cat) => {
          const subs = subcategories.filter(s => s.parentCategory?.slug?.current === cat.slug.current);
          return (
            <CatTab key={cat.slug.current} label={cat.name} count={categoryCount(cat.slug.current)}
              isActive={activeCategory === cat.slug.current}
              onClick={() => selectCategory(cat.slug.current, cat.name)}
              subcategories={subs.map(s => ({ name: s.name, slug: s.slug.current, count: subcategoryCount(s.slug.current) }))}
              onSubClick={(subSlug, subName) => selectSubcategory(subSlug, subName, cat.slug.current, cat.name)}
            />
          );
        })}
      </div>

      {/* Breadcrumb */}
      {(activeCategory || activeSubcategory) && (
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "20px", fontSize: "13px" }}>
          <button onClick={() => selectCategory(null, "")} style={{ background: "none", border: "none", color: "var(--gold-deep)", cursor: "pointer", fontFamily: "'Inter', sans-serif", fontSize: "13px" }}>{"Все товари"}</button>
          {activeCategoryName && (<><span style={{ color: "var(--text-dim)" }}>/</span>
            <button onClick={() => { setActiveSubcategory(null); setActiveSubcategoryName(""); setCurrentPage(1); }} style={{ background: "none", border: "none", color: activeSubcategory ? "var(--gold-deep)" : "var(--ink)", cursor: "pointer", fontFamily: "'Inter', sans-serif", fontSize: "13px", fontWeight: activeSubcategory ? 400 : 600 }}>{activeCategoryName}</button></>)}
          {activeSubcategoryName && (<><span style={{ color: "var(--text-dim)" }}>/</span><span style={{ color: "var(--ink)", fontWeight: 600 }}>{activeSubcategoryName}</span></>)}
          <button onClick={() => selectCategory(null, "")} style={{ marginLeft: "auto", background: "none", border: "none", color: "var(--text-dim)", cursor: "pointer", fontSize: "12px", textDecoration: "underline" }}>{"Скинути"}</button>
        </div>
      )}

      {/* Sort & filters */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px", paddingBottom: "20px", borderBottom: "1px solid var(--line-soft)", flexWrap: "wrap", gap: "16px" }}>
        <div style={{ display: "flex", gap: "16px", alignItems: "center", flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontSize: "12px", color: "var(--text)" }}>{"Сортувати:"}</span>
            <select value={sort} onChange={(e) => { setSort(e.target.value as SortOption); setCurrentPage(1); }} style={{ background: "transparent", border: "none", borderBottom: "1px solid var(--line)", color: "var(--ink)", fontFamily: "'Inter', sans-serif", fontSize: "13px", fontWeight: 500, cursor: "pointer", padding: "6px 24px 6px 4px", outline: "none" }}>
              <option value="newest">{"Новинки"}</option>
              <option value="price-asc">{"Від дешевих"}</option>
              <option value="price-desc">{"Від дорогих"}</option>
              <option value="name">{"За назвою"}</option>
            </select>
          </div>
          <label style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", color: "var(--text)", cursor: "pointer" }}>
            <input type="checkbox" checked={onlyInStock} onChange={(e) => { setOnlyInStock(e.target.checked); setCurrentPage(1); }} style={{ accentColor: "var(--gold-deep)" }} /> {"В наявності"}
          </label>
          <label style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", color: "var(--text)", cursor: "pointer" }}>
            <input type="checkbox" checked={onlySale} onChange={(e) => { setOnlySale(e.target.checked); setCurrentPage(1); }} style={{ accentColor: "var(--gold-deep)" }} /> {"Зі знижкою"}
          </label>
        </div>
        <span style={{ fontSize: "12px", color: "var(--text-dim)" }}>{filtered.length} {"товарів"}</span>
      </div>

      {/* Products */}
      {visible.length > 0 ? (
        <>
          <div className="grid-4">{visible.map((product) => (<ProductCard key={product.slug.current} product={product} />))}</div>
          {/* Pagination */}
          {totalPages > 1 && (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "8px", marginTop: "48px" }}>
              <button onClick={() => { setCurrentPage(p => Math.max(1, p - 1)); window.scrollTo({ top: 0, behavior: "smooth" }); }} disabled={currentPage === 1}
                style={{ width: "40px", height: "40px", borderRadius: "4px", border: "1px solid var(--line)", background: "transparent", color: currentPage === 1 ? "var(--line)" : "var(--ink)", cursor: currentPage === 1 ? "default" : "pointer", fontSize: "16px" }}>{"‹"}</button>
              {renderPageButtons()}
              <button onClick={() => { setCurrentPage(p => Math.min(totalPages, p + 1)); window.scrollTo({ top: 0, behavior: "smooth" }); }} disabled={currentPage === totalPages}
                style={{ width: "40px", height: "40px", borderRadius: "4px", border: "1px solid var(--line)", background: "transparent", color: currentPage === totalPages ? "var(--line)" : "var(--ink)", cursor: currentPage === totalPages ? "default" : "pointer", fontSize: "16px" }}>{"›"}</button>
            </div>
          )}
        </>
      ) : (
        <div style={{ textAlign: "center", padding: "80px 0", color: "var(--text-dim)" }}>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "28px", marginBottom: "12px", color: "var(--ink)" }}>{"Товарів не знайдено"}</div>
          <p style={{ fontSize: "14px" }}>
            <button onClick={() => { selectCategory(null, ""); setOnlyInStock(false); setOnlySale(false); }} style={{ background: "none", border: "none", borderBottom: "1px solid var(--gold-deep)", color: "var(--gold-deep)", cursor: "pointer", fontSize: "14px", fontFamily: "inherit", padding: 0 }}>{"Скинути всі фільтри"}</button>
          </p>
        </div>
      )}
    </div>
  );
}

function CatTab({ label, count, isActive, onClick, subcategories, onSubClick }: {
  label: string; count: number; isActive: boolean; onClick: () => void;
  subcategories: { name: string; slug: string; count: number }[];
  onSubClick: (slug: string, name: string) => void;
}) {
  const [hover, setHover] = useState(false);
  const showDropdown = hover && subcategories.length > 0;
  return (
    <div style={{ position: "relative" }} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
      <button onClick={onClick} style={{
        padding: "14px 20px", background: isActive ? "var(--ink)" : hover ? "var(--paper)" : "transparent",
        color: isActive ? "var(--bg)" : "var(--ink)", border: "none", fontSize: "11px", letterSpacing: ".15em",
        textTransform: "uppercase", fontWeight: isActive ? 600 : 500, cursor: "pointer",
        fontFamily: "'Inter', sans-serif", whiteSpace: "nowrap", display: "flex", alignItems: "center", gap: "6px",
      }}>
        {label} <span style={{ fontSize: "10px", color: isActive ? "var(--gold-soft)" : "var(--text-dim)" }}>({count})</span>
        {subcategories.length > 0 && (
          <svg width="10" height="10" fill="none" stroke={isActive ? "var(--gold-soft)" : "var(--text-dim)"} strokeWidth="2" viewBox="0 0 24 24" style={{ transform: showDropdown ? "rotate(180deg)" : "none" }}><path d="M6 9l6 6 6-6"/></svg>
        )}
      </button>
      {showDropdown && (
        <div style={{ position: "absolute", top: "100%", left: "0", background: "var(--bg-card)", border: "1px solid var(--line-soft)", borderRadius: "0 0 8px 8px", boxShadow: "0 8px 24px rgba(26,22,18,.12)", zIndex: 50, minWidth: "220px", overflow: "hidden" }}>
          <button onClick={(e) => { e.stopPropagation(); onClick(); setHover(false); }}
            style={{ display: "flex", justifyContent: "space-between", width: "100%", padding: "12px 18px", background: "transparent", border: "none", borderBottom: "1px solid var(--line-soft)", cursor: "pointer", fontFamily: "'Inter', sans-serif", fontSize: "13px", color: "var(--gold-deep)", textAlign: "left", fontWeight: 600 }}>
            <span>{"Всі товари"}</span><span style={{ fontSize: "11px", color: "var(--text-dim)" }}>{count}</span>
          </button>
          {subcategories.filter(s => s.count > 0).map((sub) => (
            <button key={sub.slug} onClick={(e) => { e.stopPropagation(); onSubClick(sub.slug, sub.name); setHover(false); }}
              style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%", padding: "12px 18px", background: "transparent", border: "none", borderBottom: "1px solid var(--line-soft)", cursor: "pointer", fontFamily: "'Inter', sans-serif", fontSize: "13px", color: "var(--ink)", textAlign: "left" }}
              onMouseEnter={(e) => { (e.target as HTMLElement).style.background = "var(--paper)"; }}
              onMouseLeave={(e) => { (e.target as HTMLElement).style.background = "transparent"; }}>
              <span>{sub.name}</span><span style={{ fontSize: "11px", color: "var(--text-dim)" }}>{sub.count}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
