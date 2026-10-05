import assert from 'node:assert/strict';
import test from 'node:test';

import { createCvPdf } from './cv-pdf';

const heroCopyX = 212;
const pageRightEdge = 595.28 - 46;

function getLinkRects(pdf: Buffer): number[][] {
  return [...pdf.toString('latin1').matchAll(/\/Subtype \/Link[^>]*?\/Rect \[([^\]]+)\]/g)]
    .map((match) => match[1].trim().split(/\s+/).map(Number));
}

test('the CV hero keeps the email and LinkedIn links on one line, aligned on the 8pt grid', async () => {
  const [emailRect, linkedInRect] = getLinkRects(await createCvPdf('fr'));
  const [emailLeft, emailBottom, emailRight, emailTop] = emailRect;
  const [linkedInLeft, linkedInBottom, linkedInRight, linkedInTop] = linkedInRect;

  assert.equal(emailBottom, linkedInBottom);
  assert.equal(emailTop, linkedInTop);
  assert.ok(emailTop - emailBottom < 16, 'email label should not wrap to a second line');
  assert.ok(linkedInLeft >= emailRight + 24, 'LinkedIn should start after the full email');
  assert.equal((emailLeft - heroCopyX) % 8, 0);
  assert.equal((linkedInLeft - heroCopyX) % 8, 0);
  assert.ok(linkedInRight <= pageRightEdge, 'LinkedIn should stay inside the page margin');
});
