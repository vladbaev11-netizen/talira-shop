'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface SearchResult {
  _id: string;
  name: string;
  slug: string;
  price: number;
  image?: string;
  category?: string;
}

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Закрытие при клике вне компонента
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Поиск с debounce
  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        const data = await response.json();
        setResults(data.results || []);
        setIsOpen(true);
      } catch (error) {
        console.error('Search error:', error);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/catalog?search=${encodeURIComponent(query)}`);
      setIsOpen(false);
      setQuery('');
    }
  };

  return (
    <div className="search-container" ref={searchRef}>
      <form onSubmit={handleSubmit} className="search-form">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.length >= 2 && setIsOpen(true)}
          placeholder="Пошук товарів..."
          className="search-input"
        />
        <button type="submit" className="search-button" aria-label="Пошук">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path 
              d="M9 17A8 8 0 1 0 9 1a8 8 0 0 0 0 16zM19 19l-4.35-4.35" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </form>

      {/* Результаты поиска */}
      {isOpen && (
        <div className="search-results">
          {isLoading ? (
            <div className="search-loading">
              <div className="spinner"></div>
              <span>Шукаємо...</span>
            </div>
          ) : results.length > 0 ? (
            <>
              {results.slice(0, 5).map((product) => (
                <Link
                  key={product._id}
                  href={`/product/${product.slug}`}
                  className="search-result-item"
                  onClick={() => {
                    setIsOpen(false);
                    setQuery('');
                  }}
                >
                  {product.image && (
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="search-result-image"
                    />
                  )}
                  <div className="search-result-info">
                    <div className="search-result-name">{product.name}</div>
                    <div className="search-result-price">{product.price} ₴</div>
                  </div>
                </Link>
              ))}
              {results.length > 5 && (
                <button
                  onClick={() => {
                    router.push(`/catalog?search=${encodeURIComponent(query)}`);
                    setIsOpen(false);
                    setQuery('');
                  }}
                  className="search-view-all"
                >
                  Показати всі результати ({results.length})
                </button>
              )}
            </>
          ) : query.length >= 2 ? (
            <div className="search-empty">
              <p>Нічого не знайдено</p>
              <span>Спробуйте інший запит</span>
            </div>
          ) : null}
        </div>
      )}

      <style jsx>{`
        .search-container {
          position: relative;
          width: 100%;
          max-width: 400px;
        }

        .search-form {
          position: relative;
          width: 100%;
        }

        .search-input {
          width: 100%;
          padding: 12px 48px 12px 16px;
          border: 1px solid var(--line, #e0d4ba);
          border-radius: 6px;
          font-family: var(--font-sans);
          font-size: 15px;
          background: var(--bg-main, #ffffff);
          color: var(--text-main);
          transition: all 0.2s ease;
        }

        .search-input:focus {
          outline: none;
          border-color: var(--gold-deep, #a07d3d);
          box-shadow: 0 0 0 3px rgba(160, 125, 61, 0.1);
        }

        .search-button {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: var(--text-dim);
          cursor: pointer;
          padding: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: color 0.2s ease;
        }

        .search-button:hover {
          color: var(--gold-deep);
        }

        .search-results {
          position: absolute;
          top: calc(100% + 8px);
          left: 0;
          right: 0;
          background: var(--bg-main, #ffffff);
          border: 1px solid var(--line);
          border-radius: 8px;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
          max-height: 400px;
          overflow-y: auto;
          z-index: 1000;
        }

        .search-loading {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 20px;
          color: var(--text-dim);
        }

        .spinner {
          width: 20px;
          height: 20px;
          border: 2px solid var(--line);
          border-top-color: var(--gold-deep);
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .search-result-item {
          display: flex;
          gap: 12px;
          padding: 12px;
          border-bottom: 1px solid var(--line);
          text-decoration: none;
          color: var(--text-main);
          transition: background 0.2s ease;
        }

        .search-result-item:hover {
          background: var(--bg-soft, #f5f1e8);
        }

        .search-result-item:last-child {
          border-bottom: none;
        }

        .search-result-image {
          width: 60px;
          height: 60px;
          object-fit: cover;
          border-radius: 4px;
          flex-shrink: 0;
        }

        .search-result-info {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: 4px;
        }

        .search-result-name {
          font-size: 14px;
          font-weight: 500;
          line-height: 1.3;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .search-result-price {
          font-size: 16px;
          font-weight: 600;
          color: var(--gold-deep);
        }

        .search-view-all {
          width: 100%;
          padding: 12px;
          background: var(--bg-soft);
          border: none;
          color: var(--gold-deep);
          font-family: var(--font-sans);
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.2s ease;
        }

        .search-view-all:hover {
          background: #e8dcc8;
        }

        .search-empty {
          padding: 40px 20px;
          text-align: center;
        }

        .search-empty p {
          font-weight: 500;
          margin-bottom: 4px;
        }

        .search-empty span {
          font-size: 14px;
          color: var(--text-dim);
        }

        @media (max-width: 768px) {
          .search-container {
            max-width: 100%;
          }

          .search-results {
            max-height: 300px;
          }
        }
      `}</style>
    </div>
  );
}
