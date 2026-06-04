'use client';
import { FC } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Package, SendHorizontal, CheckCheck, XCircle } from 'lucide-react';
import {
  usePatchShopsOrdersOrderIdAdvance,
  getGetShopsOrdersQueryKey,
} from '@/src/api/generated/endpoints/shops/shops';
import { useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import type { ShopOrder } from './OrderListItem';
import scss from './OrderPanel.module.scss';
import type { OrderStatus } from '@/src/api/generated/models';

const fmt = (n: number) =>
  new Intl.NumberFormat('ru-KG', { style: 'currency', currency: 'KGS', maximumFractionDigits: 0 }).format(n);

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleString('ru-RU', { day: '2-digit', month: 'long', hour: '2-digit', minute: '2-digit' });

const STATUS_LABEL: Record<OrderStatus, string> = {
  PENDING: 'Ожидает оплаты',
  PAID: 'Надо отправить',
  PROCESSING: 'В обработке',
  SHIPPED: 'В пути',
  COMPLETED: 'Завершён',
  CANCELED: 'Отменён',
};

const STATUS_NEXT_LABEL: Partial<Record<OrderStatus, string>> = {
  PAID: 'Отметить отправленным',
  SHIPPED: 'Отметить завершённым',
};

const smooth: [number, number, number, number] = [0.22, 1, 0.36, 1];

interface Props {
  order: ShopOrder | null;
  reduce: boolean;
}

const OrderPanel: FC<Props> = ({ order, reduce }) => {
  const queryClient = useQueryClient();
  const { mutate: advance, isPending } = usePatchShopsOrdersOrderIdAdvance();

  const handleAdvance = () => {
    if (!order) return;
    advance(
      { orderId: order.id },
      {
        onSuccess: () => {
          toast.success('Статус обновлён');
          queryClient.invalidateQueries({ queryKey: getGetShopsOrdersQueryKey() });
        },
        onError: () => toast.error('Ошибка при обновлении статуса'),
      }
    );
  };

  if (!order) {
    return (
      <div className={scss.empty}>
        <Package size={36} className={scss.emptyIcon} />
        <p>Выберите заказ из списка</p>
      </div>
    );
  }

  const nextLabel = STATUS_NEXT_LABEL[order.status];
  const isCanceled = order.status === 'CANCELED';

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={order.id}
        className={scss.panel}
        initial={reduce ? false : { opacity: 0, x: 12 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.22, ease: smooth }}
      >
        <div className={scss.header}>
          <div>
            <div className={scss.orderId}>Заказ #{order.id}</div>
            <div className={scss.orderDate}>{fmtDate(order.createdAt)}</div>
          </div>
          <span className={`${scss.statusPill} ${scss[order.status]}`}>
            {STATUS_LABEL[order.status]}
          </span>
        </div>

        <div className={scss.section}>
          <div className={scss.sectionLabel}>Покупатель</div>
          <div className={scss.sectionValue}>{order.deliveryName}</div>
          <div className={scss.sectionSub}>{order.deliveryPhone}</div>
        </div>

        <div className={scss.section}>
          <div className={scss.sectionLabel}>Адрес доставки</div>
          <div className={scss.sectionValue}>{order.deliveryAddress}</div>
        </div>

        <div className={scss.section}>
          <div className={scss.sectionLabel}>Состав заказа</div>
          <table className={scss.itemsTable}>
            <tbody>
              {order.items.map((item) => (
                <tr key={item.id} className={scss.itemRow}>
                  <td className={scss.itemTitle}>{item.product.title}</td>
                  <td className={scss.itemQty}>×{item.quantity}</td>
                  <td className={scss.itemPrice}>
                    {fmt(Number(item.priceAtBuy) * item.quantity)}
                  </td>
                </tr>
              ))}
              <tr className={scss.totalRow}>
                <td colSpan={2}>Итого</td>
                <td className={scss.totalAmount}>{fmt(Number(order.finalAmount))}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {nextLabel && (
          <motion.button
            className={scss.actionBtn}
            onClick={handleAdvance}
            disabled={isPending}
            whileHover={reduce ? undefined : { scale: 1.02, transition: { duration: 0.15 } }}
            whileTap={reduce ? undefined : { scale: 0.97 }}
          >
            {order.status === 'PAID' ? <SendHorizontal size={15} /> : <CheckCheck size={15} />}
            {isPending ? 'Обновление...' : nextLabel}
          </motion.button>
        )}

        {isCanceled && (
          <div className={scss.canceledNotice}>
            <XCircle size={15} />
            Заказ отменён — действия недоступны
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default OrderPanel;
