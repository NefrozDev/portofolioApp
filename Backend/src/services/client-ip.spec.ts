import assert from 'node:assert/strict';
import test from 'node:test';

import { hashClientIp } from './client-ip';

test('hashClientIp creates a stable keyed hash without retaining the address', () => {
  const originalSecret = process.env['IP_HASH_SECRET'];
  process.env['IP_HASH_SECRET'] = 'test-secret';

  try {
    const firstHash = hashClientIp('203.0.113.42');
    const secondHash = hashClientIp('203.0.113.42');

    assert.equal(firstHash, secondHash);
    assert.equal(firstHash?.length, 64);
    assert.ok(!firstHash?.includes('203.0.113.42'));
  } finally {
    if (originalSecret === undefined) {
      delete process.env['IP_HASH_SECRET'];
    } else {
      process.env['IP_HASH_SECRET'] = originalSecret;
    }
  }
});

test('hashClientIp rejects missing production configuration', () => {
  const originalSecret = process.env['IP_HASH_SECRET'];
  delete process.env['IP_HASH_SECRET'];

  try {
    assert.throws(
      () => hashClientIp('203.0.113.42'),
      /IP hashing is not configured/
    );
  } finally {
    if (originalSecret !== undefined) {
      process.env['IP_HASH_SECRET'] = originalSecret;
    }
  }
});
