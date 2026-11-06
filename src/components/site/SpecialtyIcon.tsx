import {
  Accessibility,
  Activity,
  BicepsFlexed,
  Dumbbell,
  Flame,
  Flower2,
  Footprints,
  HandFist,
  HeartPulse,
  Target,
  Zap,
  type LucideIcon,
} from 'lucide-react';

export const SPECIALTY_ICONS: Record<string, LucideIcon> = {
  Strength: Dumbbell,
  HIIT: Zap,
  'Fat Loss': Flame,
  Yoga: Flower2,
  Mobility: Accessibility,
  Hypertrophy: BicepsFlexed,
  Boxing: Target,
  Running: Footprints,
  Recovery: HeartPulse,
  Calisthenics: Activity,
};

export function SpecialtyIcon({
  specialty,
  className,
}: {
  specialty: string;
  className?: string;
}) {
  const Icon = SPECIALTY_ICONS[specialty] || Dumbbell;
  return <Icon className={className} aria-hidden strokeWidth={1.8} />;
}
