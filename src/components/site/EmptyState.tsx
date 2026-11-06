import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-surface/50 px-6 py-14 text-center',
        className,
      )}
    >
      <span className="mb-4 grid size-12 place-items-center rounded-full border border-border bg-surface-2 text-lime-ink">
        <Icon className="size-5" aria-hidden />
      </span>
      <h3 className="font-display text-2xl">{title}</h3>
      <p className="mt-2 max-w-sm text-sm text-muted-foreground">{description}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}

