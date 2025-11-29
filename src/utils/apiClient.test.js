import assert from 'node:assert/strict';
import { test } from 'node:test';
import { prepareRequestInit } from './apiClient.js';

test('adds Authorization header when token is provided', () => {
  const requestInit = prepareRequestInit({}, 'secret-token');

  assert.equal(requestInit.headers.get('Authorization'), 'Bearer secret-token');
});

test('does not set Authorization header when token is missing', () => {
  const requestInit = prepareRequestInit({ headers: { 'Content-Type': 'application/json' } });

  assert.equal(requestInit.headers.get('Authorization'), null);
  assert.equal(requestInit.headers.get('Content-Type'), 'application/json');
});

test('preserves existing headers when enriching request', () => {
  const initialHeaders = new Headers({
    'Content-Type': 'application/json',
    Accept: 'application/json',
  });

  const requestInit = prepareRequestInit({ headers: initialHeaders }, 'another-token');

  assert.equal(requestInit.headers.get('Authorization'), 'Bearer another-token');
  assert.equal(requestInit.headers.get('Content-Type'), 'application/json');
  assert.equal(requestInit.headers.get('Accept'), 'application/json');
});
