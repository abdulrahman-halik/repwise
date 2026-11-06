import type { Metadata } from 'next';
import { auth } from '@/lib/auth/server';
import { db, purchases, programs, profiles, slots, lessons } from '@/lib/db';
import { eq, desc, and } from 'drizzle-orm';
import { LibraryClient } from './LibraryClient';
import { libraryFor } from '@/lib/queries';
import { CURRENT_CLIENT_ID } from '@/lib/mock-data';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'My Library & Bookings',
  description: 'Access your purchased workout programs, video lessons and scheduled 1:1 sessions.',
};

export default async function LibraryPage() {
  const { data: session } = await auth.getSession();
  const clientId = session?.user?.id || session?.user?.email || CURRENT_CLIENT_ID;

  // Read purchases from Neon Postgres
  const dbPurchases = await db
    .select()
    .from(purchases)
    .where(eq(purchases.clientId, clientId))
    .orderBy(desc(purchases.createdAt));

  // If no DB purchases yet for this user and fallback needed
  if (dbPurchases.length === 0 && clientId === CURRENT_CLIENT_ID) {
    const { ownedPrograms, sessions } = libraryFor(CURRENT_CLIENT_ID);
    return (
      <LibraryClient
        ownedPrograms={ownedPrograms}
        sessions={sessions}
        purchases={[]}
      />
    );
  }

  // Map owned programs from DB
  const progPurchases = dbPurchases.filter((p) => p.kind === 'program' && p.programId);
  const ownedPrograms = await Promise.all(
    progPurchases.map(async (p) => {
      const [prog] = await db.select().from(programs).where(eq(programs.id, p.programId!)).limit(1);
      const [trainer] = await db
        .select()
        .from(profiles)
        .where(eq(profiles.userId, prog?.trainerId || p.trainerId))
        .limit(1);
      const progLessons = await db.select().from(lessons).where(eq(lessons.programId, p.programId!));
      return {
        program: prog || { id: p.programId, title: 'Workout Program', priceCents: p.amountCents },
        trainer: trainer || { name: 'Coach', userId: p.trainerId },
        lessonCount: progLessons.length,
      };
    })
  );

  // Map booked sessions from DB
  const bookedSlots = await db
    .select()
    .from(slots)
    .where(and(eq(slots.clientId, clientId), eq(slots.status, 'booked')))
    .orderBy(slots.startsAt);

  const sessions = await Promise.all(
    bookedSlots.map(async (slot) => {
      const [trainer] = await db.select().from(profiles).where(eq(profiles.userId, slot.trainerId)).limit(1);
      return {
        slot: {
          id: slot.id,
          trainerId: slot.trainerId,
          startsAt: slot.startsAt.toISOString(),
          status: slot.status as any,
          clientId: slot.clientId,
          heldUntil: slot.heldUntil ? slot.heldUntil.toISOString() : null,
        },
        trainer: trainer || { name: 'Coach', userId: slot.trainerId },
      };
    })
  );

  const formattedPurchases = dbPurchases.map((p) => ({
    id: p.id,
    clientId: p.clientId,
    trainerId: p.trainerId,
    kind: p.kind as any,
    programId: p.programId,
    slotId: p.slotId,
    amountCents: p.amountCents,
    stripeSessionId: p.stripeSessionId,
    createdAt: p.createdAt ? p.createdAt.toISOString() : new Date().toISOString(),
  }));

  return (
    <LibraryClient
      ownedPrograms={ownedPrograms as any}
      sessions={sessions as any}
      purchases={formattedPurchases as any}
    />
  );
}
