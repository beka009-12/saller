"use client";
import { FC, useEffect, useMemo } from "react";
import {
  ShoppingBag, DollarSign, TrendingUp, Package,
  AlertTriangle, Star, Plus, ArrowRight, BarChart2,
} from "lucide-react";
import {
  motion, useMotionValue, useTransform, animate,
  useReducedMotion,
} from "motion/react";
import scss from "./Home.module.scss";
import { useRouter } from "next/navigation";
import { useGetShopsOrders } from "@/src/api/generated/endpoints/shops/shops";
import { useGetCommodityMyProducts } from "@/src/api/generated/endpoints/product/product";
import { useCurrentSeller } from "@/src/hooks/use-current-seller";

// ── Motion tokens ──────────────────────────────────────────────────────────────
const smooth: [number, number, number, number] = [0.22, 1, 0.36, 1];
const sharp:  [number, number, number, number] = [0.4, 0, 0.2, 1];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
};

const cardVariants = {
  hidden:  { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.38, ease: smooth } },
};

const rowVariants = {
  hidden:  { opacity: 0, x: -8 },
  visible: (i: number) => ({
    opacity: 1, x: 0,
    transition: { duration: 0.28, ease: smooth, delay: i * 0.05 },
  }),
};

// ── Count-up hook ──────────────────────────────────────────────────────────────
function useCountUp(target: number, format: (n: number) => string, reduce: boolean) {
  const mv = useMotionValue(0);
  const display = useTransform(mv, (v) => format(v));

  useEffect(() => {
    if (reduce) { mv.set(target); return; }
    const ctrl = animate(mv, target, { duration: 0.9, ease: "easeOut" });
    return () => ctrl.stop();
  }, [target, reduce]); // eslint-disable-line react-hooks/exhaustive-deps

  return display;
}

// ── Formatters ─────────────────────────────────────────────────────────────────
const fmtKGS = (n: number) =>
  new Intl.NumberFormat("ru-KG", {
    style: "currency", currency: "KGS", maximumFractionDigits: 0,
  }).format(n);

const fmtInt = (n: number) => Math.round(n).toString();

const STATUS_LABEL: Record<string, string> = {
  PENDING: "Ожидает", PAID: "Оплачен", PROCESSING: "В обработке",
  SHIPPED: "Отправлен", COMPLETED: "Завершён", CANCELED: "Отменён",
};

// ── Stat card ──────────────────────────────────────────────────────────────────
interface StatCardProps {
  label: string;
  value: number;
  sub: string;
  icon: FC<{ size?: number }>;
  accent?: boolean;
  format?: (n: number) => string;
}

const StatCard: FC<StatCardProps> = ({ label, value, sub, icon: Icon, accent, format = fmtKGS }) => {
  const reduce = useReducedMotion() ?? false;
  const display = useCountUp(value, format, reduce);

  return (
    <motion.div
      variants={cardVariants}
      className={`${scss.statCard} ${accent ? scss.statCardAccent : ""}`}
      whileHover={{ y: -2, transition: { duration: 0.18, ease: sharp } }}
    >
      <div className={`${scss.statIcon} ${accent ? scss.iconAccent : ""}`}>
        <Icon size={16} />
      </div>
      <div className={scss.statLabel}>{label}</div>
      <motion.div className={scss.statVal}>{display}</motion.div>
      <div className={scss.statSub}>{sub}</div>
    </motion.div>
  );
};

