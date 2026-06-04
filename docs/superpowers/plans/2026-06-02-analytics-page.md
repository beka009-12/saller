# Analytics Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a dedicated `/analytics` page to the seller dashboard showing period-based revenue stats, a bar chart, top products by units sold, and low-stock alerts.

**Architecture:** New `(site)/analytics/page.tsx` route wrapping a `'use client'` component at `src/pages/analytics/Analytics.tsx`. Data comes from the existing `useGetShopsOrders()` and `useGetCommodityMyProducts()` hooks — no backend changes. Pure utility functions in `analytics.ts` handle all aggregation. Chart rendered with `react-apexcharts` (already installed).

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript strict, SCSS Modules, React Query, react-apexcharts, lucide-react

> **Note:** No test suite is configured in this project (`bun lint` / `bun build` are the only verification tools). TDD steps are replaced with manual verification via `bun dev`.

---

## File Map

| Action | Path | Responsibility |
|--------|------|----------------|
| Create | `src/pages/analytics/utils/analytics.ts` | Pure aggregation functions |
| Create | `src/pages/analytics/components/StatsCards.tsx` | 3 stat cards (revenue, avg check, count) |
| Create | `src/pages/analytics/components/RevenueChart.tsx` | ApexCharts bar chart |
| Create | `src/pages/analytics/components/TopProducts.tsx` | Top-5 table |
| Create | `src/pages/analytics/Analytics.tsx` | Main page component (`use client`) |
| Create | `src/pages/analytics/Analytics.module.scss` | Page styles |
| Create | `src/app/(site)/analytics/page.tsx` | Route shell (Server Component) |
| Modify | `src/layout/header/Header.tsx` | Add "Аналитика" to NAV array |

---

## Task 1: Analytics Utility Functions

**Files:**
- Create: `src/pages/analytics/utils/analytics.ts`

- [ ] **Step 1: Create the utility file**

```ts
// src/pages/analytics/utils/analytics.ts

export type Period = 'today' | 'week' | 'month';

interface AnyOrderItem {
  productId?: number;
  quantity?: number;
  priceAtBuy?: number;
  product?: { title?: string };
}

export interface AnyOrder {
  id?: number;
  status?: string;
  finalAmount?: number;
  createdAt?: string;
  items?: AnyOrderItem[];
}

export interface Stats {
  revenue: number;
  avgCheck: number;
  count: number;
}

export interface ChartPoint {
  date: string;
  revenue: number;
}

export interface TopProduct {
  productId: number;
  title: string;
  unitsSold: number;
  revenue: number;
}

function getPeriodDays(period: Period): number {
  if (period === 'today') return 1;
  if (period === 'week') return 7;
  return 30;
}

function getTodayStartMs(): number {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
}

export function filterOrdersByPeriod(orders: AnyOrder[], period: Period): AnyOrder[] {
  const days = getPeriodDays(period);
  const cutoff = getTodayStartMs() - (days - 1) * 24 * 60 * 60 * 1000;
  return orders.filter(
    (o) => o.status !== 'CANCELED' && new Date(o.createdAt ?? '').getTime() >= cutoff
  );
}

export function calcStats(orders: AnyOrder[]): Stats {
  const count = orders.length;
  const revenue = orders.reduce((s, o) => s + Number(o.finalAmount ?? 0), 0);
  return { revenue, avgCheck: count > 0 ? revenue / count : 0, count };
}

export function buildChartData(orders: AnyOrder[], period: Period): ChartPoint[] {
  const days = getPeriodDays(period);
  const todayMs = getTodayStartMs();
  const DAY_MS = 24 * 60 * 60 * 1000;

  const points: ChartPoint[] = Array.from({ length: days }, (_, i) => {
    const ms = todayMs - (days - 1 - i) * DAY_MS;
    return {
      date: new Date(ms).toLocaleDateString('ru-RU', { day: '2-digit', month: 'short' }),
      revenue: 0,
    };
  });

  const firstDayMs = todayMs - (days - 1) * DAY_MS;

  for (const order of orders) {
    const orderMs = new Date(order.createdAt ?? '').getTime();
    const dayIndex = Math.floor((orderMs - firstDayMs) / DAY_MS);
    if (dayIndex >= 0 && dayIndex < days) {
      points[dayIndex].revenue += Number(order.finalAmount ?? 0);
    }
  }

  return points;
}

export function getTopProducts(orders: AnyOrder[]): TopProduct[] {
  const map = new Map<number, TopProduct>();

  for (const order of orders) {
    for (const item of order.items ?? []) {
      const id = item.productId ?? 0;
      const existing = map.get(id) ?? {
        productId: id,
        title: item.product?.title ?? `Товар #${id}`,
        unitsSold: 0,
        revenue: 0,
      };
      existing.unitsSold += item.quantity ?? 0;
      existing.revenue += Number(item.priceAtBuy ?? 0) * (item.quantity ?? 0);
      map.set(id, existing);
    }
  }

  return Array.from(map.values())
    .sort((a, b) => b.unitsSold - a.unitsSold)
    .slice(0, 5);
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
cd /Users/bekbol/Desktop/marketplace/saller && bun run build 2>&1 | tail -20
```

Expected: no errors in `analytics.ts`.

- [ ] **Step 3: Commit**

```bash
git -C /Users/bekbol/Desktop/marketplace/saller add src/pages/analytics/utils/analytics.ts
git -C /Users/bekbol/Desktop/marketplace/saller commit -m "feat: add analytics utility functions"
```

---

## Task 2: StatsCards Component

**Files:**
- Create: `src/pages/analytics/components/StatsCards.tsx`

- [ ] **Step 1: Create StatsCards**

```tsx
// src/pages/analytics/components/StatsCards.tsx
'use client';
import { FC } from 'react';
import { DollarSign, TrendingUp, ShoppingBag } from 'lucide-react';
import type { Stats } from '../utils/analytics';

