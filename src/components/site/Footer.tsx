import Link from 'next/link';
import { Logo } from './Logo';

const COLUMNS = [
  { title: 'Train', links: [['Find a trainer', '/trainers'], ['Strength', '/trainers?specialty=strength'], ['HIIT', '/trainers?specialty=hiit'], ['Yoga', '/trainers?specialty=yoga']] },
  { title: 'Coach', links: [['Become a trainer', '/onboarding'], ['Dashboard', '/dashboard'], ['Programs', '/dashboard/programs'], ['Slots', '/dashboard/slots']] },
  { title: 'Account', links: [['Log in', '/auth/sign-in'], ['Sign up', '/auth/sign-up'], ['Library', '/library'], ['Messages', '/messages']] },
] as const;

export function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="container-page grid gap-10 py-14 md:grid-cols-[1.4fr_repeat(3,1fr)]">
        <div>
          <Logo />
          <p className="mt-4 max-w-xs text-sm text-muted-foreground">
            Real coaches. Real programs. Live 1:1 sessions. Train with people who&apos;ve done it.
          </p>
          <p className="font-script mt-6 -rotate-3 text-3xl text-lime-ink">#EarnEveryRep</p>
        </div>
        {COLUMNS.map((col) => (
          <div key={col.title}>
            <h3 className="text-sm font-semibold">{col.title}</h3>
            <ul className="mt-4 space-y-2.5">
              {col.links.map(([label, href]) => (
                <li key={label}>
                  <Link href={href} className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="container-page flex flex-col justify-between gap-2 border-t border-border py-6 text-xs text-muted-foreground sm:flex-row">
        <p>© 2026 Repwise. Demo data only — no real payments.</p>
        <p>Built with Next.js, Neon, Stripe & Stream.</p>
      </div>
    </footer>
  );
}

