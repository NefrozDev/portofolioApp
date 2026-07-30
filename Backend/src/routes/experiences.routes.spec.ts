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
  assert.equal(typeof firstExperience.status, 'string');
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

test('GET /api/experiences should include position statuses and the Akkodis Site Leader role', async () => {
  const response = await request(app).get('/api/experiences');
  const siteLeaderExperience = response.body.find(
    (experience: { id: string }) => experience.id === 'akkodis-pg-site-leader'
  );
  const icGreenExperience = response.body.find(
    (experience: { id: string }) => experience.id === 'icgreen-lead-dev'
  );

  assert.ok(siteLeaderExperience);
  assert.equal(siteLeaderExperience.role, 'Site Leader');
  assert.equal(siteLeaderExperience.status, 'corporate');
  assert.equal(siteLeaderExperience.highlights.length, 4);
  assert.match(siteLeaderExperience.highlights[0], /25 on-site consultants/);
  assert.match(siteLeaderExperience.highlights[1], /onboarding/);
  assert.match(siteLeaderExperience.highlights[2], /new missions/);
  assert.match(siteLeaderExperience.highlights[3], /after-work events/);
  assert.equal(icGreenExperience.status, 'cadre');
  assert.equal(icGreenExperience.company, 'IC-Green');
  assert.ok(icGreenExperience.technologies.includes('Leadership'));
  assert.match(icGreenExperience.highlights[2], /Lead and coordinate development teams/);
  assert.match(icGreenExperience.highlights[3], /connecting multiple robots/);
  assert.match(icGreenExperience.highlights[3], /security, routing, load balancing/);
  assert.match(icGreenExperience.highlights[3], /SQL and NoSQL databases/);
  assert.ok(
    response.body
      .filter(
        (experience: { id: string }) =>
          !['akkodis-pg-site-leader', 'icgreen-lead-dev'].includes(experience.id)
      )
      .every((experience: { status: string }) => experience.status === 'employee')
  );
});

test('GET /api/experiences should keep role titles language-neutral', async () => {
  const response = await request(app).get('/api/experiences?lang=de');

  assert.equal(response.status, 200);
  assert.equal(response.body[0].role, 'Lead Developer');
});

test('GET /api/experiences should include WinDev in the Tihange experience', async () => {
  const response = await request(app).get('/api/experiences');
  const tihangeExperience = response.body.find(
    (experience: { id: string }) => experience.id === 'tihange-software-engineer'
  );

  assert.equal(response.status, 200);
  assert.ok(tihangeExperience);
  assert.ok(tihangeExperience.technologies.includes('WinDev'));
  assert.equal(tihangeExperience.logoUrl, '/img/experiences/engie.svg.webp');
});

test('GET /api/experiences should explain the P&G department acronyms and chemical testing work', async () => {
  const response = await request(app).get('/api/experiences');
  const lfeExperience = response.body.find(
    (experience: { id: string }) => experience.id === 'pg-lfe-consultant'
  );
  const anaSudExperience = response.body.find(
    (experience: { id: string }) => experience.id === 'pg-ana-sud-consultant'
  );

  assert.match(lfeExperience.highlights[0], /Liquid Fabric Enhancers \(LFE\)/);
  assert.match(anaSudExperience.highlights[0], /Analytical \(ANA\)/);
  assert.match(anaSudExperience.highlights[0], /Soluble Unidoses \(SUD\)/);
  assert.match(anaSudExperience.highlights[2], /15 chemical testing methods/);
});

test('GET /api/experiences should describe leadership of the Avanade team project', async () => {
  const response = await request(app).get('/api/experiences');
  const avanadeExperience = response.body.find(
    (experience: { id: string }) => experience.id === 'avanade-academy'
  );

  assert.match(
    avanadeExperience.highlights[2],
    /Led the team project through delivery of the Dynamics 365 solution/
  );
  assert.ok(avanadeExperience.technologies.includes('Leadership'));
});

test('GET /api/experiences should describe the Inforius work as a contribution', async () => {
  const response = await request(app).get('/api/experiences');
  const inforiusExperience = response.body.find(
    (experience: { id: string }) => experience.id === 'inforius-fullstack'
  );

  assert.match(inforiusExperience.highlights[0], /^Worked on a full-stack application/);
  assert.match(inforiusExperience.highlights[1], /^Contributed to/);
  assert.match(inforiusExperience.highlights[2], /^Participated in/);
});
