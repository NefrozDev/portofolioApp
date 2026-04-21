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
});