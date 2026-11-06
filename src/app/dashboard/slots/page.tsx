import type { Metadata } from 'next';
import { clients, CURRENT_TRAINER_ID } from '@/lib/mock-data';
import { slotsForTrainer } from '@/lib/queries';
import { SlotsManagementClient } from './SlotsManagementClient';

export const metadata: Metadata = {
  title: 'Slots & Calendar · Trainer Studio',
  description: 'Manage 60-minute coaching slots, bookings, and availability calendar.',
};

export default function DashboardSlotsPage() {
  const trainerSlots = slotsForTrainer(CURRENT_TRAINER_ID);

  return <SlotsManagementClient initialSlots={trainerSlots} clients={clients} />;
}

