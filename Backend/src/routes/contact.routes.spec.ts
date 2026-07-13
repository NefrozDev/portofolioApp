import assert from 'node:assert/strict';
import test from 'node:test';
import request from 'supertest';

import { Contact } from '../../../Common/models/contact.model';
import { createApp } from '../../app';

test('POST /api/contact delivers a normalized valid payload', async () => {
  let deliveredContact: Contact | undefined;
  const app = createApp({
    deliverContactMessage: async (contact) => {
      deliveredContact = contact;
    }
  });

  const response = await request(app).post('/api/contact').send({
    name: '  Test User  ',
    email: 'test@example.com',
    phone: '+32 470 12 34 56',
    message: '  Hello from test.  '
  });

  assert.equal(response.status, 200);
  assert.equal(typeof response.body.message, 'string');
  assert.deepEqual(deliveredContact, {
    name: 'Test User',
    email: 'test@example.com',
    phone: '+32 470 12 34 56',
    message: 'Hello from test.'
  });
});

test('POST /api/contact returns localized feedback', async () => {
  const app = createApp({ deliverContactMessage: async () => {} });
  const response = await request(app).post('/api/contact?lang=nl').send({
    name: 'Test User',
    message: 'Hello from test.'
  });

  assert.equal(response.status, 200);
  assert.equal(response.body.message, 'Uw bericht is verzonden.');
});

test('POST /api/contact rejects malformed contact details', async () => {
  const app = createApp({ deliverContactMessage: async () => {} });
  const response = await request(app).post('/api/contact').send({
    name: 'Test User',
    email: 'not-an-email',
    message: 'Hello from test.'
  });

  assert.equal(response.status, 400);
  assert.equal(typeof response.body.message, 'string');
});

test('POST /api/contact reports delivery failures without exposing details', async () => {
  const originalError = console.error;
  console.error = () => {};
  const app = createApp({
    deliverContactMessage: async () => {
      throw new Error('Provider response containing a secret');
    }
  });

  try {
    const response = await request(app).post('/api/contact').send({
      name: 'Test User',
      message: 'Hello from test.'
    });

    assert.equal(response.status, 502);
    assert.deepEqual(Object.keys(response.body), ['message']);
  } finally {
    console.error = originalError;
  }
});
