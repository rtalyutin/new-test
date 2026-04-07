import dotaMatchResultsConfig from './config.json';

const dotaQualMatchResultsConfig = {
  ...dotaMatchResultsConfig,
  rounds: dotaMatchResultsConfig.rounds.filter((round) => round.title !== 'Результаты 1-го круга'),
};

export default dotaQualMatchResultsConfig;
