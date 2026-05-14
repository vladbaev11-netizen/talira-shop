'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Slide {
  id: number;
  title: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
  gradient: string;
  textColor: string;
}

const slides: Slide[] = [
  {
    id: 1,
    title: "LED туалетні столики",
    subtitle: "З RGB підсвіткою та HD дзеркалами — створи свій ідеальний простір",
    ctaText: "Переглянути",
    ctaLink: "/catalog?category=krasa",
    gradient: "linear-gradient(135deg, #1a1612 0%, #3d3530 50%, #1a1612 100%)",
    textColor: "white"
  },
  {
    id: 2,
    title: "Масажери для дому",
    subtitle: "Професійний догляд у комфорті власної оселі",
    ctaText: "Дивитись",
    ctaLink: "/catalog?category=zdorovia",
    gradient: "linear-gradient(135deg, #a07d3d 0%, #c9a052 50%, #8a6a2f 100%)",
    textColor: "white"
  },
  {
    id: 3,
    title: "Доставка 1-3 дні",
    subtitle: "Новою Поштою по всій Україні • Оплата при отриманні",
    ctaText: "Оформити замовлення",
    ctaLink: "/catalog",
    gradient: "linear-gradient(135deg, #8a6a2f 0%, #a07d3d 100%)",
    textColor: "white"
  },
  {
    id: 4,
    title: "4500+ товарів для дому",
    subtitle: "Меблі, електроніка, краса — все для комфортного життя",
    ctaText: "Весь каталог",
    ctaLink: "/catalog",
    gradient: "linear-gradient(135deg, #f5f1e8 0%, #e8dcc8 50%, #f5f1e8 100%)",
    textColor: "#1a1612"
  }
];

export default function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isPaused]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div 
      className="hero-slider"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Slides */}
      {slides.map((slide, index) => {
        const isActive = currentSlide === index;

        return (
          <div
            key={slide.id}
            className={`hero-slide ${isActive ? 'active' : ''}`}
            style={{
              background: slide.gradient
            }}
          >
            <div className="hero-content">
              <div className="hero-text">
                <h1 className="hero-title" style={{ color: slide.textColor }}>
                  {slide.title}
                </h1>
                
                <p className="hero-subtitle" style={{ color: slide.textColor }}>
                  {slide.subtitle}
                </p>

                <Link 
                  href={slide.ctaLink}
                  className="hero-cta"
                >
                  {slide.ctaText}
                </Link>
              </div>
            </div>
          </div>
        );
      })}

      {/* Navigation Arrows */}
      <button
        className="hero-arrow hero-arrow-left"
        onClick={prevSlide}
        aria-label="Попередній слайд"
      >
        <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </button>

      <button
        className="hero-arrow hero-arrow-right"
        onClick={nextSlide}
        aria-label="Наступний слайд"
      >
        <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
          <path d="M9 18l6-6-6-6" />
        </svg>
      </button>

      {/* Dots Navigation */}
      <div className="hero-dots">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`hero-dot ${currentSlide === index ? 'active' : ''}`}
            aria-label={`Слайд ${index + 1}`}
          />
        ))}
      </div>

      <style jsx>{`
        .hero-slider {
          position: relative;
          width: 100%;
          height: 600px;
          overflow: hidden;
        }

        .hero-slide {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          opacity: 0;
          visibility: hidden;
          transition: opacity 0.8s ease, visibility 0.8s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .hero-slide.active {
          opacity: 1;
          visibility: visible;
          z-index: 1;
        }

        .hero-content {
          max-width: 1200px;
          width: 100%;
          padding: 0 48px;
          position: relative;
          z-index: 2;
        }

        .hero-text {
          max-width: 700px;
          animation: fadeInUp 0.8s ease-out;
        }

        .hero-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(40px, 6vw, 72px);
          font-weight: 600;
          line-height: 1.1;
          margin-bottom: 24px;
        }

        .hero-subtitle {
          font-family: var(--font-sans);
          font-size: clamp(16px, 2vw, 22px);
          line-height: 1.6;
          margin-bottom: 40px;
          opacity: 0.95;
        }

        .hero-cta {
          display: inline-block;
          padding: 16px 40px;
          font-family: var(--font-sans);
          font-size: 14px;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          border-radius: 6px;
          text-decoration: none;
          transition: all 0.3s ease;
          background: #a07d3d;
          color: white;
          border: 2px solid #a07d3d;
          box-shadow: 0 4px 20px rgba(160, 125, 61, 0.4);
        }

        .hero-cta:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 30px rgba(160, 125, 61, 0.6);
          background: #8a6a2f;
          border-color: #8a6a2f;
        }

        .hero-cta:active {
          transform: translateY(0);
        }

        .hero-arrow {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          background: rgba(26, 22, 18, 0.6);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          width: 52px;
          height: 52px;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
          z-index: 10;
          color: white;
          opacity: 0;
        }

        .hero-slider:hover .hero-arrow {
          opacity: 1;
        }

        .hero-arrow:hover {
          background: rgba(26, 22, 18, 0.8);
          border-color: rgba(255, 255, 255, 0.4);
          transform: translateY(-50%) scale(1.05);
        }

        .hero-arrow-left {
          left: 32px;
        }

        .hero-arrow-right {
          right: 32px;
        }

        .hero-dots {
          position: absolute;
          bottom: 40px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 12px;
          z-index: 10;
        }

        .hero-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.5);
          border: none;
          cursor: pointer;
          transition: all 0.3s ease;
          padding: 0;
        }

        .hero-dot:hover {
          background: rgba(255, 255, 255, 0.7);
        }

        .hero-dot.active {
          background: white;
          width: 32px;
          border-radius: 5px;
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (max-width: 768px) {
          .hero-slider {
            height: 500px;
          }

          .hero-content {
            padding: 0 24px;
          }

          .hero-title {
            font-size: 36px;
          }

          .hero-subtitle {
            font-size: 16px;
            margin-bottom: 32px;
          }

          .hero-cta {
            width: 100%;
            text-align: center;
            padding: 14px 32px;
          }

          .hero-arrow {
            width: 44px;
            height: 44px;
          }

          .hero-arrow-left {
            left: 16px;
          }

          .hero-arrow-right {
            right: 16px;
          }

          .hero-dots {
            bottom: 24px;
          }
        }
      `}</style>
    </div>
  );
}
