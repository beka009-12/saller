"use client";
import { FC } from "react";
import {
  CreditCard,
  ShoppingBag,
  Plus,
  Package,
  Settings,
  AlertTriangle,
} from "lucide-react";
import scss from "./Home.module.scss";
import { useRouter } from "next/navigation";

const stats = {
  todayOrders: 12,
  todayRevenue: 45890,
  totalProducts: 48,
  rating: 4.7,
  reviewsCount: 142,
};

const recentOrders = [
  { id: "ORD-12345", customer: "Айбек", status: "PENDING", amount: 8900 },
  { id: "ORD-12344", customer: "Гулзат", status: "PAID", amount: 14500 },
  { id: "ORD-12343", customer: "Нурсултан", status: "SHIPPED", amount: 3200 },
  { id: "ORD-12342", customer: "Асел", status: "PENDING", amount: 12400 },
];

const lowStockProducts = [
  { name: "Смартфон чехол Premium", stock: 3 },
  { name: "Наушники TWS Airpods", stock: 2 },
  { name: "USB-C кабель 65W", stock: 4 },
  { name: "Защитное стекло iPhone", stock: 7 },
];

const STATUS_LABEL: Record<string, string> = {
  PENDING: "Ожидает",
  PAID: "Оплачен",
  SHIPPED: "Отправлен",
};

const fmt = (n: number) =>
  new Intl.NumberFormat("ru-KG", {
    style: "currency",
    currency: "KGS",
    maximumFractionDigits: 0,
  }).format(n);

const Home: FC = () => {
  const router = useRouter();

  return (
    <main className={scss.dashboard}>
      <div className="container">
        {/* Header + stats */}
        <div className={scss.header}>
          <div className={scss.headerLeft}>
            <h1>Панель продавца</h1>
            <p>Добро пожаловать! Вот ваша статистика за сегодня</p>
          </div>

          <div className={scss.statsBar}>
            <div className={scss.statItem}>
              <span className={scss.statNum}>{stats.todayOrders}</span>
              <span className={scss.statLabel}>Заказов сегодня</span>
            </div>
            <div className={scss.statDivider} />
            <div className={scss.statItem}>
              <span className={scss.statNum}>{fmt(stats.todayRevenue)}</span>
              <span className={scss.statLabel}>Выручка сегодня</span>
            </div>
            <div className={scss.statDivider} />
            <div className={scss.statItem}>
              <span className={scss.statNum}>{stats.totalProducts}</span>
              <span className={scss.statLabel}>Товаров</span>
            </div>
            <div className={scss.statDivider} />
            <div className={scss.statItem}>
              <span className={scss.statNum}>{stats.rating}</span>
              <span className={scss.statLabel}>
                {stats.reviewsCount} отзывов
              </span>
            </div>
          </div>
        </div>

        {/* Quick actions */}
        <div className={scss.quickActions}>
          <button
            onClick={() => router.push("/products/new")}
            className={`${scss.actionBtn} ${scss.primary}`}
          >
            <Plus size={14} />
            Добавить товар
          </button>
          <button
            onClick={() => router.push("/orders")}
            className={scss.actionBtn}
          >
            <CreditCard size={14} />
            Заказы
          </button>
          <button
            onClick={() => router.push("/products")}
            className={scss.actionBtn}
          >
            <Package size={14} />
            Мои товары
          </button>
          <button
            onClick={() => router.push("/settings")}
            className={scss.actionBtn}
          >
            <Settings size={14} />
            Настройки
          </button>
        </div>

        {/* Main grid */}
        <div className={scss.mainGrid}>
          {/* LEFT — последние заказы */}
          <div>
            <div className={scss.card}>
              <div className={scss.cardHeader}>
                <h2>
                  <ShoppingBag size={14} />
                  Последние заказы
                </h2>
                <a href="/orders" className={scss.viewAll}>
                  Все заказы →
                </a>
              </div>
              <div className={scss.tableWrapper}>
                <table className={scss.orderTable}>
                  <thead>
                    <tr>
                      <th>Заказ</th>
                      <th>Клиент</th>
                      <th>Сумма</th>
                      <th>Статус</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.map((order) => (
                      <tr key={order.id}>
                        <td className={scss.orderId}>
                          #{order.id.split("-")[1]}
                        </td>
                        <td>{order.customer}</td>
                        <td className={scss.amount}>{fmt(order.amount)}</td>
                        <td>
                          <span
                            className={`${scss.status} ${
                              scss[order.status.toLowerCase()]
                            }`}
                          >
                            {STATUS_LABEL[order.status]}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* RIGHT — низкий остаток */}
          <div>
            <div className={scss.card}>
              <div className={scss.cardHeader}>
                <h2>
                  <AlertTriangle size={14} />
                  Товары на контроле
                </h2>
              </div>
              <div className={scss.alertBanner}>
                <AlertTriangle size={14} />
                Низкий остаток — пополните склад, чтобы не потерять продажи
              </div>
              <div className={scss.stockList}>
                {lowStockProducts.map((p, i) => (
                  <div key={i} className={scss.stockRow}>
                    <span className={scss.stockName}>{p.name}</span>
                    <span
                      className={`${scss.stockBadge} ${
                        p.stock <= 3 ? scss.critical : scss.warning
                      }`}
                    >
                      {p.stock} шт
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Home;
