'use client';

import { useState } from 'react';
import { BarChart3, Calendar, TrendingUp } from 'lucide-react';
import { formatPrice } from '@/lib/format';

type TimeRange = '7d' | '4w' | '6m';

interface DataPoint {
  label: string;
  sublabel: string;
  amountCents: number;
  programsCents: number;
  sessionsCents: number;
  ordersCount: number;
}

const DATA_7D: DataPoint[] = [
  { label: 'Mon', sublabel: 'Nov 3', amountCents: 8500, programsCents: 0, sessionsCents: 8500, ordersCount: 1 },
  { label: 'Tue', sublabel: 'Nov 4', amountCents: 14500, programsCents: 6000, sessionsCents: 8500, ordersCount: 2 },
  { label: 'Wed', sublabel: 'Nov 5', amountCents: 11400, programsCents: 4900, sessionsCents: 6500, ordersCount: 2 },
  { label: 'Thu', sublabel: 'Nov 6', amountCents: 21900, programsCents: 4900, sessionsCents: 17000, ordersCount: 3 },
  { label: 'Fri', sublabel: 'Nov 7', amountCents: 30400, programsCents: 13400, sessionsCents: 17000, ordersCount: 4 },
  { label: 'Sat', sublabel: 'Nov 8', amountCents: 17000, programsCents: 0, sessionsCents: 17000, ordersCount: 2 },
  { label: 'Sun', sublabel: 'Nov 9', amountCents: 25500, programsCents: 8500, sessionsCents: 17000, ordersCount: 3 },
];

const DATA_4W: DataPoint[] = [
  { label: 'W1', sublabel: 'Oct 13-19', amountCents: 84000, programsCents: 33000, sessionsCents: 51000, ordersCount: 11 },
  { label: 'W2', sublabel: 'Oct 20-26', amountCents: 112000, programsCents: 44000, sessionsCents: 68000, ordersCount: 15 },
  { label: 'W3', sublabel: 'Oct 27-Nov 2', amountCents: 98000, programsCents: 39000, sessionsCents: 59000, ordersCount: 13 },
  { label: 'W4', sublabel: 'Nov 3-9', amountCents: 129200, programsCents: 47700, sessionsCents: 81500, ordersCount: 17 },
];

const DATA_6M: DataPoint[] = [
  { label: 'Jun', sublabel: '2026', amountCents: 245000, programsCents: 95000, sessionsCents: 150000, ordersCount: 32 },
  { label: 'Jul', sublabel: '2026', amountCents: 312000, programsCents: 125000, sessionsCents: 187000, ordersCount: 41 },
  { label: 'Aug', sublabel: '2026', amountCents: 389000, programsCents: 152000, sessionsCents: 237000, ordersCount: 49 },
  { label: 'Sep', sublabel: '2026', amountCents: 421000, programsCents: 168000, sessionsCents: 253000, ordersCount: 54 },
  { label: 'Oct', sublabel: '2026', amountCents: 478000, programsCents: 185000, sessionsCents: 293000, ordersCount: 61 },
  { label: 'Nov', sublabel: 'Current', amountCents: 512000, programsCents: 198000, sessionsCents: 314000, ordersCount: 66 },
];

