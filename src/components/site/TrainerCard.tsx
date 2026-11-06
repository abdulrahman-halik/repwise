import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { Photo } from './Photo';
import { Rating } from './Rating';
import { formatPrice } from '@/lib/format';
import { getTrainerRating } from '@/lib/queries';
import type { Profile } from '@/lib/types';

export function TrainerCard({ trainer, priority }: { trainer: Profile; priority?: boolean }) {
  const rating = getTrainerRating(trainer.userId);
  return (
    <Link
      href={`/trainers/${trainer.userId}`}
      className="group relative flex aspect-[3/4] flex-col justify-end overflow-hidden rounded-2xl border border-border bg-surface focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
    >
      <Photo
        src={trainer.coverUrl}
        alt={trainer.name}
        seed={trainer.userId}
        position="72% 20%"
        priority={priority}
        className="absolute inset-0 transition-transform duration-500 group-hover:scale-[1.04]"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

      <div className="absolute left-4 top-4 flex flex-wrap gap-1.5">
        {trainer.specialties?.slice(0, 2).map((s) => (
          <span key={s} className="rounded-full border border-white/15 bg-black/40 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur-sm">
            {s}
          </span>
        ))}
      </div>
      <span className="absolute right-4 top-4 grid size-9 place-items-center rounded-full bg-primary text-primary-foreground opacity-0 transition-all group-hover:opacity-100">
        <ArrowUpRight className="size-4" aria-hidden />
      </span>

      <div className="relative p-5 text-white">
        <h3 className="font-display text-3xl">{trainer.name}</h3>
        <p className="mt-1 line-clamp-1 text-sm text-white/70">{trainer.headline}</p>
        <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-3">
          <Rating avg={rating.avg} count={rating.count} compact className="text-white [&_svg]:fill-[#c6ff3d] [&_svg]:text-[#c6ff3d]" />
          <span className="text-sm text-white/70">
            <span className="font-semibold text-white">{formatPrice(trainer.sessionPriceCents ?? 0)}</span> / session
          </span>
        </div>
      </div>
    </Link>
  );
}

