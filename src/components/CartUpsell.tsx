'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

interface UpsellProduct {
  _id: string;
  name: string;
  slug: string;
  price: number;
  image: string;
}

interface CartUpsellProps {
  currentTotal: number;
  onAddToCart?: (product: UpsellProduct) => void;
}

export default function CartUpsell({ currentTotal, onAddToCart }: CartUpsellProps) {
  const [upsellProducts, setUpsellProducts] = useState<UpsellProduct[]>([]);
  const freeShippingThreshold = 2000;
  const remaining = Math.max(0, freeShippingThreshold - currentTotal);
  const progress = Math.min(100, (currentTotal / freeShippingThreshold) * 100);

  useEffect(() => {
    // Загрузка рекомендуемых товаров
    fetch('/api/upsell-products')
      .then(res => res.json())
      .then(data => setUpsellProducts(data.products || []))
      .catch(console.error);
  }, []);

  return (
    <div className="cart-upsell">
      {/* Прогресс до бесплатной доставки */}
      <div className="shipping-progress">
        {remaining > 0 ? (
          <>
            <div className="progress-text">
              🚚 Додайте ще <strong>{remaining} ₴</strong> для безкоштовної доставки
            </div>
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${progress}%` }}
              />
            </div>
          </>
        ) : (
          <div className="progress-success">
            ✅ Вітаємо! Ви отримали безкоштовну доставку
          </div>
        )}
      </div>

      {/* Рекомендуемые товары */}
      {upsellProducts.length > 0 && (
        <div className="upsell-section">
          <h3 className="upsell-title">✨ Часто купують разом</h3>
          <div className="upsell-products">
            {upsellProducts.slice(0, 3).map((product) => (
              <div key={product._id} className="upsell-item">
                <Link href={`/product/${product.slug}`} className="upsell-image-link">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="upsell-image"
                  />
                </Link>
                <div className="upsell-info">
                  <Link href={`/product/${product.slug}`} className="upsell-name">
                    {product.name}
                  </Link>
                  <div className="upsell-price">{product.price} ₴</div>
                  <button
                    onClick={() => onAddToCart?.(product)}
                    className="upsell-add-button"
                  >
                    + Додати
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Преимущества покупки */}
      <div className="cart-benefits">
        <div className="benefit-item">
          <span className="benefit-icon">📦</span>
          <span className="benefit-text">Перевірка перед відправкою</span>
        </div>
        <div className="benefit-item">
          <span className="benefit-icon">🔒</span>
          <span className="benefit-text">Безпечна оплата</span>
        </div>
        <div className="benefit-item">
          <span className="benefit-icon">🚚</span>
          <span className="benefit-text">Доставка 1-3 дні</span>
        </div>
      </div>

      <style jsx>{`
        .cart-upsell {
          margin-top: 24px;
        }

        .shipping-progress {
          background: var(--bg-soft, #f5f1e8);
          border-radius: 12px;
          padding: 20px;
          margin-bottom: 24px;
        }

        .progress-text {
          font-size: 15px;
          margin-bottom: 12px;
          color: var(--text-main);
        }

        .progress-text strong {
          color: var(--gold-deep, #a07d3d);
          font-weight: 600;
        }

        .progress-bar {
          height: 8px;
          background: #e0d4ba;
          border-radius: 4px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #a07d3d 0%, #c9a052 100%);
          border-radius: 4px;
          transition: width 0.5s ease;
        }

        .progress-success {
          font-size: 15px;
          font-weight: 500;
          color: #2d5016;
          text-align: center;
        }

        .upsell-section {
          margin-bottom: 24px;
        }

        .upsell-title {
          font-family: var(--font-sans);
          font-size: 18px;
          font-weight: 600;
          margin-bottom: 16px;
          color: var(--text-main);
        }

        .upsell-products {
          display: grid;
          gap: 16px;
        }

        .upsell-item {
          display: flex;
          gap: 12px;
          padding: 16px;
          background: var(--bg-main, white);
          border: 1px solid var(--line, #e0d4ba);
          border-radius: 8px;
          transition: box-shadow 0.3s ease;
        }

        .upsell-item:hover {
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
        }

        .upsell-image-link {
          flex-shrink: 0;
        }

        .upsell-image {
          width: 80px;
          height: 80px;
          object-fit: cover;
          border-radius: 6px;
        }

        .upsell-info {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .upsell-name {
          font-size: 14px;
          font-weight: 500;
          line-height: 1.3;
          color: var(--text-main);
          text-decoration: none;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .upsell-name:hover {
          color: var(--gold-deep);
        }

        .upsell-price {
          font-size: 16px;
          font-weight: 600;
          color: var(--gold-deep);
        }

        .upsell-add-button {
          padding: 8px 16px;
          background: var(--gold-deep);
          color: white;
          border: none;
          border-radius: 6px;
          font-family: var(--font-sans);
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.3s ease;
          align-self: flex-start;
        }

        .upsell-add-button:hover {
          background: #8a6a2f;
        }

        .cart-benefits {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 12px;
          padding: 20px;
          background: var(--bg-soft);
          border-radius: 8px;
        }

        .benefit-item {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
        }

        .benefit-icon {
          font-size: 18px;
        }

        .benefit-text {
          color: var(--text-dim);
        }

        @media (max-width: 768px) {
          .cart-benefits {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
