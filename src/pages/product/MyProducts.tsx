"use client";
import { FC, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { Plus, Search, SlidersHorizontal, Package } from "lucide-react";
import scss from "./MyProducts.module.scss";
import UpdateModal from "@/src/ui/card-buttons/updateModal/UpdateModal";
import ProductCard from "@/src/components/product/ProductCard";
import { useGetCommodityMyProducts } from "@/src/api/generated/endpoints/product/product";

type Status = "all" | "in_stock" | "low_stock" | "out_of_stock";
type Sort   = "newest" | "oldest" | "price_high" | "price_low" | "popular";

const STATUS_OPTS: { value: Status; label: string }[] = [
  { value: "all",           label: "Все" },
  { value: "in_stock",      label: "В наличии" },
  { value: "low_stock",     label: "Мало" },
  { value: "out_of_stock",  label: "Нет" },
];

const SORT_OPTS: { value: Sort; label: string }[] = [
  { value: "newest",     label: "Новые" },
  { value: "oldest",     label: "Старые" },
  { value: "price_high", label: "Дорогие" },
  { value: "price_low",  label: "Дешёвые" },
  { value: "popular",    label: "Популярные" },
];

const smooth: [number,number,number,number] = [0.22, 1, 0.36, 1];

const MyProducts: FC = () => {
  const router  = useRouter();
  const reduce  = useReducedMotion() ?? false;
  const { data, isLoading } = useGetCommodityMyProducts();

  const [search,            setSearch]            = useState("");
  const [status,            setStatus]            = useState<Status>("all");
  const [sort,              setSort]              = useState<Sort>("newest");
  const [editingProductId,  setEditingProductId]  = useState<number | null>(null);
  const [sortOpen,          setSortOpen]          = useState(false);

  const products = data?.products ?? [];

  const filtered = useMemo(() => {
    let list = [...products] as any[];

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (p) =>
          p.title?.toLowerCase().includes(q) ||
          p.brandName?.toLowerCase().includes(q)
      );
    }

    if (status !== "all") {
      list = list.filter((p) => {
        const s = p.stockCount ?? 0;
        if (status === "in_stock")     return s > 5;
        if (status === "low_stock")    return s > 0 && s <= 5;
        if (status === "out_of_stock") return s === 0;
        return true;
      });
    }

    list.sort((a, b) => {
      if (sort === "newest")     return (b.id ?? 0) - (a.id ?? 0);
      if (sort === "oldest")     return (a.id ?? 0) - (b.id ?? 0);
      if (sort === "price_high") return Number(b.price ?? 0) - Number(a.price ?? 0);
      if (sort === "price_low")  return Number(a.price ?? 0) - Number(b.price ?? 0);
      if (sort === "popular")    return (b.soldCount ?? 0) - (a.soldCount ?? 0);
      return 0;
    });

    return list;
  }, [products, search, status, sort]);

  const currentSortLabel = SORT_OPTS.find((o) => o.value === sort)?.label ?? "Сортировка";

  return (
    <div className={scss.page}>

      {/* ── Header ─────────────────────────────────────── */}
      <motion.div
        className={scss.pageHeader}
        initial={reduce ? false : { opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: smooth }}
      >
        <div>
          <h1>
            Мои товары
            {!isLoading && (
              <span className={scss.countPill}>{products.length}</span>
            )}
          </h1>
          <p>Управление каталогом вашего магазина</p>
        </div>
        <motion.button
          className={scss.addBtn}
          onClick={() => router.push("/products/new")}
          whileHover={{ scale: 1.025, transition: { duration: 0.15 } }}
          whileTap={reduce ? undefined : { scale: 0.96 }}
        >
          <Plus size={14} />
          Добавить товар
        </motion.button>
      </motion.div>

      {/* ── Filters ────────────────────────────────────── */}
      <motion.div
        className={scss.filterBar}
        initial={reduce ? false : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.1, ease: smooth }}
      >
        {/* Search */}
        <div className={scss.searchWrap}>
          <Search size={14} className={scss.searchIcon} />
          <input
            className={scss.searchInput}
            placeholder="Поиск по названию или бренду…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Status pills */}
        <div className={scss.statusGroup}>
          {STATUS_OPTS.map(({ value, label }) => {
            const count = value === "all" ? products.length :
              products.filter((p: any) => {
                const s = p.stockCount ?? 0;
                if (value === "in_stock")     return s > 5;
                if (value === "low_stock")    return s > 0 && s <= 5;
                if (value === "out_of_stock") return s === 0;
                return false;
              }).length;

            return (
              <motion.button
                key={value}
                className={`${scss.filterPill} ${status === value ? scss.filterPillActive : ""}`}
                onClick={() => setStatus(value)}
                whileTap={reduce ? undefined : { scale: 0.94 }}
              >
                {label}
                <span className={scss.pillCount}>{count}</span>
              </motion.button>
            );
          })}
        </div>

        {/* Sort dropdown */}
        <div className={scss.sortWrap}>
          <motion.button
            className={`${scss.sortBtn} ${sortOpen ? scss.sortBtnOpen : ""}`}
            onClick={() => setSortOpen((o) => !o)}
            whileTap={reduce ? undefined : { scale: 0.96 }}
          >
            <SlidersHorizontal size={13} />
            {currentSortLabel}
          </motion.button>

          <AnimatePresence>
            {sortOpen && (
              <motion.div
                className={scss.sortDropdown}
                initial={{ opacity: 0, y: -6, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -6, scale: 0.97 }}
                transition={{ duration: 0.18, ease: smooth }}
              >
                {SORT_OPTS.map(({ value, label }) => (
                  <button
                    key={value}
                    className={`${scss.sortOption} ${sort === value ? scss.sortOptionActive : ""}`}
                    onClick={() => { setSort(value); setSortOpen(false); }}
                  >
                    {label}
                    {sort === value && <span className={scss.sortCheck}>✓</span>}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* ── Results count ──────────────────────────────── */}
      <AnimatePresence>
        {(search || status !== "all") && (
          <motion.div
            className={scss.resultsLine}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            Найдено: <strong>{filtered.length}</strong>
            <button className={scss.resetBtn} onClick={() => { setSearch(""); setStatus("all"); }}>
              Сбросить
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Grid ───────────────────────────────────────── */}
      {isLoading ? (
        <div className={scss.grid}>
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className={scss.skeleton} />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <motion.div
          className={scss.emptyState}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Package size={36} className={scss.emptyIcon} />
          <p>{search || status !== "all" ? "Товары не найдены" : "Нет товаров. Добавьте первый!"}</p>
        </motion.div>
      ) : (
        <motion.div
          className={scss.grid}
          initial="hidden"
          animate="visible"
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.055 } } }}
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onEdit={(id) => setEditingProductId(id)}
                reduce={reduce}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {editingProductId && (
        <UpdateModal
          productId={editingProductId}
          onClose={() => setEditingProductId(null)}
        />
      )}
    </div>
  );
};

export default MyProducts;
