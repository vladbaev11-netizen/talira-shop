'use client';

import { useState } from 'react';

interface ProductTabsProps {
  description?: string;
  specifications?: Record<string, string>;
  reviews?: any[];
  productId: string;
}

export default function ProductTabs({ 
  description, 
  specifications, 
  reviews = [],
  productId 
}: ProductTabsProps) {
  const [activeTab, setActiveTab] = useState<'description' | 'specs' | 'reviews' | 'delivery'>('description');

  const tabs = [
    { id: 'description', label: 'Опис' },
    { id: 'specs', label: 'Характеристики' },
    { id: 'reviews', label: `Відгуки (${reviews.length})` },
    { id: 'delivery', label: 'Доставка' }
  ];

  return (
    <div className="product-tabs">
      {/* Tab navigation */}
      <div className="tabs-nav">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="tabs-content">
        {/* Опис */}
        {activeTab === 'description' && (
          <div className="tab-panel">
            {description ? (
              <div 
                className="product-description"
                dangerouslySetInnerHTML={{ __html: description }}
              />
            ) : (
              <p className="empty-state">Опис товару поки що відсутній</p>
            )}
          </div>
        )}

        {/* Характеристики */}
        {activeTab === 'specs' && (
          <div className="tab-panel">
            {specifications && Object.keys(specifications).length > 0 ? (
              <table className="specs-table">
                <tbody>
                  {Object.entries(specifications).map(([key, value]) => (
                    <tr key={key}>
                      <td className="spec-key">{key}</td>
                      <td className="spec-value">{value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="empty-state">Характеристики товару поки що відсутні</p>
            )}
          </div>
        )}

        {/* Відгуки */}
        {activeTab === 'reviews' && (
          <div className="tab-panel">
            {reviews.length > 0 ? (
              <div className="reviews-list">
                {reviews.map((review) => (
                  <div key={review._id} className="review-item">
                    <div className="review-header">
                      <div className="review-author">{review.author}</div>
                      <div className="review-rating">
                        {'★'.repeat(review.rating)}
                        {'☆'.repeat(5 - review.rating)}
                      </div>
                    </div>
                    <div className="review-text">{review.text}</div>
                    {review.date && (
                      <div className="review-date">
                        {new Date(review.date).toLocaleDateString('uk-UA')}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <p>Поки що немає відгуків про цей товар</p>
                <p className="empty-hint">Будьте першим, хто залишить відгук!</p>
              </div>
            )}
          </div>
        )}

        {/* Доставка */}
        {activeTab === 'delivery' && (
          <div className="tab-panel">
            <div className="delivery-info">
              <div className="delivery-section">
                <h3>🚚 Доставка Новою Поштою</h3>
                <ul>
                  <li>Доставка по всій Україні</li>
                  <li>Відправка протягом 1-2 робочих днів</li>
                  <li>Час доставки: 1-3 дні</li>
                  <li>Безкоштовна доставка від 2000 грн</li>
                </ul>
              </div>

              <div className="delivery-section">
                <h3>💳 Оплата</h3>
                <ul>
                  <li>Оплата при отриманні (накладений платіж)</li>
                  <li>Оплата карткою онлайн (MonoPay)</li>
                </ul>
              </div>

              <div className="delivery-section">
                <h3>↩️ Повернення</h3>
                <ul>
                  <li>Можливість обміну/повернення протягом 14 днів</li>
                  <li>Товар має бути у первинній упаковці</li>
                  <li>Зв'яжіться з нами для оформлення повернення</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .product-tabs {
          margin: 60px 0;
        }

        .tabs-nav {
          display: flex;
          gap: 8px;
          border-bottom: 2px solid var(--line, #e0d4ba);
          margin-bottom: 32px;
          overflow-x: auto;
        }

        .tab-button {
          padding: 16px 24px;
          background: none;
          border: none;
          border-bottom: 3px solid transparent;
          font-family: var(--font-sans);
          font-size: 16px;
          font-weight: 500;
          color: var(--text-dim);
          cursor: pointer;
          transition: all 0.3s ease;
          white-space: nowrap;
          margin-bottom: -2px;
        }

        .tab-button:hover {
          color: var(--text-main);
        }

        .tab-button.active {
          color: var(--gold-deep, #a07d3d);
          border-bottom-color: var(--gold-deep);
        }

        .tab-panel {
          animation: fadeIn 0.3s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .product-description {
          font-size: 16px;
          line-height: 1.7;
          color: var(--text-main);
        }

        .product-description :global(p) {
          margin-bottom: 16px;
        }

        .specs-table {
          width: 100%;
          border-collapse: collapse;
        }

        .specs-table tr {
          border-bottom: 1px solid var(--line);
        }

        .specs-table tr:last-child {
          border-bottom: none;
        }

        .spec-key {
          padding: 16px 0;
          font-weight: 500;
          color: var(--text-dim);
          width: 40%;
        }

        .spec-value {
          padding: 16px 0;
          color: var(--text-main);
        }

        .reviews-list {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .review-item {
          padding: 20px;
          background: var(--bg-soft, #f5f1e8);
          border-radius: 8px;
        }

        .review-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }

        .review-author {
          font-weight: 600;
          color: var(--text-main);
        }

        .review-rating {
          color: var(--gold-deep);
          font-size: 18px;
        }

        .review-text {
          line-height: 1.6;
          margin-bottom: 8px;
          color: var(--text-main);
        }

        .review-date {
          font-size: 13px;
          color: var(--text-dim);
        }

        .delivery-info {
          display: grid;
          gap: 32px;
        }

        .delivery-section h3 {
          font-family: var(--font-sans);
          font-size: 18px;
          font-weight: 600;
          margin-bottom: 16px;
          color: var(--text-main);
        }

        .delivery-section ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .delivery-section li {
          padding: 8px 0;
          padding-left: 24px;
          position: relative;
          color: var(--text-main);
        }

        .delivery-section li:before {
          content: '✓';
          position: absolute;
          left: 0;
          color: var(--gold-deep);
          font-weight: bold;
        }

        .empty-state {
          padding: 60px 20px;
          text-align: center;
          color: var(--text-dim);
        }

        .empty-state p {
          margin-bottom: 8px;
        }

        .empty-hint {
          font-size: 14px;
        }

        @media (max-width: 768px) {
          .tabs-nav {
            gap: 4px;
          }

          .tab-button {
            padding: 12px 16px;
            font-size: 14px;
          }

          .spec-key,
          .spec-value {
            display: block;
            width: 100%;
          }

          .spec-key {
            padding-bottom: 4px;
            font-size: 14px;
          }

          .spec-value {
            padding-top: 0;
            padding-bottom: 16px;
          }
        }
      `}</style>
    </div>
  );
}
