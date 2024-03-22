import { InvalidArgumentError } from 'commander';

export function cmdIntParser(value: string): number | false {
  if (/^\s*f(alse)?\s*$/i.test(value)) return false;
  const parsedValue = parseInt(value, 10);
  if (isNaN(parsedValue)) throw new InvalidArgumentError('Not a number.');
  return parsedValue;
}