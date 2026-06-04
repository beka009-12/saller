# Orders Page Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the expanding-row orders table with a split-view layout (list left, detail panel right), workflow-based tabs (Надо отправить / В пути / Завершённые / Отменённые / Все), search by name or #ID, and date period filter.

**Architecture:** `Order.tsx` holds all state (selectedId, tab, search, datePeriod) and passes data down to three pure components: `OrderList`, `OrderListItem`, `OrderPanel`. All components live in `src/components/order/` to avoid Next.js Pages Router collision. Motion animations use `motion/react` (already installed).

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript strict, SCSS Modules, motion/react, React Query (useGetShopsOrders + usePatchShopsOrdersOrderIdAdvance)

---

## File Map

| Action | File | Responsibility |
|---|---|---|
| Create | `src/components/order/OrderListItem.tsx` | Single row: #id, name, status pill, amount, date |
| Create | `src/components/order/OrderListItem.module.scss` | Row styles, active state, status colors |
| Create | `src/components/order/OrderPanel.tsx` | Right panel: contact, address, items, total, action btn |
| Create | `src/components/order/OrderPanel.module.scss` | Panel layout, items table, action button |
| Create | `src/components/order/OrderList.tsx` | Animated list container with AnimatePresence |
| Modify | `src/pages/order/Order.tsx` | State orchestration, split layout, filters, search |
| Modify | `src/pages/order/Order.module.scss` | Split layout, filter bar, search input, tab styles |

---

## Task 1: OrderListItem Component

**Files:**
- Create: `src/components/order/OrderListItem.tsx`
- Create: `src/components/order/OrderListItem.module.scss`

- [ ] **Step 1: Create `OrderListItem.module.scss`**

```scss
// src/components/order/OrderListItem.module.scss

.item {
  padding: 12px 16px;
  border-bottom: 1px solid var(--border);
  cursor: pointer;
  border-left: 3px solid transparent;
  transition: background 0.12s, border-color 0.12s;
  display: flex;
  flex-direction: column;
  gap: 5px;

  &:last-child { border-bottom: none; }

  &:hover { background: var(--bg-3); }

  &.active {
    background: var(--accent-dim);
    border-left-color: var(--accent);
  }

  &.canceled { opacity: 0.6; }
}

.row1 {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.row2 {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.id {
  font-family: var(--font-mono);
  font-size: 10px;
  font-weight: 600;
  color: var(--text-2);
  flex-shrink: 0;
}

.name {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-0);
  flex: 1;
  min-width: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.amount {
  font-family: var(--font-mono);
  font-size: 12px;
  font-weight: 700;
  color: var(--text-0);
  flex-shrink: 0;
  white-space: nowrap;
}

.date {
  font-size: 10px;
  color: var(--text-2);
}

.items {
  font-size: 11px;
  color: var(--text-2);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex: 1;
}

// Status pills
.status {
  display: inline-flex;
  align-items: center;
  padding: 2px 8px;
  border-radius: 20px;
  font-size: 10px;
  font-weight: 600;
  white-space: nowrap;
  flex-shrink: 0;
}

.PENDING    { background: var(--bg-3);         color: var(--text-2); }
.PAID       { background: rgba(245,158,11,0.12); color: #d97706; }
.PROCESSING { background: var(--accent-dim);    color: var(--accent); }
.SHIPPED    { background: var(--purple-dim);    color: var(--purple); }
.COMPLETED  { background: var(--green-dim);     color: var(--green); }
.CANCELED   { background: var(--red-dim);       color: var(--red); }
```

- [ ] **Step 2: Create `OrderListItem.tsx`**

```tsx
// src/components/order/OrderListItem.tsx
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
```

- [ ] **Step 3: Verify TypeScript**

```bash
cd /Users/bekbol/Desktop/marketplace/saller && npx tsc --noEmit 2>&1 | grep -v "npm notice" | head -10
```
Expected: no output (clean).

- [ ] **Step 4: Commit**

```bash
git -C /Users/bekbol/Desktop/marketplace/saller add \
  src/components/order/OrderListItem.tsx \
  src/components/order/OrderListItem.module.scss
git -C /Users/bekbol/Desktop/marketplace/saller commit -m "feat: add OrderListItem component"
```

---

## Task 2: OrderPanel Component

