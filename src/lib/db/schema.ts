import {
  boolean,
  integer,
  pgTable,
  text,
  timestamp,
  unique,
  uuid,
} from 'drizzle-orm/pg-core';

export const profiles = pgTable('profiles', {
  userId: text('user_id').primaryKey(),
  role: text('role', { enum: ['client', 'trainer'] }).notNull().default('client'),
  name: text('name').notNull(),
  avatarUrl: text('avatar_url'),
  coverUrl: text('cover_url'),
  headline: text('headline'),
  bio: text('bio'),
  specialties: text('specialties').array(),
  sessionPriceCents: integer('session_price_cents'),
  location: text('location'),
  yearsCoaching: integer('years_coaching'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export const programs = pgTable('programs', {
  id: text('id').primaryKey(),
  trainerId: text('trainer_id')
    .notNull()
    .references(() => profiles.userId, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  description: text('description').notNull().default(''),
  coverUrl: text('cover_url'),
  priceCents: integer('price_cents').notNull().default(0),
  published: boolean('published').notNull().default(false),
  level: text('level').notNull().default('Beginner'),
  weeks: integer('weeks').notNull().default(4),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export const lessons = pgTable(
  'lessons',
  {
    id: text('id').primaryKey(),
    programId: text('program_id')
      .notNull()
      .references(() => programs.id, { onDelete: 'cascade' }),
    title: text('title').notNull(),
    position: integer('position').notNull(),
    videoPath: text('video_path').notNull().default(''),
    durationMin: integer('duration_min').notNull().default(10),
  },
  (t) => [unique('program_position_unique').on(t.programId, t.position)]
);

export const slots = pgTable('slots', {
  id: text('id').primaryKey(),
  trainerId: text('trainer_id')
    .notNull()
    .references(() => profiles.userId, { onDelete: 'cascade' }),
  startsAt: timestamp('starts_at', { withTimezone: true }).notNull(),
  status: text('status', { enum: ['open', 'held', 'booked'] })
    .notNull()
    .default('open'),
  clientId: text('client_id').references(() => profiles.userId, {
    onDelete: 'set null',
  }),
  heldUntil: timestamp('held_until', { withTimezone: true }),
});

export const purchases = pgTable('purchases', {
  id: text('id').primaryKey(),
  clientId: text('client_id')
    .notNull()
    .references(() => profiles.userId, { onDelete: 'cascade' }),
  trainerId: text('trainer_id')
    .notNull()
    .references(() => profiles.userId, { onDelete: 'cascade' }),
  kind: text('kind', { enum: ['program', 'session'] }).notNull(),
  programId: text('program_id').references(() => programs.id, {
    onDelete: 'set null',
  }),
  slotId: text('slot_id').references(() => slots.id, { onDelete: 'set null' }),
  amountCents: integer('amount_cents').notNull(),
  stripeSessionId: text('stripe_session_id').unique(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export const reviews = pgTable(
  'reviews',
  {
    id: text('id').primaryKey(),
    trainerId: text('trainer_id')
      .notNull()
      .references(() => profiles.userId, { onDelete: 'cascade' }),
    clientId: text('client_id')
      .notNull()
      .references(() => profiles.userId, { onDelete: 'cascade' }),
    rating: integer('rating').notNull(),
    comment: text('comment'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [unique('trainer_client_review_unique').on(t.trainerId, t.clientId)]
);

