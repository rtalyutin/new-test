let dataset;

if (typeof document === 'undefined') {
  const { createRequire } = await import('node:module');
  const require = createRequire(import.meta.url);
  dataset = require('./config.json');
} else {
  const module = await import('./config.json');
  dataset = module.default ?? module;
}

export default dataset;
