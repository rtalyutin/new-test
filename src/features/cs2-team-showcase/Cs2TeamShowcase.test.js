import { assert, test } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import React from 'react';

import Cs2TeamShowcase from './Cs2TeamShowcase.js';
import { clearConfigCache, getCachedConfig, loadConfig } from './loadConfig.js';

test('cs2 loadConfig resolves dataset and caches result', async () => {
  clearConfigCache();

  const dataset = await loadConfig();
  assert.ok(Array.isArray(dataset), 'конфиг должен быть массивом команд');
  assert.equal(getCachedConfig(), dataset, 'кеш должен заполняться');
  assert.ok(dataset.length >= 11, 'должны быть загружены команды CS2');
});

test('Cs2TeamShowcase renders loaded teams', async () => {
  await loadConfig();
  const data = getCachedConfig();

  const markup = renderToStaticMarkup(React.createElement(Cs2TeamShowcase));
  const slideCount = (markup.match(/team-showcase__slide/g) || []).length;

  assert.equal(slideCount >= data.length, true, 'должно быть не меньше слайдов, чем команд');

  assert.ok(markup.includes('Галерея ростеров'), 'заголовок галереи должен рендериться');
});
