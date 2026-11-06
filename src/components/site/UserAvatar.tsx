import Image from 'next/image';
import { initials } from '@/lib/format';
import { cn } from '@/lib/utils';

export function UserAvatar({
  name,
  src,
  className,
}: {
  name: string;
  src?: string | null;
  className?: string;
}) {
  return (
    <span
      className={cn(
        'relative inline-grid size-10 shrink-0 place-items-center overflow-hidden rounded-full border border-border bg-surface-2 text-xs font-semibold text-foreground',
        className,
      )}
    >
      {src ? (
        <Image src={src} alt={name} fill sizes="64px" className="object-cover object-[70%_20%]" />
      ) : (
        <span aria-hidden>{initials(name)}</span>
      )}
      <span className="sr-only">{name}</span>
    </span>
  );
}

