"use client";
import { FC, useState } from "react";
import scss from "./Order.module.scss";

type OrderStatus = "PENDING" | "PAID" | "SHIPPED" | "COMPLETED" | "CANCELED";

interface OrderItem {
  id: number;
  productTitle: string;
  quantity: number;
  price: number;
}

interface Order {
  id: number;
  status: OrderStatus;
  deliveryName: string;
  deliveryPhone: string;
  deliveryAddress: string;
  total: number;
  createdAt: string;
  items: OrderItem[];
}

const mockOrders: Order[] = [
  {
    id: 1041,
    status: "PAID",
    deliveryName: "Айгерим Бекова",
    deliveryPhone: "+996 700 112 233",
    deliveryAddress: "г. Бишкек, ул. Манаса 45, кв. 12",
    total: 13700,
    createdAt: "2024-03-15T10:22:00Z",
    items: [
      { id: 1, productTitle: "Nike Air Force 1", quantity: 1, price: 8500 },
      { id: 2, productTitle: "Levi's 501 Jeans", quantity: 1, price: 5200 },
      { id: 3, productTitle: "Levi's 501 Jeans", quantity: 1, price: 5200 },
    ],
  },
  {
    id: 1042,
    status: "PENDING",
    deliveryName: "Тимур Асанов",
    deliveryPhone: "+996 555 987 654",
    deliveryAddress: "г. Ош, ул. Ленина 10",
    total: 22000,
    createdAt: "2024-03-15T11:05:00Z",
    items: [
      { id: 3, productTitle: "Apple AirPods Pro", quantity: 1, price: 22000 },
    ],
  },
  {
    id: 1043,
    status: "SHIPPED",
    deliveryName: "Нурбек Джумалиев",
    deliveryPhone: "+996 700 333 444",
    deliveryAddress: "г. Бишкек, мкр. Аламедин 2, д. 55",
    total: 10400,
    createdAt: "2024-03-14T08:44:00Z",
    items: [
      { id: 2, productTitle: "Levi's 501 Jeans", quantity: 2, price: 5200 },
    ],
  },
  {
    id: 1044,
    status: "COMPLETED",
    deliveryName: "Зарина Омурова",
    deliveryPhone: "+996 312 445 566",
    deliveryAddress: "г. Бишкек, ул. Токтогула 88",
    total: 8500,
    createdAt: "2024-03-13T15:30:00Z",
    items: [
      { id: 1, productTitle: "Nike Air Force 1", quantity: 1, price: 8500 },
    ],
  },
  {
    id: 1045,
    status: "CANCELED",
    deliveryName: "Бакыт Молдоев",
    deliveryPhone: "+996 700 999 000",
    deliveryAddress: "г. Токмок, ул. Советская 3",
    total: 22000,
    createdAt: "2024-03-12T09:10:00Z",
    items: [
      { id: 3, productTitle: "Apple AirPods Pro", quantity: 1, price: 22000 },
    ],
  },
];

const STATUS_LABEL: Record<OrderStatus, string> = {
  PENDING: "Новый",
  PAID: "Оплачен",
  SHIPPED: "Отправлен",
  COMPLETED: "Завершён",
  CANCELED: "Отменён",
};

const STATUS_NEXT: Partial<Record<OrderStatus, OrderStatus>> = {
  PAID: "SHIPPED",
  SHIPPED: "COMPLETED",
};

const STATUS_NEXT_LABEL: Partial<Record<OrderStatus, string>> = {
  PAID: "Отметить отправленным",
  SHIPPED: "Отметить завершённым",
};

const fmt = (n: number) =>
  new Intl.NumberFormat("ru-KG", {
    style: "currency",
    currency: "KGS",
    maximumFractionDigits: 0,
  }).format(n);

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleString("ru-RU", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });

// Убрали PENDING из фильтров — "Новые" не нужны,
// все заказы и так новые по сути
const FILTERS: { label: string; value: OrderStatus | "ALL" }[] = [
  { label: "Все", value: "ALL" },
  { label: "Оплачены", value: "PAID" },
  { label: "Отправлены", value: "SHIPPED" },
  { label: "Завершены", value: "COMPLETED" },
  { label: "Отменены", value: "CANCELED" },
];

