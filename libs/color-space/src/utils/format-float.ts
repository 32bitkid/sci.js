export const formatFloat = (n: number, digits: number = 3) =>
  parseFloat(n.toFixed(digits)).toString(10);

export const formatPercent = (n: number, digits: number = 1) =>
  `${parseFloat((n * 100).toFixed(digits)).toString(10)}%`;
