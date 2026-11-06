import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export function SectionHeading({
  eyebrow,
  title,
  description,
  href,
  linkLabel,
  className,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  description?: string;
  href?: string;
  linkLabel?: string;
  className?: string;
}) {
  return (
    <div className={cn('mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between', className)}>
      <div>
        {eyebrow && <p className="eyebrow mb-3">{eyebrow}</p>}
        <h2 className="font-display text-4xl md:text-5xl">{title}</h2>
        {description && <p className="mt-3 max-w-xl text-muted-foreground">{description}</p>}
      </div>
      {href && (
        <Link
          href={href}
          className="group inline-flex items-center gap-1.5 text-sm font-semibold text-lime-ink"
        >
          {linkLabel}
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
        </Link>
      )}
    </div>
  );
}

