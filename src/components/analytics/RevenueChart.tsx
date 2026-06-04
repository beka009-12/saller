'use client';
import { FC } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import type { ChartPoint } from '@/src/lib/analytics-utils';

interface RevenueChartProps {
  data: ChartPoint[];
  loading: boolean;
}

const fmtRevenue = (v: number) =>
  new Intl.NumberFormat('ru-KG', {
    style: 'currency',
    currency: 'KGS',
    maximumFractionDigits: 0,
  }).format(v);

const fmtCompact = (v: number) =>
  new Intl.NumberFormat('ru-KG', { notation: 'compact', maximumFractionDigits: 0 }).format(v);

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  const revenue = payload.find((p: any) => p.dataKey === 'revenue');
  const orders  = payload.find((p: any) => p.dataKey === 'orders');
  return (
    <div
      style={{
        background: 'var(--bg-2)',
        border: '1px solid var(--border-strong)',
        borderRadius: 10,
        padding: '10px 14px',
        fontSize: 12,
        boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
        minWidth: 160,
      }}
    >
      <div style={{ color: 'var(--text-2)', marginBottom: 8, fontWeight: 600 }}>{label}</div>
      {revenue && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 5 }}>
          <span style={{ width: 10, height: 10, borderRadius: 3, background: '#5533EB', flexShrink: 0 }} />
          <span style={{ color: 'var(--text-2)', flex: 1 }}>Выручка</span>
          <span style={{ color: 'var(--text-0)', fontWeight: 700 }}>{fmtRevenue(revenue.value)}</span>
        </div>
      )}
      {orders && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
          <span style={{ width: 10, height: 10, borderRadius: 3, background: '#2563EB', flexShrink: 0 }} />
          <span style={{ color: 'var(--text-2)', flex: 1 }}>Заказов</span>
          <span style={{ color: 'var(--text-0)', fontWeight: 700 }}>{orders.value} шт</span>
        </div>
      )}
    </div>
  );
};

const CustomLegend = ({ payload }: any) => (
  <div style={{ display: 'flex', gap: 16, justifyContent: 'flex-end', marginBottom: 12 }}>
    {payload?.map((entry: any) => (
      <div key={entry.value} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: 'var(--text-2)' }}>
        <span style={{ width: 10, height: 10, borderRadius: 3, background: entry.color, flexShrink: 0 }} />
        {entry.value === 'revenue' ? 'Выручка' : 'Заказов'}
      </div>
    ))}
  </div>
);

const RevenueChart: FC<RevenueChartProps> = ({ data, loading }) => (
  <div
    style={{
      background: 'var(--bg-2)',
      border: '1px solid var(--border-strong)',
      borderRadius: 'var(--r-lg)',
      padding: '20px',
      marginBottom: '20px',
      opacity: loading ? 0.5 : 1,
      transition: 'opacity 0.2s',
      boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
    }}
  >
    <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-0)', marginBottom: 4 }}>
      Выручка и заказы по дням
    </div>
    <div style={{ fontSize: 11, color: 'var(--text-2)', marginBottom: 16 }}>
      Без отменённых заказов
    </div>

    {loading || data.length === 0 ? (
      <div
        style={{
          height: 240,
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
      <ResponsiveContainer width="100%" height={240}>
        <BarChart
          data={data}
          barCategoryGap="30%"
          barGap={3}
          margin={{ top: 0, right: 48, left: 0, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border-strong)" vertical={false} />

          <XAxis
            dataKey="date"
            tick={{ fontSize: 11, fill: 'var(--text-2)' }}
            axisLine={false}
            tickLine={false}
          />

          {/* Left axis — revenue */}
          <YAxis
            yAxisId="revenue"
            tickFormatter={fmtCompact}
            tick={{ fontSize: 11, fill: 'var(--text-2)' }}
            axisLine={false}
            tickLine={false}
            width={52}
          />

          {/* Right axis — orders count */}
          <YAxis
            yAxisId="orders"
            orientation="right"
            allowDecimals={false}
            tick={{ fontSize: 11, fill: '#2563EB' }}
            axisLine={false}
            tickLine={false}
            width={32}
          />

          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0,0,0,0.03)' }} />
          <Legend content={<CustomLegend />} verticalAlign="top" />

          <Bar
            yAxisId="revenue"
            dataKey="revenue"
            fill="#5533EB"
            radius={[4, 4, 0, 0]}
            name="revenue"
          />
          <Bar
            yAxisId="orders"
            dataKey="orders"
            fill="#2563EB"
            radius={[4, 4, 0, 0]}
            name="orders"
            opacity={0.75}
          />
        </BarChart>
      </ResponsiveContainer>
    )}
  </div>
);

export default RevenueChart;