const Order: FC = () => {
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [filter, setFilter] = useState<OrderStatus | "ALL">("ALL");
  const [expanded, setExpanded] = useState<number | null>(null);

  const filtered =
    filter === "ALL" ? orders : orders.filter((o) => o.status === filter);

  const counts: Record<string, number> = { ALL: orders.length };
  orders.forEach((o) => {
    counts[o.status] = (counts[o.status] || 0) + 1;
  });

  const advance = (id: number, next: OrderStatus, e: React.MouseEvent) => {
    e.stopPropagation();
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status: next } : o)),
    );
  };

  const toggleExpand = (id: number) => setExpanded(expanded === id ? null : id);

  // Переиспользуемый блок детализации
  const renderDetail = (order: Order) => (
    <div className={scss.detail}>
      <div className={scss.detailGrid}>
        <div className={scss.detailBlock}>
          <p className={scss.dlabel}>Доставить</p>
          <p className={scss.dval}>{order.deliveryAddress}</p>
          <p className={scss.dsub}>{order.deliveryName}</p>
          <p className={scss.dsub}>{order.deliveryPhone}</p>
        </div>

        <div className={scss.detailBlock}>
          <p className={scss.dlabel}>Состав</p>
          <table className={scss.itemsTable}>
            <tbody>
              {order.items.map((item) => (
                <tr key={item.id}>
                  <td>{item.productTitle}</td>
                  <td className={scss.tdQty}>{item.quantity} шт.</td>
                  <td className={scss.tdPrice}>
                    {fmt(item.price * item.quantity)}
                  </td>
                </tr>
              ))}
              <tr className={scss.trTotal}>
                <td colSpan={2}>Итого</td>
                <td className={scss.tdPrice}>{fmt(order.total)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className={scss.detailBlock}>
          <p className={scss.dlabel}>Действие</p>
          <p className={scss.dsub}>Создан: {fmtDate(order.createdAt)}</p>
          <p className={scss.dsub}>
            Статус: <b>{STATUS_LABEL[order.status]}</b>
          </p>
          {STATUS_NEXT[order.status] && (
            <button
              className={scss.actionBtn}
              onClick={(e) => advance(order.id, STATUS_NEXT[order.status]!, e)}
            >
              {STATUS_NEXT_LABEL[order.status]}
            </button>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className={scss.Order}>
      <div className="container">
        {/* Header */}
        <header className={scss.header}>
          <div className={scss.headerLeft}>
            <h1>Заказы</h1>
          </div>
          <div className={scss.stats}>
            <div className={scss.stat}>
              <span className={scss.statNum}>{counts["PAID"] || 0}</span>
              <span className={scss.statLabel}>Надо отправить</span>
            </div>
            <div className={scss.statDivider} />
            <div className={scss.stat}>
              <span className={scss.statNum}>{counts["PENDING"] || 0}</span>
              <span className={scss.statLabel}>Ожидают оплаты</span>
            </div>
            <div className={scss.statDivider} />
            <div className={scss.stat}>
              <span className={scss.statNum}>
                {fmt(
                  orders
                    .filter((o) => o.status !== "CANCELED")
                    .reduce((s, o) => s + o.total, 0),
                )}
              </span>
              <span className={scss.statLabel}>Выручка</span>
            </div>
          </div>
        </header>

        <div className={scss.filters}>
          {FILTERS.map((f) => (
            <button
              key={f.value}
              className={`${scss.filterBtn} ${filter === f.value ? scss.filterActive : ""}`}
              onClick={() => setFilter(f.value)}
            >
              {f.label}
              {(counts[f.value] || 0) > 0 && (
                <span
                  className={`${scss.badge} ${filter === f.value ? scss.badgeActive : ""}`}
                >
                  {counts[f.value]}
                </span>
              )}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className={scss.empty}>Нет заказов</div>
        ) : (
          <div className={scss.table}>
            {/* Заголовок таблицы (desktop) */}
            <div className={scss.tableHead}>
              <span>Заказ</span>
              <span>Покупатель</span>
              <span>Товары</span>
              <span>Адрес</span>
              <span>Сумма</span>
              <span>Статус</span>
              <span />
            </div>

            {filtered.map((order) => (
              <div key={order.id} className={scss.rowWrap}>
                {/* Desktop строка */}
                <div
                  className={`${scss.row} ${expanded === order.id ? scss.rowOpen : ""}`}
                  onClick={() => toggleExpand(order.id)}
                >
                  <span className={scss.orderId}>#{order.id}</span>
                  <span className={scss.buyer}>
                    <b>{order.deliveryName}</b>
                    <small>{order.deliveryPhone}</small>
                  </span>
                  <span className={scss.items}>
                    {order.items.map((item) => (
                      <span key={item.id} className={scss.itemChip}>
                        {item.productTitle} <em>×{item.quantity}</em>
                      </span>
                    ))}
                  </span>
                  <span className={scss.address}>{order.deliveryAddress}</span>
                  <span className={scss.total}>{fmt(order.total)}</span>
                  <span
                    className={`${scss.status} ${scss[`s_${order.status}`]}`}
                  >
                    {STATUS_LABEL[order.status]}
                  </span>
                  <span className={scss.chevron}>
                    {expanded === order.id ? "▲" : "▼"}
                  </span>
                </div>

                {/* Mobile карточка */}
                <div
                  className={`${scss.mobileCard} ${expanded === order.id ? scss.mobileCardOpen : ""}`}
                  onClick={() => toggleExpand(order.id)}
                >
                  <div className={scss.mobileCardTop}>
                    <span className={scss.mobileCardId}>#{order.id}</span>
                    <div className={scss.mobileCardBuyer}>
                      <b>{order.deliveryName}</b>
                      <small>{order.deliveryPhone}</small>
                    </div>
                    <span
                      className={`${scss.status} ${scss[`s_${order.status}`]}`}
                    >
                      {STATUS_LABEL[order.status]}
                    </span>
                  </div>
                  <div className={scss.items}>
                    {order.items.map((item) => (
                      <span key={item.id} className={scss.itemChip}>
                        {item.productTitle} <em>×{item.quantity}</em>
                      </span>
                    ))}
                  </div>
                  <div className={scss.mobileCardBottom}>
                    <span className={scss.mobileCardTotal}>
                      {fmt(order.total)}
                    </span>
                    <span className={scss.mobileCardChevron}>
                      {expanded === order.id ? "▲" : "▼"}
                    </span>
                  </div>
                </div>

                {/* Detail (общий для desktop и mobile) */}
                {expanded === order.id && renderDetail(order)}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Order;
