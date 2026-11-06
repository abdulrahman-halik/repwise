'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ArrowUpRight,
  Calendar,
  CheckCircle2,
  DollarSign,
  Dumbbell,
  Edit3,
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
import type { Profile, Program, Purchase, Slot } from '@/lib/types';
import { toast } from 'sonner';

export function DashboardOverviewClient({
  initialSales,
  upcomingSessions,
  initialPrograms = [],
}: {
  initialSales: (Purchase & { client: Profile; program?: any; slot?: any })[];
  upcomingSessions: { slot: Slot; client: Profile }[];
  initialPrograms?: Program[];
}) {
  const [sales, setSales] = useState(initialSales);
  const [programs] = useState(initialPrograms);

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

      {/* 3:1 Column Split: Revenue Analytics Bar Chart (3/4) & Live Sales Feed (1/4) */}
      <div className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-4">
        {/* Left: Revenue Analytics Bar Chart (lg:col-span-3) */}
        <div className="flex flex-col lg:col-span-3">
          <EarningsBarChart className="h-full" />
        </div>

        {/* Right: Neon Realtime Live Sales Feed (lg:col-span-1) */}
        <div className="flex flex-col h-full rounded-3xl border border-border bg-surface p-6 sm:p-8 lg:col-span-1">
          <div className="mb-6 flex items-center justify-between border-b border-border pb-4">
            <div className="flex items-center gap-2">
              <span className="relative flex size-2.5">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex size-2.5 rounded-full bg-primary" />
              </span>
              <div>
                <h3 className="font-display text-lg uppercase leading-tight text-foreground">Live Feed</h3>
                <p className="text-[10px] text-muted-foreground">Neon Realtime</p>
              </div>
            </div>
            <span className="rounded-full bg-surface-2 px-2.5 py-0.5 text-[10px] font-mono font-medium text-muted-foreground">
              {sales.length} events
            </span>
          </div>

          <div className="flex-1 space-y-2.5 overflow-y-auto max-h-[460px] pr-1 scrollbar-thin">
            {sales.map((item) => (
              <div
                key={item.id}
                className="flex flex-col gap-1.5 rounded-2xl border border-border/60 bg-surface-2/60 p-3 transition-colors hover:border-primary/40"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <UserAvatar name={item.client?.name || 'Client'} className="size-6 shrink-0" />
                    <p className="truncate text-xs font-semibold text-foreground">
                      {item.client?.name || 'Client'}
                    </p>
                  </div>
                  <span className="font-display text-base text-lime-ink shrink-0">
                    +{formatPrice(item.amountCents)}
                  </span>
                </div>

                <div className="flex items-center justify-between border-t border-border/30 pt-1 text-[11px] text-muted-foreground">
                  <span className="truncate max-w-[130px]">
                    {item.kind === 'program' ? item.program?.title || 'Program' : '1:1 Session (60m)'}
                  </span>
                  <span className="shrink-0 text-[10px] font-mono">
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
      </div>

      {/* Equal 2-Column Responsive Layout (50/50 Split): Booked 1:1 Calls (Left) & Your Programs (Right) */}
      <div className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-2">
        {/* Left Module: Booked 1:1 Calls */}
        <div className="flex flex-col h-full rounded-3xl border border-border bg-surface p-6 sm:p-8">
          <div className="mb-6 flex items-center justify-between border-b border-border pb-4">
            <div>
              <h3 className="font-display text-2xl uppercase">Booked 1:1 Calls</h3>
              <p className="text-xs text-muted-foreground">Stream live video coaching sessions</p>
            </div>
            <Button asChild variant="outline" size="sm">
              <Link href="/dashboard/slots">All Slots</Link>
            </Button>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto max-h-[440px] pr-1 scrollbar-thin">
            {upcomingSessions.length > 0 ? (
              upcomingSessions.map(({ slot, client }) => {
                const date = new Date(slot.startsAt);
                return (
                  <div
                    key={slot.id}
                    className="flex flex-col justify-between rounded-2xl border border-border bg-surface-2 p-4 transition-colors hover:border-primary/40"
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

                    <div className="mt-4 flex items-center justify-between border-t border-border/40 pt-3">
                      <span className="text-xs text-muted-foreground font-mono">Slot #{slot.id}</span>
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
              <div className="flex flex-col items-center justify-center p-8 text-center text-muted-foreground">
                <Calendar className="size-8 mb-2 opacity-50" />
                <p className="text-sm">No upcoming booked sessions.</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Module: Your Programs (Create & Manage) */}
        <div className="flex flex-col h-full rounded-3xl border border-border bg-surface p-6 sm:p-8">
          <div className="mb-6 flex items-center justify-between border-b border-border pb-4">
            <div>
              <h3 className="font-display text-2xl uppercase">Your Programs</h3>
              <p className="text-xs text-muted-foreground">Active video courses & published plans</p>
            </div>
            <Button asChild size="sm" className="font-semibold">
              <Link href="/dashboard/programs">
                <Plus className="size-3.5" /> New Program
              </Link>
            </Button>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto max-h-[440px] pr-1 scrollbar-thin">
            {programs.length > 0 ? (
              programs.map((prog) => (
                <div
                  key={prog.id}
                  className="flex items-center justify-between gap-4 rounded-2xl border border-border bg-surface-2 p-4 transition-colors hover:border-primary/40"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="grid size-10 shrink-0 place-items-center rounded-xl border border-border bg-surface text-lime-ink">
                      <Dumbbell className="size-5" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="truncate text-sm font-semibold text-foreground">{prog.title}</h4>
                        <span
                          className={`rounded px-1.5 py-0.5 text-[10px] font-semibold ${
                            prog.published
                              ? 'bg-primary/10 text-lime-ink'
                              : 'bg-surface border border-border text-muted-foreground'
                          }`}
                        >
                          {prog.published ? 'Published' : 'Draft'}
                        </span>
                      </div>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {prog.level} · {prog.weeks} weeks
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className="font-display text-lg text-foreground">
                      {formatPrice(prog.priceCents)}
                    </span>
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/dashboard/programs/${prog.id}`}>
                        <Edit3 className="size-3.5" /> Edit
                      </Link>
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center p-8 text-center text-muted-foreground">
                <Dumbbell className="size-8 mb-2 opacity-50" />
                <p className="text-sm">No programs created yet.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

