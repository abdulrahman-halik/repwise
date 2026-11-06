import { DayInfo, HabitStats } from '@/types/habit';

/**
 * Format local date as YYYY-MM-DD (ensuring zero timezone rollover anomalies)
 */
export function formatDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Get current date key in local timezone
 */
export function getTodayKey(): string {
  return formatDateKey(new Date());
}

/**
 * Parse YYYY-MM-DD back into local Date at midnight
 */
export function parseDateKey(key: string): Date {
  const [year, month, day] = key.split('-').map(Number);
  return new Date(year, month - 1, day, 0, 0, 0, 0);
}

/**
 * Generate the last N days (default 7) ending on today
 */
export function getRecentDays(count = 7): DayInfo[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayKey = formatDateKey(today);

  const days: DayInfo[] = [];

  for (let i = count - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);

    const dateKey = formatDateKey(d);
    const dayName = d.toLocaleDateString(undefined, { weekday: 'short' });
    const dayNumber = d.getDate();

    days.push({
      dateKey,
      dayName,
      dayNumber,
      isToday: dateKey === todayKey,
      isFuture: d.getTime() > today.getTime(),
    });
  }

  return days;
}

/**
 * Calculate accurate current streak and all-time best streak
 */
export function calculateHabitStats(completions: Record<string, boolean> = {}): HabitStats {
  const completedKeys = Object.keys(completions).filter((k) => completions[k]);
  const totalCompletions = completedKeys.length;

  if (totalCompletions === 0) {
    return {
      currentStreak: 0,
      bestStreak: 0,
      totalCompletions: 0,
      weeklyRate: 0,
    };
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayKey = formatDateKey(today);

  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  const yesterdayKey = formatDateKey(yesterday);

  // 1. Current streak calculation
  let currentStreak = 0;
  const isTodayDone = !!completions[todayKey];
  const isYesterdayDone = !!completions[yesterdayKey];

  if (isTodayDone) {
    currentStreak = 1;
    let checkDate = new Date(today);
    while (true) {
      checkDate.setDate(checkDate.getDate() - 1);
      const key = formatDateKey(checkDate);
      if (completions[key]) {
        currentStreak++;
      } else {
        break;
      }
    }
  } else if (isYesterdayDone) {
    // Grace period: today is in progress, streak stays intact from yesterday
    currentStreak = 1;
    let checkDate = new Date(yesterday);
    while (true) {
      checkDate.setDate(checkDate.getDate() - 1);
      const key = formatDateKey(checkDate);
      if (completions[key]) {
        currentStreak++;
      } else {
        break;
      }
    }
  } else {
    currentStreak = 0;
  }

  // 2. Best streak calculation
  // Sort distinct completed dates
  const sortedDateTimes = completedKeys
    .map((k) => parseDateKey(k).getTime())
    .sort((a, b) => a - b);

  let bestStreak = totalCompletions > 0 ? 1 : 0;
  let tempStreak = 1;

  const ONE_DAY_MS = 24 * 60 * 60 * 1000;

  for (let i = 1; i < sortedDateTimes.length; i++) {
    const diffDays = Math.round((sortedDateTimes[i] - sortedDateTimes[i - 1]) / ONE_DAY_MS);
    if (diffDays === 1) {
      tempStreak++;
      if (tempStreak > bestStreak) {
        bestStreak = tempStreak;
      }
    } else if (diffDays > 1) {
      tempStreak = 1;
    }
  }

  bestStreak = Math.max(bestStreak, currentStreak);

  // 3. Weekly rate (past 7 days including today)
  const past7Days = getRecentDays(7);
  const completedInPast7 = past7Days.filter((d) => completions[d.dateKey]).length;
  const weeklyRate = Math.round((completedInPast7 / 7) * 100);

  return {
    currentStreak,
    bestStreak,
    totalCompletions,
    weeklyRate,
  };
}