**Files:**
- Create: `src/components/order/OrderPanel.tsx`
- Create: `src/components/order/OrderPanel.module.scss`

- [ ] **Step 1: Create `OrderPanel.module.scss`**

```scss
// src/components/order/OrderPanel.module.scss

.panel {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 18px;
  height: 100%;
  overflow-y: auto;
}

.empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  gap: 10px;
  color: var(--text-2);
  font-size: 13px;
  text-align: center;
  padding: 40px;
}

.emptyIcon { opacity: 0.3; }

// Header
.header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 8px;
  padding-bottom: 14px;
  border-bottom: 1px solid var(--border);
}

.orderId {
  font-family: var(--font-mono);
  font-size: 15px;
  font-weight: 800;
  color: var(--text-0);
}

.orderDate {
  font-size: 11px;
  color: var(--text-2);
  margin-top: 2px;
}

.statusPill {
  display: inline-flex;
  align-items: center;
  padding: 3px 10px;
  border-radius: 20px;
  font-size: 10px;
  font-weight: 700;
  white-space: nowrap;
  flex-shrink: 0;
}

.PENDING    { background: var(--bg-3);         color: var(--text-2); }
.PAID       { background: rgba(245,158,11,0.12); color: #d97706; }
.PROCESSING { background: var(--accent-dim);    color: var(--accent); }
.SHIPPED    { background: var(--purple-dim);    color: var(--purple); }
.COMPLETED  { background: var(--green-dim);     color: var(--green); }
.CANCELED   { background: var(--red-dim);       color: var(--red); }

// Sections
.section {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.sectionLabel {
  font-size: 9px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1.2px;
  color: var(--text-2);
}

.sectionValue {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-0);
  line-height: 1.4;
}

.sectionSub {
  font-size: 12px;
  color: var(--text-2);
}

// Items table
.itemsTable {
  width: 100%;
  border-collapse: collapse;
  font-size: 12px;
}

.itemRow td {
  padding: 7px 0;
  border-bottom: 1px solid var(--border);
  vertical-align: middle;
  color: var(--text-1);
}

.itemTitle { color: var(--text-0); }

.itemQty {
  text-align: center;
  color: var(--text-2);
  width: 40px;
  white-space: nowrap;
}

.itemPrice {
  text-align: right;
  font-family: var(--font-mono);
  font-weight: 600;
  color: var(--text-0);
  white-space: nowrap;
  width: 90px;
}

.totalRow td {
  padding: 10px 0 0;
  font-weight: 700;
  font-size: 13px;
}

.totalAmount {
  text-align: right;
  font-family: var(--font-mono);
  font-size: 16px;
  font-weight: 800;
  color: var(--accent);
  width: 90px;
}

// Action button
.actionBtn {
  width: 100%;
  padding: 12px;
  border-radius: var(--r-md);
  border: none;
  background: var(--accent);
  color: #fff;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 2px 8px var(--accent-glow);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  margin-top: auto;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
}

// Cancelled notice
.canceledNotice {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 14px;
  background: var(--red-dim);
  border: 1px solid rgba(220, 38, 38, 0.2);
  border-radius: var(--r-md);
  font-size: 12px;
  color: var(--red);
  font-weight: 500;
  margin-top: auto;
}
```

- [ ] **Step 2: Create `OrderPanel.tsx`**

```tsx
// src/components/order/OrderPanel.tsx
'use client';
import { FC } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Package, SendHorizontal, CheckCheck, XCircle } from 'lucide-react';
import { usePatchShopsOrdersOrderIdAdvance } from '@/src/api/generated/endpoints/shops/shops';
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
          queryClient.invalidateQueries({ queryKey: ['/shops/orders'] });
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
        {/* Header */}
        <div className={scss.header}>
          <div>
            <div className={scss.orderId}>Заказ #{order.id}</div>
            <div className={scss.orderDate}>{fmtDate(order.createdAt)}</div>
          </div>
          <span className={`${scss.statusPill} ${scss[order.status]}`}>
            {STATUS_LABEL[order.status]}
          </span>
        </div>

        {/* Contact */}
        <div className={scss.section}>
          <div className={scss.sectionLabel}>Покупатель</div>
          <div className={scss.sectionValue}>{order.deliveryName}</div>
          <div className={scss.sectionSub}>{order.deliveryPhone}</div>
        </div>

        {/* Address */}
        <div className={scss.section}>
          <div className={scss.sectionLabel}>Адрес доставки</div>
          <div className={scss.sectionValue}>{order.deliveryAddress}</div>
        </div>

        {/* Items */}
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

        {/* Action */}
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
```

