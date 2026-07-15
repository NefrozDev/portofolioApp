const env = {
  port: Number(process.env['PORT']) || 3000,
  isVercel: Boolean(process.env['VERCEL']),
  allowedOrigins: (process.env['ALLOWED_ORIGINS'] ?? '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean),
};

export { env };