interface StatsCardsProps {
  stats: Stats;
  loading: boolean;
}

const fmt = (n: number) =>
  new Intl.NumberFormat('ru-KG', {
    style: 'currency',
    currency: 'KGS',
    maximumFractionDigits: 0,
  }).format(n);

const StatsCards: FC<StatsCardsProps> = ({ stats, loading }) => {
  const cards = [
    {
      label: 'Выручка за период',
      value: fmt(stats.revenue),
      sub: 'Без отменённых заказов',
      Icon: DollarSign,
      color: 'blue',
    },
    {
      label: 'Средний чек',
      value: fmt(stats.avgCheck),
      sub: 'Сумма ÷ кол-во заказов',
      Icon: TrendingUp,
      color: 'green',
    },
    {
      label: 'Заказов',
      value: String(stats.count),
      sub: 'За выбранный период',
      Icon: ShoppingBag,
      color: 'purple',
    },
  ];

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
        gap: '12px',
        marginBottom: '20px',
      }}
    >
      {cards.map(({ label, value, sub, Icon, color }) => (
        <div
          key={label}
          style={{
            background: 'var(--bg-2)',
            border: '1px solid var(--border-strong)',
            borderRadius: 'var(--r-md)',
            padding: '20px',
            opacity: loading ? 0.5 : 1,
            transition: 'opacity 0.2s',
          }}
        >
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background:
                color === 'blue'
                  ? 'rgba(59,130,246,0.12)'
                  : color === 'green'
                  ? 'rgba(34,197,94,0.12)'
                  : 'rgba(139,92,246,0.12)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 12,
              color:
                color === 'blue'
                  ? '#3b82f6'
                  : color === 'green'
                  ? '#22c55e'
                  : '#8b5cf6',
            }}
          >
            <Icon size={15} />
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-2)', marginBottom: 4 }}>{label}</div>
          <div
            style={{
              fontSize: 22,
              fontWeight: 700,
              color: 'var(--text-0)',
              fontFamily: 'var(--font-display)',
              letterSpacing: '-0.5px',
              marginBottom: 4,
            }}
          >
            {loading ? '—' : value}
          </div>
          <div style={{ fontSize: 11, color: 'var(--text-2)' }}>{sub}</div>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;
