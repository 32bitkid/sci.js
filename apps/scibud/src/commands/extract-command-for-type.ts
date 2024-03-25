import { Command } from 'commander';

import { type ResourceType } from '@4bitlabs/sci0';
import * as Actions from '../actions';
import { cmdIntParser } from './cmd-int-parser';
import { resourceTypeName as names } from './resource-type-name';
import { createMatcherForType } from '../helpers/resource-matchers';

export const extractCommandForType = (type: ResourceType) => {
  const NAME = names[type];
  const matchTypeById = createMatcherForType(type);
  return function decodeCommand(cmd: Command): Command {
    cmd
      .command('extract')
      .description(`extract binary data from resource files for ${NAME} by id`)
      .argument('<id>', `${NAME} resource number`, cmdIntParser)
      .option('-d, --decompress', 'decompress', false)
      .action(Actions.createDecodeActionWithMatcher(matchTypeById));

    return cmd;
  };
};
