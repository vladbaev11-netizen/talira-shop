'use client';

import { useState } from 'react';
import ArrivalsWidget from './ArrivalsWidget';
import ShippingSchedule from './ShippingSchedule';

interface FilterProps {
  onFilterChange: (filters: {
    category: string;
    priceRange: string;
    inStock: boolean;
  }) => void;
}

export default function HomeFilters({ onFilterChange }: FilterProps) {
  const [category, setCategory] = useState('all');
  const [priceRange, setPriceRange] = useState('all');
  const [inStock, setInStock] = useState(false);

  const handleFilterChange = (
    newCategory?: string,
    newPriceRange?: string,
    newInStock?: boolean
  ) => {
    const updatedCategory = newCategory ?? category;
    const updatedPriceRange = newPriceRange ?? priceRange;
    const updatedInStock = newInStock ?? inStock;

    setCategory(updatedCategory);
    setPriceRange(updatedPriceRange);
    setInStock(updatedInStock);

    onFilterChange({
      category: updatedCategory,
      priceRange: updatedPriceRange,
      inStock: updatedInStock,
    });
  };

  return (
    <div className="sidebar-wrapper">
      
      {/* Поступление товаров */}
      <ArrivalsWidget />

      {/* График отправлений */}
      <ShippingSchedule />

      {/* Фильтры */}
      <div className="filters-sidebar">
        <h3 className="filters-title">Фільтри</h3>

        {/* Категорії */}
        <div className="filter-group">
          <h4 className="filter-label">Категорія</h4>
          <div className="filter-options">
            <label className="filter-option">
              <input
                type="radio"
                name="category"
                value="all"
                checked={category === 'all'}
                onChange={(e) => handleFilterChange(e.target.value, undefined, undefined)}
              />
              <span>Всі товари</span>
            </label>
            <label className="filter-option">
              <input
                type="radio"
                name="category"
                value="krasa"
                checked={category === 'krasa'}
                onChange={(e) => handleFilterChange(e.target.value, undefined, undefined)}
              />
              <span>Краса</span>
            </label>
            <label className="filter-option">
              <input
                type="radio"
                name="category"
                value="zdorovia"
                checked={category === 'zdorovia'}
                onChange={(e) => handleFilterChange(e.target.value, undefined, undefined)}
              />
              <span>Здоров'я</span>
            </label>
            <label className="filter-option">
              <input
                type="radio"
                name="category"
                value="dim"
                checked={category === 'dim'}
                onChange={(e) => handleFilterChange(e.target.value, undefined, undefined)}
              />
              <span>Для дому</span>
            </label>
            <label className="filter-option">
              <input
                type="radio"
                name="category"
                value="elektronika"
                checked={category === 'elektronika'}
                onChange={(e) => handleFilterChange(e.target.value, undefined, undefined)}
              />
              <span>Електроніка</span>
            </label>
          </div>
        </div>

        {/* Ціна */}
        <div className="filter-group">
          <h4 className="filter-label">Ціна</h4>
          <div className="filter-options">
            <label className="filter-option">
              <input
                type="radio"
                name="price"
                value="all"
                checked={priceRange === 'all'}
                onChange={(e) => handleFilterChange(undefined, e.target.value, undefined)}
              />
              <span>Будь-яка</span>
            </label>
            <label className="filter-option">
              <input
                type="radio"
                name="price"
                value="0-1000"
                checked={priceRange === '0-1000'}
                onChange={(e) => handleFilterChange(undefined, e.target.value, undefined)}
              />
              <span>До 1000 грн</span>
            </label>
            <label className="filter-option">
              <input
                type="radio"
                name="price"
                value="1000-3000"
                checked={priceRange === '1000-3000'}
                onChange={(e) => handleFilterChange(undefined, e.target.value, undefined)}
              />
              <span>1000 - 3000 грн</span>
            </label>
            <label className="filter-option">
              <input
                type="radio"
                name="price"
                value="3000-5000"
                checked={priceRange === '3000-5000'}
                onChange={(e) => handleFilterChange(undefined, e.target.value, undefined)}
              />
              <span>3000 - 5000 грн</span>
            </label>
            <label className="filter-option">
              <input
                type="radio"
                name="price"
                value="5000+"
                checked={priceRange === '5000+'}
                onChange={(e) => handleFilterChange(undefined, e.target.value, undefined)}
              />
              <span>Від 5000 грн</span>
            </label>
          </div>
        </div>

        {/* Наявність */}
        <div className="filter-group">
          <h4 className="filter-label">Наявність</h4>
          <label className="filter-checkbox">
            <input
              type="checkbox"
              checked={inStock}
              onChange={(e) => handleFilterChange(undefined, undefined, e.target.checked)}
            />
            <span>Тільки в наявності</span>
          </label>
        </div>
      </div>

      <style jsx>{`
        .sidebar-wrapper {
          display: flex;
          flex-direction: column;
          gap: 24px;
          position: sticky;
          top: 100px;
        }

        .filters-sidebar {
          background: #ffffff;
          border: 1px solid var(--line, #e0d4ba);
          border-radius: 8px;
          padding: 24px;
        }

        .filters-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 24px;
          font-weight: 600;
          color: var(--text-dark, #1a1612);
          margin: 0 0 24px 0;
        }

        .filter-group {
          margin-bottom: 28px;
          padding-bottom: 28px;
          border-bottom: 1px solid var(--line, #e0d4ba);
        }

        .filter-group:last-child {
          margin-bottom: 0;
          padding-bottom: 0;
          border-bottom: none;
        }

        .filter-label {
          font-family: var(--font-sans);
          font-size: 14px;
          font-weight: 600;
          color: var(--text-dark, #1a1612);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin: 0 0 16px 0;
        }

        .filter-options {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .filter-option {
          display: flex;
          align-items: center;
          gap: 10px;
          cursor: pointer;
          font-family: var(--font-sans);
          font-size: 15px;
          color: var(--text, #3d3530);
          transition: color 0.2s ease;
        }

        .filter-option:hover {
          color: var(--gold-deep, #a07d3d);
        }

        .filter-option input[type="radio"] {
          width: 18px;
          height: 18px;
          cursor: pointer;
          accent-color: var(--gold-deep, #a07d3d);
        }

        .filter-checkbox {
          display: flex;
          align-items: center;
          gap: 10px;
          cursor: pointer;
          font-family: var(--font-sans);
          font-size: 15px;
          color: var(--text, #3d3530);
        }

        .filter-checkbox input[type="checkbox"] {
          width: 18px;
          height: 18px;
          cursor: pointer;
          accent-color: var(--gold-deep, #a07d3d);
        }

        @media (max-width: 1024px) {
          .sidebar-wrapper {
            position: static;
          }
        }
      `}</style>
    </div>
  );
}
