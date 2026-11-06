'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  Dumbbell,
  Eye,
  FileVideo,
  GripVertical,
  Plus,
  Save,
  Sparkles,
  Trash2,
  Upload,
} from 'lucide-react';
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
import type { Lesson, Program } from '@/lib/types';
import { toast } from 'sonner';

export function ProgramEditorClient({
  program,
  initialLessons,
}: {
  program: Program;
  initialLessons: Lesson[];
}) {
  const [lessons, setLessons] = useState(initialLessons);
  const [title, setTitle] = useState(program.title);
  const [description, setDescription] = useState(program.description);
  const [price, setPrice] = useState((program.priceCents / 100).toString());
  const [level, setLevel] = useState(program.level);
  const [weeks, setWeeks] = useState(program.weeks.toString());
  const [published, setPublished] = useState(program.published);

  // Add lesson modal
  const [isAddLessonOpen, setIsAddLessonOpen] = useState(false);
  const [lessonTitle, setLessonTitle] = useState('');
  const [durationMin, setDurationMin] = useState('15');
  const [isUploading, setIsUploading] = useState(false);

  const handleSaveProgram = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Program details and lesson order saved!');
  };

  const handleDeleteLesson = (id: string) => {
    setLessons((prev) => prev.filter((l) => l.id !== id));
    toast.info('Lesson removed.');
  };

  const handleAddLesson = (e: React.FormEvent) => {
    e.preventDefault();
    if (!lessonTitle.trim()) return;

    setIsUploading(true);
    setTimeout(() => {
      const nextPos = lessons.length + 1;
      const newLesson: Lesson = {
        id: `${program.id}-l${Date.now()}`,
        programId: program.id,
        title: lessonTitle.trim(),
        position: nextPos,
        videoPath: `/lessons/${program.id}/${nextPos}.mp4`,
        durationMin: parseInt(durationMin, 10) || 12,
      };

      setLessons([...lessons, newLesson]);
      setIsUploading(false);
      setIsAddLessonOpen(false);
      setLessonTitle('');
      toast.success(`Uploaded and added "${newLesson.title}"!`);
    }, 600);
  };

  return (
    <div className="space-y-8">
      {/* Back button */}
      <div>
        <Button asChild variant="ghost" size="sm" className="-ml-3 text-muted-foreground hover:text-foreground">
          <Link href="/dashboard/programs">
            <ArrowLeft className="size-4" /> Back to Programs
          </Link>
        </Button>
      </div>

      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <span className="eyebrow">Program Editor</span>
          <h1 className="font-display mt-1 text-4xl uppercase md:text-5xl">{title}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Configure metadata, lesson video uploads, and preview permissions.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button asChild variant="outline">
            <Link href={`/programs/${program.id}`} target="_blank">
              <Eye className="size-4" /> View as Student
            </Link>
          </Button>
          <Button onClick={handleSaveProgram} className="font-semibold">
            <Save className="size-4" /> Save Changes
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_420px]">
        {/* Left: Lessons Builder */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display text-2xl uppercase">Ordered Video Lessons</h2>
              <p className="text-xs text-muted-foreground">
                Lesson 1 is automatically public free preview. Lessons 2+ require purchase.
              </p>
            </div>

            <Button onClick={() => setIsAddLessonOpen(true)} size="sm" className="font-semibold">
              <Plus className="size-4" /> Add Lesson
            </Button>
          </div>

          <div className="space-y-3">
            {lessons.map((lesson, idx) => {
              const isFreePreview = lesson.position === 1;

              return (
                <div
                  key={lesson.id}
                  className="flex items-center justify-between rounded-2xl border border-border bg-surface p-4 transition-colors hover:border-primary/40"
                >
                  <div className="flex items-center gap-3.5">
                    <span className="cursor-grab text-muted-foreground/40 hover:text-muted-foreground">
                      <GripVertical className="size-5" />
                    </span>

                    <span className="grid size-8 place-items-center rounded-lg bg-surface-2 font-mono text-xs font-bold text-foreground">
                      0{lesson.position}
                    </span>

                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-semibold text-foreground">{lesson.title}</h4>
                        {isFreePreview && (
                          <span className="rounded bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-lime-ink">
                            FREE PREVIEW
                          </span>
                        )}
                      </div>
                      <p className="mt-0.5 flex items-center gap-2 text-xs text-muted-foreground">
                        <Clock className="size-3" /> {lesson.durationMin} minutes · ImageKit Video Player
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteLesson(lesson.id)}
                      className="text-muted-foreground hover:text-destructive"
                      title="Delete Lesson"
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Program Settings Card */}
        <div className="space-y-6">
          <div className="rounded-3xl border border-border bg-surface p-6">
            <h3 className="font-display text-2xl uppercase">Program Settings</h3>

            <div className="mt-6 space-y-4">
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="mt-1.5 h-10 w-full rounded-xl border border-border bg-surface-2 px-3 text-sm text-foreground focus:border-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Description
                </label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-border bg-surface-2 p-3 text-sm text-foreground focus:border-primary focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Price ($)
                  </label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="mt-1.5 h-10 w-full rounded-xl border border-border bg-surface-2 px-3 text-sm text-foreground focus:border-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Weeks
                  </label>
                  <input
                    type="number"
                    value={weeks}
                    onChange={(e) => setWeeks(e.target.value)}
                    className="mt-1.5 h-10 w-full rounded-xl border border-border bg-surface-2 px-3 text-sm text-foreground focus:border-primary focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Publication Status
                </label>
                <div className="mt-2 flex items-center justify-between rounded-xl border border-border bg-surface-2 p-3">
                  <span className="text-xs font-medium text-foreground">
                    {published ? 'Published in Directory' : 'Hidden as Draft'}
                  </span>
                  <input
                    type="checkbox"
                    checked={published}
                    onChange={(e) => setPublished(e.target.checked)}
                    className="size-4 accent-primary"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Lesson Modal */}
      <Dialog open={isAddLessonOpen} onOpenChange={setIsAddLessonOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl uppercase">
              Add Video Lesson
            </DialogTitle>
            <DialogDescription>
              Upload private lesson MP4 video to ImageKit and assign its position.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleAddLesson} className="space-y-4 py-2">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Lesson Title
              </label>
              <input
                type="text"
                required
                value={lessonTitle}
                onChange={(e) => setLessonTitle(e.target.value)}
                placeholder="e.g. Deadlift Setup & Core Bracing"
                className="mt-1.5 h-10 w-full rounded-xl border border-border bg-surface-2 px-3 text-sm text-foreground focus:border-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Duration (Minutes)
              </label>
              <input
                type="number"
                min="1"
                value={durationMin}
                onChange={(e) => setDurationMin(e.target.value)}
                className="mt-1.5 h-10 w-full rounded-xl border border-border bg-surface-2 px-3 text-sm text-foreground focus:border-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Video File (Max 100MB)
              </label>
              <div className="mt-1.5 flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-surface-2/60 p-6 text-center">
                <FileVideo className="size-8 text-lime-ink" />
                <p className="mt-2 text-xs font-medium text-foreground">
                  Drag and drop private MP4 or WebM
                </p>
                <p className="text-[10px] text-muted-foreground">Signed streaming via ImageKit SDK</p>
              </div>
            </div>

            <DialogFooter className="mt-6 flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsAddLessonOpen(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isUploading} className="flex-1 font-semibold">
                {isUploading ? 'Uploading...' : 'Save Lesson'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

