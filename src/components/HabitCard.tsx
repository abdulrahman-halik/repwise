'use client';

import React, { useState } from 'react';
import { Habit, DayInfo } from '@/types/habit';
import { calculateHabitStats } from '@/lib/date-utils';
import { CATEGORIES } from '@/lib/constants';
import { Check, Flame, MoreVertical, Edit2, Trash2 } from 'lucide-react';

interface HabitCardProps {
  habit: Habit;
  recentDays: DayInfo[];
  onToggleDay: (habitId: string, dateKey: string) => void;
  onEdit: (habit: Habit) => void;
  onDelete: (habitId: string) => void;
}

export function HabitCard({
  habit,
  recentDays,
  onToggleDay,
  onEdit,
  onDelete,
}: HabitCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const stats = calculateHabitStats(habit.completions);
  const categoryInfo = CATEGORIES.find((c) => c.id === habit.category) || CATEGORIES[0];

  return (
    <div className="group relative bg-gray-900/70 hover:bg-gray-900/90 border border-gray-800/80 hover:border-gray-750 rounded-2xl p-4 sm:p-5 transition-all duration-200">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left Side: Meta & Habit Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span
              className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium border ${categoryInfo.bgClass} ${categoryInfo.colorClass}`}
            >
              {categoryInfo.label}
            </span>

            {stats.currentStreak > 0 && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <Flame className="w-3 h-3 fill-amber-400" />
                {stats.currentStreak} {stats.currentStreak === 1 ? 'day' : 'days'}
              </span>
            )}

            {stats.bestStreak > 1 && (
              <span className="text-[11px] text-gray-500 font-medium">
                Best: {stats.bestStreak}d
              </span>
            )}
          </div>

          <h3 className="text-base font-semibold text-gray-100 truncate group-hover:text-white">
            {habit.title}
          </h3>

          {habit.description && (
            <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{habit.description}</p>
          )}
        </div>

        {/* Right Side: 7-Day Matrix + Actions */}
        <div className="flex items-center justify-between md:justify-end gap-3 pt-2 md:pt-0 border-t md:border-t-0 border-gray-800/60">
          {/* 7-Day Completion Grid */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {recentDays.map((day) => {
              const isCompleted = !!habit.completions[day.dateKey];

              return (
                <button
                  key={day.dateKey}
                  type="button"
                  onClick={() => onToggleDay(habit.id, day.dateKey)}
                  className={`relative flex flex-col items-center justify-center w-8 h-12 sm:w-9 sm:h-13 rounded-xl transition-all duration-150 active:scale-90 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 ${
                    isCompleted
                      ? 'bg-emerald-500 text-gray-950 font-bold shadow-sm shadow-emerald-500/30'
                      : day.isToday
                      ? 'bg-gray-800/90 border-2 border-emerald-500/40 text-gray-300 hover:border-emerald-400 hover:bg-emerald-500/10'
                      : 'bg-gray-950/60 border border-gray-800 text-gray-400 hover:border-gray-700 hover:text-gray-200'
                  }`}
                  title={`${day.dateKey} (${day.dayName}): ${isCompleted ? 'Completed' : 'Not completed'}`}
                  aria-label={`Toggle ${habit.title} on ${day.dayName}`}
                >
                  <span
                    className={`text-[10px] font-medium uppercase leading-tight ${
                      isCompleted ? 'text-gray-900/80 font-bold' : 'text-gray-500'
                    }`}
                  >
                    {day.dayName.charAt(0)}
                  </span>

                  <div className="my-0.5 flex items-center justify-center">
                    {isCompleted ? (
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    ) : (
                      <span className="text-xs font-medium">{day.dayNumber}</span>
                    )}
                  </div>

                  {day.isToday && (
                    <span
                      className={`w-1 h-1 rounded-full ${
                        isCompleted ? 'bg-gray-950' : 'bg-emerald-400'
                      }`}
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Action Menu dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-1.5 rounded-lg text-gray-500 hover:text-gray-300 hover:bg-gray-800 transition-colors focus:outline-none"
              aria-label="Habit options"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {menuOpen && (
              <>
                <div
                  className="fixed inset-0 z-30"
                  onClick={() => setMenuOpen(false)}
                />
                <div className="absolute right-0 top-full mt-1.5 w-36 rounded-xl bg-gray-900 border border-gray-800 shadow-xl z-40 py-1 overflow-hidden">
                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      onEdit(habit);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Edit Habit</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      if (confirm(`Delete habit "${habit.title}"?`)) {
                        onDelete(habit.id);
                      }
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

