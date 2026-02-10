let cachedDataset;
let loadingPromise;

export const getCachedConfig = () => cachedDataset ?? null;

export const clearConfigCache = () => {
  cachedDataset = undefined;
  loadingPromise = undefined;
};

export async function loadConfig() {
  if (cachedDataset) {
    return cachedDataset;
  }

  if (!loadingPromise) {
    loadingPromise = (async () => {
      try {
        let dataset;
        if (typeof document === 'undefined') {
          const { createRequire } = await import('node:module');
          const require = createRequire(import.meta.url);
          dataset = require('./config.json');
        } else {
          const module = await import('./config.json');
          dataset = module.default ?? module;
        }

        cachedDataset = dataset;
        return dataset;
      } catch (error) {
        cachedDataset = undefined;
        loadingPromise = undefined;
        throw error;
      }
    })();
  }

  return loadingPromise;
}
