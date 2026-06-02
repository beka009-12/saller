// src/pages/analytics/components/TopProducts.tsx
'use client';
import { FC } from 'react';
import { Package } from 'lucide-react';
import type { TopProduct } from '@/src/lib/analytics-utils';

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
