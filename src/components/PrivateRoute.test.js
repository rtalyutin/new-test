import assert from 'node:assert/strict';
import { afterEach, test } from 'node:test';
import { createElement } from 'react';
import renderer, { act } from 'react-test-renderer';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import PrivateRoute from './PrivateRoute.js';
import { AuthContext } from '../context/AuthContext.js';

const authValueWithToken = {
  token: 'test-token',
  setToken: () => undefined,
  signOut: () => undefined,
};

const authValueWithoutToken = {
  token: null,
  setToken: () => undefined,
  signOut: () => undefined,
};

let testRenderer;

afterEach(() => {
  if (testRenderer) {
    testRenderer.unmount();
    testRenderer = null;
  }
});

const renderWithAuth = (authValue, initialEntry = '/') => {
  act(() => {
    testRenderer = renderer.create(
      createElement(
        AuthContext.Provider,
        { value: authValue },
        createElement(
          MemoryRouter,
          { initialEntries: [initialEntry] },
          createElement(
            Routes,
            null,
            createElement(
              Route,
              { element: createElement(PrivateRoute) },
              createElement(Route, {
                path: '/',
                element: createElement('div', null, 'Private content'),
              }),
            ),
            createElement(Route, {
              path: '/auth',
              element: createElement('div', null, 'Auth page'),
            }),
          ),
        ),
      ),
    );
  });

  return testRenderer.toJSON();
};

test('redirects to auth page when token is missing', () => {
  const tree = renderWithAuth(authValueWithoutToken);

  assert.ok(Array.isArray(tree?.children) ? tree.children.includes('Auth page') : tree?.children === 'Auth page');
});

test('renders private outlet when token is present', () => {
  const tree = renderWithAuth(authValueWithToken);

  assert.ok(
    Array.isArray(tree?.children)
      ? tree.children.includes('Private content')
      : tree?.children === 'Private content',
  );
});
