'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import {
  Calendar,
  CheckCircle2,
  Clock,
  Dumbbell,
  PlayCircle,
  Receipt,
  Sparkles,
  Video,
} from 'lucide-react';
import { Photo } from '@/components/site/Photo';
import { UserAvatar } from '@/components/site/UserAvatar';
import { Button } from '@/components/ui/button';
import { formatPrice } from '@/lib/format';
import type { Profile, Program, Purchase, Slot } from '@/lib/types';

export function LibraryClient({
  ownedPrograms,
  sessions,
  purchases,
}: {
  ownedPrograms: { program: Program; trainer: Profile; lessonCount: number }[];
  sessions: { slot: Slot; trainer: Profile }[];
  purchases: Purchase[];
}) {
  const [activeTab, setActiveTab] = useState<'programs' | 'sessions' | 'receipts'>('programs');
  const [clientSessions, setClientSessions] = useState(sessions);

  const refreshSessions = useCallback(async () => {
    try {
      const res = await fetch('/api/bookings');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.sessions)) {
          setClientSessions(data.sessions);
        }
      }
    } catch {
      // quiet fallback
    }
  }, []);

  useEffect(() => {
    let bc: BroadcastChannel | null = null;
    let sse: EventSource | null = null;

    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      try {
        bc = new BroadcastChannel('repwise_slots');
        bc.onmessage = (event) => {
          if (event.data?.type === 'SLOT_BOOKED') {
            refreshSessions();
          }
        };
      } catch {}
    }

    try {
      sse = new EventSource('/api/realtime/slots/stream');
      sse.onmessage = (msg) => {
        try {
          const data = JSON.parse(msg.data);
          if (data.type === 'SLOT_BOOKED') {
            refreshSessions();
          }
        } catch {}
      };
    } catch {}

    const interval = setInterval(refreshSessions, 5000);
    const handleFocus = () => refreshSessions();
    window.addEventListener('focus', handleFocus);

    return () => {
      clearInterval(interval);
      if (bc) bc.close();
      if (sse) sse.close();
      window.removeEventListener('focus', handleFocus);
    };
  }, [refreshSessions]);

  return (
    <div className="container-page py-10 md:py-16">
      {/* Page Title */}
      <div className="mb-8 max-w-xl">
        <p className="eyebrow mb-2">Member Portal</p>
        <h1 className="font-display text-4xl uppercase md:text-6xl">
          My <span className="text-lime-ink">Library</span>
        </h1>
        <p className="mt-2 text-sm text-muted-foreground md:text-base">
          All your purchased training programs, upcoming 1:1 video coaching sessions, and receipts in one place.
        </p>
      </div>

      {/* Tabs */}
      <div className="mb-8 flex border-b border-border">
        <button
          onClick={() => setActiveTab('programs')}
          className={`flex items-center gap-2 border-b-2 px-6 py-3 text-sm font-semibold uppercase tracking-wider transition-colors ${
            activeTab === 'programs'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <Dumbbell className="size-4" /> My Programs ({ownedPrograms.length})
        </button>
        <button
          onClick={() => setActiveTab('sessions')}
          className={`flex items-center gap-2 border-b-2 px-6 py-3 text-sm font-semibold uppercase tracking-wider transition-colors ${
            activeTab === 'sessions'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <Video className="size-4" /> Upcoming 1:1 Sessions ({clientSessions.length})
        </button>
        <button
          onClick={() => setActiveTab('receipts')}
          className={`flex items-center gap-2 border-b-2 px-6 py-3 text-sm font-semibold uppercase tracking-wider transition-colors ${
            activeTab === 'receipts'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <Receipt className="size-4" /> Order History ({purchases.length})
        </button>
      </div>

      {/* Tab 1: Owned Programs */}
      {activeTab === 'programs' && (
        <div>
          {ownedPrograms.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {ownedPrograms.map(({ program, trainer, lessonCount }) => (
                <div
                  key={program.id}
                  className="flex flex-col overflow-hidden rounded-2xl border border-border bg-surface"
                >
                  <div className="relative aspect-[16/10]">
                    <Photo
                      src={program.coverUrl}
                      alt={program.title}
                      seed={program.id}
                      className="size-full"
                    />
                    <div className="absolute inset-0 bg-black/40" />
                    <span className="absolute left-3 top-3 rounded-full bg-black/60 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur">
                      {program.level} · {program.weeks} weeks
                    </span>
                    <span className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 text-xs font-semibold text-lime-ink">
                      <CheckCircle2 className="size-4" /> Full Access Unlocked
                    </span>
                  </div>

                  <div className="flex flex-1 flex-col p-5">
                    <p className="text-xs text-muted-foreground">Coach {trainer.name}</p>
                    <h3 className="mt-1 text-lg font-semibold">{program.title}</h3>
                    <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                      {program.description}
                    </p>

                    <div className="mt-auto pt-6">
                      <div className="mb-3 flex items-center justify-between text-xs text-muted-foreground">
                        <span>Progress</span>
                        <span className="font-semibold text-foreground">3 / {lessonCount} Lessons Completed</span>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-surface-2 overflow-hidden">
                        <div className="h-full bg-primary" style={{ width: '45%' }} />
                      </div>

                      <Button asChild className="mt-4 w-full font-semibold">
                        <Link href={`/programs/${program.id}?lesson=2`}>
                          <PlayCircle className="size-4" /> Continue Watching
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-border p-12 text-center">
              <Dumbbell className="mx-auto size-10 text-muted-foreground/60" />
              <h3 className="font-display mt-4 text-2xl uppercase">No programs yet</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Browse our directory of expert coaches and unlock your first workout program.
              </p>
              <Button asChild className="mt-6 font-semibold">
                <Link href="/trainers">Explore Coaches</Link>
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Booked Live Sessions */}
      {activeTab === 'sessions' && (
        <div>
          {clientSessions.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {clientSessions.map(({ slot, trainer }) => {
                const date = new Date(slot.startsAt);
                return (
                  <div
                    key={slot.id}
                    className="flex flex-col justify-between rounded-2xl border border-primary/30 bg-surface p-6 shadow-sm"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-xs font-semibold text-lime-ink">
                          <span className="size-2 animate-pulse rounded-full bg-primary" /> Confirmed 1:1 Call
                        </span>
                        <span className="text-xs text-muted-foreground">Slot #{slot.id}</span>
                      </div>

                      <div className="mt-5 flex items-center gap-4">
                        <UserAvatar name={trainer.name} className="size-14" />
                        <div>
                          <h3 className="font-display text-2xl uppercase">{trainer.name}</h3>
                          <p className="text-xs text-muted-foreground">{trainer.headline}</p>
                        </div>
                      </div>

                      <div className="mt-6 rounded-xl border border-border bg-surface-2 p-4 text-sm">
                        <div className="flex items-center gap-2">
                          <Calendar className="size-4 text-lime-ink" />
                          <span className="font-semibold text-foreground">
                            {date.toLocaleDateString(undefined, {
                              weekday: 'long',
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                          </span>
                        </div>
                        <div className="mt-2 flex items-center gap-2 text-muted-foreground">
                          <Clock className="size-4 text-lime-ink" />
                          <span>
                            {date.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })} (60
                            min)
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 flex flex-col gap-2.5 sm:flex-row">
                      <Button asChild size="lg" className="flex-1 font-semibold">
                        <Link href={`/call/${slot.id}`}>
                          <Video className="size-4" /> Join Video Call
                        </Link>
                      </Button>
                      <Button asChild variant="outline" size="lg">
                        <Link href="/messages">Message Coach</Link>
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-border p-12 text-center">
              <Calendar className="mx-auto size-10 text-muted-foreground/60" />
              <h3 className="font-display mt-4 text-2xl uppercase">No booked sessions</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Book a 1:1 live video training call with one of our certified trainers.
              </p>
              <Button asChild className="mt-6 font-semibold">
                <Link href="/trainers">Find a Trainer</Link>
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Receipts / Order History */}
      {activeTab === 'receipts' && (
        <div className="overflow-hidden rounded-2xl border border-border bg-surface">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border bg-surface-2 text-xs uppercase text-muted-foreground">
              <tr>
                <th className="px-6 py-4">Item & Kind</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {purchases.map((p) => (
                <tr key={p.id} className="hover:bg-surface-2/40">
                  <td className="px-6 py-4">
                    <span className="font-semibold text-foreground">
                      {p.kind === 'program' ? 'Workout Program Purchase' : '1:1 Coaching Live Session'}
                    </span>
                    <span className="block text-xs text-muted-foreground">ID: {p.stripeSessionId}</span>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">
                    {new Date(p.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 font-mono font-semibold text-foreground">
                    {formatPrice(p.amountCents)}
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-lime-ink">
                      Paid · Stripe
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

