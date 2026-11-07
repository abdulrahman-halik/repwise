import { subscribeToSlotEvents, type RealtimeSlotEvent } from '@/lib/realtime-events';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const trainerId = searchParams.get('trainerId');

  const stream = new ReadableStream({
    start(controller) {
      // Handshake comment
      controller.enqueue(new TextEncoder().encode(': connected\n\n'));

      const unsubscribe = subscribeToSlotEvents((event: RealtimeSlotEvent) => {
        // Filter events by trainerId if requested, or push all
        if (!trainerId || event.trainerId === trainerId) {
          try {
            const payload = `data: ${JSON.stringify(event)}\n\n`;
            controller.enqueue(new TextEncoder().encode(payload));
          } catch {
            unsubscribe();
          }
        }
      });

      // Heartbeat comment every 20 seconds to keep connection alive
      const heartbeat = setInterval(() => {
        try {
          controller.enqueue(new TextEncoder().encode(': ping\n\n'));
        } catch {
          clearInterval(heartbeat);
          unsubscribe();
        }
      }, 20000);

      req.signal.addEventListener('abort', () => {
        clearInterval(heartbeat);
        unsubscribe();
        try {
          controller.close();
        } catch {}
      });
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream; charset=utf-8',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
    },
  });
}

