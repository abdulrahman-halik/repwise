import Link from 'next/link';
import { cn } from '@/lib/utils';

export function Logo({ className, href = '/' }: { className?: string; href?: string }) {
  return (
    <Link href={href} className={cn('group inline-flex items-center gap-2', className)} aria-label="Repwise home">
      <span className="grid size-8 place-items-center rounded-lg bg-primary text-primary-foreground transition-transform group-hover:-rotate-6">
        <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth={2.6} strokeLinecap="round" aria-hidden>
          <path d="M4 9v6M7 7v10M17 7v10M20 9v6M7 12h10" />
        </svg>
      </span>
      <span className="font-display text-[26px] leading-none tracking-wide">Repwise</span>
    </Link>
  );
}

