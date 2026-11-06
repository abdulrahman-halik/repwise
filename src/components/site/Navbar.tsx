'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, LibraryBig, LogOut, Menu, MessageSquare, Search, UserRoundCog } from 'lucide-react';
import { Logo } from './Logo';
import { UserAvatar } from './UserAvatar';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';

const LINKS = [
  { href: '/trainers', label: 'Trainers' },
  { href: '/library', label: 'Library' },
  { href: '/messages', label: 'Messages' },
];

// Demo-only: the navbar renders a signed-in client. Swap for the Neon Auth session later.
const DEMO_USER = { name: 'Alex Rivera', email: 'alex@repwise.demo' };

export function Navbar() {
  const pathname = usePathname();
  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/75 backdrop-blur-xl">
      <div className="container-page flex h-16 items-center gap-6">
        <Logo />

        <nav className="hidden items-center gap-1 md:flex" aria-label="Main">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                'rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground',
                isActive(l.href) && 'text-foreground',
              )}
            >
              {l.label}
              {isActive(l.href) && <span className="mx-auto mt-0.5 block h-0.5 w-4 rounded-full bg-primary" />}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <Button asChild variant="ghost" size="icon" className="hidden sm:inline-flex" aria-label="Find trainers">
            <Link href="/trainers"><Search /></Link>
          </Button>
          <ThemeToggle />
          <Button asChild variant="ghost" className="hidden lg:inline-flex">
            <Link href="/auth/sign-in">Log in</Link>
          </Button>
          <Button asChild className="hidden lg:inline-flex">
            <Link href="/auth/sign-up">Join now</Link>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger className="rounded-full focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none" aria-label="Account menu">
              <UserAvatar name={DEMO_USER.name} className="size-9" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel className="font-normal">
                <p className="text-sm font-semibold">{DEMO_USER.name}</p>
                <p className="text-xs text-muted-foreground">{DEMO_USER.email}</p>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild><Link href="/library"><LibraryBig /> My library</Link></DropdownMenuItem>
              <DropdownMenuItem asChild><Link href="/messages"><MessageSquare /> Messages</Link></DropdownMenuItem>
              <DropdownMenuItem asChild><Link href="/dashboard"><LayoutDashboard /> Trainer dashboard</Link></DropdownMenuItem>
              <DropdownMenuItem asChild><Link href="/onboarding"><UserRoundCog /> Onboarding</Link></DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild><Link href="/"><LogOut /> Sign out</Link></DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden" aria-label="Open menu"><Menu /></Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <SheetHeader><SheetTitle><Logo /></SheetTitle></SheetHeader>
              <nav className="flex flex-col gap-1 px-4" aria-label="Mobile">
                {LINKS.map((l) => (
                  <Link key={l.href} href={l.href} className={cn('font-display rounded-lg px-3 py-3 text-3xl', isActive(l.href) ? 'text-lime-ink' : 'text-foreground')}>
                    {l.label}
                  </Link>
                ))}
                <Link href="/dashboard" className="font-display rounded-lg px-3 py-3 text-3xl">Dashboard</Link>
              </nav>
              <div className="mt-auto grid gap-2 p-4">
                <Button asChild variant="outline"><Link href="/auth/sign-in">Log in</Link></Button>
                <Button asChild><Link href="/auth/sign-up">Join now</Link></Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

