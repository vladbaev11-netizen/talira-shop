'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Slide {
  id: number;
  title: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
  imagePath: string;
  textColor: string;
}

const slides: Slide[] = [
  {
    id: 1,
    title: "LED меблі з підсвіткою",
    subtitle: "Створіть ідеальний простір для краси",
    ctaText: "Переглянути",
    ctaLink: "/catalog?category=krasa",
    imagePath: "/images/hero/hero-banner-1.svg",
    textColor: "white"
  },
  {
    id: 2,
    title: "4500+ товарів для дому",
    subtitle: "Меблі • Електроніка • Краса • Здоров'я",
    ctaText: "Весь каталог",
    ctaLink: "/catalog",
    imagePath: "/images/hero/hero-banner-2.svg",
    textColor: "#1a1612"
  },
  {
    id: 3,
    title: "Доставка 1-3 дні",
    subtitle: "Новою Поштою по всій Україні • Оплата при отриманні",
    ctaText: "Оформити замовлення",
    ctaLink: "/catalog",
    imagePath: "/images/hero/hero-banner-3.svg",
    textColor: "white"
  },
  {
    id: 4,
    title: "Приєднуйтесь в Telegram",
    subtitle: "Акції • Новинки • Підтримка 24/7",
    ctaText: "Підписатись",
    ctaLink: "https://t.me/talira_com_ua",
    imagePath: "/images/hero/hero-banner-4.svg",
    textColor: "white"
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
              backgroundImage: `url(${slide.imagePath})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
            <div className="hero-content">
              <div className="hero-text">
                {/* Текст скрыт, так как он уже в баннере */}
                {/* Но оставляем CTA кнопку */}
                <Link 
                  href={slide.ctaLink}
                  className="hero-cta"
                  target={slide.ctaLink.startsWith('http') ? '_blank' : undefined}
                  rel={slide.ctaLink.startsWith('http') ? 'noopener noreferrer' : undefined}
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
          align-items: flex-end;
          justify-content: flex-start;
          padding: 60px;
        }

        .hero-slide.active {
          opacity: 1;
          visibility: visible;
          z-index: 1;
        }

        .hero-content {
          position: relative;
          z-index: 2;
        }

        .hero-text {
          animation: fadeInUp 0.8s ease-out;
        }

        .hero-cta {
          display: inline-block;
          padding: 18px 48px;
          font-family: var(--font-sans);
          font-size: 15px;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          border-radius: 8px;
          text-decoration: none;
          transition: all 0.3s ease;
          background: #a07d3d;
          color: white;
          border: 2px solid #a07d3d;
          box-shadow: 0 6px 25px rgba(160, 125, 61, 0.5);
        }

        .hero-cta:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 35px rgba(160, 125, 61, 0.6);
          background: #8a6a2f;
          border-color: #8a6a2f;
        }

        .hero-cta:active {
          transform: translateY(-1px);
        }

        .hero-arrow {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          background: rgba(26, 22, 18, 0.7);
          backdrop-filter: blur(10px);
          border: 2px solid rgba(255, 255, 255, 0.3);
          width: 56px;
          height: 56px;
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
          background: rgba(26, 22, 18, 0.9);
          border-color: rgba(255, 255, 255, 0.5);
          transform: translateY(-50%) scale(1.08);
        }

        .hero-arrow-left {
          left: 40px;
        }

        .hero-arrow-right {
          right: 40px;
        }

        .hero-dots {
          position: absolute;
          bottom: 50px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 14px;
          z-index: 10;
        }

        .hero-dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.5);
          border: none;
          cursor: pointer;
          transition: all 0.3s ease;
          padding: 0;
        }

        .hero-dot:hover {
          background: rgba(255, 255, 255, 0.75);
        }

        .hero-dot.active {
          background: white;
          width: 36px;
          border-radius: 6px;
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
            height: 500px;
          }

          .hero-slide {
            padding: 40px 24px;
          }

          .hero-cta {
            width: 100%;
            text-align: center;
            padding: 16px 32px;
            font-size: 14px;
          }

          .hero-arrow {
            width: 48px;
            height: 48px;
          }

          .hero-arrow-left {
            left: 20px;
          }

          .hero-arrow-right {
            right: 20px;
          }

          .hero-dots {
            bottom: 30px;
          }
        }
      `}</style>
    </div>
  );
}
