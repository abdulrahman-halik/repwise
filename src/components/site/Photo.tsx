import Image from 'next/image';
import { initials } from '@/lib/format';
import { cn } from '@/lib/utils';

/**
 * Trainer / program imagery. Renders the photo when one exists, otherwise a
 * clean solid surface placeholder with monogram and subtle grid.
 */
export function Photo({
  src,
  alt,
  seed,
  label,
  className,
  sizes = '(min-width: 1024px) 25vw, 50vw',
  priority,
  position = 'center',
}: {
  src: string | null | undefined;
  alt: string;
  seed: string;
  label?: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
  position?: string;
}) {
  return (
    <div className={cn('relative overflow-hidden bg-surface-2', className)}>
      {src ? (
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover"
          style={{ objectPosition: position }}
        />
      ) : (
        <div className="absolute inset-0 bg-[#141915]" role="img" aria-label={alt}>
          <svg className="absolute inset-0 size-full opacity-10" aria-hidden>
            <defs>
              <pattern id={`g-${seed}`} width="28" height="28" patternUnits="userSpaceOnUse">
                <path d="M28 0H0v28" fill="none" stroke="#232A25" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill={`url(#g-${seed})`} />
          </svg>
          <span className="font-display absolute bottom-[8%] left-[8%] text-[clamp(64px,9vw,140px)] text-white/10 select-none">
            {initials(label ?? alt)}
          </span>
        </div>
      )}
    </div>
  );
}
