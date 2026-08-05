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

const env = {
  port: Number(process.env['PORT']) || 3000,
  isVercel: Boolean(process.env['VERCEL']),
  hasConfiguredOrigins: Boolean(process.env['ALLOWED_ORIGINS']?.trim()),
  allowedOrigins: getAllowedOrigins(process.env['ALLOWED_ORIGINS']),
};

export { env, getAllowedOrigins, productionOrigins };
