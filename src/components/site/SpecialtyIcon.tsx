import {
  Activity,
  BicepsFlexed,
  Dumbbell,
  Flame,
  Flower2,
  Footprints,
  HandFist,
  HeartPulse,
  type LucideIcon,
} from 'lucide-react';
import type { Specialty } from '@/lib/types';

export const SPECIALTY_ICONS: Record<Specialty, LucideIcon> = {
  Strength: Dumbbell,
  HIIT: Flame,
  Yoga: Flower2,
  Mobility: Activity,
  Hypertrophy: BicepsFlexed,
  Running: Footprints,
  Boxing: HandFist,
  Recovery: HeartPulse,
};

export function SpecialtyIcon({ specialty, className }: { specialty: Specialty; className?: string }) {
  const Icon = SPECIALTY_ICONS[specialty];
  return <Icon className={className} aria-hidden />;
}

