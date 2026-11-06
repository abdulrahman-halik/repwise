import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth/server';
import { getDbProgramById, purchaseProgramInDb } from '@/lib/db/queries';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const { data: session } = await auth.getSession();
    const body = await req.json();

    const { programId } = body;
    if (!programId) {
      return NextResponse.json({ error: 'Missing programId' }, { status: 400 });
    }

    const program = await getDbProgramById(programId);
    if (!program) {
      return NextResponse.json({ error: 'Program not found' }, { status: 404 });
    }

    const clientId = session?.user?.id || session?.user?.email || 'c-alex';

    const purchase = await purchaseProgramInDb({
      programId: program.id,
      clientId,
      trainerId: program.trainerId,
      amountCents: program.priceCents,
    });

    return NextResponse.json({
      success: true,
      message: `Program "${program.title}" unlocked successfully in Neon database!`,
      purchase,
    });
  } catch (error: unknown) {
    console.error('Program purchase failed:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Purchase failed' },
      { status: 500 }
    );
  }
}

