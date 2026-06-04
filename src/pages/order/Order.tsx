'use client';
import { FC, useMemo, useState, useEffect } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { Search, ShoppingBag, Clock } from 'lucide-react';
import { useGetShopsOrders } from '@/src/api/generated/endpoints/shops/shops';
import type { OrderStatus } from '@/src/api/generated/models';
import scss from './Order.module.scss';
import OrderList from '@/src/components/order/OrderList';
import OrderPanel from '@/src/components/order/OrderPanel';
import type { ShopOrder } from '@/src/components/order/OrderListItem';

type WorkflowTab = 'needs_shipping' | 'in_transit' | 'completed' | 'canceled' | 'all';
type DatePeriod  = 'today' | 'week' | 'month';

const TABS: { value: WorkflowTab; label: string; statuses: OrderStatus[]; emoji: string }[] = [
  { value: 'needs_shipping', label: 'Надо отправить', statuses: ['PAID'],      emoji: '⚡' },
  { value: 'in_transit',     label: 'В пути',          statuses: ['SHIPPED'],   emoji: '🚚' },
  { value: 'completed',      label: 'Завершённые',     statuses: ['COMPLETED'], emoji: '✓' },
  { value: 'canceled',       label: 'Отменённые',      statuses: ['CANCELED'],  emoji: '✕' },
  { value: 'all',            label: 'Все',             statuses: [],            emoji: '' },
];

const DATE_BTNS: { value: DatePeriod; label: string }[] = [
  { value: 'today', label: 'Сегодня' },
  { value: 'week',  label: 'Неделя' },
  { value: 'month', label: 'Месяц' },
];

const smooth: [number, number, number, number] = [0.22, 1, 0.36, 1];

function getPeriodCutoff(period: DatePeriod): number {
  const now = new Date();
  const todayMs = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  if (period === 'today') return todayMs;
  if (period === 'week')  return todayMs - 6  * 24 * 60 * 60 * 1000;
  return                         todayMs - 29 * 24 * 60 * 60 * 1000;
}

const Order: FC = () => {
  const reduce = useReducedMotion() ?? false;

  const [tab,        setTab]        = useState<WorkflowTab>('needs_shipping');
  const [period,     setPeriod]     = useState<DatePeriod>('week');
  const [search,     setSearch]     = useState('');
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const { data: allData }                      = useGetShopsOrders(undefined);
  const { data: filteredData, isLoading }      = useGetShopsOrders(
    tab !== 'all'
      ? { status: TABS.find(t => t.value === tab)?.statuses[0] }
      : undefined
  );

  const allOrders = (allData?.orders  ?? []) as ShopOrder[];
  const rawOrders = (filteredData?.orders ?? []) as ShopOrder[];

  const tabCounts = useMemo(() => {
    const counts: Record<WorkflowTab, number> = {
      needs_shipping: 0, in_transit: 0, completed: 0, canceled: 0, all: allOrders.length,
    };
    for (const o of allOrders) {
      if (o.status === 'PAID')      counts.needs_shipping++;
      if (o.status === 'SHIPPED')   counts.in_transit++;
      if (o.status === 'COMPLETED') counts.completed++;
      if (o.status === 'CANCELED')  counts.canceled++;
    }
    return counts;
  }, [allOrders]);

  const displayOrders = useMemo(() => {
    const cutoff = getPeriodCutoff(period);
    let list = rawOrders.filter(o => new Date(o.createdAt).getTime() >= cutoff);
    if (search.trim()) {
      const q = search.toLowerCase();
      if (q.startsWith('#')) {
        list = list.filter(o => String(o.id).includes(q.slice(1)));
      } else {
        list = list.filter(o => o.deliveryName.toLowerCase().includes(q));
      }
    }
    return list;
  }, [rawOrders, period, search]);

  useEffect(() => {
    setSelectedId(prev => {
      if (!prev && displayOrders.length > 0) return displayOrders[0].id;
      if (prev && !displayOrders.find(o => o.id === prev)) return displayOrders[0]?.id ?? null;
      return prev;
    });
  }, [displayOrders]);

  const selectedOrder = displayOrders.find(o => o.id === selectedId) ?? null;

  const paidCount    = tabCounts.needs_shipping;
  const pendingCount = allOrders.filter(o => o.status === 'PENDING').length;

  return (
    <div className={scss.page}>
      <motion.div
        className={scss.header}
        initial={reduce ? false : { opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.32, ease: smooth }}
      >
        <div>
          <h1>Заказы</h1>
          <p>{allOrders.length} всего</p>
        </div>
        <div className={scss.chips}>
          {paidCount > 0 && (
            <div className={`${scss.chip} ${scss.chipAmber}`}>
              <ShoppingBag size={12} />
              {paidCount} надо отправить
            </div>
          )}
          {pendingCount > 0 && (
            <div className={`${scss.chip} ${scss.chipBlue}`}>
              <Clock size={12} />
              {pendingCount} ожидают оплаты
            </div>
          )}
        </div>
      </motion.div>

      <motion.div
        className={scss.filterBar}
        initial={reduce ? false : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.08, ease: smooth }}
      >
        <div className={scss.searchWrap}>
          <Search size={14} className={scss.searchIcon} />
          <input
            className={scss.searchInput}
            placeholder="Поиск по имени или #номеру…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        <div className={scss.tabs}>
          {TABS.map(({ value, label, emoji }) => (
            <motion.button
              key={value}
              className={`${scss.tab} ${tab === value ? scss.tabActive : ''} ${value === 'canceled' ? scss.tabCanceled : ''}`}
              onClick={() => { setTab(value); setSelectedId(null); }}
              whileTap={reduce ? undefined : { scale: 0.95 }}
            >
              {emoji && <span>{emoji}</span>}
              {label}
              {tabCounts[value] > 0 && (
                <span className={scss.tabCount}>{tabCounts[value]}</span>
              )}
            </motion.button>
          ))}
        </div>

        <div className={scss.datePicker}>
          {DATE_BTNS.map(({ value, label }) => (
            <button
              key={value}
              className={`${scss.dateBtn} ${period === value ? scss.dateBtnActive : ''}`}
              onClick={() => setPeriod(value)}
            >
              {label}
            </button>
          ))}
        </div>
      </motion.div>

      <motion.div
        className={scss.split}
        initial={reduce ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.15, ease: smooth }}
      >
        <div className={scss.listCol}>
          <OrderList
            orders={displayOrders}
            selectedId={selectedId}
            onSelect={setSelectedId}
            loading={isLoading}
            reduce={reduce}
          />
        </div>
        <div className={scss.panelCol}>
          <OrderPanel order={selectedOrder} reduce={reduce} />
        </div>
      </motion.div>
    </div>
  );
};

export default Order;
