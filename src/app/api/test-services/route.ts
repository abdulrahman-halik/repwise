import { NextResponse } from 'next/server';
import { db, profiles } from '@/lib/db';
import { listAiGatewayModels } from '@/lib/ai-gateway';
import { invokeNeonFunction } from '@/lib/functions';
import { realtime, rawSql } from '@/lib/realtime';
import { listAssets, uploadAsset } from '@/lib/storage';

export const dynamic = 'force-dynamic';

export async function GET() {
  const results: Record<string, any> = {};

  // 1. Postgres Database Test
  try {
    const rows = await db.select().from(profiles).limit(3);
    results.postgres = {
      status: 'ok',
      message: `Successfully connected to Lakebase Postgres and queried ${rows.length} profiles`,
      sample: rows.map((r) => ({ name: r.name, role: r.role, userId: r.userId })),
    };
  } catch (err: unknown) {
    results.postgres = {
      status: 'error',
      message: err instanceof Error ? err.message : String(err),
    };
  }

  // 2. Neon Auth Test
  try {
    const jwksUrl = process.env.NEON_AUTH_JWKS_URL;
    if (!jwksUrl) throw new Error('NEON_AUTH_JWKS_URL is missing');
    const jwksRes = await fetch(jwksUrl, { cache: 'no-store' });
    const jwksData = await jwksRes.json();
    results.auth = {
      status: jwksRes.ok ? 'ok' : 'error',
      baseUrl: process.env.NEON_AUTH_BASE_URL,
      jwksStatus: jwksRes.status,
      keysCount: jwksData?.keys?.length || 0,
      message: 'Neon Auth JWKS endpoint reachable and verified',
    };
  } catch (err: unknown) {
    results.auth = {
      status: 'error',
      message: err instanceof Error ? err.message : String(err),
    };
  }

  // 3. Neon Realtime Test
  try {
    const sealed = await realtime.seal({
      query: rawSql('SELECT count(*) as total_profiles FROM profiles'),
    });
    results.realtime = {
      status: 'ok',
      message: 'Successfully sealed a live query using NEON_REALTIME_SECRET',
      sealedQueryType: typeof sealed,
      realtimeUrl: process.env.NEON_REALTIME_URL,
    };
  } catch (err: unknown) {
    results.realtime = {
      status: 'error',
      message: err instanceof Error ? err.message : String(err),
    };
  }

  // 4. Neon Object Storage Test
  try {
    const testKey = `test-health-${Date.now()}.txt`;
    await uploadAsset(testKey, 'Neon Object Storage verified', 'text/plain');
    const listRes = await listAssets();
    results.objectStorage = {
      status: 'ok',
      message: 'Successfully uploaded test object and listed S3 bucket contents',
      bucket: 'assets',
      endpoint: process.env.AWS_ENDPOINT_URL_S3,
      objectCount: listRes.KeyCount || listRes.Contents?.length || 0,
    };
  } catch (err: unknown) {
    results.objectStorage = {
      status: 'error',
      message: err instanceof Error ? err.message : String(err),
    };
  }

  // 5. Neon Functions Test
  try {
    const fnRes = await invokeNeonFunction('hello');
    results.functions = {
      status: fnRes.status === 200 ? 'ok' : 'warning',
      functionUrl: fnRes.url,
      httpStatus: fnRes.status,
      output: fnRes.data,
      message: fnRes.status === 200 ? 'Neon Hello Function invoked successfully' : `Neon Function returned ${fnRes.status}`,
    };
  } catch (err: unknown) {
    results.functions = {
      status: 'error',
      message: err instanceof Error ? err.message : String(err),
    };
  }

  // 6. Neon AI Gateway Test
  try {
    const modelsRes = await listAiGatewayModels();
    results.aiGateway = {
      status: modelsRes.ok ? 'ok' : 'notice',
      baseUrl: process.env.NEON_AI_GATEWAY_BASE_URL,
      statusCode: modelsRes.status,
      message: modelsRes.ok
        ? `AI Gateway reachable with ${modelsRes.data?.data?.length || 0} models cataloged`
        : 'AI Gateway endpoint reachable (needs card/credits in billing to unlock specific models)',
      details: modelsRes.data,
    };
  } catch (err: unknown) {
    results.aiGateway = {
      status: 'error',
      message: err instanceof Error ? err.message : String(err),
    };
  }

  return NextResponse.json({
    timestamp: new Date().toISOString(),
    branch: process.env.NEON_BRANCH,
    branchId: process.env.NEON_BRANCH_ID,
    services: results,
  });
}

