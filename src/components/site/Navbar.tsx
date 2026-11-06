'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu } from 'lucide-react';
import { Logo } from './Logo';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { authClient } from '@/lib/auth/client';
import { useRouter } from 'next/navigation';

const LINKS = [
  { href: '/trainers', label: 'Trainers' },
  { href: '/library', label: 'My Library' },
  { href: '/messages', label: 'Messages' },
  { href: '/dashboard', label: 'Trainer Dashboard' },
];

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  const handleSignOut = async () => {
    await authClient.signOut();
    router.push('/');
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur-md">
      <div className="container-page flex h-16 items-center gap-8">
        <Logo />

        {/* Main Desktop Navigation */}
        <nav className="hidden items-center gap-1 md:flex" aria-label="Main">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                'rounded-lg px-3.5 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground',
                isActive(l.href) && 'text-foreground font-semibold',
              )}
            >
              {l.label}
              {isActive(l.href) && <span className="mx-auto mt-0.5 block h-0.5 w-4 rounded-full bg-primary" />}
            </Link>
          ))}
        </nav>

        {/* Right Actions */}
        <div className="ml-auto flex items-center gap-3">
          <ThemeToggle />
          {session?.user ? (
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground hidden sm:inline-block">
                {session.user.name || session.user.email}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={handleSignOut}
                className="text-xs font-semibold"
              >
                Sign out
              </Button>
            </div>
          ) : (
            <>
              <Button asChild variant="ghost" className="hidden sm:inline-flex text-muted-foreground hover:text-foreground">
                <Link href="/auth/sign-in">Log in</Link>
              </Button>
              <Button asChild className="font-semibold bg-primary text-primary-foreground hover:bg-primary/90">
                <Link href="/auth/sign-up">Join now</Link>
              </Button>
            </>
          )}

          {/* Mobile Sheet Menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden" aria-label="Open menu">
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72 bg-surface">
              <SheetHeader>
                <SheetTitle><Logo /></SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-1 px-4 mt-6" aria-label="Mobile">
                {LINKS.map((l) => (
                  <Link
                    key={l.href}
                    href={l.href}
                    className={cn(
                      'font-display rounded-lg px-3 py-3 text-2xl uppercase tracking-wide',
                      isActive(l.href) ? 'text-lime-ink' : 'text-foreground hover:text-lime-ink',
                    )}
                  >
                    {l.label}
                  </Link>
                ))}
              </nav>
              <div className="mt-auto grid gap-2 p-4 border-t border-border">
                <Button asChild variant="outline">
                  <Link href="/auth/sign-in">Log in</Link>
                </Button>
                <Button asChild>
                  <Link href="/auth/sign-up">Join now</Link>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
