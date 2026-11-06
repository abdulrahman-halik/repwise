'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  Dumbbell,
  Lock,
  Maximize2,
  Pause,
  Play,
  PlayCircle,
  ShieldCheck,
  Sparkles,
  Unlock,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { Photo } from '@/components/site/Photo';
import { UserAvatar } from '@/components/site/UserAvatar';
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
import type { Lesson, Profile, Program } from '@/lib/types';
import { toast } from 'sonner';

export function ProgramPlayerClient({
  program,
  trainer,
  lessons,
}: {
  program: Program;
  trainer: Profile;
  lessons: Lesson[];
}) {
  const searchParams = useSearchParams();
  const initialLessonIndex = Math.max(
    0,
    lessons.findIndex((l) => l.position.toString() === searchParams.get('lesson')),
  );

  const [activeLessonIndex, setActiveLessonIndex] = useState(
    initialLessonIndex >= 0 ? initialLessonIndex : 0,
  );
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [hasPurchased, setHasPurchased] = useState(false);
  const [isBuyModalOpen, setIsBuyModalOpen] = useState(false);

  const currentLesson = lessons[activeLessonIndex] || lessons[0];
  const isPreview = currentLesson?.position === 1;
  const isUnlocked = isPreview || hasPurchased;

  const handleSelectLesson = (index: number) => {
    setActiveLessonIndex(index);
    setIsPlaying(false);
  };

  const handleCompletePurchase = () => {
    setHasPurchased(true);
    setIsBuyModalOpen(false);
    toast.success(`Unlocked all ${lessons.length} lessons of ${program.title}!`);
  };

  return (
    <div className="container-page py-8 md:py-12">
      {/* Top back breadcrumb */}
      <div className="mb-6">
        <Button asChild variant="ghost" size="sm" className="-ml-3 text-muted-foreground hover:text-foreground">
          <Link href={`/trainers/${trainer.userId}`}>
            <ArrowLeft className="size-4" /> Back to {trainer.name}
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_380px]">
        {/* Left Column: Player & Lesson Info */}
        <div>
          {/* Video Player Box */}
          <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-border bg-black shadow-2xl">
            {isUnlocked ? (
              <div className="relative size-full">
                {/* Simulated video playback screen with athletic gym footage */}
                <Photo
                  src={program.coverUrl || '/images/hero.png'}
                  alt={currentLesson.title}
                  seed={currentLesson.id}
                  position="center"
                  className={`size-full transition-transform duration-700 ${isPlaying ? 'scale-105 filter brightness-110' : 'filter brightness-75'}`}
                />

                {/* Subtle dark gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />

                {/* Watermark / status badge */}
                <div className="absolute left-4 top-4 z-10 flex items-center gap-2">
                  <span className="rounded-md bg-black/60 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur">
                    Lesson {currentLesson.position} · {currentLesson.durationMin}m
                  </span>
                  {isPreview && !hasPurchased && (
                    <span className="inline-flex items-center gap-1 rounded-md bg-primary px-2.5 py-1 text-xs font-bold uppercase text-primary-foreground">
                      <Sparkles className="size-3" /> Free Preview
                    </span>
                  )}
                </div>

                {/* Center Play Button Overlay */}
                {!isPlaying && (
                  <button
                    onClick={() => setIsPlaying(true)}
                    className="group absolute inset-0 z-10 grid place-items-center bg-black/30 backdrop-blur-[2px] transition-all hover:bg-black/20"
                    aria-label="Play video"
                  >
                    <div className="grid size-20 place-items-center rounded-full bg-primary text-primary-foreground shadow-[0_0_30px_rgba(198,255,61,0.5)] transition-transform group-hover:scale-110">
                      <Play className="size-8 translate-x-0.5 fill-current" />
                    </div>
                  </button>
                )}

                {/* Controls Bar */}
                <div className="absolute inset-x-0 bottom-0 z-10 flex items-center justify-between bg-gradient-to-t from-black/95 via-black/60 to-transparent p-4 text-white">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="rounded-lg p-1.5 transition-colors hover:bg-white/10"
                    >
                      {isPlaying ? <Pause className="size-5" /> : <Play className="size-5 fill-current" />}
                    </button>
                    <button
                      onClick={() => setIsMuted(!isMuted)}
                      className="rounded-lg p-1.5 transition-colors hover:bg-white/10"
                    >
                      {isMuted ? <VolumeX className="size-5" /> : <Volume2 className="size-5" />}
                    </button>
                    <span className="text-xs font-mono text-white/80">
                      {isPlaying ? '04:12' : '00:00'} / {currentLesson.durationMin}:00
                    </span>
                  </div>

                  {/* Scrubber mock */}
                  <div className="mx-4 hidden flex-1 sm:block">
                    <div className="relative h-1.5 w-full cursor-pointer rounded-full bg-white/20">
                      <div
                        className="h-full rounded-full bg-primary"
                        style={{ width: isPlaying ? '35%' : '0%' }}
                      />
                    </div>
                  </div>

                  <button className="rounded-lg p-1.5 transition-colors hover:bg-white/10">
                    <Maximize2 className="size-5" />
                  </button>
                </div>
              </div>
            ) : (
              /* Locked Screen */
              <div className="relative flex size-full flex-col items-center justify-center p-8 text-center">
                <Photo
                  src={program.coverUrl || '/images/hero.png'}
                  alt={currentLesson.title}
                  seed={currentLesson.id}
                  className="absolute inset-0 filter blur-md brightness-50"
                />
                <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

                <div className="relative z-10 max-w-md">
                  <div className="mx-auto grid size-16 place-items-center rounded-full border border-white/20 bg-black/60 text-white">
                    <Lock className="size-7 text-lime-ink" />
                  </div>
                  <h3 className="font-display mt-4 text-3xl uppercase text-white">
                    Lesson {currentLesson.position} is Locked
                  </h3>
                  <p className="mt-2 text-sm text-white/70">
                    Unlock all {lessons.length} video lessons in <strong>{program.title}</strong> with full lifetime access.
                  </p>
                  <Button
                    onClick={() => setIsBuyModalOpen(true)}
                    size="lg"
                    className="mt-6 font-semibold"
                  >
                    Unlock Program · {formatPrice(program.priceCents)}
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Current Lesson Metadata */}
          <div className="mt-6">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-4">
              <div>
                <span className="eyebrow">Lesson {currentLesson.position} of {lessons.length}</span>
                <h2 className="font-display mt-1 text-3xl uppercase">{currentLesson.title}</h2>
              </div>
              {!hasPurchased && (
                <Button onClick={() => setIsBuyModalOpen(true)} className="font-semibold">
                  Unlock Full Program · {formatPrice(program.priceCents)}
                </Button>
              )}
            </div>

            {/* Program details overview */}
            <div className="mt-6 space-y-4">
              <h3 className="text-lg font-semibold">About this program</h3>
              <p className="text-sm leading-relaxed text-muted-foreground md:text-base">
                {program.description}
              </p>

              {/* Coach card snippet */}
              <div className="mt-8 flex items-center justify-between rounded-2xl border border-border bg-surface p-5">
                <div className="flex items-center gap-4">
                  <UserAvatar name={trainer.name} className="size-12" />
                  <div>
                    <h4 className="text-sm font-semibold">{trainer.name}</h4>
                    <p className="text-xs text-muted-foreground">{trainer.headline}</p>
                  </div>
                </div>
                <Button asChild variant="outline" size="sm">
                  <Link href={`/trainers/${trainer.userId}`}>View Coach Profile</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Ordered Lesson Playlist */}
        <div className="flex flex-col rounded-2xl border border-border bg-surface p-5">
          <div className="mb-4 flex items-center justify-between border-b border-border pb-3">
            <div>
              <h3 className="font-display text-xl uppercase">Program Playlist</h3>
              <p className="text-xs text-muted-foreground">{lessons.length} lessons ({program.weeks} weeks)</p>
            </div>
            {hasPurchased && (
              <span className="inline-flex items-center gap-1 rounded-full border border-primary/30 bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-lime-ink">
                <CheckCircle2 className="size-3.5" /> Full Access
              </span>
            )}
          </div>

          <div className="flex-1 space-y-2 overflow-y-auto">
            {lessons.map((lesson, idx) => {
              const isSelected = idx === activeLessonIndex;
              const lessonIsFree = lesson.position === 1;
              const lessonIsAccessible = lessonIsFree || hasPurchased;

              return (
                <button
                  key={lesson.id}
                  onClick={() => handleSelectLesson(idx)}
                  className={`group flex w-full items-center gap-3 rounded-xl p-3 text-left transition-all ${
                    isSelected
                      ? 'border border-primary/60 bg-surface-2 shadow-sm'
                      : 'border border-transparent hover:bg-surface-2/60'
                  }`}
                >
                  <span
                    className={`grid size-8 shrink-0 place-items-center rounded-lg font-mono text-xs font-bold ${
                      isSelected
                        ? 'bg-primary text-primary-foreground'
                        : 'border border-border bg-surface text-muted-foreground group-hover:text-foreground'
                    }`}
                  >
                    0{lesson.position}
                  </span>

                  <div className="flex-1 min-w-0">
                    <p className={`truncate text-sm font-medium ${isSelected ? 'text-primary' : 'text-foreground'}`}>
                      {lesson.title}
                    </p>
                    <span className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock className="size-3" /> {lesson.durationMin} mins
                    </span>
                  </div>

                  <div className="shrink-0">
                    {lessonIsAccessible ? (
                      lessonIsFree ? (
                        <span className="rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-semibold text-lime-ink">
                          FREE
                        </span>
                      ) : (
                        <PlayCircle className="size-4 text-muted-foreground group-hover:text-primary" />
                      )
                    ) : (
                      <Lock className="size-4 text-muted-foreground/60" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {!hasPurchased && (
            <div className="mt-6 rounded-xl border border-primary/30 bg-primary/5 p-4 text-center">
              <p className="text-xs text-muted-foreground">Get lifetime access to all lessons</p>
              <Button
                onClick={() => setIsBuyModalOpen(true)}
                className="mt-3 w-full font-semibold"
              >
                Buy Program · {formatPrice(program.priceCents)}
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Program Purchase Modal */}
      <Dialog open={isBuyModalOpen} onOpenChange={setIsBuyModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl uppercase">
              Unlock Full Program
            </DialogTitle>
            <DialogDescription>
              One-time payment for lifetime access to all ordered video lessons.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-3">
            <div className="rounded-xl border border-border bg-surface-2 p-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Program:</span>
                <span className="font-semibold text-foreground">{program.title}</span>
              </div>
              <div className="mt-2 flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Instructor:</span>
                <span className="font-semibold text-foreground">{trainer.name}</span>
              </div>
              <div className="mt-2 flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Includes:</span>
                <span className="font-semibold text-foreground">{lessons.length} HD Lessons ({program.weeks} Weeks)</span>
              </div>
              <div className="mt-3 flex items-center justify-between border-t border-border pt-3 text-base">
                <span className="font-medium text-foreground">Total:</span>
                <span className="font-display text-3xl text-lime-ink">
                  {formatPrice(program.priceCents)}
                </span>
              </div>
            </div>

            <p className="text-xs text-muted-foreground">
              * Simulated Stripe Checkout session. Unlocks all lessons instantly in this preview.
            </p>

            <DialogFooter className="mt-6 flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsBuyModalOpen(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleCompletePurchase}
                className="flex-1 font-semibold"
              >
                Pay & Unlock
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

