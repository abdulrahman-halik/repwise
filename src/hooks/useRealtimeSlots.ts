'use client';

import { useEffect, useState, useCallback } from 'react';
import type { Slot } from '@/lib/types';

export function useRealtimeSlots(trainerId: string, initialSlots: Slot[]) {
  const [slots, setSlots] = useState<Slot[]>(initialSlots);
  const [isLive, setIsLive] = useState(false);

  // Sync latest slots from server
  const refreshSlots = useCallback(async () => {
    try {
      const res = await fetch(`/api/slots?trainerId=${encodeURIComponent(trainerId)}`, {
        cache: 'no-store',
      });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.slots)) {
          setSlots(
            data.slots.map((s: any) => ({
              ...s,
              startsAt:
                typeof s.startsAt === 'string'
                  ? s.startsAt
                  : new Date(s.startsAt).toISOString(),
              heldUntil: s.heldUntil
                ? typeof s.heldUntil === 'string'
                  ? s.heldUntil
                  : new Date(s.heldUntil).toISOString()
                : null,
            }))
          );
        }
      }
    } catch {
      // quiet fallback
    }
  }, [trainerId]);

  // Keep state updated when initialSlots prop updates from SSR/Server Action
  useEffect(() => {
    if (initialSlots && initialSlots.length > 0) {
      setSlots(initialSlots);
    }
  }, [initialSlots]);

  useEffect(() => {
    let sse: EventSource | null = null;
    let bc: BroadcastChannel | null = null;
    let interval: NodeJS.Timeout | null = null;

    // 1. Cross-tab BroadcastChannel for 0ms instant updates across windows/tabs
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      try {
        bc = new BroadcastChannel('repwise_slots');
        bc.onmessage = (event) => {
          const data = event.data;
          if (!data) return;
          if (data.trainerId && data.trainerId !== trainerId) return;

          if (data.type === 'SLOT_BOOKED' && data.slotId) {
            setSlots((prev) =>
              prev.map((s) =>
                s.id === data.slotId
                  ? { ...s, status: 'booked', clientId: data.clientId || s.clientId }
                  : s
              )
            );
          } else if (data.type === 'SLOT_CREATED' && data.slot) {
            setSlots((prev) => {
              if (prev.some((s) => s.id === data.slot.id)) return prev;
              return [data.slot, ...prev];
            });
          } else if (data.type === 'SLOT_DELETED' && data.slotId) {
            setSlots((prev) => prev.filter((s) => s.id !== data.slotId));
          } else {
            refreshSlots();
          }
        };
      } catch {
        // BroadcastChannel unavailable
      }
    }

    // 2. Server-Sent Events (SSE) stream for server push to all connected users
    try {
      sse = new EventSource(`/api/realtime/slots/stream?trainerId=${encodeURIComponent(trainerId)}`);
      sse.onopen = () => setIsLive(true);
      sse.onerror = () => setIsLive(false);
      sse.onmessage = (msg) => {
        try {
          const data = JSON.parse(msg.data);
          if (data.type === 'SLOT_BOOKED' && data.slotId) {
            setSlots((prev) =>
              prev.map((s) =>
                s.id === data.slotId
                  ? { ...s, status: 'booked', clientId: data.clientId || s.clientId }
                  : s
              )
            );
          } else if (data.type === 'SLOT_CREATED' && data.slot) {
            setSlots((prev) => {
              if (prev.some((s) => s.id === data.slot.id)) return prev;
              return [data.slot, ...prev];
            });
          } else if (data.type === 'SLOT_DELETED' && data.slotId) {
            setSlots((prev) => prev.filter((s) => s.id !== data.slotId));
          } else {
            refreshSlots();
          }
        } catch {}
      };
    } catch {
      // EventSource fallback
    }

    // 3. Resilient polling heartbeat (every 4 seconds) to guarantee real-time state
    interval = setInterval(refreshSlots, 4000);

    // 4. Sync immediately when tab regains focus or visibility
    const handleFocus = () => refreshSlots();
    window.addEventListener('focus', handleFocus);
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') refreshSlots();
    };
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      if (sse) sse.close();
      if (bc) bc.close();
      if (interval) clearInterval(interval);
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [trainerId, refreshSlots]);

  // Broadcast slot action to other tabs immediately
  const notifySlotChange = useCallback(
    (action: {
      type: 'SLOT_BOOKED' | 'SLOT_CREATED' | 'SLOT_DELETED';
      slotId?: string;
      slot?: Slot;
      clientId?: string;
    }) => {
      if (action.type === 'SLOT_BOOKED' && action.slotId) {
        setSlots((prev) =>
          prev.map((s) =>
            s.id === action.slotId
              ? { ...s, status: 'booked', clientId: action.clientId || s.clientId }
              : s
          )
        );
      } else if (action.type === 'SLOT_CREATED' && action.slot) {
        setSlots((prev) => [action.slot!, ...prev]);
      } else if (action.type === 'SLOT_DELETED' && action.slotId) {
        setSlots((prev) => prev.filter((s) => s.id !== action.slotId));
      }

      if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
        try {
          const bc = new BroadcastChannel('repwise_slots');
          bc.postMessage({ ...action, trainerId });
          bc.close();
        } catch {}
      }
    },
    [trainerId]
  );

  return { slots, setSlots, isLive, refreshSlots, notifySlotChange };
}

