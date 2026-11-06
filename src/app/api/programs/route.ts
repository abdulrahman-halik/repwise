import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth/server';
import { createProgramInDb, getDbPrograms, toggleProgramPublishInDb } from '@/lib/db/queries';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const trainerId = searchParams.get('trainerId') || undefined;
    const progs = await getDbPrograms(trainerId);
    return NextResponse.json({ programs: progs });
  } catch (error: unknown) {
    return NextResponse.json({ error: 'Failed to fetch programs' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { data: session } = await auth.getSession();
    const body = await req.json();

    const trainerId = session?.user?.id || body.trainerId || 't-maya';
    const { title, description, priceCents, level, weeks, published } = body;

    if (!title) {
      return NextResponse.json({ error: 'Program title is required' }, { status: 400 });
    }

    const newProg = await createProgramInDb({
      trainerId,
      title,
      description: description || 'A structured workout program.',
      priceCents: Number(priceCents) || 4900,
      level: level || 'Beginner',
      weeks: Number(weeks) || 6,
      published: published ?? true,
    });

    return NextResponse.json({ success: true, program: newProg });
  } catch (error: unknown) {
    console.error('Failed to create program:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create program' },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { programId } = body;
    if (!programId) {
      return NextResponse.json({ error: 'Missing programId' }, { status: 400 });
    }

    const updated = await toggleProgramPublishInDb(programId);
    return NextResponse.json({ success: true, program: updated });
  } catch (error: unknown) {
    return NextResponse.json({ error: 'Failed to update program' }, { status: 500 });
  }
}

