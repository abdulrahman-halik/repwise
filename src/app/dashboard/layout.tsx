'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Calendar,
  ChevronRight,
  Dumbbell,
  ExternalLink,
  Flame,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquare,
  Users,
} from 'lucide-react';
import { Logo } from '@/components/site/Logo';
import { UserAvatar } from '@/components/site/UserAvatar';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
  { href: '/dashboard/programs', label: 'Programs', icon: Dumbbell },
  { href: '/dashboard/slots', label: 'Slots & Calendar', icon: Calendar },
  { href: '/dashboard/clients', label: 'Clients', icon: Users },
  { href: '/messages', label: 'Messages', icon: MessageSquare },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/dashboard') return pathname === '/dashboard';
    return pathname.startsWith(href);
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Desktop Fixed Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-border bg-surface lg:flex">
        {/* Brand */}
        <div className="flex h-16 items-center justify-between border-b border-border px-6">
          <Logo />
          <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-lime-ink">
            Coach
          </span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1.5 p-4" aria-label="Dashboard Sidebar">
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
            const active = isActive(href);
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  'flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors',
                  active
                    ? 'bg-primary text-primary-foreground font-semibold shadow-[0_0_15px_rgba(198,255,61,0.2)]'
                    : 'text-muted-foreground hover:bg-surface-2 hover:text-foreground',
                )}
              >
                <Icon className={cn('size-4', active ? 'text-primary-foreground' : 'text-lime-ink')} />
                <span>{label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Profile Card & Shortcuts */}
        <div className="border-t border-border p-4">
          <Link
            href="/trainers/t-maya"
            target="_blank"
            className="mb-3 flex items-center justify-between rounded-xl border border-border bg-surface-2/60 px-3 py-2 text-xs text-muted-foreground hover:text-foreground"
          >
            <span>View Public Profile</span>
            <ExternalLink className="size-3.5 text-lime-ink" />
          </Link>

          <div className="flex items-center gap-3 rounded-2xl bg-surface-2 p-3">
            <UserAvatar name="Maya Torres" className="size-10" />
            <div className="flex-1 min-w-0">
              <p className="truncate text-sm font-semibold text-foreground">Maya Torres</p>
              <p className="truncate text-xs text-muted-foreground">maya@repwise.demo</p>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col lg:pl-64">
        {/* Mobile Header */}
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-border bg-background/80 px-4 backdrop-blur-md lg:hidden">
          <Logo />
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Open menu">
                  <Menu className="size-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64 bg-surface p-0">
                <div className="flex h-16 items-center justify-between border-b border-border px-6">
                  <Logo />
                  <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-lime-ink">
                    Coach
                  </span>
                </div>
                <nav className="space-y-1 p-4">
                  {NAV_ITEMS.map(({ href, label, icon: Icon }) => (
                    <Link
                      key={href}
                      href={href}
                      className={cn(
                        'flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors',
                        isActive(href)
                          ? 'bg-primary text-primary-foreground font-semibold'
                          : 'text-muted-foreground hover:bg-surface-2 hover:text-foreground',
                      )}
                    >
                      <Icon className="size-4" />
                      <span>{label}</span>
                    </Link>
                  ))}
                  <Link
                    href="/"
                    className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-muted-foreground hover:bg-surface-2 hover:text-foreground"
                  >
                    <LogOut className="size-4" />
                    <span>Back to Site</span>
                  </Link>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </header>

        {/* Page Body */}
        <main className="flex-1 p-6 md:p-10">{children}</main>
      </div>
    </div>
  );
}

