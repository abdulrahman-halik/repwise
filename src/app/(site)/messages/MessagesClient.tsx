'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import {
  Calendar,
  LogOut,
  MessageSquarePlus,
  Radio,
  Sparkles,
  UserPlus,
  Video,
} from 'lucide-react';
import {
  ChannelPaginator,
  type Channel as StreamChannel,
  type Thread as StreamThread,
} from 'stream-chat';
import {
  ChannelHeader,
  ChannelNavigation,
  Chat,
  MessageComposer,
  MessageList,
  ThreadHeader,
  ThreadList,
  useWorkspaceNavigation,
} from 'stream-chat-react';
import {
  ChannelSlot,
  ChatView,
  ChatViewEmptyPlaceholder,
  DisposedChannelRelease,
  type LayoutDescriptor,
  ThreadSlot,
  useActiveThread,
  useSlotThread,
} from 'stream-chat-react/slot-layout';
import { StreamLoginCard } from '@/components/stream/StreamLoginCard';
import { UserAvatar } from '@/components/site/UserAvatar';
import { Button } from '@/components/ui/button';
import { useStreamContext } from '@/context/StreamContext';
import { useTheme } from '@/context/ThemeContext';
import type { Profile } from '@/lib/types';
import { toast } from 'sonner';

const CHAT_VIEW_LAYOUTS: LayoutDescriptor[] = [
  {
    id: 'channels',
    slots: ['channel', 'thread'],
  },
  {
    id: 'threads',
    slots: ['thread'],
  },
];

function ActiveThreadBinder() {
  const activeThread = useSlotThread({ slot: 'thread' });
  useActiveThread({ activeThread });
  return null;
}

