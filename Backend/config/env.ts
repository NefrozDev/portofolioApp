const env = {
  port: Number(process.env['PORT']) || 3000,
  allowedOrigins: (process.env['ALLOWED_ORIGINS'] ?? '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean),
};

export { env };
