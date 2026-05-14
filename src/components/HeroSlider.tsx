'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Slide {
  id: number;
  title: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
  image?: string;
  bgGradient: string;
}

const slides: Slide[] = [
  {
    id: 1,
    title: "4500+ товарів для дому, краси та здоров'я",
    subtitle: "Нова колекція 2026 вже в каталозі",
    ctaText: "Переглянути каталог",
    ctaLink: "/catalog",
    bgGradient: "linear-gradient(135deg, #f5f1e8 0%, #e8dcc8 100%)"
  },
  {
    id: 2,
    title: "Доставка Новою Поштою по всій Україні",
    subtitle: "Відправка замовлень щодня — отримайте за 1-3 дні",
    ctaText: "Оформити замовлення",
    ctaLink: "/catalog",
    bgGradient: "linear-gradient(135deg, #f5f1e8 0%, #d4c5a9 100%)"
  },
  {
    id: 3,
    title: "Підтримка 24/7 в Telegram та Instagram",
    subtitle: "Перевірка товару перед відправкою — гарантія якості",
    ctaText: "Зв'язатися з нами",
    ctaLink: "/contacts",
    bgGradient: "linear-gradient(135deg, #f5f1e8 0%, #e0d4ba 100%)"
  },
  {
    id: 4,
    title: "Знижки до -30% на обрані товари",
    subtitle: "Оновлюємо пропозиції щотижня",
    ctaText: "Товари зі знижкою",
    ctaLink: "/catalog?sale=true",
    bgGradient: "linear-gradient(135deg, #a07d3d 0%, #8a6a2f 100%)"
  }
];

export default function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000); // Переключение каждые 5 секунд

    return () => clearInterval(interval);
  }, [isPaused]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const slide = slides[currentSlide];
  const isGoldSlide = slide.id === 4;

  return (
    <div 
      className="hero-slider"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      style={{
        background: slide.bgGradient,
        position: 'relative',
        overflow: 'hidden',
        transition: 'background 0.8s ease-in-out'
      }}
    >
      <div className="hero-content">
        <div className="hero-text">
          <h1 
            className="hero-title"
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(32px, 5vw, 64px)',
              fontWeight: 600,
              lineHeight: 1.1,
              marginBottom: '16px',
              color: isGoldSlide ? '#f5f1e8' : '#1a1612',
              maxWidth: '800px'
            }}
          >
            {slide.title}
          </h1>
          
          <p 
            className="hero-subtitle"
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: 'clamp(16px, 2vw, 20px)',
              marginBottom: '32px',
              color: isGoldSlide ? '#f5f1e8dd' : '#1a1612cc',
              maxWidth: '600px'
            }}
          >
            {slide.subtitle}
          </p>

          <Link 
            href={slide.ctaLink}
            className="hero-cta"
            style={{
              display: 'inline-block',
              padding: '16px 40px',
              background: isGoldSlide ? '#f5f1e8' : '#a07d3d',
              color: isGoldSlide ? '#1a1612' : '#f5f1e8',
              fontFamily: 'var(--font-sans)',
              fontSize: '16px',
              fontWeight: 500,
              borderRadius: '6px',
              textDecoration: 'none',
              transition: 'all 0.3s ease',
              border: `2px solid ${isGoldSlide ? '#f5f1e8' : '#a07d3d'}`
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = isGoldSlide ? 'transparent' : '#8a6a2f';
              e.currentTarget.style.color = isGoldSlide ? '#f5f1e8' : '#f5f1e8';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = isGoldSlide ? '#f5f1e8' : '#a07d3d';
              e.currentTarget.style.color = isGoldSlide ? '#1a1612' : '#f5f1e8';
            }}
          >
            {slide.ctaText}
          </Link>
        </div>
      </div>

      {/* Индикаторы слайдов */}
      <div className="hero-dots">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className="hero-dot"
            aria-label={`Перейти до слайду ${index + 1}`}
            style={{
              width: currentSlide === index ? '32px' : '8px',
              height: '8px',
              borderRadius: '4px',
              background: currentSlide === index 
                ? (isGoldSlide ? '#f5f1e8' : '#a07d3d')
                : (isGoldSlide ? '#f5f1e8aa' : '#a07d3d66'),
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              margin: '0 4px'
            }}
          />
        ))}
      </div>

      <style jsx>{`
        .hero-slider {
          width: 100%;
          min-height: 600px;
          display: flex;
          align-items: center;
          padding: 80px 20px;
        }

        .hero-content {
          max-width: 1200px;
          margin: 0 auto;
          width: 100%;
        }

        .hero-text {
          animation: fadeInUp 0.8s ease-out;
        }

        .hero-dots {
          position: absolute;
          bottom: 40px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 8px;
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (max-width: 768px) {
          .hero-slider {
            min-height: 500px;
            padding: 60px 20px;
          }

          .hero-title {
            font-size: 32px !important;
          }

          .hero-subtitle {
            font-size: 16px !important;
          }

          .hero-cta {
            width: 100%;
            text-align: center;
          }
        }
      `}</style>
    </div>
  );
}
