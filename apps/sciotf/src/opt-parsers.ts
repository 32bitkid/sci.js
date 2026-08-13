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

export const parseAspectRatio = (
  val: unknown,
): [[number, number], 'AC' | 'PX'] => {
  if (val === undefined || val === null || val === '') return [[1, 1.2], 'AC'];
  if (typeof val === 'string') {
    if (val.toLocaleLowerCase() === '1:1') return [[1, 1], 'PX'];
    if (val.toLocaleLowerCase() === '5:6') return [[1, 1.2], 'AC'];
  }
  panic('--aspect-ratio must be "1:1" or "5:6"');
};