// ── Main component ─────────────────────────────────────────────────────────────
const Home: FC = () => {
  const router = useRouter();
  const reduce = useReducedMotion() ?? false;

  const { data: ordersData } = useGetShopsOrders();
  const { data: productsData } = useGetCommodityMyProducts();
  const { data: seller } = useCurrentSeller();

  const shop     = (seller?.user?.stores?.[0] as any) ?? null;
  const orders   = (ordersData?.orders ?? []) as any[];
  const products = productsData?.products ?? [];

  const now      = new Date();
  const todayMs  = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const weekMs   = todayMs - 6 * 24 * 60 * 60 * 1000;

  const stats = useMemo(() => {
    const active      = orders.filter((o) => o.status !== "CANCELED");
    const todayOrders = active.filter((o) => new Date(o.createdAt).getTime() >= todayMs);
    const weekOrders  = active.filter((o) => new Date(o.createdAt).getTime() >= weekMs);
    return {
      newOrders:    orders.filter((o) => o.status === "PAID").length,
      todayRevenue: todayOrders.reduce((s, o) => s + Number(o.finalAmount), 0),
      weekRevenue:  weekOrders.reduce((s, o) => s + Number(o.finalAmount), 0),
      totalProducts: products.length,
    };
  }, [orders, products, todayMs, weekMs]);

  const recentOrders     = orders.slice(0, 5);
  const lowStockProducts = products
    .filter((p) => (p.stockCount ?? 0) <= 5 && (p.stockCount ?? 0) > 0)
    .slice(0, 6);

  const rating      = shop?.rating ? Number(shop.rating) : null;
  const reviewCount = shop?._count?.reviews ?? 0;

  const ACTIONS = [
    { label: "Добавить товар", icon: Plus,      path: "/products/new", primary: true },
    { label: "Все заказы",     icon: ShoppingBag, path: "/orders" },
    { label: "Мои товары",     icon: Package,     path: "/products" },
    { label: "Аналитика",      icon: BarChart2,   path: "/analytics" },
  ];

  return (
    <div className={scss.dashboard}>

      {/* ── Header ─────────────────────────────────────────────────── */}
      <motion.div
        className={scss.pageHeader}
        initial={reduce ? false : { opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: smooth }}
      >
        <div>
          <h1>
            Панель продавца
            {shop && <span className={scss.shopTag}>{shop.name}</span>}
          </h1>
          <p>Добро пожаловать! Вот ваша статистика за сегодня</p>
        </div>
      </motion.div>

      {/* ── Stats ──────────────────────────────────────────────────── */}
      <motion.div
        className={scss.statsGrid}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <StatCard
          label="Надо отправить"
          value={stats.newOrders}
          sub="Оплаченных заказов"
          icon={ShoppingBag}
          format={fmtInt}
          accent
        />
        <StatCard
          label="Выручка сегодня"
          value={stats.todayRevenue}
          sub="За текущий день"
          icon={DollarSign}
        />
        <StatCard
          label="Выручка за 7 дней"
          value={stats.weekRevenue}
          sub="Без отменённых"
          icon={TrendingUp}
        />
        <StatCard
          label="Товаров"
          value={stats.totalProducts}
          sub="Активных в каталоге"
          icon={Package}
          format={fmtInt}
        />
      </motion.div>

      {/* ── Quick actions ───────────────────────────────────────────── */}
      <motion.div
        className={scss.actions}
        initial={reduce ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.35, delay: 0.25 }}
      >
        {ACTIONS.map(({ label, icon: Icon, path, primary }) => (
          <motion.button
            key={path}
            className={`${scss.actionBtn} ${primary ? scss.actionBtnPrimary : ""}`}
            onClick={() => router.push(path)}
            whileHover={{ scale: 1.025, transition: { duration: 0.15, ease: sharp } }}
            whileTap={reduce ? undefined : { scale: 0.96 }}
          >
            <Icon size={14} />
            {label}
            {primary && <ArrowRight size={13} className={scss.actionArrow} />}
          </motion.button>
        ))}
      </motion.div>

      {/* ── Main grid ──────────────────────────────────────────────── */}
      <div className={scss.mainGrid}>

        {/* Orders */}
        <motion.div
          className={scss.card}
          initial={reduce ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.32, ease: smooth }}
        >
          <div className={scss.cardHeader}>
            <span className={scss.cardTitle}>
              <ShoppingBag size={13} />
              Последние заказы
            </span>
            <a href="/orders" className={scss.viewAll}>
              Все заказы <ArrowRight size={11} />
            </a>
          </div>

          {recentOrders.length === 0 ? (
            <div className={scss.empty}>Заказов пока нет</div>
          ) : (
            <div className={scss.tableWrapper}>
              <table className={scss.orderTable}>
                <thead>
                  <tr>
                    {["Заказ", "Клиент", "Дата", "Сумма", "Статус"].map((h) => (
                      <th key={h}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order, i) => (
                    <motion.tr
                      key={order.id}
                      custom={i}
                      variants={rowVariants}
                      initial="hidden"
                      animate="visible"
                      whileHover={{ backgroundColor: "var(--bg-3)" }}
                    >
                      <td className={scss.orderId}>#{order.id}</td>
                      <td>{order.deliveryName}</td>
                      <td className={scss.orderDate}>
                        {new Date(order.createdAt).toLocaleString("ru-RU", {
                          day: "2-digit", month: "short",
                          hour: "2-digit", minute: "2-digit",
                        })}
                      </td>
                      <td className={scss.amount}>{fmtKGS(Number(order.finalAmount))}</td>
                      <td>
                        <span className={`${scss.status} ${scss[order.status.toLowerCase()]}`}>
                          {STATUS_LABEL[order.status] ?? order.status}
                        </span>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>

        {/* Sidebar */}
        <div>

          {/* Low stock */}
          {lowStockProducts.length > 0 && (
            <motion.div
              className={scss.card}
              initial={reduce ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.4, ease: smooth }}
            >
              <div className={scss.cardHeader}>
                <span className={scss.cardTitle}>
                  <AlertTriangle size={13} />
                  Низкий остаток
                </span>
              </div>
              <div className={scss.stockList}>
                {lowStockProducts.map((p, i) => (
                  <motion.div
                    key={p.id}
                    className={scss.stockRow}
                    custom={i}
                    variants={rowVariants}
                    initial="hidden"
                    animate="visible"
                    whileHover={{ backgroundColor: "var(--bg-3)" }}
                  >
                    <span className={scss.stockName}>{p.title}</span>
                    <span
                      className={`${scss.stockBadge} ${
                        (p.stockCount ?? 0) <= 3 ? scss.critical : scss.warning
                      }`}
                    >
                      {p.stockCount} шт
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Rating */}
          {rating !== null && (
            <motion.div
              className={scss.card}
              initial={reduce ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.46, ease: smooth }}
            >
              <div className={scss.cardHeader}>
                <span className={scss.cardTitle}>
                  <Star size={13} />
                  Рейтинг магазина
                </span>
              </div>
              <div className={scss.ratingBody}>
                <div className={scss.ratingMain}>
                  <span className={scss.ratingAvg}>{rating.toFixed(1)}</span>
                  <div className={scss.ratingMeta}>
                    <div className={scss.ratingStars}>
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          size={13}
                          className={s <= Math.round(rating) ? scss.starFilled : scss.starEmpty}
                        />
                      ))}
                    </div>
                    <span className={scss.ratingCount}>{reviewCount} отзывов</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

        </div>
      </div>
    </div>
  );
};

export default Home;
