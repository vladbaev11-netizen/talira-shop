'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Arrival {
  date: string;
  count: number;
}

export default function ArrivalsWidget() {
  const [arrivals, setArrivals] = useState<Arrival[]>([]);

  useEffect(() => {
    // TODO: Fetch from API
    // Пока заглушка - последние 6 дней
    const mockArrivals: Arrival[] = [];
    const today = new Date();
    
    for (let i = 0; i < 6; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      mockArrivals.push({
        date: date.toISOString().split('T')[0],
        count: Math.floor(Math.random() * 50) + 10
      });
    }
    
    setArrivals(mockArrivals);
  }, []);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  };

  return (
    <div className="arrivals-widget">
      <div className="widget-header">
        <div className="icon">⏰</div>
        <h3 className="widget-title">Поступлення</h3>
      </div>

      <div className="arrivals-list">
        {arrivals.map((arrival, index) => (
          <Link 
            key={arrival.date} 
            href={`/arrivals/${arrival.date}`}
            className={`arrival-item ${index === 0 ? 'latest' : ''}`}
          >
            <span className="arrow">→</span>
            <span className="date">{formatDate(arrival.date)}</span>
            {index === 0 && <span className="badge">Сьогодні</span>}
          </Link>
        ))}
      </div>

      <style jsx>{`
        .arrivals-widget {
          background: #ffffff;
          border: 1px solid var(--line, #e0d4ba);
          border-radius: 8px;
          padding: 24px;
        }

        .widget-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 20px;
        }

        .icon {
          font-size: 24px;
          color: var(--gold-deep, #a07d3d);
        }

        .widget-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 22px;
          font-weight: 600;
          color: var(--text-dark, #1a1612);
          margin: 0;
          text-transform: uppercase;
        }

        .arrivals-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .arrival-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 14px 16px;
          background: var(--bg, #f5f1e8);
          border-radius: 6px;
          font-family: var(--font-sans);
          font-size: 15px;
          color: var(--text, #3d3530);
          text-decoration: none;
          transition: all 0.2s ease;
          border: 2px solid transparent;
        }

        .arrival-item:hover {
          background: #ffffff;
          border-color: var(--gold-deep, #a07d3d);
          transform: translateX(4px);
        }

        .arrival-item.latest {
          background: #e8f5e9;
          border-color: #4caf50;
        }

        .arrow {
          color: var(--gold-deep, #a07d3d);
          font-size: 16px;
        }

        .date {
          flex: 1;
          font-weight: 500;
          color: var(--text-dark, #1a1612);
        }

        .badge {
          padding: 4px 12px;
          background: #4caf50;
          color: #ffffff;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
        }

        @media (max-width: 768px) {
          .arrivals-widget {
            padding: 20px;
          }

          .widget-title {
            font-size: 20px;
          }

          .arrival-item {
            padding: 12px 14px;
            font-size: 14px;
          }
        }
      `}</style>
    </div>
  );
}
