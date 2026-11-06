'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';

export function NewsletterForm() {
  const [subscribed, setSubscribed] = useState(false);
  const [email, setEmail] = useState('');

  if (subscribed) {
    return (
      <div className="flex items-center gap-2 rounded-xl border border-primary/40 bg-primary/10 px-4 py-3 text-sm font-medium text-foreground">
        <Check className="size-4 text-lime-ink" /> You&apos;re in. Welcome to the Repwise circle!
      </div>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (email.trim()) setSubscribed(true);
      }}
      className="flex w-full max-w-md flex-col gap-3 sm:flex-row"
    >
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Your email address"
        className="h-12 flex-1 rounded-xl border border-border bg-surface px-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
      />
      <Button type="submit" size="lg" className="h-12 font-semibold">
        Subscribe
      </Button>
    </form>
  );
}

