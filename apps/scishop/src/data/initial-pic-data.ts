import { DrawCommand } from '@4bitlabs/sci0';
import { EditorCommand } from '../models/EditorCommand.ts';

const nextId = () => Math.random().toString(36).substring(2);

const wrapRawCommand = (cmd: DrawCommand): EditorCommand =>
  ({ id: nextId(), type: cmd[0], commands: [cmd] }) as EditorCommand;

const refData: DrawCommand[] = [];

const data: EditorCommand[] = refData.map(wrapRawCommand);

export default data;
