export const formatFloat = (n: number, digits: number = 3): string =>
  parseFloat(n.toFixed(digits)).toString(10);

export const formatPercent = (n: number, digits: number = 1): string =>
  `${parseFloat((n * 100).toFixed(digits)).toString(10)}%`;
