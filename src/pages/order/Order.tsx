"use client";
import { FC, useState } from "react";
import scss from "./Order.module.scss";
import { useGetShopsOrders, usePatchShopsOrdersOrderIdAdvance } from "@/src/api/generated/endpoints/shops/shops";
import type { OrderStatus } from "@/src/api/generated/models";
import toast from "react-hot-toast";

interface ShopOrderItem {
  id: number;
  priceAtBuy: number;
  quantity: number;
  product: { id: number; title: string; price: number; newPrice?: number | null };
}

interface ShopOrder {
  id: number;
  status: OrderStatus;
  createdAt: string;
  finalAmount: number;
  deliveryName: string;
  deliveryPhone: string;
  deliveryAddress: string;
  items: ShopOrderItem[];
}

const STATUS_LABEL: Record<OrderStatus, string> = {
  PENDING: "Новый",
  PAID: "Оплачен",
  PROCESSING: "В обработке",
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

const FILTERS: { label: string; value: OrderStatus | "ALL" }[] = [
  { label: "Все", value: "ALL" },
  { label: "Оплачены", value: "PAID" },
  { label: "Отправлены", value: "SHIPPED" },
  { label: "Завершены", value: "COMPLETED" },
  { label: "Отменены", value: "CANCELED" },
];

const Order: FC = () => {
  const [filter, setFilter] = useState<OrderStatus | "ALL">("ALL");
  const [expanded, setExpanded] = useState<number | null>(null);

  const { data, isLoading } = useGetShopsOrders(
    filter !== "ALL" ? { status: filter as OrderStatus } : undefined,
  );
  const { mutate: advance, isPending: advancing } = usePatchShopsOrdersOrderIdAdvance();

  const orders = (data?.orders ?? []) as ShopOrder[];

  const counts: Record<string, number> = {};
  const { data: allData } = useGetShopsOrders();
  ((allData?.orders ?? []) as ShopOrder[]).forEach((o) => {
    counts[o.status] = (counts[o.status] || 0) + 1;
  });
  counts["ALL"] = allData?.total ?? 0;

  const handleAdvance = (orderId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    advance({ orderId }, {
      onSuccess: () => toast.success("Статус обновлён"),
      onError: () => toast.error("Ошибка при обновлении статуса"),
    });
  };

  const toggleExpand = (id: number) => setExpanded(expanded === id ? null : id);

  const renderDetail = (order: ShopOrder) => (
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
                  <td>{item.product.title}</td>
                  <td className={scss.tdQty}>{item.quantity} шт.</td>
                  <td className={scss.tdPrice}>
                    {fmt(Number(item.priceAtBuy) * item.quantity)}
                  </td>
                </tr>
              ))}
              <tr className={scss.trTotal}>
                <td colSpan={2}>Итого</td>
                <td className={scss.tdPrice}>{fmt(Number(order.finalAmount))}</td>
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
              disabled={advancing}
              onClick={(e) => handleAdvance(order.id, e)}
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
                  ((allData?.orders ?? []) as ShopOrder[])
                    .filter((o) => o.status !== "CANCELED")
                    .reduce((s, o) => s + Number(o.finalAmount), 0),
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

        {isLoading ? (
          <div className={scss.empty}>Загрузка...</div>
        ) : orders.length === 0 ? (
          <div className={scss.empty}>Нет заказов</div>
        ) : (
          <div className={scss.table}>
            <div className={scss.tableHead}>
              <span>Заказ</span>
              <span>Покупатель</span>
              <span>Товары</span>
              <span>Адрес</span>
              <span>Сумма</span>
              <span>Статус</span>
              <span />
            </div>

            {orders.map((order) => (
              <div key={order.id} className={scss.rowWrap}>
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
                        {item.product.title} <em>×{item.quantity}</em>
                      </span>
                    ))}
                  </span>
                  <span className={scss.address}>{order.deliveryAddress}</span>
                  <span className={scss.total}>{fmt(Number(order.finalAmount))}</span>
                  <span className={`${scss.status} ${scss[`s_${order.status}`]}`}>
                    {STATUS_LABEL[order.status]}
                  </span>
                  <span className={scss.chevron}>
                    {expanded === order.id ? "▲" : "▼"}
                  </span>
                </div>

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
                    <span className={`${scss.status} ${scss[`s_${order.status}`]}`}>
                      {STATUS_LABEL[order.status]}
                    </span>
                  </div>
                  <div className={scss.items}>
                    {order.items.map((item) => (
                      <span key={item.id} className={scss.itemChip}>
                        {item.product.title} <em>×{item.quantity}</em>
                      </span>
                    ))}
                  </div>
                  <div className={scss.mobileCardBottom}>
                    <span className={scss.mobileCardTotal}>
                      {fmt(Number(order.finalAmount))}
                    </span>
                    <span className={scss.mobileCardChevron}>
                      {expanded === order.id ? "▲" : "▼"}
                    </span>
                  </div>
                </div>

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
