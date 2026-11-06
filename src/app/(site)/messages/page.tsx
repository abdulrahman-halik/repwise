import type { Metadata } from 'next';
import { conversations, trainers } from '@/lib/mock-data';
import { MessagesClient } from './MessagesClient';

export const metadata: Metadata = {
  title: 'Direct Messages · Stream Chat',
  description: 'Direct messaging with your coaches. Discuss programming, video form checks, and nutrition.',
};

export default function MessagesPage() {
  return <MessagesClient initialConversations={conversations} trainers={trainers} />;
}

