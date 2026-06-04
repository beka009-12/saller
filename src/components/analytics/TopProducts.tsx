'use client';
import { FC } from 'react';
import Link from 'next/link';
import { TrendingUp } from 'lucide-react';
import { motion } from 'motion/react';
import type { TopProduct } from '@/src/lib/analytics-utils';

interface TopProductsProps {
  products: TopProduct[];
  loading: boolean;
}

const smooth: [number, number, number, number] = [0.22, 1, 0.36, 1];

const fmtKGS = (n: number) =>
  new Intl.NumberFormat('ru-KG', {
    style: 'currency',
    currency: 'KGS',
    maximumFractionDigits: 0,
  }).format(n);

const RANK_COLORS = ['#5533EB', '#2563EB', '#7C3AED', '#0EA5E9', '#6366F1'];

const TopProducts: FC<TopProductsProps> = ({ products, loading }) => {
  const maxUnits = products[0]?.unitsSold ?? 1;

  return (
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
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 16 }}>
        <TrendingUp size={14} style={{ color: 'var(--accent)' }} />
        <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-0)' }}>
          Топ товаров по продажам
        </span>
      </div>

      {products.length === 0 ? (
        <div style={{ fontSize: 13, color: 'var(--text-2)', padding: '16px 0', textAlign: 'center' }}>
          {loading ? 'Загрузка...' : 'Нет продаж за период'}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {products.map((p, i) => {
            const pct = maxUnits > 0 ? (p.unitsSold / maxUnits) * 100 : 0;
            const color = RANK_COLORS[i] ?? '#888';

            return (
              <motion.div
                key={p.productId}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.06, ease: smooth }}
                style={{
                  background: 'var(--bg-1)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--r-md)',
                  padding: '12px 14px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                }}
              >
                {/* Rank badge */}
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 8,
                    background: `${color}18`,
                    border: `1.5px solid ${color}40`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 11,
                    fontWeight: 800,
                    color,
                    flexShrink: 0,
                    fontFamily: 'var(--font-mono)',
                  }}
                >
                  {i + 1}
                </div>

                {/* Main content */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  {/* Title + stats row */}
                  <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 8, marginBottom: 6 }}>
                    <Link
                      href={`/products/${p.productId}`}
                      style={{
                        fontSize: 13,
                        fontWeight: 600,
                        color: 'var(--text-0)',
                        textDecoration: 'none',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        flex: 1,
                        minWidth: 0,
                      }}
                    >
                      {p.title}
                    </Link>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
                      <span style={{ fontSize: 12, fontWeight: 700, color, fontFamily: 'var(--font-mono)' }}>
                        {p.unitsSold} шт
                      </span>
                      <span style={{ fontSize: 12, color: 'var(--text-2)', fontFamily: 'var(--font-mono)' }}>
                        {fmtKGS(p.revenue)}
                      </span>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div
                    style={{
                      height: 4,
                      background: 'var(--bg-4)',
                      borderRadius: 2,
                      overflow: 'hidden',
                    }}
                  >
                    <motion.div
                      style={{ height: '100%', background: color, borderRadius: 2 }}
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.6, delay: i * 0.08, ease: smooth }}
                    />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default TopProducts;
