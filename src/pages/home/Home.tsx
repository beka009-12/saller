"use client";
import { FC } from "react";
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

const stats = {
  newOrders: 12,
  newOrdersSub: "+3 за последний час",
  todayRevenue: 45890,
  todayRevenueSub: "↑ 12% к вчера",
  weekRevenue: 287400,
  weekRevenueSub: "↑ 5% к прошлой неделе",
  totalProducts: 48,
  totalProductsSub: "5 на модерации",
};

const ratingData = {
  average: 4.7,
  total: 142,
  breakdown: [
    { star: 5, count: 89 },
    { star: 4, count: 31 },
    { star: 3, count: 14 },
    { star: 2, count: 5 },
    { star: 1, count: 3 },
  ],
};

const recentOrders = [
  {
    id: "ORD-12345",
    customer: "Айбек",
    date: "Сегодня 14:22",
    status: "PENDING",
    amount: 8900,
  },
  {
    id: "ORD-12344",
    customer: "Гулзат",
    date: "Сегодня 12:05",
    status: "PAID",
    amount: 14500,
  },
  {
    id: "ORD-12342",
    customer: "Асел",
    date: "Вчера 18:44",
    status: "PENDING",
    amount: 12400,
  },
  {
    id: "ORD-12340",
    customer: "Канат",
    date: "Вчера 11:30",
    status: "PAID",
    amount: 6200,
  },
  {
    id: "ORD-12338",
    customer: "Жансая",
    date: "17 апр 09:15",
    status: "PENDING",
    amount: 19800,
  },
];

const lowStockProducts = [
  { name: "Смартфон чехол Premium", stock: 3 },
  { name: "Наушники TWS Airpods", stock: 2 },
  { name: "USB-C кабель 65W", stock: 4 },
  { name: "Защитное стекло iPhone", stock: 5 },
];

const STATUS_LABEL: Record<string, string> = {
  PENDING: "Ожидает",
  PAID: "Оплачен",
};

const fmt = (n: number) =>
  new Intl.NumberFormat("ru-KG", {
    style: "currency",
    currency: "KGS",
    maximumFractionDigits: 0,
  }).format(n);

const pct = (count: number) => Math.round((count / ratingData.total) * 100);

const Home: FC = () => {
  const router = useRouter();

  return (
    <main className={scss.dashboard}>
      <div className="container">
        {/* Header */}
        <div className={scss.header}>
          <div>
            <h1>Панель продавца</h1>
            <p>Добро пожаловать! Вот ваша статистика за сегодня</p>
          </div>
        </div>

        {/* Stats grid — 4 карточки */}
        <div className={scss.statsGrid}>
          <div className={`${scss.statCard} ${scss.accentOrders}`}>
            <div className={`${scss.statIcon} ${scss.iconOrange}`}>
              <ShoppingBag size={15} />
            </div>
            <div className={scss.statLabel}>Новые заказы</div>
            <div className={scss.statVal}>{stats.newOrders}</div>
            <div className={scss.statSub}>{stats.newOrdersSub}</div>
          </div>

          <div className={scss.statCard}>
            <div className={`${scss.statIcon} ${scss.iconBlue}`}>
              <DollarSign size={15} />
            </div>
            <div className={scss.statLabel}>Выручка сегодня</div>
            <div className={scss.statVal}>{fmt(stats.todayRevenue)}</div>
            <div className={scss.statSub}>{stats.todayRevenueSub}</div>
          </div>

          <div className={scss.statCard}>
            <div className={`${scss.statIcon} ${scss.iconGreen}`}>
              <TrendingUp size={15} />
            </div>
            <div className={scss.statLabel}>Выручка за 7 дней</div>
            <div className={scss.statVal}>{fmt(stats.weekRevenue)}</div>
            <div className={scss.statSub}>{stats.weekRevenueSub}</div>
          </div>

          <div className={scss.statCard}>
            <div className={`${scss.statIcon} ${scss.iconPurple}`}>
              <Monitor size={15} />
            </div>
            <div className={scss.statLabel}>Товаров всего</div>
            <div className={scss.statVal}>{stats.totalProducts}</div>
            <div className={scss.statSub}>{stats.totalProductsSub}</div>
          </div>
        </div>

        {/* Quick actions */}
        <div className={scss.quickActions}>
          <button
            onClick={() => router.push("/products/new")}
            className={`${scss.actionBtn} ${scss.primary}`}
          >
            <Plus size={13} />
            Добавить товар
          </button>
          <button
            onClick={() => router.push("/orders")}
            className={scss.actionBtn}
          >
            <CreditCard size={13} />
            Заказы
          </button>
          <button
            onClick={() => router.push("/products")}
            className={scss.actionBtn}
          >
            <Package size={13} />
            Мои товары
          </button>
          <button
            onClick={() => router.push("/settings")}
            className={scss.actionBtn}
          >
            <Settings size={13} />
            Настройки
          </button>
        </div>

        {/* Main grid */}
        <div className={scss.mainGrid}>
          {/* LEFT — заказы требующие внимания */}
          <div>
            <div className={scss.card}>
              <div className={scss.cardHeader}>
                <h2>
                  <ShoppingBag size={12} />
                  Заказы, требующие внимания
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
                      <th>Дата</th>
                      <th>Сумма</th>
                      <th>Статус</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.map((order) => (
                      <tr key={order.id}>
                        <td className={scss.orderId}>
                          #{order.id.split("-")[1]}
                        </td>
                        <td>{order.customer}</td>
                        <td className={scss.orderDate}>{order.date}</td>
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
                        <td>
                          <button
                            className={scss.processBtn}
                            onClick={() => router.push(`/orders/${order.id}`)}
                          >
                            Обработать
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* RIGHT — низкий остаток + рейтинг */}
          <div>
            {/* Товары на контроле */}
            <div className={scss.card}>
              <div className={scss.cardHeader}>
                <h2>
                  <AlertTriangle size={12} />
                  Товары на контроле
                </h2>
              </div>
              <div className={scss.alertBanner}>
                <AlertTriangle size={13} />
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

            {/* Рейтинг магазина */}
            <div className={scss.card}>
              <div className={scss.cardHeader}>
                <h2>
                  <Star size={12} />
                  Рейтинг магазина
                </h2>
              </div>
              <div className={scss.ratingBody}>
                <div className={scss.ratingTop}>
                  <span className={scss.ratingAvg}>{ratingData.average}</span>
                  <div className={scss.ratingMeta}>
                    <div className={scss.ratingStars}>
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          size={13}
                          className={
                            s <= Math.round(ratingData.average)
                              ? scss.starFilled
                              : scss.starEmpty
                          }
                        />
                      ))}
                    </div>
                    <span className={scss.ratingTotal}>
                      {ratingData.total} отзывов
                    </span>
                  </div>
                </div>
                <div className={scss.ratingBreakdown}>
                  {ratingData.breakdown.map(({ star, count }) => (
                    <div key={star} className={scss.ratingRow}>
                      <span className={scss.ratingRowLabel}>{star}</span>
                      <div className={scss.ratingBar}>
                        <div
                          className={scss.ratingBarFill}
                          style={{ width: `${pct(count)}%` }}
                        />
                      </div>
                      <span className={scss.ratingRowCount}>{count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Home;
