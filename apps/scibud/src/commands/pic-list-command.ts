import { Command } from 'commander';

import * as Actions from '../actions';

export function picListCommand(pics: Command): Command {
  pics.command('list').action(Actions.picList).description('list all pics');
  return pics;
}
