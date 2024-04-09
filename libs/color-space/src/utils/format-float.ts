export const formatFloat = (n: number, digits: number = 3) =>
  parseFloat(n.toFixed(digits)).toString(10);
