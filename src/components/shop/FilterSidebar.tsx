"use client";

import { X } from "lucide-react";
import { ALL_COLORS, ALL_SIZES, CATEGORIES, MAX_PRICE, type Category } from "@/lib/products";

export type Filters = {
  categories: Category[];
  sizes: string[];
  colors: string[];
  maxPrice: number;
};

export const DEFAULT_FILTERS: Filters = {
  categories: [],
  sizes: [],
  colors: [],
  maxPrice: MAX_PRICE,
};

function toggle<T>(list: T[], value: T): T[] {
  return list.includes(value)
    ? list.filter((v) => v !== value)
    : [...list, value];
}

function FilterGroup({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="py-6 border-b border-line first:pt-0">
      <h3 className="text-xs tracking-luxe uppercase mb-4">{title}</h3>
      {children}
    </div>
  );
}

export default function FilterSidebar({
  filters,
  onChange,
  onClose,
}: {
  filters: Filters;
  onChange: (filters: Filters) => void;
  onClose?: () => void;
}) {
  const activeCount =
    filters.categories.length +
    filters.sizes.length +
    filters.colors.length +
    (filters.maxPrice < MAX_PRICE ? 1 : 0);

  return (
    <div>
      <div className="flex items-center justify-between mb-2 lg:hidden">
        <h2 className="font-display text-xl">Filters</h2>
        <button aria-label="Close filters" onClick={onClose}>
          <X size={20} />
        </button>
      </div>

      <FilterGroup title="Category">
        <ul className="space-y-3">
          {CATEGORIES.map((cat) => (
            <li key={cat}>
              <label className="flex items-center gap-3 text-sm cursor-pointer group">
                <input
                  type="checkbox"
                  checked={filters.categories.includes(cat)}
                  onChange={() =>
                    onChange({
                      ...filters,
                      categories: toggle(filters.categories, cat),
                    })
                  }
                  className="h-4 w-4 accent-[#1a1815]"
                />
                <span className="text-charcoal group-hover:text-ink transition-colors">
                  {cat}
                </span>
              </label>
            </li>
          ))}
        </ul>
      </FilterGroup>

      <FilterGroup title="Size">
        <div className="flex flex-wrap gap-2">
          {ALL_SIZES.map((size) => {
            const active = filters.sizes.includes(size);
            return (
              <button
                key={size}
                onClick={() =>
                  onChange({ ...filters, sizes: toggle(filters.sizes, size) })
                }
                className={`text-xs px-3 py-2 border transition-colors ${
                  active
                    ? "border-ink bg-ink text-ivory"
                    : "border-line text-charcoal hover:border-ink"
                }`}
              >
                {size}
              </button>
            );
          })}
        </div>
      </FilterGroup>

      <FilterGroup title="Color">
        <div className="flex flex-wrap gap-3">
          {ALL_COLORS.map((color) => {
            const active = filters.colors.includes(color.name);
            return (
              <button
                key={color.name}
                aria-label={color.name}
                title={color.name}
                onClick={() =>
                  onChange({
                    ...filters,
                    colors: toggle(filters.colors, color.name),
                  })
                }
                className={`h-7 w-7 rounded-full border-2 transition-all ${
                  active ? "border-gold" : "border-transparent"
                }`}
                style={{ backgroundColor: color.hex }}
              />
            );
          })}
        </div>
      </FilterGroup>

      <FilterGroup title="Price">
        <input
          type="range"
          min={0}
          max={MAX_PRICE}
          step={500}
          value={filters.maxPrice}
          onChange={(e) =>
            onChange({ ...filters, maxPrice: Number(e.target.value) })
          }
          className="w-full accent-[#b18a52]"
        />
        <div className="flex justify-between text-xs text-stone mt-2">
          <span>₹0</span>
          <span>₹{filters.maxPrice.toLocaleString("en-IN")}</span>
        </div>
      </FilterGroup>

      {activeCount > 0 ? (
        <button
          onClick={() => onChange(DEFAULT_FILTERS)}
          className="mt-6 text-xs tracking-luxe uppercase border-b border-ink pb-0.5"
        >
          Clear all ({activeCount})
        </button>
      ) : null}
    </div>
  );
}
