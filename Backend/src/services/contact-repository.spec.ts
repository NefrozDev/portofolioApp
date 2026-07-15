import assert from 'node:assert/strict';
import test from 'node:test';

import { createContactRepository } from './contact-repository';

test('contact repository prepares its schema and stores contact details', async () => {
  const queries: Array<{ query: string; parameters?: unknown[] }> = [];
  const repository = createContactRepository(() => ({
    query: async (query, parameters) => {
      queries.push({ query, parameters });
      return query.includes('RETURNING id') ? [{ id: 'stored-id' }] : [];
    }
  }));

  const id = await repository.create({
    contact: {
      name: 'Test User',
      email: 'test@example.com',
      message: 'Hello from test.'
    },
    ipHash: 'a'.repeat(64)
  });

  assert.equal(typeof id, 'string');
  assert.match(queries[0].query, /CREATE TABLE IF NOT EXISTS contact_messages/);
  assert.match(queries[1].query, /CREATE INDEX IF NOT EXISTS/);
  assert.match(queries[2].query, /INSERT INTO contact_messages/);
  assert.equal(queries[2].parameters?.[1], 'Test User');
  assert.equal(queries[2].parameters?.[5], 'a'.repeat(64));
});

test('contact repository rejects a submission when the database limit is reached', async () => {
  const repository = createContactRepository(() => ({
    query: async (query) => query.includes('RETURNING id') ? [] : []
  }));

  await assert.rejects(
    repository.create({
      contact: { name: 'Test User', message: 'Hello from test.' },
      ipHash: 'b'.repeat(64)
    }),
    /rate limit exceeded/
  );
});

test('contact repository marks successful email delivery', async () => {
  const queries: string[] = [];
  const repository = createContactRepository(() => ({
    query: async (query) => {
      queries.push(query);
      return [];
    }
  }));

  await repository.markEmailSent('19d719d6-14b4-4a20-a087-1046242e2430');

  assert.match(queries[2], /email_sent_at = NOW\(\)/);
});
