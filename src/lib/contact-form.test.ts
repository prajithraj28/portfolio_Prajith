import test from 'node:test';
import assert from 'node:assert/strict';

import { validateContactForm } from './contact-form.ts';

test('valid contact payload passes validation', () => {
  const result = validateContactForm({
    name: 'Jane Doe',
    email: 'jane@example.com',
    message: 'Hello there',
  });

  assert.deepEqual(result, { ok: true, error: null });
});

test('missing required contact fields fail validation', () => {
  const result = validateContactForm({
    name: '',
    email: 'not-an-email',
    message: '',
  });

  assert.deepEqual(result, {
    ok: false,
    error: 'Name is required, a valid email is required, and a message is required.',
  });
});
