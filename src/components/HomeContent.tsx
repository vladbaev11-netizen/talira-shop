'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@sanity/client';
import ProductCard from './ProductCard';
import HomeFilters from './HomeFilters';

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '777maat6',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn: true,
});

interface Product {
  _id: string;
  name: string;
  slug: { current: string };
  price: number;
  oldPrice?: number;
  badge?: string;
  mainImage?: any;
  externalImages?: string[];
  category?: { name: string };
  categorySlug?: string;
  inStock: boolean;
  _createdAt: string;
}

export default function HomeContent() {
  const [newProducts, setNewProducts] = useState<Product[]>([]);
  const [popularProducts, setPopularProducts] = useState<Product[]>([]);
  const [hitProducts, setHitProducts] = useState<Product[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  
  const [filteredNew, setFilteredNew] = useState<Product[]>([]);
  const [filteredPopular, setFilteredPopular] = useState<Product[]>([]);
  const [filteredHit, setFilteredHit] = useState<Product[]>([]);
  const [filteredAll, setFilteredAll] = useState<Product[]>([]);
  
  const [showNewCount, setShowNewCount] = useState(9);
  const [showPopularCount, setShowPopularCount] = useState(9);
  const [showHitCount, setShowHitCount] = useState(9);
  const [showAllCount, setShowAllCount] = useState(9);
  
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const query = `*[_type == "product"] {
          _id,
          name,
          slug,
          price,
          oldPrice,
          badge,
          mainImage,
          externalImages,
          "category": category->{name},
          "categorySlug": category->slug.current,
          inStock,
          _createdAt
        }`;
        
        const data = await client.fetch(query);
        
        // Новинки (последние добавленные)
        const sortedByDate = [...data].sort((a, b) => 
          new Date(b._createdAt).getTime() - new Date(a._createdAt).getTime()
        );
        setNewProducts(sortedByDate);
        setFilteredNew(sortedByDate);
        
        // Популярні
        const popular = data.filter((p: Product) => p.badge === 'Популярний');
        const popularList = popular.length > 0 ? popular : [...data].sort(() => Math.random() - 0.5);
        setPopularProducts(popularList);
        setFilteredPopular(popularList);
        
        // Хіт продажу
        const hits = data.filter((p: Product) => p.badge === 'Хіт продажу');
        let hitList;
        if (hits.length > 0) {
          hitList = hits;
        } else {
          const withDiscount = data.filter((p: Product) => p.oldPrice);
          hitList = withDiscount.length > 0 ? withDiscount : [...data].sort(() => Math.random() - 0.5);
        }
        setHitProducts(hitList);
        setFilteredHit(hitList);
        
        // Всі товари (рандомний порядок)
        const randomAll = [...data].sort(() => Math.random() - 0.5);
        setAllProducts(randomAll);
        setFilteredAll(randomAll);
        
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Обработка фильтров
  const handleFilterChange = (filters: {
    category: string;
    priceRange: string;
    inStock: boolean;
  }) => {
    const applyFilters = (products: Product[]) => {
      let filtered = [...products];

      // Фильтр по категории
      if (filters.category !== 'all') {
        filtered = filtered.filter(p => p.categorySlug === filters.category);
      }

      // Фильтр по цене
      if (filters.priceRange !== 'all') {
        const [min, max] = filters.priceRange.split('-').map(v => 
          v === '' ? Infinity : parseInt(v.replace('+', ''))
        );
        
        if (max) {
          filtered = filtered.filter(p => p.price >= min && p.price <= max);
        } else {
          filtered = filtered.filter(p => p.price >= min);
        }
      }

      // Фильтр по наличию
      if (filters.inStock) {
        filtered = filtered.filter(p => p.inStock);
      }

      return filtered;
    };

    setFilteredNew(applyFilters(newProducts));
    setFilteredPopular(applyFilters(popularProducts));
    setFilteredHit(applyFilters(hitProducts));
    setFilteredAll(applyFilters(allProducts));
  };

  if (loading) {
    return (
      <div style={{ padding: "80px 0", textAlign: "center" }}>
        <div className="spinner" />
        <p>Завантаження...</p>
      </div>
    );
  }

  return (
    <div className="home-sections">
      <div className="container">
        <div className="home-layout">
          
          {/* Фильтры слева */}
          <aside className="sidebar">
            <HomeFilters onFilterChange={handleFilterChange} />
          </aside>

          {/* Секции товаров справа */}
          <div className="sections-wrapper">
            
            {/* Новинки */}
            <section className="product-section">
              <div className="section-header">
                <h2 className="section-title">Новинки</h2>
                <p className="section-subtitle">Останні надходження товарів</p>
              </div>
              <div className="products-grid">
                {filteredNew.slice(0, showNewCount).map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
              {showNewCount < filteredNew.length && (
                <div className="load-more-wrapper">
                  <button 
                    className="load-more-btn"
                    onClick={() => setShowNewCount(prev => prev + 9)}
                  >
                    Показати більше
                  </button>
                </div>
              )}
            </section>

            {/* Популярні */}
            <section className="product-section">
              <div className="section-header">
                <h2 className="section-title">Популярні товари</h2>
                <p className="section-subtitle">Найбільш затребувані товари</p>
              </div>
              <div className="products-grid">
                {filteredPopular.slice(0, showPopularCount).map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
              {showPopularCount < filteredPopular.length && (
                <div className="load-more-wrapper">
                  <button 
                    className="load-more-btn"
                    onClick={() => setShowPopularCount(prev => prev + 9)}
                  >
                    Показати більше
                  </button>
                </div>
              )}
            </section>

            {/* Хіт продажу */}
            <section className="product-section">
              <div className="section-header">
                <h2 className="section-title">Хіт продажу</h2>
                <p className="section-subtitle">Найкращі пропозиції</p>
              </div>
              <div className="products-grid">
                {filteredHit.slice(0, showHitCount).map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
              {showHitCount < filteredHit.length && (
                <div className="load-more-wrapper">
                  <button 
                    className="load-more-btn"
                    onClick={() => setShowHitCount(prev => prev + 9)}
                  >
                    Показати більше
                  </button>
                </div>
              )}
            </section>

            {/* Всі товари */}
            <section className="product-section">
              <div className="section-header">
                <h2 className="section-title">Всі товари</h2>
                <p className="section-subtitle">Повний каталог наших товарів</p>
              </div>
              <div className="products-grid">
                {filteredAll.slice(0, showAllCount).map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
              {showAllCount < filteredAll.length && (
                <div className="load-more-wrapper">
                  <button 
                    className="load-more-btn"
                    onClick={() => setShowAllCount(prev => prev + 9)}
                  >
                    Показати більше
                  </button>
                </div>
              )}
            </section>

          </div>
        </div>
      </div>

      <style jsx>{`
        .home-sections {
          background: var(--bg, #f5f1e8);
          padding: 60px 0;
        }

        .container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 24px;
        }

        .home-layout {
          display: grid;
          grid-template-columns: 280px 1fr;
          gap: 40px;
        }

        .sidebar {
          position: relative;
        }

        .sections-wrapper {
          min-width: 0;
        }

        .product-section {
          margin-bottom: 80px;
        }

        .product-section:last-child {
          margin-bottom: 0;
        }

        .section-header {
          text-align: center;
          margin-bottom: 48px;
        }

        .section-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 42px;
          font-weight: 600;
          color: var(--text-dark, #1a1612);
          margin: 0 0 12px 0;
        }

        .section-subtitle {
          font-family: var(--font-sans);
          font-size: 16px;
          color: var(--text-dim, #8a7a6a);
          margin: 0;
        }

        .products-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 32px;
          margin-bottom: 40px;
        }

        .load-more-wrapper {
          text-align: center;
        }

        .load-more-btn {
          display: inline-block;
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

        .load-more-btn:hover {
          background: var(--gold-deep, #a07d3d);
          color: #ffffff;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(160, 125, 61, 0.3);
        }

        @media (max-width: 1024px) {
          .home-layout {
            grid-template-columns: 1fr;
            gap: 32px;
          }

          .sidebar {
            position: static;
          }

          .products-grid {
            grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
            gap: 24px;
          }

          .section-title {
            font-size: 36px;
          }
        }

        @media (max-width: 768px) {
          .home-sections {
            padding: 40px 0;
          }

          .product-section {
            margin-bottom: 60px;
          }

          .section-title {
            font-size: 32px;
          }

          .products-grid {
            grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
            gap: 20px;
          }

          .load-more-btn {
            width: 100%;
            max-width: 320px;
          }
        }

        @media (max-width: 480px) {
          .products-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
