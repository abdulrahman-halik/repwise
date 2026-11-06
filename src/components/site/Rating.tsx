import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Rating({
  avg,
  count,
  className,
  compact,
}: {
  avg: number;
  count: number;
  className?: string;
  compact?: boolean;
}) {
  if (count === 0) {
    return <span className={cn('text-xs text-muted-foreground', className)}>New coach</span>;
  }
  return (
    <span className={cn('inline-flex items-center gap-1 text-sm font-semibold', className)}>
      <Star className="size-3.5 fill-lime-ink text-lime-ink" aria-hidden />
      {avg.toFixed(1)}
      <span className="font-normal text-muted-foreground">({count}{compact ? '' : count === 1 ? ' review' : ' reviews'})</span>
    </span>
  );
}

export function Stars({ value, className }: { value: number; className?: string }) {
  return (
    <span className={cn('inline-flex gap-0.5', className)} aria-label={`${value} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star key={i} className={cn('size-3.5', i <= value ? 'fill-lime-ink text-lime-ink' : 'text-border')} aria-hidden />
      ))}
    </span>
  );
}

