export function getNeonFunctionUrl(functionName: string) {
  const hostSuffix = process.env.NEON_FUNCTION_HOST_SUFFIX || '.compute.c-9.us-east-2.aws.neon.tech';
  const branchId = process.env.NEON_BRANCH_ID || 'br-morning-frost-bedggrin';
  return `https://${branchId}-${functionName}${hostSuffix}/`;
}

export async function invokeNeonFunction(functionName: string, init?: RequestInit) {
  const url = getNeonFunctionUrl(functionName);
  const response = await fetch(url, {
    ...init,
    cache: 'no-store',
  });
  const text = await response.text();
  return {
    url,
    status: response.status,
    statusText: response.statusText,
    data: text,
  };
}

