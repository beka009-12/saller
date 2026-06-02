// src/pages/analytics/components/RevenueChart.tsx
'use client';
import { FC } from 'react';
import dynamic from 'next/dynamic';
import type { ChartPoint } from '@/src/lib/analytics-utils';

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
