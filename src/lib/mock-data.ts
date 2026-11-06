import type {
  Conversation,
  Lesson,
  Profile,
  Program,
  Purchase,
  Review,
  Slot,
  Specialty,
} from './types';

// Hardcoded demo data. Replace with Drizzle queries in Phase 1+.

export const SPECIALTIES: Specialty[] = [
  'Strength',
  'HIIT',
  'Yoga',
  'Mobility',
  'Hypertrophy',
  'Running',
  'Boxing',
  'Recovery',
];

export const trainers: Profile[] = [
  {
    userId: 't-maya',
    role: 'trainer',
    name: 'Maya Torres',
    avatarUrl: '/images/hero.png',
    coverUrl: '/images/hero.png',
    headline: 'Barbell strength, zero fluff',
    bio: 'Former collegiate rower turned strength coach. I help busy people get genuinely strong with three focused sessions a week — compound lifts, smart progressions, and recovery that actually fits your life.',
    specialties: ['Strength', 'Mobility'],
    sessionPriceCents: 8500,
    location: 'Austin, TX',
    yearsCoaching: 9,
  },
  {
    userId: 't-dante',
    role: 'trainer',
    name: 'Dante Okafor',
    avatarUrl: null,
    coverUrl: null,
    headline: 'Conditioning that hits different',
    bio: 'Ex-sprinter and HIIT specialist. Short, brutal, effective sessions built around intervals and athletic movement. Expect to sweat, expect to improve every week.',
    specialties: ['HIIT', 'Running'],
    sessionPriceCents: 7000,
    location: 'Atlanta, GA',
    yearsCoaching: 7,
  },
  {
    userId: 't-lena',
    role: 'trainer',
    name: 'Lena Kowalski',
    avatarUrl: null,
    coverUrl: null,
    headline: 'Mobility & yoga for lifters',
    bio: 'I teach strong people to move well. Yoga-based mobility flows designed to unlock hips, shoulders and spines so your lifting stays pain-free for decades.',
    specialties: ['Yoga', 'Mobility', 'Recovery'],
    sessionPriceCents: 6000,
    location: 'Portland, OR',
    yearsCoaching: 11,
  },
  {
    userId: 't-marcus',
    role: 'trainer',
    name: 'Marcus Reid',
    avatarUrl: null,
    coverUrl: null,
    headline: 'Hypertrophy, programmed properly',
    bio: 'Natural bodybuilder and evidence-based coach. Volume, intensity and food dialled in so you build muscle without guesswork.',
    specialties: ['Hypertrophy', 'Strength'],
    sessionPriceCents: 9500,
    location: 'Miami, FL',
    yearsCoaching: 12,
  },
  {
    userId: 't-priya',
    role: 'trainer',
    name: 'Priya Nair',
    avatarUrl: null,
    coverUrl: null,
    headline: 'From first 5K to marathon',
    bio: 'Run coach and certified physio. Structured plans, strength for runners and the patience to get you to the start line healthy.',
    specialties: ['Running', 'Recovery'],
    sessionPriceCents: 5500,
    location: 'Denver, CO',
    yearsCoaching: 6,
  },
];

export const clients: Profile[] = [
  { userId: 'c-alex', role: 'client', name: 'Alex Rivera', avatarUrl: null, headline: null, bio: null, specialties: null, sessionPriceCents: null },
  { userId: 'c-jordan', role: 'client', name: 'Jordan Lee', avatarUrl: null, headline: null, bio: null, specialties: null, sessionPriceCents: null },
  { userId: 'c-sam', role: 'client', name: 'Sam Patel', avatarUrl: null, headline: null, bio: null, specialties: null, sessionPriceCents: null },
  { userId: 'c-nora', role: 'client', name: 'Nora Kim', avatarUrl: null, headline: null, bio: null, specialties: null, sessionPriceCents: null },
  { userId: 'c-theo', role: 'client', name: 'Theo Grant', avatarUrl: null, headline: null, bio: null, specialties: null, sessionPriceCents: null },
  { userId: 'c-ivy', role: 'client', name: 'Ivy Brooks', avatarUrl: null, headline: null, bio: null, specialties: null, sessionPriceCents: null },
];

/** The fake signed-in client used on client pages. */
export const CURRENT_CLIENT_ID = 'c-alex';
/** The fake signed-in trainer used on dashboard pages. */
export const CURRENT_TRAINER_ID = 't-maya';

