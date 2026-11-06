import { createRealtime, rawSql } from '@neon/realtime/server';

export const realtime = createRealtime({
  secret: process.env.NEON_REALTIME_SECRET || 'dev-secret',
  db: 'neondb',
});

export { rawSql };

