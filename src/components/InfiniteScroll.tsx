'use client';

import { useState, useEffect, useRef } from 'react';

interface InfiniteScrollProps {
  onLoadMore: () => Promise<void>;
  hasMore: boolean;
  loading: boolean;
  children: React.ReactNode;
}

export default function InfiniteScroll({ 
  onLoadMore, 
  hasMore, 
  loading, 
  children 
}: InfiniteScrollProps) {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const loaderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        setIsIntersecting(entry.isIntersecting);
      },
      {
        root: null,
        rootMargin: '200px', // Загружаем заранее, за 200px до конца
        threshold: 0.1
      }
    );

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => {
      if (loaderRef.current) {
        observer.unobserve(loaderRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (isIntersecting && hasMore && !loading) {
      onLoadMore();
    }
  }, [isIntersecting, hasMore, loading, onLoadMore]);

  return (
    <>
      {children}
      
      <div ref={loaderRef} className="infinite-scroll-loader">
        {loading && hasMore && (
          <div className="loader-container">
            <div className="spinner"></div>
            <span className="loader-text">Завантаження товарів...</span>
          </div>
        )}
        
        {!hasMore && (
          <div className="end-message">
            <p>Ви переглянули всі товари</p>
          </div>
        )}
      </div>

      <style jsx>{`
        .infinite-scroll-loader {
          padding: 40px 20px;
          text-align: center;
        }

        .loader-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
        }

        .spinner {
          width: 40px;
          height: 40px;
          border: 3px solid var(--line, #e0d4ba);
          border-top-color: var(--gold-deep, #a07d3d);
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .loader-text {
          font-size: 15px;
          color: var(--text-dim);
        }

        .end-message {
          padding: 60px 20px;
          text-align: center;
        }

        .end-message p {
          font-size: 16px;
          color: var(--text-dim);
          font-weight: 500;
        }
      `}</style>
    </>
  );
}
