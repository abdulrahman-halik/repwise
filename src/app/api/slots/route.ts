import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth/server';
import { createSlotInDb, deleteSlotInDb, getDbSlots } from '@/lib/db/queries';
import { broadcastSlotEvent } from '@/lib/realtime-events';
import { realtime, rawSql } from '@/lib/realtime';
import { db, profiles } from '@/lib/db';
import { eq } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const trainerId = searchParams.get('trainerId') || 't-maya';
    const rawSlots = await getDbSlots(trainerId);

    const formattedSlots = rawSlots.map((s) => ({
      id: s.id,
      trainerId: s.trainerId,
      startsAt: s.startsAt.toISOString(),
      status: s.status as any,
      clientId: s.clientId,
      heldUntil: s.heldUntil ? s.heldUntil.toISOString() : null,
    }));

    // Fetch client profiles for any booked slot
    const dbClients = await db.select().from(profiles).where(eq(profiles.role, 'client'));

    // Optional Neon Realtime sealed query
    let sealedQuery: any = null;
    try {
      sealedQuery = await realtime.seal({
        query: rawSql(
          `SELECT id, trainer_id, starts_at, status, client_id, held_until FROM slots WHERE trainer_id = $1 ORDER BY starts_at ASC`,
          [trainerId]
        ),
      });
    } catch {
      // quiet fallback
    }

    return NextResponse.json({
      slots: formattedSlots,
      clients: dbClients,
      sealedQuery,
    });
  } catch (error: unknown) {
    console.error('Failed to fetch slots:', error);
    return NextResponse.json({ error: 'Failed to fetch slots' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { data: session } = await auth.getSession();
    const body = await req.json();

    const trainerId = session?.user?.id || body.trainerId || 't-maya';
    const startsAt = body.startsAt ? new Date(body.startsAt) : new Date();

    const newSlot = await createSlotInDb({
      trainerId,
      startsAt,
    });

    const formattedSlot = {
      ...newSlot,
      startsAt: newSlot.startsAt.toISOString(),
      heldUntil: newSlot.heldUntil ? newSlot.heldUntil.toISOString() : null,
    };

    // Broadcast creation
    broadcastSlotEvent({
      type: 'SLOT_CREATED',
      trainerId,
      slot: formattedSlot,
    });

    return NextResponse.json({ success: true, slot: formattedSlot });
  } catch (error: unknown) {
    console.error('Failed to create slot:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create slot' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const slotId = searchParams.get('id');
    const trainerId = searchParams.get('trainerId') || 't-maya';
    if (!slotId) {
      return NextResponse.json({ error: 'Missing slot id' }, { status: 400 });
    }

    await deleteSlotInDb(slotId);

    // Broadcast deletion
    broadcastSlotEvent({
      type: 'SLOT_DELETED',
      trainerId,
      slotId,
    });

    return NextResponse.json({ success: true, message: 'Slot deleted' });
  } catch (error: unknown) {
    return NextResponse.json({ error: 'Failed to delete slot' }, { status: 500 });
  }
}
