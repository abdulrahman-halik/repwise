import {
  clients,
  conversations,
  CURRENT_CLIENT_ID,
  lessons,
  programs,
  purchases,
  reviews,
  slots,
  trainers,
} from './mock-data';
import type { Profile, Specialty } from './types';

// Mock "queries". Each maps to a future Drizzle read with the same shape.

const allProfiles = [...trainers, ...clients];

export const getProfile = (userId: string) => allProfiles.find((p) => p.userId === userId);
export const getTrainer = (id: string) => trainers.find((t) => t.userId === id);

export function getTrainerRating(trainerId: string) {
  const list = reviews.filter((r) => r.trainerId === trainerId);
  const avg = list.length ? list.reduce((s, r) => s + r.rating, 0) / list.length : 0;
  return { avg, count: list.length };
}

export function listTrainers(specialty?: string) {
  return trainers.filter(
    (t) => !specialty || t.specialties?.some((s) => s.toLowerCase() === specialty.toLowerCase()),
  );
}

export const featuredTrainers = () => trainers.slice(0, 4);

export const getProgram = (id: string) => programs.find((p) => p.id === id);
export const publishedProgramsByTrainer = (trainerId: string) =>
  programs.filter((p) => p.trainerId === trainerId && p.published);
export const programsByTrainer = (trainerId: string) => programs.filter((p) => p.trainerId === trainerId);
export const allPublishedPrograms = () => programs.filter((p) => p.published);

export const lessonsForProgram = (programId: string) =>
  lessons.filter((l) => l.programId === programId).sort((a, b) => a.position - b.position);

/** Open = open, or held with an expired hold; future only. */
export function openSlotsForTrainer(trainerId: string) {
  return slots
    .filter((s) => s.trainerId === trainerId && s.status === 'open')
    .sort((a, b) => a.startsAt.localeCompare(b.startsAt));
}
export const slotsForTrainer = (trainerId: string) =>
  slots.filter((s) => s.trainerId === trainerId).sort((a, b) => a.startsAt.localeCompare(b.startsAt));
export const getSlot = (id: string) => slots.find((s) => s.id === id);

export const reviewsForTrainer = (trainerId: string) =>
  reviews
    .filter((r) => r.trainerId === trainerId)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .map((r) => ({ ...r, client: getProfile(r.clientId) }));

export function hasPurchasedProgram(clientId: string, programId: string) {
  return purchases.some((p) => p.clientId === clientId && p.kind === 'program' && p.programId === programId);
}

export function canReview(clientId: string, trainerId: string) {
  return purchases.some((p) => p.clientId === clientId && p.trainerId === trainerId);
}

export function libraryFor(clientId: string = CURRENT_CLIENT_ID) {
  const mine = purchases.filter((p) => p.clientId === clientId);
  const ownedPrograms = mine
    .filter((p) => p.kind === 'program' && p.programId)
    .map((p) => {
      const program = getProgram(p.programId!)!;
      return { program, trainer: getTrainer(program.trainerId)!, lessonCount: lessonsForProgram(program.id).length };
    });
  const sessions = slots
    .filter((s) => s.clientId === clientId && s.status === 'booked')
    .sort((a, b) => a.startsAt.localeCompare(b.startsAt))
    .map((slot) => ({ slot, trainer: getTrainer(slot.trainerId)! }));
  return { ownedPrograms, sessions };
}

export function trainerSales(trainerId: string) {
  return purchases
    .filter((p) => p.trainerId === trainerId)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .map((p) => ({
      ...p,
      client: getProfile(p.clientId)!,
      program: p.programId ? getProgram(p.programId) : undefined,
      slot: p.slotId ? getSlot(p.slotId) : undefined,
    }));
}

export function trainerOverview(trainerId: string) {
  const sales = trainerSales(trainerId);
  const earningsCents = sales.reduce((s, p) => s + p.amountCents, 0);
  const upcoming = slotsForTrainer(trainerId)
    .filter((s) => s.status === 'booked')
    .map((slot) => ({ slot, client: getProfile(slot.clientId!)! }));
  return { sales, earningsCents, salesCount: sales.length, upcoming };
}

export function trainerClients(trainerId: string) {
  const byClient = new Map<string, { client: Profile; items: string[]; totalCents: number; last: string }>();
  for (const sale of trainerSales(trainerId)) {
    const entry = byClient.get(sale.clientId) ?? { client: sale.client, items: [], totalCents: 0, last: sale.createdAt };
    entry.items.push(sale.program ? sale.program.title : '1:1 session');
    entry.totalCents += sale.amountCents;
    if (sale.createdAt > entry.last) entry.last = sale.createdAt;
    byClient.set(sale.clientId, entry);
  }
  return [...byClient.values()].sort((a, b) => b.last.localeCompare(a.last));
}

export function conversationsFor(userId: string) {
  return conversations
    .filter((c) => c.memberIds.includes(userId))
    .map((c) => ({ ...c, other: getProfile(c.memberIds.find((id) => id !== userId)!)! }))
    .sort((a, b) => b.messages.at(-1)!.sentAt.localeCompare(a.messages.at(-1)!.sentAt));
}

export function specialtyCount(s: Specialty) {
  return trainers.filter((t) => t.specialties?.includes(s)).length;
}
