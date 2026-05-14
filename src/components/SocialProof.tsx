'use client';

import { useState, useEffect } from 'react';

interface PurchaseNotification {
  id: string;
  name: string;
  city: string;
  product: string;
  timeAgo: string;
}

// Фейковые данные для демонстрации
const sampleNotifications: PurchaseNotification[] = [
  { id: '1', name: 'Олена', city: 'Київ', product: 'LED туалетний столик', timeAgo: '5 хвилин тому' },
  { id: '2', name: 'Андрій', city: 'Львів', product: 'Масажер N7', timeAgo: '12 хвилин тому' },
  { id: '3', name: 'Марина', city: 'Одеса', product: 'Робот-пилосос', timeAgo: '18 хвилин тому' },
  { id: '4', name: 'Ігор', city: 'Харків', product: 'LED дзеркало', timeAgo: '23 хвилини тому' },
  { id: '5', name: 'Юлія', city: 'Дніпро', product: 'Проектор зоряного неба', timeAgo: '31 хвилину тому' }
];

export default function SocialProof() {
  const [visible, setVisible] = useState(false);
  const [currentNotification, setCurrentNotification] = useState<PurchaseNotification | null>(null);

  useEffect(() => {
    // Первое уведомление через 10 секунд после загрузки
    const initialDelay = setTimeout(() => {
      showRandomNotification();
    }, 10000);

    return () => clearTimeout(initialDelay);
  }, []);

  const showRandomNotification = () => {
    const random = sampleNotifications[Math.floor(Math.random() * sampleNotifications.length)];
    setCurrentNotification(random);
    setVisible(true);

    // Скрыть через 5 секунд
    setTimeout(() => {
      setVisible(false);
    }, 5000);

    // Следующее уведомление через 30-60 секунд
    const nextDelay = 30000 + Math.random() * 30000;
    setTimeout(showRandomNotification, nextDelay);
  };

  if (!currentNotification) return null;

  return (
    <>
      <div className={`social-proof-popup ${visible ? 'visible' : ''}`}>
        <div className="popup-icon">🎉</div>
        <div className="popup-content">
          <div className="popup-title">
            <strong>{currentNotification.name}</strong> з {currentNotification.city}
          </div>
          <div className="popup-text">
            щойно купила "{currentNotification.product}"
          </div>
          <div className="popup-time">{currentNotification.timeAgo}</div>
        </div>
        <button 
          className="popup-close"
          onClick={() => setVisible(false)}
          aria-label="Закрити"
        >
          ×
        </button>
      </div>

      <style jsx>{`
        .social-proof-popup {
          position: fixed;
          bottom: 24px;
          left: 24px;
          background: white;
          border-radius: 12px;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
          padding: 16px;
          display: flex;
          align-items: center;
          gap: 12px;
          max-width: 360px;
          z-index: 9999;
          opacity: 0;
          transform: translateX(-100%);
          transition: all 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
          pointer-events: none;
        }

        .social-proof-popup.visible {
          opacity: 1;
          transform: translateX(0);
          pointer-events: auto;
        }

        .popup-icon {
          font-size: 32px;
          flex-shrink: 0;
          animation: bounce 2s infinite;
        }

        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }

        .popup-content {
          flex: 1;
        }

        .popup-title {
          font-family: var(--font-sans);
          font-size: 14px;
          margin-bottom: 4px;
          color: var(--text-main);
        }

        .popup-title strong {
          font-weight: 600;
        }

        .popup-text {
          font-size: 13px;
          color: var(--text-dim);
          margin-bottom: 4px;
          line-height: 1.4;
        }

        .popup-time {
          font-size: 12px;
          color: var(--gold-deep, #a07d3d);
          font-weight: 500;
        }

        .popup-close {
          position: absolute;
          top: 8px;
          right: 8px;
          background: none;
          border: none;
          font-size: 24px;
          line-height: 1;
          color: var(--text-dim);
          cursor: pointer;
          padding: 4px;
          transition: color 0.2s ease;
        }

        .popup-close:hover {
          color: var(--text-main);
        }

        @media (max-width: 768px) {
          .social-proof-popup {
            left: 16px;
            right: 16px;
            bottom: 16px;
            max-width: none;
          }
        }
      `}</style>
    </>
  );
}
