import type { Metadata } from 'next';
import { CURRENT_TRAINER_ID } from '@/lib/mock-data';
import { programsByTrainer } from '@/lib/queries';
import { ProgramsListClient } from './ProgramsListClient';

export const metadata: Metadata = {
  title: 'Manage Programs · Trainer Studio',
  description: 'Manage workout programs, lesson videos, and pricing.',
};

export default function DashboardProgramsPage() {
  const trainerPrograms = programsByTrainer(CURRENT_TRAINER_ID);

  return <ProgramsListClient initialPrograms={trainerPrograms} />;
}

