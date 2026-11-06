import { Suspense } from 'react';
import type { Metadata } from 'next';
import { getDbTrainers } from '@/lib/db/queries';
import { trainers as fallbackTrainers } from '@/lib/mock-data';
import { TrainersDirectory } from './TrainersDirectory';
import type { Profile } from '@/lib/types';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Coaches & Personal Trainers',
  description: 'Find verified personal trainers, view their video programs, and book live 1:1 sessions.',
};

export default async function TrainersPage() {
  let initialTrainers: Profile[] = fallbackTrainers;
  try {
    const dbTrainers = await getDbTrainers();
    if (dbTrainers && dbTrainers.length > 0) {
      initialTrainers = dbTrainers.map((t) => ({
        userId: t.userId,
        role: t.role as 'trainer',
        name: t.name,
        avatarUrl: t.avatarUrl,
        coverUrl: t.coverUrl,
        headline: t.headline,
        bio: t.bio,
        specialties: (t.specialties || []) as any,
        sessionPriceCents: t.sessionPriceCents,
        location: t.location || undefined,
        yearsCoaching: t.yearsCoaching || undefined,
      }));
    }
  } catch (err) {
    console.error('Failed to load trainers from DB, using fallback:', err);
  }

  return (
    <Suspense fallback={<div className="container-page py-20 text-center text-muted-foreground">Loading coaches...</div>}>
      <TrainersDirectory initialTrainers={initialTrainers} />
    </Suspense>
  );
}
