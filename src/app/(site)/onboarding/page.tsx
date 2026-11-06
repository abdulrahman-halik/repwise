'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowRight,
  CheckCircle2,
  Dumbbell,
  Sparkles,
  Upload,
  User,
  Users,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SPECIALTIES } from '@/lib/mock-data';
import type { Specialty } from '@/lib/types';
import { toast } from 'sonner';

export default function OnboardingPage() {
  const router = useRouter();
  const [role, setRole] = useState<'client' | 'trainer'>('client');
  const [selectedSpecialties, setSelectedSpecialties] = useState<Specialty[]>(['Strength', 'Mobility']);
  const [name, setName] = useState('Alex Rivera');
  const [headline, setHeadline] = useState('Strength & conditioning coach');
  const [bio, setBio] = useState('Helping athletes and lifters build raw compound strength safely.');
  const [price, setPrice] = useState('85');
  const [location, setLocation] = useState('Austin, TX');
  const [years, setYears] = useState('6');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleSpecialty = (spec: Specialty) => {
    if (selectedSpecialties.includes(spec)) {
      setSelectedSpecialties(selectedSpecialties.filter((s) => s !== spec));
    } else {
      setSelectedSpecialties([...selectedSpecialties, spec]);
    }
  };

  const handleComplete = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const payload = {
        role,
        name,
        specialties: selectedSpecialties,
        ...(role === 'trainer' && {
          headline,
          bio,
          sessionPriceCents: Math.round(Number(price) * 100),
          location,
          yearsCoaching: Number(years),
        }),
      };

      await fetch('/api/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (role === 'trainer') {
        toast.success('Trainer profile saved! Welcome to your Repwise dashboard.');
        router.push('/dashboard');
      } else {
        toast.success('Welcome to Repwise! Find coaches and begin your training.');
        router.push('/trainers');
      }
      router.refresh();
    } catch (err: unknown) {
      console.error(err);
      toast.error('Failed to save profile. Continuing anyway.');
      router.push(role === 'trainer' ? '/dashboard' : '/trainers');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container-page py-12 md:py-20">
      <div className="mx-auto max-w-2xl">
        <div className="text-center">
          <p className="eyebrow mb-2">Welcome to Repwise</p>
          <h1 className="font-display text-4xl uppercase tracking-tight md:text-6xl">
            Choose Your <span className="text-lime-ink">Role</span>
          </h1>
          <p className="mt-3 text-sm text-muted-foreground md:text-base">
            Whether you want to train or coach, Repwise gives you direct access to high-impact fitness.
          </p>
        </div>

        {/* Role Toggle Selector */}
        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => setRole('client')}
            className={`relative flex flex-col rounded-2xl border p-6 text-left transition-all ${
              role === 'client'
                ? 'border-primary bg-surface shadow-[0_0_25px_rgba(198,255,61,0.15)] ring-1 ring-primary'
                : 'border-border bg-surface/50 hover:border-border/80 hover:bg-surface'
            }`}
          >
            {role === 'client' && (
              <span className="absolute right-4 top-4 text-lime-ink">
                <CheckCircle2 className="size-5" />
              </span>
            )}
            <div className="grid size-12 place-items-center rounded-xl border border-border bg-surface-2 text-lime-ink">
              <User className="size-6" />
            </div>
            <h3 className="font-display mt-4 text-2xl uppercase">I Want to Train</h3>
            <p className="mt-1 text-xs text-muted-foreground">
              Buy structured video programs, book live 1:1 coaching calls, and chat with certified trainers.
            </p>
          </button>

          <button
            type="button"
            onClick={() => setRole('trainer')}
            className={`relative flex flex-col rounded-2xl border p-6 text-left transition-all ${
              role === 'trainer'
                ? 'border-primary bg-surface shadow-[0_0_25px_rgba(198,255,61,0.15)] ring-1 ring-primary'
                : 'border-border bg-surface/50 hover:border-border/80 hover:bg-surface'
            }`}
          >
            {role === 'trainer' && (
              <span className="absolute right-4 top-4 text-lime-ink">
                <CheckCircle2 className="size-5" />
              </span>
            )}
            <div className="grid size-12 place-items-center rounded-xl border border-border bg-surface-2 text-lime-ink">
              <Dumbbell className="size-6" />
            </div>
            <h3 className="font-display mt-4 text-2xl uppercase">I Am a Coach</h3>
            <p className="mt-1 text-xs text-muted-foreground">
              Publish video workout programs, set your hourly slot rate, and receive live payments directly.
            </p>
          </button>
        </div>

        {/* Step 2 Form based on chosen role */}
        <form onSubmit={handleComplete} className="mt-10 rounded-3xl border border-border bg-surface p-6 sm:p-10">
          {role === 'client' ? (
            <div className="space-y-6">
              <div>
                <h3 className="font-display text-2xl uppercase">Your Fitness Profile</h3>
                <p className="text-xs text-muted-foreground">Tell us a bit about your training goals.</p>
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Your Full Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-2 h-11 w-full rounded-xl border border-border bg-surface-2 px-4 text-sm text-foreground focus:border-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Primary Goals
                </label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {SPECIALTIES.map((spec) => {
                    const isSelected = selectedSpecialties.includes(spec);
                    return (
                      <button
                        key={spec}
                        type="button"
                        onClick={() => toggleSpecialty(spec)}
                        className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-all ${
                          isSelected
                            ? 'bg-primary text-primary-foreground font-semibold'
                            : 'border border-border bg-surface-2 text-muted-foreground hover:text-foreground'
                        }`}
                      >
                        {spec}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="border-t border-border pt-6">
                <Button type="submit" size="lg" disabled={isSubmitting} className="w-full font-semibold">
                  {isSubmitting ? 'Saving...' : <>Start Training <ArrowRight className="size-4" /></>}
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div>
                <h3 className="font-display text-2xl uppercase">Complete Trainer Profile</h3>
                <p className="text-xs text-muted-foreground">This info appears on your public coach card.</p>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="mt-2 h-11 w-full rounded-xl border border-border bg-surface-2 px-4 text-sm text-foreground focus:border-primary focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    60-Min Session Price ($)
                  </label>
                  <input
                    type="number"
                    required
                    min="20"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="mt-2 h-11 w-full rounded-xl border border-border bg-surface-2 px-4 text-sm text-foreground focus:border-primary focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Professional Headline
                </label>
                <input
                  type="text"
                  required
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  placeholder="e.g. Barbell strength, zero fluff"
                  className="mt-2 h-11 w-full rounded-xl border border-border bg-surface-2 px-4 text-sm text-foreground focus:border-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Bio / Philosophy
                </label>
                <textarea
                  rows={3}
                  required
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-border bg-surface-2 p-3 text-sm text-foreground focus:border-primary focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Location
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Austin, TX"
                    className="mt-2 h-11 w-full rounded-xl border border-border bg-surface-2 px-4 text-sm text-foreground focus:border-primary focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Years Coaching
                  </label>
                  <input
                    type="number"
                    value={years}
                    onChange={(e) => setYears(e.target.value)}
                    className="mt-2 h-11 w-full rounded-xl border border-border bg-surface-2 px-4 text-sm text-foreground focus:border-primary focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Specialties (select all that apply)
                </label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {SPECIALTIES.map((spec) => {
                    const isSelected = selectedSpecialties.includes(spec);
                    return (
                      <button
                        key={spec}
                        type="button"
                        onClick={() => toggleSpecialty(spec)}
                        className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-all ${
                          isSelected
                            ? 'bg-primary text-primary-foreground font-semibold'
                            : 'border border-border bg-surface-2 text-muted-foreground hover:text-foreground'
                        }`}
                      >
                        {spec}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Avatar mock upload */}
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Profile Photo
                </label>
                <div className="mt-2 flex items-center gap-4 rounded-xl border border-dashed border-border bg-surface-2/60 p-4">
                  <div className="grid size-12 place-items-center rounded-lg bg-surface text-muted-foreground">
                    <Upload className="size-5 text-lime-ink" />
                  </div>
                  <div className="flex-1 text-xs">
                    <p className="font-medium text-foreground">Upload your coaching portrait</p>
                    <p className="text-muted-foreground">PNG, JPG or WebP up to 5MB</p>
                  </div>
                  <Button type="button" variant="outline" size="sm">
                    Choose File
                  </Button>
                </div>
              </div>

              <div className="border-t border-border pt-6">
                <Button type="submit" size="lg" disabled={isSubmitting} className="w-full font-semibold">
                  {isSubmitting ? 'Saving...' : <>Launch Trainer Dashboard <ArrowRight className="size-4" /></>}
                </Button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

