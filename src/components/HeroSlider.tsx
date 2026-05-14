'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Slide {
  id: number;
  title: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
  imageUrl: string;
  overlay: string;
}

const slides: Slide[] = [
  {
    id: 1,
    title: "LED меблі з підсвіткою",
    subtitle: "Створіть ідеальний простір для краси",
    ctaText: "Переглянути",
    ctaLink: "/catalog?category=krasa",
    imageUrl: "https://images.pexels.com/photos/1090638/pexels-photo-1090638.jpeg?auto=compress&cs=tinysrgb&w=1920&h=800&fit=crop",
    overlay: "linear-gradient(135deg, rgba(26, 22, 18, 0.6) 0%, rgba(26, 22, 18, 0.3) 100%)"
  },
  {
    id: 2,
    title: "4500+ товарів для дому",
    subtitle: "Меблі • Електроніка • Краса • Здоров'я",
    ctaText: "Весь каталог",
    ctaLink: "/catalog",
    imageUrl: "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=1920&h=800&fit=crop",
    overlay: "linear-gradient(135deg, rgba(245, 241, 232, 0.85) 0%, rgba(232, 220, 200, 0.75) 100%)"
  },
  {
    id: 3,
    title: "Масажери та догляд",
    subtitle: "Професійний догляд у комфорті власної оселі",
    ctaText: "Дивитись",
    ctaLink: "/catalog?category=zdorovia",
    imageUrl: "https://images.pexels.com/photos/3760259/pexels-photo-3760259.jpeg?auto=compress&cs=tinysrgb&w=1920&h=800&fit=crop",
    overlay: "linear-gradient(135deg, rgba(160, 125, 61, 0.7) 0%, rgba(138, 106, 47, 0.5) 100%)"
  },
  {
    id: 4,
    title: "Доставка по всій Україні",
    subtitle: "Новою Поштою 1-3 дні • Оплата при отриманні",
    ctaText: "Оформити замовлення",
    ctaLink: "/catalog",
    imageUrl: "https://images.pexels.com/photos/4246120/pexels-photo-4246120.jpeg?auto=compress&cs=tinysrgb&w=1920&h=800&fit=crop",
    overlay: "linear-gradient(135deg, rgba(160, 125, 61, 0.8) 0%, rgba(138, 106, 47, 0.6) 100%)"
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

  const slide = slides[currentSlide];
  const isDark = slide.id === 1 || slide.id === 3 || slide.id === 4;

  return (
    <div 
      className="hero-slider"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Slides */}
      {slides.map((s, index) => {
        const isActive = currentSlide === index;
        const textColor = s.id === 2 ? '#1a1612' : '#ffffff';

        return (
          <div
            key={s.id}
            className={`hero-slide ${isActive ? 'active' : ''}`}
          >
            {/* Background Image */}
            <div 
              className="hero-bg"
              style={{
                backgroundImage: `url(${s.imageUrl})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            />
            
            {/* Overlay */}
            <div 
              className="hero-overlay"
              style={{ background: s.overlay }}
            />

            {/* Content */}
            <div className="hero-content">
              <div className="hero-text">
                <h1 className="hero-title" style={{ color: textColor }}>
                  {s.title}
                </h1>
                
                <p className="hero-subtitle" style={{ color: textColor }}>
                  {s.subtitle}
                </p>

                <Link 
                  href={s.ctaLink}
                  className="hero-cta"
                  target={s.ctaLink.startsWith('http') ? '_blank' : undefined}
                >
                  {s.ctaText}
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
          transition: opacity 1s ease-in-out, visibility 1s ease-in-out;
        }

        .hero-slide.active {
          opacity: 1;
          visibility: visible;
          z-index: 1;
        }

        .hero-bg {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 0;
        }

        .hero-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 1;
        }

        .hero-content {
          position: relative;
          z-index: 2;
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 60px;
          height: 100%;
          display: flex;
          align-items: center;
        }

        .hero-text {
          max-width: 700px;
          animation: fadeInUp 1s ease-out;
        }

        .hero-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(42px, 6vw, 76px);
          font-weight: 600;
          line-height: 1.1;
          margin-bottom: 24px;
          text-shadow: 0 3px 20px rgba(0, 0, 0, 0.3);
        }

        .hero-subtitle {
          font-family: var(--font-sans);
          font-size: clamp(17px, 2.2vw, 24px);
          line-height: 1.6;
          margin-bottom: 40px;
          opacity: 0.95;
          text-shadow: 0 2px 12px rgba(0, 0, 0, 0.2);
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
            font-size: 38px;
          }

          .hero-subtitle {
            font-size: 17px;
            margin-bottom: 32px;
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
