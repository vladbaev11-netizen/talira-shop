'use client';

import { useState, useEffect } from 'react';
import { client } from '@/sanity/lib/client';
import HomeFilters from './HomeFilters';
import ProductCard from './ProductCard';

interface Product {
  _id: string;
  name: string;
  slug: { current: string };
  price: number;
  mainImage?: { asset: { _ref: string } };
  category: string;
  inStock: boolean;
}

export default function HomeContent() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Загрузка товаров
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const query = `*[_type == "product"] | order(_createdAt desc) [0...50] {
          _id,
          name,
          slug,
          price,
          mainImage,
          "category": category->slug.current,
          inStock
        }`;
        
        const data = await client.fetch(query);
        setProducts(data);
        setFilteredProducts(data);
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
    let filtered = [...products];

    // Фильтр по категории
    if (filters.category !== 'all') {
      filtered = filtered.filter(p => p.category === filters.category);
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

    setFilteredProducts(filtered);
  };

  if (loading) {
    return (
      <div style={{ padding: "60px 0", textAlign: "center" }}>
        <div className="spinner" />
        <p>Завантаження...</p>
      </div>
    );
  }

  return (
    <section className="home-catalog">
      <div className="container">
        <div className="home-layout">
          {/* Фільтри */}
          <aside className="sidebar">
            <HomeFilters onFilterChange={handleFilterChange} />
          </aside>

          {/* Товари */}
          <div className="products-section">
            <div className="products-header">
              <h2 className="section-title">Наші товари</h2>
              <p className="products-count">
                {filteredProducts.length} {filteredProducts.length === 1 ? 'товар' : 'товарів'}
              </p>
            </div>

            {filteredProducts.length === 0 ? (
              <div className="no-products">
                <p>Товарів не знайдено за обраними фільтрами</p>
              </div>
            ) : (
              <div className="products-grid">
                {filteredProducts.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .home-catalog {
          padding: 60px 0;
          background: var(--bg, #f5f1e8);
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

        .products-section {
          min-height: 400px;
        }

        .products-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 32px;
        }

        .section-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 36px;
          font-weight: 600;
          color: var(--text-dark, #1a1612);
          margin: 0;
        }

        .products-count {
          font-family: var(--font-sans);
          font-size: 15px;
          color: var(--text-dim, #8a7a6a);
        }

        .products-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 32px;
        }

        .no-products {
          text-align: center;
          padding: 80px 20px;
          color: var(--text-dim, #8a7a6a);
        }

        @media (max-width: 1024px) {
          .home-layout {
            grid-template-columns: 1fr;
            gap: 32px;
          }

          .sidebar {
            position: static;
          }
        }

        @media (max-width: 768px) {
          .home-catalog {
            padding: 40px 0;
          }

          .section-title {
            font-size: 28px;
          }

          .products-grid {
            grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
            gap: 24px;
          }
        }

        @media (max-width: 480px) {
          .products-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 8px;
          }

          .products-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </section>
  );
}
