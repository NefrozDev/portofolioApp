import { createHmac } from 'node:crypto';
import { Request } from 'express';

class IpHashConfigurationError extends Error {}

// request.ip follows the app's 'trust proxy' setting, so X-Forwarded-For
// is only used when it was written by a trusted proxy.
function getClientIp(request: Request): string | undefined {
  return request.ip || undefined;
}

function hashClientIp(ipAddress: string | undefined): string | undefined {
  if (!ipAddress) {
    return undefined;
  }

  const secret = process.env['IP_HASH_SECRET']?.trim();

  if (!secret) {
    throw new IpHashConfigurationError(
      'IP hashing is not configured. Set IP_HASH_SECRET.'
    );
  }

  return createHmac('sha256', secret).update(ipAddress).digest('hex');
}

export {
  IpHashConfigurationError,
  getClientIp,
  hashClientIp
};
