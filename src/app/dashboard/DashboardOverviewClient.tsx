'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ArrowUpRight,
  Calendar,
  CheckCircle2,
  DollarSign,
  Dumbbell,
  Plus,
  Radio,
  Sparkles,
  Star,
  Users,
  Video,
  Zap,
} from 'lucide-react';
import { UserAvatar } from '@/components/site/UserAvatar';
import { EarningsBarChart } from '@/components/dashboard/EarningsBarChart';
import { Button } from '@/components/ui/button';
import { formatPrice } from '@/lib/format';
import type { Profile, Purchase, Slot } from '@/lib/types';
import { toast } from 'sonner';

export function DashboardOverviewClient({
  initialSales,
  upcomingSessions,
}: {
  initialSales: (Purchase & { client: Profile; program?: any; slot?: any })[];
  upcomingSessions: { slot: Slot; client: Profile }[];
}) {
  const [sales, setSales] = useState(initialSales);

  const totalEarningsCents = sales.reduce((acc, curr) => acc + curr.amountCents, 0);
  const totalSalesCount = sales.length;

  const simulateNewSale = () => {
    const clientsList = ['Alex Rivera', 'Jordan Lee', 'Sam Patel', 'Nora Kim', 'Theo Grant'];
    const randomName = clientsList[Math.floor(Math.random() * clientsList.length)];
    const isProgram = Math.random() > 0.4;
    const amount = isProgram ? 4900 : 8500;

    const newSale: Purchase & { client: Profile; program?: any; slot?: any } = {
      id: `pu-${Date.now()}`,
      clientId: `c-demo-${Date.now()}`,
      trainerId: 't-maya',
      kind: isProgram ? 'program' : 'session',
      programId: isProgram ? 'p-strong-base' : null,
      slotId: isProgram ? null : 's-101',
      amountCents: amount,
      stripeSessionId: `cs_${Date.now()}`,
      createdAt: new Date().toISOString(),
      client: {
        userId: `c-demo-${Date.now()}`,
        role: 'client',
        name: randomName,
        avatarUrl: null,
        coverUrl: null,
        headline: null,
        bio: null,
        specialties: null,
        sessionPriceCents: null,
      },
      program: isProgram ? { title: 'Strong Base: 8-Week Barbell' } : undefined,
    };

    setSales([newSale, ...sales]);
    toast.success(`⚡ Live Event (Neon Realtime): ${randomName} paid ${formatPrice(amount)}!`);
  };

  return (
    <div className="space-y-8">
      {/* Top Welcome & Actions */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <span className="eyebrow">Coach Command Center</span>
          <h1 className="font-display mt-1 text-4xl uppercase md:text-5xl">Dashboard Overview</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Monitor real-time revenue, manage video programs, and run 1:1 coaching.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button onClick={simulateNewSale} variant="outline" className="border-primary/40 text-lime-ink hover:bg-primary/10">
            <Zap className="size-4" /> Simulate Live Sale
          </Button>
          <Button asChild className="font-semibold">
            <Link href="/dashboard/slots">
              <Plus className="size-4" /> Add Open Slot
            </Link>
          </Button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {/* Total Gross Earnings */}
        <div className="rounded-2xl border border-border bg-surface p-6">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-semibold uppercase tracking-wider">Gross Earnings</span>
            <DollarSign className="size-4 text-lime-ink" />
          </div>
          <p className="font-display mt-3 text-4xl uppercase text-foreground">
            {formatPrice(totalEarningsCents)}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            <span className="text-lime-ink font-semibold">+18.4%</span> vs last month
          </p>
        </div>

        {/* Total Paid Orders */}
        <div className="rounded-2xl border border-border bg-surface p-6">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Sales</span>
            <Sparkles className="size-4 text-lime-ink" />
          </div>
          <p className="font-display mt-3 text-4xl uppercase text-foreground">{totalSalesCount}</p>
          <p className="mt-1 text-xs text-muted-foreground">Programs & 1:1 sessions</p>
        </div>

        {/* Upcoming Sessions */}
        <div className="rounded-2xl border border-border bg-surface p-6">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-semibold uppercase tracking-wider">Upcoming Calls</span>
            <Calendar className="size-4 text-lime-ink" />
          </div>
          <p className="font-display mt-3 text-4xl uppercase text-foreground">
            {upcomingSessions.length}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">Scheduled for this week</p>
        </div>

        {/* Rating Score */}
        <div className="rounded-2xl border border-border bg-surface p-6">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-semibold uppercase tracking-wider">Client Rating</span>
            <Star className="size-4 text-lime-ink fill-primary" />
          </div>
          <p className="font-display mt-3 text-4xl uppercase text-foreground">4.9 / 5.0</p>
          <p className="mt-1 text-xs text-muted-foreground">100% positive reviews</p>
        </div>
      </div>

      {/* Revenue Analytics Bar Chart (Solid Single-Color Design) */}
      <EarningsBarChart />

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.3fr_1fr]">
        {/* Left: Neon Realtime Live Sales Feed */}
        <div className="flex flex-col rounded-3xl border border-border bg-surface p-6">
          <div className="mb-6 flex items-center justify-between border-b border-border pb-4">
            <div className="flex items-center gap-2.5">
              <span className="relative flex size-3">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex size-3 rounded-full bg-primary" />
              </span>
              <div>
                <h3 className="font-display text-xl uppercase">Live Sales & Bookings</h3>
                <p className="text-xs text-muted-foreground">Subscribed via Neon Realtime</p>
              </div>
            </div>
            <span className="rounded-full bg-surface-2 px-2.5 py-1 text-[11px] font-mono text-muted-foreground">
              {sales.length} events
            </span>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto max-h-[460px] pr-1">
            {sales.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between rounded-2xl border border-border/60 bg-surface-2/60 p-4 transition-all hover:border-primary/40"
              >
                <div className="flex items-center gap-3">
                  <UserAvatar name={item.client?.name || 'Client'} className="size-10" />
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      {item.client?.name || 'Client'}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {item.kind === 'program'
                        ? `Bought Program: ${item.program?.title || 'Strong Base'}`
                        : 'Booked 1:1 Live Video Session (60m)'}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-display text-xl text-lime-ink">
                    +{formatPrice(item.amountCents)}
                  </span>
                  <span className="block text-[10px] text-muted-foreground">
                    {new Date(item.createdAt).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Upcoming Sessions Schedule */}
        <div className="flex flex-col rounded-3xl border border-border bg-surface p-6">
          <div className="mb-6 flex items-center justify-between border-b border-border pb-4">
            <div>
              <h3 className="font-display text-xl uppercase">Booked 1:1 Calls</h3>
              <p className="text-xs text-muted-foreground">Stream video coaching sessions</p>
            </div>
            <Button asChild variant="ghost" size="sm">
              <Link href="/dashboard/slots">All Slots</Link>
            </Button>
          </div>

          <div className="space-y-4">
            {upcomingSessions.length > 0 ? (
              upcomingSessions.map(({ slot, client }) => {
                const date = new Date(slot.startsAt);
                return (
                  <div
                    key={slot.id}
                    className="flex flex-col justify-between rounded-2xl border border-border bg-surface-2 p-4"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <UserAvatar name={client.name} className="size-9" />
                        <div>
                          <p className="text-sm font-semibold text-foreground">{client.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {date.toLocaleDateString(undefined, {
                              weekday: 'short',
                              month: 'short',
                              day: 'numeric',
                            })}{' '}
                            at{' '}
                            {date.toLocaleTimeString(undefined, {
                              hour: 'numeric',
                              minute: '2-digit',
                            })}
                          </p>
                        </div>
                      </div>
                      <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-lime-ink">
                        Confirmed
                      </span>
                    </div>

                    <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
                      <span className="text-xs text-muted-foreground">Slot #{slot.id}</span>
                      <Button asChild size="sm" className="font-semibold">
                        <Link href={`/call/${slot.id}`}>
                          <Video className="size-3.5" /> Launch Call Room
                        </Link>
                      </Button>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-sm text-muted-foreground">No upcoming booked sessions.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

