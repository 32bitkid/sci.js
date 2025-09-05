import type { Command, OptionValues } from 'commander';

interface RootOptions extends OptionValues {
  root: string;
  engine: 'sci0' | 'sci01';
}

export const getRootOptions = (cmd: Command): RootOptions => {
  let current: Command = cmd;
  while (current.parent) current = current.parent;
  return current.opts();
};
