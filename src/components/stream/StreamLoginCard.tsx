'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Dumbbell, Lock, ShieldCheck, Sparkles, UserCheck, Users } from 'lucide-react';
import { UserAvatar } from '@/components/site/UserAvatar';
import { Button } from '@/components/ui/button';
import { useStreamContext } from '@/context/StreamContext';
import { authClient } from '@/lib/auth/client';

const QUICK_PROFILES: {
  userId: string;
  name: string;
  role: 'client' | 'trainer';
  subtitle: string;
}[] = [
  {
    userId: 'c-alex',
    name: 'Alex Rivera',
    role: 'client',
    subtitle: 'Athlete · Booked with Maya Torres',
  },
  {
    userId: 't-maya',
    name: 'Maya Torres',
    role: 'trainer',
    subtitle: 'Strength Coach · Austin, TX',
  },
  {
    userId: 't-dante',
    name: 'Dante Okafor',
    role: 'trainer',
    subtitle: 'HIIT & Conditioning Coach',
  },
  {
    userId: 't-lena',
    name: 'Lena Kowalski',
    role: 'trainer',
    subtitle: 'Mobility & Yoga Coach',
  },
  {
    userId: 'c-jordan',
    name: 'Jordan Lee',
    role: 'client',
    subtitle: 'Athlete · Booked 1:1 Member',
  },
];

