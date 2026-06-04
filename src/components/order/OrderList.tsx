'use client';
import { FC } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingBag } from 'lucide-react';
import OrderListItem, { type ShopOrder } from './OrderListItem';

const smooth: [number, number, number, number] = [0.22, 1, 0.36, 1];

interface Props {
  orders: ShopOrder[];
  selectedId: number | null;
  onSelect: (id: number) => void;
  loading: boolean;
  reduce: boolean;
}

const OrderList: FC<Props> = ({ orders, selectedId, onSelect, loading, reduce }) => {
  if (loading) {
    return (
      <div style={{ padding: '24px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            style={{
              height: 60,
              borderRadius: 8,
              background: 'linear-gradient(90deg, var(--bg-3) 25%, var(--bg-4) 50%, var(--bg-3) 75%)',
              backgroundSize: '200% 100%',
              animation: 'shimmer 1.4s infinite',
            }}
          />
        ))}
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div
        style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          justifyContent: 'center', padding: '48px 24px', gap: 10,
          color: 'var(--text-2)', fontSize: 13, textAlign: 'center',
        }}
      >
        <ShoppingBag size={32} style={{ opacity: 0.3 }} />
        <p style={{ margin: 0 }}>Заказов нет</p>
      </div>
    );
  }

  return (
    <AnimatePresence mode="popLayout">
      {orders.map((order, i) => (
        <motion.div
          key={order.id}
          initial={reduce ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0, transition: { duration: 0.28, delay: i * 0.05, ease: smooth } }}
          exit={{ opacity: 0, transition: { duration: 0.15 } }}
          layout={!reduce}
        >
          <OrderListItem
            order={order}
            isSelected={selectedId === order.id}
            onClick={() => onSelect(order.id)}
            reduce={reduce}
          />
        </motion.div>
      ))}
    </AnimatePresence>
  );
};

export default OrderList;
