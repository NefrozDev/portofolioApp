const productionOrigins = [
  'https://www.synapseengineering.dev',
  'https://synapseengineering.dev',
];

function getAllowedOrigins(configuredOrigins = ''): string[] {
  return [...new Set([
    ...productionOrigins,
    ...configuredOrigins.split(',').map((origin) => origin.trim()),
  ].filter(Boolean))];
}

// Number of reverse proxies in front of the API. Express only reads the
// client IP from X-Forwarded-For entries added by these trusted proxies,
// so visitors cannot spoof it. Vercel adds exactly one.
function getTrustProxyHops(configuredHops = '', isVercel = false): number {
  const hops = Number.parseInt(configuredHops, 10);

  if (Number.isInteger(hops) && hops >= 0) {
    return hops;
  }

  return isVercel ? 1 : 0;
}

const env = {
  port: Number(process.env['PORT']) || 3000,
  isVercel: Boolean(process.env['VERCEL']),
  trustProxyHops: getTrustProxyHops(
    process.env['TRUST_PROXY_HOPS'],
    Boolean(process.env['VERCEL'])
  ),
  hasConfiguredOrigins: Boolean(process.env['ALLOWED_ORIGINS']?.trim()),
  allowedOrigins: getAllowedOrigins(process.env['ALLOWED_ORIGINS']),
};

export { env, getAllowedOrigins, getTrustProxyHops, productionOrigins };
