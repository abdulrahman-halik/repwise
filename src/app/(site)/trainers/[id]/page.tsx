import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import {
  getDbTrainerById,
  getDbPublishedPrograms,
  getDbSlots,
  getDbReviews,
  getDbTrainerRating,
} from '@/lib/db/queries';
import {
  getTrainer,
  getTrainerRating,
  publishedProgramsByTrainer,
  reviewsForTrainer,
  slotsForTrainer,
} from '@/lib/queries';
import { db, profiles } from '@/lib/db';
import { eq } from 'drizzle-orm';
import { TrainerProfileClient } from './TrainerProfileClient';

export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  let trainer = await getDbTrainerById(id);
  if (!trainer) trainer = getTrainer(id) as any;
  if (!trainer) return { title: 'Coach Not Found' };
  return {
    title: `${trainer.name} · Coach Profile`,
    description: trainer.headline ?? trainer.bio ?? 'Personal trainer on Repwise',
  };
}

export default async function TrainerProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // 1. Fetch Trainer Profile from DB (fallback to mock)
  let trainerData = await getDbTrainerById(id);
  if (!trainerData) {
    trainerData = getTrainer(id) as any;
  }
  if (!trainerData) notFound();

  const trainer = {
    userId: trainerData.userId,
    role: 'trainer' as const,
    name: trainerData.name,
    avatarUrl: trainerData.avatarUrl,
    coverUrl: trainerData.coverUrl,
    headline: trainerData.headline,
    bio: trainerData.bio,
    specialties: (trainerData.specialties || []) as any,
    sessionPriceCents: trainerData.sessionPriceCents,
    location: trainerData.location || undefined,
    yearsCoaching: trainerData.yearsCoaching || undefined,
  };

  // 2. Fetch Programs from DB
  const dbProgs = await getDbPublishedPrograms(id);
  const programs =
    dbProgs.length > 0
      ? dbProgs.map((p) => ({
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
      : publishedProgramsByTrainer(id);

  // 3. Fetch Slots from DB
  const dbSlots = await getDbSlots(id);
  const slots =
    dbSlots.length > 0
      ? dbSlots.map((s) => ({
          id: s.id,
          trainerId: s.trainerId,
          startsAt: s.startsAt.toISOString(),
          status: s.status as any,
          clientId: s.clientId,
          heldUntil: s.heldUntil ? s.heldUntil.toISOString() : null,
        }))
      : slotsForTrainer(id);

  // 4. Fetch Reviews from DB
  const dbRevs = await getDbReviews(id);
  let reviews: any[] = [];
  if (dbRevs.length > 0) {
    reviews = await Promise.all(
      dbRevs.map(async (r) => {
        const [client] = await db.select().from(profiles).where(eq(profiles.userId, r.clientId)).limit(1);
        return {
          id: r.id,
          trainerId: r.trainerId,
          clientId: r.clientId,
          rating: r.rating,
          comment: r.comment,
          createdAt: r.createdAt.toISOString(),
          client: client || { name: 'Verified Athlete', userId: r.clientId, role: 'client' },
        };
      })
    );
  } else {
    reviews = reviewsForTrainer(id);
  }

  // 5. Rating
  const rating = (await getDbTrainerRating(id)) || getTrainerRating(id);

  return (
    <TrainerProfileClient
      trainer={trainer}
      programs={programs}
      slots={slots}
      reviews={reviews}
      rating={rating}
    />
  );
}
