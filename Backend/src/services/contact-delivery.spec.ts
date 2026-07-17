import assert from 'node:assert/strict';
import test from 'node:test';

import { createContactDelivery } from './contact-delivery';

test('contact delivery sends a plain-text email through Resend', async () => {
  const originalEnvironment = { ...process.env };
  process.env['RESEND_API_KEY'] = 'test-api-key';
  process.env['CONTACT_FROM_EMAIL'] = 'Portfolio <contact@example.com>';
  delete process.env['CONTACT_TO_EMAIL'];
  let request: { input: string; init?: RequestInit } | undefined;
  const fetchRequest = async (input: string | URL | Request, init?: RequestInit) => {
    request = { input: input.toString(), init };
    return new Response(null, { status: 200 });
  };

  try {
    const deliver = createContactDelivery(fetchRequest);
    await deliver({
      name: 'Test User',
      email: 'test@example.com',
      phone: '+32 470 12 34 56',
      message: 'Hello from the portfolio.'
    });

    assert.equal(request?.input, 'https://api.resend.com/emails');
    assert.equal(request?.init?.method, 'POST');
    assert.equal(
      (request?.init?.headers as Record<string, string>)['Authorization'],
      'Bearer test-api-key'
    );

    const body = JSON.parse(request?.init?.body as string);
    assert.equal(body.to[0], 'nvonefroz@gmail.com');
    assert.equal(body.reply_to, 'test@example.com');
    assert.match(body.text, /Hello from the portfolio\./);
  } finally {
    process.env = originalEnvironment;
  }
});

test('contact delivery fails clearly when configuration is absent', async () => {
  const originalEnvironment = { ...process.env };
  delete process.env['RESEND_API_KEY'];
  delete process.env['CONTACT_FROM_EMAIL'];
  delete process.env['CONTACT_TO_EMAIL'];

  try {
    const deliver = createContactDelivery();

    await assert.rejects(
      deliver({ name: 'Test User', message: 'Hello' }),
      /Contact delivery is not configured/
    );
  } finally {
    process.env = originalEnvironment;
  }
});
