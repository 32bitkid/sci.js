import { InvalidArgumentError } from 'commander';

const DITHER_REGEX = /^[[(]?(\d+)[x,:](\d+)[\])]?$/i;

export function cmdDimensionsParser(value: string): [number, number] {
  const result = DITHER_REGEX.exec(value);
  if (!result)
    throw new InvalidArgumentError(`not a dimension. examples: "1x1" "5,6"`);
  const [, sX, sY] = result;
  return [sX, sY].map((it) => parseInt(it, 10)) as [number, number];
}
