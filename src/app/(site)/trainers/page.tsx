import { Suspense } from 'react';
import type { Metadata } from 'next';
import { trainers } from '@/lib/mock-data';
import { TrainersDirectory } from './TrainersDirectory';

export const metadata: Metadata = {
  title: 'Coaches & Personal Trainers',
  description: 'Find verified personal trainers, view their video programs, and book live 1:1 sessions.',
};

export default function TrainersPage() {
  return (
    <Suspense fallback={<div className="container-page py-20 text-center text-muted-foreground">Loading coaches...</div>}>
      <TrainersDirectory initialTrainers={trainers} />
    </Suspense>
  );
}

