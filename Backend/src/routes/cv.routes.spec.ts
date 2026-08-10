import assert from 'node:assert/strict';
import test from 'node:test';
import request from 'supertest';

import { createApp } from '../../app';
import { createCvPdf } from '../services/cv-pdf';

test('GET /api/cv should download a generated PDF in the requested language', async () => {
  let receivedLanguage: string | undefined;
  const expectedPdf = Buffer.from('%PDF-generated-test');
  const app = createApp({
    generateCvPdf: async (language?: string) => {
      receivedLanguage = language;
      return expectedPdf;
    }
  });

  const response = await request(app).get('/api/cv?lang=fr');

  assert.equal(response.status, 200);
  assert.equal(receivedLanguage, 'fr');
  assert.match(response.headers['content-type'], /^application\/pdf/);
  assert.equal(
    response.headers['content-disposition'],
    'attachment; filename="Steven-De-Moor-CV.pdf"'
  );
  assert.equal(response.headers['cache-control'], 'no-store');
  assert.deepEqual(response.body, expectedPdf);
});

test('GET /api/cv should return an error when PDF generation fails', async () => {
  const app = createApp({
    generateCvPdf: async () => {
      throw new Error('PDF failure');
    }
  });
  const originalConsoleError = console.error;
  console.error = () => undefined;

  try {
    const response = await request(app).get('/api/cv');

    assert.equal(response.status, 500);
    assert.deepEqual(response.body, { message: 'Unable to generate the CV.' });
  } finally {
    console.error = originalConsoleError;
  }
});

test('the default CV generator should produce a valid PDF from portfolio data', async () => {
  const pdf = await createCvPdf('en');

  assert.equal(pdf.subarray(0, 5).toString(), '%PDF-');
  assert.ok(pdf.length > 1_000);
  assert.match(pdf.subarray(-32).toString(), /%%EOF/);
});
