'use client';
import { FC } from 'react';
import { motion } from 'motion/react';
import scss from './OrderListItem.module.scss';
import type { OrderStatus } from '@/src/api/generated/models';

export interface ShopOrderItem {
  id: number;
  priceAtBuy: number;
  quantity: number;
  product: { id: number; title: string; price: number; newPrice?: number | null };
}

export interface ShopOrder {
  id: number;
  status: OrderStatus;
  createdAt: string;
  finalAmount: number;
  deliveryName: string;
  deliveryPhone: string;
  deliveryAddress: string;
  deliveryMethod?: string;
  items: ShopOrderItem[];
}

const fmt = (n: number) =>
  new Intl.NumberFormat('ru-KG', { style: 'currency', currency: 'KGS', maximumFractionDigits: 0 }).format(n);

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleString('ru-RU', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });

const STATUS_LABEL: Record<OrderStatus, string> = {
  PENDING: 'Ожидает оплаты',
  PAID: 'Надо отправить',
  PROCESSING: 'В обработке',
  SHIPPED: 'В пути',
  COMPLETED: 'Завершён',
  CANCELED: 'Отменён',
};

interface Props {
  order: ShopOrder;
  isSelected: boolean;
  onClick: () => void;
  reduce: boolean;
}

const smooth: [number, number, number, number] = [0.22, 1, 0.36, 1];

const OrderListItem: FC<Props> = ({ order, isSelected, onClick, reduce }) => {
  const itemSummary = order.items.map(i => i.product.title).join(', ');

  return (
    <motion.div
      className={`${scss.item} ${isSelected ? scss.active : ''} ${order.status === 'CANCELED' ? scss.canceled : ''}`}
      onClick={onClick}
      whileHover={reduce ? undefined : { backgroundColor: 'var(--bg-3)' }}
      layout={!reduce}
    >
      <div className={scss.row1}>
        <span className={scss.id}>#{order.id}</span>
        <span className={scss.name}>{order.deliveryName}</span>
        <span className={`${scss.status} ${scss[order.status]}`}>
          {STATUS_LABEL[order.status]}
        </span>
      </div>
      <div className={scss.row2}>
        <span className={scss.items}>{itemSummary}</span>
        <span className={scss.amount}>{fmt(Number(order.finalAmount))}</span>
        <span className={scss.date}>{fmtDate(order.createdAt)}</span>
      </div>
    </motion.div>
  );
};

export default OrderListItem;
