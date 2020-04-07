import Operation from '../../operations';

export const enum Type {
  Visual,
  Priority,
  Control,
}

export interface SetCommand {
  operation: Operation.SetLayer;
  layer: Type;
  code: number;
}

export interface DisableCommand {
  operation: Operation.DisableLayer;
  layer: Type;
}

export * as Visual from './visual';
export * as Control from './control';
export * as Priority from './priority';
