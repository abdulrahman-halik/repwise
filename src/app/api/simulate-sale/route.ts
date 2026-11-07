import { NextResponse } from 'next/server';
import { db, purchases, profiles, programs } from '@/lib/db';
import { sql } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const clientsList = ['Alex Rivera', 'Jordan Lee', 'Sam Patel', 'Nora Kim', 'Theo Grant'];
    const randomName = clientsList[Math.floor(Math.random() * clientsList.length)];
    const isProgram = Math.random() > 0.4;
    const amount = isProgram ? 4900 : 8500;
    const clientId = `c-client-${Date.now()}`;
    const trainerId = 't-maya';

    // 1. Ensure client profile exists in Neon Postgres
    await db
      .insert(profiles)
      .values({
        userId: clientId,
        role: 'client',
        name: randomName,
      })
      .onConflictDoNothing();

    // 2. Real database transaction insert returning txid (Neon Realtime standard)
    const txid = sql<string>`pg_current_xact_id()::text`;
    const purchaseId = `pu-${Date.now()}`;
    const stripeSessionId = `cs_live_${Date.now()}`;

    const [inserted] = await db
      .insert(purchases)
      .values({
        id: purchaseId,
        clientId,
        trainerId,
        kind: isProgram ? 'program' : 'session',
        programId: isProgram ? 'p-strong-base' : null,
        slotId: isProgram ? null : 's-101',
        amountCents: amount,
        stripeSessionId,
      })
      .returning({
        id: purchases.id,
        clientId: purchases.clientId,
        trainerId: purchases.trainerId,
        kind: purchases.kind,
        programId: purchases.programId,
        slotId: purchases.slotId,
        amountCents: purchases.amountCents,
        stripeSessionId: purchases.stripeSessionId,
        createdAt: purchases.createdAt,
        txid,
      });

    return NextResponse.json({
      success: true,
      kind: 'committed',
      purchase: {
        ...inserted,
        client: { name: randomName, userId: clientId },
        program: isProgram ? { title: 'Strong Base: 8-Week Barbell' } : undefined,
      },
    });
  } catch (error: unknown) {
    console.error('Failed to simulate live sale in DB:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Database transaction failed' },
      { status: 500 }
    );
  }
}

