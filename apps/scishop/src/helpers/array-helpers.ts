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

export const insertN = <T>(
  source: T[],
  index: number,
  items: T[],
  replace = 0,
): T[] => [
  ...source.slice(0, index),
  ...items,
  ...source.slice(index + Math.max(0, replace)),
];
