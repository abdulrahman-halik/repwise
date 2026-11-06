// Mirrors the Drizzle schema in PLAN.md so swapping mock data for DB reads is mechanical.

export type Role = 'client' | 'trainer';
export type SlotStatus = 'open' | 'held' | 'booked';
export type PurchaseKind = 'program' | 'session';

export type Specialty =
  | 'Strength'
  | 'HIIT'
  | 'Yoga'
  | 'Mobility'
  | 'Hypertrophy'
  | 'Running'
  | 'Boxing'
  | 'Recovery';

export interface Profile {
  userId: string;
  role: Role;
  name: string;
  avatarUrl: string | null;
  headline: string | null;
  bio: string | null;
  specialties: Specialty[] | null;
  sessionPriceCents: number | null;
  /** UI-only: large portrait used on cards/profile hero. */
  coverUrl?: string | null;
  location?: string;
  yearsCoaching?: number;
}

export interface Program {
  id: string;
  trainerId: string;
  title: string;
  description: string;
  coverUrl: string | null;
  priceCents: number;
  published: boolean;
  createdAt: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  weeks: number;
}

export interface Lesson {
  id: string;
  programId: string;
  title: string;
  position: number;
  videoPath: string;
  durationMin: number;
}

export interface Slot {
  id: string;
  trainerId: string;
  startsAt: string;
  status: SlotStatus;
  clientId: string | null;
  heldUntil: string | null;
}

export interface Purchase {
  id: string;
  clientId: string;
  trainerId: string;
  kind: PurchaseKind;
  programId: string | null;
  slotId: string | null;
  amountCents: number;
  stripeSessionId: string;
  createdAt: string;
}

export interface Review {
  id: string;
  trainerId: string;
  clientId: string;
  rating: number;
  comment: string | null;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  authorId: string;
  text: string;
  sentAt: string;
  reactions?: { emoji: string; count: number }[];
  replyCount?: number;
}

export interface Conversation {
  id: string;
  memberIds: [string, string];
  messages: ChatMessage[];
}

