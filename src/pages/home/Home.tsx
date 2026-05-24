"use client";
import { FC, useMemo } from "react";
import {
  ShoppingBag,
  DollarSign,
  TrendingUp,
  Monitor,
  AlertTriangle,
  Star,
  Plus,
  CreditCard,
  Package,
  Settings,
} from "lucide-react";
import scss from "./Home.module.scss";
import { useRouter } from "next/navigation";
import { useGetShopsOrders } from "@/src/api/generated/endpoints/shops/shops";
import { useGetCommodityMyProducts } from "@/src/api/generated/endpoints/product/product";
import { useCurrentSeller } from "@/src/hooks/use-current-seller";

const fmt = (n: number) =>
  new Intl.NumberFormat("ru-KG", {
    style: "currency",
    currency: "KGS",
    maximumFractionDigits: 0,
  }).format(n);

const STATUS_LABEL: Record<string, string> = {
  PENDING: "Ожидает",
  PAID: "Оплачен",
  PROCESSING: "В обработке",
  SHIPPED: "Отправлен",
  COMPLETED: "Завершён",
  CANCELED: "Отменён",
};

const Home: FC = () => {
  const router = useRouter();
  const { data: ordersData } = useGetShopsOrders();
  const { data: productsData } = useGetCommodityMyProducts();
  const { data: seller } = useCurrentSeller();

  const shop = (seller?.user?.stores?.[0] as any) ?? null;
  const orders = (ordersData?.orders ?? []) as any[];
  const products = productsData?.products ?? [];

  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const weekStart = todayStart - 6 * 24 * 60 * 60 * 1000;

  const stats = useMemo(() => {
    const active = orders.filter((o) => o.status !== "CANCELED");
    const todayOrders = active.filter((o) => new Date(o.createdAt).getTime() >= todayStart);
    const weekOrders = active.filter((o) => new Date(o.createdAt).getTime() >= weekStart);

    return {
      newOrders: orders.filter((o) => o.status === "PAID").length,
      todayRevenue: todayOrders.reduce((s, o) => s + Number(o.finalAmount), 0),
      weekRevenue: weekOrders.reduce((s, o) => s + Number(o.finalAmount), 0),
      totalProducts: products.length,
    };
  }, [orders, products, todayStart, weekStart]);

  const recentOrders = orders.slice(0, 5);

  const lowStockProducts = products
    .filter((p) => (p.stockCount ?? 0) <= 5 && (p.stockCount ?? 0) > 0)
    .slice(0, 6);

  const rating = shop?.rating ? Number(shop.rating) : null;
  const reviewCount = shop?._count?.reviews ?? 0;

  const pct = (count: number, total: number) =>
    total > 0 ? Math.round((count / total) * 100) : 0;

  return (
    <div className={scss.dashboard}>
      <div className={scss.header}>
        <div>
          <h1>Панель продавца</h1>
          <p>Добро пожаловать! Вот ваша статистика за сегодня</p>
        </div>
      </div>

        <div className={scss.statsGrid}>
          <div className={`${scss.statCard} ${scss.accentOrders}`}>
            <div className={`${scss.statIcon} ${scss.iconOrange}`}>
              <ShoppingBag size={15} />
            </div>
            <div className={scss.statLabel}>Надо отправить</div>
            <div className={scss.statVal}>{stats.newOrders}</div>
            <div className={scss.statSub}>Оплаченных заказов</div>
          </div>

          <div className={scss.statCard}>
            <div className={`${scss.statIcon} ${scss.iconBlue}`}>
              <DollarSign size={15} />
            </div>
            <div className={scss.statLabel}>Выручка сегодня</div>
            <div className={scss.statVal}>{fmt(stats.todayRevenue)}</div>
            <div className={scss.statSub}>За текущий день</div>
          </div>

          <div className={scss.statCard}>
            <div className={`${scss.statIcon} ${scss.iconGreen}`}>
              <TrendingUp size={15} />
            </div>
            <div className={scss.statLabel}>Выручка за 7 дней</div>
            <div className={scss.statVal}>{fmt(stats.weekRevenue)}</div>
            <div className={scss.statSub}>Без отменённых</div>
          </div>

          <div className={scss.statCard}>
            <div className={`${scss.statIcon} ${scss.iconPurple}`}>
              <Monitor size={15} />
            </div>
            <div className={scss.statLabel}>Товаров всего</div>
            <div className={scss.statVal}>{stats.totalProducts}</div>
            <div className={scss.statSub}>Активных в каталоге</div>
          </div>
        </div>

        <div className={scss.quickActions}>
          <button
            onClick={() => router.push("/products/new")}
            className={`${scss.actionBtn} ${scss.primary}`}
          >
            <Plus size={13} />
            Добавить товар
          </button>
          <button onClick={() => router.push("/orders")} className={scss.actionBtn}>
            <CreditCard size={13} />
            Заказы
          </button>
          <button onClick={() => router.push("/products")} className={scss.actionBtn}>
            <Package size={13} />
            Мои товары
          </button>
          <button onClick={() => router.push("/settings")} className={scss.actionBtn}>
            <Settings size={13} />
            Настройки
          </button>
        </div>

        <div className={scss.mainGrid}>
          <div>
            <div className={scss.card}>
              <div className={scss.cardHeader}>
                <h2>
                  <ShoppingBag size={12} />
                  Последние заказы
                </h2>
                <a href="/orders" className={scss.viewAll}>
                  Все заказы →
                </a>
              </div>
              {recentOrders.length === 0 ? (
                <div style={{ padding: "16px 0", fontSize: 13, color: "#888" }}>
                  Заказов пока нет
                </div>
              ) : (
                <div className={scss.tableWrapper}>
                  <table className={scss.orderTable}>
                    <thead>
                      <tr>
                        <th>Заказ</th>
                        <th>Клиент</th>
                        <th>Дата</th>
                        <th>Сумма</th>
                        <th>Статус</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentOrders.map((order) => (
                        <tr key={order.id}>
                          <td className={scss.orderId}>#{order.id}</td>
                          <td>{order.deliveryName}</td>
                          <td className={scss.orderDate}>
                            {new Date(order.createdAt).toLocaleString("ru-RU", {
                              day: "2-digit",
                              month: "short",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </td>
                          <td className={scss.amount}>{fmt(Number(order.finalAmount))}</td>
                          <td>
                            <span
                              className={`${scss.status} ${scss[order.status.toLowerCase()]}`}
                            >
                              {STATUS_LABEL[order.status] ?? order.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          <div>
            <div className={scss.card}>
              <div className={scss.cardHeader}>
                <h2>
                  <AlertTriangle size={12} />
                  Товары на контроле
                </h2>
              </div>
              {lowStockProducts.length === 0 ? (
                <div style={{ padding: "8px 0", fontSize: 13, color: "#888" }}>
                  Все товары в норме
                </div>
              ) : (
                <>
                  <div className={scss.alertBanner}>
                    <AlertTriangle size={13} />
                    Низкий остаток — пополните склад
                  </div>
                  <div className={scss.stockList}>
                    {lowStockProducts.map((p) => (
                      <div key={p.id} className={scss.stockRow}>
                        <span className={scss.stockName}>{p.title}</span>
                        <span
                          className={`${scss.stockBadge} ${
                            (p.stockCount ?? 0) <= 3 ? scss.critical : scss.warning
                          }`}
                        >
                          {p.stockCount} шт
                        </span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>

            {rating !== null && (
              <div className={scss.card}>
                <div className={scss.cardHeader}>
                  <h2>
                    <Star size={12} />
                    Рейтинг магазина
                  </h2>
                </div>
                <div className={scss.ratingBody}>
                  <div className={scss.ratingTop}>
                    <span className={scss.ratingAvg}>{rating.toFixed(1)}</span>
                    <div className={scss.ratingMeta}>
                      <div className={scss.ratingStars}>
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star
                            key={s}
                            size={13}
                            className={
                              s <= Math.round(rating) ? scss.starFilled : scss.starEmpty
                            }
                          />
                        ))}
                      </div>
                      <span className={scss.ratingTotal}>{reviewCount} отзывов</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
    </div>
  );
};

export default Home;
