export type RealtimeSlotEvent =
  | {
      type: 'SLOT_BOOKED';
      trainerId: string;
      slotId: string;
      clientId: string;
      slot?: any;
      purchase?: any;
    }
  | {
      type: 'SLOT_CREATED';
      trainerId: string;
      slot: any;
    }
  | {
      type: 'SLOT_DELETED';
      trainerId: string;
      slotId: string;
    };

type Listener = (event: RealtimeSlotEvent) => void;

// Retain listeners across Hot Module Reloads in Next.js dev server
declare global {
  // eslint-disable-next-line no-var
  var __repwise_slot_listeners: Set<Listener> | undefined;
}

const listeners: Set<Listener> =
  globalThis.__repwise_slot_listeners ||
  (globalThis.__repwise_slot_listeners = new Set<Listener>());

export function subscribeToSlotEvents(listener: Listener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function broadcastSlotEvent(event: RealtimeSlotEvent): void {
  for (const listener of listeners) {
    try {
      listener(event);
    } catch (err) {
      console.error('Error dispatching slot event to listener:', err);
    }
  }
}

