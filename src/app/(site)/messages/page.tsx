import type { Metadata } from 'next';
import { getDbProfiles } from '@/lib/db/queries';
import { clients as mockClients, trainers as mockTrainers } from '@/lib/mock-data';
import type { Profile } from '@/lib/types';
import { MessagesClient } from './MessagesClient';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Direct Messages · Stream Chat',
  description: 'Direct messaging with your coaches. Discuss programming, video form checks, and nutrition.',
};

export default async function MessagesPage() {
  let trainers: Profile[] = mockTrainers;
  let clients: Profile[] = mockClients;

  try {
    const dbProfiles = await getDbProfiles();
    if (dbProfiles.length > 0) {
      const dbTrainers = dbProfiles
        .filter((p) => p.role === 'trainer')
        .map((p) => ({
          userId: p.userId,
          role: 'trainer' as const,
          name: p.name,
          avatarUrl: p.avatarUrl,
          coverUrl: p.coverUrl,
          headline: p.headline,
          bio: p.bio,
          specialties: (p.specialties || []) as Profile['specialties'],
          sessionPriceCents: p.sessionPriceCents,
          location: p.location ?? undefined,
          yearsCoaching: p.yearsCoaching ?? undefined,
        }));
      const dbClients = dbProfiles
        .filter((p) => p.role === 'client')
        .map((p) => ({
          userId: p.userId,
          role: 'client' as const,
          name: p.name,
          avatarUrl: p.avatarUrl,
          coverUrl: p.coverUrl,
          headline: p.headline,
          bio: p.bio,
          specialties: null,
          sessionPriceCents: null,
        }));

      if (dbTrainers.length > 0) trainers = dbTrainers;
      if (dbClients.length > 0) clients = dbClients;
    }
  } catch {
    // Fallback to mock data if DB query fails
  }

  return <MessagesClient trainers={trainers} clients={clients} />;
}
