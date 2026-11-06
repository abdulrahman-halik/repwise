import type { Metadata } from 'next';
import { db, purchases, profiles, programs as programsTable, slots } from '@/lib/db';
import { desc, eq } from 'drizzle-orm';
import { CURRENT_TRAINER_ID } from '@/lib/mock-data';
import { programsByTrainer, trainerOverview, trainerSales } from '@/lib/queries';
import { DashboardOverviewClient } from './DashboardOverviewClient';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Trainer Dashboard Overview',
  description: 'Repwise Trainer overview: live revenue feed, upcoming client video sessions, and analytics.',
};

export default async function DashboardOverviewPage() {
  const trainerId = CURRENT_TRAINER_ID;

  // 1. Fetch real sales from Neon Postgres
  const rawSales = await db
    .select({
      id: purchases.id,
      clientId: purchases.clientId,
      trainerId: purchases.trainerId,
      kind: purchases.kind,
      programId: purchases.programId,
      slotId: purchases.slotId,
      amountCents: purchases.amountCents,
      stripeSessionId: purchases.stripeSessionId,
      createdAt: purchases.createdAt,
      clientName: profiles.name,
      clientAvatar: profiles.avatarUrl,
      programTitle: programsTable.title,
    })
    .from(purchases)
    .leftJoin(profiles, eq(purchases.clientId, profiles.userId))
    .leftJoin(programsTable, eq(purchases.programId, programsTable.id))
    .where(eq(purchases.trainerId, trainerId))
    .orderBy(desc(purchases.createdAt));

  const sales =
    rawSales.length > 0
      ? rawSales.map((s) => ({
          id: s.id,
          clientId: s.clientId,
          trainerId: s.trainerId,
          kind: s.kind as any,
          programId: s.programId,
          slotId: s.slotId,
          amountCents: s.amountCents,
          stripeSessionId: s.stripeSessionId,
          createdAt: s.createdAt.toISOString(),
          client: {
            userId: s.clientId,
            name: s.clientName || 'Athlete',
            avatarUrl: s.clientAvatar,
            role: 'client' as const,
          },
          program: s.programTitle ? { title: s.programTitle } : undefined,
        }))
      : trainerSales(CURRENT_TRAINER_ID);

  // 2. Fetch upcoming booked sessions from Neon Postgres
  const dbSlots = await db
    .select()
    .from(slots)
    .where(eq(slots.trainerId, trainerId));

  const bookedSlots = dbSlots.filter((s) => s.status === 'booked');
  let upcomingSessions: any[] = [];
  if (bookedSlots.length > 0) {
    upcomingSessions = await Promise.all(
      bookedSlots.map(async (slot) => {
        const [client] = slot.clientId
          ? await db.select().from(profiles).where(eq(profiles.userId, slot.clientId)).limit(1)
          : [null];
        return {
          slot: {
            id: slot.id,
            trainerId: slot.trainerId,
            startsAt: slot.startsAt.toISOString(),
            status: slot.status as any,
            clientId: slot.clientId,
            heldUntil: slot.heldUntil ? slot.heldUntil.toISOString() : null,
          },
          client: client || { name: 'Client', userId: slot.clientId || 'client' },
        };
      })
    );
  } else {
    upcomingSessions = trainerOverview(CURRENT_TRAINER_ID).upcoming;
  }

  // 3. Fetch programs from Neon Postgres
  const dbPrograms = await db
    .select()
    .from(programsTable)
    .where(eq(programsTable.trainerId, trainerId));

  const programs =
    dbPrograms.length > 0
      ? dbPrograms.map((p) => ({
          id: p.id,
          trainerId: p.trainerId,
          title: p.title,
          description: p.description,
          coverUrl: p.coverUrl,
          priceCents: p.priceCents,
          published: p.published,
          createdAt: p.createdAt.toISOString(),
          level: (p.level as any) || 'Beginner',
          weeks: p.weeks || 4,
        }))
      : programsByTrainer(CURRENT_TRAINER_ID);

  return (
    <DashboardOverviewClient
      initialSales={sales as any}
      upcomingSessions={upcomingSessions}
      initialPrograms={programs as any}
    />
  );
}
