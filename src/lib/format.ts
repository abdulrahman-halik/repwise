export function formatPrice(cents: number) {
  const dollars = cents / 100;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: Number.isInteger(dollars) ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(dollars);
}

export function initials(name: string) {
  return name
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

export function totalMinutes(items: { durationMin: number }[]) {
  const mins = items.reduce((s, l) => s + l.durationMin, 0);
  return mins >= 60 ? `${Math.floor(mins / 60)}h ${mins % 60}m` : `${mins}m`;
}

