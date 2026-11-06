'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Filter, Search, SlidersHorizontal, Sparkles } from 'lucide-react';
import { TrainerCard } from '@/components/site/TrainerCard';
import { SpecialtyIcon } from '@/components/site/SpecialtyIcon';
import { SPECIALTIES } from '@/lib/mock-data';
import { getTrainerRating } from '@/lib/queries';
import type { Profile, Specialty } from '@/lib/types';
import { Button } from '@/components/ui/button';

export function TrainersDirectory({ initialTrainers }: { initialTrainers: Profile[] }) {
  const searchParams = useSearchParams();
  const urlSpecialty = searchParams.get('specialty');

  const [selectedSpecialty, setSelectedSpecialty] = useState<string>(urlSpecialty || 'all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'rating' | 'price-asc' | 'price-desc' | 'experience'>('rating');

  const filteredTrainers = useMemo(() => {
    return initialTrainers
      .filter((trainer) => {
        const matchesSpecialty =
          selectedSpecialty === 'all' ||
          trainer.specialties?.some((s) => s.toLowerCase() === selectedSpecialty.toLowerCase());

        const query = searchQuery.toLowerCase().trim();
        const matchesQuery =
          !query ||
          trainer.name.toLowerCase().includes(query) ||
          trainer.headline?.toLowerCase().includes(query) ||
          trainer.bio?.toLowerCase().includes(query) ||
          trainer.specialties?.some((s) => s.toLowerCase().includes(query)) ||
          trainer.location?.toLowerCase().includes(query);

        return matchesSpecialty && matchesQuery;
      })
      .sort((a, b) => {
        if (sortBy === 'rating') {
          return getTrainerRating(b.userId).avg - getTrainerRating(a.userId).avg;
        }
        if (sortBy === 'price-asc') {
          return (a.sessionPriceCents ?? 0) - (b.sessionPriceCents ?? 0);
        }
        if (sortBy === 'price-desc') {
          return (b.sessionPriceCents ?? 0) - (a.sessionPriceCents ?? 0);
        }
        if (sortBy === 'experience') {
          return (b.yearsCoaching ?? 0) - (a.yearsCoaching ?? 0);
        }
        return 0;
      });
  }, [initialTrainers, selectedSpecialty, searchQuery, sortBy]);

  return (
    <div className="container-page py-12 md:py-16">
      {/* Header */}
      <div className="mb-10 max-w-2xl">
        <p className="eyebrow mb-2">Verified Coaches</p>
        <h1 className="font-display text-5xl uppercase tracking-tight md:text-7xl">
          Find Your <span className="text-lime-ink">Trainer</span>
        </h1>
        <p className="mt-3 text-base text-muted-foreground md:text-lg">
          Browse elite coaches, check their client results, unlock their structured programs, and book direct 1:1 live coaching calls.
        </p>
      </div>

      {/* Specialty Filter Chips Bar */}
      <div className="mb-8">
        <div className="flex items-center gap-2 overflow-x-auto pb-3 scrollbar-none">
          <button
            onClick={() => setSelectedSpecialty('all')}
            className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-all ${
              selectedSpecialty === 'all'
                ? 'bg-primary text-primary-foreground shadow-[0_0_20px_rgba(198,255,61,0.25)]'
                : 'border border-border bg-surface text-muted-foreground hover:border-lime-ink/40 hover:text-foreground'
            }`}
          >
            <Sparkles className="size-3.5" />
            All Goals
          </button>
          {SPECIALTIES.map((spec) => {
            const isSelected = selectedSpecialty.toLowerCase() === spec.toLowerCase();
            return (
              <button
                key={spec}
                onClick={() => setSelectedSpecialty(isSelected ? 'all' : spec.toLowerCase())}
                className={`inline-flex items-center gap-2 whitespace-nowrap rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-all ${
                  isSelected
                    ? 'bg-primary text-primary-foreground shadow-[0_0_20px_rgba(198,255,61,0.25)]'
                    : 'border border-border bg-surface text-muted-foreground hover:border-lime-ink/40 hover:text-foreground'
                }`}
              >
                <SpecialtyIcon specialty={spec} className="size-3.5" />
                {spec}
              </button>
            );
          })}
        </div>
      </div>

      {/* Search & Sort Controls */}
      <div className="mb-10 flex flex-col gap-4 border-y border-border py-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by coach name, specialty or goal..."
            className="h-10 w-full rounded-xl border border-border bg-surface pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <SlidersHorizontal className="size-3.5" />
            <span>Sort by:</span>
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="h-10 rounded-xl border border-border bg-surface px-3 text-xs font-medium text-foreground focus:border-primary focus:outline-none"
          >
            <option value="rating">Top Rated (Stars)</option>
            <option value="experience">Years Experience</option>
            <option value="price-asc">Session Price: Low to High</option>
            <option value="price-desc">Session Price: High to Low</option>
          </select>
          <span className="text-xs text-muted-foreground pl-2 border-l border-border">
            <strong className="text-foreground">{filteredTrainers.length}</strong> coaches
          </span>
        </div>
      </div>

      {/* Trainers Grid */}
      {filteredTrainers.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredTrainers.map((trainer, i) => (
            <TrainerCard key={trainer.userId} trainer={trainer} priority={i < 4} />
          ))}
        </div>
      ) : (
        <div className="my-16 flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-surface/50 p-12 text-center">
          <Filter className="size-10 text-muted-foreground/60" />
          <h3 className="font-display mt-4 text-2xl uppercase">No coaches found</h3>
          <p className="mt-2 max-w-sm text-sm text-muted-foreground">
            We couldn&apos;t find any trainers matching &ldquo;{searchQuery || selectedSpecialty}&rdquo;. Try clearing your filters or searching for another goal.
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSelectedSpecialty('all');
              setSearchQuery('');
            }}
            className="mt-6"
          >
            Reset Filters
          </Button>
        </div>
      )}
    </div>
  );
}

