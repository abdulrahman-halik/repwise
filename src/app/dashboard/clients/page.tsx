import type { Metadata } from 'next';
import { clients, CURRENT_TRAINER_ID, purchases } from '@/lib/mock-data';
import { ClientsRosterClient } from './ClientsRosterClient';

export const metadata: Metadata = {
  title: 'Client Roster · Trainer Studio',
  description: 'View active clients, order histories, and send direct messages.',
};

export default function DashboardClientsPage() {
  const trainerPurchases = purchases.filter((p) => p.trainerId === CURRENT_TRAINER_ID);

  // Group by distinct client
  const clientMap = new Map<string, typeof trainerPurchases>();
  for (const p of trainerPurchases) {
    const list = clientMap.get(p.clientId) || [];
    list.push(p);
    clientMap.set(p.clientId, list);
  }

  const clientsWithStats = Array.from(clientMap.entries()).map(([clientId, clientP]) => {
    const client = clients.find((c) => c.userId === clientId) || {
      userId: clientId,
      name: 'Client',
      role: 'client' as const,
      avatarUrl: null,
      coverUrl: null,
      headline: null,
      bio: null,
      specialties: null,
      sessionPriceCents: null,
    };

    const totalSpentCents = clientP.reduce((s, p) => s + p.amountCents, 0);
    const sorted = [...clientP].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    const lastActive = sorted[0]?.createdAt || new Date().toISOString();

    return {
      client,
      purchases: clientP,
      totalSpentCents,
      lastActive,
    };
  });

  return <ClientsRosterClient clientsWithStats={clientsWithStats} />;
}

