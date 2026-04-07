import dotaMatchResultsConfig from './config.json';

const DOTA_MAIN_ROUNDS = new Set([
  'Результаты 1-го тура',
  'Результаты 1-го круга',
  'Результаты 2-го круга',
  'Результаты 3-го круга',
]);

const dotaMainMatchResultsConfig = {
  ...dotaMatchResultsConfig,
  rounds: dotaMatchResultsConfig.rounds.filter((round) => DOTA_MAIN_ROUNDS.has(round.title)),
};

export default dotaMainMatchResultsConfig;
