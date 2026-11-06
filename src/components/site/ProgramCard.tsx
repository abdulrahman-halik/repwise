import Link from 'next/link';
import { ArrowRight, PlayCircle } from 'lucide-react';
import { Photo } from './Photo';
import { formatPrice } from '@/lib/format';
import { getTrainer, lessonsForProgram } from '@/lib/queries';
import type { Program } from '@/lib/types';

export function ProgramCard({ program, showTrainer = true }: { program: Program; showTrainer?: boolean }) {
  const trainer = getTrainer(program.trainerId);
  const lessonCount = lessonsForProgram(program.id).length;
  return (
    <Link
      href={`/programs/${program.id}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-surface transition-colors hover:border-lime-ink/40 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
    >
      <div className="relative aspect-[16/10]">
        <Photo src={program.coverUrl} alt={program.title} seed={program.id} position="70% 30%" className="absolute inset-0" />
        <div className="absolute inset-0 bg-black/40" />
        <span className="absolute left-3 top-3 rounded-full bg-black/50 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur-sm">
          {program.level} · {program.weeks} weeks
        </span>
        <span className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 text-xs font-medium text-white">
          <PlayCircle className="size-4 text-[#c6ff3d]" aria-hidden /> {lessonCount} lessons · Lesson 1 free
        </span>
      </div>
      <div className="flex flex-1 flex-col p-5">
        {showTrainer && trainer && <p className="text-xs text-muted-foreground">with {trainer.name}</p>}
        <h3 className="mt-1 text-lg font-semibold leading-snug">{program.title}</h3>
        <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{program.description}</p>
        <div className="mt-auto flex items-center justify-between pt-5">
          <span className="font-display text-3xl">{formatPrice(program.priceCents)}</span>
          <span className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-semibold transition-colors group-hover:border-primary group-hover:bg-primary group-hover:text-primary-foreground">
            Explore <ArrowRight className="size-3.5" aria-hidden />
          </span>
        </div>
      </div>
    </Link>
  );
}

