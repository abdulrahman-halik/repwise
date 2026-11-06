export async function listAiGatewayModels() {
  const baseUrl = process.env.NEON_AI_GATEWAY_BASE_URL;
  const token = process.env.NEON_AI_GATEWAY_TOKEN;

  if (!baseUrl || !token) {
    throw new Error('NEON_AI_GATEWAY_BASE_URL or NEON_AI_GATEWAY_TOKEN is not configured');
  }

  const response = await fetch(`${baseUrl}/v1/models`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    cache: 'no-store',
  });

  const data = await response.json();
  return {
    status: response.status,
    ok: response.ok,
    data,
  };
}

export async function createAiCompletion(model: string, prompt: string) {
  const baseUrl = process.env.NEON_AI_GATEWAY_BASE_URL;
  const token = process.env.NEON_AI_GATEWAY_TOKEN;

  if (!baseUrl || !token) {
    throw new Error('NEON_AI_GATEWAY_BASE_URL or NEON_AI_GATEWAY_TOKEN is not configured');
  }

  const response = await fetch(`${baseUrl}/v1/chat/completions`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 100,
    }),
  });

  const data = await response.json();
  return {
    status: response.status,
    ok: response.ok,
    data,
  };
}