```

- [ ] **Step 2: Commit**

```bash
git -C /Users/bekbol/Desktop/marketplace/saller add src/pages/analytics/components/StatsCards.tsx
git -C /Users/bekbol/Desktop/marketplace/saller commit -m "feat: add StatsCards component"
```

---

## Task 3: RevenueChart Component

**Files:**
- Create: `src/pages/analytics/components/RevenueChart.tsx`

- [ ] **Step 1: Create RevenueChart**

```tsx
// src/pages/analytics/components/RevenueChart.tsx
'use client';
import { FC } from 'react';
import dynamic from 'next/dynamic';
import type { ChartPoint } from '../utils/analytics';

const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface RevenueChartProps {
  data: ChartPoint[];
  loading: boolean;
}

const RevenueChart: FC<RevenueChartProps> = ({ data, loading }) => {
  const options: ApexCharts.ApexOptions = {
    chart: {
      type: 'bar',
      toolbar: { show: false },
      background: 'transparent',
      fontFamily: 'inherit',
    },
    plotOptions: {
      bar: { borderRadius: 4, columnWidth: '55%' },
    },
    dataLabels: { enabled: false },
    xaxis: {
      categories: data.map((d) => d.date),
      labels: { style: { colors: 'var(--text-2)', fontSize: '11px' } },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      labels: {
        style: { colors: 'var(--text-2)', fontSize: '11px' },
        formatter: (v) =>
          new Intl.NumberFormat('ru-KG', {
            notation: 'compact',
            maximumFractionDigits: 0,
          }).format(v),
      },
    },
    grid: {
      borderColor: 'var(--border-strong)',
      strokeDashArray: 4,
      yaxis: { lines: { show: true } },
      xaxis: { lines: { show: false } },
    },
    fill: { colors: ['#5533EB'] },
    tooltip: {
      y: {
        formatter: (v) =>
          new Intl.NumberFormat('ru-KG', {
            style: 'currency',
            currency: 'KGS',
            maximumFractionDigits: 0,
          }).format(v),
      },
    },
    theme: { mode: 'dark' },
  };

  const series = [{ name: 'Выручка', data: data.map((d) => d.revenue) }];

  return (
    <div
      style={{
        background: 'var(--bg-2)',
        border: '1px solid var(--border-strong)',
        borderRadius: 'var(--r-md)',
        padding: '20px',
        marginBottom: '20px',
        opacity: loading ? 0.5 : 1,
        transition: 'opacity 0.2s',
      }}
    >
      <div
        style={{
          fontSize: 13,
          fontWeight: 600,
          color: 'var(--text-0)',
          marginBottom: 16,
        }}
      >
        Выручка по дням
      </div>
      {loading || data.length === 0 ? (
        <div
          style={{
            height: 200,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text-2)',
            fontSize: 13,
          }}
        >
          {loading ? 'Загрузка...' : 'Нет данных за период'}
        </div>
      ) : (
        <ReactApexChart
          options={options}
          series={series}
          type="bar"
          height={200}
          width="100%"
        />
      )}
    </div>
  );
};

export default RevenueChart;
```

- [ ] **Step 2: Commit**

```bash
git -C /Users/bekbol/Desktop/marketplace/saller add src/pages/analytics/components/RevenueChart.tsx
git -C /Users/bekbol/Desktop/marketplace/saller commit -m "feat: add RevenueChart component"
```

---

## Task 4: TopProducts Component

**Files:**
- Create: `src/pages/analytics/components/TopProducts.tsx`

- [ ] **Step 1: Create TopProducts**

```tsx
// src/pages/analytics/components/TopProducts.tsx
'use client';
import { FC } from 'react';
import { Package } from 'lucide-react';
import type { TopProduct } from '../utils/analytics';

