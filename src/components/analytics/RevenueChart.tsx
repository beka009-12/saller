'use client';
import { FC } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import type { ChartPoint } from '@/src/lib/analytics-utils';

interface RevenueChartProps {
  data: ChartPoint[];
  loading: boolean;
}

const fmt = (v: number) =>
  new Intl.NumberFormat('ru-KG', {
    style: 'currency',
    currency: 'KGS',
    maximumFractionDigits: 0,
  }).format(v);

const fmtCompact = (v: number) =>
  new Intl.NumberFormat('ru-KG', { notation: 'compact', maximumFractionDigits: 0 }).format(v);

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div
      style={{
        background: 'var(--bg-2)',
        border: '1px solid var(--border-strong)',
        borderRadius: 8,
        padding: '8px 12px',
        fontSize: 12,
      }}
    >
      <div style={{ color: 'var(--text-2)', marginBottom: 4 }}>{label}</div>
      <div style={{ color: 'var(--text-0)', fontWeight: 600 }}>{fmt(payload[0].value)}</div>
    </div>
  );
};

const RevenueChart: FC<RevenueChartProps> = ({ data, loading }) => (
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
    <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-0)', marginBottom: 16 }}>
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
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data} barCategoryGap="35%" margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border-strong)" vertical={false} />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 11, fill: 'var(--text-2)' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tickFormatter={fmtCompact}
            tick={{ fontSize: 11, fill: 'var(--text-2)' }}
            axisLine={false}
            tickLine={false}
            width={52}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.04)' }} />
          <Bar dataKey="revenue" fill="#5533EB" radius={[4, 4, 0, 0]} name="Выручка" />
        </BarChart>
      </ResponsiveContainer>
    )}
  </div>
);

export default RevenueChart;
