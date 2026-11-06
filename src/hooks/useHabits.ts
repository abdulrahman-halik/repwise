'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { Habit, HabitCategory } from '@/types/habit';
import {
  loadHabitsFromStorage,
  saveHabitsToStorage,
  exportHabitsAsJSON,
  parseImportedHabitsJSON,
  resetHabitsToDefault,
} from '@/lib/storage';
import { getTodayKey, calculateHabitStats } from '@/lib/date-utils';

export function useHabits() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  // Hydrate from localStorage on client mount
  useEffect(() => {
    const stored = loadHabitsFromStorage();
    setHabits(stored);
    setIsHydrated(true);
  }, []);

  // Sync state changes to storage
  const persist = useCallback((updated: Habit[]) => {
    setHabits(updated);
    saveHabitsToStorage(updated);
  }, []);

  // Toggle habit completion on a given dateKey
  const toggleHabitDay = useCallback(
    (habitId: string, dateKey: string) => {
      setHabits((prev) => {
        const next = prev.map((h) => {
          if (h.id !== habitId) return h;
          const completions = { ...h.completions };
          if (completions[dateKey]) {
            delete completions[dateKey];
          } else {
            completions[dateKey] = true;
          }
          return { ...h, completions };
        });
        saveHabitsToStorage(next);
        return next;
      });
    },
    []
  );

  // Add a new habit
  const addHabit = useCallback(
    (params: {
      title: string;
      description?: string;
      category: HabitCategory;
      targetPerWeek?: number;
    }) => {
      const newHabit: Habit = {
        id: `habit-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        title: params.title.trim(),
        description: params.description?.trim(),
        category: params.category,
        targetPerWeek: params.targetPerWeek || 7,
        completions: {},
        createdAt: new Date().toISOString(),
      };

      const updated = [newHabit, ...habits];
      persist(updated);
      return newHabit;
    },
    [habits, persist]
  );

  // Edit an existing habit
  const updateHabit = useCallback(
    (
      id: string,
      updates: Partial<Pick<Habit, 'title' | 'description' | 'category' | 'targetPerWeek' | 'archived'>>
    ) => {
      const updated = habits.map((h) => {
        if (h.id !== id) return h;
        return { ...h, ...updates };
      });
      persist(updated);
    },
    [habits, persist]
  );

  // Delete a habit
  const deleteHabit = useCallback(
    (id: string) => {
      const updated = habits.filter((h) => h.id !== id);
      persist(updated);
    },
    [habits, persist]
  );

  // Reset all to sample defaults
  const resetToDefaults = useCallback(() => {
    const seeds = resetHabitsToDefault();
    setHabits(seeds);
  }, []);

  // Export data
  const exportData = useCallback(() => {
    exportHabitsAsJSON(habits);
  }, [habits]);

  // Import data from file string
  const importData = useCallback(
    (jsonString: string): boolean => {
      const parsed = parseImportedHabitsJSON(jsonString);
      if (parsed) {
        persist(parsed);
        return true;
      }
      return false;
    },
    [persist]
  );

  // Summary Metrics
  const stats = useMemo(() => {
    const todayKey = getTodayKey();
    const activeHabits = habits.filter((h) => !h.archived);

    let completedToday = 0;
    let maxCurrentStreak = 0;
    let sumWeeklyRate = 0;

    activeHabits.forEach((h) => {
      if (h.completions[todayKey]) {
        completedToday++;
      }
      const habitStats = calculateHabitStats(h.completions);
      if (habitStats.currentStreak > maxCurrentStreak) {
        maxCurrentStreak = habitStats.currentStreak;
      }
      sumWeeklyRate += habitStats.weeklyRate;
    });

    const averageWeeklyRate =
      activeHabits.length > 0 ? Math.round(sumWeeklyRate / activeHabits.length) : 0;
    const todayCompletionRate =
      activeHabits.length > 0 ? Math.round((completedToday / activeHabits.length) * 100) : 0;

    return {
      totalActive: activeHabits.length,
      completedToday,
      todayCompletionRate,
      averageWeeklyRate,
      maxCurrentStreak,
    };
  }, [habits]);

  return {
    habits,
    isHydrated,
    stats,
    toggleHabitDay,
    addHabit,
    updateHabit,
    deleteHabit,
    resetToDefaults,
    exportData,
    importData,
  };
}

