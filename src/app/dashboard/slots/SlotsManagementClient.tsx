'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Calendar,
  CheckCircle2,
  Clock,
  Hourglass,
  Plus,
  Trash2,
  Video,
} from 'lucide-react';
import { UserAvatar } from '@/components/site/UserAvatar';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import type { Profile, Slot } from '@/lib/types';
import { toast } from 'sonner';

export function SlotsManagementClient({
  initialSlots,
  clients,
}: {
  initialSlots: Slot[];
  clients: Profile[];
}) {
  const [slots, setSlots] = useState(initialSlots);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [datetime, setDatetime] = useState('');
  const [filter, setFilter] = useState<'all' | 'open' | 'held' | 'booked'>('all');

  const handleAddSlot = (e: React.FormEvent) => {
    e.preventDefault();
    if (!datetime) return;

    const newSlot: Slot = {
      id: `s-${Date.now()}`,
      trainerId: 't-maya',
      startsAt: new Date(datetime).toISOString(),
      status: 'open',
      clientId: null,
      heldUntil: null,
    };

    setSlots([newSlot, ...slots]);
    setIsAddOpen(false);
    setDatetime('');
    toast.success('Open 60-minute coaching slot added to calendar!');
  };

  const handleDeleteSlot = (id: string) => {
    setSlots((prev) => prev.filter((s) => s.id !== id));
    toast.info('Slot removed.');
  };

  const filteredSlots = slots.filter((s) => {
    if (filter === 'all') return true;
    return s.status === filter;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <span className="eyebrow">Availability & Schedule</span>
          <h1 className="font-display mt-1 text-4xl uppercase md:text-5xl">1:1 Coaching Slots</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Post 60-minute available times for clients to hold and book through Stripe Checkout.
          </p>
        </div>

        <Button onClick={() => setIsAddOpen(true)} className="font-semibold">
          <Plus className="size-4" /> Add Open Slot
        </Button>
      </div>

      {/* Filter Tabs */}
      <div className="flex border-b border-border">
        {(['all', 'open', 'held', 'booked'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`border-b-2 px-5 py-3 text-xs font-semibold uppercase tracking-wider transition-colors ${
              filter === tab
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            {tab} ({slots.filter((s) => tab === 'all' || s.status === tab).length})
          </button>
        ))}
      </div>

      {/* Slots Table */}
      <div className="overflow-hidden rounded-3xl border border-border bg-surface">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border bg-surface-2 text-xs uppercase text-muted-foreground">
            <tr>
              <th className="px-6 py-4">Slot ID</th>
              <th className="px-6 py-4">Date & Local Time</th>
              <th className="px-6 py-4">Duration</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Client / Booking</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filteredSlots.map((slot) => {
              const date = new Date(slot.startsAt);
              const client = clients.find((c) => c.userId === slot.clientId);

              return (
                <tr key={slot.id} className="hover:bg-surface-2/40">
                  <td className="px-6 py-4 font-mono text-xs text-muted-foreground">
                    #{slot.id}
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-semibold text-foreground">
                      {date.toLocaleDateString(undefined, {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                    <span className="block text-xs text-muted-foreground">
                      {date.toLocaleTimeString(undefined, {
                        hour: 'numeric',
                        minute: '2-digit',
                      })}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs text-muted-foreground">60 mins</td>
                  <td className="px-6 py-4">
                    {slot.status === 'open' && (
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/40 bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-lime-ink">
                        <span className="size-1.5 rounded-full bg-primary" /> Open
                      </span>
                    )}
                    {slot.status === 'held' && (
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/40 bg-amber-500/10 px-2.5 py-0.5 text-xs font-semibold text-amber-500">
                        <Hourglass className="size-3" /> In Checkout (Held)
                      </span>
                    )}
                    {slot.status === 'booked' && (
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-400">
                        <CheckCircle2 className="size-3" /> Booked
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {client ? (
                      <div className="flex items-center gap-2.5">
                        <UserAvatar name={client.name} className="size-7" />
                        <div>
                          <p className="text-xs font-semibold text-foreground">{client.name}</p>
                          <p className="text-[10px] text-muted-foreground">Paid 1:1 Session</p>
                        </div>
                      </div>
                    ) : (
                      <span className="text-xs text-muted-foreground">—</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    {slot.status === 'open' ? (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteSlot(slot.id)}
                        className="text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="size-4" /> Delete
                      </Button>
                    ) : slot.status === 'booked' ? (
                      <Button asChild size="sm">
                        <Link href={`/call/${slot.id}`}>
                          <Video className="size-3.5" /> Join Call
                        </Link>
                      </Button>
                    ) : (
                      <span className="text-xs text-muted-foreground">Locked</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Add Slot Modal */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl uppercase">
              Add Available Time Slot
            </DialogTitle>
            <DialogDescription>
              Select the start time for a 60-minute private video coaching call.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleAddSlot} className="space-y-4 py-2">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Date & Start Time
              </label>
              <input
                type="datetime-local"
                required
                value={datetime}
                onChange={(e) => setDatetime(e.target.value)}
                className="mt-1.5 h-11 w-full rounded-xl border border-border bg-surface-2 px-3 text-sm text-foreground focus:border-primary focus:outline-none"
              />
            </div>

            <div className="rounded-xl border border-border bg-surface-2 p-3 text-xs text-muted-foreground">
              <p className="font-medium text-foreground">Session Configuration:</p>
              <p className="mt-1">Duration: 60 minutes · Pricing: $85 (your set rate)</p>
            </div>

            <DialogFooter className="mt-6 flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsAddOpen(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button type="submit" className="flex-1 font-semibold">
                Save Open Slot
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

