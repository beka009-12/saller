'use client';
import { FC, useMemo, useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import { useGetShopsOrders } from '@/src/api/generated/endpoints/shops/shops';
import { useGetCommodityMyProducts } from '@/src/api/generated/endpoints/product/product';
import scss from './Analytics.module.scss';
import StatsCards from '@/src/components/analytics/StatsCards';
import RevenueChart from '@/src/components/analytics/RevenueChart';
import TopProducts from '@/src/components/analytics/TopProducts';
import {
  type Period,
  filterOrdersByPeriod,
  calcStats,
  buildChartData,
  getTopProducts,
  type AnyOrder,
} from '@/src/lib/analytics-utils';

// ── Mock data (preview only — remove when real API has data) ──────────────────
const now = Date.now();
const day = 86_400_000;

const MOCK_ORDERS: AnyOrder[] = [
  // последние 7 дней — разные суммы и статусы
  { id: 101, status: 'COMPLETED', finalAmount: 12500, createdAt: new Date(now - 0.5 * day).toISOString(),
    items: [{ productId: 1, quantity: 1, priceAtBuy: 9500, product: { title: 'Nike Air Max 270' } },
            { productId: 2, quantity: 2, priceAtBuy: 1500, product: { title: 'Носки Adidas' } }] },
  { id: 102, status: 'COMPLETED', finalAmount: 8900, createdAt: new Date(now - 1.2 * day).toISOString(),
    items: [{ productId: 3, quantity: 1, priceAtBuy: 8900, product: { title: 'Кроссовки Classic White' } }] },
  { id: 103, status: 'SHIPPED',   finalAmount: 15200, createdAt: new Date(now - 2 * day).toISOString(),
    items: [{ productId: 1, quantity: 1, priceAtBuy: 9500, product: { title: 'Nike Air Max 270' } },
            { productId: 4, quantity: 1, priceAtBuy: 5700, product: { title: 'Куртка зимняя L' } }] },
  { id: 104, status: 'PAID',      finalAmount: 5600, createdAt: new Date(now - 2.5 * day).toISOString(),
    items: [{ productId: 5, quantity: 2, priceAtBuy: 2800, product: { title: 'Футболка базовая' } }] },
  { id: 105, status: 'COMPLETED', finalAmount: 22300, createdAt: new Date(now - 3 * day).toISOString(),
    items: [{ productId: 4, quantity: 1, priceAtBuy: 12500, product: { title: 'Куртка зимняя L' } },
            { productId: 6, quantity: 3, priceAtBuy: 3267, product: { title: 'Джинсы Slim' } }] },
  { id: 106, status: 'COMPLETED', finalAmount: 9800, createdAt: new Date(now - 4 * day).toISOString(),
    items: [{ productId: 3, quantity: 1, priceAtBuy: 9800, product: { title: 'Кроссовки Classic White' } }] },
  { id: 107, status: 'CANCELED',  finalAmount: 6200, createdAt: new Date(now - 4.5 * day).toISOString(),
    items: [{ productId: 2, quantity: 4, priceAtBuy: 1550, product: { title: 'Носки Adidas' } }] },
  { id: 108, status: 'COMPLETED', finalAmount: 18700, createdAt: new Date(now - 5 * day).toISOString(),
    items: [{ productId: 1, quantity: 2, priceAtBuy: 9350, product: { title: 'Nike Air Max 270' } }] },
  { id: 109, status: 'COMPLETED', finalAmount: 7400, createdAt: new Date(now - 5.8 * day).toISOString(),
    items: [{ productId: 6, quantity: 2, priceAtBuy: 3700, product: { title: 'Джинсы Slim' } }] },
  { id: 110, status: 'PAID',      finalAmount: 11200, createdAt: new Date(now - 6.2 * day).toISOString(),
    items: [{ productId: 4, quantity: 1, priceAtBuy: 11200, product: { title: 'Куртка зимняя L' } }] },
];

const MOCK_PRODUCTS: any[] = [
  { id: 1, title: 'Nike Air Max 270',     stockCount: 3,  soldCount: 4 },
  { id: 2, title: 'Носки Adidas',         stockCount: 12, soldCount: 6 },
  { id: 3, title: 'Кроссовки Classic',    stockCount: 2,  soldCount: 2 },
  { id: 4, title: 'Куртка зимняя L',      stockCount: 5,  soldCount: 3 },
  { id: 5, title: 'Футболка базовая',     stockCount: 0,  soldCount: 2 },
  { id: 6, title: 'Джинсы Slim',          stockCount: 4,  soldCount: 5 },
];

// Переключатель: true = показываем mock, false = используем реальное API
const USE_MOCK = false;
// ─────────────────────────────────────────────────────────────────────────────

const PERIODS: { label: string; value: Period }[] = [
  { label: 'Сегодня', value: 'today' },
  { label: 'Неделя',  value: 'week' },
  { label: 'Месяц',   value: 'month' },
];

const Analytics: FC = () => {
  const [period, setPeriod] = useState<Period>('week');

  const { data: ordersData,   isLoading: ordersLoading,   isError: ordersError   } = useGetShopsOrders();
  const { data: productsData, isLoading: productsLoading, isError: productsError } = useGetCommodityMyProducts();

  const loading = USE_MOCK ? false : (ordersLoading || productsLoading);
  const isError = USE_MOCK ? false : (ordersError   || productsError);

  const allOrders  = USE_MOCK ? MOCK_ORDERS    : ((ordersData?.orders   ?? []) as AnyOrder[]);
  const allProducts= USE_MOCK ? MOCK_PRODUCTS  : (productsData?.products ?? []);

  const filteredOrders = useMemo(
    () => filterOrdersByPeriod(allOrders, period),
    [allOrders, period]
  );

  const stats       = useMemo(() => calcStats(filteredOrders),            [filteredOrders]);
  const chartData   = useMemo(() => buildChartData(filteredOrders, period), [filteredOrders, period]);
  const topProducts = useMemo(() => getTopProducts(filteredOrders),        [filteredOrders]);

  const lowStockProducts = useMemo(
    () => allProducts.filter((p) => (p.stockCount ?? 0) <= 5 && (p.stockCount ?? 0) > 0),
    [allProducts]
  );

  return (
    <div className={scss.page}>
      <div className={scss.header}>
        <div>
          <h1>Аналитика</h1>
          {USE_MOCK && (
            <span className={scss.mockBadge}>🧪 Mock данные</span>
          )}
        </div>
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

      {isError && (
        <div className={scss.errorState}>Не удалось загрузить данные. Попробуйте обновить страницу.</div>
      )}

      <StatsCards stats={stats} loading={loading} />
      <RevenueChart data={chartData} loading={loading} />

      {!loading && !isError && filteredOrders.length === 0 && (
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
