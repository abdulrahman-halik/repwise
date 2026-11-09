import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth/server';
import { db, profiles } from '@/lib/db';
import { eq, or } from 'drizzle-orm';
import { clients, trainers } from '@/lib/mock-data';
import { getStreamApiKey, getStreamServerClient } from '@/lib/stream';

export const dynamic = 'force-dynamic';

function sanitizeStreamUserId(raw: string): string {
  return raw.trim().replace(/[^a-zA-Z0-9@_.-]/g, '_');
}

async function resolveUserIdentity(input: {
  userId?: string | null;
  name?: string | null;
  image?: string | null;
  role?: string | null;
}) {
  let rawId = input.userId?.trim() || null;
  let resolvedName = input.name?.trim() || null;
  let resolvedImage = input.image?.trim() || null;
  let resolvedRole: 'client' | 'trainer' = input.role === 'trainer' ? 'trainer' : 'client';

  if (!rawId) {
    try {
      const { data: session } = await auth.getSession();
      if (session?.user) {
        rawId = session.user.id;
        resolvedName = resolvedName || session.user.name || session.user.email?.split('@')[0] || 'Athlete';
        resolvedImage = resolvedImage || session.user.image || null;
      }
    } catch {
      // No active Neon Auth session
    }
  }

  if (!rawId) {
    return null;
  }

  const streamUserId = sanitizeStreamUserId(rawId);

  try {
    const [dbProfile] = await db
      .select()
      .from(profiles)
      .where(or(eq(profiles.userId, rawId), eq(profiles.userId, streamUserId)))
      .limit(1);

    if (dbProfile) {
      resolvedName = input.name?.trim() || dbProfile.name || resolvedName;
      resolvedImage = input.image?.trim() || dbProfile.avatarUrl || resolvedImage;
      resolvedRole = dbProfile.role === 'trainer' ? 'trainer' : 'client';
    }
  } catch {
    // Fallback to mock profiles if DB lookup fails
  }

  const knownProfile = [...trainers, ...clients].find(
    (p) => p.userId === rawId || p.userId === streamUserId,
  );
  if (knownProfile) {
    resolvedName = input.name?.trim() || resolvedName || knownProfile.name;
    resolvedImage = input.image?.trim() || resolvedImage || knownProfile.avatarUrl || null;
    resolvedRole = knownProfile.role;
  }

  if (resolvedImage === '/images/hero.png') {
    resolvedImage = null;
  }

  return {
    id: streamUserId,
    name: resolvedName || streamUserId,
    image: resolvedImage || '',
    role: resolvedRole,
  };
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const user = await resolveUserIdentity({
      userId: body.userId,
      name: body.name,
      image: body.image,
      role: body.role,
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required. Provide userId or sign in.' },
        { status: 401 },
      );
    }

    const streamClient = getStreamServerClient();
    const apiKey = getStreamApiKey();

    // Upsert ONLY the requesting user per Stream React integration best practices
    await streamClient.upsertUsers([
      {
        id: user.id,
        name: user.name,
        image: user.image,
        role: 'user',
        custom: {
          repwiseRole: user.role,
        },
      },
    ]);

    const token = streamClient.generateUserToken({
      user_id: user.id,
      validity_in_seconds: 24 * 60 * 60,
    });

    return NextResponse.json({
      token,
      apiKey,
      user,
    });
  } catch (error: unknown) {
    console.error('Error generating Stream token:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to generate Stream token' },
      { status: 500 },
    );
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const user = await resolveUserIdentity({
      userId: searchParams.get('userId'),
      name: searchParams.get('name'),
      image: searchParams.get('image'),
      role: searchParams.get('role'),
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required. Provide userId or sign in.' },
        { status: 401 },
      );
    }

    const streamClient = getStreamServerClient();
    const apiKey = getStreamApiKey();

    await streamClient.upsertUsers([
      {
        id: user.id,
        name: user.name,
        image: user.image,
        role: 'user',
        custom: {
          repwiseRole: user.role,
        },
      },
    ]);

    const token = streamClient.generateUserToken({
      user_id: user.id,
      validity_in_seconds: 24 * 60 * 60,
    });

    return NextResponse.json({
      token,
      apiKey,
      user,
    });
  } catch (error: unknown) {
    console.error('Error generating Stream token:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to generate Stream token' },
      { status: 500 },
    );
  }
}

