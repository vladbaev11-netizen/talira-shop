'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import CatalogFilters from "@/components/CatalogFilters";
import InfiniteScroll from "@/components/InfiniteScroll";

export default function CatalogPage() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);

  const category = searchParams.get('category');
  const search = searchParams.get('search');

  // Загрузка товаров
  useEffect(() => {
    loadProducts(true);
  }, [category, search, searchParams]);

  const loadProducts = async (reset = false) => {
    setLoading(true);
    
    try {
      const params = new URLSearchParams(searchParams.toString());
      params.set('page', reset ? '1' : String(page));
      params.set('limit', '24');

      const response = await fetch(`/api/products?${params.toString()}`);
      const data = await response.json();

      if (reset) {
        setProducts(data.products || []);
        setPage(1);
      } else {
        setProducts(prev => [...prev, ...(data.products || [])]);
      }

      setHasMore(data.hasMore || false);
      setLoading(false);
    } catch (error) {
      console.error('Failed to load products:', error);
      setLoading(false);
    }
  };

  const loadMore = async () => {
    const nextPage = page + 1;
    setPage(nextPage);
    
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', String(nextPage));
    params.set('limit', '24');

    const response = await fetch(`/api/products?${params.toString()}`);
    const data = await response.json();

    setProducts(prev => [...prev, ...(data.products || [])]);
    setHasMore(data.hasMore || false);
  };

  return (
    <>
      <Header />

      <div style={{ padding: "40px 0" }}>
        <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "0 20px" }}>
          {/* Заголовок */}
          <div style={{ marginBottom: "32px" }}>
            <h1 style={{ 
              fontFamily: "'Cormorant Garamond', serif", 
              fontSize: "36px", 
              fontWeight: 400,
              marginBottom: "8px"
            }}>
              {search ? `Пошук: "${search}"` : category ? category : "Каталог колекції"}
            </h1>
            <p style={{ fontSize: "14px", color: "var(--text-dim)" }}>
              Знайдено {products.length} товарів
            </p>
          </div>

          {/* Layout з фільтрами и товарами */}
          <div style={{ 
            display: "grid", 
            gridTemplateColumns: "280px 1fr", 
            gap: "32px" 
          }}>
            {/* Фильтры */}
            <aside>
              <CatalogFilters onFilterChange={() => loadProducts(true)} />
            </aside>

            {/* Товары */}
            <main>
              <InfiniteScroll
                onLoadMore={loadMore}
                hasMore={hasMore}
                loading={loading}
              >
                <div className="products-grid">
                  {products.map((product: any) => (
                    <ProductCard 
                      key={product._id || product.slug?.current} 
                      product={product} 
                    />
                  ))}
                </div>
              </InfiniteScroll>

              {/* Пустое состояние */}
              {!loading && products.length === 0 && (
                <div style={{ 
                  textAlign: "center", 
                  padding: "80px 20px",
                  color: "var(--text-dim)"
                }}>
                  <p style={{ fontSize: "18px", marginBottom: "8px" }}>
                    Товарів не знайдено
                  </p>
                  <p style={{ fontSize: "14px" }}>
                    Спробуйте змінити фільтри або пошуковий запит
                  </p>
                </div>
              )}
            </main>
          </div>
        </div>
      </div>

      <Footer />

      <style jsx>{`
        @media (max-width: 1024px) {
          div[style*="grid-template-columns: 280px 1fr"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </>
  );
}
