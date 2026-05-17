'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import ProductCard from './ProductCard';
import CatalogFilters from './CatalogFilters';

type ViewMode = 'pagination' | 'loadmore';

export default function CatalogContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [products, setProducts] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>('loadmore');
  const [itemsPerPage, setItemsPerPage] = useState(24);
  
  const page = parseInt(searchParams.get('page') || '1');
  const category = searchParams.get('category');
  const search = searchParams.get('search');

  // Загрузка настроек из localStorage
  useEffect(() => {
    const savedMode = localStorage.getItem('catalogViewMode') as ViewMode;
    const savedLimit = localStorage.getItem('catalogItemsPerPage');
    
    if (savedMode) setViewMode(savedMode);
    if (savedLimit) setItemsPerPage(parseInt(savedLimit));
  }, []);

  // Загрузка товаров
  useEffect(() => {
    loadProducts();
  }, [page, category, search, itemsPerPage]);

  const loadProducts = async () => {
    setLoading(true);
    
    try {
      const params = new URLSearchParams(searchParams.toString());
      params.set('limit', String(itemsPerPage));
      params.set('page', String(page));

      const response = await fetch(`/api/products?${params.toString()}`);
      const data = await response.json();

      if (viewMode === 'loadmore' && page > 1) {
        setProducts(prev => [...prev, ...(data.products || [])]);
      } else {
        setProducts(data.products || []);
      }
      
      setTotal(data.total || 0);
      setLoading(false);
    } catch (error) {
      console.error('Failed to load products:', error);
      setLoading(false);
    }
  };

  const handleViewModeChange = (mode: ViewMode) => {
    setViewMode(mode);
    localStorage.setItem('catalogViewMode', mode);
    
    // Сброс на первую страницу
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', '1');
    router.push(`/catalog?${params.toString()}`);
  };

  const handleItemsPerPageChange = (value: number) => {
    setItemsPerPage(value);
    localStorage.setItem('catalogItemsPerPage', String(value));
    
    // Сброс на первую страницу
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', '1');
    router.push(`/catalog?${params.toString()}`);
  };

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', String(newPage));
    router.push(`/catalog?${params.toString()}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLoadMore = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', String(page + 1));
    router.push(`/catalog?${params.toString()}`);
  };

  const totalPages = Math.ceil(total / itemsPerPage);
  const hasMore = page < totalPages;
  const showingFrom = (page - 1) * itemsPerPage + 1;
  const showingTo = Math.min(page * itemsPerPage, total);

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
          <div className="view-modes">
            <button
              className={`mode-btn ${viewMode === 'pagination' ? 'active' : ''}`}
              onClick={() => handleViewModeChange('pagination')}
              title="Сторінки"
            >
              📄 Сторінки
            </button>
            <button
              className={`mode-btn ${viewMode === 'loadmore' ? 'active' : ''}`}
              onClick={() => handleViewModeChange('loadmore')}
              title="Завантажити більше"
            >
              📜 Завантажити більше
            </button>
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

          <div className="showing-count">
            Показано {showingFrom}-{showingTo} з {total}
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

                {/* Пагинация */}
                {viewMode === 'pagination' && totalPages > 1 && (
                  <div className="pagination">
                    <button
                      className="page-btn"
                      disabled={page === 1}
                      onClick={() => handlePageChange(page - 1)}
                    >
                      ← Попередня
                    </button>

                    <div className="page-numbers">
                      {[...Array(Math.min(totalPages, 7))].map((_, i) => {
                        let pageNum;
                        if (totalPages <= 7) {
                          pageNum = i + 1;
                        } else if (page <= 4) {
                          pageNum = i + 1;
                        } else if (page >= totalPages - 3) {
                          pageNum = totalPages - 6 + i;
                        } else {
                          pageNum = page - 3 + i;
                        }

                        return (
                          <button
                            key={pageNum}
                            className={`page-num ${page === pageNum ? 'active' : ''}`}
                            onClick={() => handlePageChange(pageNum)}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                    </div>

                    <button
                      className="page-btn"
                      disabled={page === totalPages}
                      onClick={() => handlePageChange(page + 1)}
                    >
                      Наступна →
                    </button>
                  </div>
                )}

                {/* Кнопка загрузить ещё */}
                {viewMode === 'loadmore' && hasMore && (
                  <div className="load-more-wrapper">
                    <button
                      className="load-more-btn"
                      onClick={handleLoadMore}
                      disabled={loading}
                    >
                      {loading ? 'Завантаження...' : 'Показати більше'}
                    </button>
                    <p className="load-more-hint">
                      Ще {total - showingTo} товарів
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

        .view-modes {
          display: flex;
          gap: 8px;
        }

        .mode-btn {
          padding: 8px 16px;
          border: 2px solid var(--line, #e0d4ba);
          background: transparent;
          border-radius: 6px;
          font-family: var(--font-sans);
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .mode-btn:hover {
          border-color: var(--gold-deep, #a07d3d);
          color: var(--gold-deep, #a07d3d);
        }

        .mode-btn.active {
          background: var(--gold-deep, #a07d3d);
          border-color: var(--gold-deep, #a07d3d);
          color: #ffffff;
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

        .showing-count {
          font-family: var(--font-sans);
          font-size: 14px;
          color: var(--text-dim, #8a7a6a);
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

        .pagination {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 12px;
          margin-top: 40px;
        }

        .page-btn,
        .page-num {
          padding: 10px 16px;
          border: 2px solid var(--line, #e0d4ba);
          background: #ffffff;
          border-radius: 6px;
          font-family: var(--font-sans);
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .page-btn:hover:not(:disabled),
        .page-num:hover {
          border-color: var(--gold-deep, #a07d3d);
          color: var(--gold-deep, #a07d3d);
        }

        .page-btn:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }

        .page-num.active {
          background: var(--gold-deep, #a07d3d);
          border-color: var(--gold-deep, #a07d3d);
          color: #ffffff;
        }

        .page-numbers {
          display: flex;
          gap: 6px;
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
            flex-direction: column;
            align-items: stretch;
          }

          .view-modes,
          .items-per-page {
            justify-content: center;
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

          .pagination {
            flex-wrap: wrap;
          }

          .page-numbers {
            flex-wrap: wrap;
          }
        }
      `}</style>
    </div>
  );
}
