import type { Metadata } from 'next';
import { CURRENT_TRAINER_ID } from '@/lib/mock-data';
import { programsByTrainer, trainerOverview, trainerSales } from '@/lib/queries';
import { DashboardOverviewClient } from './DashboardOverviewClient';

export const metadata: Metadata = {
  title: 'Trainer Dashboard Overview',
  description: 'Repwise Trainer overview: live revenue feed, upcoming client video sessions, and analytics.',
};

export default function DashboardOverviewPage() {
  const sales = trainerSales(CURRENT_TRAINER_ID);
  const overview = trainerOverview(CURRENT_TRAINER_ID);
  const programs = programsByTrainer(CURRENT_TRAINER_ID);

  return (
    <DashboardOverviewClient
      initialSales={sales}
      upcomingSessions={overview.upcoming}
      initialPrograms={programs}
    />
  );
}

