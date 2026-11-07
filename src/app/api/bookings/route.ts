import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth/server';
import { bookSlotInDb, getDbTrainerById } from '@/lib/db/queries';
import { broadcastSlotEvent } from '@/lib/realtime-events';
import { db, slots, profiles } from '@/lib/db';
import { and, eq } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const { data: session } = await auth.getSession();
    const clientId = searchParams.get('clientId') || session?.user?.id || 'c-alex';

    const bookedSlots = await db
      .select({
        id: slots.id,
        trainerId: slots.trainerId,
        startsAt: slots.startsAt,
        status: slots.status,
        clientId: slots.clientId,
        heldUntil: slots.heldUntil,
        trainerName: profiles.name,
        trainerAvatar: profiles.avatarUrl,
        trainerCover: profiles.coverUrl,
      })
      .from(slots)
      .leftJoin(profiles, eq(slots.trainerId, profiles.userId))
      .where(and(eq(slots.clientId, clientId), eq(slots.status, 'booked')))
      .orderBy(slots.startsAt);

    const sessions = bookedSlots.map((s) => ({
      slot: {
        id: s.id,
        trainerId: s.trainerId,
        startsAt: s.startsAt.toISOString(),
        status: s.status as any,
        clientId: s.clientId,
        heldUntil: s.heldUntil ? s.heldUntil.toISOString() : null,
      },
      trainer: {
        userId: s.trainerId,
        name: s.trainerName || 'Coach',
        avatarUrl: s.trainerAvatar,
        coverUrl: s.trainerCover,
        role: 'trainer' as const,
      },
    }));

    return NextResponse.json({ sessions });
  } catch (error: unknown) {
    console.error('Failed to fetch bookings:', error);
    return NextResponse.json({ error: 'Failed to fetch bookings' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { data: session } = await auth.getSession();
    const body = await req.json();

    const { slotId, trainerId, amountCents } = body;
    if (!slotId || !trainerId) {
      return NextResponse.json({ error: 'Missing slotId or trainerId' }, { status: 400 });
    }

    const clientId = session?.user?.id || session?.user?.email || 'c-alex';
    const clientName = session?.user?.name || (clientId === 'c-alex' ? 'Alex Rivera' : 'Athlete');
    const clientAvatar = session?.user?.image || null;

    let price = amountCents;
    if (!price) {
      const trainer = await getDbTrainerById(trainerId);
      price = trainer?.sessionPriceCents || 8500;
    }

    const { purchase, slot } = await bookSlotInDb({
      slotId,
      clientId,
      clientName,
      clientAvatar,
      trainerId,
      amountCents: price,
    });

    const formattedSlot = {
      ...slot,
      startsAt: slot.startsAt.toISOString(),
      heldUntil: slot.heldUntil ? slot.heldUntil.toISOString() : null,
    };

    // Broadcast real-time slot update to all listeners (SSE & server subscribers)
    broadcastSlotEvent({
      type: 'SLOT_BOOKED',
      trainerId,
      slotId,
      clientId,
      slot: formattedSlot,
      purchase,
    });

    return NextResponse.json({
      success: true,
      message: 'Slot successfully booked in Neon database!',
      purchase,
      slot: formattedSlot,
    });
  } catch (error: unknown) {
    console.error('Booking failed:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Booking failed' },
      { status: 400 }
    );
  }
}
