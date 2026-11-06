import { Habit, HabitCategory } from '@/types/habit';
import { formatDateKey } from './date-utils';

export const CATEGORIES: { id: HabitCategory; label: string; colorClass: string; bgClass: string }[] = [
  { id: 'health', label: 'Health', colorClass: 'text-emerald-400', bgClass: 'bg-emerald-500/10 border-emerald-500/20' },
  { id: 'fitness', label: 'Fitness', colorClass: 'text-cyan-400', bgClass: 'bg-cyan-500/10 border-cyan-500/20' },
  { id: 'productivity', label: 'Productivity', colorClass: 'text-amber-400', bgClass: 'bg-amber-500/10 border-amber-500/20' },
  { id: 'mind', label: 'Mind & Focus', colorClass: 'text-teal-400', bgClass: 'bg-teal-500/10 border-teal-500/20' },
  { id: 'learning', label: 'Learning', colorClass: 'text-sky-400', bgClass: 'bg-sky-500/10 border-sky-500/20' },
];

/**
 * Generate default seed habits with recent completion history
 */
export function getDefaultSeedHabits(): Habit[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const getOffsetDate = (daysAgo: number) => {
    const d = new Date(today);
    d.setDate(today.getDate() - daysAgo);
    return formatDateKey(d);
  };

  return [
    {
      id: 'seed-habit-1',
      title: 'Drink 2L Water',
      description: 'Stay hydrated throughout the workday with 8 glasses',
      category: 'health',
      targetPerWeek: 7,
      createdAt: getOffsetDate(14),
      completions: {
        [getOffsetDate(4)]: true,
        [getOffsetDate(3)]: true,
        [getOffsetDate(2)]: true,
        [getOffsetDate(1)]: true,
        [getOffsetDate(0)]: true,
      },
    },
    {
      id: 'seed-habit-2',
      title: 'Read 20 Mins',
      description: 'Physical book or Kindle before bedtime',
      category: 'learning',
      targetPerWeek: 7,
      createdAt: getOffsetDate(10),
      completions: {
        [getOffsetDate(2)]: true,
        [getOffsetDate(1)]: true,
        [getOffsetDate(0)]: true,
      },
    },
    {
      id: 'seed-habit-3',
      title: 'Morning Exercise',
      description: '30 minutes of stretching, cardio, or strength training',
      category: 'fitness',
      targetPerWeek: 5,
      createdAt: getOffsetDate(7),
      completions: {
        [getOffsetDate(3)]: true,
        [getOffsetDate(1)]: true,
        [getOffsetDate(0)]: true,
      },
    },
  ];
}

export const STORAGE_KEY = 'repwise_habit_tracker_v1';

