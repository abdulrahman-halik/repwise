'use client';

import { useEffect, useState } from 'react';

const FORMATS = {
  full: { weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' },
  date: { weekday: 'short', month: 'short', day: 'numeric' },
  time: { hour: 'numeric', minute: '2-digit' },
  short: { month: 'short', day: 'numeric' },
} satisfies Record<string, Intl.DateTimeFormatOptions>;

/** Renders an ISO timestamp in the viewer's local time zone (UTC on the server). */
export function LocalTime({ iso, format = 'full' }: { iso: string; format?: keyof typeof FORMATS }) {
  const [tz, setTz] = useState<string>('UTC');
  useEffect(() => setTz(Intl.DateTimeFormat().resolvedOptions().timeZone), []);
  const text = new Intl.DateTimeFormat('en-US', { ...FORMATS[format], timeZone: tz }).format(new Date(iso));
  return (
    <time dateTime={iso} suppressHydrationWarning>
      {text}
    </time>
  );
}

const NOW = new Date('2026-11-06T15:00:00Z').getTime();

/** "2h ago" style label, relative to the demo clock. */
export function TimeAgo({ iso }: { iso: string }) {
  const mins = Math.max(1, Math.round((NOW - new Date(iso).getTime()) / 60000));
  const text = mins < 60 ? `${mins}m ago` : mins < 1440 ? `${Math.round(mins / 60)}h ago` : `${Math.round(mins / 1440)}d ago`;
  return <time dateTime={iso}>{text}</time>;
}

