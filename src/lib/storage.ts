import { Habit, HabitExportPayload } from '@/types/habit';
import { getDefaultSeedHabits, STORAGE_KEY } from './constants';

export function loadHabitsFromStorage(): Habit[] {
  if (typeof window === 'undefined') {
    return getDefaultSeedHabits();
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const initial = getDefaultSeedHabits();
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
      return initial;
    }

    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }

    // If empty array or invalid, initialize default
    const initial = getDefaultSeedHabits();
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
    return initial;
  } catch (error) {
    console.warn('Failed to read habits from localStorage, resetting to defaults', error);
    return getDefaultSeedHabits();
  }
}

export function saveHabitsToStorage(habits: Habit[]): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(habits));
  } catch (error) {
    console.error('Failed to save habits to localStorage', error);
  }
}

export function exportHabitsAsJSON(habits: Habit[]): void {
  if (typeof window === 'undefined') return;

  const payload: HabitExportPayload = {
    version: 1,
    exportedAt: new Date().toISOString(),
    habits,
  };

  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(payload, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute('href', dataStr);
  const dateStr = new Date().toISOString().split('T')[0];
  downloadAnchor.setAttribute('download', `repwise-habits-${dateStr}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}

export function parseImportedHabitsJSON(jsonString: string): Habit[] | null {
  try {
    const data = JSON.parse(jsonString);

    // Support both direct array of habits and payload envelope
    const habits: unknown = Array.isArray(data) ? data : data?.habits;

    if (!Array.isArray(habits)) {
      throw new Error('Invalid habits payload format');
    }

    // Basic structure verification
    const validHabits: Habit[] = habits.map((h, index) => {
      if (!h.title || typeof h.title !== 'string') {
        throw new Error(`Habit at index ${index} is missing a title`);
      }
      return {
        id: h.id || `imported-${Date.now()}-${index}`,
        title: h.title,
        description: h.description || '',
        category: h.category || 'productivity',
        targetPerWeek: Number(h.targetPerWeek) || 7,
        completions: typeof h.completions === 'object' && h.completions ? h.completions : {},
        createdAt: h.createdAt || new Date().toISOString(),
        archived: Boolean(h.archived),
      };
    });

    return validHabits;
  } catch (err) {
    console.error('Failed to parse imported JSON', err);
    return null;
  }
}

export function resetHabitsToDefault(): Habit[] {
  const seeds = getDefaultSeedHabits();
  saveHabitsToStorage(seeds);
  return seeds;
}

