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

// ── Mock data (preview only — set USE_MOCK = false when real API has data) ────
const now = Date.now();
const day = 86_400_000;

const MOCK_ORDERS: ShopOrder[] = [
  {
    id: 201, status: 'PAID', createdAt: new Date(now - 0.3 * day).toISOString(),
    finalAmount: 15200, deliveryName: 'Бекбол Нурматов', deliveryPhone: '+996 700 123 456',
    deliveryAddress: 'ул. Манаса 45, кв. 12, Бишкек',
    items: [
      { id: 1, priceAtBuy: 9500, quantity: 1, product: { id: 1, title: 'Nike Air Max 270', price: 9500 } },
      { id: 2, priceAtBuy: 1900, quantity: 3, product: { id: 2, title: 'Носки Adidas белые', price: 1900 } },
    ],
  },
  {
    id: 202, status: 'PAID', createdAt: new Date(now - 0.8 * day).toISOString(),
    finalAmount: 8900, deliveryName: 'Алина Смирнова', deliveryPhone: '+996 552 987 654',
    deliveryAddress: 'мкр. Асанбай 12, Бишкек',
    items: [
      { id: 3, priceAtBuy: 8900, quantity: 1, product: { id: 3, title: 'Кроссовки Classic White 38', price: 8900 } },
    ],
  },
  {
    id: 203, status: 'SHIPPED', createdAt: new Date(now - 1.5 * day).toISOString(),
    finalAmount: 22300, deliveryName: 'Марат Каримов', deliveryPhone: '+996 770 234 567',
    deliveryAddress: 'ул. Ахунбаева 78, Бишкек',
    items: [
      { id: 4, priceAtBuy: 12500, quantity: 1, product: { id: 4, title: 'Куртка зимняя мужская L', price: 12500 } },
      { id: 5, priceAtBuy: 3267, quantity: 3, product:  { id: 5, title: 'Джинсы Slim Fit 32/32', price: 3267 } },
    ],
  },
  {
    id: 204, status: 'SHIPPED', createdAt: new Date(now - 2 * day).toISOString(),
    finalAmount: 5600, deliveryName: 'Гульнара Асанова', deliveryPhone: '+996 500 111 222',
    deliveryAddress: 'ул. Киевская 31, кв. 5, Бишкек',
    items: [
      { id: 6, priceAtBuy: 2800, quantity: 2, product: { id: 6, title: 'Футболка базовая S', price: 2800 } },
    ],
  },
  {
    id: 205, status: 'COMPLETED', createdAt: new Date(now - 3 * day).toISOString(),
    finalAmount: 18700, deliveryName: 'Дмитрий Ли', deliveryPhone: '+996 312 456 789',
    deliveryAddress: 'мкр. Джал 38, корп. 2, кв. 44, Бишкек',
    items: [
      { id: 7, priceAtBuy: 9350, quantity: 2, product: { id: 1, title: 'Nike Air Max 270', price: 9350 } },
    ],
  },
  {
    id: 206, status: 'COMPLETED', createdAt: new Date(now - 4 * day).toISOString(),
    finalAmount: 9800, deliveryName: 'Зарина Токтоматова', deliveryPhone: '+996 777 333 444',
    deliveryAddress: 'ул. Горького 15, Бишкек',
    items: [
      { id: 8, priceAtBuy: 9800, quantity: 1, product: { id: 3, title: 'Кроссовки Classic White 40', price: 9800 } },
    ],
  },
  {
    id: 207, status: 'COMPLETED', createdAt: new Date(now - 5 * day).toISOString(),
    finalAmount: 7400, deliveryName: 'Айбек Усенов', deliveryPhone: '+996 558 876 543',
    deliveryAddress: 'ул. Токтогула 99, кв. 18, Бишкек',
    items: [
      { id: 9, priceAtBuy: 3700, quantity: 2, product: { id: 5, title: 'Джинсы Slim Fit 34/32', price: 3700 } },
    ],
  },
  {
    id: 208, status: 'CANCELED', createdAt: new Date(now - 2.5 * day).toISOString(),
    finalAmount: 6200, deliveryName: 'Нурия Жакыпова', deliveryPhone: '+996 701 555 666',
    deliveryAddress: 'мкр. Восток-5, д. 12, Бишкек',
    items: [
      { id: 10, priceAtBuy: 1550, quantity: 4, product: { id: 2, title: 'Носки Adidas белые', price: 1550 } },
    ],
  },
  {
    id: 209, status: 'PENDING', createdAt: new Date(now - 0.1 * day).toISOString(),
    finalAmount: 11200, deliveryName: 'Санжар Рустамов', deliveryPhone: '+996 770 999 888',
    deliveryAddress: 'ул. Южная магистраль 4, Бишкек',
    items: [
      { id: 11, priceAtBuy: 11200, quantity: 1, product: { id: 4, title: 'Куртка зимняя женская M', price: 11200 } },
    ],
  },
];

const USE_MOCK = false;
// ─────────────────────────────────────────────────────────────────────────────

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

  const { data: allData }              = useGetShopsOrders(undefined);
  const { data: filteredData, isLoading: apiLoading } = useGetShopsOrders(
    tab !== 'all' ? { status: TABS.find(t => t.value === tab)?.statuses[0] } : undefined
  );

  const isLoading = USE_MOCK ? false : apiLoading;

  // In mock mode filter client-side; in real mode use API response
  const allOrders: ShopOrder[] = USE_MOCK
    ? MOCK_ORDERS
    : ((allData?.orders ?? []) as ShopOrder[]);

  const rawOrders: ShopOrder[] = USE_MOCK
    ? MOCK_ORDERS.filter(o => {
        if (tab === 'all') return true;
        const statuses = TABS.find(t => t.value === tab)?.statuses ?? [];
        return statuses.includes(o.status);
      })
    : ((filteredData?.orders ?? []) as ShopOrder[]);

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
  const paidCount     = tabCounts.needs_shipping;
  const pendingCount  = allOrders.filter(o => o.status === 'PENDING').length;

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
          <p>
            {allOrders.length} всего
            {USE_MOCK && <span style={{ marginLeft: 8, fontSize: 10, fontWeight: 600, color: 'var(--accent)', background: 'var(--accent-dim)', border: '1px solid var(--border-accent)', padding: '1px 7px', borderRadius: 20 }}>🧪 Mock</span>}
          </p>
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
