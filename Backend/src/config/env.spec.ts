import assert from 'node:assert/strict';
import test from 'node:test';

import {
  getAllowedOrigins,
  getTrustProxyHops,
  productionOrigins,
} from '../../config/env';

test('allows both Synapse Engineering production origins by default', () => {
  assert.deepEqual(getAllowedOrigins(), productionOrigins);
});

test('adds configured origins and removes duplicates', () => {
  assert.deepEqual(
    getAllowedOrigins(
      ' http://localhost:4200, https://synapseengineering.dev, '
    ),
    [...productionOrigins, 'http://localhost:4200']
  );
});

test('trusts one proxy on Vercel and none elsewhere by default', () => {
  assert.equal(getTrustProxyHops(undefined, true), 1);
  assert.equal(getTrustProxyHops(undefined, false), 0);
  assert.equal(getTrustProxyHops('not-a-number', false), 0);
});

test('uses the configured number of trusted proxies', () => {
  assert.equal(getTrustProxyHops('2', false), 2);
  assert.equal(getTrustProxyHops('0', true), 0);
});
