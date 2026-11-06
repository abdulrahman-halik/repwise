'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  CheckCircle2,
  Dumbbell,
  Edit3,
  ExternalLink,
  Eye,
  Plus,
  Sparkles,
} from 'lucide-react';
import { Photo } from '@/components/site/Photo';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { formatPrice } from '@/lib/format';
import type { Program } from '@/lib/types';
import { toast } from 'sonner';

export function ProgramsListClient({
  initialPrograms,
}: {
  initialPrograms: Program[];
}) {
  const [programs, setPrograms] = useState(initialPrograms);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('49');
  const [level, setLevel] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Beginner');
  const [weeks, setWeeks] = useState('6');

  const handleCreateProgram = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newProg: Program = {
      id: `p-${Date.now()}`,
      trainerId: 't-maya',
      title: title.trim(),
      description: description.trim() || 'A structured workout program.',
      coverUrl: null,
      priceCents: Math.round(parseFloat(price) * 100),
      published: true,
      createdAt: new Date().toISOString(),
      level,
      weeks: parseInt(weeks, 10) || 6,
    };

    setPrograms([newProg, ...programs]);
    setIsCreateOpen(false);
    setTitle('');
    setDescription('');
    toast.success(`Created program "${newProg.title}"!`);
  };

  const togglePublish = (id: string) => {
    setPrograms((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const nextState = !p.published;
          toast.info(`${p.title} is now ${nextState ? 'Published' : 'Draft'}`);
          return { ...p, published: nextState };
        }
        return p;
      }),
    );
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <span className="eyebrow">Content Studio</span>
          <h1 className="font-display mt-1 text-4xl uppercase md:text-5xl">My Programs</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage your ordered video courses, lesson videos, and pricing.
          </p>
        </div>

        <Button onClick={() => setIsCreateOpen(true)} className="font-semibold">
          <Plus className="size-4" /> Create New Program
        </Button>
      </div>

      {/* Programs Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {programs.map((prog) => (
          <div
            key={prog.id}
            className="flex flex-col overflow-hidden rounded-3xl border border-border bg-surface transition-all hover:border-primary/40"
          >
            <div className="relative aspect-[16/9]">
              <Photo
                src={prog.coverUrl}
                alt={prog.title}
                seed={prog.id}
                className="size-full"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
              <div className="absolute left-3 top-3 flex items-center gap-2">
                <span
                  className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                    prog.published
                      ? 'bg-primary text-primary-foreground'
                      : 'border border-border bg-black/60 text-muted-foreground backdrop-blur'
                  }`}
                >
                  {prog.published ? 'Published' : 'Draft'}
                </span>
                <span className="rounded-full bg-black/50 px-2.5 py-0.5 text-[11px] text-white backdrop-blur">
                  {prog.level} · {prog.weeks} wks
                </span>
              </div>
            </div>

            <div className="flex flex-1 flex-col p-6">
              <h3 className="font-display text-2xl uppercase text-foreground">{prog.title}</h3>
              <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                {prog.description}
              </p>

              <div className="mt-auto pt-6">
                <div className="flex items-center justify-between border-t border-border pt-4">
                  <div>
                    <span className="text-[10px] uppercase text-muted-foreground">Price</span>
                    <p className="font-display text-2xl text-lime-ink">
                      {formatPrice(prog.priceCents)}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => togglePublish(prog.id)}
                      className="text-xs"
                    >
                      {prog.published ? 'Unpublish' : 'Publish'}
                    </Button>
                    <Button asChild size="sm">
                      <Link href={`/dashboard/programs/${prog.id}`}>
                        <Edit3 className="size-3.5" /> Edit
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create Program Modal */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl uppercase">
              Create New Workout Program
            </DialogTitle>
            <DialogDescription>
              Set up your program details. You can add video lessons in the editor.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateProgram} className="space-y-4 py-2">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Program Title
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. 12-Week Hypertrophy Blueprint"
                className="mt-1.5 h-10 w-full rounded-xl border border-border bg-surface-2 px-3 text-sm text-foreground focus:border-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Description
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What will athletes achieve with this program?"
                className="mt-1.5 w-full rounded-xl border border-border bg-surface-2 p-3 text-sm text-foreground focus:border-primary focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Price ($)
                </label>
                <input
                  type="number"
                  required
                  min="9"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="mt-1.5 h-10 w-full rounded-xl border border-border bg-surface-2 px-3 text-sm text-foreground focus:border-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Level
                </label>
                <select
                  value={level}
                  onChange={(e) => setLevel(e.target.value as any)}
                  className="mt-1.5 h-10 w-full rounded-xl border border-border bg-surface-2 px-2 text-xs text-foreground focus:border-primary focus:outline-none"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Duration (Weeks)
                </label>
                <input
                  type="number"
                  min="1"
                  max="52"
                  value={weeks}
                  onChange={(e) => setWeeks(e.target.value)}
                  className="mt-1.5 h-10 w-full rounded-xl border border-border bg-surface-2 px-3 text-sm text-foreground focus:border-primary focus:outline-none"
                />
              </div>
            </div>

            <DialogFooter className="mt-6 flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsCreateOpen(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button type="submit" className="flex-1 font-semibold">
                Create & Continue
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

