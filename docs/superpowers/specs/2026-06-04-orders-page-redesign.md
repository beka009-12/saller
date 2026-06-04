# Orders Page Redesign — Design Spec

**Date:** 2026-06-04
**Scope:** `saller` — redesign `/orders` page
**Backend changes:** None — uses existing `useGetShopsOrders` and `usePatchShopsOrdersOrderIdAdvance`

---

## Problem

The current orders page uses an expanding table row for details — awkward to navigate between orders, no search, and the expand/collapse detail feels cramped. The status advance button is buried inside the expanded row.

---

## Design Decisions

| Question | Decision |
|---|---|
| Detail placement | **Side panel** (split-view, always visible) |
| Search | Yes — by customer name or order ID (#number) |
| Date filter | Yes — Today / Week / Month |
| Side panel content | Contacts, address, items with prices, total, action button |

---

## Layout

**Desktop — Split-view:**
```
┌─────────────────────────────────────────────────────────┐
│ Заказы                    [⚡ 5 надо отправить] [3 ждут]│
├─────────────────────────────────────────────────────────┤
│ [🔍 Поиск...] [Все][Оплачены 5][Отправлены]... [Неделя]│
├──────────────────────────┬──────────────────────────────┤
│  LIST (55%)              │  PANEL (45%)                 │
│  ─ #124 Бекбол ◀ active │  Заказ #124                  │
│  ─ #123 Алина            │  Покупатель: Бекбол Н.       │
│  ─ #122 Марат            │  Тел: +996 700 ...           │
│  ─ #121 Дина             │  Адрес: ул. Манаса 45        │
│                          │  ─────────────────           │
│                          │  Nike Air Max ×1 — 9 500 с.  │
│                          │  Adidas Socks ×3 — 5 700 с.  │
│                          │  ─────────────────           │
│                          │  Итого: 15 200 с.            │
│                          │  [Отметить отправленным →]   │
└──────────────────────────┴──────────────────────────────┘
```

**Mobile:** Panel slides up as a full-screen sheet over the list (AnimatePresence).

---

## File Structure

| Action | File | Responsibility |
|---|---|---|
| Modify | `src/pages/order/Order.tsx` | State: selectedId, filter, search, datePeriod. Fetches orders, passes down |
| Modify | `src/pages/order/Order.module.scss` | Split layout, filter bar, search input |
| Create | `src/components/order/OrderList.tsx` | Renders list of `OrderListItem`, stagger animation |
| Create | `src/components/order/OrderList.module.scss` | List row styles |
| Create | `src/components/order/OrderListItem.tsx` | Single row: name, status pill, amount, date |
| Create | `src/components/order/OrderPanel.tsx` | Right panel: contact, address, items, total, advance button |
| Create | `src/components/order/OrderPanel.module.scss` | Panel layout styles |

---

## State (Order.tsx)

```ts
const [selectedId,  setSelectedId]  = useState<number | null>(null);
const [filter,      setFilter]      = useState<OrderStatus | 'ALL'>('ALL');
const [search,      setSearch]      = useState('');
const [datePeriod,  setDatePeriod]  = useState<'today' | 'week' | 'month'>('week');
```

**Derived (useMemo):**
- Filter by status → filter by date → filter by search query (title OR `#id`)
- `selectedOrder` — the full order object for the panel

Auto-select first order on load if none selected.

---

## Components

### OrderList
Props: `orders[]`, `selectedId`, `onSelect(id)`

Renders `motion.ul` with `staggerChildren: 0.05`. Each `OrderListItem` is a `motion.li` with `variants { hidden: {opacity:0, y:12}, visible: {opacity:1, y:0} }`. Uses `AnimatePresence mode="popLayout"` so filtered-out items animate away.

### OrderListItem
Props: `order`, `isSelected`, `onClick`

Shows: `#id` (mono), customer name, status pill (color-coded), amount (mono), date.
Active state: left border `3px solid var(--accent)`, `background: var(--accent-dim)`.
`whileHover`: subtle background shift, no layout change.

### OrderPanel
Props: `order | null`, `onAdvance(orderId)`

Sections:
1. **Header** — `#id` + date created
2. **Contact** — name, phone
3. **Address** — street, city
4. **Items table** — title, quantity, line total
5. **Total row** — `finalAmount` in accent color
6. **Action button** — shown only when `STATUS_NEXT[order.status]` exists. `whileHover scale(1.02)` + `whileTap scale(0.97)`. Shows spinner while `advancing`.

Panel entrance: `AnimatePresence mode="wait"` keyed by `order.id` — crossfade when switching orders.

---

## Status Colors

| Status | Background | Text |
|---|---|---|
| PENDING | `var(--bg-3)` | `var(--text-2)` |
| PAID | `var(--blue-dim)` | `var(--blue)` |
| PROCESSING | `var(--accent-dim)` | `var(--accent)` |
| SHIPPED | `rgba(245,158,11,0.1)` | `#d97706` |
| COMPLETED | `var(--green-dim)` | `var(--green)` |
| CANCELED | `var(--red-dim)` | `var(--red)` |

---

## Header Stats

Two quick-stat chips in the page header (computed from all orders, not filtered):
- **⚡ N надо отправить** — count of `PAID` orders (amber bg)
- **N ожидают оплаты** — count of `PENDING` orders (blue bg)

---

## Motion Summary

| Element | Animation |
|---|---|
| List items on load | stagger `y: 12→0`, `opacity: 0→1`, `duration: 0.3s` |
| Filtered list update | `AnimatePresence mode="popLayout"` |
| Panel on order switch | `AnimatePresence mode="wait"`, crossfade `duration: 0.2s` |
| Action button | `whileHover scale(1.02)`, `whileTap scale(0.97)` |
| Mobile panel | slide-up sheet, `y: 100%→0` |
| Reduced motion | all transforms disabled via `useReducedMotion()` |

---

## Out of Scope

- Order cancellation from seller side (not in API)
- Tracking number input
- Export to CSV
- Pagination (current API returns all orders; acceptable at current volume)
