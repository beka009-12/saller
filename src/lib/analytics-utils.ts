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
      const id = item.productId;
      if (id === undefined) continue;
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
