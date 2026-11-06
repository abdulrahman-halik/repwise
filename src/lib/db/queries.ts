import { desc, eq } from 'drizzle-orm';
import { db } from './index';
import { profiles, programs, lessons, slots, purchases, reviews } from './schema';

export async function getDbProfiles() {
  return await db.select().from(profiles);
}

export async function getDbTrainers() {
  return await db.select().from(profiles).where(eq(profiles.role, 'trainer'));
}

export async function getDbPrograms() {
  return await db.select().from(programs);
}

export async function getDbLessons(programId: string) {
  return await db.select().from(lessons).where(eq(lessons.programId, programId));
}

export async function getDbSlots(trainerId: string) {
  return await db.select().from(slots).where(eq(slots.trainerId, trainerId));
}

export async function getDbReviews(trainerId: string) {
  return await db
    .select()
    .from(reviews)
    .where(eq(reviews.trainerId, trainerId))
    .orderBy(desc(reviews.createdAt));
}

export async function getDbPurchases(clientId: string) {
  return await db.select().from(purchases).where(eq(purchases.clientId, clientId));
}

