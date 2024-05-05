import { Command } from 'commander';

import { isResourceType, ResourceType } from '@4bitlabs/sci0';
import { listActionFor } from '../actions';
import { resourceTypeName as names } from './resource-type-name';

export const listCommandForType = (type: ResourceType) =>
  function listCommand(pics: Command): Command {
    pics
      .command('list')
      .alias('ls')
      .action(listActionFor(isResourceType(type)))
      .description(`list all ${names[type]} resources`);
    return pics;
  };
