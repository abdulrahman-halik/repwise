import Image from 'next/image';
import { initials } from '@/lib/format';
import { cn } from '@/lib/utils';

const TONES = [
  'from-[#1d2a12] via-[#121a0d] to-[#0a0d0b]',
  'from-[#13261f] via-[#0e1915] to-[#0a0d0b]',
  'from-[#22261a] via-[#14170f] to-[#0a0d0b]',
  'from-[#152320] via-[#0d1614] to-[#0a0d0b]',
];

function toneFor(seed: string) {
  let h = 0;
  for (const c of seed) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return TONES[h % TONES.length];
}

/**
 * Trainer / program imagery. Renders the photo when one exists, otherwise a
 * branded placeholder (monogram + lime glow) so swapping in generated images
 * later is a data-only change.
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
    <div className={cn('grain relative overflow-hidden bg-surface-2', className)}>
      {src ? (
        <Image src={src} alt={alt} fill sizes={sizes} priority={priority} className="object-cover" style={{ objectPosition: position }} />
      ) : (
        <div className={cn('absolute inset-0 bg-gradient-to-br', toneFor(seed))} role="img" aria-label={alt}>
          <div className="absolute -right-1/4 -top-1/4 size-[80%] rounded-full bg-[#c6ff3d]/10 blur-3xl" />
          <svg className="absolute inset-0 size-full opacity-[0.07]" aria-hidden>
            <defs>
              <pattern id={`g-${seed}`} width="28" height="28" patternUnits="userSpaceOnUse">
                <path d="M28 0H0v28" fill="none" stroke="#c6ff3d" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill={`url(#g-${seed})`} />
          </svg>
          <span className="font-display absolute bottom-[8%] left-[8%] text-[clamp(64px,9vw,140px)] text-white/[0.07] select-none">
            {initials(label ?? alt)}
          </span>
        </div>
      )}
    </div>
  );
}

