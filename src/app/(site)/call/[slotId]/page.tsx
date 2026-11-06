import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getSlot, getTrainer } from '@/lib/queries';
import { CallRoomClient } from './CallRoomClient';

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
  const slot = getSlot(slotId);
  if (!slot) notFound();

  const trainer = getTrainer(slot.trainerId);
  if (!trainer) notFound();

  return <CallRoomClient slot={slot} trainer={trainer} />;
}

