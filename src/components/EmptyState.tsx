'use client';

import React from 'react';
import { Sparkles, Plus } from 'lucide-react';

interface EmptyStateProps {
  onAddHabit: () => void;
  isFiltered?: boolean;
}

export function EmptyState({ onAddHabit, isFiltered }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center border border-dashed border-gray-800 rounded-2xl bg-gray-900/30">
      <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-4">
        <Sparkles className="w-6 h-6" />
      </div>

      <h3 className="text-base font-semibold text-gray-200">
        {isFiltered ? 'No matching habits found' : 'No habits tracked yet'}
      </h3>

      <p className="text-xs text-gray-400 max-w-sm mt-1 mb-5">
        {isFiltered
          ? 'Try selecting a different category or clearing the search filter.'
          : 'Start building consistency by creating your first daily or weekly habit.'}
      </p>

      {!isFiltered && (
        <button
          onClick={onAddHabit}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-gray-950 font-semibold text-sm transition-all shadow-sm shadow-emerald-500/20 active:scale-95"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Add Your First Habit</span>
        </button>
      )}
    </div>
  );
}
