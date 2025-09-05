import { InvalidArgumentError } from 'commander';

export const cmdFloatParser =
  ([min, max]: [number, number]) =>
  (value: string): number | false => {
    if (/^\s*f(alse)?\s*$/i.test(value)) return false;
    const parsedValue = parseFloat(value);
    if (Number.isNaN(parsedValue))
      throw new InvalidArgumentError('Not a number.');
    if (parsedValue < min || parsedValue > max)
      throw new InvalidArgumentError(
        `Out of range. Must be between ${min.toLocaleString()} and ${max.toLocaleString()}`,
      );
    return parsedValue;
  };
