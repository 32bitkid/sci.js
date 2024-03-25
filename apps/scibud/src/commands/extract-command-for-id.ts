import { Command } from 'commander';

import { cmdIntParser } from './cmd-int-parser';
import * as Actions from '../actions';
import { matchById } from '../helpers/resource-matchers';

export function extractCommandForId(cmd: Command): Command {
  cmd
    .command('extract')
    .description(`extract binary data from resource files for resource by id`)
    .argument('<id>', `the id of the asset to extract`, cmdIntParser)
    .option('-d, --decompress', 'decompress', false)
    .action(Actions.createDecodeActionWithMatcher(matchById));

  return cmd;
}