- [ ] **Step 3: Verify TypeScript**

```bash
cd /Users/bekbol/Desktop/marketplace/saller && npx tsc --noEmit 2>&1 | grep -v "npm notice" | head -10
```

- [ ] **Step 4: Commit**

```bash
git -C /Users/bekbol/Desktop/marketplace/saller add \
  src/components/order/OrderPanel.tsx \
  src/components/order/OrderPanel.module.scss
git -C /Users/bekbol/Desktop/marketplace/saller commit -m "feat: add OrderPanel component"
```

---

## Task 3: OrderList Component

**Files:**
- Create: `src/components/order/OrderList.tsx`

- [ ] **Step 1: Create `OrderList.tsx`**

```tsx
// src/components/order/OrderList.tsx
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
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.05 } } }}
    >
      <AnimatePresence mode="popLayout">
        {orders.map((order) => (
          <motion.div
            key={order.id}
            variants={{
              hidden:  { opacity: 0, y: 10 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.28, ease: smooth } },
            }}
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
    </motion.div>
  );
};

export default OrderList;
```

- [ ] **Step 2: Verify TypeScript**

```bash
cd /Users/bekbol/Desktop/marketplace/saller && npx tsc --noEmit 2>&1 | grep -v "npm notice" | head -10
```

- [ ] **Step 3: Commit**

```bash
git -C /Users/bekbol/Desktop/marketplace/saller add src/components/order/OrderList.tsx
git -C /Users/bekbol/Desktop/marketplace/saller commit -m "feat: add OrderList component with stagger animation"
```

---

## Task 4: Rewrite Order.module.scss

**Files:**
- Modify: `src/pages/order/Order.module.scss`

- [ ] **Step 1: Replace `Order.module.scss` entirely**

