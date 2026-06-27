import assert from 'node:assert/strict';
import test from 'node:test';
import request from 'supertest';

import { app } from '../../app';

test('GET /api/projects should return a project list', async () => {
  const response = await request(app).get('/api/projects');

  assert.equal(response.status, 200);
  assert.ok(Array.isArray(response.body));
  assert.ok(response.body.length > 0);

  const firstProject = response.body[0];

  assert.equal(typeof firstProject.id, 'string');
  assert.equal(typeof firstProject.title, 'string');
  assert.equal(typeof firstProject.shortLabel, 'string');
  assert.equal(typeof firstProject.category, 'string');
  assert.equal(typeof firstProject.description, 'string');
  assert.ok(Array.isArray(firstProject.technologies));
});

test('GET /api/projects should return localized projects', async () => {
  const response = await request(app).get('/api/projects?lang=fr');

  assert.equal(response.status, 200);
  assert.equal(
    response.body[0].description,
    'Application de portfolio personnelle construite avec Angular et Node.js.'
  );
});
