import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth/server';
import { createSlotInDb, deleteSlotInDb, getDbSlots } from '@/lib/db/queries';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const trainerId = searchParams.get('trainerId') || 't-maya';
    const slots = await getDbSlots(trainerId);
    return NextResponse.json({ slots });
  } catch (error: unknown) {
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

    return NextResponse.json({ success: true, slot: newSlot });
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
    if (!slotId) {
      return NextResponse.json({ error: 'Missing slot id' }, { status: 400 });
    }

    await deleteSlotInDb(slotId);
    return NextResponse.json({ success: true, message: 'Slot deleted' });
  } catch (error: unknown) {
    return NextResponse.json({ error: 'Failed to delete slot' }, { status: 500 });
  }
}

