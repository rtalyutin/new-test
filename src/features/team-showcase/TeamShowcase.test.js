import test from 'node:test';
import assert from 'node:assert/strict';
import { renderToStaticMarkup } from 'react-dom/server';
import React from 'react';
import TestRenderer, { act } from 'react-test-renderer';

import TeamShowcase, { loadTeamShowcaseStyles } from './TeamShowcase.js';
import {
  clearConfigCache,
  getCachedConfig,
  loadConfig,
} from './loadConfig.js';
import { getFollowingIndex, getNextIndex, getPreviousIndex } from './carouselUtils.js';

const countByClassName = (node, className) => {
  if (!node) {
    return 0;
  }

  if (Array.isArray(node)) {
    return node.reduce((acc, child) => acc + countByClassName(child, className), 0);
  }

  if (typeof node === 'string') {
    return 0;
  }

  const nodeClassName = node.props?.className ?? '';
  const ownMatch = nodeClassName.split(' ').includes(className) ? 1 : 0;
  const children = node.children ?? [];

  return ownMatch + countByClassName(children, className);
};

test('loadConfig resolves dataset and caches the result', async () => {
  clearConfigCache();

  const dataset = await loadConfig();
  assert.ok(Array.isArray(dataset), 'конфиг должен быть массивом команд');
  assert.equal(getCachedConfig(), dataset, 'должен заполняться кеш');

  const secondCall = await loadConfig();
  assert.equal(secondCall, dataset, 'повторные вызовы возвращают кешированные данные');
});

test('TeamShowcase renders all teams inside the carousel track after preloading', async () => {
  await loadConfig();
  const data = getCachedConfig();

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

test('TeamShowcase loads config asynchronously when cache is empty', async () => {
  clearConfigCache();

  let renderer;
  await act(async () => {
    renderer = TestRenderer.create(React.createElement(TeamShowcase));
  });

  await act(async () => {
    await loadConfig();
  });

  const tree = renderer.toJSON();
  const resolvedSlideCount = countByClassName(tree, 'team-showcase__slide');
  assert.ok(
    resolvedSlideCount >= (getCachedConfig()?.length ?? 0),
    'после загрузки конфигурации количество слайдов соответствует данным',
  );

  await act(async () => {
    renderer.unmount();
  });
});

test('loadTeamShowcaseStyles resolves only in browser-like environments', async () => {
  delete globalThis.document;
  const serverResult = await loadTeamShowcaseStyles();
  assert.equal(serverResult, false, 'на сервере загрузка стилей пропускается');

  const loaderCalls = [];
  globalThis.document = {};
  const browserResult = await loadTeamShowcaseStyles(() => {
    loaderCalls.push(true);
    return Promise.resolve();
  });
  assert.equal(browserResult, true, 'в браузере стили загружаются');
  assert.equal(loaderCalls.length, 1, 'используется предоставленный загрузчик стилей');

  delete globalThis.document;
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