export const programs: Program[] = [
  { id: 'p-strong-base', trainerId: 't-maya', title: 'Strong Base: 8-Week Barbell', description: 'Learn the squat, bench, deadlift and press with clean technique, then build real strength with a simple linear progression.', coverUrl: '/images/hero.png', priceCents: 4900, published: true, createdAt: '2026-08-02T10:00:00Z', level: 'Beginner', weeks: 8 },
  { id: 'p-mobility-reset', trainerId: 't-maya', title: 'Lifter Mobility Reset', description: 'Ten-minute daily flows to open hips and shoulders so your lifts feel smooth and pain-free.', coverUrl: null, priceCents: 2900, published: true, createdAt: '2026-09-14T10:00:00Z', level: 'Beginner', weeks: 4 },
  { id: 'p-deadlift-draft', trainerId: 't-maya', title: 'Deadlift Specialisation', description: 'Six weeks to a bigger pull. Work in progress.', coverUrl: null, priceCents: 3900, published: false, createdAt: '2026-10-28T10:00:00Z', level: 'Advanced', weeks: 6 },
  { id: 'p-engine', trainerId: 't-dante', title: 'Engine: 30-Day HIIT', description: 'Thirty days of interval sessions that build a big aerobic engine in under 30 minutes a day.', coverUrl: null, priceCents: 3900, published: true, createdAt: '2026-07-20T10:00:00Z', level: 'Intermediate', weeks: 4 },
  { id: 'p-sprint', trainerId: 't-dante', title: 'Sprint Mechanics', description: 'Drills, accelerations and plyometrics to run faster and move like an athlete.', coverUrl: null, priceCents: 4500, published: true, createdAt: '2026-08-30T10:00:00Z', level: 'Advanced', weeks: 6 },
  { id: 'p-flow', trainerId: 't-lena', title: 'Flow for Lifters', description: 'Yoga sequences designed around the positions strength athletes struggle with most.', coverUrl: null, priceCents: 3500, published: true, createdAt: '2026-06-11T10:00:00Z', level: 'Beginner', weeks: 6 },
  { id: 'p-hypertrophy', trainerId: 't-marcus', title: 'Hypertrophy Blueprint', description: 'A 12-week upper/lower split with progressive volume, exercise demos and nutrition guidance.', coverUrl: null, priceCents: 6900, published: true, createdAt: '2026-05-03T10:00:00Z', level: 'Intermediate', weeks: 12 },
  { id: 'p-first-5k', trainerId: 't-priya', title: 'Couch to First 5K', description: 'Run/walk progressions, strength for runners and race-day prep for your first 5K.', coverUrl: null, priceCents: 2500, published: true, createdAt: '2026-09-01T10:00:00Z', level: 'Beginner', weeks: 9 },
];

const lessonTitles: Record<string, [string, number][]> = {
  'p-strong-base': [['Welcome & how the program works', 6], ['The squat: setup and depth', 14], ['Bench press fundamentals', 12], ['Deadlift: hinge, brace, pull', 16], ['Overhead press & programming week 1', 11]],
  'p-mobility-reset': [['Morning hip opener', 10], ['Shoulder CARs', 9], ['Thoracic spine flow', 10]],
  'p-deadlift-draft': [['Intro to the block', 5]],
  'p-engine': [['Intervals 101', 8], ['Day 1: 20-min EMOM', 22], ['Day 2: Tabata ladder', 18], ['Day 3: Long intervals', 26]],
  'p-sprint': [['Why mechanics matter', 7], ['A-skips & wall drills', 15], ['Acceleration work', 17]],
  'p-flow': [['Breath & setup', 8], ['Hip flow', 20], ['Shoulder flow', 20], ['Full-body cooldown', 15]],
  'p-hypertrophy': [['Training for size: principles', 12], ['Upper A walkthrough', 19], ['Lower A walkthrough', 21], ['Eating for growth', 14]],
  'p-first-5k': [['Your first run/walk', 9], ['Strength for runners', 16], ['Race-day plan', 10]],
};

