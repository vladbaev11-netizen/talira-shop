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
}

const slides: Slide[] = [
  {
    id: 1,
    title: "LED меблі з підсвіткою",
    subtitle: "Створіть ідеальний простір для краси",
    ctaText: "Переглянути",
    ctaLink: "/catalog?category=krasa",
    imageUrl: "https://images.pexels.com/photos/1090638/pexels-photo-1090638.jpeg?auto=compress&cs=tinysrgb&w=1920&h=800&fit=crop"
  },
  {
    id: 2,
    title: "4500+ товарів для дому",
    subtitle: "Меблі • Електроніка • Краса • Здоров'я",
    ctaText: "Весь каталог",
    ctaLink: "/catalog",
    imageUrl: "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=1920&h=800&fit=crop"
  },
  {
    id: 3,
    title: "Масажери та догляд",
    subtitle: "Професійний догляд у комфорті власної оселі",
    ctaText: "Дивитись",
    ctaLink: "/catalog?category=zdorovia",
    imageUrl: "https://images.pexels.com/photos/3760259/pexels-photo-3760259.jpeg?auto=compress&cs=tinysrgb&w=1920&h=800&fit=crop"
  },
  {
    id: 4,
    title: "Доставка по всій Україні",
    subtitle: "Новою Поштою 1-3 дні • Оплата при отриманні",
    ctaText: "Оформити замовлення",
    ctaLink: "/catalog",
    imageUrl: "https://images.pexels.com/photos/4246120/pexels-photo-4246120.jpeg?auto=compress&cs=tinysrgb&w=1920&h=800&fit=crop"
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

  const goToSlide = (index: number) => setCurrentSlide(index);
  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  return (
    <div 
      className="hero-slider"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`hero-slide ${currentSlide === index ? 'active' : ''}`}
          style={{
            backgroundImage: `url(${slide.imageUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          <div className="hero-overlay" />
          
          <div className="hero-container">
            <div className="hero-content-box">
              <h1 className="hero-title">{slide.title}</h1>
              <p className="hero-subtitle">{slide.subtitle}</p>
              <Link href={slide.ctaLink} className="hero-button">
                {slide.ctaText}
              </Link>
            </div>
          </div>
        </div>
      ))}

      <button className="hero-arrow hero-arrow-left" onClick={prevSlide} aria-label="Попередній">
        <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </button>

      <button className="hero-arrow hero-arrow-right" onClick={nextSlide} aria-label="Наступний">
        <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
          <path d="M9 18l6-6-6-6" />
        </svg>
      </button>

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
          background: #f5f1e8;
        }

        .hero-slide {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          opacity: 0;
          visibility: hidden;
          transition: opacity 1s ease-in-out;
        }

        .hero-slide.active {
          opacity: 1;
          visibility: visible;
          z-index: 1;
        }

        .hero-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, rgba(0, 0, 0, 0.3) 0%, rgba(0, 0, 0, 0.1) 100%);
          z-index: 1;
        }

        .hero-container {
          position: relative;
          z-index: 2;
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 60px;
          height: 100%;
          display: flex;
          align-items: center;
        }

        .hero-content-box {
          max-width: 700px;
          background: rgba(255, 255, 255, 0.97);
          padding: 60px 70px;
          border-radius: 16px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.25);
          animation: slideUp 0.8s ease-out;
        }

        .hero-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 56px;
          font-weight: 600;
          line-height: 1.1;
          color: #1a1612;
          margin: 0 0 20px 0;
        }

        .hero-subtitle {
          font-family: var(--font-sans);
          font-size: 18px;
          line-height: 1.6;
          color: #3d3530;
          margin: 0 0 32px 0;
        }

        .hero-button {
          display: inline-block;
          padding: 18px 48px;
          background: #a07d3d;
          color: #ffffff;
          font-family: var(--font-sans);
          font-size: 15px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          text-decoration: none;
          border-radius: 8px;
          border: none;
          box-shadow: 0 6px 20px rgba(160, 125, 61, 0.4);
          transition: all 0.3s ease;
          cursor: pointer;
        }

        .hero-button:hover {
          background: #b8904a;
          transform: translateY(-2px);
          box-shadow: 0 8px 30px rgba(160, 125, 61, 0.6);
        }

        .hero-button:active {
          transform: translateY(0);
        }

        .hero-arrow {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          background: rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(10px);
          border: 2px solid rgba(255, 255, 255, 0.3);
          width: 56px;
          height: 56px;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          transition: all 0.3s ease;
          z-index: 10;
          opacity: 0;
        }

        .hero-slider:hover .hero-arrow {
          opacity: 1;
        }

        .hero-arrow:hover {
          background: rgba(0, 0, 0, 0.7);
          border-color: rgba(255, 255, 255, 0.5);
          transform: translateY(-50%) scale(1.05);
        }

        .hero-arrow-left {
          left: 40px;
        }

        .hero-arrow-right {
          right: 40px;
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
          background: rgba(255, 255, 255, 0.8);
        }

        .hero-dot.active {
          background: white;
          width: 32px;
          border-radius: 5px;
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (max-width: 1024px) {
          .hero-title {
            font-size: 44px;
          }
          .hero-subtitle {
            font-size: 16px;
          }
        }

        @media (max-width: 768px) {
          .hero-slider {
            height: 500px;
          }

          .hero-container {
            padding: 0 24px;
          }

          .hero-content-box {
            padding: 40px 32px;
            max-width: 100%;
          }

          .hero-title {
            font-size: 36px;
          }

          .hero-subtitle {
            font-size: 15px;
            margin-bottom: 24px;
          }

          .hero-button {
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
