import { resolve } from 'path';
import expandTilde from 'expand-tilde';

export const cmdPathParser = (value: string) => resolve(expandTilde(value));