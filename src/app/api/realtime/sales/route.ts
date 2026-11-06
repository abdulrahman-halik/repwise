import { NextResponse } from 'next/server';
import { db, purchases, profiles, programs, slots } from '@/lib/db';
import { desc, eq } from 'drizzle-orm';
import { realtime, rawSql } from '@/lib/realtime';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const trainerId = searchParams.get('trainerId') || 't-maya';

    // 1. Fetch live sales from Neon Postgres
    const rawSales = await db
      .select({
        id: purchases.id,
        clientId: purchases.clientId,
        trainerId: purchases.trainerId,
        kind: purchases.kind,
        programId: purchases.programId,
        slotId: purchases.slotId,
        amountCents: purchases.amountCents,
        stripeSessionId: purchases.stripeSessionId,
        createdAt: purchases.createdAt,
        clientName: profiles.name,
        clientAvatar: profiles.avatarUrl,
        programTitle: programs.title,
      })
      .from(purchases)
      .leftJoin(profiles, eq(purchases.clientId, profiles.userId))
      .leftJoin(programs, eq(purchases.programId, programs.id))
      .where(eq(purchases.trainerId, trainerId))
      .orderBy(desc(purchases.createdAt))
      .limit(20);

    const formattedSales = rawSales.map((s) => ({
      id: s.id,
      clientId: s.clientId,
      trainerId: s.trainerId,
      kind: s.kind,
      programId: s.programId,
      slotId: s.slotId,
      amountCents: s.amountCents,
      stripeSessionId: s.stripeSessionId,
      createdAt: s.createdAt ? s.createdAt.toISOString() : new Date().toISOString(),
      client: {
        userId: s.clientId,
        name: s.clientName || 'Athlete',
        avatarUrl: s.clientAvatar,
        role: 'client' as const,
      },
      program: s.programTitle ? { title: s.programTitle } : undefined,
    }));

    // 2. Generate a sealed query for Neon Realtime subscription
    let sealedQuery: any = null;
    try {
      sealedQuery = await realtime.seal({
        query: rawSql(
          `SELECT id, client_id, trainer_id, kind, amount_cents, created_at FROM purchases WHERE trainer_id = $1 ORDER BY created_at DESC LIMIT 20`,
          [trainerId]
        ),
      });
    } catch {
      // If realtime service is unavailable, fallback to direct query results
    }

    return NextResponse.json({
      sales: formattedSales,
      sealedQuery,
    });
  } catch (error: unknown) {
    console.error('Error in realtime sales route:', error);
    return NextResponse.json({ error: 'Failed to fetch sales' }, { status: 500 });
  }
}