```scss
// src/pages/order/Order.module.scss

@keyframes shimmer {
  0%   { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

// ── Page ──────────────────────────────────────────────────────────────────────
.page {
  padding: 28px 40px 64px;

  @media (max-width: 900px) { padding: 20px 20px 48px; }
  @media (max-width: 600px) { padding: 14px 14px 40px; }
}

// ── Header ────────────────────────────────────────────────────────────────────
.header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 20px;
  gap: 12px;
  flex-wrap: wrap;

  h1 {
    font-family: var(--font-display);
    font-size: 22px;
    font-weight: 700;
    color: var(--text-0);
    margin: 0 0 3px;
    letter-spacing: -0.3px;
  }

  p {
    font-size: 12px;
    color: var(--text-2);
    margin: 0;
  }
}

.chips {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.chip {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 5px 11px;
  border-radius: var(--r-md);
  font-size: 11px;
  font-weight: 700;
  border: 1px solid;

  &.chipAmber {
    background: rgba(245,158,11,0.1);
    border-color: rgba(245,158,11,0.3);
    color: #d97706;
  }
  &.chipBlue {
    background: var(--blue-dim);
    border-color: rgba(37,99,235,0.2);
    color: var(--blue);
  }
}

// ── Filter bar ────────────────────────────────────────────────────────────────
.filterBar {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
  flex-wrap: wrap;
  background: var(--bg-2);
  border: 1px solid var(--border-strong);
  border-radius: var(--r-lg);
  padding: 10px 14px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.04);
}

// ── Search ────────────────────────────────────────────────────────────────────
.searchWrap {
  position: relative;
  flex: 1;
  min-width: 180px;
}

.searchIcon {
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-2);
  pointer-events: none;
}

.searchInput {
  width: 100%;
  height: 34px;
  padding: 0 12px 0 32px;
  border-radius: var(--r-md);
  border: 1px solid var(--border-strong);
  background: var(--bg-1);
  font-size: 13px;
  color: var(--text-0);
  font-family: var(--font-sans);
  outline: none;
  transition: border-color 0.15s, box-shadow 0.15s;

  &::placeholder { color: var(--text-2); }
  &:focus { border-color: var(--accent); box-shadow: 0 0 0 3px var(--accent-dim); }
}

// ── Workflow tabs ─────────────────────────────────────────────────────────────
.tabs {
  display: flex;
  gap: 4px;
  flex-shrink: 0;
}

.tab {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 6px 12px;
  border-radius: 20px;
  border: 1px solid var(--border-strong);
  background: transparent;
  font-size: 12px;
  font-weight: 500;
  color: var(--text-2);
  cursor: pointer;
  white-space: nowrap;
  transition: background 0.14s, color 0.14s, border-color 0.14s;

  &:hover { background: var(--bg-3); color: var(--text-0); }

  &.tabActive {
    background: var(--accent);
    border-color: var(--accent);
    color: #fff;
    font-weight: 600;

    .tabCount { color: rgba(255,255,255,0.75); }
  }

  &.tabCanceled.tabActive {
    background: var(--red);
    border-color: var(--red);
  }
}

.tabCount {
  font-family: var(--font-mono);
  font-size: 10px;
  font-weight: 700;
  color: var(--text-2);
  transition: color 0.14s;
}

// ── Date period ───────────────────────────────────────────────────────────────
.datePicker {
  display: flex;
  gap: 0;
  background: var(--bg-1);
  border: 1px solid var(--border-strong);
  border-radius: 20px;
  overflow: hidden;
  flex-shrink: 0;
}

.dateBtn {
  padding: 5px 11px;
  font-size: 11px;
  font-weight: 500;
  color: var(--text-2);
  background: transparent;
  border: none;
  cursor: pointer;
  transition: background 0.12s, color 0.12s;

  &:hover { color: var(--text-0); }

  &.dateBtnActive {
    background: var(--accent);
    color: #fff;
    font-weight: 600;
    border-radius: 20px;
  }
}

// ── Split layout ──────────────────────────────────────────────────────────────
.split {
  display: grid;
  grid-template-columns: 55% 45%;
  border: 1px solid var(--border-strong);
  border-radius: var(--r-lg);
  overflow: hidden;
  background: var(--bg-2);
  box-shadow: 0 1px 4px rgba(0,0,0,0.05);
  min-height: 480px;

  @media (max-width: 860px) { grid-template-columns: 1fr; }
}

.listCol {
  border-right: 1px solid var(--border-strong);
  overflow-y: auto;
  max-height: calc(100vh - 260px);
  min-height: 300px;

  @media (max-width: 860px) {
    border-right: none;
    border-bottom: 1px solid var(--border-strong);
    max-height: 320px;
  }
}

.panelCol {
  overflow-y: auto;
  max-height: calc(100vh - 260px);
  min-height: 300px;
  background: var(--bg-2);

  @media (max-width: 860px) { max-height: none; }
}
```

- [ ] **Step 2: Verify TypeScript + build**

```bash
cd /Users/bekbol/Desktop/marketplace/saller && npx tsc --noEmit 2>&1 | grep -v "npm notice" | head -5
```

- [ ] **Step 3: Commit**

```bash
git -C /Users/bekbol/Desktop/marketplace/saller add src/pages/order/Order.module.scss
git -C /Users/bekbol/Desktop/marketplace/saller commit -m "feat: rewrite order page layout styles — split view, workflow tabs, filter bar"
```

---

## Task 5: Rewrite Order.tsx

**Files:**
- Modify: `src/pages/order/Order.tsx`

- [ ] **Step 1: Replace `Order.tsx` entirely**

