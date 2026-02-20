import { FC } from "react";
import {
  CreditCard,
  ShoppingBag,
  Star,
  Plus,
  Package,
  Settings,
  AlertTriangle,
  Wallet,
} from "lucide-react";
import scss from "./Home.module.scss";

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

const Home: FC = () => {
  return (
    <main className={scss.dashboard}>
      <div className="container">
        <div className={scss.header}>
          <h1 className={scss.title}>Панель продавца</h1>
          <p className={scss.subtitle}>
            Добро пожаловать! Вот ваша статистика за сегодня
          </p>
        </div>

        {/* Метрики */}
        <div className={scss.statsGrid}>
          <div className={scss.statCard}>
            <div className={scss.statIcon}>
              <CreditCard size={24} />
            </div>
            <div className={scss.statValue}>{stats.todayOrders}</div>
            <div className={scss.statLabel}>Заказов сегодня</div>
          </div>

          <div className={scss.statCard}>
            <div className={scss.statIcon}>
              <Wallet size={24} />
            </div>
            <div className={scss.statValue}>
              {stats.todayRevenue.toLocaleString()} с
            </div>
            <div className={scss.statLabel}>Выручка сегодня</div>
          </div>

          <div className={scss.statCard}>
            <div className={scss.statIcon}>
              <ShoppingBag size={24} />
            </div>
            <div className={scss.statValue}>{stats.totalProducts}</div>
            <div className={scss.statLabel}>Товаров в магазине</div>
          </div>

          <div className={scss.statCard}>
            <div className={scss.statIcon}>
              <Star size={24} />
            </div>
            <div className={scss.statValue}>{stats.rating}</div>
            <div className={scss.statLabel}>{stats.reviewsCount} отзывов</div>
          </div>
        </div>

        {/* Быстрые действия */}
        <section className={scss.quickActionsSection}>
          <div className={scss.quickActions}>
            <button className={scss.actionBtn}>
              <span className={scss.actionIcon}>
                <Plus size={20} />
              </span>
              Добавить товар
            </button>

            <button className={scss.actionBtn}>
              <span className={scss.actionIcon}>
                <CreditCard size={20} />
              </span>
              Заказы
            </button>

            <button className={scss.actionBtn}>
              <span className={scss.actionIcon}>
                <Package size={20} />
              </span>
              Мои товары
            </button>

            <button className={scss.actionBtn}>
              <span className={scss.actionIcon}>
                <Settings size={20} />
              </span>
              Настройки
            </button>
          </div>
        </section>

        {/* MAIN GRID */}
        <div className={scss.mainGrid}>
          {/* LEFT - Последние заказы */}
          <div className={scss.leftColumn}>
            <section className={scss.cardSection}>
              <div className={scss.cardHeader}>
                <h2>Последние заказы</h2>
                <a href="#" className={scss.viewAll}>
                  Все заказы →
                </a>
              </div>

              <div className={scss.tableWrapper}>
                <table className={scss.orderTable}>
                  <thead>
                    <tr>
                      <th>ID Заказа</th>
                      <th>Клиент</th>
                      <th>Сумма</th>
                      <th>Статус</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.map((order) => (
                      <tr key={order.id}>
                        <td className={scss.orderId}>{order.id}</td>
                        <td>{order.customer}</td>
                        <td className={scss.amount}>
                          {order.amount.toLocaleString()} с
                        </td>
                        <td>
                          <span
                            className={`${scss.status} ${
                              scss[order.status.toLowerCase()]
                            }`}
                          >
                            {order.status === "PENDING"
                              ? "Ожидает"
                              : order.status === "PAID"
                                ? "Оплачен"
                                : "Отправлен"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>

          {/* RIGHT - Товары на контроле */}
          <div className={scss.rightColumn}>
            <section className={scss.cardSection}>
              <div className={scss.cardHeader}>
                <h2>
                  <AlertTriangle size={20} />
                  Товары на контроле
                </h2>
              </div>
              <div className={scss.lowStockAlert}>
                <p className={scss.alertText}>
                  У вас есть товары с низким остатком. Пополните склад, чтобы не
                  потерять продажи.
                </p>
              </div>
              <div className={scss.lowStockList}>
                {lowStockProducts.map((product, i) => (
                  <div key={i} className={scss.lowStockItem}>
                    <div className={scss.productInfo}>
                      <div className={scss.productName}>{product.name}</div>
                      <div className={scss.stockBadge}>
                        <span
                          className={`${scss.stockCount} ${
                            product.stock <= 3 ? scss.critical : scss.warning
                          }`}
                        >
                          Осталось: {product.stock} шт
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Home;
