# Analytics Page — Design Spec

**Date:** 2026-06-02  
**Scope:** Seller dashboard (`saller`) — new `/analytics` route  
**Backend changes:** None — all data from existing endpoints

---

## Problem

Sellers cannot see revenue trends, average order value, or top-selling products. The current Home dashboard shows live counters but has no period-based analytics or product performance data.

---

## Approach

New standalone page `/analytics`. Data aggregated client-side from two existing React Query hooks:
- `useGetShopsOrders()` — all shop orders
- `useGetCommodityMyProducts()` — all seller products

No new backend endpoints. Aggregation logic in pure utility functions. When order volume grows beyond ~1000, a server-side analytics endpoint should be considered (out of scope here).

---

## File Structure

```
saller/src/
├── app/
│   └── (site)/
│       └── analytics/
│           └── page.tsx                    ← Server Component shell
├── pages/
│   └── analytics/
│       ├── Analytics.tsx                   ← 'use client' main component
│       ├── Analytics.module.scss
│       ├── components/
│       │   ├── RevenueChart.tsx            ← Bar chart (recharts)
│       │   ├── StatsCards.tsx              ← Revenue / avg check / order count cards
│       │   └── TopProducts.tsx             ← Top-5 products by units sold
│       └── utils/
│           └── analytics.ts                ← Pure aggregation functions
└── layout/
    └── header/
        └── Header.tsx                      ← Add "Аналитика" nav link
```

---

## UI Layout

```
[Page title: "Аналитика"]   [Сегодня | Неделя | Месяц]  ← period switcher (useState)

[Card: Выручка]  [Card: Средний чек]  [Card: Заказов]    ← StatsCards (3-col grid)

[Bar chart: Revenue by day — full width]                  ← RevenueChart (recharts)

[Top-5 products by units sold]                            ← TopProducts table
  Columns: название, продано (шт), выручка (KGS)

[Low stock products: stockCount ≤ 5]                      ← full list, no 6-item cap
  Links to /products/[id]
```

---

## Components

### Period Switcher
Three buttons: `Сегодня` / `Неделя` / `Месяц`. Active period in `useState<'today' | 'week' | 'month'>`. All blocks recompute via `useMemo` on change.

### StatsCards
| Card | Value |
|------|-------|
| Выручка за период | sum of `finalAmount` for non-CANCELED orders |
| Средний чек | revenue ÷ order count |
| Заказов | count of orders in period |

### RevenueChart
- Library: `recharts` (`BarChart`)
- X axis: dates in period
- Y axis: KGS revenue
- Each bar = one day

### TopProducts
- Aggregated from `order.items` inside filtered orders
- Top 5 by `unitsSold`
- Columns: title, unitsSold, revenue

### Low Stock Block
- Products where `stockCount ≤ 5` and `stockCount > 0`
- Full list (no cap), each row links to `/products/[id]`

---

## Aggregation Utilities (`analytics.ts`)

```ts
filterOrdersByPeriod(orders, period: 'today' | 'week' | 'month'): Order[]
calcStats(orders): { revenue: number; avgCheck: number; count: number }
buildChartData(orders, period): { date: string; revenue: number }[]
getTopProducts(orders): { productId: number; title: string; unitsSold: number; revenue: number }[]
```

All functions are pure (no side effects). Cancelled orders (`status === 'CANCELED'`) excluded from all calculations.

---

## Loading & Error States

| State | Behaviour |
|-------|-----------|
| Loading | Skeleton placeholders in cards and chart |
| Empty period | "Нет заказов за выбранный период" empty state |
| API error | `react-hot-toast` error toast |

---

## Out of Scope

- Server-side analytics endpoint
- Export to CSV/Excel
- Comparison between periods (e.g. this week vs last week)
- Revenue by category
