import assert from 'node:assert/strict';
import test from 'node:test';
import request from 'supertest';

import { app } from '../../app';

test('GET /api/health should return ok', async () => {
  const response = await request(app).get('/api/health');

  assert.equal(response.status, 200);
  assert.deepEqual(response.body, { ok: true });
});