export function StreamLoginCard({
  title = 'Connect to Repwise Live',
  subtitle = 'Sign in to Stream Chat & Video for this tab. Credentials stay in per-tab memory so you can open two tabs as Coach and Athlete simultaneously.',
}: {
  title?: string;
  subtitle?: string;
}) {
  const { loginWithUser, isConnecting, connectionError } = useStreamContext();
  const { data: session } = authClient.useSession();

  const [userId, setUserId] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<'client' | 'trainer'>('client');
  const [localError, setLocalError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    const trimmedId = userId.trim();
    if (!trimmedId) {
      setLocalError('Please enter a User ID or choose a profile below.');
      return;
    }
    try {
      await loginWithUser({
        userId: trimmedId,
        name: name.trim() || trimmedId,
        role,
      });
    } catch {
      // Handled via connectionError in context
    }
  };

  const handleQuickConnect = async (profile: {
    userId: string;
    name: string;
    role: 'client' | 'trainer';
  }) => {
    setLocalError(null);
    setUserId(profile.userId);
    setName(profile.name);
    setRole(profile.role);
    try {
      await loginWithUser({
        userId: profile.userId,
        name: profile.name,
        role: profile.role,
      });
    } catch {
      // Handled via connectionError in context
    }
  };

  const handleConnectNeonSession = async () => {
    if (!session?.user) return;
    setLocalError(null);
    try {
      await loginWithUser({
        userId: session.user.id,
        name: session.user.name || session.user.email?.split('@')[0] || 'Athlete',
        image: session.user.image || undefined,
        role: 'client',
      });
    } catch {
      // Handled via connectionError in context
    }
  };

  return (
    <div className="container-page py-10 md:py-16">
      <div className="mx-auto max-w-3xl overflow-hidden rounded-3xl border border-border bg-surface shadow-2xl">
        <div className="grid grid-cols-1 md:grid-cols-[1.1fr_0.9fr]">
          {/* Left: Login Form */}
          <div className="p-6 sm:p-8">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-lime-ink">
              <ShieldCheck className="size-3.5" /> Server-Minted Token Auth
            </div>

            <h1 className="font-display mt-4 text-3xl uppercase sm:text-4xl">{title}</h1>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground sm:text-sm">
              {subtitle}
            </p>

            {session?.user && (
              <div className="mt-5 rounded-2xl border border-primary/30 bg-primary/5 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-lime-ink">
                      Neon Auth Account Detected
                    </p>
                    <p className="truncate text-sm font-semibold text-foreground">
                      {session.user.name || session.user.email}
                    </p>
                  </div>
                  <Button
                    type="button"
                    size="sm"
                    disabled={isConnecting}
                    onClick={handleConnectNeonSession}
                    className="shrink-0 font-semibold"
                  >
                    Continue as {session.user.name?.split(' ')[0] || 'Me'}
                    <ArrowRight className="size-3.5" />
                  </Button>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-5 space-y-4">
              <div>
                <label
                  htmlFor="stream-user-id"
                  className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                >
                  User ID
                </label>
                <input
                  id="stream-user-id"
                  type="text"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  placeholder="e.g. c-alex or t-maya"
                  className="mt-1.5 h-10 w-full rounded-xl border border-border bg-surface-2 px-3.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
                />
              </div>

              <div>
                <label
                  htmlFor="stream-user-name"
                  className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                >
                  Display Name
                </label>
                <input
                  id="stream-user-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Alex Rivera"
                  className="mt-1.5 h-10 w-full rounded-xl border border-border bg-surface-2 px-3.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
                />
              </div>

              <div>
                <span className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Account Role
                </span>
                <div className="mt-1.5 grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setRole('client')}
                    className={`flex items-center justify-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-semibold transition-colors ${
                      role === 'client'
                        ? 'border-primary bg-primary/15 text-lime-ink'
                        : 'border-border bg-surface-2 text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <Users className="size-3.5" /> Athlete (Client)
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('trainer')}
                    className={`flex items-center justify-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-semibold transition-colors ${
                      role === 'trainer'
                        ? 'border-primary bg-primary/15 text-lime-ink'
                        : 'border-border bg-surface-2 text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <Dumbbell className="size-3.5" /> Coach (Trainer)
                  </button>
                </div>
              </div>

              {(localError || connectionError) && (
                <div className="rounded-xl border border-destructive/40 bg-destructive/10 px-3.5 py-2.5 text-xs text-destructive">
                  {localError || connectionError}
                </div>
              )}

              <Button
                type="submit"
                size="lg"
                disabled={isConnecting}
                className="w-full font-semibold"
              >
                <Lock className="size-4" />
                {isConnecting ? 'Connecting to Stream...' : 'Sign In & Connect'}
              </Button>
            </form>

            {!session?.user && (
              <p className="mt-4 text-center text-xs text-muted-foreground">
                Have a full Repwise account?{' '}
                <Link href="/auth/sign-in" className="font-semibold text-lime-ink hover:underline">
                  Sign in with Neon Auth
                </Link>
              </p>
            )}
          </div>

          {/* Right: Quick Multi-Tab Presets */}
          <div className="flex flex-col justify-between border-t border-border bg-surface-2/50 p-6 sm:p-8 md:border-l md:border-t-0">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-lime-ink">
                <Sparkles className="size-3.5" /> Quick Roster Sign-In
              </div>
              <p className="mt-1.5 text-xs text-muted-foreground">
                Pick a seeded Repwise profile to connect immediately in this tab. Open a second tab
                and pick another profile to test real-time two-way messaging and video calls.
              </p>

              <div className="mt-4 space-y-2">
                {QUICK_PROFILES.map((profile) => (
                  <button
                    key={profile.userId}
                    type="button"
                    disabled={isConnecting}
                    onClick={() => handleQuickConnect(profile)}
                    data-testid={`quick-login-${profile.userId}`}
                    className="flex w-full items-center justify-between gap-3 rounded-2xl border border-border bg-surface p-3 text-left transition-all hover:border-primary/60 hover:bg-surface-2/80 disabled:opacity-50"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <UserAvatar name={profile.name} className="size-9 shrink-0" />
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="truncate text-sm font-semibold text-foreground">
                            {profile.name}
                          </span>
                          <span className="rounded-full border border-border bg-surface-2 px-2 py-0.5 text-[10px] font-medium uppercase text-muted-foreground">
                            {profile.role === 'trainer' ? 'Coach' : 'Athlete'}
                          </span>
                        </div>
                        <p className="truncate text-[11px] text-muted-foreground">
                          {profile.subtitle}
                        </p>
                      </div>
                    </div>
                    <UserCheck className="size-4 shrink-0 text-lime-ink" />
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-6 rounded-xl border border-border bg-surface/80 p-3 text-[11px] text-muted-foreground">
              <strong className="text-foreground">Multi-Tab Ready:</strong> Tab state is isolated in
              React memory (`StreamContext`). Signing in as <code>c-alex</code> in Tab 1 and{' '}
              <code>t-maya</code> in Tab 2 connects two live Stream WebSocket sessions.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

