import { and, desc, eq, sql } from 'drizzle-orm';
import { db } from './index';
import { profiles, programs, lessons, slots, purchases, reviews } from './schema';

export async function getDbProfiles() {
  return await db.select().from(profiles);
}

export async function getDbTrainers() {
  return await db.select().from(profiles).where(eq(profiles.role, 'trainer'));
}

export async function getDbTrainerById(id: string) {
  const [trainer] = await db.select().from(profiles).where(eq(profiles.userId, id)).limit(1);
  return trainer || null;
}

export async function getDbPrograms(trainerId?: string) {
  if (trainerId) {
    return await db.select().from(programs).where(eq(programs.trainerId, trainerId));
  }
  return await db.select().from(programs);
}

export async function getDbPublishedPrograms(trainerId?: string) {
  if (trainerId) {
    return await db
      .select()
      .from(programs)
      .where(and(eq(programs.trainerId, trainerId), eq(programs.published, true)));
  }
  return await db.select().from(programs).where(eq(programs.published, true));
}

export async function getDbProgramById(id: string) {
  const [prog] = await db.select().from(programs).where(eq(programs.id, id)).limit(1);
  return prog || null;
}

export async function getDbLessons(programId: string) {
  return await db
    .select()
    .from(lessons)
    .where(eq(lessons.programId, programId))
    .orderBy(lessons.position);
}

export async function getDbSlots(trainerId: string) {
  return await db
    .select()
    .from(slots)
    .where(eq(slots.trainerId, trainerId))
    .orderBy(slots.startsAt);
}

export async function getDbSlotById(slotId: string) {
  const [slot] = await db
    .select()
    .from(slots)
    .where(eq(slots.id, slotId))
    .limit(1);
  return slot || null;
}

export async function getDbOpenSlots(trainerId: string) {
  return await db
    .select()
    .from(slots)
    .where(and(eq(slots.trainerId, trainerId), eq(slots.status, 'open')))
    .orderBy(slots.startsAt);
}

export async function getDbReviews(trainerId: string) {
  return await db
    .select()
    .from(reviews)
    .where(eq(reviews.trainerId, trainerId))
    .orderBy(desc(reviews.createdAt));
}

export async function getDbTrainerRating(trainerId: string) {
  const revs = await db.select().from(reviews).where(eq(reviews.trainerId, trainerId));
  const count = revs.length;
  const avg = count ? revs.reduce((acc, r) => acc + r.rating, 0) / count : 0;
  return { avg: Math.round(avg * 10) / 10, count };
}

export async function getDbPurchases(clientId: string) {
  return await db
    .select()
    .from(purchases)
    .where(eq(purchases.clientId, clientId))
    .orderBy(desc(purchases.createdAt));
}

export async function getDbTrainerSales(trainerId: string) {
  return await db
    .select()
    .from(purchases)
    .where(eq(purchases.trainerId, trainerId))
    .orderBy(desc(purchases.createdAt));
}

// -------------------
// MUTATIONS
// -------------------