export function EarningsBarChart() {
  const [timeRange, setTimeRange] = useState<TimeRange>('7d');
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const dataset = timeRange === '7d' ? DATA_7D : timeRange === '4w' ? DATA_4W : DATA_6M;
  const maxAmount = Math.max(...dataset.map((d) => d.amountCents));
  const totalPeriodAmount = dataset.reduce((acc, curr) => acc + curr.amountCents, 0);

  const activePoint = hoveredIndex !== null ? dataset[hoveredIndex] : dataset[dataset.length - 1];

  return (
    <div className="rounded-3xl border border-border bg-surface p-6 sm:p-8">
      {/* Chart Header */}
      <div className="flex flex-col justify-between gap-4 border-b border-border pb-6 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2">
            <span className="eyebrow">Revenue Analytics</span>
            <span className="inline-flex items-center gap-1 rounded-full border border-primary/30 bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-lime-ink">
              <TrendingUp className="size-3" /> +24.8%
            </span>
          </div>
          <h2 className="font-display mt-1 text-3xl uppercase text-foreground sm:text-4xl">
            {formatPrice(totalPeriodAmount)}
          </h2>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Total gross revenue from programs &amp; 1:1 sessions
          </p>
        </div>

        {/* Timeframe Toggle Buttons (Single solid colors, no gradients) */}
        <div className="flex items-center gap-1 rounded-xl border border-border bg-surface-2 p-1">
          {(
            [
              ['7d', '7 Days'],
              ['4w', '4 Weeks'],
              ['6m', '6 Months'],
            ] as const
          ).map(([key, label]) => {
            const isSelected = timeRange === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => {
                  setTimeRange(key);
                  setHoveredIndex(null);
                }}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold uppercase tracking-wider transition-colors ${
                  isSelected
                    ? 'bg-primary text-primary-foreground font-bold'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Hover Info Strip */}
      <div className="my-4 flex items-center justify-between rounded-xl border border-border/60 bg-surface-2/60 px-4 py-2.5 text-xs">
        <div className="flex items-center gap-3">
          <Calendar className="size-4 text-lime-ink" />
          <span className="font-semibold text-foreground">
            {activePoint.label} ({activePoint.sublabel})
          </span>
          <span className="hidden text-muted-foreground sm:inline">
            · {activePoint.ordersCount} booking{activePoint.ordersCount > 1 ? 's' : ''}
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-muted-foreground">
            Sessions: <strong className="text-foreground">{formatPrice(activePoint.sessionsCents)}</strong>
          </span>
          <span className="text-muted-foreground">
            Programs: <strong className="text-foreground">{formatPrice(activePoint.programsCents)}</strong>
          </span>
          <span className="font-display text-lg text-lime-ink">
            {formatPrice(activePoint.amountCents)}
          </span>
        </div>
      </div>

      {/* Bar Chart Visualization (Human-Crafted Solid Single-Color Bars) */}
      <div className="relative mt-8 h-64 w-full">
        {/* Background Grid Lines */}
        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
          <div className="border-b border-border/40 text-[10px] font-mono text-muted-foreground">
            {formatPrice(maxAmount)}
          </div>
          <div className="border-b border-border/30 text-[10px] font-mono text-muted-foreground">
            {formatPrice(Math.round(maxAmount * 0.66))}
          </div>
          <div className="border-b border-border/30 text-[10px] font-mono text-muted-foreground">
            {formatPrice(Math.round(maxAmount * 0.33))}
          </div>
          <div className="border-b border-border/50 text-[10px] font-mono text-muted-foreground">
            $0
          </div>
        </div>

        {/* Bars Container */}
        <div className="relative z-10 flex h-full items-end justify-between gap-2 px-6 pt-6 pb-2">
          {dataset.map((item, index) => {
            const heightPercent = Math.max(12, Math.round((item.amountCents / maxAmount) * 100));
            const isHovered = hoveredIndex === index;
            const isSelected = hoveredIndex === null && index === dataset.length - 1;
            const isHighlighted = isHovered || isSelected;

            return (
              <div
                key={item.label}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                className="group relative flex h-full flex-1 cursor-pointer flex-col items-center justify-end"
              >
                {/* Tooltip on top of bar */}
                {isHovered && (
                  <div className="absolute -top-10 z-20 whitespace-nowrap rounded-lg border border-border bg-[#171C18] px-2.5 py-1 font-mono text-xs font-semibold text-foreground shadow-lg">
                    {formatPrice(item.amountCents)}
                  </div>
                )}

                {/* Solid Bar Track and Fill */}
                <div className="relative flex h-full w-full max-w-[48px] items-end justify-center rounded-xl bg-[#141915] p-1 transition-colors group-hover:bg-[#18201a]">
                  <div
                    style={{ height: `${heightPercent}%` }}
                    className={`w-full rounded-lg transition-all duration-300 ${
                      isHighlighted
                        ? 'bg-primary'
                        : 'bg-muted-foreground/30 group-hover:bg-primary/70'
                    }`}
                  />
                </div>

                {/* X-Axis Label */}
                <span
                  className={`mt-3 text-xs font-medium uppercase tracking-wider transition-colors ${
                    isHighlighted ? 'text-lime-ink font-bold' : 'text-muted-foreground'
                  }`}
                >
                  {item.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend & Summary Info */}
      <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="size-3 rounded bg-primary" />
            <span className="text-foreground font-medium">Selected / Peak Revenue</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="size-3 rounded bg-muted-foreground/30" />
            <span>Regular Volume</span>
          </div>
        </div>

        <div>
          <span>Top revenue driver: </span>
          <strong className="text-foreground">1:1 Live Coaching Sessions (62%)</strong>
        </div>
      </div>
    </div>
  );
}