function WorkspacePartnerOpener({
  requestedPartner,
  onOpened,
}: {
  requestedPartner: { userId: string; name?: string } | null;
  onOpened: () => void;
}) {
  const { chatClient, streamUser } = useStreamContext();
  const { openChannel } = useWorkspaceNavigation();
  const inFlightRef = useRef<string | null>(null);

  useEffect(() => {
    if (!requestedPartner || !chatClient || !streamUser) return;
    if (requestedPartner.userId === streamUser.id) {
      onOpened();
      return;
    }

    const requestKey = `${streamUser.id}:${requestedPartner.userId}`;
    if (inFlightRef.current === requestKey) return;
    inFlightRef.current = requestKey;

    let cancelled = false;
    (async () => {
      try {
        const res = await fetch('/api/stream/channel', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            currentUserId: streamUser.id,
            targetUserId: requestedPartner.userId,
            targetName: requestedPartner.name,
          }),
        });
        const data = await res.json();
        if (!res.ok || !data.channelId) {
          throw new Error(data.error || 'Could not open direct message channel');
        }
        if (cancelled) return;

        const channel: StreamChannel = chatClient.channel('messaging', data.channelId);
        await channel.watch();
        if (cancelled) return;

        chatClient.channelManager.ingestChannel(channel);
        openChannel(channel);
        onOpened();
      } catch (err: unknown) {
        if (!cancelled) {
          toast.error(err instanceof Error ? err.message : 'Failed to start conversation');
          onOpened();
        }
      } finally {
        inFlightRef.current = null;
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [requestedPartner, chatClient, streamUser, openChannel, onOpened]);

  return null;
}

export function MessagesClient({
  trainers,
  clients,
}: {
  trainers: Profile[];
  clients: Profile[];
}) {
  const { streamUser, chatClient, isConnecting, logoutStreamUser } = useStreamContext();
  const { theme } = useTheme();
  const [requestedPartner, setRequestedPartner] = useState<{
    userId: string;
    name?: string;
  } | null>(null);
  const [paginatorReady, setPaginatorReady] = useState(false);

  // Detect ?partner=<userId> on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const partnerId = params.get('partner');
    if (partnerId) {
      const profile = [...trainers, ...clients].find((p) => p.userId === partnerId);
      setRequestedPartner({ userId: partnerId, name: profile?.name });
    }
  }, [trainers, clients]);

  // Register ChannelPaginator for the logged-in user on chatClient.channelManager
  useEffect(() => {
    if (!chatClient || !streamUser) {
      setPaginatorReady(false);
      return;
    }

    const paginator = new ChannelPaginator({
      client: chatClient,
      id: `messaging-${streamUser.id}`,
      filters: {
        type: 'messaging',
        members: { $in: [streamUser.id] },
      },
      sort: [{ field: 'last_message_at', direction: -1 }],
      requestOptions: { state: true, watch: true, presence: true },
    });

    chatClient.channelManager.insertPaginator({ paginator });
    setPaginatorReady(true);
  }, [chatClient, streamUser]);

  const handleClearPartnerRequest = useCallback(() => {
    setRequestedPartner(null);
  }, []);

  if (!streamUser || !chatClient) {
    return (
      <StreamLoginCard
        title="Direct Messages · Stream Chat"
        subtitle="Sign in with a Repwise profile or your Neon Auth account to message coaches in real time, react with emojis, quote replies, and branch into threads."
      />
    );
  }

  // Contacts the current user can start/open a 1:1 DM with
  const availableContacts =
    streamUser.role === 'trainer'
      ? [...clients, ...trainers.filter((t) => t.userId !== streamUser.id)]
      : [...trainers, ...clients.filter((c) => c.userId !== streamUser.id)];

  return (
    <div className="container-page py-6 md:py-8">
      {/* Top Repwise Workspace Control Bar */}
      <div className="mb-4 flex flex-col gap-3 rounded-2xl border border-border bg-surface p-4 shadow-lg lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2.5">
            <div className="relative">
              <UserAvatar name={streamUser.name} className="size-9" />
              <span className="absolute bottom-0 right-0 size-2.5 rounded-full border-2 border-surface bg-primary" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-foreground">{streamUser.name}</span>
                <span className="rounded-full border border-primary/30 bg-primary/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-lime-ink">
                  {streamUser.role === 'trainer' ? 'Coach' : 'Athlete'} · {streamUser.id}
                </span>
              </div>
              <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Radio className="size-3 text-lime-ink" /> Connected to Stream Chat v15
              </p>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={logoutStreamUser}
            data-testid="stream-switch-user"
            className="text-xs"
          >
            <LogOut className="size-3.5" /> Switch User
          </Button>
        </div>

        {/* Quick Start / Open DM Contacts */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <MessageSquarePlus className="size-3.5 text-lime-ink" /> Message:
          </span>
          {availableContacts.slice(0, 5).map((contact) => (
            <button
              key={contact.userId}
              type="button"
              disabled={isConnecting}
              data-testid={`open-dm-${contact.userId}`}
              onClick={() =>
                setRequestedPartner({
                  userId: contact.userId,
                  name: contact.name,
                })
              }
              className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-surface-2 px-2.5 py-1.5 text-xs font-medium text-foreground transition-colors hover:border-primary/60 hover:bg-primary/10"
            >
              <UserAvatar name={contact.name} className="size-5" />
              <span>{contact.name}</span>
            </button>
          ))}

          <Button asChild size="sm" className="ml-auto font-semibold lg:ml-2">
            <Link href="/call/s-101" data-testid="goto-video-room">
              <Video className="size-3.5" /> 1:1 Video Room
            </Link>
          </Button>
        </div>
      </div>

      {/* Main Stream Chat v15 Workspace */}
      <div className="repwise-stream-shell h-[720px] overflow-hidden rounded-3xl border border-border bg-surface shadow-2xl">
        {paginatorReady && (
          <Chat
            client={chatClient}
            theme={theme === 'dark' ? 'str-chat__theme-dark' : 'messaging light'}
          >
            <ChatView layouts={CHAT_VIEW_LAYOUTS}>
              <div className="grid h-full w-full grid-cols-1 md:grid-cols-[320px_1fr]">
                <div className="h-full overflow-y-auto border-r border-border">
                  <ChannelNavigation />
                </div>
                <div className="flex h-full min-w-0 flex-1 overflow-hidden">
                  <div className="flex h-full min-w-0 flex-1 flex-col overflow-hidden">
                    <ChannelSlot
                      slot="channel"
                      fallback={<ChatViewEmptyPlaceholder />}
                    >
                      <ChannelHeader />
                      <MessageList closeReactionSelectorOnClick />
                      <MessageComposer />
                    </ChannelSlot>
                  </div>
                  <ThreadSlot slot="thread">
                    <div className="flex h-full w-[340px] shrink-0 flex-col border-l border-border">
                      <ActiveThreadBinder />
                      <ThreadHeader />
                      <MessageList closeReactionSelectorOnClick />
                      <MessageComposer />
                    </div>
                  </ThreadSlot>
                </div>
              </div>
              <WorkspacePartnerOpener
                requestedPartner={requestedPartner}
                onOpened={handleClearPartnerRequest}
              />
              <DisposedChannelRelease />
            </ChatView>
          </Chat>
        )}
      </div>
    </div>
  );
}
