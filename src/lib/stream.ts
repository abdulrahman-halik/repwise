import { StreamClient } from '@stream-io/node-sdk';

let serverClient: StreamClient | null = null;

export function getStreamApiKey(): string {
  const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY;
  if (!apiKey) {
    throw new Error('NEXT_PUBLIC_STREAM_API_KEY is not configured');
  }
  return apiKey;
}

export function getStreamServerClient(): StreamClient {
  if (serverClient) return serverClient;

  const apiKey = getStreamApiKey();
  const apiSecret = process.env.STREAM_API_SECRET;
  if (!apiSecret) {
    throw new Error('STREAM_API_SECRET is not configured');
  }

  serverClient = new StreamClient(apiKey, apiSecret);
  return serverClient;
}

export function getDmChannelId(userA: string, userB: string): string {
  const sorted = [userA, userB].sort();
  const raw = `dm-${sorted[0]}-${sorted[1]}`.replace(/[^a-zA-Z0-9_-]/g, '_');
  return raw.slice(0, 64);
}

