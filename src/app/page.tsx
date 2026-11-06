'use client';

import React, { useState, useMemo } from 'react';
import { useHabits } from '@/hooks/useHabits';
import { Habit, HabitCategory } from '@/types/habit';
import { getRecentDays } from '@/lib/date-utils';
import { CATEGORIES } from '@/lib/constants';
import { Header } from '@/components/Header';
import { HabitCard } from '@/components/HabitCard';
import { HabitModal } from '@/components/HabitModal';
import { SettingsModal } from '@/components/SettingsModal';
import { EmptyState } from '@/components/EmptyState';
import { Search, Filter } from 'lucide-react';

export default function HabitTrackerPage() {
  const {
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
  } = useHabits();

  const [selectedCategory, setSelectedCategory] = useState<HabitCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Recent 7 days for the completion matrix
  const recentDays = useMemo(() => getRecentDays(7), []);

  // Filtered habit list
  const filteredHabits = useMemo(() => {
    return habits.filter((h) => {
      if (h.archived) return false;
      if (selectedCategory !== 'all' && h.category !== selectedCategory) return false;
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchTitle = h.title.toLowerCase().includes(query);
        const matchDesc = h.description?.toLowerCase().includes(query);
        return matchTitle || matchDesc;
      }
      return true;
    });
  }, [habits, selectedCategory, searchQuery]);

  const handleOpenNewHabit = () => {
    setEditingHabit(null);
    setIsModalOpen(true);
  };

  const handleEditHabit = (habit: Habit) => {
    setEditingHabit(habit);
    setIsModalOpen(true);
  };

  const handleSaveHabit = (data: {
    id?: string;
    title: string;
    description?: string;
    category: HabitCategory;
    targetPerWeek: number;
  }) => {
    if (data.id) {
      updateHabit(data.id, {
        title: data.title,
        description: data.description,
        category: data.category,
        targetPerWeek: data.targetPerWeek,
      });
    } else {
      addHabit({
        title: data.title,
        description: data.description,
        category: data.category,
        targetPerWeek: data.targetPerWeek,
      });
    }
  };

  if (!isHydrated) {
    return (
      <div className="min-h-screen bg-[#090d16] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin" />
          <span className="text-xs text-gray-400 font-medium tracking-wide">Loading Habits...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#090d16] pb-24 text-gray-100">
      {/* Top Header */}
      <Header
        completedToday={stats.completedToday}
        totalActive={stats.totalActive}
        todayCompletionRate={stats.todayCompletionRate}
        maxCurrentStreak={stats.maxCurrentStreak}
        onOpenNewHabit={handleOpenNewHabit}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-6">
        {/* Filter and Search Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                selectedCategory === 'all'
                  ? 'bg-gray-100 text-gray-950 font-semibold'
                  : 'bg-gray-900/60 text-gray-400 hover:text-gray-200 border border-gray-800/80'
              }`}
            >
              All Habits ({habits.length})
            </button>

            {CATEGORIES.map((cat) => {
              const count = habits.filter((h) => h.category === cat.id && !h.archived).length;
              const isSelected = selectedCategory === cat.id;

              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                    isSelected
                      ? `${cat.bgClass} ${cat.colorClass} border border-emerald-500/30 font-semibold`
                      : 'bg-gray-900/60 text-gray-400 hover:text-gray-200 border border-gray-800/80'
                  }`}
                >
                  <span>{cat.label}</span>
                  {count > 0 && <span className="text-[10px] opacity-70">({count})</span>}
                </button>
              );
            })}
          </div>

          {/* Search Box */}
          <div className="relative sm:w-60">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter habits..."
              className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-gray-900/80 border border-gray-800 text-xs text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/40 focus:border-emerald-500/50 transition-all"
            />
          </div>
        </div>

        {/* Habit Cards List */}
        {filteredHabits.length > 0 ? (
          <div className="space-y-3">
            {filteredHabits.map((habit) => (
              <HabitCard
                key={habit.id}
                habit={habit}
                recentDays={recentDays}
                onToggleDay={toggleHabitDay}
                onEdit={handleEditHabit}
                onDelete={deleteHabit}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            onAddHabit={handleOpenNewHabit}
            isFiltered={selectedCategory !== 'all' || searchQuery.trim().length > 0}
          />
        )}
      </main>

      {/* Creation / Edit Modal */}
      <HabitModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveHabit}
        editingHabit={editingHabit}
      />

      {/* Settings & Backup Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onExport={exportData}
        onImport={importData}
        onReset={resetToDefaults}
      />
    </div>
  );
}
