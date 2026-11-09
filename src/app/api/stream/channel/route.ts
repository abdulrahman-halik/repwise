import { NextResponse } from 'next/server';
import { db, profiles } from '@/lib/db';
import { eq } from 'drizzle-orm';
import { clients, trainers } from '@/lib/mock-data';
import { getDmChannelId, getStreamServerClient } from '@/lib/stream';

export const dynamic = 'force-dynamic';

async function resolveProfileMeta(userId: string, fallbackName?: string) {
  try {
    const [dbProfile] = await db
      .select()
      .from(profiles)
      .where(eq(profiles.userId, userId))
      .limit(1);

    if (dbProfile) {
      const validDbImage =
        dbProfile.avatarUrl && dbProfile.avatarUrl !== '/images/hero.png'
          ? dbProfile.avatarUrl
          : '';
      return {
        id: userId,
        name: dbProfile.name,
        image: validDbImage,
        role: dbProfile.role,
      };
    }
  } catch {
    // Fallback to static profiles
  }

  const known = [...trainers, ...clients].find((p) => p.userId === userId);
  if (known) {
    const validImage = known.avatarUrl && known.avatarUrl !== '/images/hero.png' ? known.avatarUrl : '';
    return {
      id: userId,
      name: known.name,
      image: validImage,
      role: known.role,
    };
  }

  return {
    id: userId,
    name: fallbackName || userId,
    image: '',
    role: 'client',
  };
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const currentUserId = String(body.currentUserId || '').trim();
    const targetUserId = String(body.targetUserId || '').trim();
    const targetName = body.targetName ? String(body.targetName).trim() : undefined;

    if (!currentUserId || !targetUserId) {
      return NextResponse.json(
        { error: 'Both currentUserId and targetUserId are required' },
        { status: 400 },
      );
    }

    if (currentUserId === targetUserId) {
      return NextResponse.json(
        { error: 'Cannot create a direct message channel with yourself' },
        { status: 400 },
      );
    }

    const streamClient = getStreamServerClient();
    const targetMeta = await resolveProfileMeta(targetUserId, targetName);

    // Ensure the target user exists in Stream before adding them as a channel member
    await streamClient.upsertUsers([
      {
        id: targetMeta.id,
        name: targetMeta.name,
        image: targetMeta.image,
        role: 'user',
        custom: {
          repwiseRole: targetMeta.role,
        },
      },
    ]);

    const channelId = getDmChannelId(currentUserId, targetUserId);
    const channel = streamClient.chat.channel('messaging', channelId);

    await channel.getOrCreate({
      data: {
        created_by_id: currentUserId,
        members: [{ user_id: currentUserId }, { user_id: targetUserId }],
      },
    });

    return NextResponse.json({
      channelId,
      cid: `messaging:${channelId}`,
      targetUser: targetMeta,
    });
  } catch (error: unknown) {
    console.error('Error creating/getting Stream channel:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create channel' },
      { status: 500 },
    );
  }
}

