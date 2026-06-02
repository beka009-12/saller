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

const PERIODS: { label: string; value: Period }[] = [
  { label: 'Сегодня', value: 'today' },
  { label: 'Неделя', value: 'week' },
  { label: 'Месяц', value: 'month' },
];

const Analytics: FC = () => {
  const [period, setPeriod] = useState<Period>('week');

  const { data: ordersData, isLoading: ordersLoading, isError: ordersError } = useGetShopsOrders();
  const { data: productsData, isLoading: productsLoading, isError: productsError } = useGetCommodityMyProducts();

  const loading = ordersLoading || productsLoading;
  const isError = ordersError || productsError;
  const allOrders = (ordersData?.orders ?? []) as AnyOrder[];
  const allProducts = productsData?.products ?? [];

  const filteredOrders = useMemo(
    () => filterOrdersByPeriod(allOrders, period),
    [allOrders, period]
  );

  const stats = useMemo(() => calcStats(filteredOrders), [filteredOrders]);
  const chartData = useMemo(() => buildChartData(filteredOrders, period), [filteredOrders, period]);
  const topProducts = useMemo(() => getTopProducts(filteredOrders), [filteredOrders]);

  const lowStockProducts = useMemo(
    () => allProducts.filter((p) => (p.stockCount ?? 0) <= 5 && (p.stockCount ?? 0) > 0),
    [allProducts]
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
