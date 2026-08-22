"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import AnnouncementBar from "@/components/AnnouncementBar";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import FilterSidebar, {
  DEFAULT_FILTERS,
  type Filters,
} from "@/components/shop/FilterSidebar";
import Toolbar, { type SortKey } from "@/components/shop/Toolbar";
import { type Category, type Product } from "@/lib/products";

const PAGE_SIZE = 8;

function ShopContent() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category") as Category | null;
  const filterParam = searchParams.get("filter");
  const isNewParam = filterParam === "new";
  const isSaleParam = filterParam === "sale";

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<Filters>(() => ({
    ...DEFAULT_FILTERS,
    categories: categoryParam ? [categoryParam] : [],
  }));
  const [sort, setSort] = useState<SortKey>("featured");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => setProducts(data.products ?? []))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    setFilters({
      ...DEFAULT_FILTERS,
      categories: categoryParam ? [categoryParam] : [],
    });
    setVisibleCount(PAGE_SIZE);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryParam]);

  const filtered = useMemo(() => {
    let list = products.filter((p) => {
      if (
        filters.categories.length &&
        !filters.categories.includes(p.category)
      )
        return false;
      if (filters.sizes.length && !p.sizes.some((s) => filters.sizes.includes(s)))
        return false;
      if (
        filters.colors.length &&
        !p.colors.some((c) => filters.colors.includes(c.name))
      )
        return false;
      if (p.price > filters.maxPrice) return false;
      if (isNewParam && !p.isNew) return false;
      if (isSaleParam && !p.compareAt) return false;
      return true;
    });

    switch (sort) {
      case "price-asc":
        list = [...list].sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        list = [...list].sort((a, b) => b.price - a.price);
        break;
      case "newest":
        list = [...list].sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        break;
    }

    return list;
  }, [products, filters, sort, isNewParam, isSaleParam]);

  const visible = filtered.slice(0, visibleCount);
  const pageTitle = isNewParam
    ? "New Arrivals"
    : isSaleParam
    ? "Sale"
    : filters.categories.length === 1
    ? filters.categories[0]
    : "The Edit";

  function handleFilterChange(next: Filters) {
    setFilters(next);
    setVisibleCount(PAGE_SIZE);
  }

  return (
    <>
      <AnnouncementBar />
      <Header />

      <main className="w-full mx-auto max-w-7xl px-6 lg:px-10 py-12">
        <p className="text-xs text-stone mb-3">
          <span>Home</span> <span className="mx-1.5">/</span>{" "}
          <span className="text-ink">{pageTitle}</span>
        </p>
        <h1 className="font-display text-4xl mb-10">{pageTitle}</h1>

        <div className="lg:grid lg:grid-cols-[240px_1fr] lg:gap-12">
          <aside className="hidden lg:block">
            <FilterSidebar filters={filters} onChange={handleFilterChange} />
          </aside>

          <div>
            <Toolbar
              count={filtered.length}
              sort={sort}
              onSortChange={setSort}
              view={view}
              onViewChange={setView}
              onOpenFilters={() => setMobileFiltersOpen(true)}
            />

            {loading ? (
              <div className="py-24 text-center text-sm text-stone">Loading…</div>
            ) : visible.length === 0 ? (
              <div className="py-24 text-center">
                <p className="font-display text-2xl mb-2">No pieces match</p>
                <p className="text-sm text-stone mb-6">
                  Try adjusting or clearing your filters.
                </p>
                <button
                  onClick={() => handleFilterChange(DEFAULT_FILTERS)}
                  className="text-xs tracking-luxe uppercase border-b border-ink pb-0.5"
                >
                  Clear filters
                </button>
              </div>
            ) : view === "grid" ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-10">
                {visible.map((product, i) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: (i % PAGE_SIZE) * 0.05 }}
                  >
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </div>
            ) : (
              <div>
                {visible.map((product) => (
                  <ProductCard key={product.id} product={product} variant="list" />
                ))}
              </div>
            )}

            {visibleCount < filtered.length ? (
              <div className="flex justify-center mt-14">
                <button
                  onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
                  className="text-xs tracking-luxe uppercase border border-ink px-10 py-3.5 hover:bg-ink hover:text-ivory transition-colors duration-300"
                >
                  Load More
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </main>

      <AnimatePresence>
        {mobileFiltersOpen ? (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileFiltersOpen(false)}
              className="fixed inset-0 bg-ink/40 z-50 lg:hidden"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="fixed inset-y-0 left-0 w-[85%] max-w-sm bg-ivory z-50 overflow-y-auto p-6 lg:hidden"
            >
              <FilterSidebar
                filters={filters}
                onChange={handleFilterChange}
                onClose={() => setMobileFiltersOpen(false)}
              />
            </motion.div>
          </>
        ) : null}
      </AnimatePresence>

      <Footer />
    </>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={null}>
      <ShopContent />
    </Suspense>
  );
}
