import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from '../src/lib/db/schema';
import {
  clients,
  lessons,
  programs,
  purchases,
  reviews,
  slots,
  trainers,
} from '../src/lib/mock-data';

const connectionString = process.env.DATABASE_URL!;
if (!connectionString) {
  throw new Error('DATABASE_URL is not set');
}

const client = neon(connectionString);
const db = drizzle(client, { schema });

async function seed() {
  console.log('🌱 Seeding database...');

  // Clean up in reverse dependency order
  await db.delete(schema.reviews);
  await db.delete(schema.purchases);
  await db.delete(schema.slots);
  await db.delete(schema.lessons);
  await db.delete(schema.programs);
  await db.delete(schema.profiles);

  console.log('Inserting profiles...');
  const allProfiles = [...trainers, ...clients].map((p) => ({
    userId: p.userId,
    role: p.role,
    name: p.name,
    avatarUrl: p.avatarUrl,
    coverUrl: p.coverUrl,
    headline: p.headline,
    bio: p.bio,
    specialties: p.specialties,
    sessionPriceCents: p.sessionPriceCents,
    location: p.location,
    yearsCoaching: p.yearsCoaching,
  }));
  await db.insert(schema.profiles).values(allProfiles);

  console.log('Inserting programs...');
  const allPrograms = programs.map((p) => ({
    id: p.id,
    trainerId: p.trainerId,
    title: p.title,
    description: p.description,
    coverUrl: p.coverUrl,
    priceCents: p.priceCents,
    published: p.published,
    level: p.level,
    weeks: p.weeks,
  }));
  await db.insert(schema.programs).values(allPrograms);

  console.log('Inserting lessons...');
  const allLessons = lessons.map((l) => ({
    id: l.id,
    programId: l.programId,
    title: l.title,
    position: l.position,
    videoPath: l.videoPath,
    durationMin: l.durationMin,
  }));
  await db.insert(schema.lessons).values(allLessons);

  console.log('Inserting slots...');
  const allSlots = slots.map((s) => ({
    id: s.id,
    trainerId: s.trainerId,
    startsAt: new Date(s.startsAt),
    status: s.status,
    clientId: s.clientId,
    heldUntil: s.heldUntil ? new Date(s.heldUntil) : null,
  }));
  await db.insert(schema.slots).values(allSlots);

  console.log('Inserting purchases...');
  const allPurchases = purchases.map((p) => ({
    id: p.id,
    clientId: p.clientId,
    trainerId: p.trainerId,
    kind: p.kind,
    programId: p.programId,
    slotId: p.slotId,
    amountCents: p.amountCents,
    stripeSessionId: p.stripeSessionId,
  }));
  await db.insert(schema.purchases).values(allPurchases);

  console.log('Inserting reviews...');
  const allReviews = reviews.map((r) => ({
    id: r.id,
    trainerId: r.trainerId,
    clientId: r.clientId,
    rating: r.rating,
    comment: r.comment,
  }));
  await db.insert(schema.reviews).values(allReviews);

  console.log('✅ Seed completed successfully!');
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});

