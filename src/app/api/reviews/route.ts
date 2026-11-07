import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth/server';
import { addReviewInDb } from '@/lib/db/queries';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const { data: session } = await auth.getSession();
    const body = await req.json();

    const { trainerId, rating, comment } = body;
    if (!trainerId || !rating) {
      return NextResponse.json({ error: 'Missing trainerId or rating' }, { status: 400 });
    }

    const clientId = session?.user?.id || session?.user?.email || 'c-alex';

    const review = await addReviewInDb({
      trainerId,
      clientId,
      rating: Number(rating),
      comment: comment || 'Great coach!',
    });

    return NextResponse.json({ success: true, review });
  } catch (error: unknown) {
    console.error('Failed to submit review:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to submit review' },
      { status: 500 }
    );
  }
}

