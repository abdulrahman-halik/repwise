'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight, Lock, Mail, User } from 'lucide-react';
import { Logo } from '@/components/site/Logo';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function SignUpPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Account created! Proceed to onboarding to select your role.');
    router.push('/onboarding');
  };

  return (
    <div className="container-page flex min-h-[calc(100vh-10rem)] items-center justify-center py-12">
      <div className="w-full max-w-md rounded-3xl border border-border bg-surface p-8 shadow-2xl">
        <div className="text-center">
          <div className="mx-auto flex justify-center">
            <Logo />
          </div>
          <h1 className="font-display mt-4 text-3xl uppercase">Create Account</h1>
          <p className="mt-1 text-xs text-muted-foreground">
            Join Repwise to connect with coaches or start training athletes.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Full Name
            </label>
            <div className="relative mt-1.5">
              <User className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Alex Rivera"
                className="h-11 w-full rounded-xl border border-border bg-surface-2 pl-10 pr-4 text-sm text-foreground focus:border-primary focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Email Address
            </label>
            <div className="relative mt-1.5">
              <Mail className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="alex@example.com"
                className="h-11 w-full rounded-xl border border-border bg-surface-2 pl-10 pr-4 text-sm text-foreground focus:border-primary focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Password
            </label>
            <div className="relative mt-1.5">
              <Lock className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="h-11 w-full rounded-xl border border-border bg-surface-2 pl-10 pr-4 text-sm text-foreground focus:border-primary focus:outline-none"
              />
            </div>
          </div>

          <Button type="submit" size="lg" className="mt-2 w-full font-semibold">
            Create Account <ArrowRight className="size-4" />
          </Button>

          <p className="mt-6 text-center text-xs text-muted-foreground">
            Already have an account?{' '}
            <Link href="/auth/sign-in" className="text-lime-ink font-semibold hover:underline">
              Log in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

