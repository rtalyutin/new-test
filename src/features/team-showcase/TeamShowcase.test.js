import test from 'node:test';
import assert from 'node:assert/strict';
import { renderToStaticMarkup } from 'react-dom/server';
import React from 'react';

import TeamShowcase from './TeamShowcase.js';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const data = require('./config.json');
import { getFollowingIndex, getNextIndex, getPreviousIndex } from './carouselUtils.js';

test('TeamShowcase renders all teams inside the carousel track', () => {
  const markup = renderToStaticMarkup(React.createElement(TeamShowcase));

  const slideCount = (markup.match(/team-showcase__slide/g) || []).length;
  const indicatorCount = (markup.match(/team-showcase__indicator/g) || []).length;

  assert.equal(slideCount >= data.length, true, 'должно быть не меньше слайдов, чем записей в конфиге');
  assert.equal(indicatorCount >= data.length, true, 'каждой команде соответствует индикатор');

  for (const team of data) {
    assert.ok(
      markup.includes(team.name),
      `Команда ${team.name} должна отображаться в разметке`,
    );
  }
});

test('carousel utils correctly calculate next indices', () => {
  const total = 14;

  assert.equal(getNextIndex(0, 0, total), 0);
  assert.equal(getNextIndex(0, 1, total), 1);
  assert.equal(getNextIndex(13, 2, total), 1);
  assert.equal(getNextIndex(3, -1, total), 2);

  assert.equal(getFollowingIndex(13, total), 0);
  assert.equal(getPreviousIndex(0, total), 13);
  assert.equal(getPreviousIndex(5, total), 4);
});
