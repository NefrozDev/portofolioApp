import assert from 'node:assert/strict';
import test from 'node:test';

import {
  getAllowedOrigins,
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
