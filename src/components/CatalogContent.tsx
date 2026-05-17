'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import ProductCard from './ProductCard';
import CatalogFilters from './CatalogFilters';

export default function CatalogContent() {
  const searchParams = useSearchParams();
  
  const [products, setProducts] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [itemsPerPage, setItemsPerPage] = useState(24);
  const [currentPage, setCurrentPage] = useState(1);
  
  const category = searchParams.get('category');
  const search = searchParams.get('search');

  // Загрузка настроек из localStorage
  useEffect(() => {
    const savedLimit = localStorage.getItem('catalogItemsPerPage');
    if (savedLimit) setItemsPerPage(parseInt(savedLimit));
  }, []);

  // Загрузка товаров
  useEffect(() => {
    setProducts([]);
    setCurrentPage(1);
    loadProducts(1);
  }, [category, search, itemsPerPage]);

  const loadProducts = async (page: number) => {
    setLoading(true);
    
    try {
      const params = new URLSearchParams(searchParams.toString());
      params.set('limit', String(itemsPerPage));
      params.set('page', String(page));

      const response = await fetch(`/api/products?${params.toString()}`);
      const data = await response.json();

      if (page === 1) {
        setProducts(data.products || []);
      } else {
        setProducts(prev => [...prev, ...(data.products || [])]);
      }
      
      setTotal(data.total || 0);
      setLoading(false);
    } catch (error) {
      console.error('Failed to load products:', error);
      setLoading(false);
    }
  };

  const handleItemsPerPageChange = (value: number) => {
    setItemsPerPage(value);
    localStorage.setItem('catalogItemsPerPage', String(value));
    setProducts([]);
    setCurrentPage(1);
    loadProducts(1);
  };

  const handleLoadMore = () => {
    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);
    loadProducts(nextPage);
  };

  const hasMore = products.length < total;

  return (
    <div className="catalog-page">
      <div className="container">
        
        {/* Заголовок */}
        <div className="catalog-header">
          <div className="header-title">
            <h1>
              {search ? `Пошук: "${search}"` : category ? category : "Каталог товарів"}
            </h1>
            <p className="total-count">Знайдено {total} товарів</p>
          </div>
        </div>

        {/* Настройки отображения */}
        <div className="view-controls">
          <div className="showing-count">
            Показано {products.length} з {total}
          </div>

          <div className="items-per-page">
            <span>Товарів на сторінці:</span>
            <select 
              value={itemsPerPage} 
              onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
            >
              <option value={24}>24</option>
              <option value={48}>48</option>
              <option value={96}>96</option>
            </select>
          </div>
        </div>

        {/* Layout */}
        <div className="catalog-layout">
          
          {/* Фильтры */}
          <aside className="sidebar">
            <CatalogFilters />
          </aside>

          {/* Товары */}
          <main className="main-content">
            
            {loading && page === 1 ? (
              <div className="loading">
                <div className="spinner" />
                <p>Завантаження...</p>
              </div>
            ) : (
              <>
                <div className="products-grid">
                  {products.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>

                {/* Пустое состояние */}
                {!loading && products.length === 0 && (
                  <div className="empty-state">
                    <p>Товарів не знайдено</p>
                    <span>Спробуйте змінити фільтри або пошуковий запит</span>
                  </div>
                )}

                {/* Кнопка загрузить ещё */}
                {hasMore && (
                  <div className="load-more-wrapper">
                    <button
                      className="load-more-btn"
                      onClick={handleLoadMore}
                      disabled={loading}
                    >
                      {loading ? 'Завантаження...' : 'Завантажити більше'}
                    </button>
                    <p className="load-more-hint">
                      Ще {total - products.length} товарів
                    </p>
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>

      <style jsx>{`
        .catalog-page {
          padding: 40px 0;
          background: var(--bg, #f5f1e8);
          min-height: 60vh;
        }

        .container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 24px;
        }

        .catalog-header {
          margin-bottom: 32px;
        }

        .header-title h1 {
          font-family: 'Cormorant Garamond', serif;
          font-size: 36px;
          font-weight: 600;
          color: var(--text-dark, #1a1612);
          margin: 0 0 8px 0;
        }

        .total-count {
          font-family: var(--font-sans);
          font-size: 15px;
          color: var(--text-dim, #8a7a6a);
          margin: 0;
        }

        .view-controls {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 20px;
          padding: 16px 20px;
          background: #ffffff;
          border: 1px solid var(--line, #e0d4ba);
          border-radius: 8px;
          margin-bottom: 24px;
          flex-wrap: wrap;
        }

        .showing-count {
          font-family: var(--font-sans);
          font-size: 14px;
          color: var(--text-dim, #8a7a6a);
        }

        .items-per-page {
          display: flex;
          align-items: center;
          gap: 10px;
          font-family: var(--font-sans);
          font-size: 14px;
        }

        .items-per-page select {
          padding: 6px 12px;
          border: 2px solid var(--line, #e0d4ba);
          border-radius: 6px;
          font-family: var(--font-sans);
          font-size: 14px;
          cursor: pointer;
        }

        .catalog-layout {
          display: grid;
          grid-template-columns: 280px 1fr;
          gap: 32px;
        }

        .products-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 24px;
          margin-bottom: 40px;
        }

        .loading,
        .empty-state {
          text-align: center;
          padding: 80px 20px;
          color: var(--text-dim, #8a7a6a);
        }

        .spinner {
          width: 40px;
          height: 40px;
          border: 3px solid var(--line, #e0d4ba);
          border-top-color: var(--gold-deep, #a07d3d);
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
          margin: 0 auto 16px;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .load-more-wrapper {
          text-align: center;
          margin-top: 40px;
        }

        .load-more-btn {
          padding: 16px 48px;
          background: transparent;
          color: var(--text-dark, #1a1612);
          border: 2px solid var(--gold-deep, #a07d3d);
          border-radius: 8px;
          font-family: var(--font-sans);
          font-size: 15px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .load-more-btn:hover:not(:disabled) {
          background: var(--gold-deep, #a07d3d);
          color: #ffffff;
        }

        .load-more-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .load-more-hint {
          margin-top: 12px;
          font-size: 14px;
          color: var(--text-dim, #8a7a6a);
        }

        @media (max-width: 1024px) {
          .catalog-layout {
            grid-template-columns: 1fr;
          }

          .view-controls {
            justify-content: space-between;
          }
        }

        @media (max-width: 768px) {
          .products-grid {
            grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
            gap: 20px;
          }

          .header-title h1 {
            font-size: 28px;
          }

          .load-more-btn {
            width: 100%;
            max-width: 320px;
          }
        }
      `}</style>
    </div>
  );
}
