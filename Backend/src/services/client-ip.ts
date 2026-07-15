import { createHmac } from 'node:crypto';
import { Request } from 'express';

class IpHashConfigurationError extends Error {}

function getClientIp(request: Request): string | undefined {
  const forwardedFor = request.headers['x-forwarded-for'];

  if (typeof forwardedFor === 'string') {
    return forwardedFor.split(',')[0]?.trim() || undefined;
  }

  if (Array.isArray(forwardedFor)) {
    return forwardedFor[0]?.split(',')[0]?.trim() || undefined;
  }

  return request.socket.remoteAddress;
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
