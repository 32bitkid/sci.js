import { resolve } from 'node:path';

import expandTilde from 'expand-tilde';

export const cmdPathParser = (value: string) => resolve(expandTilde(value));
