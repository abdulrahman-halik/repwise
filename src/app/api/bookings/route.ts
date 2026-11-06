import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth/server';
import { bookSlotInDb, getDbTrainerById } from '@/lib/db/queries';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const { data: session } = await auth.getSession();
    const body = await req.json();

    const { slotId, trainerId, amountCents } = body;
    if (!slotId || !trainerId) {
      return NextResponse.json({ error: 'Missing slotId or trainerId' }, { status: 400 });
    }

    const clientId = session?.user?.id || session?.user?.email || 'c-alex';

    let price = amountCents;
    if (!price) {
      const trainer = await getDbTrainerById(trainerId);
      price = trainer?.sessionPriceCents || 8500;
    }

    const purchase = await bookSlotInDb({
      slotId,
      clientId,
      trainerId,
      amountCents: price,
    });

    return NextResponse.json({
      success: true,
      message: 'Slot successfully booked in Neon database!',
      purchase,
    });
  } catch (error: unknown) {
    console.error('Booking failed:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Booking failed' },
      { status: 500 }
    );
  }
}

