"use client";

import { LayoutGrid, List, SlidersHorizontal } from "lucide-react";

export type SortKey = "featured" | "price-asc" | "price-desc" | "newest";

const SORT_LABELS: Record<SortKey, string> = {
  featured: "Featured",
  "price-asc": "Price: Low to High",
  "price-desc": "Price: High to Low",
  newest: "Newest",
};

export default function Toolbar({
  count,
  sort,
  onSortChange,
  view,
  onViewChange,
  onOpenFilters,
}: {
  count: number;
  sort: SortKey;
  onSortChange: (sort: SortKey) => void;
  view: "grid" | "list";
  onViewChange: (view: "grid" | "list") => void;
  onOpenFilters: () => void;
}) {
  return (
    <div className="flex items-center justify-between border-b border-line pb-4 mb-8">
      <button
        onClick={onOpenFilters}
        className="lg:hidden flex items-center gap-2 text-xs tracking-luxe uppercase"
      >
        <SlidersHorizontal size={15} strokeWidth={1.5} />
        Filters
      </button>

      <p className="hidden lg:block text-xs text-stone">
        {count} {count === 1 ? "piece" : "pieces"}
      </p>

      <div className="flex items-center gap-5">
        <select
          value={sort}
          onChange={(e) => onSortChange(e.target.value as SortKey)}
          className="text-xs tracking-wide uppercase bg-transparent border-none focus:outline-none cursor-pointer"
        >
          {(Object.keys(SORT_LABELS) as SortKey[]).map((key) => (
            <option key={key} value={key}>
              {SORT_LABELS[key]}
            </option>
          ))}
        </select>

        <div className="hidden sm:flex items-center gap-2">
          <button
            aria-label="Grid view"
            onClick={() => onViewChange("grid")}
            className={view === "grid" ? "text-ink" : "text-stone hover:text-ink"}
          >
            <LayoutGrid size={17} strokeWidth={1.5} />
          </button>
          <button
            aria-label="List view"
            onClick={() => onViewChange("list")}
            className={view === "list" ? "text-ink" : "text-stone hover:text-ink"}
          >
            <List size={17} strokeWidth={1.5} />
          </button>
        </div>
      </div>
    </div>
  );
}
