'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Slide {
  id: number;
  title: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
  imageUrl?: string;
  bgGradient: string;
  darkText?: boolean;
}

const slides: Slide[] = [
  {
    id: 1,
    title: "LED туалетні столики",
    subtitle: "З RGB підсвіткою та HD дзеркалами — створи свій ідеальний простір",
    ctaText: "Переглянути",
    ctaLink: "/catalog?category=krasa",
    imageUrl: "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=1200&h=600&fit=crop", // LED vanity mirror
    bgGradient: "linear-gradient(135deg, rgba(26, 22, 18, 0.7) 0%, rgba(26, 22, 18, 0.5) 100%)",
    darkText: false
  },
  {
    id: 2,
    title: "4500+ товарів для дому",
    subtitle: "Меблі, електроніка, краса — все для комфортного життя",
    ctaText: "Весь каталог",
    ctaLink: "/catalog",
    bgGradient: "linear-gradient(135deg, #f5f1e8 0%, #e8dcc8 100%)",
    darkText: true
  },
  {
    id: 3,
    title: "Масажери для дому",
    subtitle: "Професійний догляд у комфорті власної оселі",
    ctaText: "Дивитись",
    ctaLink: "/catalog?category=zdorovia",
    imageUrl: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=1200&h=600&fit=crop", // Spa/massage
    bgGradient: "linear-gradient(135deg, rgba(160, 125, 61, 0.8) 0%, rgba(138, 106, 47, 0.7) 100%)",
    darkText: false
  },
  {
    id: 4,
    title: "Доставка 1-3 дні",
    subtitle: "Новою Поштою по всій Україні • Оплата при отриманні",
    ctaText: "Оформити замовлення",
    ctaLink: "/catalog",
    bgGradient: "linear-gradient(135deg, #a07d3d 0%, #8a6a2f 100%)",
    darkText: false
  }
];

export default function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(true);
  }, []);

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

  const slide = slides[currentSlide];
  const textColor = slide.darkText ? '#1a1612' : '#f5f1e8';
  const buttonBg = slide.darkText ? '#a07d3d' : '#f5f1e8';
  const buttonColor = slide.darkText ? '#f5f1e8' : '#1a1612';

  return (
    <div 
      className="hero-slider"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background */}
      <div 
        className="hero-background"
        style={{
          backgroundImage: slide.imageUrl 
            ? `${slide.bgGradient}, url(${slide.imageUrl})` 
            : slide.bgGradient,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: loaded ? 1 : 0,
          transition: 'all 0.8s ease-in-out'
        }}
      />

      {/* Content */}
      <div className="hero-content">
        <div className="hero-text">
          <h1 
            className="hero-title"
            style={{ color: textColor }}
          >
            {slide.title}
          </h1>
          
          <p 
            className="hero-subtitle"
            style={{ color: textColor + 'dd' }}
          >
            {slide.subtitle}
          </p>

          <Link 
            href={slide.ctaLink}
            className="hero-cta"
            style={{
              background: buttonBg,
              color: buttonColor,
              borderColor: buttonBg
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = buttonBg;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = buttonBg;
              e.currentTarget.style.color = buttonColor;
            }}
          >
            {slide.ctaText}
          </Link>
        </div>
      </div>

      {/* Navigation dots */}
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
                ? textColor
                : textColor + '66',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              margin: '0 4px'
            }}
          />
        ))}
      </div>

      {/* Arrow navigation */}
      <button
        className="hero-arrow hero-arrow-left"
        onClick={() => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)}
        aria-label="Попередній слайд"
        style={{ color: textColor }}
      >
        <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </button>

      <button
        className="hero-arrow hero-arrow-right"
        onClick={() => setCurrentSlide((prev) => (prev + 1) % slides.length)}
        aria-label="Наступний слайд"
        style={{ color: textColor }}
      >
        <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M9 18l6-6-6-6" />
        </svg>
      </button>

      <style jsx>{`
        .hero-slider {
          position: relative;
          width: 100%;
          min-height: 600px;
          overflow: hidden;
          display: flex;
          align-items: center;
        }

        .hero-background {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 0;
        }

        .hero-content {
          position: relative;
          z-index: 1;
          max-width: 1200px;
          margin: 0 auto;
          width: 100%;
          padding: 80px 48px;
        }

        .hero-text {
          max-width: 700px;
          animation: fadeInUp 0.8s ease-out;
        }

        .hero-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(36px, 6vw, 72px);
          font-weight: 600;
          line-height: 1.1;
          margin-bottom: 20px;
          text-shadow: 0 2px 20px rgba(0, 0, 0, 0.2);
        }

        .hero-subtitle {
          font-family: var(--font-sans);
          font-size: clamp(16px, 2vw, 22px);
          line-height: 1.5;
          margin-bottom: 36px;
          text-shadow: 0 1px 10px rgba(0, 0, 0, 0.2);
        }

        .hero-cta {
          display: inline-block;
          padding: 18px 48px;
          font-family: var(--font-sans);
          font-size: 16px;
          font-weight: 600;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          border-radius: 8px;
          text-decoration: none;
          transition: all 0.3s ease;
          border: 2px solid;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
        }

        .hero-cta:active {
          transform: scale(0.98);
        }

        .hero-dots {
          position: absolute;
          bottom: 40px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 8px;
          z-index: 2;
        }

        .hero-arrow {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          background: rgba(0, 0, 0, 0.3);
          backdrop-filter: blur(10px);
          border: none;
          width: 48px;
          height: 48px;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
          z-index: 2;
          opacity: 0;
        }

        .hero-slider:hover .hero-arrow {
          opacity: 1;
        }

        .hero-arrow:hover {
          background: rgba(0, 0, 0, 0.5);
          transform: translateY(-50%) scale(1.1);
        }

        .hero-arrow-left {
          left: 24px;
        }

        .hero-arrow-right {
          right: 24px;
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
            min-height: 500px;
          }

          .hero-content {
            padding: 60px 24px;
          }

          .hero-title {
            font-size: 36px;
          }

          .hero-subtitle {
            font-size: 16px;
          }

          .hero-cta {
            width: 100%;
            text-align: center;
            padding: 16px 32px;
          }

          .hero-arrow {
            display: none;
          }

          .hero-dots {
            bottom: 24px;
          }
        }
      `}</style>
    </div>
  );
}
