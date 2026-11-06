'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Calendar,
  DollarSign,
  Dumbbell,
  Mail,
  MessageSquare,
  Search,
  Sparkles,
} from 'lucide-react';
import { UserAvatar } from '@/components/site/UserAvatar';
import { Button } from '@/components/ui/button';
import { formatPrice } from '@/lib/format';
import type { Profile, Purchase } from '@/lib/types';

export function ClientsRosterClient({
  clientsWithStats,
}: {
  clientsWithStats: {
    client: Profile;
    purchases: Purchase[];
    totalSpentCents: number;
    lastActive: string;
  }[];
}) {
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = clientsWithStats.filter((c) =>
    c.client.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <span className="eyebrow">Client Roster</span>
          <h1 className="font-display mt-1 text-4xl uppercase md:text-5xl">My Clients</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Athletes who have purchased your programs or booked private 1:1 sessions.
          </p>
        </div>

        <div className="relative w-full max-w-xs">
          <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search client by name..."
            className="h-10 w-full rounded-xl border border-border bg-surface pl-10 pr-3 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
          />
        </div>
      </div>

      {/* Clients Table */}
      <div className="overflow-hidden rounded-3xl border border-border bg-surface">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border bg-surface-2 text-xs uppercase text-muted-foreground">
            <tr>
              <th className="px-6 py-4">Client Name</th>
              <th className="px-6 py-4">Purchased Products</th>
              <th className="px-6 py-4">Total Invested</th>
              <th className="px-6 py-4">Last Activity</th>
              <th className="px-6 py-4 text-right">Direct Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filtered.map(({ client, purchases, totalSpentCents, lastActive }) => {
              const programCount = purchases.filter((p) => p.kind === 'program').length;
              const sessionCount = purchases.filter((p) => p.kind === 'session').length;

              return (
                <tr key={client.userId} className="hover:bg-surface-2/40">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <UserAvatar name={client.name} className="size-10" />
                      <div>
                        <p className="font-semibold text-foreground">{client.name}</p>
                        <p className="text-xs text-muted-foreground">{client.userId}@repwise.demo</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-2 text-xs">
                      {programCount > 0 && (
                        <span className="inline-flex items-center gap-1 rounded-full border border-border bg-surface-2 px-2.5 py-0.5 font-medium text-foreground">
                          <Dumbbell className="size-3 text-lime-ink" /> {programCount} Program{programCount > 1 ? 's' : ''}
                        </span>
                      )}
                      {sessionCount > 0 && (
                        <span className="inline-flex items-center gap-1 rounded-full border border-border bg-surface-2 px-2.5 py-0.5 font-medium text-foreground">
                          <Calendar className="size-3 text-lime-ink" /> {sessionCount} 1:1 Session{sessionCount > 1 ? 's' : ''}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 font-mono font-semibold text-foreground">
                    {formatPrice(totalSpentCents)}
                  </td>
                  <td className="px-6 py-4 text-xs text-muted-foreground">
                    {new Date(lastActive).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Button asChild variant="outline" size="sm">
                      <Link href="/messages">
                        <MessageSquare className="size-3.5" /> Message
                      </Link>
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

