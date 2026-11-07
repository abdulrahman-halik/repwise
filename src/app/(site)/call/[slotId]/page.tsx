import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getSlot, getTrainer } from '@/lib/queries';
import { getDbSlotById, getDbTrainerById } from '@/lib/db/queries';
import type { Profile, Slot } from '@/lib/types';
import { CallRoomClient } from './CallRoomClient';

export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slotId: string }>;
}): Promise<Metadata> {
  const { slotId } = await params;
  return {
    title: `Live 1:1 Video Session #${slotId}`,
    description: 'Stream video coaching room for your booked Repwise 1:1 session.',
  };
}

export default async function CallPage({
  params,
}: {
  params: Promise<{ slotId: string }>;
}) {
  const { slotId } = await params;

  let slot: Slot | null = null;
  const dbSlot = await getDbSlotById(slotId);
  if (dbSlot) {
    slot = {
      id: dbSlot.id,
      trainerId: dbSlot.trainerId,
      startsAt: dbSlot.startsAt.toISOString(),
      status: dbSlot.status as any,
      clientId: dbSlot.clientId,
      heldUntil: dbSlot.heldUntil ? dbSlot.heldUntil.toISOString() : null,
    };
  } else {
    slot = getSlot(slotId) || null;
  }
  if (!slot) notFound();

  let trainer: Profile | null = null;
  const dbTrainer = await getDbTrainerById(slot.trainerId);
  if (dbTrainer) {
    trainer = {
      userId: dbTrainer.userId,
      role: 'trainer' as const,
      name: dbTrainer.name,
      avatarUrl: dbTrainer.avatarUrl,
      coverUrl: dbTrainer.coverUrl,
      headline: dbTrainer.headline,
      bio: dbTrainer.bio,
      specialties: (dbTrainer.specialties || []) as any,
      sessionPriceCents: dbTrainer.sessionPriceCents,
    };
  } else {
    trainer = (getTrainer(slot.trainerId) as Profile) || null;
  }
  if (!trainer) notFound();

  return <CallRoomClient slot={slot} trainer={trainer} />;
}
