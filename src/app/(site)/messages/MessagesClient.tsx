'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Calendar,
  CheckCheck,
  Flame,
  MessageSquare,
  Paperclip,
  Phone,
  Search,
  Send,
  Smile,
  ThumbsUp,
  Video,
} from 'lucide-react';
import { UserAvatar } from '@/components/site/UserAvatar';
import { Button } from '@/components/ui/button';
import type { Conversation, Profile } from '@/lib/types';

export function MessagesClient({
  initialConversations,
  trainers,
}: {
  initialConversations: Conversation[];
  trainers: Profile[];
}) {
  const [conversations, setConversations] = useState(initialConversations);
  const [activeChatId, setActiveChatId] = useState(initialConversations[0]?.id || 'ch-maya');
  const [inputText, setInputText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const activeChat = conversations.find((c) => c.id === activeChatId) || conversations[0];
  const otherMemberId = activeChat?.memberIds.find((id) => id !== 'c-alex') || 't-maya';
  const otherTrainer = trainers.find((t) => t.userId === otherMemberId) || trainers[0];

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newMessage = {
      id: `m-${Date.now()}`,
      authorId: 'c-alex',
      text: inputText.trim(),
      sentAt: new Date().toISOString(),
    };

    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === activeChat.id) {
          return {
            ...c,
            messages: [...c.messages, newMessage],
          };
        }
        return c;
      }),
    );
    setInputText('');
  };

  const handleAddReaction = (messageId: string, emoji: string) => {
    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === activeChat.id) {
          return {
            ...c,
            messages: c.messages.map((m) => {
              if (m.id === messageId) {
                const currentReactions = m.reactions || [];
                const existing = currentReactions.find((r) => r.emoji === emoji);
                if (existing) {
                  return {
                    ...m,
                    reactions: currentReactions.map((r) =>
                      r.emoji === emoji ? { ...r, count: r.count + 1 } : r,
                    ),
                  };
                } else {
                  return {
                    ...m,
                    reactions: [...currentReactions, { emoji, count: 1 }],
                  };
                }
              }
              return m;
            }),
          };
        }
        return c;
      }),
    );
  };

  return (
    <div className="container-page py-6 md:py-10">
      <div className="overflow-hidden rounded-3xl border border-border bg-surface shadow-2xl">
        <div className="grid h-[700px] grid-cols-1 md:grid-cols-[320px_1fr] lg:grid-cols-[360px_1fr]">
          {/* Sidebar: Conversation List */}
          <div className="flex flex-col border-r border-border bg-surface-2/40">
            {/* Header & Search */}
            <div className="border-b border-border p-4">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-2xl uppercase tracking-wide">Direct Messages</h2>
                <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-lime-ink">
                  Stream Chat
                </span>
              </div>
              <div className="relative mt-3">
                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search trainers..."
                  className="h-9 w-full rounded-xl border border-border bg-surface pl-9 pr-3 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
                />
              </div>
            </div>

            {/* Conversation Threads */}
            <div className="flex-1 overflow-y-auto divide-y divide-border/40">
              {conversations
                .filter((conv) => {
                  const partnerId = conv.memberIds.find((id) => id !== 'c-alex');
                  const coach = trainers.find((t) => t.userId === partnerId);
                  return !searchQuery || coach?.name.toLowerCase().includes(searchQuery.toLowerCase());
                })
                .map((conv) => {
                  const partnerId = conv.memberIds.find((id) => id !== 'c-alex');
                  const coach = trainers.find((t) => t.userId === partnerId) || trainers[0];
                  const lastMessage = conv.messages[conv.messages.length - 1];
                  const isActive = conv.id === activeChat.id;

                  return (
                    <button
                      key={conv.id}
                      onClick={() => setActiveChatId(conv.id)}
                      className={`flex w-full items-start gap-3 p-4 text-left transition-colors ${
                        isActive ? 'bg-surface-2' : 'hover:bg-surface-2/50'
                      }`}
                    >
                      <div className="relative">
                        <UserAvatar name={coach.name} className="size-11" />
                        <span className="absolute bottom-0 right-0 size-3 rounded-full border-2 border-surface bg-primary" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="truncate text-sm font-semibold text-foreground">
                            {coach.name}
                          </h4>
                          {lastMessage && (
                            <span className="text-[10px] text-muted-foreground">
                              {new Date(lastMessage.sentAt).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </span>
                          )}
                        </div>
                        <p className="mt-1 truncate text-xs text-muted-foreground">
                          {lastMessage ? lastMessage.text : 'Start conversation...'}
                        </p>
                      </div>
                    </button>
                  );
                })}
            </div>
          </div>

          {/* Main Chat Pane */}
          <div className="flex flex-col bg-surface">
            {/* Chat Header */}
            <div className="flex items-center justify-between border-b border-border p-4">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <UserAvatar name={otherTrainer.name} className="size-10" />
                  <span className="absolute bottom-0 right-0 size-2.5 rounded-full bg-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{otherTrainer.name}</h3>
                  <p className="text-xs text-muted-foreground">
                    {otherTrainer.headline} · <span className="text-lime-ink">Active now</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button asChild variant="outline" size="sm">
                  <Link href={`/trainers/${otherTrainer.userId}`}>
                    <Calendar className="size-3.5" /> Book 1:1
                  </Link>
                </Button>
                <Button asChild size="sm">
                  <Link href="/call/s-101">
                    <Video className="size-3.5" /> Join Room
                  </Link>
                </Button>
              </div>
            </div>

            {/* Messages Thread Container */}
            <div className="flex-1 space-y-4 overflow-y-auto p-5">
              <div className="my-2 text-center">
                <span className="rounded-full bg-surface-2 px-3 py-1 text-[11px] text-muted-foreground">
                  Today · Direct end-to-end messaging powered by Stream
                </span>
              </div>

              {activeChat.messages.map((msg) => {
                const isMe = msg.authorId === 'c-alex';

                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                  >
                    <div className="flex max-w-[80%] items-end gap-2">
                      {!isMe && <UserAvatar name={otherTrainer.name} className="size-7 shrink-0" />}

                      <div
                        className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                          isMe
                            ? 'bg-primary text-primary-foreground font-medium rounded-br-none'
                            : 'bg-surface-2 border border-border text-foreground rounded-bl-none'
                        }`}
                      >
                        <p>{msg.text}</p>

                        <div
                          className={`mt-1.5 flex items-center justify-end gap-1 text-[10px] ${
                            isMe ? 'text-primary-foreground/75' : 'text-muted-foreground'
                          }`}
                        >
                          <span>
                            {new Date(msg.sentAt).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                          {isMe && <CheckCheck className="size-3" />}
                        </div>
                      </div>
                    </div>

                    {/* Reactions & quick emoji toolbar */}
                    <div className="mt-1 flex items-center gap-1.5 px-2">
                      {msg.reactions?.map((r) => (
                        <span
                          key={r.emoji}
                          className="inline-flex items-center gap-1 rounded-full border border-border bg-surface-2 px-2 py-0.5 text-xs"
                        >
                          {r.emoji} {r.count}
                        </span>
                      ))}
                      <div className="opacity-0 transition-opacity hover:opacity-100 flex items-center gap-1">
                        <button
                          onClick={() => handleAddReaction(msg.id, '🔥')}
                          className="rounded-full p-1 text-xs hover:bg-surface-2"
                          title="React with fire"
                        >
                          🔥
                        </button>
                        <button
                          onClick={() => handleAddReaction(msg.id, '💪')}
                          className="rounded-full p-1 text-xs hover:bg-surface-2"
                          title="React with muscle"
                        >
                          💪
                        </button>
                        <button
                          onClick={() => handleAddReaction(msg.id, '👍')}
                          className="rounded-full p-1 text-xs hover:bg-surface-2"
                          title="React with thumbs up"
                        >
                          👍
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Input Bar */}
            <form onSubmit={handleSendMessage} className="border-t border-border p-3 sm:p-4">
              <div className="flex items-center gap-2 rounded-2xl border border-border bg-surface-2/60 p-2">
                <button
                  type="button"
                  className="rounded-xl p-2 text-muted-foreground hover:bg-surface hover:text-foreground"
                >
                  <Paperclip className="size-4" />
                </button>

                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder={`Message ${otherTrainer.name}...`}
                  className="flex-1 bg-transparent px-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
                />

                <button
                  type="button"
                  onClick={() => setInputText((prev) => prev + ' 💪')}
                  className="rounded-xl p-2 text-muted-foreground hover:bg-surface hover:text-foreground"
                >
                  <Smile className="size-4" />
                </button>

                <Button type="submit" size="sm" className="font-semibold">
                  <Send className="size-4" /> Send
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

