'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { BookOpen, LayoutDashboard, LogOut, Menu, Sparkles } from 'lucide-react';
import { Logo } from './Logo';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { authClient } from '@/lib/auth/client';

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const [role, setRole] = useState<'client' | 'trainer' | null>(null);

  const userId = session?.user?.id;

  useEffect(() => {
    if (!userId) {
      setRole(null);
      return;
    }
    fetch('/api/profile')
      .then((r) => r.json())
      .then((data) => {
        if (data?.role) setRole(data.role);
      })
      .catch(() => {});
  }, [userId]);

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  const handleSignOut = async () => {
    await authClient.signOut();
    setRole(null);
    router.push('/');
    router.refresh();
  };

  const userInitial = (
    session?.user?.name?.trim()?.[0] ||
    session?.user?.email?.[0] ||
    'U'
  ).toUpperCase();
  const userName = session?.user?.name || 'User';
  const userEmail = session?.user?.email || '';

  // Role-aware navigation links
  const navLinks = [
    { href: '/trainers', label: 'Trainers' },
    ...(role === 'trainer'
      ? [{ href: '/dashboard', label: 'Trainer Dashboard' }]
      : [{ href: '/library', label: 'My Library' }]),
    { href: '/messages', label: 'Messages' },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur-md">
      <div className="container-page flex h-16 items-center gap-8">
        <Logo />

        {/* Main Desktop Navigation */}
        <nav className="hidden items-center gap-1 md:flex" aria-label="Main">
          {navLinks.map((l) => (
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
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="relative flex size-9 shrink-0 items-center justify-center rounded-full bg-[#0284c7] text-white font-semibold text-sm shadow-sm transition hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-[#0284c7] focus:ring-offset-2 focus:ring-offset-background"
                  aria-label="User account menu"
                >
                  <span>{userInitial}</span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64 p-3 bg-surface border border-border shadow-2xl rounded-2xl">
                {/* Header with avatar, name, and email */}
                <div className="flex items-center gap-3 pb-2">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#0284c7] text-white font-semibold text-base shadow-sm">
                    <span>{userInitial}</span>
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="font-semibold text-foreground text-sm truncate leading-tight">
                      {userName}
                    </span>
                    <span className="text-xs text-muted-foreground truncate leading-tight mt-0.5">
                      {userEmail}
                    </span>
                  </div>
                </div>

                <DropdownMenuSeparator className="my-2 bg-border" />

                {/* Role-specific quick links */}
                {role === 'trainer' ? (
                  <DropdownMenuItem asChild className="flex cursor-pointer items-center gap-2.5 rounded-xl px-2.5 py-2 text-sm font-medium text-foreground hover:bg-surface-2 focus:bg-surface-2 transition-colors">
                    <Link href="/dashboard">
                      <LayoutDashboard className="size-4 shrink-0 text-muted-foreground" />
                      <span>Trainer Dashboard</span>
                    </Link>
                  </DropdownMenuItem>
                ) : (
                  <>
                    <DropdownMenuItem asChild className="flex cursor-pointer items-center gap-2.5 rounded-xl px-2.5 py-2 text-sm font-medium text-foreground hover:bg-surface-2 focus:bg-surface-2 transition-colors">
                      <Link href="/library">
                        <BookOpen className="size-4 shrink-0 text-muted-foreground" />
                        <span>My Library</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="flex cursor-pointer items-center gap-2.5 rounded-xl px-2.5 py-2 text-sm font-medium text-muted-foreground hover:bg-surface-2 focus:bg-surface-2 transition-colors">
                      <Link href="/onboarding">
                        <Sparkles className="size-4 shrink-0 text-lime-ink" />
                        <span>Become a Coach</span>
                      </Link>
                    </DropdownMenuItem>
                  </>
                )}

                <DropdownMenuSeparator className="my-2 bg-border" />

                {/* Sign Out item */}
                <DropdownMenuItem
                  onClick={handleSignOut}
                  className="flex cursor-pointer items-center gap-2.5 rounded-xl px-2.5 py-2 text-sm font-medium text-foreground hover:bg-surface-2 focus:bg-surface-2 transition-colors"
                >
                  <LogOut className="size-4 shrink-0 text-muted-foreground" />
                  <span>Sign Out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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
                {navLinks.map((l) => (
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
                {session?.user ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#0284c7] text-white font-semibold text-base shadow-sm">
                        <span>{userInitial}</span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-sm font-semibold text-foreground truncate">{userName}</div>
                        <div className="text-xs text-muted-foreground truncate">{userEmail}</div>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      className="w-full flex items-center justify-center gap-2"
                      onClick={handleSignOut}
                    >
                      <LogOut className="size-4" />
                      <span>Sign Out</span>
                    </Button>
                  </div>
                ) : (
                  <>
                    <Button asChild variant="outline">
                      <Link href="/auth/sign-in">Log in</Link>
                    </Button>
                    <Button asChild>
                      <Link href="/auth/sign-up">Join now</Link>
                    </Button>
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