export const lessons: Lesson[] = Object.entries(lessonTitles).flatMap(([programId, list]) =>
  list.map(([title, durationMin], i) => ({
    id: `${programId}-l${i + 1}`,
    programId,
    title,
    position: i + 1,
    videoPath: `/lessons/${programId}/${i + 1}.mp4`,
    durationMin,
  })),
);

function slot(id: string, trainerId: string, startsAt: string, status: Slot['status'] = 'open', clientId: string | null = null): Slot {
  return { id, trainerId, startsAt, status, clientId, heldUntil: null };
}

export const slots: Slot[] = [
  slot('s-101', 't-maya', '2026-11-09T14:00:00Z', 'booked', 'c-alex'),
  slot('s-102', 't-maya', '2026-11-09T16:00:00Z', 'booked', 'c-jordan'),
  slot('s-103', 't-maya', '2026-11-10T13:00:00Z'),
  slot('s-104', 't-maya', '2026-11-11T15:00:00Z', 'held', 'c-sam'),
  slot('s-105', 't-maya', '2026-11-12T14:00:00Z'),
  slot('s-106', 't-maya', '2026-11-13T17:00:00Z'),
  slot('s-107', 't-maya', '2026-11-14T10:00:00Z', 'booked', 'c-nora'),
  slot('s-201', 't-dante', '2026-11-09T12:00:00Z'),
  slot('s-202', 't-dante', '2026-11-10T18:00:00Z'),
  slot('s-203', 't-dante', '2026-11-12T12:00:00Z'),
  slot('s-301', 't-lena', '2026-11-11T09:00:00Z', 'booked', 'c-alex'),
  slot('s-302', 't-lena', '2026-11-13T09:00:00Z'),
  slot('s-401', 't-marcus', '2026-11-10T20:00:00Z'),
  slot('s-402', 't-marcus', '2026-11-15T15:00:00Z'),
  slot('s-501', 't-priya', '2026-11-12T07:00:00Z'),
];

export const purchases: Purchase[] = [
  { id: 'pu-1', clientId: 'c-alex', trainerId: 't-maya', kind: 'program', programId: 'p-strong-base', slotId: null, amountCents: 4900, stripeSessionId: 'cs_1', createdAt: '2026-10-02T09:12:00Z' },
  { id: 'pu-2', clientId: 'c-alex', trainerId: 't-maya', kind: 'session', programId: null, slotId: 's-101', amountCents: 8500, stripeSessionId: 'cs_2', createdAt: '2026-11-05T18:40:00Z' },
  { id: 'pu-3', clientId: 'c-alex', trainerId: 't-lena', kind: 'session', programId: null, slotId: 's-301', amountCents: 6000, stripeSessionId: 'cs_3', createdAt: '2026-11-04T11:02:00Z' },
  { id: 'pu-4', clientId: 'c-alex', trainerId: 't-dante', kind: 'program', programId: 'p-engine', slotId: null, amountCents: 3900, stripeSessionId: 'cs_4', createdAt: '2026-09-20T15:30:00Z' },
  { id: 'pu-5', clientId: 'c-jordan', trainerId: 't-maya', kind: 'session', programId: null, slotId: 's-102', amountCents: 8500, stripeSessionId: 'cs_5', createdAt: '2026-11-06T13:55:00Z' },
  { id: 'pu-6', clientId: 'c-jordan', trainerId: 't-maya', kind: 'program', programId: 'p-strong-base', slotId: null, amountCents: 4900, stripeSessionId: 'cs_6', createdAt: '2026-11-06T12:21:00Z' },
  { id: 'pu-7', clientId: 'c-sam', trainerId: 't-maya', kind: 'program', programId: 'p-mobility-reset', slotId: null, amountCents: 2900, stripeSessionId: 'cs_7', createdAt: '2026-11-05T08:10:00Z' },
  { id: 'pu-8', clientId: 'c-nora', trainerId: 't-maya', kind: 'session', programId: null, slotId: 's-107', amountCents: 8500, stripeSessionId: 'cs_8', createdAt: '2026-11-04T19:47:00Z' },
  { id: 'pu-9', clientId: 'c-theo', trainerId: 't-maya', kind: 'program', programId: 'p-strong-base', slotId: null, amountCents: 4900, stripeSessionId: 'cs_9', createdAt: '2026-10-29T10:05:00Z' },
  { id: 'pu-10', clientId: 'c-ivy', trainerId: 't-maya', kind: 'program', programId: 'p-mobility-reset', slotId: null, amountCents: 2900, stripeSessionId: 'cs_10', createdAt: '2026-10-21T16:33:00Z' },
  { id: 'pu-11', clientId: 'c-ivy', trainerId: 't-maya', kind: 'program', programId: 'p-strong-base', slotId: null, amountCents: 4900, stripeSessionId: 'cs_11', createdAt: '2026-10-12T07:48:00Z' },
];

