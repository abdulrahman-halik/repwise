import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth/server';
import { db, profiles } from '@/lib/db';
import { eq, or } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const { data: session } = await auth.getSession();
    if (!session?.user) {
      return NextResponse.json({ profile: null, role: null }, { status: 200 });
    }

    // Try finding profile by userId or email
    const [existing] = await db
      .select()
      .from(profiles)
      .where(
        or(
          eq(profiles.userId, session.user.id),
          eq(profiles.userId, session.user.email)
        )
      )
      .limit(1);

    return NextResponse.json({
      profile: existing || null,
      role: existing?.role || 'client',
    });
  } catch (error: unknown) {
    console.error('Error fetching profile:', error);
    return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { data: session } = await auth.getSession();
    const body = await req.json();

    const userId = session?.user?.id || body.userId || `guest-${Date.now()}`;
    const name = body.name || session?.user?.name || 'Athlete';
    const role = (body.role === 'trainer' ? 'trainer' : 'client') as 'client' | 'trainer';

    const profileData = {
      userId,
      role,
      name,
      avatarUrl: body.avatarUrl || session?.user?.image || null,
      headline: body.headline || null,
      bio: body.bio || null,
      specialties: body.specialties || [],
      sessionPriceCents: body.sessionPriceCents ? Number(body.sessionPriceCents) : null,
      location: body.location || null,
      yearsCoaching: body.yearsCoaching ? Number(body.yearsCoaching) : null,
    };

    // Upsert into profiles
    const [existing] = await db
      .select()
      .from(profiles)
      .where(eq(profiles.userId, userId))
      .limit(1);

    if (existing) {
      await db
        .update(profiles)
        .set(profileData)
        .where(eq(profiles.userId, userId));
    } else {
      await db.insert(profiles).values(profileData);
    }

    return NextResponse.json({
      success: true,
      profile: profileData,
    });
  } catch (error: unknown) {
    console.error('Error saving profile:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to save profile' },
      { status: 500 }
    );
  }
}

