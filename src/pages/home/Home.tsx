import { FC } from "react";
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

const recentReviews = [
  {
    id: 1,
    product: "Смартфон Samsung Galaxy A54",
    customer: "Айбек М.",
    rating: 5,
    text: "Отличный телефон! Быстрая доставка, все в идеальном состоянии. Продавец очень отзывчивый, ответил на все вопросы.",
    date: "Сегодня, 14:30",
  },
  {
    id: 2,
    product: "Наушники TWS Airpods Pro",
    customer: "Гулзат К.",
    rating: 4,
    text: "Хороший звук и качество. Немного долго шла доставка, но товар соответствует описанию.",
    date: "Вчера, 18:20",
  },
  {
    id: 3,
    product: "Чехол для iPhone 14",
    customer: "Нурбек А.",
    rating: 5,
    text: "Качественный чехол, сидит идеально. Спасибо продавцу!",
    date: "2 дня назад",
  },
];

const lowStockProducts = [
  { name: "Смартфон чехол Premium", stock: 3, status: "critical" },
  { name: "Наушники TWS Airpods", stock: 2, status: "critical" },
  { name: "USB-C кабель 65W", stock: 4, status: "warning" },
  { name: "Защитное стекло iPhone", stock: 7, status: "warning" },
  { name: "Power Bank 20000mAh", stock: 5, status: "warning" },
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
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                width="24"
                height="24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z"
                />
              </svg>
            </div>
            <div className={scss.statValue}>{stats.todayOrders}</div>
            <div className={scss.statLabel}>Заказов сегодня</div>
          </div>

          <div className={scss.statCard}>
            <div className={scss.statIcon}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                width="24"
                height="24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z"
                />
              </svg>
            </div>
            <div className={scss.statValue}>
              {stats.todayRevenue.toLocaleString()} с
            </div>
            <div className={scss.statLabel}>Выручка сегодня</div>
          </div>

          <div className={scss.statCard}>
            <div className={scss.statIcon}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                width="24"
                height="24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                />
              </svg>
            </div>
            <div className={scss.statValue}>{stats.totalProducts}</div>
            <div className={scss.statLabel}>Товаров в магазине</div>
          </div>

          <div className={scss.statCard}>
            <div className={scss.statIcon}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                width="24"
                height="24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"
                />
              </svg>
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
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  width="20"
                  height="20"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 4.5v15m7.5-7.5h-15"
                  />
                </svg>
              </span>
              Добавить товар
            </button>

            <button className={scss.actionBtn}>
              <span className={scss.actionIcon}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  width="20"
                  height="20"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12"
                  />
                </svg>
              </span>
              Все заказы
            </button>

            <button className={scss.actionBtn}>
              <span className={scss.actionIcon}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  width="20"
                  height="20"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 0 1-.825-.242m9.345-8.334a2.126 2.126 0 0 0-.476-.095 48.64 48.64 0 0 0-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0 0 11.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155"
                  />
                </svg>
              </span>
              Сообщения
            </button>

            <button className={scss.actionBtn}>
              <span className={scss.actionIcon}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  width="20"
                  height="20"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0 1 18 16.5h-2.25m-7.5 0h7.5m-7.5 0-1 3m8.5-3 1 3m0 0 .5 1.5m-.5-1.5h-9.5m0 0-.5 1.5m.75-9 3-3 2.148 2.148A12.061 12.061 0 0 1 16.5 7.605"
                  />
                </svg>
              </span>
              Аналитика
            </button>
          </div>
        </section>

        {/* MAIN GRID */}
        <div className={scss.mainGrid}>
          {/* LEFT */}
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

            {/* Отзывы - подробно */}
            <section className={scss.cardSection}>
              <div className={scss.cardHeader}>
                <h2>Последние отзывы</h2>
                <a href="#" className={scss.viewAll}>
                  Все отзывы →
                </a>
              </div>

              <div className={scss.reviewsList}>
                {recentReviews.map((review) => (
                  <div key={review.id} className={scss.reviewCard}>
                    <div className={scss.reviewHeader}>
                      <div className={scss.reviewMeta}>
                        <div className={scss.reviewStars}>
                          {"⭐".repeat(review.rating)}
                        </div>
                        <span className={scss.reviewDate}>{review.date}</span>
                      </div>
                    </div>
                    <div className={scss.reviewProduct}>{review.product}</div>
                    <div className={scss.reviewText}>{review.text}</div>
                    <div className={scss.reviewCustomer}>
                      — {review.customer}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* RIGHT */}
          <div className={scss.rightColumn}>
            {/* Товары на контроле */}
            <section className={scss.cardSection}>
              <div className={scss.cardHeader}>
                <h2>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    width="20"
                    height="20"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
                    />
                  </svg>
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
                          className={`${scss.stockCount} ${scss[product.status]}`}
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
