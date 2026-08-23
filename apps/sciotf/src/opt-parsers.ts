import { panic } from './utils/ensure-exists.js';

export const parseEngine = (val: unknown): 'sci0' | 'sci01' => {
  if (val === undefined || val === null || val === '') return 'sci0';
  if (typeof val === 'string') {
    if (val.toLocaleLowerCase() === 'sci0') return 'sci0';
    if (val.toLocaleLowerCase() === 'sci01') return 'sci01';
  }
  panic('--engine must be "sci0" or "sci01"');
};

export const parseId = (val: string): number => {
  const num = Number.parseInt(val, 10);
  if (Number.isNaN(num)) panic('<num> must be a number');
  return num;
};

export const parseAspectRatio = (val: unknown): [number, number] => {
  if (val === undefined || val === null || val === '') return [1, 1.2];
  if (typeof val === 'string') {
    if (val.toLocaleLowerCase() === '1:1') return [1, 1];
    if (val.toLocaleLowerCase() === '1:1.2') return [1, 1.2];
    if (val.toLocaleLowerCase() === '5:6') return [1, 1.2];
  }
  panic('--aspect-ratio must be "1:1", "1:1.2" or "5:6"');
};

export const getAspectRatioString = (aspectRatio: [number, number]): string => {
  if (aspectRatio[0] !== 1) return '??';
  return aspectRatio[1] === 1 ? 'PX' : aspectRatio[1] === 1.2 ? 'AC' : '??';
};

export const parseChamfer = (
  val: unknown,
  defaultVal: 'none' | 'inside' | 'outside' | 'both' = 'both',
): 'none' | 'inside' | 'outside' | 'both' => {
  if (val === undefined || val === null || val === '') return defaultVal;
  if (typeof val === 'string') {
    if (val === 'inside') return val;
    if (val === 'outside') return val;
    if (val === 'both') return val;
    if (val === 'none') return val;
  }
  panic('--chamfer must be "none", "inside", "outside", or "both"');
};