export async function bookSlotInDb(params: {
  slotId: string;
  clientId: string;
  clientName?: string | null;
  clientAvatar?: string | null;
  trainerId: string;
  amountCents: number;
}) {
  const purchaseId = `pu-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  const stripeSessionId = `mock_session_${Date.now()}`;

  // 1. Ensure client profile exists in Neon DB so foreign keys don't fail
  const [existingProfile] = await db
    .select()
    .from(profiles)
    .where(eq(profiles.userId, params.clientId))
    .limit(1);

  if (!existingProfile) {
    await db
      .insert(profiles)
      .values({
        userId: params.clientId,
        name: params.clientName || 'Athlete',
        role: 'client',
        avatarUrl: params.clientAvatar || null,
      })
      .onConflictDoNothing();
  }

  // 2. Verify slot exists and check current availability
  const [targetSlot] = await db
    .select()
    .from(slots)
    .where(eq(slots.id, params.slotId))
    .limit(1);

  if (!targetSlot) {
    throw new Error('Coaching slot not found in database.');
  }

  if (targetSlot.status === 'booked') {
    throw new Error('This slot has already been booked by another athlete.');
  }

  // 3. Atomically mark slot booked ONLY if it is still open
  const [updatedSlot] = await db
    .update(slots)
    .set({
      status: 'booked',
      clientId: params.clientId,
      heldUntil: null,
    })
    .where(and(eq(slots.id, params.slotId), eq(slots.status, 'open')))
    .returning();

  if (!updatedSlot) {
    throw new Error('This slot is no longer available. Please select another time.');
  }

  // 4. Insert purchase record
  const [newPurchase] = await db
    .insert(purchases)
    .values({
      id: purchaseId,
      clientId: params.clientId,
      trainerId: params.trainerId,
      kind: 'session',
      slotId: params.slotId,
      amountCents: params.amountCents,
      stripeSessionId,
    })
    .returning();

  return { purchase: newPurchase, slot: updatedSlot };
}

export async function purchaseProgramInDb(params: {
  programId: string;
  clientId: string;
  trainerId: string;
  amountCents: number;
}) {
  const purchaseId = `pu-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  const stripeSessionId = `mock_prog_session_${Date.now()}`;

  const [newPurchase] = await db
    .insert(purchases)
    .values({
      id: purchaseId,
      clientId: params.clientId,
      trainerId: params.trainerId,
      kind: 'program',
      programId: params.programId,
      amountCents: params.amountCents,
      stripeSessionId,
    })
    .returning();

  return newPurchase;
}

export async function createSlotInDb(params: {
  trainerId: string;
  startsAt: Date;
}) {
  const slotId = `s-${Date.now()}`;
  const [newSlot] = await db
    .insert(slots)
    .values({
      id: slotId,
      trainerId: params.trainerId,
      startsAt: params.startsAt,
      status: 'open',
    })
    .returning();
  return newSlot;
}

export async function deleteSlotInDb(slotId: string) {
  return await db.delete(slots).where(and(eq(slots.id, slotId), eq(slots.status, 'open')));
}

export async function createProgramInDb(params: {
  trainerId: string;
  title: string;
  description: string;
  priceCents: number;
  level: string;
  weeks: number;
  published?: boolean;
}) {
  const progId = `p-${Date.now()}`;
  const [newProg] = await db
    .insert(programs)
    .values({
      id: progId,
      trainerId: params.trainerId,
      title: params.title,
      description: params.description,
      priceCents: params.priceCents,
      level: params.level,
      weeks: params.weeks,
      published: params.published ?? true,
    })
    .returning();
  return newProg;
}

export async function toggleProgramPublishInDb(programId: string) {
  const [prog] = await db.select().from(programs).where(eq(programs.id, programId)).limit(1);
  if (!prog) return null;
  const [updated] = await db
    .update(programs)
    .set({ published: !prog.published })
    .where(eq(programs.id, programId))
    .returning();
  return updated;
}

export async function addReviewInDb(params: {
  trainerId: string;
  clientId: string;
  rating: number;
  comment?: string;
}) {
  const revId = `rev-${Date.now()}`;
  // Upsert review (unique trainerId, clientId)
  const [existing] = await db
    .select()
    .from(reviews)
    .where(and(eq(reviews.trainerId, params.trainerId), eq(reviews.clientId, params.clientId)))
    .limit(1);

  if (existing) {
    const [updated] = await db
      .update(reviews)
      .set({ rating: params.rating, comment: params.comment })
      .where(eq(reviews.id, existing.id))
      .returning();
    return updated;
  }

  const [newReview] = await db
    .insert(reviews)
    .values({
      id: revId,
      trainerId: params.trainerId,
      clientId: params.clientId,
      rating: params.rating,
      comment: params.comment,
    })
    .returning();
  return newReview;
}
