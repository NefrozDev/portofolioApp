import assert from 'node:assert/strict';
import test from 'node:test';
import express from 'express';
import request from 'supertest';

import { getClientIp, hashClientIp } from './client-ip';

function createIpApp(trustProxyHops: number) {
  const app = express();
  app.set('trust proxy', trustProxyHops);
  app.get('/', (req, res) => {
    res.json({ ip: getClientIp(req) });
  });

  return app;
}

test('getClientIp ignores X-Forwarded-For when no proxy is trusted', async () => {
  const response = await request(createIpApp(0))
    .get('/')
    .set('X-Forwarded-For', '198.51.100.7');

  assert.notEqual(response.body.ip, '198.51.100.7');
  assert.match(response.body.ip, /127\.0\.0\.1|::1/);
});

test('getClientIp ignores addresses prepended by the visitor behind a trusted proxy', async () => {
  const response = await request(createIpApp(1))
    .get('/')
    .set('X-Forwarded-For', '198.51.100.7, 203.0.113.42');

  assert.equal(response.body.ip, '203.0.113.42');
});

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
