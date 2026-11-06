import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import {
  getTrainer,
  getTrainerRating,
  openSlotsForTrainer,
  publishedProgramsByTrainer,
  reviewsForTrainer,
  slotsForTrainer,
} from '@/lib/queries';
import { TrainerProfileClient } from './TrainerProfileClient';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const trainer = getTrainer(id);
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
  const trainer = getTrainer(id);
  if (!trainer) notFound();

  const programs = publishedProgramsByTrainer(id);
  const slots = slotsForTrainer(id);
  const reviews = reviewsForTrainer(id);
  const rating = getTrainerRating(id);

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

