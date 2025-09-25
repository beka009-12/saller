"use client";
import { type FC, useState } from "react";
import scss from "./Home.module.scss";
import CountUp from "@/utils/anim/CountUp";

const Home: FC = () => {
  return (
    <section className={scss.Home}>
      <div className={scss.content}>
        {/* Статистика */}
        <div className={scss.stats}>
          <div className={scss.card}>
            <div className={scss.cardHeader}>
              <div className={scss.iconWrapper}>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <span className={scss.trend}>+12%</span>
            </div>
            <h3>
              <CountUp
                from={0}
                to={30}
                separator=","
                direction="up"
                duration={2}
              />
            </h3>
            <p>Мои товары</p>
          </div>

          <div className={scss.card}>
            <div className={scss.cardHeader}>
              <div className={scss.iconWrapper}>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                </svg>
              </div>
              <span className={scss.trend}>+25%</span>
            </div>
            <h3>
              <CountUp
                from={0}
                to={100}
                separator=","
                direction="up"
                duration={2}
              />
            </h3>
            <p>Новых заказов</p>
          </div>

          <div className={scss.card}>
            <div className={scss.cardHeader}>
              <div className={scss.iconWrapper}>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                </svg>
              </div>
              <span className={scss.trend}>+8%</span>
            </div>
            <h3>
              <CountUp
                from={0}
                to={70}
                separator=","
                direction="up"
                duration={2}
              />
            </h3>
            <p>Отзывы</p>
          </div>

          <div className={scss.card}>
            <div className={scss.cardHeader}>
              <div className={scss.iconWrapper}>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className={scss.trend}>+18%</span>
            </div>
            <h3>
              <CountUp
                from={0}
                to={45000}
                separator=","
                direction="up"
                duration={2}
              />
              <span className={scss.currency}>сом</span>
            </h3>
            <p>Доход за месяц</p>
          </div>
        </div>

        {/* Основной контент */}
        <div className={scss.mainContent}>
          {/* Быстрые действия */}
          <div className={scss.quickActions}>
            <h2>Быстрые действия</h2>
            <div className={scss.actions}>
              <button className={scss.btnPrimary}>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                Добавить товар
              </button>
              <button className={scss.btnSecondary}>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
                </svg>
                Посмотреть заказы
              </button>
              <button className={scss.btnSecondary}>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                </svg>
                Проверить отзывы
              </button>
            </div>
          </div>

          {/* Последние заказы */}
          <div className={scss.ordersSection}>
            <div className={scss.sectionHeader}>
              <h2>Последние заказы</h2>
              <button className={scss.viewAll}>Посмотреть все</button>
            </div>
            <div className={scss.ordersList}>
              <div className={scss.orderItem}>
                <div className={scss.orderInfo}>
                  <div className={scss.orderNumber}>#1045</div>
                  <div className={scss.orderDetails}>
                    <span>Смартфон Samsung Galaxy</span>
                    <span className={scss.orderTime}>2 часа назад</span>
                  </div>
                </div>
                <div className={scss.orderAmount}>45,000 сом</div>
                <div className={`${scss.orderStatus} ${scss.processing}`}>
                  В обработке
                </div>
              </div>

              <div className={scss.orderItem}>
                <div className={scss.orderInfo}>
                  <div className={scss.orderNumber}>#1044</div>
                  <div className={scss.orderDetails}>
                    <span>Наушники Apple AirPods</span>
                    <span className={scss.orderTime}>5 часов назад</span>
                  </div>
                </div>
                <div className={scss.orderAmount}>18,000 сом</div>
                <div className={`${scss.orderStatus} ${scss.delivered}`}>
                  Доставлен
                </div>
              </div>

              <div className={scss.orderItem}>
                <div className={scss.orderInfo}>
                  <div className={scss.orderNumber}>#1043</div>
                  <div className={scss.orderDetails}>
                    <span>Планшет iPad Air</span>
                    <span className={scss.orderTime}>1 день назад</span>
                  </div>
                </div>
                <div className={scss.orderAmount}>35,000 сом</div>
                <div className={`${scss.orderStatus} ${scss.cancelled}`}>
                  Отменён
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Home;