interface TopProductsProps {
  products: TopProduct[];
  loading: boolean;
}

const fmt = (n: number) =>
  new Intl.NumberFormat('ru-KG', {
    style: 'currency',
    currency: 'KGS',
    maximumFractionDigits: 0,
  }).format(n);

const TopProducts: FC<TopProductsProps> = ({ products, loading }) => (
  <div
    style={{
      background: 'var(--bg-2)',
      border: '1px solid var(--border-strong)',
      borderRadius: 'var(--r-md)',
      padding: '20px',
      marginBottom: '20px',
      opacity: loading ? 0.5 : 1,
      transition: 'opacity 0.2s',
    }}
  >
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        marginBottom: 16,
        fontSize: 13,
        fontWeight: 600,
        color: 'var(--text-0)',
      }}
    >
      <Package size={14} />
      Топ товаров по продажам
    </div>

    {products.length === 0 ? (
      <div style={{ fontSize: 13, color: 'var(--text-2)', padding: '8px 0' }}>
        {loading ? 'Загрузка...' : 'Нет продаж за период'}
      </div>
    ) : (
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
        <thead>
          <tr>
            {['Товар', 'Продано (шт)', 'Выручка'].map((h) => (
              <th
                key={h}
                style={{
                  textAlign: h === 'Товар' ? 'left' : 'right',
                  padding: '0 0 10px',
                  fontSize: 11,
                  fontWeight: 500,
                  color: 'var(--text-2)',
                  borderBottom: '1px solid var(--border-strong)',
                }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {products.map((p, i) => (
            <tr key={p.productId}>
              <td
                style={{
                  padding: '10px 0',
                  color: 'var(--text-0)',
                  borderBottom: i < products.length - 1 ? '1px solid var(--border-strong)' : 'none',
                  maxWidth: 240,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                <span
                  style={{
                    display: 'inline-block',
                    width: 18,
                    height: 18,
                    lineHeight: '18px',
                    textAlign: 'center',
                    borderRadius: 4,
                    background: 'var(--bg-3, var(--bg-2))',
                    fontSize: 10,
                    fontWeight: 700,
                    color: 'var(--text-2)',
                    marginRight: 8,
                  }}
                >
                  {i + 1}
                </span>
                {p.title}
              </td>
              <td
                style={{
                  padding: '10px 0',
                  textAlign: 'right',
                  fontWeight: 600,
                  color: 'var(--text-0)',
                  borderBottom: i < products.length - 1 ? '1px solid var(--border-strong)' : 'none',
                }}
              >
                {p.unitsSold}
              </td>
              <td
                style={{
                  padding: '10px 0',
                  textAlign: 'right',
                  color: 'var(--text-2)',
                  borderBottom: i < products.length - 1 ? '1px solid var(--border-strong)' : 'none',
                }}
              >
                {fmt(p.revenue)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    )}
  </div>
);

export default TopProducts;
```

- [ ] **Step 2: Commit**

```bash
git -C /Users/bekbol/Desktop/marketplace/saller add src/pages/analytics/components/TopProducts.tsx
git -C /Users/bekbol/Desktop/marketplace/saller commit -m "feat: add TopProducts component"
```

---

## Task 5: Main Analytics Component + SCSS + Route

**Files:**
- Create: `src/pages/analytics/Analytics.tsx`
- Create: `src/pages/analytics/Analytics.module.scss`
- Create: `src/app/(site)/analytics/page.tsx`

- [ ] **Step 1: Create Analytics.module.scss**

```scss
// src/pages/analytics/Analytics.module.scss

.page {
  padding: 36px 40px 64px;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 28px;
  flex-wrap: wrap;
  gap: 12px;

  h1 {
    font-family: var(--font-display);
    font-size: 24px;
    font-weight: 700;
    letter-spacing: -0.5px;
    color: var(--text-0);
    margin: 0;
  }
}

.periodSwitcher {
  display: flex;
  gap: 4px;
  background: var(--bg-2);
  border: 1px solid var(--border-strong);
  border-radius: var(--r-md);
  padding: 3px;
}

.periodBtn {
  padding: 5px 14px;
  font-size: 12px;
  font-weight: 500;
  border-radius: calc(var(--r-md) - 2px);
  border: none;
  cursor: pointer;
  background: transparent;
  color: var(--text-2);
  transition: background 0.15s, color 0.15s;

  &:hover {
    color: var(--text-0);
  }

  &.active {
    background: var(--accent);
    color: #fff;
  }
}

.emptyState {
  padding: 48px 0;
  text-align: center;
  font-size: 14px;
  color: var(--text-2);
}

.lowStockCard {
  background: var(--bg-2);
  border: 1px solid var(--border-strong);
  border-radius: var(--r-md);
  padding: 20px;
}

.lowStockHeader {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  font-weight: 600;
  color: var(--text-0);
  margin-bottom: 16px;
}

.stockRow {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid var(--border-strong);
  font-size: 13px;

  &:last-child {
    border-bottom: none;
  }
}

.stockName {
  color: var(--text-0);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 300px;
}

.stockBadge {
  font-size: 11px;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 20px;
  flex-shrink: 0;

  &.critical {
    background: rgba(239, 68, 68, 0.12);
    color: #ef4444;
  }

  &.warning {
    background: rgba(245, 158, 11, 0.12);
    color: #f59e0b;
  }
}
```

- [ ] **Step 2: Create Analytics.tsx**

```tsx
// src/pages/analytics/Analytics.tsx
'use client';
import { FC, useMemo, useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import { useGetShopsOrders } from '@/src/api/generated/endpoints/shops/shops';
import { useGetCommodityMyProducts } from '@/src/api/generated/endpoints/product/product';
import scss from './Analytics.module.scss';
import StatsCards from './components/StatsCards';
import RevenueChart from './components/RevenueChart';
import TopProducts from './components/TopProducts';
import {
  type Period,
  filterOrdersByPeriod,
  calcStats,
  buildChartData,
  getTopProducts,
  type AnyOrder,
} from './utils/analytics';

const PERIODS: { label: string; value: Period }[] = [
  { label: 'Сегодня', value: 'today' },
  { label: 'Неделя', value: 'week' },
  { label: 'Месяц', value: 'month' },
];

const Analytics: FC = () => {
  const [period, setPeriod] = useState<Period>('week');

  const { data: ordersData, isLoading: ordersLoading } = useGetShopsOrders();
  const { data: productsData, isLoading: productsLoading } = useGetCommodityMyProducts();

  const loading = ordersLoading || productsLoading;
  const allOrders = (ordersData?.orders ?? []) as AnyOrder[];
  const allProducts = productsData?.products ?? [];

  const filteredOrders = useMemo(
    () => filterOrdersByPeriod(allOrders, period),
    [allOrders, period]
  );

  const stats = useMemo(() => calcStats(filteredOrders), [filteredOrders]);
  const chartData = useMemo(() => buildChartData(filteredOrders, period), [filteredOrders, period]);
  const topProducts = useMemo(() => getTopProducts(filteredOrders), [filteredOrders]);

  const lowStockProducts = allProducts.filter(
    (p) => (p.stockCount ?? 0) <= 5 && (p.stockCount ?? 0) > 0
  );

  return (
    <div className={scss.page}>
      <div className={scss.header}>
        <h1>Аналитика</h1>
        <div className={scss.periodSwitcher}>
          {PERIODS.map(({ label, value }) => (
            <button
              key={value}
              className={`${scss.periodBtn} ${period === value ? scss.active : ''}`}
              onClick={() => setPeriod(value)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <StatsCards stats={stats} loading={loading} />
      <RevenueChart data={chartData} loading={loading} />

      {!loading && filteredOrders.length === 0 && (
        <div className={scss.emptyState}>Нет заказов за выбранный период</div>
      )}

      <TopProducts products={topProducts} loading={loading} />

      {lowStockProducts.length > 0 && (
        <div className={scss.lowStockCard}>
          <div className={scss.lowStockHeader}>
            <AlertTriangle size={14} />
            Низкий остаток
          </div>
          {lowStockProducts.map((p) => (
            <div key={p.id} className={scss.stockRow}>
              <a
                href={`/products/${p.id}`}
                className={scss.stockName}
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                {p.title}
              </a>
              <span
                className={`${scss.stockBadge} ${
                  (p.stockCount ?? 0) <= 3 ? scss.critical : scss.warning
                }`}
              >
                {p.stockCount} шт
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Analytics;
```

- [ ] **Step 3: Create route shell**

```tsx
// src/app/(site)/analytics/page.tsx
import Analytics from '@/src/pages/analytics/Analytics';

const page = () => <Analytics />;
export default page;
```

- [ ] **Step 4: Commit**

```bash
git -C /Users/bekbol/Desktop/marketplace/saller add \
  src/pages/analytics/Analytics.tsx \
  src/pages/analytics/Analytics.module.scss \
  src/app/\(site\)/analytics/page.tsx
git -C /Users/bekbol/Desktop/marketplace/saller commit -m "feat: add analytics page with stats, chart, and top products"
```

---

## Task 6: Add Navigation Link

**Files:**
- Modify: `src/layout/header/Header.tsx`

- [ ] **Step 1: Update NAV array in Header.tsx**

Find the import line at the top:

```tsx
import {
  LayoutDashboard, Package, ShoppingBag, Megaphone,
  Settings, LogOut, User, Store, Menu, X,
  ChevronRight, Zap,
} from "lucide-react";
```

Replace with (add `BarChart2`):

```tsx
import {
  LayoutDashboard, Package, ShoppingBag, Megaphone,
  Settings, LogOut, User, Store, Menu, X,
  ChevronRight, Zap, BarChart2,
} from "lucide-react";
```

Then find the NAV array:

```tsx
const NAV = [
  { label: "Дашборд",  path: "/",         icon: LayoutDashboard },
  { label: "Товары",   path: "/products",  icon: Package },
  { label: "Заказы",   path: "/orders",    icon: ShoppingBag },
  { label: "Баннеры",  path: "/banners",   icon: Megaphone },
  { label: "Настройки",path: "/settings",  icon: Settings },
];
```

Replace with:

```tsx
const NAV = [
  { label: "Дашборд",   path: "/",          icon: LayoutDashboard },
  { label: "Товары",    path: "/products",   icon: Package },
  { label: "Заказы",    path: "/orders",     icon: ShoppingBag },
  { label: "Аналитика", path: "/analytics",  icon: BarChart2 },
  { label: "Баннеры",   path: "/banners",    icon: Megaphone },
  { label: "Настройки", path: "/settings",   icon: Settings },
];
```

- [ ] **Step 2: Verify in dev server**

```bash
cd /Users/bekbol/Desktop/marketplace/saller && bun dev
```

Open `http://localhost:3000/analytics`. Check:
- [ ] "Аналитика" appears in sidebar nav
- [ ] Active state highlights correctly when on `/analytics`
- [ ] Period switcher (Сегодня / Неделя / Месяц) works
- [ ] Stats cards render (or show `—` if no orders)
- [ ] Bar chart renders without SSR errors
- [ ] Top products table renders
- [ ] Low stock block appears if any product has `stockCount ≤ 5`

- [ ] **Step 3: Commit**

```bash
git -C /Users/bekbol/Desktop/marketplace/saller add src/layout/header/Header.tsx
git -C /Users/bekbol/Desktop/marketplace/saller commit -m "feat: add analytics link to sidebar navigation"
```

---

## Done

All 6 tasks complete. The `/analytics` page is live with period switching, revenue bar chart, stats cards, top products table, and low-stock alerts. No backend changes were required.
