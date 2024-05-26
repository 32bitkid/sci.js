export const insert = <T>(
  source: T[],
  index: number,
  item: T,
  replaceAtIndex = false,
): T[] => [
  ...source.slice(0, index),
  item,
  ...source.slice(replaceAtIndex ? index + 1 : index),
];
