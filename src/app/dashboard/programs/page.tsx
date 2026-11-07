import type { Metadata } from 'next';
import { db, programs as programsTable } from '@/lib/db';
import { eq } from 'drizzle-orm';
import { CURRENT_TRAINER_ID } from '@/lib/mock-data';
import { programsByTrainer } from '@/lib/queries';
import { ProgramsListClient } from './ProgramsListClient';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Manage Programs · Trainer Studio',
  description: 'Manage workout programs, lesson videos, and pricing.',
};

export default async function DashboardProgramsPage() {
  const trainerId = CURRENT_TRAINER_ID;

  const dbPrograms = await db
    .select()
    .from(programsTable)
    .where(eq(programsTable.trainerId, trainerId));

  const trainerPrograms =
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

  return <ProgramsListClient initialPrograms={trainerPrograms} />;
}