```tsx
// src/pages/order/Order.tsx
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

// ── Types ─────────────────────────────────────────────────────────────────────
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

// ── Helpers ───────────────────────────────────────────────────────────────────
const smooth: [number, number, number, number] = [0.22, 1, 0.36, 1];

function getPeriodCutoff(period: DatePeriod): number {
  const now = new Date();
  const todayMs = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  if (period === 'today') return todayMs;
  if (period === 'week')  return todayMs - 6  * 24 * 60 * 60 * 1000;
  return                         todayMs - 29 * 24 * 60 * 60 * 1000;
}

// ── Component ─────────────────────────────────────────────────────────────────
const Order: FC = () => {
  const reduce = useReducedMotion() ?? false;

  const [tab,        setTab]        = useState<WorkflowTab>('needs_shipping');
  const [period,     setPeriod]     = useState<DatePeriod>('week');
  const [search,     setSearch]     = useState('');
  const [selectedId, setSelectedId] = useState<number | null>(null);

  // Fetch ALL orders (for counts) + filtered by status for display
  const { data: allData }              = useGetShopsOrders(undefined);
  const { data: filteredData, isLoading } = useGetShopsOrders(
    tab !== 'all' ? { status: TABS.find(t => t.value === tab)?.statuses[0] } : undefined
  );

  const allOrders      = (allData?.orders      ?? []) as ShopOrder[];
  const rawOrders      = (filteredData?.orders ?? []) as ShopOrder[];

  // Count per tab (from all orders)
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

  // Filter by date + search
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

  // Auto-select first order on load / tab change
  useEffect(() => {
    if (!selectedId && displayOrders.length > 0) {
      setSelectedId(displayOrders[0].id);
    }
    if (selectedId && !displayOrders.find(o => o.id === selectedId)) {
      setSelectedId(displayOrders[0]?.id ?? null);
    }
  }, [displayOrders]); // eslint-disable-line react-hooks/exhaustive-deps

  const selectedOrder = displayOrders.find(o => o.id === selectedId) ?? null;

  // Header stats
  const paidCount    = tabCounts.needs_shipping;
  const pendingCount = allOrders.filter(o => o.status === 'PENDING').length;

  return (
    <div className={scss.page}>

      {/* Header */}
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

      {/* Filter bar */}
      <motion.div
        className={scss.filterBar}
        initial={reduce ? false : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.08, ease: smooth }}
      >
        {/* Search */}
        <div className={scss.searchWrap}>
          <Search size={14} className={scss.searchIcon} />
          <input
            className={scss.searchInput}
            placeholder="Поиск по имени или #номеру…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        {/* Workflow tabs */}
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

        {/* Date period */}
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

      {/* Split layout */}
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
```

- [ ] **Step 2: Verify TypeScript**

```bash
cd /Users/bekbol/Desktop/marketplace/saller && npx tsc --noEmit 2>&1 | grep -v "npm notice" | head -10
```
Expected: no errors.

- [ ] **Step 3: Production build**

```bash
cd /Users/bekbol/Desktop/marketplace/saller && bun run build 2>&1 | grep -E "(✓|error|failed)" | head -5
```
Expected: `✓ Compiled successfully` and `✓ Generating static pages`.

- [ ] **Step 4: Manual verify in dev**

```bash
cd /Users/bekbol/Desktop/marketplace/saller && bun dev
```

Open `http://localhost:3000/orders`. Check:
- [ ] Split layout renders (list left, panel right)
- [ ] "Надо отправить" tab is active by default
- [ ] Clicking a row selects it (purple left border, accent-dim bg)
- [ ] Panel shows contact, address, items, total
- [ ] "Отметить отправленным" button appears only for PAID orders
- [ ] "Отменённые" tab: orders dimmed (opacity 0.6), no action button, red notice shown
- [ ] "Завершённые" tab: no action button
- [ ] Search by name and by #123 works
- [ ] Date filter (Сегодня/Неделя/Месяц) narrows the list
- [ ] Switching tabs resets selected order to first in list

- [ ] **Step 5: Commit**

```bash
git -C /Users/bekbol/Desktop/marketplace/saller add \
  src/pages/order/Order.tsx \
  src/pages/order/Order.module.scss
git -C /Users/bekbol/Desktop/marketplace/saller commit -m "feat: redesign orders page — split view, workflow tabs, search, date filter, motion"
```

---

## Self-Review

**Spec coverage:**
- ✅ Split-view layout (list 55% + panel 45%)
- ✅ Search by customer name and #orderId
- ✅ Date filter: Today / Week / Month (client-side)
- ✅ Workflow tabs: Надо отправить (PAID), В пути (SHIPPED), Завершённые (COMPLETED), Отменённые (CANCELED), Все
- ✅ PENDING hidden from workflow tabs, visible only in "Все"
- ✅ Action button: only for PAID and SHIPPED
- ✅ Cancelled orders: dimmed, red notice, no action
- ✅ Completed orders: no action button
- ✅ Header stats chips (надо отправить + ожидают оплаты)
- ✅ Motion: stagger list, panel crossfade, button hover/tap, `useReducedMotion`
- ✅ Mobile: stacked layout (< 860px)

**Type consistency:** `ShopOrder` defined once in `OrderListItem.tsx` and re-exported. Used consistently across `OrderList`, `OrderPanel`, `Order`. `WorkflowTab` and `DatePeriod` defined locally in `Order.tsx`.
