'use client';

import React from 'react';
import { Plus, Sliders, Flame, CheckCircle2 } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';

interface HeaderProps {
  completedToday: number;
  totalActive: number;
  todayCompletionRate: number;
  maxCurrentStreak: number;
  onOpenNewHabit: () => void;
  onOpenSettings: () => void;
}

export function Header({
  completedToday,
  totalActive,
  todayCompletionRate,
  maxCurrentStreak,
  onOpenNewHabit,
  onOpenSettings,
}: HeaderProps) {
  const todayFormatted = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  }).format(new Date());

  return (
    <header className="border-b border-gray-200 bg-white/80 dark:border-gray-800/80 dark:bg-gray-950/40 backdrop-blur-md sticky top-0 z-20 transition-colors duration-150">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-semibold tracking-wider uppercase text-emerald-600 dark:text-emerald-400">
                Daily Focus
              </span>
              <span className="text-xs text-gray-400 dark:text-gray-500">•</span>
              <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">{todayFormatted}</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white mt-0.5">
              Habit Tracker
            </h1>
          </div>

          <div className="flex items-center gap-2">
            {/* Quick theme toggle switch */}
            <ThemeToggle />

            {/* Settings & Backups */}
            <button
              type="button"
              onClick={onOpenSettings}
              className="p-2.5 rounded-xl border border-gray-200 bg-white text-gray-700 hover:text-gray-950 hover:border-gray-300 hover:bg-gray-100 shadow-xs dark:border-gray-800 dark:bg-gray-900/80 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:border-gray-700 dark:hover:bg-gray-800/90 transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
              title="Data & Backup Settings"
              aria-label="Open settings"
            >
              <Sliders className="w-4 h-4" />
            </button>

            {/* New Habit action */}
            <button
              type="button"
              onClick={onOpenNewHabit}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-gray-950 font-semibold text-sm shadow-sm shadow-emerald-500/20 active:scale-95 transition-all focus:outline-none focus:ring-2 focus:ring-emerald-400"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>New Habit</span>
            </button>
          </div>
        </div>

        {/* Quick summary stats strip */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4 pt-4 border-t border-gray-200 dark:border-gray-900 transition-colors duration-150">
          <div className="flex items-center gap-3 px-3.5 py-2 rounded-xl bg-white/80 dark:bg-gray-900/60 border border-gray-200/90 dark:border-gray-800/60 shadow-xs transition-colors duration-150">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">Today&apos;s Progress</div>
              <div className="text-sm font-bold text-gray-900 dark:text-gray-100">
                {completedToday} of {totalActive} <span className="text-xs text-gray-400 dark:text-gray-500 font-normal">({todayCompletionRate}%)</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 px-3.5 py-2 rounded-xl bg-white/80 dark:bg-gray-900/60 border border-gray-200/90 dark:border-gray-800/60 shadow-xs transition-colors duration-150">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 dark:text-amber-400">
              <Flame className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">Top Streak</div>
              <div className="text-sm font-bold text-amber-600 dark:text-amber-300">
                {maxCurrentStreak} {maxCurrentStreak === 1 ? 'day' : 'days'}
              </div>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-3 px-3.5 py-2 rounded-xl bg-white/80 dark:bg-gray-900/60 border border-gray-200/90 dark:border-gray-800/60 shadow-xs transition-colors duration-150">
            <div className="flex-1">
              <div className="flex justify-between items-center text-xs mb-1.5">
                <span className="text-gray-500 dark:text-gray-400 font-medium">Daily Target</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{todayCompletionRate}%</span>
              </div>
              <div className="w-full h-1.5 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${Math.min(todayCompletionRate, 100)}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
