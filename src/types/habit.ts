export type HabitCategory =
  | 'health'
  | 'productivity'
  | 'mind'
  | 'fitness'
  | 'learning';

export interface Habit {
  id: string;
  title: string;
  description?: string;
  category: HabitCategory;
  targetPerWeek: number; // e.g. 7 for everyday, 3 for 3x/week
  completions: Record<string, boolean>; // 'YYYY-MM-DD' -> true
  createdAt: string;
  archived?: boolean;
}

export interface HabitStats {
  currentStreak: number;
  bestStreak: number;
  totalCompletions: number;
  weeklyRate: number; // percentage completed in past 7 days
}

export interface DayInfo {
  dateKey: string; // 'YYYY-MM-DD'
  dayName: string; // 'Mon', 'Tue', etc.
  dayNumber: number; // 1-31
  isToday: boolean;
  isFuture: boolean;
}

export interface HabitFilter {
  category: HabitCategory | 'all';
  search: string;
  showArchived: boolean;
}

export interface HabitExportPayload {
  version: number;
  exportedAt: string;
  habits: Habit[];
}
