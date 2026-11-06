import type { Metadata } from 'next';
import { CURRENT_CLIENT_ID, purchases as mockPurchases } from '@/lib/mock-data';
import { libraryFor } from '@/lib/queries';
import { LibraryClient } from './LibraryClient';

export const metadata: Metadata = {
  title: 'My Library & Bookings',
  description: 'Access your purchased workout programs, video lessons and scheduled 1:1 sessions.',
};

export default function LibraryPage() {
  const { ownedPrograms, sessions } = libraryFor(CURRENT_CLIENT_ID);
  const clientPurchases = mockPurchases.filter((p) => p.clientId === CURRENT_CLIENT_ID);

  return (
    <LibraryClient
      ownedPrograms={ownedPrograms}
      sessions={sessions}
      purchases={clientPurchases}
    />
  );
}

