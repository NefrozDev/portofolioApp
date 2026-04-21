import assert from 'node:assert/strict';
import test from 'node:test';
import request from 'supertest';

import { app } from '../../app';

test('POST /api/contact should accept a valid payload', async () => {
  const response = await request(app).post('/api/contact').send({
    name: 'Test User',
    email: 'test@example.com',
    message: 'Hello from test.'
  });

  assert.equal(response.status, 200);
  assert.equal(typeof response.body.message, 'string');
});

test('POST /api/contact should reject an invalid payload', async () => {
  const originalWarn = console.warn;
  console.warn = () => {};

  try {
    const response = await request(app).post('/api/contact').send({
      name: '',
      email: '',
      message: ''
    });

    assert.equal(response.status, 400);
    assert.equal(typeof response.body.message, 'string');
  } finally {
    console.warn = originalWarn;
  }
});