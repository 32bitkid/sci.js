import type { Command } from 'commander';

import type { ResourceType } from '@4bitlabs/sci0';
import { cmdIntParser } from './cmd-int-parser.js';
import * as Actions from '../actions/index.js';
import { createMatcherForType } from '../helpers/resource-matchers.js';
import { resourceTypeName as names } from './resource-type-name.js';

export const extractCommandForType = (type: ResourceType) => {
  const matchById = createMatcherForType(type);
  const NAME = names[type];
  return function extractCommand(cmd: Command): Command {
    cmd
      .command('extract')
      .description(
        `extract binary data from resource files for ${NAME} by number`,
      )
      .argument('<num>', `${NAME} resource number`, cmdIntParser)
      .option('-r, --raw', 'disable decompression and preamble', false)
      .action(Actions.createDecodeActionWithMatcher(matchById));

    return cmd;
  };
};
