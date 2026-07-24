import assert from 'node:assert/strict';
import test from 'node:test';
import request from 'supertest';

import { app } from '../../app';

test('GET /api/experiences should return an experience list', async () => {
  const response = await request(app).get('/api/experiences');

  assert.equal(response.status, 200);
  assert.ok(Array.isArray(response.body));
  assert.ok(response.body.length > 0);

  const firstExperience = response.body[0];

  assert.equal(typeof firstExperience.id, 'string');
  assert.equal(typeof firstExperience.company, 'string');
  assert.equal(typeof firstExperience.role, 'string');
  assert.equal(typeof firstExperience.period, 'string');
  assert.ok(Array.isArray(firstExperience.technologies));
  assert.ok(Array.isArray(firstExperience.highlights));
  assert.equal(
    firstExperience.recommendationLetterUrl,
    '/documents/recommendations/ic-green.pdf'
  );
  assert.ok(
    response.body.every(
      (experience: { recommendationLetterUrl?: unknown }) =>
        experience.recommendationLetterUrl === undefined ||
        typeof experience.recommendationLetterUrl === 'string'
    )
  );
});

test('GET /api/experiences should keep role titles language-neutral', async () => {
  const response = await request(app).get('/api/experiences?lang=de');

  assert.equal(response.status, 200);
  assert.equal(response.body[0].role, 'Lead Developer');
});
