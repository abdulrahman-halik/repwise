import type { Metadata } from 'next';
import { db, slots, profiles } from '@/lib/db';
import { eq } from 'drizzle-orm';
import { clients as mockClients, CURRENT_TRAINER_ID } from '@/lib/mock-data';
import { slotsForTrainer } from '@/lib/queries';
import { SlotsManagementClient } from './SlotsManagementClient';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Slots & Calendar · Trainer Studio',
  description: 'Manage 60-minute coaching slots, bookings, and availability calendar.',
};

export default async function DashboardSlotsPage() {
  const trainerId = CURRENT_TRAINER_ID;

  const dbSlots = await db.select().from(slots).where(eq(slots.trainerId, trainerId));
  const trainerSlots =
    dbSlots.length > 0
      ? dbSlots.map((s) => ({
          id: s.id,
          trainerId: s.trainerId,
          startsAt: s.startsAt.toISOString(),
          status: s.status as any,
          clientId: s.clientId,
          heldUntil: s.heldUntil ? s.heldUntil.toISOString() : null,
        }))
      : slotsForTrainer(CURRENT_TRAINER_ID);

  const dbClients = await db.select().from(profiles).where(eq(profiles.role, 'client'));
  const allClients =
    dbClients.length > 0
      ? dbClients.map((c) => ({
          userId: c.userId,
          role: 'client' as const,
          name: c.name,
          avatarUrl: c.avatarUrl,
          coverUrl: c.coverUrl,
          headline: c.headline,
          bio: c.bio,
          specialties: (c.specialties || []) as any,
          sessionPriceCents: c.sessionPriceCents,
        }))
      : mockClients;

  return <SlotsManagementClient initialSlots={trainerSlots} clients={allClients} />;
}
