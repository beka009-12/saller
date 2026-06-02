// src/pages/analytics/components/StatsCards.tsx
'use client';
import { FC } from 'react';
import { DollarSign, TrendingUp, ShoppingBag } from 'lucide-react';
import type { Stats } from '@/src/lib/analytics-utils';

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
