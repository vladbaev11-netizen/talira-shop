'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

interface FiltersProps {
  onFilterChange?: (filters: FilterState) => void;
}

interface FilterState {
  priceMin: number;
  priceMax: number;
  inStock: boolean;
  onSale: boolean;
  isNew: boolean;
  isHit: boolean;
}

export default function CatalogFilters({ onFilterChange }: FiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [filters, setFilters] = useState<FilterState>({
    priceMin: 0,
    priceMax: 50000,
    inStock: false,
    onSale: false,
    isNew: false,
    isHit: false
  });

  const [priceRange, setPriceRange] = useState({ min: 0, max: 50000 });

  // Синхронизация с URL
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    
    setFilters({
      priceMin: Number(params.get('priceMin')) || 0,
      priceMax: Number(params.get('priceMax')) || 50000,
      inStock: params.get('inStock') === 'true',
      onSale: params.get('onSale') === 'true',
      isNew: params.get('isNew') === 'true',
      isHit: params.get('isHit') === 'true'
    });
  }, [searchParams]);

  const updateFilters = (newFilters: Partial<FilterState>) => {
    const updated = { ...filters, ...newFilters };
    setFilters(updated);

    // Обновляем URL
    const params = new URLSearchParams(searchParams.toString());
    
    Object.entries(updated).forEach(([key, value]) => {
      if (value && value !== 0 && value !== 50000) {
        params.set(key, String(value));
      } else {
        params.delete(key);
      }
    });

    router.push(`?${params.toString()}`, { scroll: false });
    onFilterChange?.(updated);
  };

  const resetFilters = () => {
    const reset: FilterState = {
      priceMin: 0,
      priceMax: 50000,
      inStock: false,
      onSale: false,
      isNew: false,
      isHit: false
    };
    setFilters(reset);
    setPriceRange({ min: 0, max: 50000 });
    router.push(window.location.pathname, { scroll: false });
    onFilterChange?.(reset);
  };

  const activeFiltersCount = Object.values(filters).filter(v => 
    typeof v === 'boolean' ? v : (v !== 0 && v !== 50000)
  ).length;

  return (
    <div className="catalog-filters">
      <div className="filters-header">
        <h3 className="filters-title">Фільтри</h3>
        {activeFiltersCount > 0 && (
          <button onClick={resetFilters} className="filters-reset">
            Скинути ({activeFiltersCount})
          </button>
        )}
      </div>

      {/* Ціна */}
      <div className="filter-group">
        <div className="filter-label">Ціна, ₴</div>
        <div className="price-inputs">
          <input
            type="number"
            value={priceRange.min}
            onChange={(e) => setPriceRange({ ...priceRange, min: Number(e.target.value) })}
            onBlur={() => updateFilters({ priceMin: priceRange.min })}
            placeholder="Від"
            className="price-input"
          />
          <span>—</span>
          <input
            type="number"
            value={priceRange.max}
            onChange={(e) => setPriceRange({ ...priceRange, max: Number(e.target.value) })}
            onBlur={() => updateFilters({ priceMax: priceRange.max })}
            placeholder="До"
            className="price-input"
          />
        </div>
        <input
          type="range"
          min="0"
          max="50000"
          step="100"
          value={priceRange.max}
          onChange={(e) => {
            const val = Number(e.target.value);
            setPriceRange({ ...priceRange, max: val });
            updateFilters({ priceMax: val });
          }}
          className="price-slider"
        />
      </div>

      {/* Чекбоксы */}
      <div className="filter-group">
        <label className="filter-checkbox">
          <input
            type="checkbox"
            checked={filters.inStock}
            onChange={(e) => updateFilters({ inStock: e.target.checked })}
          />
          <span className="checkbox-label">В наявності</span>
        </label>

        <label className="filter-checkbox">
          <input
            type="checkbox"
            checked={filters.onSale}
            onChange={(e) => updateFilters({ onSale: e.target.checked })}
          />
          <span className="checkbox-label">Зі знижкою</span>
        </label>

        <label className="filter-checkbox">
          <input
            type="checkbox"
            checked={filters.isHit}
            onChange={(e) => updateFilters({ isHit: e.target.checked })}
          />
          <span className="checkbox-label">Хіт продажів</span>
        </label>

        <label className="filter-checkbox">
          <input
            type="checkbox"
            checked={filters.isNew}
            onChange={(e) => updateFilters({ isNew: e.target.checked })}
          />
          <span className="checkbox-label">Новинка</span>
        </label>
      </div>

      <style jsx>{`
        .catalog-filters {
          background: var(--bg-main, white);
          border: 1px solid var(--line, #e0d4ba);
          border-radius: 12px;
          padding: 24px;
          position: sticky;
          top: 100px;
        }

        .filters-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
          padding-bottom: 16px;
          border-bottom: 1px solid var(--line);
        }

        .filters-title {
          font-family: var(--font-sans);
          font-size: 18px;
          font-weight: 600;
          margin: 0;
          color: var(--text-main);
        }

        .filters-reset {
          background: none;
          border: none;
          color: var(--gold-deep, #a07d3d);
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          text-decoration: underline;
        }

        .filters-reset:hover {
          color: #8a6a2f;
        }

        .filter-group {
          margin-bottom: 24px;
        }

        .filter-group:last-child {
          margin-bottom: 0;
        }

        .filter-label {
          font-weight: 500;
          margin-bottom: 12px;
          color: var(--text-main);
        }

        .price-inputs {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 12px;
        }

        .price-input {
          flex: 1;
          padding: 10px 12px;
          border: 1px solid var(--line);
          border-radius: 6px;
          font-family: var(--font-sans);
          font-size: 14px;
          color: var(--text-main);
        }

        .price-input:focus {
          outline: none;
          border-color: var(--gold-deep);
        }

        .price-slider {
          width: 100%;
          height: 6px;
          -webkit-appearance: none;
          appearance: none;
          background: var(--line);
          border-radius: 3px;
          outline: none;
        }

        .price-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 18px;
          height: 18px;
          background: var(--gold-deep);
          border-radius: 50%;
          cursor: pointer;
        }

        .price-slider::-moz-range-thumb {
          width: 18px;
          height: 18px;
          background: var(--gold-deep);
          border-radius: 50%;
          cursor: pointer;
          border: none;
        }

        .filter-checkbox {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 0;
          cursor: pointer;
          user-select: none;
        }

        .filter-checkbox input[type="checkbox"] {
          width: 20px;
          height: 20px;
          cursor: pointer;
          accent-color: var(--gold-deep);
        }

        .checkbox-label {
          font-size: 15px;
          color: var(--text-main);
        }

        @media (max-width: 1024px) {
          .catalog-filters {
            position: static;
          }
        }
      `}</style>
    </div>
  );
}