export const reviews: Review[] = [
  { id: 'r-1', trainerId: 't-maya', clientId: 'c-jordan', rating: 5, comment: 'Added 40 lb to my deadlift in eight weeks and my back has never felt better. Maya explains the why behind everything.', createdAt: '2026-10-30T10:00:00Z' },
  { id: 'r-2', trainerId: 't-maya', clientId: 'c-theo', rating: 5, comment: 'The Strong Base program is the first plan I have actually finished. Clear videos, simple progressions.', createdAt: '2026-10-18T10:00:00Z' },
  { id: 'r-3', trainerId: 't-maya', clientId: 'c-ivy', rating: 4, comment: 'Great coaching on the 1:1 calls. Would love a few more mobility follow-alongs.', createdAt: '2026-10-02T10:00:00Z' },
  { id: 'r-4', trainerId: 't-dante', clientId: 'c-alex', rating: 5, comment: 'Engine is no joke. My 5K time dropped by two minutes.', createdAt: '2026-10-15T10:00:00Z' },
  { id: 'r-5', trainerId: 't-dante', clientId: 'c-sam', rating: 4, comment: 'Intense but very well structured.', createdAt: '2026-09-28T10:00:00Z' },
  { id: 'r-6', trainerId: 't-lena', clientId: 'c-nora', rating: 5, comment: 'My hips finally open up in the bottom of a squat. Lena is a gem.', createdAt: '2026-10-08T10:00:00Z' },
  { id: 'r-7', trainerId: 't-marcus', clientId: 'c-theo', rating: 5, comment: 'Most detailed hypertrophy program I have bought.', createdAt: '2026-09-11T10:00:00Z' },
  { id: 'r-8', trainerId: 't-marcus', clientId: 'c-jordan', rating: 4, comment: null, createdAt: '2026-08-21T10:00:00Z' },
];

export const conversations: Conversation[] = [
  {
    id: 'ch-maya',
    memberIds: ['c-alex', 't-maya'],
    messages: [
      { id: 'm1', authorId: 'c-alex', text: 'Hey Maya! Finished week 3 of Strong Base. Squat felt heavy today — should I repeat the week?', sentAt: '2026-11-06T09:02:00Z' },
      { id: 'm2', authorId: 't-maya', text: 'Nice work getting through it! If you missed reps on the last set, repeat the weight once. If you hit them all, move up 5 lb.', sentAt: '2026-11-06T09:15:00Z', reactions: [{ emoji: '🔥', count: 1 }] },
      { id: 'm3', authorId: 'c-alex', text: 'Hit all of them, just slow. Moving up 💪', sentAt: '2026-11-06T09:16:00Z' },
      { id: 'm4', authorId: 't-maya', text: 'Perfect. Send me a side-angle video before Monday’s call and we’ll look at depth together.', sentAt: '2026-11-06T09:20:00Z', replyCount: 2, reactions: [{ emoji: '👍', count: 1 }] },
    ],
  },
  {
    id: 'ch-lena',
    memberIds: ['c-alex', 't-lena'],
    messages: [
      { id: 'm5', authorId: 't-lena', text: 'Looking forward to our session on Wednesday! Have a yoga mat and a strap ready.', sentAt: '2026-11-05T17:40:00Z' },
      { id: 'm6', authorId: 'c-alex', text: 'Will do, thanks!', sentAt: '2026-11-05T18:02:00Z' },
    ],
  },
  {
    id: 'ch-dante',
    memberIds: ['c-alex', 't-dante'],
    messages: [
      { id: 'm7', authorId: 'c-alex', text: 'Is Engine OK to do alongside a strength program?', sentAt: '2026-10-20T08:00:00Z' },
      { id: 'm8', authorId: 't-dante', text: 'Yes — do it on your non-lifting days and drop to 3 sessions/week.', sentAt: '2026-10-20T10:31:00Z' },
    ],
  },
];

